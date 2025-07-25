// lib/tfidf.ts

export function omitPunctuations(word: string): string {
  return word.replace(/[^\w\d]/g, "");
}

export function toLowercase(word: string): string {
  return word.toLowerCase();
}

export function tf(word: string, doc: string[]): number {
  const wordOccurrences = doc.filter((w) => w === word).length;
  return wordOccurrences / doc.length;
}

export function idf(
  word: string,
  doc: string[],
  otherDocs: string[][]
): number {
  const docsContainingWord = [doc, ...otherDocs].filter((d) =>
    d.includes(word)
  );
  return (1 + otherDocs.length) / docsContainingWord.length;
}

export function calcTfIdfVectorForDoc(
  doc: string[],
  otherDocs: string[][],
  allWordsSet: string[]
): number[] {
  return allWordsSet.map((word) => tf(word, doc) * idf(word, doc, otherDocs));
}

export function calcVectorSize(vec: number[]): number {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const vec1Size = calcVectorSize(vec1);
  const vec2Size = calcVectorSize(vec2);
  if (vec1Size === 0 || vec2Size === 0) return 0;
  return dotProduct / (vec1Size * vec2Size);
}

/// logic to get similar products
export function getSimilarProducts(
  baseProduct: { id: number; title: string },
  otherProducts: { id: number; title: string }[]
): { id: number; title: string; similarity: number }[] {
  // Tokenize and clean the base product title
  const baseTokens = baseProduct.title
    .split(" ")
    .map(toLowercase)
    .map(omitPunctuations)
    .filter(Boolean);

  // Tokenize and clean all other product titles
  const otherDocs = otherProducts.map((p) =>
    p.title.split(" ").map(toLowercase).map(omitPunctuations).filter(Boolean)
  );

  const allWords = Array.from(new Set([...baseTokens, ...otherDocs.flat()]));

  const baseVec = calcTfIdfVectorForDoc(baseTokens, otherDocs, allWords);

  return otherProducts.map((product, idx) => {
    const otherVec = calcTfIdfVectorForDoc(
      otherDocs[idx],
      [baseTokens, ...otherDocs.filter((_, i) => i !== idx)],
      allWords
    );
    const similarity = cosineSimilarity(baseVec, otherVec);

    return {
      id: product.id,
      title: product.title,
      similarity,
    };
  });
}
