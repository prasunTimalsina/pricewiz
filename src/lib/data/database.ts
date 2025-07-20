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
  } catch (error) {
    console.error(
      `❌ Failed to save listing for ${scraped.title} (${scraped.platform}):`,
      error
    );
    throw error;
  }
}
