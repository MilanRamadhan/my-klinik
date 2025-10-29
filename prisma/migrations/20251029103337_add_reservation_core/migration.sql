/*
  Warnings:

  - Added the required column `scheduledAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Reservation_userId_idx";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "doctor" TEXT,
ADD COLUMN     "durationMin" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Reservation_scheduledAt_idx" ON "Reservation"("scheduledAt");
