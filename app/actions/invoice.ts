"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 1. Get all invoices for the logged-in tenant
export async function getTenantInvoices() {
  try {
    const cookieStore = await cookies();
    const tenantUserId = cookieStore.get("rentflow_session")?.value;
    if (!tenantUserId) return [];

    const tenant = await prisma.tenant.findUnique({ where: { userId: tenantUserId } });
    if (!tenant) return [];

    return await prisma.invoice.findMany({
      where: { tenantId: tenant.id },
      include: { room: { include: { property: true } } },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    return [];
  }
}

// 2. Get a single invoice by ID (for the detail page)
export async function getInvoiceById(invoiceId: string) {
  try {
    const cookieStore = await cookies();
    const tenantUserId = cookieStore.get("rentflow_session")?.value;
    if (!tenantUserId) return null;

    const tenant = await prisma.tenant.findUnique({ where: { userId: tenantUserId } });
    if (!tenant) return null;

    return await prisma.invoice.findUnique({
      where: { id: invoiceId, tenantId: tenant.id },
      include: {
        room: { include: { property: true } },
        utilityBill: true, 
      },
    });
  } catch (error) {
    return null;
  }
}