-- DropIndex
DROP INDEX "Post_slug_key";

-- DropIndex
DROP INDEX "Post_slug_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_locale_key" ON "Post"("slug", "locale");
