import { scrapeDaraz } from "@/lib/scrapper/daraz";
import { scrapeIiti } from "@/lib/scrapper/itti";
// import { ScrapeHukut } from "@/lib/scrapper/hukut"; // Currently disabled
import SelectTop10 from "../scrapper/top10Selection";
import { saveListing, recordQueryRun } from "./database";
import prisma from "./prisma";

export async function scrapeAll(productName: string) {
  console.log(`🚀 Starting scrape operation for: "${productName}"`);

  try {
    const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${productName}`;
    const Iurl = `https://itti.com.np/search/result?q=${productName}&category_type=search`;
    // const HUurl = `https://hukut.com/search/${productName}`; // Currently disabled

    // Enhanced error handling for individual scrapers
    const darazPromise = (async () => {
      try {
        console.log(`🔍 Starting Daraz scraping...`);
        const Dproducts = await scrapeDaraz(Durl);
        console.log(
          `✅ Daraz scraping successful: ${Dproducts.length} products found`
        );
        return {
          scraper: "Daraz",
          products: Dproducts,
          success: true,
          error: null,
        };
      } catch (error) {
        console.error(`❌ Daraz scraping failed:`, error);
        return { scraper: "Daraz", products: [], success: false, error: error };
      }
    })();

    const ittiPromise = (async () => {
      try {
        console.log(`🔍 Starting ITTI scraping...`);
        const Iproducts = await scrapeIiti(Iurl);
        console.log(
          `✅ ITTI scraping successful: ${Iproducts.length} products found`
        );
        return {
          scraper: "ITTI",
          products: Iproducts,
          success: true,
          error: null,
        };
      } catch (error) {
        console.error(`❌ ITTI scraping failed:`, error);
        return { scraper: "ITTI", products: [], success: false, error: error };
      }
    })();

    const hukutPromise = (async () => {
      try {
        console.log(`🔍 Starting Hukut scraping...`);
        // Currently disabled
        //const Huproducts = await ScrapeHukut(HUurl);
        //console.log(`✅ Hukut scraping successful: ${Huproducts.length} products found`);
        //return { scraper: 'Hukut', products: Huproducts, success: true, error: null };
        console.log(`⚠️ Hukut scraping disabled`);
        return { scraper: "Hukut", products: [], success: true, error: null };
      } catch (error) {
        console.error(`❌ Hukut scraping failed:`, error);
        return { scraper: "Hukut", products: [], success: false, error: error };
      }
    })();

    // Wait for all scrapers to complete (with individual error handling)
    const [darazResult, ittiResult, hukutResult] = await Promise.all([
      darazPromise,
      ittiPromise,
      hukutPromise,
    ]);

    // Log scraping summary
    const results = [darazResult, ittiResult, hukutResult];
    const successfulScrapers = results.filter((r) => r.success);
    const failedScrapers = results.filter((r) => !r.success);

    console.log(`📊 Scraping Summary:`);
    console.log(
      `   ✅ Successful: ${successfulScrapers.length}/${results.length} scrapers`
    );
    console.log(
      `   ❌ Failed: ${failedScrapers.length}/${results.length} scrapers`
    );

    if (failedScrapers.length > 0) {
      console.log(`🚨 Failed scrapers details:`);
      failedScrapers.forEach((result) => {
        console.log(
          `   • ${result.scraper}: ${
            (result.error as Error)?.message || "Unknown error"
          }`
        );
      });
    }

    // Combine products from successful scrapers
    const products = successfulScrapers.flatMap((result) => result.products);

    if (products.length === 0) {
      console.log(`⚠️ No products found from any scraper for "${productName}"`);
      return [];
    }

    console.log(`📦 Total products found: ${products.length}`);

    const parsePrice = (price: string | null | undefined): number => {
      if (!price) return Infinity;
      const clean = price.toString().replace(/[^\d]/g, "");
      return parseFloat(clean) || Infinity;
    };

    const decproducts = [...products].sort(
      (a, b) => parsePrice(b.price) - parsePrice(a.price)
    );

    const uniqueProducts = SelectTop10(decproducts);
    console.log(`🎯 Selected top products: ${uniqueProducts.length}`);

    const finalProducts = uniqueProducts.map((product) => ({
      title: product.title,
      price: parseInt(product.price),
      url: product.href,
      img: product.img,
      site: product.site,
    }));

    // Enhanced error handling for database operations
    const productIds: number[] = [];
    let savedCount = 0;
    let failedCount = 0;

    console.log(`💾 Saving ${finalProducts.length} products to database...`);

    for (const product of finalProducts) {
      try {
        const id = await saveListing(product);
        productIds.push(id);
        savedCount++;
        console.log(
          `✅ Saved ${savedCount}/${
            finalProducts.length
          }: ${product.title.substring(0, 50)}...`
        );
      } catch (error) {
        failedCount++;
        console.error(
          `❌ Failed to save product ${failedCount}: ${product.title.substring(
            0,
            50
          )}...`
        );
        console.error(
          `   Error: ${(error as Error)?.message || "Unknown error"}`
        );
        console.error(`   Platform: ${product.site}`);
        console.error(`   URL: ${product.url}`);
      }
    }

    if (failedCount > 0) {
      console.log(
        `⚠️ Database save summary: ${savedCount} saved, ${failedCount} failed`
      );
    }

    // Record query execution
    try {
      const queryId = await recordQueryRun(productName);

      if (productIds.length > 0) {
        await prisma.productQueries.createMany({
          data: productIds.map((productId) => ({
            productId,
            queryId,
          })),
          skipDuplicates: true,
        });
        console.log(
          `📊 Query execution recorded: ${productIds.length} products linked to query "${productName}"`
        );
      }
    } catch (error) {
      console.error(`❌ Failed to record query execution:`, error);
    }

    console.log(
      `🎉 Scraping completed for "${productName}": ${savedCount} products saved successfully`
    );
    return finalProducts;
  } catch (error) {
    console.error(
      `🚨 CRITICAL ERROR in scrapeAll for "${productName}":`,
      error
    );
    console.error(`Stack trace:`, (error as Error)?.stack);

    // Return empty array instead of undefined to prevent further issues
    return [];
  }
}
