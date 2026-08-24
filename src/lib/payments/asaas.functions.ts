import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// This will eventually call Asaas API
// ASAAS_API_KEY should be in process.env

export const createAsaasPayment = createServerFn({ method: "POST" })
  .validator((data: { 
    orderId: string, 
    customerName: string, 
    customerEmail: string, 
    customerCpfCnpj: string,
    amount: number,
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
  }) => data)
  .handler(async ({ data }) => {
    console.log(`[AsaasProvider] Creating ${data.billingType} payment for ${data.customerName}`);
    
    // Simulate API call
    return { 
      success: true, 
      invoiceUrl: "https://sandbox.asaas.com/i/simulate-invoice",
      bankSlipUrl: data.billingType === 'BOLETO' ? "https://sandbox.asaas.com/b/simulate-slip" : null,
      pixQrCode: data.billingType === 'PIX' ? "simulate-pix-payload" : null
    };
  });
