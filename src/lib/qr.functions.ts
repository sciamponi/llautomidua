import { createServerFn } from "@tanstack/react-start";
import QRCode from "qrcode";
import { prisma } from "./prisma.server";
import { getAdminUserInternal } from "./auth";

export const generateQrCode = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (typeof data !== "string") throw new Error("Campaign id required");
    return data;
  })
  .handler(async ({ data: campaignId }) => {
    const admin = await getAdminUserInternal();
    if (!admin) throw new Error("Não autorizado");

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error("Campanha não encontrada");
    }

    const baseUrl = process.env["APP_URL"] || "http://localhost:3000";
    const captureUrl = `${baseUrl}/captura/${campaign.id}`;

    const qrDataUrl = await QRCode.toDataURL(captureUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    return { qrDataUrl, captureUrl };
  });
