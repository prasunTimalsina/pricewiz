import prisma from "../prisma.js";
import {
  cosineSimilarity,
  calcTfIdfVectorForDoc,
  omitPunctuations,
  toLowercase,
} from "../dataLogic/tfidf.js";

// =============================================================================
// SIMILARITY ALGORITHMS - Clean, traceable implementations
// =============================================================================

/**
 * Algorithm 1: TF-IDF + Cosine Similarity
 * Purpose: Semantic similarity based on word importance
 * Best for: Long product titles with many descriptive words
 */
function calculateTFIDFSimilarity(title1, title2) {
  console.log(`🔍 TF-IDF Analysis: "${title1}" vs "${title2}"`);

  // Clean and tokenize titles
  const words1 = cleanTitle(title1)
    .split(/\s+/)
    .map(omitPunctuations)
    .map(toLowercase)
    .filter(Boolean);
  const words2 = cleanTitle(title2)
    .split(/\s+/)
    .map(omitPunctuations)
    .map(toLowercase)
    .filter(Boolean);

  if (words1.length === 0 || words2.length === 0) {
    console.log(`❌ TF-IDF: Empty words after cleaning`);
    return 0;
  }

  // Create vocabulary and calculate TF-IDF vectors
  const allWords = Array.from(new Set([...words1, ...words2]));
  const vector1 = calcTfIdfVectorForDoc(words1, [words1, words2], allWords);
  const vector2 = calcTfIdfVectorForDoc(words2, [words1, words2], allWords);

  // Calculate cosine similarity
  const similarity = cosineSimilarity(vector1, vector2);
  console.log(`📊 TF-IDF Similarity: ${similarity.toFixed(3)}`);

  return similarity;
}

/**
 * Algorithm 2: Jaccard Similarity
 * Purpose: Exact word overlap similarity
 * Best for: Brand matching, exact product variants
 */
