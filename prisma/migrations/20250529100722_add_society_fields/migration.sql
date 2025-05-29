/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Society` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Society` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Society` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Society` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SocietyType" AS ENUM ('HOUSE', 'GARDEN', 'GARAGE');

-- CreateEnum
CREATE TYPE "SocietyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "Society" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "SocietyStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedBy" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "SocietyType" NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "societyId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SocietyToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SocietyToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SocietyToUser_B_index" ON "_SocietyToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Society_name_key" ON "Society"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Society_email_key" ON "Society"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Society_phone_key" ON "Society"("phone");

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SocietyToUser" ADD CONSTRAINT "_SocietyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SocietyToUser" ADD CONSTRAINT "_SocietyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
