"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==========================================
// 1. REGISTER OWNER FUNCTION
// ==========================================
export async function registerOwner(data: { name: string; email: string; phone: string; password: string; }) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) return { error: "An account with this email already exists." };

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Create the new user in the database
    await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, password: hashedPassword, role: "OWNER" },
    });
    
    return { success: true };
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }
}

// ==========================================
// 2. LOGIN OWNER FUNCTION
// ==========================================
export async function loginOwner(data: { email: string; password: string }) {
  let success = false;
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    // Validate if user exists and has the OWNER role
    if (!user || user.role !== "OWNER") return { error: "Invalid email or password." };

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return { error: "Invalid email or password." };

    // Set a secure HTTP-only cookie for session management
    const cookieStore = await cookies();
    cookieStore.set("rentflow_session", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/" });
    
    success = true;
  } catch (error) {
    return { error: "Something went wrong." };
  }
  if (success) redirect("/owner/dashboard");
}

// ==========================================
// 3. LOGIN TENANT FUNCTION
// ==========================================
export async function loginTenant(data: { email: string; password: string }) {
  let success = false;
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    // Validate if user exists and has the TENANT role
    if (!user || user.role !== "TENANT") return { error: "Invalid email or password." };

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) return { error: "Invalid email or password." };

    // Set a secure HTTP-only cookie for session management
    const cookieStore = await cookies();
    cookieStore.set("rentflow_session", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/" });
    
    success = true;
  } catch (error) {
    return { error: "Something went wrong." };
  }
  if (success) redirect("/tenant/dashboard");
}