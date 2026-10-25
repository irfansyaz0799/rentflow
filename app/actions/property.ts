"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// ==========================================
// 1. CREATE PROPERTY FUNCTION
// ==========================================
export async function createProperty(data: { name: string; address: string; refCode: string }) {
  try {
    // Get the logged-in owner from the cookie session
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return { error: "Unauthorized." };

    // Save the property to the database
    await prisma.property.create({
      data: { name: data.name, address: data.address, refCode: data.refCode.toUpperCase(), ownerId: ownerId },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to create property." };
  }
}

// ==========================================
// 2. GET PROPERTIES FUNCTION
// ==========================================
export async function getProperties() {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;
    if (!ownerId) return [];

    // Fetch properties belonging to the current owner
    return await prisma.property.findMany({
      where: { ownerId: ownerId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return [];
  }
}