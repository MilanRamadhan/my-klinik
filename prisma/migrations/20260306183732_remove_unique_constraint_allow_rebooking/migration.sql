-- DropIndex
DROP INDEX "public"."Reservation_scheduledAt_doctor_key";

-- CreateIndex
CREATE INDEX "Reservation_scheduledAt_doctor_status_idx" ON "Reservation"("scheduledAt", "doctor", "status");
