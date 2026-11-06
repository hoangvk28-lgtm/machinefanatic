import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Dashboard - MachineFanatic",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell header={<AdminHeader />}>
      {children}
    </AdminShell>
  );
}
