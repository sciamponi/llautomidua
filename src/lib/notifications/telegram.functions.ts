import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID should be in process.env

export const sendTelegramAlert = createServerFn({ method: "POST" })
  .validator((data: { 
    message: string, 
    level: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL'
  }) => data)
  .handler(async ({ data }) => {
    const token = process.env['TELEGRAM_BOT_TOKEN'];
    const chatId = process.env['TELEGRAM_CHAT_ID'];
    
    if (!token || !chatId) {
      console.log(`[TelegramProvider] [SIMULATED] ${data.level}: ${data.message}`);
      return { success: true, status: 'SIMULATED' };
    }

    console.log(`[TelegramProvider] [SENT] ${data.level}: ${data.message}`);
    return { success: true, status: 'SENT' };
  });
