"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function createUtilitiesAndInvoices(data: {
  propertyId: string;
  month: number;
  year: number;
  electricity: number;
  water: number;
  wifi: number;
}) {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return { error: "Unauthorized" };

    const property = await prisma.property.findUnique({
      where: { id: data.propertyId, ownerId },
      include: {
        rooms: {
          include: {
            tenants: { where: { isActive: true } },
          },
        },
      },
    });

    if (!property) return { error: "Property not found." };

    let activeTenants: any[] = [];
    property.rooms.forEach((room) => {
      activeTenants.push(...room.tenants);
    });

    const tenantCount = activeTenants.length;
    if (tenantCount === 0) return { error: "No active tenants to generate invoices for." };

    const utilitiesTotal = data.electricity + data.water + data.wifi;
    const utilityShare = utilitiesTotal / tenantCount;

    // Check if a bill exists for this month, if yes, delete it and its invoices first
    const existingBill = await prisma.utilityBill.findUnique({
      where: { 
        propertyId_month_year: { 
          propertyId: data.propertyId, 
          month: data.month, 
          year: data.year 
        } 
      },
    });

    if (existingBill) {
      // Delete old invoices tied to this bill
      await prisma.invoice.deleteMany({
        where: { utilityBillId: existingBill.id }
      });
      // Delete old utility bill
      await prisma.utilityBill.delete({
        where: { id: existingBill.id }
      });
    }

    await prisma.$transaction(async (tx) => {
      const bill = await tx.utilityBill.create({
        data: {
          propertyId: data.propertyId,
          month: data.month,
          year: data.year,
          electricity: data.electricity,
          water: data.water,
          wifi: data.wifi,
          utilitiesTotal: utilitiesTotal,
          tenantCount: tenantCount,
          utilityShare: utilityShare,
        },
      });

      for (const tenant of activeTenants) {
        const room = property.rooms.find((r) => r.id === tenant.roomId);
        const rent = Number(room?.monthlyRent || 0);
        const totalPayable = rent + utilityShare;
        
        // Use a random string for invoice number to avoid unique constraint errors
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const invoiceNo = `INV-${data.year}${data.month}-${randomStr}`;

        await tx.invoice.create({
          data: {
            invoiceNo,
            tenantId: tenant.id,
            roomId: tenant.roomId,
            utilityBillId: bill.id,
            rentSnapshot: rent,
            electricitySnapshot: data.electricity,
            waterSnapshot: data.water,
            wifiSnapshot: data.wifi,
            utilitiesTotalSnapshot: utilitiesTotal,
            utilityShareSnapshot: utilityShare,
            totalPayable: totalPayable,
            dueDate: new Date(data.year, data.month, 0), 
            status: "SENT", 
          },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Utilities Error:", error);
    return { error: "Failed to generate invoices. Check terminal." };
  }
}