function calculateJaccardSimilarity(title1, title2) {
  console.log(`🎯 Jaccard Analysis: "${title1}" vs "${title2}"`);

  // Clean titles and create word sets
  const words1 = new Set(
    cleanTitle(title1).toLowerCase().split(/\s+/).filter(Boolean)
  );
  const words2 = new Set(
    cleanTitle(title2).toLowerCase().split(/\s+/).filter(Boolean)
  );

  if (words1.size === 0 || words2.size === 0) {
    console.log(`❌ Jaccard: Empty word sets after cleaning`);
    return 0;
  }

  // Calculate intersection and union
  const intersection = new Set([...words1].filter((word) => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  const similarity = intersection.size / union.size;

  console.log(`📝 Words1: [${Array.from(words1).join(", ")}]`);
  console.log(`📝 Words2: [${Array.from(words2).join(", ")}]`);
  console.log(
    `🎯 Intersection: [${Array.from(intersection).join(", ")}] (${
      intersection.size
    })`
  );
  console.log(`🔗 Union: ${union.size} total words`);
  console.log(`📊 Jaccard Similarity: ${similarity.toFixed(3)}`);

  return similarity;
}

/**
 * Algorithm 3: Price Range Similarity (Optional)
 * Purpose: Business logic based on price proximity
 * Best for: Ensuring products are in similar price ranges
 */
function calculatePriceRangeSimilarity(price1, price2) {
  if (!price1 || !price2) {
    console.log(
      `💰 Price Similarity: Missing price data, returning neutral (0.5)`
    );
    return 0.5; // Neutral score if no price data
  }

  const avgPrice = (price1 + price2) / 2;
  const priceDiff = Math.abs(price1 - price2);
  const relativeDiff = priceDiff / avgPrice;

  // Similar prices get higher similarity (exponential decay for large differences)
  const similarity = Math.max(0, Math.exp(-relativeDiff * 2));

  console.log(`💰 Price Analysis: Rs${price1} vs Rs${price2}`);
  console.log(`💰 Relative Difference: ${(relativeDiff * 100).toFixed(1)}%`);
  console.log(`💰 Price Similarity: ${similarity.toFixed(3)}`);

  return similarity;
}

// =============================================================================
// ENSEMBLE SIMILARITY - Combines multiple algorithms
// =============================================================================

/**
 * Ensemble Similarity Calculator
 * Combines TF-IDF, Jaccard, and optional Price similarities
 * with weighted voting for final decision
 */
function calculateEnsembleSimilarity(title1, title2, price1, price2) {
  console.log(`\n🚀 ENSEMBLE SIMILARITY ANALYSIS`);
  console.log(`📋 Product 1: "${title1}" ${price1 ? `(Rs${price1})` : ""}`);
  console.log(`📋 Product 2: "${title2}" ${price2 ? `(Rs${price2})` : ""}`);
  console.log(`${"=".repeat(80)}`);

  // Calculate individual similarities
  const tfidfSim = calculateTFIDFSimilarity(title1, title2);
  const jaccardSim = calculateJaccardSimilarity(title1, title2);
  const priceSim = calculatePriceRangeSimilarity(price1, price2);

  // Ensemble weights (can be tuned based on your data)
  const weights = {
    tfidf: 0.5, // Semantic understanding
    jaccard: 0.3, // Exact word matching
    price: 0.2, // Business logic
  };

  // Calculate weighted ensemble
  let finalSimilarity;
  let explanation = [];

  if (price1 && price2) {
    // Include price in ensemble
    finalSimilarity =
      tfidfSim * weights.tfidf +
      jaccardSim * weights.jaccard +
      priceSim * weights.price;
    explanation = [
      `TF-IDF: ${tfidfSim.toFixed(3)} × ${weights.tfidf} = ${(
        tfidfSim * weights.tfidf
      ).toFixed(3)}`,
      `Jaccard: ${jaccardSim.toFixed(3)} × ${weights.jaccard} = ${(
        jaccardSim * weights.jaccard
      ).toFixed(3)}`,
      `Price: ${priceSim.toFixed(3)} × ${weights.price} = ${(
        priceSim * weights.price
      ).toFixed(3)}`,
    ];
  } else {
    // Price-agnostic ensemble (normalize weights)
    const textWeights = { tfidf: 0.7, jaccard: 0.3 };
    finalSimilarity =
      tfidfSim * textWeights.tfidf + jaccardSim * textWeights.jaccard;
    explanation = [
      `TF-IDF: ${tfidfSim.toFixed(3)} × ${textWeights.tfidf} = ${(
        tfidfSim * textWeights.tfidf
      ).toFixed(3)}`,
      `Jaccard: ${jaccardSim.toFixed(3)} × ${textWeights.jaccard} = ${(
        jaccardSim * textWeights.jaccard
      ).toFixed(3)}`,
      `Price: Not available`,
    ];
  }

  console.log(`\n📊 ENSEMBLE RESULTS:`);
  explanation.forEach((line) => console.log(`   ${line}`));
  console.log(`🎯 Final Similarity: ${finalSimilarity.toFixed(3)}`);
  console.log(`${"=".repeat(80)}\n`);

  return {
    tfidf: tfidfSim,
    jaccard: jaccardSim,
    price: priceSim,
    final: finalSimilarity,
    explanation,
  };
}

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

// =============================================================================
// PRODUCT MATCHING - Main clustering function with ensemble similarity
// =============================================================================

/**
 * Enhanced product matching using ensemble similarity
 * Now supports multiple algorithms for better accuracy
 */
export async function findOrCreateProduct(title, price) {
  console.log(
    `\n🔍 PRODUCT MATCHING: "${title}" ${price ? `(Rs${price})` : ""}`
  );

  const cleanedTitle = cleanTitle(title);

  // Fetch existing products with their listing data for price context
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      Listing: {
        select: { price: true },
        orderBy: { scrapedAt: "desc" },
        take: 1, // Get most recent price
      },
    },
  });

  if (products.length === 0) {
    console.log(`✨ Creating first product: "${cleanedTitle}"`);
    const newProduct = await prisma.product.create({
      data: { title: cleanedTitle },
    });
    return { productId: newProduct.id };
  }

  let bestMatch = null;
  const SIMILARITY_THRESHOLD = 0.4; // Lowered for more inclusive matching

  console.log(
    `\n📊 Analyzing against ${products.length} existing products...\n`
  );

  for (const product of products) {
    // Get most recent price for this product
    const recentPrice = product.Listing[0]?.price;

    // Calculate ensemble similarity
    const breakdown = calculateEnsembleSimilarity(
      cleanedTitle,
      product.title,
      price,
      recentPrice
    );

    // Track best match
    if (
      breakdown.final > SIMILARITY_THRESHOLD &&
      (!bestMatch || breakdown.final > bestMatch.similarity)
    ) {
      bestMatch = {
        id: product.id,
        similarity: breakdown.final,
        breakdown,
      };
    }
  }

  if (bestMatch) {
    console.log(`\n✅ MATCH FOUND!`);
    console.log(`🎯 Product ID: ${bestMatch.id}`);
    console.log(`📊 Similarity: ${bestMatch.similarity.toFixed(3)}`);
    console.log(`📝 Algorithm Breakdown:`);
    bestMatch.breakdown.explanation.forEach((line) =>
      console.log(`   ${line}`)
    );

    return {
      productId: bestMatch.id,
      matchDetails: bestMatch.breakdown,
    };
  }

  console.log(
    `\n❌ No suitable match found (best similarity below ${SIMILARITY_THRESHOLD})`
  );
  console.log(`✨ Creating new product: "${cleanedTitle}"`);

  const newProduct = await prisma.product.create({
    data: { title: cleanedTitle },
  });

  return { productId: newProduct.id };
}

/**
 * Utility function for backward compatibility
 * Returns just the product ID like the old function
 */
export async function findOrCreateProductSimple(title) {
  const result = await findOrCreateProduct(title);
  return result.productId;
}
