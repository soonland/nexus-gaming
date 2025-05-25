-- CreateEnum
CREATE TYPE "AnnouncementVisibility" AS ENUM ('ADMIN_ONLY', 'PUBLIC');

-- AlterTable
ALTER TABLE "AdminAnnouncement" 
ADD COLUMN "visibility" "AnnouncementVisibility" NOT NULL DEFAULT 'ADMIN_ONLY';