"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// ==========================================
// 1. GET PROPERTY WITH ROOMS FUNCTION
// ==========================================
export async function getPropertyWithRooms(propertyId: string) {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return null;

    // Fetch the property and include its rooms
    return await prisma.property.findUnique({
      where: { id: propertyId, ownerId: ownerId },
      include: { rooms: { orderBy: { refCode: 'asc' } } }
    });
  } catch (error) {
    return null;
  }
}

// ==========================================
// 2. CREATE ROOM FUNCTION
// ==========================================
export async function createRoom(data: { propertyId: string; refCode: string; monthlyRent: number }) {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return { error: "Unauthorized." };

    // Check if property belongs to this owner
    const property = await prisma.property.findUnique({ where: { id: data.propertyId, ownerId: ownerId } });
    if (!property) return { error: "Property not found." };

    // Create the room
    await prisma.room.create({
      data: { 
        propertyId: data.propertyId, 
        refCode: data.refCode.toUpperCase(), 
        monthlyRent: data.monthlyRent, 
        status: "VACANT" 
      },
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "This Room Code is already in use." };
    return { error: "Failed to create room." };
  }
}