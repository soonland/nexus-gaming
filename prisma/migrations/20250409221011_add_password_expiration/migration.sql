-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastPasswordChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordExpiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '90 days';
