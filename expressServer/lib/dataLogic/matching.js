import prisma from "../prisma.js";
import {
  cosineSimilarity,
  calcTfIdfVectorForDoc,
  omitPunctuations,
  toLowercase,
} from "../dataLogic/tfidf.js";

function cleanTitle(raw) {
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

export async function findOrCreateProduct(title) {
  const cleanedTitle = cleanTitle(title);

  const titleWords = cleanedTitle
    .split(/\s+/)
    .map(omitPunctuations)
    .map(toLowercase)
    .filter(Boolean);

  const products = await prisma.product.findMany({
    select: { id: true, title: true },
  });

  const productWordLists = products.map((p) =>
    cleanTitle(p.title)
      .split(/\s+/)
      .map(omitPunctuations)
      .map(toLowercase)
      .filter(Boolean)
  );

  const allWordsUnique = Array.from(
    new Set([...titleWords, ...productWordLists.flat()])
  );

  const titleVector = calcTfIdfVectorForDoc(
    titleWords,
    productWordLists,
    allWordsUnique
  );

  let bestMatch = null;

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
