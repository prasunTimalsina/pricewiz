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
  return (
    raw
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[\/\\|_-]/g, " ")
      // .replace(
      //   /\b(?:8gb|16gb|4gb|128gb|256gb|512gb|ram|ssd|full hd|touch display)\b/g,
      //   ""
      // )
      .replace(/[^a-z0-9\s."]+/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

export async function findOrCreateProduct(title: string): Promise<number> {
  const cleanedTitle = cleanTitle(title);
  console.log(`Cleaned title: ${cleanedTitle} (original: ${title})`);

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
    console.log(
      `Comparing "${cleanedTitle}" with "${
        products[i].title
      }" (score: ${rating.toFixed(4)})`
    );

    if (rating > 0.3 && (!bestMatch || rating > bestMatch.rating)) {
      bestMatch = { id: products[i].id, rating };
    }
  }

  if (bestMatch) {
    console.log(
      `✅ Matched productId: ${
        bestMatch.id
      } (similarity: ${bestMatch.rating.toFixed(4)}, matched title: ${
        products.find((p) => p.id === bestMatch!.id)?.title
      })`
    );
    return bestMatch.id;
  }

  const newProduct = await prisma.product.create({
    data: { title: cleanedTitle },
  });

  console.log(
    `🆕 Created new product: ${newProduct.id} with title: ${cleanedTitle}`
  );
  return newProduct.id;
}
