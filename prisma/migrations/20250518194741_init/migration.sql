-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PREMIUM', 'MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "password" TEXT,
    "avatar_path" TEXT,
    "telegram_id" TEXT,
    "otp_code" TEXT,
    "otp_expires_at" TIMESTAMP(3),
    "verification_token" TEXT,
    "rights" "Role"[] DEFAULT ARRAY['USER']::"Role"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
