import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma.server";

// Tipos baseados no schema do Prisma
export type SiteOrderStatus = 'SUBMITTED' | 'DATA_REVIEW' | 'IN_PRODUCTION' | 'WAITING_APPROVAL' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED';
export type SiteOrderVersionStatus = 'DRAFT' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type PaymentStatus = 'PENDING' | 'PROOF_SUBMITTED' | 'UNDER_REVIEW' | 'PAID' | 'REJECTED' | 'CANCELLED' | 'FAILED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

const generateToken = () => {
  const token = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((data: { 
    orderId: string, 
    status: SiteOrderStatus, 
    comment?: string, 
    actorId?: string, 
    responsibleUserId?: string,
    paymentStatus?: PaymentStatus,
    price?: number
  }) => data)
  .handler(async ({ data }) => {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.siteOrder.findUnique({
        where: { id: data.orderId },
        select: { status: true, paymentStatus: true, price: true }
      });

      if (!order) throw new Error("Order not found");

      const updateData: any = { 
        status: data.status,
        updatedAt: new Date()
      };

      if (data.responsibleUserId) updateData.responsibleUserId = data.responsibleUserId;
      if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
      if (data.price !== undefined) updateData.price = data.price;

      await tx.siteOrder.update({
        where: { id: data.orderId },
        data: updateData
      });

      await tx.siteOrderHistory.create({
        data: {
          orderId: data.orderId,
          fromStatus: order.status,
          toStatus: data.status,
          fromPaymentStatus: order.paymentStatus,
          toPaymentStatus: data.paymentStatus || order.paymentStatus,
          priceAtMoment: data.price !== undefined ? data.price : order.price,
          changedBy: data.actorId,
          responsibleUserId: data.responsibleUserId,
          comment: data.comment
        }
      });

      return { success: true };
    });
  });

export const createImmutableVersion = createServerFn({ method: "POST" })
  .validator((data: { 
    orderId: string, 
    contentSnapshot: any, 
    previewUrl: string, 
    notes?: string, 
    versionNumber: number, 
    createdBy?: string,
    publish?: boolean
  }) => data)
  .handler(async ({ data }) => {
    return await prisma.siteOrderVersion.create({
      data: {
        orderId: data.orderId,
        version: data.versionNumber,
        versionNumber: data.versionNumber,
        contentSnapshot: data.contentSnapshot,
        previewUrl: data.previewUrl,
        notes: data.notes,
        status: data.publish ? 'APPROVED' : 'DRAFT',
        createdBy: data.createdBy,
        publishedAt: data.publish ? new Date() : null
      }
    });
  });

export const requestApproval = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, versionId: string, expiresDays?: number }) => data)
  .handler(async ({ data }) => {
    const { token, hash } = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresDays || 7));
    
    await prisma.approvalRequest.create({
      data: {
        orderId: data.orderId,
        orderVersionId: data.versionId,
        tokenHash: hash,
        expiresAt,
        status: 'PENDING'
      }
    });
    
    const approvalUrl = `/sites/aprovacao/${token}`;
    
    return { success: true, approvalUrl, token };
  });

export const processApproval = createServerFn({ method: "POST" })
  .validator((data: { token: string, approved: boolean, feedback?: string }) => data)
  .handler(async ({ data }) => {
    const hash = createHash('sha256').update(data.token).digest('hex');
    
    return await prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.findUnique({
        where: { tokenHash: hash },
        include: { orderVersion: true }
      });

      if (!request || request.status !== 'PENDING') {
        throw new Error("Invalid or expired approval request");
      }

      if (request.expiresAt && request.expiresAt < new Date()) {
        await tx.approvalRequest.update({
          where: { id: request.id },
          data: { status: 'EXPIRED' }
        });
        throw new Error("Approval request expired");
      }

      const newStatus = data.approved ? 'APPROVED' : 'CHANGES_REQUESTED';
      const versionStatus = data.approved ? 'APPROVED' : 'REJECTED';

      await tx.approvalRequest.update({
        where: { id: request.id },
        data: { 
          status: newStatus as any, 
          feedback: data.feedback ?? null,
          usedAt: new Date()
        }
      });

      await tx.siteOrder.update({
        where: { id: request.orderId },
        data: { status: newStatus as any }
      });

      await tx.siteOrderVersion.update({
        where: { id: request.orderVersionId },
        data: { status: versionStatus as any }
      });

      await tx.siteOrderHistory.create({
        data: {
          orderId: request.orderId,
          toStatus: newStatus as any,
          comment: data.feedback || (data.approved ? "Aprovado pelo cliente" : "Ajustes solicitados pelo cliente")
        }
      });

      return { success: true, status: newStatus };
    });
  });

export const getSiteOrderDetails = createServerFn({ method: "GET" })
  .validator((data: string) => data) // orderId
  .handler(async ({ data: orderId }) => {
    const order = await prisma.siteOrder.findUnique({
      where: { id: orderId },
      include: {
        template: true,
        history: { orderBy: { createdAt: 'desc' } },
        versions: { orderBy: { createdAt: 'desc' } },
        files: { orderBy: { uploadedAt: 'desc' } },
        internalNotes: { orderBy: { createdAt: 'desc' } },
        notifications: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!order) throw new Error("Order not found");

    return order;
  });

export const getOrdersForKanban = createServerFn({ method: "GET" })
  .handler(async () => {
    return await prisma.siteOrder.findMany({
      include: {
        template: true,
        user: { select: { name: true, email: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  });

export const updatePaymentStatus = createServerFn({ method: "POST" })
  .validator((data: { 
    paymentId: string, 
    status: PaymentStatus, 
    rejectionReason?: string,
    actorId?: string 
  }) => data)
  .handler(async ({ data }) => {
    return await prisma.payment.update({
      where: { id: data.paymentId },
      data: { 
        status: data.status,
        rejectionReason: data.rejectionReason ?? null,
        updatedAt: new Date()
      }
    });
  });

export const createPayment = createServerFn({ method: "POST" })
  .validator((data: { 
    orderId: string, 
    amount: number, 
    method: PaymentMethod,
    proofUrl?: string 
  }) => data)
  .handler(async ({ data }) => {
    return await prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: data.proofUrl ? 'PROOF_SUBMITTED' : 'PENDING',
        proofUrl: data.proofUrl ?? null
      }
    });
  });

export const getPaymentConfig = createServerFn({ method: "GET" })
  .handler(async () => {
    return {
      pixEnabled: true,
      pixKey: "000.000.000-00",
      receiverName: "Automatiza Soluções LTDA",
      instructions: "Transferência via PIX. O site entrará em publicação após a confirmação.",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=automatiza-pix-payload"
    };
  });



