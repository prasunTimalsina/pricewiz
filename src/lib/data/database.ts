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
      where: { productId_platform: { productId, platform: scraped.platform } },
      update: {
        title: scraped.title,
        price: scraped.price,
        imageUrl: scraped.imgUrl || null,
        url: scraped.url,
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
  } catch (error) {
    console.error(
      `Failed to save listing for ${scraped.title} (${scraped.platform}):`,
      error
    );
    throw error;
  }
}
