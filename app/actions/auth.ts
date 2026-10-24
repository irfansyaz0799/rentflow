"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerOwner(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) return { error: "An account with this email already exists." };

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, password: hashedPassword, role: "OWNER" },
    });
    return { success: true };
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function loginOwner(data: { email: string; password: string }) {
  let success = false;
  
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || user.role !== "OWNER") return { error: "Invalid email or password." };

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return { error: "Invalid email or password." };

    const cookieStore = await cookies();
    cookieStore.set("rentflow_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    
    success = true;
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }

  // Redirect only after the try-catch block is fully completed
  if (success) {
    redirect("/owner/dashboard");
  }
}