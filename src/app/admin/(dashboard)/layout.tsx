import { getCurrentUser } from "@/infrastructure/auth/sessions";
import AdminShell from "@/presentation/features/admin/AdminShell";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 text-center text-white shadow-2xl">
          <h1 className="text-xl font-bold">Accès refusé</h1>
          <p className="mt-2 text-sm text-slate-400">
            Ce compte n&apos;a pas les droits administrateur requis.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#047857]"
            >
              Connexion Admin
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
            >
              Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminShell username={user.username}>{children}</AdminShell>;
}
