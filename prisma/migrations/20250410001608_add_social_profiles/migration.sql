-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('PSN', 'XBOX', 'STEAM', 'NINTENDO', 'EPIC', 'BATTLENET', 'TWITCH', 'TWITTER', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordExpiresAt" SET DEFAULT now() + interval '90 days';

-- CreateTable
CREATE TABLE "UserSocialProfile" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "username" TEXT NOT NULL,
    "url" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSocialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSocialProfile_userId_idx" ON "UserSocialProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialProfile_userId_platform_key" ON "UserSocialProfile"("userId", "platform");

-- AddForeignKey
ALTER TABLE "UserSocialProfile" ADD CONSTRAINT "UserSocialProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
