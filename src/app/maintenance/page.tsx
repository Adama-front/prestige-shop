import { Wrench, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance en cours – PrestigeShop",
  description:
    "Notre boutique est temporairement indisponible pour maintenance. Nous revenons très vite !",
};

// Revalidation toutes les 60 secondes pour prendre en compte la désactivation
export const revalidate = 60;

interface PublicSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

async function getSettings(): Promise<PublicSettings> {
  const defaults: PublicSettings = {
    storeName: "PrestigeShop",
    supportEmail: "contact@prestigeshop.ci",
    supportPhone: "+225 07 00 00 00 00",
    maintenanceMode: true,
    maintenanceMessage:
      "Notre boutique est actuellement en maintenance. Nous revenons très vite !",
  };

  try {
    // Utiliser une URL relative côté serveur n'est pas possible — on lit
    // directement depuis Prisma via l'import serveur.
    // On utilise un import dynamique pour garder la page légère.
    const { prisma } = await import("@/infrastructure/database/prisma");
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
      select: {
        storeName: true,
        supportEmail: true,
        supportPhone: true,
        maintenanceMode: true,
        maintenanceMessage: true,
      },
    });
    return (settings as PublicSettings) ?? defaults;
  } catch {
    return defaults;
  }
}

export default async function MaintenancePage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#ECFDF5] px-4">
      {/* Card centrale */}
      <div className="w-full max-w-lg">
        {/* Logo / Badge */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* Cercle animé */}
            <span className="absolute inset-0  rounded-full bg-[#059669]/20" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#059669] shadow-lg shadow-[#059669]/30">
              <Wrench className="h-9 w-9 text-white" />
            </span>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            Maintenance en cours
          </span>
        </div>

        {/* Card principale */}
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              {settings.storeName}
            </h1>
            <p className="mt-1 text-sm font-medium text-[#059669]">
              Nous serons bientôt de retour
            </p>

            <p className="mt-5 text-sm leading-relaxed text-[#64748B]">
              {settings.maintenanceMessage}
            </p>

            {/* Séparateur */}
            <div className="my-6 h-px w-full bg-[#E2E8F0]" />

            {/* Infos de contact */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
              Besoin d&apos;aide urgente ?
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={`mailto:${settings.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-[#059669] hover:bg-[#F0FDF4] hover:text-[#059669]"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#059669]" />
                {settings.supportEmail}
              </a>

              <a
                href={`tel:${settings.supportPhone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-[#059669] hover:bg-[#F0FDF4] hover:text-[#059669]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#059669]" />
                {settings.supportPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
