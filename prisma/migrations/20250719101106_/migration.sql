/*
  Warnings:

  - A unique constraint covering the columns `[productId,platform,url]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Listing_productId_platform_key";

-- CreateIndex
CREATE UNIQUE INDEX "Listing_productId_platform_url_key" ON "Listing"("productId", "platform", "url");
