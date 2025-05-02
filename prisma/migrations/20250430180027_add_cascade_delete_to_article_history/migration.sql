-- DropForeignKey
ALTER TABLE "ArticleApprovalHistory" DROP CONSTRAINT "ArticleApprovalHistory_articleId_fkey";

-- AddForeignKey
ALTER TABLE "ArticleApprovalHistory" ADD CONSTRAINT "ArticleApprovalHistory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
