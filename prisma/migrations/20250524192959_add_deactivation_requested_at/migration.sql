-- AlterTable
ALTER TABLE "User" ALTER COLUMN "deactivationRequestedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "_ArticleToGame" ADD CONSTRAINT "_ArticleToGame_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArticleToGame_AB_unique";

-- AlterTable
ALTER TABLE "_GameToPlatform" ADD CONSTRAINT "_GameToPlatform_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_GameToPlatform_AB_unique";
