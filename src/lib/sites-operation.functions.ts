import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/lib/prisma.server";
import { authMiddleware, roleMiddleware } from "./auth.middleware";
import { SiteOrderStatus, PaymentStatus } from "@prisma/client";

export const getOrdersForKanban = createServerFn({ method: "GET" })
  .middleware([roleMiddleware(["MASTER_ADMIN", "ADMIN", "OPERATOR"])])
  .handler(async () => {
    if (!process.env['DATABASE_URL']) return [];
    try {
      const orders = await prisma.siteOrder.findMany({
        include: {
          template: true,
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { updatedAt: 'desc' }
      });
      return JSON.parse(JSON.stringify(orders));
    } catch (error) {
      console.error('getOrdersForKanban failed:', error);
      return [];
    }
  });

export const getClientOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!process.env['DATABASE_URL']) return [];
    const { session } = context as any;
    try {
      const orders = await prisma.siteOrder.findMany({
        where: { userId: session.user.id },
        include: {
          template: true
        },
        orderBy: { updatedAt: 'desc' }
      });
      return JSON.parse(JSON.stringify(orders));
    } catch (error) {
      console.error('getClientOrders failed:', error);
      return [];
    }
  });


export const getSiteOrderDetails = createServerFn({ method: "GET" })
  .validator((data: unknown) => String(data))
  .middleware([authMiddleware])
  .handler(async ({ data: orderId }) => {
    if (!process.env['DATABASE_URL']) return null;
    const order = await prisma.siteOrder.findUnique({
      where: { id: orderId },
      include: {
        template: true,
        user: true,
        history: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } }
      }
    });
    return JSON.parse(JSON.stringify(order));
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    orderId: z.string(),
    status: z.nativeEnum(SiteOrderStatus),
    comment: z.string().optional()
  }).parse(data))
  .middleware([roleMiddleware(["MASTER_ADMIN", "ADMIN", "OPERATOR"])])
  .handler(async ({ data }) => {
    if (!process.env['DATABASE_URL']) return null;
    
    const oldOrder = await prisma.siteOrder.findUnique({ where: { id: data.orderId } });
    
    const order = await prisma.siteOrder.update({
      where: { id: data.orderId },
      data: { 
        status: data.status,
        history: {
          create: {
            fromStatus: oldOrder?.status || SiteOrderStatus.SUBMITTED,
            toStatus: data.status,
            comment: data.comment || ""
          }
        }
      }
    });

    return JSON.parse(JSON.stringify(order));
  });

export const updatePaymentStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    paymentId: z.string(),
    status: z.nativeEnum(PaymentStatus),
    rejectionReason: z.string().optional()
  }).parse(data))
  .middleware([roleMiddleware(["MASTER_ADMIN", "ADMIN", "OPERATOR"])])
  .handler(async ({ data }) => {
    if (!process.env['DATABASE_URL']) return null;
    
    const updateData: any = {
      status: data.status,
      rejectionReason: data.rejectionReason || "",
    };

    if (data.status === PaymentStatus.PAID) {
      updateData.order = {
        update: { paymentStatus: PaymentStatus.PAID }
      };
    }

    const payment = await prisma.payment.update({
      where: { id: data.paymentId },
      data: updateData
    });

    return JSON.parse(JSON.stringify(payment));
  });

export const processApproval = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
     token: z.string(),
     approved: z.boolean(),
     feedback: z.string().optional()
  }).parse(data))
  .handler(async ({ data }) => {
     return { success: true };
  });

export { SiteOrderStatus, PaymentStatus };
