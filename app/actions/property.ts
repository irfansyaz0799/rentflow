"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 1. CREATE PROPERTY
export async function createProperty(data: {
  name: string;
  address: string;
  refCode: string;
}) {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;

    if (!ownerId) {
      return { error: "Unauthorized. Please log in again." };
    }

    await prisma.property.create({
      data: {
        name: data.name,
        address: data.address,
        refCode: data.refCode.toUpperCase(),
        ownerId: ownerId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { error: "Failed to create property. Please try again." };
  }
}

// 2. GET PROPERTIES
export async function getProperties() {
  try {
    const cookieStore = await cookies();
    const ownerId = cookieStore.get("rentflow_session")?.value;

    if (!ownerId) return [];

    const properties = await prisma.property.findMany({
      where: { ownerId: ownerId },
      orderBy: { createdAt: 'desc' }
    });

    return properties;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}