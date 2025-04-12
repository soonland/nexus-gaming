-- AlterTable
ALTER TABLE "AdminAnnouncement" ALTER COLUMN "isActive" SET DEFAULT 'active',
ALTER COLUMN "isActive" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordExpiresAt" SET DEFAULT now() + interval '90 days';
