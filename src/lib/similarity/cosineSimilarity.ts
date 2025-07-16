// tfidfCosineSimilarity.ts

const str1 = "This is an example to test cosine similarity between two strings";
const str2 = "This example is testing cosine similatiry for given two strings";

//
// Preprocess strings and combine words to a unique collection
//

const str1Words: string[] = str1
  .trim()
  .split(" ")
  .map(omitPunctuations)
  .map(toLowercase);
const str2Words: string[] = str2
  .trim()
  .split(" ")
  .map(omitPunctuations)
  .map(toLowercase);
const allWordsUnique: string[] = Array.from(
  new Set([...str1Words, ...str2Words])
);

//
// Calculate TF-IDF vectors
//

const str1Vector = calcTfIdfVectorForDoc(
  str1Words,
  [str2Words],
  allWordsUnique
);
const str2Vector = calcTfIdfVectorForDoc(
  str2Words,
  [str1Words],
  allWordsUnique
);

//
// Output result
//

console.log("Cosine similarity:", cosineSimilarity(str1Vector, str2Vector));

//
// Cosine similarity function
//

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const vec1Size = calcVectorSize(vec1);
  const vec2Size = calcVectorSize(vec2);

  return dotProduct / (vec1Size * vec2Size);
}

//
// TF-IDF related functions
//

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
  const allDocs = [doc, ...otherDocs];
  const docsContainingWord = allDocs.filter((d) => d.includes(word)).length;
  return allDocs.length / docsContainingWord;
}

//
// Helper functions
//

function omitPunctuations(word: string): string {
  return word.replace(/[!.,?\-]/gi, "");
}

function toLowercase(word: string): string {
  return word.toLowerCase();
}

function calcVectorSize(vec: number[]): number {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}
