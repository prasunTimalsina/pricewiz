import prisma from "./prisma";
import {
  cosineSimilarity,
  calcTfIdfVectorForDoc,
  omitPunctuations,
  toLowercase,
} from "@/lib//data/tfidf"; // adjust the path based on your structure

function cleanTitle(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[/\\|_-]+/g, " ")
    .replace(
      /\b(?:evostore|oliz store|official store|authorized reseller|apple intelligence|store)\b/g,
      ""
    )
    .replace(
      /\b\d+(\.\d+)?\s?(?:gb|tb|mb|kb|ram|ssd|m?ah|w|kw|v|hz|inch|in|cm|mm|kg|g|ml|l|oz)\b/g,
      ""
    )
    .replace(/\b\d+(\.\d+)?\s?(?:ml|l|oz)\b/g, "")
    .replace(
      /\b(?:new|latest|sale|edition|limited|original|genuine|authentic)\b/g,
      ""
    )
    .replace(/[^a-z0-9\s."]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 5).join(" ");
}

interface Product {
  id: number;
  title: string;
}

export async function findOrCreateProduct(title: string): Promise<number> {
  const cleanedTitle = cleanTitle(title);

  const titleWords: string[] = cleanedTitle
    .split(/\s+/)
    .map(omitPunctuations)
    .map(toLowercase)
    .filter(Boolean);

  const products: Product[] = await prisma.product.findMany({
    select: { id: true, title: true },
  });

  const productWordLists: string[][] = products.map((p) =>
    cleanTitle(p.title)
      .split(/\s+/)
      .map(omitPunctuations)
      .map(toLowercase)
      .filter(Boolean)
  );

  const allWordsUnique: string[] = Array.from(
    new Set([...titleWords, ...productWordLists.flat()])
  );

  const titleVector = calcTfIdfVectorForDoc(
    titleWords,
    productWordLists,
    allWordsUnique
  );

  let bestMatch: { id: number; rating: number } | null = null;

  for (let i = 0; i < products.length; i++) {
    const productWords = productWordLists[i];
    const productVector = calcTfIdfVectorForDoc(
      productWords,
      [titleWords, ...productWordLists.filter((_, j) => j !== i)],
      allWordsUnique
    );

    const rating = cosineSimilarity(titleVector, productVector);

    if (rating > 0.5 && (!bestMatch || rating > bestMatch.rating)) {
      bestMatch = { id: products[i].id, rating };
    }
  }

  if (bestMatch) {
    return bestMatch.id;
  }

  const newProduct = await prisma.product.create({
    data: { title: cleanedTitle },
  });

  return newProduct.id;
}
