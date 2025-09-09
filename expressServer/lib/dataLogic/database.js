import prisma from "../prisma.js";
import { findOrCreateProduct } from "./matching.js";

export async function saveListing(scraped) {
  try {
    // Use the new ensemble matching with price information
    const matchResult = await findOrCreateProduct(scraped.title, scraped.price);
    const productId = matchResult.productId;

    // Log matching details if available
    if (matchResult.matchDetails) {
      console.log(`🎯 Product matching for "${scraped.title}":`);
      console.log(
        `   Final similarity: ${matchResult.matchDetails.final.toFixed(3)}`
      );
      console.log(
        `   TF-IDF: ${matchResult.matchDetails.tfidf.toFixed(
          3
        )}, Jaccard: ${matchResult.matchDetails.jaccard.toFixed(3)}, Price: ${
          matchResult.matchDetails.price?.toFixed(3) || "N/A"
        }`
      );
    }

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

    return productId;
  } catch (error) {
    console.error(
      `❌ Failed to save listing for ${scraped.title} (${scraped.platform}):`,
      error
    );
    throw error;
  }
}

// Upserts a Query record, setting nextRunAt = 24h from now.
export async function recordQueryRun(queryText) {
  const next = new Date();
  next.setDate(next.getDate() + 1);

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
