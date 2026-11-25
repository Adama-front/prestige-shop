"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Titre affiché dans le modal */
  title: string;
  /** Description / message de confirmation */
  description: string;
  /** Texte du bouton de confirmation (défaut : "Confirmer") */
  confirmLabel?: string;
  /** Texte du bouton d'annulation (défaut : "Annuler") */
  cancelLabel?: string;
  /** Variante du bouton confirm: "danger" (rouge) | "default" (vert) */
  variant?: "danger" | "default";
  /** Appelé quand l'utilisateur confirme */
  onConfirm: () => void;
  /** Désactive le bouton confirm (ex: pendant un chargement) */
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2
            rounded-2xl bg-white p-6 shadow-2xl
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
            duration-200
          "
        >
          {/* Close button */}
          <Dialog.Close
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                variant === "danger"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <Dialog.Title className="text-base font-semibold text-[#0F172A]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-slate-500">
                {description}
              </Dialog.Description>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="cursor-pointer rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>

            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={`cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
                variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-[#059669] hover:bg-[#047857]"
              }`}
            >
              {loading ? "En cours..." : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
