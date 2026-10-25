"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// ==========================================
// 1. CREATE INVITATION FUNCTION
// ==========================================
export async function createInvitation(roomId: string, propertyId: string) {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return { error: "Unauthorized" };

    // Generate a unique token and set expiration to 7 days
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.invitation.create({
      data: { token, propertyId, roomId, tenantName: "Pending", phone: "Pending", expiresAt },
    });
    return { success: true, token };
  } catch (error) {
    return { error: "Failed to create invitation." };
  }
}

// ==========================================
// 2. GET INVITATION BY TOKEN
// ==========================================
export async function getInvitationByToken(token: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { room: true, property: true },
    });
    
    // Check if invitation is valid and not expired
    if (!invitation || invitation.status !== "PENDING") return null;
    if (new Date() > invitation.expiresAt) return null;
    return invitation;
  } catch (error) {
    return null;
  }
}

// ==========================================
// 3. REGISTER TENANT FUNCTION
// ==========================================
export async function registerTenant(data: { token: string; name: string; email: string; phone: string; password: string; }) {
  try {
    const invitation = await prisma.invitation.findUnique({ where: { token: data.token } });
    if (!invitation) return { error: "Invalid or expired invitation." };

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) return { error: "Email already in use." };

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Use a transaction to ensure all database operations succeed together
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: data.name, email: data.email, phone: data.phone, password: hashedPassword, role: "TENANT" },
      });
      await tx.tenant.create({
        data: { userId: user.id, roomId: invitation.roomId },
      });
      await tx.room.update({
        where: { id: invitation.roomId },
        data: { status: "OCCUPIED" },
      });
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to register tenant." };
  }
}

// ==========================================
// 4. GET OWNER TENANTS FUNCTION
// ==========================================
export async function getOwnerTenants() {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return [];

    // Fetch tenants whose room's property belongs to the logged-in owner
    return await prisma.tenant.findMany({
      where: { room: { property: { ownerId: ownerId } }, isActive: true },
      include: { user: true, room: { include: { property: true } } },
      orderBy: { moveInDate: 'desc' }
    });
  } catch (error) {
    return [];
  }
}