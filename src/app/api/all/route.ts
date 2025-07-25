import { scrapeDaraz } from "@/lib/scrapper/daraz";
import { scrapeIiti } from "@/lib/scrapper/itti";
import { scrapeHamrobazaar } from "@/lib/scrapper/hamrobazar";
import { ScrapeHukut } from "@/lib/scrapper/hukut";
import { scrapeFoodMandu } from "@/lib/foodmandu";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`;
    const Iurl = `https://itti.com.np/search/result?q=${query}&category_type=search`;
    const HUurl = `https://hukut.com/search/${query}`;
    const Hurl = `https://hamrobazaar.com/search/product?q=${query}`;
    const Furl = `https://foodmandu.com/Restaurant/Index?q=${query}&k=restaurant&cty=1`;

    const hamroPromise = (async () => {
      const Hproducts = await scrapeHamrobazaar(Hurl);
      return Hproducts;
    })();

    const darazPromise = (async () => {
      const Dproducts = await scrapeDaraz(Durl);
      return Dproducts;
    })();

    const ittiPromise = (async () => {
      const Iproducts = await scrapeIiti(Iurl);
      return Iproducts;
    })();

    const hukutPromise = (async () => {
      const Huproducts = await ScrapeHukut(HUurl);
      return Huproducts;
    })();

    const foodPromise = (async () => {
      const Fproducts = await scrapeFoodMandu(Furl);
      return Fproducts;
    })();

    const [Hproducts, Dproducts, Iproducts, Huproducts, Fproducts] =
      await Promise.all([
        hamroPromise,
        darazPromise,
        ittiPromise,
        hukutPromise,
        foodPromise,
      ]);


    const products = [...Dproducts, ...Iproducts, ...Huproducts];

    const parsePrice = (price: string | null | undefined): number => {
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

    return NextResponse.json([
      ascproducts,
      decproducts,
      Iproducts,
      Dproducts,
      Hproducts,
      Huproducts,
      Fproducts,
    ]);
  } catch (error) {
    console.error("Error scraping:", error);
    return NextResponse.json(
      { error: "Failed to scrape one or more sources." },
      { status: 500 }
    );
  }
}
