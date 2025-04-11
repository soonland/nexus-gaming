-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordExpiresAt" SET DEFAULT now() + interval '90 days';
