-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "previousStatus" "ArticleStatus";
