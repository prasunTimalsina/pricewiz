import { stringSimilarity } from "string-similarity-js";
import prisma from "../prisma";

async function findOrCreateProduct(title: string) {
  const cleanedTitle = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\(.*?\)/g, "") // Remove parentheses
    .replace(/[-|]/g, " ") // Replace separators
    .trim();

  console.log(`Cleaned title: ${cleanedTitle} (original: ${title})`);

  const products = await prisma.product.findMany({
    select: { id: true, title: true },
  });

  let bestMatch = null;
  for (const product of products) {
    const rating = stringSimilarity(cleanedTitle, product.title.toLowerCase());

    console.log(
      `Comparing "${cleanedTitle}" with "${product.title}" (score: ${rating})`
    );
    if (rating > 0.5 && (!bestMatch || rating > bestMatch.rating)) {
      bestMatch = { id: product.id, rating };
    }
  }

  if (bestMatch) {
    console.log(
      `Matched productId: ${bestMatch.id} (similarity: ${
        bestMatch.rating
      }, matched title: ${products.find((p) => p.id === bestMatch.id)?.title})`
    );
    return bestMatch.id;
  }

  const newProduct = await prisma.product.create({
    data: { title: cleanedTitle },
  });
  console.log(
    `Created new product: ${newProduct.id} with title: ${cleanedTitle}`
  );
  return newProduct.id;
}
