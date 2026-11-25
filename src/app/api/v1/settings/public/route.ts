import { prisma } from "@/infrastructure/database/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
      select: {
        storeName: true,
        supportEmail: true,
        supportPhone: true,
        maintenanceMode: true,
        maintenanceMessage: true
      }
    });

    return NextResponse.json({
      data: settings ?? {
        storeName: "PrestigeShop",
        supportEmail: "contact@prestigeshop.ci",
        supportPhone: "+225 07 00 00 00 00",
        maintenanceMode: false,
        maintenanceMessage:
          "Notre boutique est actuellement en maintenance. Nous revenons très vite !"
      }
    });
  } catch {
    return NextResponse.json({
      data: {
        storeName: "PrestigeShop",
        supportEmail: "contact@prestigeshop.ci",
        supportPhone: "+225 07 00 00 00 00",
        maintenanceMode: false,
        maintenanceMessage: ""
      }
    });
  }
}
