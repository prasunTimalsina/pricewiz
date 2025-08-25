export function omitPunctuations(word) {
  return word.replace(/[^\w\d]/g, "");
}

export function toLowercase(word) {
  return word.toLowerCase();
}

export function tf(word, doc) {
  const wordOccurrences = doc.filter((w) => w === word).length;
  return wordOccurrences / doc.length;
}

export function idf(word, doc, otherDocs) {
  const docsContainingWord = [doc, ...otherDocs].filter((d) =>
    d.includes(word)
  );
  return (1 + otherDocs.length) / docsContainingWord.length;
}

export function calcTfIdfVectorForDoc(doc, otherDocs, allWordsSet) {
  return allWordsSet.map((word) => tf(word, doc) * idf(word, doc, otherDocs));
}

export function calcVectorSize(vec) {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

export function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const vec1Size = calcVectorSize(vec1);
  const vec2Size = calcVectorSize(vec2);
  if (vec1Size === 0 || vec2Size === 0) return 0;
  return dotProduct / (vec1Size * vec2Size);
}

export function getSimilarProducts(baseProduct, otherProducts) {
  const baseTokens = baseProduct.title
    .split(" ")
    .map(toLowercase)
    .map(omitPunctuations)
    .filter(Boolean);

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
