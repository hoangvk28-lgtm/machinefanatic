"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export async function loginAction(_prevState: { error: string }, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return { error: "Admin credentials are not configured." };
  }

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  if (email.trim() !== adminEmail || password.trim() !== adminPassword) {
    return { error: "Invalid email or password." };
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.adminEmail = email.trim();
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}
