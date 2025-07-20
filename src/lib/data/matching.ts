import prisma from "./prisma";

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const vec1Size = calcVectorSize(vec1);
  const vec2Size = calcVectorSize(vec2);
  if (vec1Size === 0 || vec2Size === 0) return 0;
  return dotProduct / (vec1Size * vec2Size);
}

function calcTfIdfVectorForDoc(
  doc: string[],
  otherDocs: string[][],
  allWordsSet: string[]
): number[] {
  return allWordsSet.map((word) => tf(word, doc) * idf(word, doc, otherDocs));
}

function tf(word: string, doc: string[]): number {
  const wordOccurrences = doc.filter((w) => w === word).length;
  return wordOccurrences / doc.length;
}

function idf(word: string, doc: string[], otherDocs: string[][]): number {
  const docsContainingWord = [doc, ...otherDocs].filter((d) =>
    d.includes(word)
  );
  return (1 + otherDocs.length) / docsContainingWord.length;
}

function omitPunctuations(word: string): string {
  return word.replace(/[^\w\d]/g, "");
}

function toLowercase(word: string): string {
  return word.toLowerCase();
}

function calcVectorSize(vec: number[]): number {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

interface Product {
  id: number;
  title: string;
}

function cleanTitle(raw: string): string {
  const cleaned = raw
    // 1) lowercase
    .toLowerCase()

    // 2) remove any parenthetical content
    .replace(/\(.*?\)/g, "")

    // 3) unify hyphens/slashes/underscores into spaces
    .replace(/[/\\|_-]+/g, " ")

    // 4) strip common retailer/store/vendor tags
    .replace(
      /\b(?:evostore|oliz store|official store|authorized reseller|apple intelligence|store)\b/g,
      ""
    )

    // 5) strip measurement units & capacities for tech/electrics
    .replace(
      /\b\d+(\.\d+)?\s?(?:gb|tb|mb|kb|ram|ssd|m?ah|w|kw|v|hz|inch|in|cm|mm|kg|g|ml|l|oz)\b/g,
      ""
    )

    // 6) strip cosmetic‑specific packaging sizes
    .replace(/\b\d+(\.\d+)?\s?(?:ml|l|oz)\b/g, "")

    // 7) remove marketing buzzwords
    .replace(
      /\b(?:new|latest|sale|edition|limited|original|genuine|authentic)\b/g,
      ""
    )

    // 8) remove any remaining non-alphanumeric characters except spaces & quotes
    .replace(/[^a-z0-9\s."]/g, "")

    // 9) collapse multiple spaces into one
    .replace(/\s{2,}/g, " ")

    // 10) trim edges
    .trim();

  // 11) keep only the first 7 words
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 5).join(" ");
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

  const titleVector: number[] = calcTfIdfVectorForDoc(
    titleWords,
    productWordLists,
    allWordsUnique
  );

  interface Match {
    id: number;
    rating: number;
  }

  let bestMatch: Match | null = null;
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
