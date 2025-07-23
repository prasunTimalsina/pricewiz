import { scrapeDaraz } from "@/lib/scrapper/daraz";
import { scrapeIiti } from "@/lib/scrapper/itti";
import { ScrapeHukut } from "@/lib/scrapper/hukut";
import SelectTop10 from "../scrapper/top10Selection";
import { saveListing, recordQueryRun } from "./database";
import prisma from "./prisma";

export async function scrapeAll(productName: string) {
  try {
    const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${productName}`;
    const Iurl = `https://itti.com.np/search/result?q=${productName}&category_type=search`;
    const HUurl = `https://hukut.com/search/${productName}`;

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

    const hukutPromise = (async () => {
      console.time("Hukut time");
      const Huproducts = await ScrapeHukut(HUurl);
      console.timeEnd("Hukut time");
      return Huproducts;
    })();

    const [Dproducts, Iproducts, Huproducts] = await Promise.all([
      darazPromise,
      ittiPromise,
      hukutPromise,
    ]);

    console.timeEnd("Total time");

    const products = [...Dproducts, ...Iproducts, ...Huproducts];

    const parsePrice = (price: string | null | undefined): number => {
      if (!price) return Infinity;
      const clean = price.toString().replace(/[^\d]/g, "");
      return parseFloat(clean) || Infinity;
    };

    const decproducts = [...products].sort(
      (a, b) => parsePrice(b.price) - parsePrice(a.price)
    );

    const uniqueProducts = SelectTop10(decproducts);
    const finalProducts = uniqueProducts.map((product) => ({
      title: product.title,
      price: parseInt(product.price),
      url: product.href,
      imgUrl: product.img,
      platform: product.site,
    }));

    // collect IDs so we could link, if needed
    const productIds: number[] = [];
    for (const product of finalProducts) {
      const id = await saveListing(product);
      productIds.push(id);
    }

    // 1) upsert (or create) the Query row
    //    let’s have recordQueryRun return the Query’s ID:
    const queryId = await recordQueryRun(productName);

    // 2) now link each product to that query:
    await prisma.productQueries.createMany({
      data: productIds.map((productId) => ({
        productId,
        queryId,
      })),
      skipDuplicates: true, // don’t error if you re‑run the same query
    });

    return finalProducts;
  } catch (error) {
    console.error("Error scraping:", error);
  }
}
