import prisma from "./prisma";
import { findOrCreateProduct } from "./matching";

export async function saveListing(scraped: {
  title: string;
  price: number;
  imgUrl?: string;
  url: string;
  platform: string;
}) {
  try {
    const productId = await findOrCreateProduct(scraped.title);

    await prisma.listing.upsert({
      where: {
        productId_platform_url: {
          productId,
          platform: scraped.platform,
          url: scraped.url,
        },
      },
      update: {
        title: scraped.title,
        price: scraped.price,
        imageUrl: scraped.imgUrl || null,
        scrapedAt: new Date(),
      },
      create: {
        productId,
        title: scraped.title,
        price: scraped.price,
        imageUrl: scraped.imgUrl || null,
        url: scraped.url,
        platform: scraped.platform,
        scrapedAt: new Date(),
      },
    });

    console.log(
      `✅ Successfully saved listing: ${scraped.title} (${scraped.platform})`
    );

    //returning product id  for query table
    return productId;
  } catch (error) {
    console.error(
      `❌ Failed to save listing for ${scraped.title} (${scraped.platform}):`,
      error
    );
    throw error;
  }
}

/**
 * Upserts a Query record, setting nextRunAt = 24h from now.
 */
// database.ts
export async function recordQueryRun(queryText: string): Promise<number> {
  const next = new Date();
  next.setDate(next.getDate() + 1);

  // find existing
  const existing = await prisma.query.findFirst({
    where: { query: queryText },
  });

  if (existing) {
    await prisma.query.update({
      where: { id: existing.id },
      data: { nextRunAt: next },
    });
    return existing.id;
  } else {
    const created = await prisma.query.create({
      data: { query: queryText, nextRunAt: next },
    });
    return created.id;
  }
}
