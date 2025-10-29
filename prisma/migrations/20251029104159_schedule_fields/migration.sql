/*
  Warnings:

  - The `status` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[scheduledAt,doctor]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropIndex
DROP INDEX "public"."Reservation_scheduledAt_idx";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Reservation_userId_scheduledAt_idx" ON "Reservation"("userId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_scheduledAt_doctor_key" ON "Reservation"("scheduledAt", "doctor");
