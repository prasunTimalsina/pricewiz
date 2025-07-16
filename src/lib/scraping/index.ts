import { scrapeDaraz } from "@/lib/daraz";

import { scrapeIiti } from "@/lib/itti";
import { saveListing } from "../data/database";

export async function scrapeAll(productName: string) {
  console.time("Total time");

  try {
    const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${encodeURIComponent(
      productName
    )}`;
    const Iurl = `https://itti.com.np/search/result?q=${encodeURIComponent(
      productName
    )}&category_type=search`;

    const darazPromise = (async () => {
      console.time("Daraz time");
      const Dproducts = await scrapeDaraz(Durl);
      console.timeEnd("Daraz time");
      return Dproducts;
    })();

    const ittiPromise = (async () => {
      console.time("Itti time");
      const Iproducts = await scrapeIiti(Iurl);
      console.timeEnd("Itti time");
      return Iproducts;
    })();

    const [Dproducts, Iproducts] = await Promise.all([
      darazPromise.catch((err) => {
        console.error("Daraz error:", err);
        return [];
      }),
      ittiPromise.catch((err) => {
        console.error("Itti error:", err);
        return [];
      }),
    ]);

    // console.log("Scraped products:");
    // console.log(`Hamrobazaar: ${Hproducts.length} products`);
    // console.log(`Daraz: ${Dproducts.length} products`);
    // console.log(`Itti: ${Iproducts.length} products`);

    const products = [...Dproducts, ...Iproducts].filter(
      (product) => product.title && !isNaN(product.price) && product.url
    );
    console.log(`Total valid products to save: ${products.length}`);

    for (const product of products) {
      try {
        await saveListing(product);
        console.log(`Saved listing: ${product.title} (${product.platform})`);
      } catch (err) {
        console.error(`Failed to save product ${product.title}:`, err);
      }
    }

    const parsePrice = (price: string | number | null | undefined): number => {
      if (!price) return Infinity;
      const clean = price.toString().replace(/[^\d]/g, "");
      return parseFloat(clean) || Infinity;
    };

    const ascproducts = [...products].sort(
      (a, b) => parsePrice(a.price) - parsePrice(b.price)
    );
    const decproducts = [...products].sort(
      (a, b) => parsePrice(b.price) - parsePrice(a.price)
    );

    return [ascproducts, decproducts, Iproducts, Dproducts];
  } catch (error) {
    console.error("Error scraping:", error);
    throw error; // Ensure the error propagates to the API response
  } finally {
    console.timeEnd("Total time");
  }
}
