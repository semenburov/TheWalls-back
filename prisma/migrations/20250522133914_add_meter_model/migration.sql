-- CreateTable
CREATE TABLE "Meter" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "location" TEXT,
    "hausId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_hausId_fkey" FOREIGN KEY ("hausId") REFERENCES "Haus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
