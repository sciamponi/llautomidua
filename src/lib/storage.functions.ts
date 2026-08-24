import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const uploadSiteAsset = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, category: 'logo' | 'photo' | 'preview', fileName: string, fileData: string }) => data)
  .handler(async ({ data }) => {
    console.log(`[StorageProvider] Uploading ${data.fileName} to ${data.category} for order ${data.orderId}`);
    
    // Em produção, isso usaria Cloudflare R2 / S3 / Local Filesystem
    const url = `https://storage.automatiza.com/orders/${data.orderId}/${data.category}/${data.fileName}`;
    
    return { success: true, url };
  });
