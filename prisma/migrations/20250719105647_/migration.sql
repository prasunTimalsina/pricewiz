/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Listing_url_key" ON "Listing"("url");
