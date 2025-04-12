/*
  Warnings:

  - The `isActive` column on the `AdminAnnouncement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AdminAnnouncement" DROP COLUMN "isActive",
ADD COLUMN     "isActive" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordExpiresAt" SET DEFAULT now() + interval '90 days';
