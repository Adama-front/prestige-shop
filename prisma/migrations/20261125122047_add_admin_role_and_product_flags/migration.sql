-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';
