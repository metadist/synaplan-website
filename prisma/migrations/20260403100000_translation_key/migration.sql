-- Add translationKey to Post for linking DE + EN versions of the same post
ALTER TABLE "Post" ADD COLUMN "translationKey" TEXT;
CREATE INDEX "Post_translationKey_idx" ON "Post"("translationKey");
