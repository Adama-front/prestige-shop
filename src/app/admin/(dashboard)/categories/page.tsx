"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/presentation/components/ui/drawer";
import { ConfirmDialog } from "@/presentation/components/ui/ConfirmDialog";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { slugify } from "@/shared/utils/slugify";
import { Edit2, FolderPlus, Search, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  createdAt: string;
}

function CategoriesContent() {
  const searchParams = useSearchParams();
  const shouldOpenCreate = searchParams.get("create") === "1";

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(shouldOpenCreate);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const [saving, setSaving] = useState(false);

  // Confirmation de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pendingDeleteRef = useRef<AdminCategory | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/categories", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur serveur");
      setCategories(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const openCreateDrawer = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSlugEditedManually(false);
    setDrawerOpen(true);
  };

  const openEditDrawer = (category: AdminCategory) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setSlugEditedManually(true);
    setDrawerOpen(true);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEditedManually) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId
        ? `/api/v1/admin/categories/${editingId}`
        : "/api/v1/admin/categories";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slug || undefined })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur d'enregistrement");

      setDrawerOpen(false);
      await loadCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: AdminCategory) => {
    pendingDeleteRef.current = category;
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const category = pendingDeleteRef.current;
    if (!category) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/categories/${category.id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Suppression impossible.");
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      setDeleteDialogOpen(false);
      pendingDeleteRef.current = null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal de confirmation suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) pendingDeleteRef.current = null;
        }}
        title="Supprimer cette catégorie ?"
        description={`La catégorie « ${pendingDeleteRef.current?.name ?? ""} » sera définitivement supprimée. Les produits associés ne seront pas supprimés mais perdront leur catégorie.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Gestion des catégories
          </h1>
          <p className="text-sm text-[#64748B]">
            Organisez votre catalogue en créant et modifiant vos catégories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateDrawer}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857]"
        >
          <FolderPlus className="h-4 w-4" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une catégorie par nom ou slug..."
            className="w-full rounded-xl border border-[#E2E8F0] py-2 pl-9 pr-3 text-sm focus:border-[#059669] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5" role="status" aria-label="Chargement des catégories">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-[#F1F5F9] p-3">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <div className="flex gap-1.5">
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#64748B]">
            Aucune catégorie pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nom</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Produits liés</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {categories
                  .filter(
                    (cat) =>
                      !query.trim() ||
                      cat.name.toLowerCase().includes(query.toLowerCase()) ||
                      cat.slug.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-semibold text-[#0F172A]">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#64748B]">
                      {cat.slug}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-semibold text-[#0F172A]">
                        {cat.productsCount} produit(s)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditDrawer(cat)}
                          className="cursor-pointer rounded-xl border border-[#E2E8F0] p-2 text-[#0F172A] hover:bg-[#F1F5F9]"
                          aria-label={`Modifier ${cat.name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="cursor-pointer rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          aria-label={`Supprimer ${cat.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>
                {editingId
                  ? "Modifier la catégorie"
                  : "Créer une nouvelle catégorie"}
              </DrawerTitle>
              <DrawerDescription>
                Définissez le nom affiché et le slug URL de la catégorie.
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 px-6 py-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Nom de la catégorie
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Mode Homme"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlugEditedManually(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="mode-homme"
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 font-mono text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F1F5F9]"
                  >
                    Annuler
                  </button>
                </DrawerClose>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-xl bg-[#059669] px-5 py-2 text-sm font-semibold text-white hover:bg-[#047857] disabled:opacity-60"
                >
                  {saving
                    ? "Enregistrement..."
                    : editingId
                      ? "Enregistrer"
                      : "Créer"}
                </button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-52 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
