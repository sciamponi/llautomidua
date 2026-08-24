import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomBytes } from "crypto";

// Tipos baseados no schema do Prisma (serão importados do client em produção)
export type SiteOrderStatus = 'SUBMITTED' | 'DATA_REVIEW' | 'IN_PRODUCTION' | 'WAITING_APPROVAL' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED';
export type SiteOrderVersionStatus = 'DRAFT' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

// Helper para gerar token e hash
const generateToken = () => {
  const token = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, status: SiteOrderStatus, comment?: string, userId?: string }) => data)
  .handler(async ({ data }) => {
    // Aqui viria a lógica do Prisma
    console.log(`[API] Updating order ${data.orderId} to ${data.status}`);
    
    // Simulação de histórico
    const historyEntry = {
      orderId: data.orderId,
      toStatus: data.status,
      comment: data.comment,
      changedBy: data.userId,
      createdAt: new Date()
    };

    // Lógica de Eventos/Notificações seria disparada aqui
    
    return { success: true, historyEntry };
  });

export const createSiteVersion = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, previewUrl: string, previewImage?: string, notes?: string, versionNumber: number, createdBy?: string }) => data)
  .handler(async ({ data }) => {
    console.log(`[API] Creating version ${data.versionNumber} for order ${data.orderId}`);
    
    const newVersion = {
      id: `v_${Math.random().toString(36).substr(2, 9)}`,
      orderId: data.orderId,
      version: data.versionNumber,
      previewUrl: data.previewUrl,
      previewImage: data.previewImage,
      notes: data.notes,
      status: 'DRAFT' as SiteOrderVersionStatus,
      createdAt: new Date(),
      createdBy: data.createdBy
    };

    return { success: true, version: newVersion };
  });

export const requestApproval = createServerFn({ method: "POST" })
  .validator((data: { orderId: string, versionId: string }) => data)
  .handler(async ({ data }) => {
    const { token, hash } = generateToken();
    
    console.log(`[API] Requesting approval for order ${data.orderId} version ${data.versionId}`);
    
    // Salvar ApprovalRequest com hash
    // Atualizar status da ordem e versão para WAITING_APPROVAL
    
    const approvalUrl = `http://localhost:8080/sites/aprovacao/${token}`;
    
    return { success: true, approvalUrl, token };
  });

export const processApproval = createServerFn({ method: "POST" })
  .validator((data: { token: string, approved: boolean, feedback?: string }) => data)
  .handler(async ({ data }) => {
    const hash = createHash('sha256').update(data.token).digest('hex');
    
    console.log(`[API] Processing approval for token hash ${hash}`);
    
    // 1. Buscar ApprovalRequest pelo hash
    // 2. Validar expiração e status PENDING
    // 3. Se aprovado:
    //    - ApprovalRequest.status = APPROVED
    //    - SiteOrderVersion.status = APPROVED
    //    - SiteOrder.status = APPROVED
    // 4. Se ajustes:
    //    - ApprovalRequest.status = CHANGES_REQUESTED
    //    - SiteOrder.status = CHANGES_REQUESTED
    //    - SiteOrderVersion.status = REJECTED
    //    - Salvar feedback no request
    
    return { success: true, status: data.approved ? 'APPROVED' : 'CHANGES_REQUESTED' };
  });

export const getSiteOrderDetails = createServerFn({ method: "GET" })
  .validator((data: string) => data) // orderId
  .handler(async ({ data: orderId }) => {
    // Mock de retorno detalhado
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
