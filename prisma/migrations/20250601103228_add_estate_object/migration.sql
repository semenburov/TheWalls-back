-- CreateEnum
CREATE TYPE "EstateObjectType" AS ENUM ('STREET', 'ENTRANCE', 'PLOT', 'APARTMENT');

-- AlterTable
ALTER TABLE "Society" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "estateObject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EstateObjectType" NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "societyId" TEXT NOT NULL,
    "parentId" TEXT,
    "ownerIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estateObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estateObject_name_parentId_key" ON "estateObject"("name", "parentId");

-- AddForeignKey
ALTER TABLE "estateObject" ADD CONSTRAINT "estateObject_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estateObject" ADD CONSTRAINT "estateObject_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "estateObject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
