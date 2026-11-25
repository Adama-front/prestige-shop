"use client";

import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Store,
  Users,
  X
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/customers", label: "Clients & Équipe", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings }
];

export default function AdminShell({
  username,
  children
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved === "1") setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin/login");
    }
  };

  const renderSidebar = (isCompact: boolean) => (
    <div className="flex h-full flex-col justify-between bg-[#111827] p-3 text-slate-300">
      <div>
        <div
          className={`mb-6 flex items-center pt-1 ${
            isCompact ? "flex-col gap-3" : "justify-between px-1.5"
          }`}
        >
          <Link
            href="/admin"
            title="PrestigeShop Admin"
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-sm font-bold text-white shadow-md shadow-[#059669]/30">
              PS
            </span>
            {!isCompact && (
              <div>
                <p className="text-sm font-bold text-white">PrestigeShop</p>
                <p className="text-[11px] text-slate-400">Console Admin</p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            title={isCompact ? "Déplier le menu" : "Réduire le menu"}
            aria-label={isCompact ? "Déplier le menu" : "Réduire le menu"}
            className="hidden cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            {isCompact ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCompact ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-all ${
                  isCompact ? "justify-center px-2" : "gap-3 px-3.5"
                } ${
                  active
                    ? "bg-[#10B981] font-semibold text-[#0F172A] shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCompact && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <div
          className={`flex items-center py-1 ${
            isCompact ? "justify-center" : "gap-2.5 px-2"
          }`}
          title={isCompact ? `${username} (Administrateur)` : undefined}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold uppercase text-white">
            {username.slice(0, 2)}
          </span>
          {!isCompact && (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {username}
              </p>
              <p className="text-[11px] text-[#10B981]">Administrateur</p>
            </div>
          )}
        </div>

        <Link
          href="/"
          title={isCompact ? "Voir la boutique" : undefined}
          className={`flex items-center rounded-xl border border-white/10 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 ${
            isCompact ? "justify-center px-2" : "gap-2.5 px-3"
          }`}
        >
          <Store className="h-4 w-4 shrink-0 text-[#10B981]" />
          {!isCompact && <span>Voir la boutique</span>}
        </Link>

        {/* Bouton déconnexion → ouvre le modal de confirmation */}
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          title={isCompact ? "Déconnexion" : undefined}
          className={`flex w-full cursor-pointer items-center rounded-xl py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10 ${
            isCompact ? "justify-center px-2" : "gap-2.5 px-3"
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCompact && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111827] text-[#0F172A]">
      {/* Modal de confirmation déconnexion */}
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Se déconnecter ?"
        description="Vous allez être déconnecté de la console d'administration. Toute session en cours sera fermée."
        confirmLabel="Se déconnecter"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        loading={loggingOut}
      />

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#111827] px-4 py-3 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold">PrestigeShop Admin</span>
        <Link
          href="/"
          className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-medium text-slate-200"
        >
          Boutique
        </Link>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-[#111827] shadow-2xl">
            {renderSidebar(false)}
          </aside>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-[1640px]">
        {/* Desktop Collapsible Dark Sidebar */}
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${
            collapsed ? "w-[74px]" : "w-60"
          }`}
        >
          {renderSidebar(collapsed)}
        </aside>

        {/* Rounded White Workspace Canvas */}
        <div className="min-w-0 flex-1 p-0 lg:py-3 lg:pr-3">
          <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:rounded-3xl lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
