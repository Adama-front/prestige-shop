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
import { formatXof } from "@/shared/utils/formatXof";
import { ChevronLeft, ChevronRight, Edit2, Plus, Search, Sparkles, Tag, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

interface CategoryOption {
  id: number;
  name: string;
  slug: string;
}

interface AdminProduct {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  priceXof: number;
  stock: number;
  isPublished: boolean;
  isNew: boolean;
  discountPercent: number;
  categoryId: number;
  category: CategoryOption;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  imageUrl: "",
  categoryId: "",
  priceXof: "0",
  stock: "10",
  isPublished: true,
  isNew: false,
  discountPercent: "0"
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";
  const shouldOpenCreate = searchParams.get("create") === "1";

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(shouldOpenCreate);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Confirmation de suppression
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pendingDeleteRef = useRef<AdminProduct | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (query.trim()) params.set("q", query.trim());
      params.set("page", String(page));
      params.set("perPage", "12");

      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/v1/admin/products?${params.toString()}`, {
          cache: "no-store"
        }),
        fetch("/api/v1/admin/categories", { cache: "no-store" })
      ]);
      const [prodJson, catJson] = await Promise.all([
        prodRes.json(),
        catRes.json()
      ]);
      if (!prodRes.ok) throw new Error(prodJson?.error?.message || "Erreur");
      if (!catRes.ok) throw new Error(catJson?.error?.message || "Erreur");

      setProducts(prodJson.data);
      setTotalPages(prodJson.meta?.totalPages ?? 1);
      setTotalItems(prodJson.meta?.total ?? prodJson.data.length);
      setCategories(catJson.data);
      setForm((prev) => ({
        ...prev,
        categoryId: prev.categoryId || String(catJson.data[0]?.id ?? "")
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, [filter, query, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadData]);

  const openCreateDrawer = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      categoryId: String(categories[0]?.id ?? "")
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (product: AdminProduct) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      categoryId: String(product.categoryId),
      priceXof: String(product.priceXof),
      stock: String(product.stock),
      isPublished: product.isPublished,
      isNew: product.isNew,
      discountPercent: String(product.discountPercent)
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        categoryId: Number(form.categoryId),
        priceXof: Number(form.priceXof),
        stock: Number(form.stock),
        isPublished: form.isPublished,
        isNew: form.isNew,
        discountPercent: Number(form.discountPercent)
      };

      const url = editingId
        ? `/api/v1/admin/products/${editingId}`
        : "/api/v1/admin/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Erreur d'enregistrement");

      setDrawerOpen(false);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async (
    product: AdminProduct,
    field: "isPublished" | "isNew"
  ) => {
    try {
      const res = await fetch(`/api/v1/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !product[field] })
      });
      if (!res.ok) throw new Error("Mise à jour impossible.");
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, [field]: !p[field] } : p
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur.");
    }
  };

  const handleDelete = async (product: AdminProduct) => {
    // Ouvre le modal de confirmation au lieu de window.confirm
    pendingDeleteRef.current = product;
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const product = pendingDeleteRef.current;
    if (!product) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/admin/products/${product.id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Suppression impossible.");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setDeleteDialogOpen(false);
      pendingDeleteRef.current = null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    } finally {
      setDeleting(false);
    }
  };

  const filterTabs = [
    { key: "all", label: "Tous" },
    { key: "published", label: "Publiés" },
    { key: "draft", label: "Brouillons" },
    { key: "new", label: "Nouveautés" },
    { key: "promo", label: "En promo" },
    { key: "low-stock", label: "Stock faible" }
  ];

  return (
    <div className="space-y-6">
      {/* Modal de confirmation suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) pendingDeleteRef.current = null;
        }}
        title="Supprimer ce produit ?"
        description={`Le produit « ${pendingDeleteRef.current?.title ?? ""} » sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Gestion des produits
          </h1>
          <p className="text-sm text-[#64748B]">
            Créez vos produits, gérez les stocks, les nouveautés et les promotions.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateDrawer}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857]"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Filters & Full-Width Search Pill Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setFilter(tab.key);
                setPage(1);
              }}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === tab.key
                  ? "bg-[#10B981] text-[#0F172A]"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un produit par titre ou description..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-4 text-sm focus:border-[#059669] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Products Grid (matching reference card layout + home-style Skeleton) */}
      {loading ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          role="status"
          aria-label="Chargement des produits"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex flex-col space-y-3 rounded-2xl border border-[#E2E8F0] bg-white p-3"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="space-y-1.5 px-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
              <div className="flex items-center justify-between px-1 pt-1">
                <Skeleton className="h-5 w-1/3 rounded-md bg-[#D1FAE5]/70" />
                <div className="flex gap-1.5">
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">
          Aucun produit trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F8FAFC]">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-contain p-3"
                  />
                  {/* Dark Stock Pill matching reference */}
                  <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      product.stock === 0
                        ? "bg-red-600 text-white"
                        : "bg-[#0F172A] text-white"
                    }`}
                  >
                    {product.stock === 0 ? "Rupture" : `${product.stock} Stock`}
                  </span>

                  {product.discountPercent > 0 && (
                    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-0.5 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">
                      <Tag className="h-2.5 w-2.5" />-{product.discountPercent}%
                    </span>
                  )}
                </div>

                <div className="mt-3 px-1">
                  <h2 className="truncate text-sm font-bold text-[#0F172A]">
                    {product.title}
                  </h2>
                  <p className="truncate text-xs text-[#64748B]">
                    {product.category.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2.5 px-1">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickToggle(product, "isPublished")}
                    className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      product.isPublished
                        ? "bg-[#D1FAE5] text-[#047857]"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {product.isPublished ? "Publié" : "Brouillon"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickToggle(product, "isNew")}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      product.isNew
                        ? "bg-blue-100 text-blue-800"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Nouveau</span>
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-2.5">
                  <p className="text-sm font-bold text-[#0F172A]">
                    {formatXof(product.priceXof)}
                  </p>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditDrawer(product)}
                      className="cursor-pointer rounded-xl border border-[#E2E8F0] p-2 text-[#0F172A] hover:bg-[#F1F5F9]"
                      aria-label={`Modifier ${product.title}`}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="cursor-pointer rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      aria-label={`Supprimer ${product.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm sm:flex-row">
          <p className="text-xs text-[#64748B]">
            Page <span className="font-semibold text-[#0F172A]">{page}</span> sur{" "}
            <span className="font-semibold text-[#0F172A]">{totalPages}</span> ·{" "}
            {totalItems} produit(s)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Précédent</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`h-8 w-8 cursor-pointer rounded-xl text-xs font-semibold transition-colors ${
                  p === page
                    ? "bg-[#10B981] text-[#0F172A]"
                    : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Suivant</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>
                {editingId ? "Modifier le produit" : "Créer un nouveau produit"}
              </DrawerTitle>
              <DrawerDescription>
                Renseignez les informations du produit, le stock, la nouveauté et la promotion éventuelle.
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 px-6 py-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Titre du produit
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                      Catégorie
                    </label>
                    <select
                      required
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                      URL de l&apos;image
                    </label>
                    <input
                      type="url"
                      required
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                    />
                  </div>
                </div>

                {form.imageUrl && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2">
                    <img
                      src={form.imageUrl}
                      alt="Aperçu"
                      className="h-14 w-14 rounded-lg bg-white object-contain p-1"
                    />
                    <span className="text-xs text-[#64748B]">
                      Aperçu de l&apos;image produit
                    </span>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                      Prix (FCFA / XOF)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.priceXof}
                      onChange={(e) =>
                        setForm({ ...form, priceXof: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                      Stock disponible
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#0F172A]">
                      Promotion (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={95}
                      value={form.discountPercent}
                      onChange={(e) =>
                        setForm({ ...form, discountPercent: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm focus:border-[#059669] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 rounded-xl bg-[#F8FAFC] p-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0F172A]">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) =>
                        setForm({ ...form, isPublished: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#059669]"
                    />
                    <span>Publié sur la boutique</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0F172A]">
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) =>
                        setForm({ ...form, isNew: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#059669]"
                    />
                    <span>Marquer comme Nouveauté</span>
                  </label>
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
                      : "Créer le produit"}
                </button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-52 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
