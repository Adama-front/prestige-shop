-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "storeName" TEXT NOT NULL DEFAULT 'PrestigeShop',
    "supportEmail" TEXT NOT NULL DEFAULT 'contact@prestigeshop.ci',
    "supportPhone" TEXT NOT NULL DEFAULT '+225 07 00 00 00 00',
    "defaultShippingCostXof" INTEGER NOT NULL DEFAULT 2000,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT NOT NULL DEFAULT 'Notre boutique est actuellement en maintenance. Nous revenons très vite !',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
