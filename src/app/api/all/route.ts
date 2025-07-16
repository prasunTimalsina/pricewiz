import { scrapeDaraz } from "@/lib/daraz";
import { scrapeIiti } from "@/lib/itti";
import { scrapeHamrobazaar } from "@/lib/hamrobazar";
import { scrapeFoodMandu } from "@/lib/foodmandu";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    console.time("Total time");

    const Durl = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`;
    const Iurl = `https://itti.com.np/search/result?q=${query}&category_type=search`;
    const Hurl = `https://hamrobazaar.com/search/product?q=${query}`;
    const Furl = `https://foodmandu.com/Restaurant/Index?q=${query}&k=restaurant&cty=1`;

    const hamroPromise = (async () => {
      console.time("Hamrobazaar time");
      const Hproducts = await scrapeHamrobazaar(Hurl);
      console.timeEnd("Hamrobazaar time");
      return Hproducts;
    })();

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

    const foodPromise = (async () => {
      console.time("Foodmandu time");
      const Fproducts = await scrapeFoodMandu(Furl);
      console.timeEnd("Foodmandu time");
      return Fproducts;
    })();

    const [Hproducts, Dproducts, Iproducts, Fproducts] = await Promise.all([
      hamroPromise,
      darazPromise,
      ittiPromise,
      foodPromise,
    ]);

    console.timeEnd("Total time");

    const products = [...Dproducts, ...Iproducts];

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
