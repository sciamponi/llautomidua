import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomBytes } from "crypto";

// Tipos baseados no schema do Prisma
export type SiteOrderStatus = 'SUBMITTED' | 'DATA_REVIEW' | 'IN_PRODUCTION' | 'WAITING_APPROVAL' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED';
export type SiteOrderVersionStatus = 'DRAFT' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

const generateToken = () => {
  const token = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, status: SiteOrderStatus, comment?: string, actorId?: string, responsibleUserId?: string }) => data)
  .handler(async ({ data }) => {
    console.log(`[API] Updating order ${data.orderId} to ${data.status} by ${data.actorId}`);
    
    // In production:
    // const { prisma } = await import('@/lib/prisma.server');
    // await prisma.siteOrderHistory.create({
    //   data: {
    //     orderId: data.orderId,
    //     toStatus: data.status,
    //     changedBy: data.actorId,
    //     responsibleUserId: data.responsibleUserId,
    //     comment: data.comment
    //   }
    // });
    // await prisma.siteOrder.update({
    //   where: { id: data.orderId },
    //   data: { status: data.status, responsibleUserId: data.responsibleUserId }
    // });
    
    return { success: true };
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
    console.log(`[API] Creating immutable version ${data.versionNumber} for order ${data.orderId}`);
    
    // In production:
    // const { prisma } = await import('@/lib/prisma.server');
    // const newVersion = await prisma.siteOrderVersion.create({
    //   data: {
    //     orderId: data.orderId,
    //     version: data.versionNumber,
    //     versionNumber: data.versionNumber,
    //     contentSnapshot: data.contentSnapshot,
    //     previewUrl: data.previewUrl,
    //     notes: data.notes,
    //     status: data.publish ? 'APPROVED' : 'DRAFT',
    //     createdBy: data.createdBy,
    //     publishedAt: data.publish ? new Date() : null
    //   }
    // });
    
    return { success: true };
  });

export const requestApproval = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, versionId: string, expiresDays?: number }) => data)
  .handler(async ({ data }) => {
    const { token, hash } = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresDays || 7));
    
    console.log(`[API] Requesting approval for order ${data.orderId} version ${data.versionId}`);
    
    // In production:
    // const { prisma } = await import('@/lib/prisma.server');
    // await prisma.approvalRequest.create({
    //   data: {
    //     orderId: data.orderId,
    //     orderVersionId: data.versionId,
    //     tokenHash: hash,
    //     expiresAt,
    //     status: 'PENDING'
    //   }
    // });
    
    const approvalUrl = `http://localhost:8080/cliente/sites/aprovacao/${token}`;
    
    return { success: true, approvalUrl, token };
  });

export const processApproval = createServerFn({ method: "POST" })
  .validator((data: { token: string, approved: boolean, feedback?: string }) => data)
  .handler(async ({ data }) => {
    const hash = createHash('sha256').update(data.token).digest('hex');
    
    console.log(`[API] Processing approval for token hash ${hash}`);
    
    // 1. Buscar ApprovalRequest pelo hash
    // 2. Validar expiração e status PENDING
    // 3. Atualizar SiteOrder, SiteOrderVersion e SiteOrderHistory
    
    return { success: true, status: data.approved ? 'APPROVED' : 'CHANGES_REQUESTED' };
  });

export const getSiteOrderDetails = createServerFn({ method: "GET" })
  .validator((data: string) => data) // orderId
  .handler(async ({ data: orderId }) => {
    return {
      id: orderId,
      businessName: "Ar-Condicionado Central",
      responsibleName: "João Silva",
      status: "IN_PRODUCTION" as SiteOrderStatus,
      priority: "NORMAL",
      createdAt: new Date(Date.now() - 86400000),
      versions: [],
      history: [],
      internalNotes: [],
      notifications: []
    };
  });
