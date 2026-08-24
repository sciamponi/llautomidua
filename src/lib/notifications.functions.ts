import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type NotificationChannel = 'WHATSAPP' | 'EMAIL';

const notificationSchema = z.object({
  orderId: z.string(),
  event: z.string(),
  channel: z.enum(['WHATSAPP', 'EMAIL']),
  recipient: z.string(),
  message: z.string(),
  idempotencyKey: z.string().optional()
});

export const sendNotification = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof notificationSchema>) => data)
  .handler(async ({ data }) => {
    console.log(`[NotificationEngine] Sending ${data.channel} to ${data.recipient} for event ${data.event}`);
    
    // Simulação de delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Registro no banco de dados viria aqui via Prisma
    const logEntry = {
      id: `log_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      status: 'SENT' as const,
      sentAt: new Date()
    };

    return { success: true, logEntry };
  });

export const getNotificationLogs = createServerFn({ method: "GET" })
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    return []; // Mock
  });
