/*
  Warnings:

  - You are about to drop the `Hause` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hause" DROP CONSTRAINT "Hause_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Hause" DROP CONSTRAINT "Hause_societyId_fkey";

-- DropTable
DROP TABLE "Hause";

-- CreateTable
CREATE TABLE "Haus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "societyId" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Haus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Haus" ADD CONSTRAINT "Haus_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Haus" ADD CONSTRAINT "Haus_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
