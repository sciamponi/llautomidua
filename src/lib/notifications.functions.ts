import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/lib/prisma.server";

export type NotificationChannel = 'WHATSAPP' | 'EMAIL';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'SIMULATED';

const notificationSchema = z.object({
  orderId: z.string(),
  event: z.string(),
  channel: z.enum(['WHATSAPP', 'EMAIL']),
  recipient: z.string(),
  message: z.string(),
  isSimulation: z.boolean().default(true),
  idempotencyKey: z.string().optional()
});

export const prepareNotification = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof notificationSchema>) => data)
  .handler(async ({ data }) => {
    console.log(`[NotificationEngine] Preparing ${data.channel} to ${data.recipient} for event ${data.event}`);
    
    // In production, templates would be rendered here
    const preview = {
      ...data,
      renderedMessage: data.message, // Template logic would go here
      status: data.isSimulation ? 'SIMULATED' : 'PENDING'
    };

    return { success: true, preview };
  });

export const sendNotification = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof notificationSchema> & { status: NotificationStatus }) => data)
  .handler(async ({ data }) => {
    console.log(`[NotificationEngine] Executing ${data.channel} to ${data.recipient}`);
    
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const finalStatus = data.isSimulation ? 'SIMULATED' : 'SENT';

    await prisma.notificationLog.create({
      data: {
        orderId: data.orderId,
        event: data.event,
        channel: data.channel as any,
        recipient: data.recipient,
        message: data.message,
        status: finalStatus as any,
        sentAt: new Date()
      }
    });

    return { success: true, status: finalStatus };
  });

export const getNotificationLogs = createServerFn({ method: "GET" })
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    return await prisma.notificationLog.findMany({
      where: { orderId },
      orderBy: { sentAt: 'desc' }
    });
  });

