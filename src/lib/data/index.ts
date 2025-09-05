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
      const Dproducts = await scrapeDaraz(Durl);
      return Dproducts;
    })();

    const ittiPromise = (async () => {
      const Iproducts = await scrapeIiti(Iurl);
      return Iproducts;
    })();

    const hukutPromise = (async () => {
      //const Huproducts = await ScrapeHukut(HUurl);
      //return Huproducts;
      return [];
    })();

    const [Dproducts, Iproducts, Huproducts] = await Promise.all([
      darazPromise,
      ittiPromise,
      hukutPromise,
    ]);

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
      img: product.img,
      site: product.site,
    }));

    const productIds: number[] = [];
    for (const product of finalProducts) {
      const id = await saveListing(product);
      productIds.push(id);
    }

    const queryId = await recordQueryRun(productName);

    await prisma.productQueries.createMany({
      data: productIds.map((productId) => ({
        productId,
        queryId,
      })),
      skipDuplicates: true,
    });

    return finalProducts;
  } catch (error) {
    console.error("Error scraping:", error);
  }
}
