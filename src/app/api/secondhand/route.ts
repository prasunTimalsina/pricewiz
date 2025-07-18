import { scrapeHamrobazaar } from "../../../lib/scrapper/hamrobazar";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const Hurl = `https://hamrobazaar.com/search/product?q=${query}`;
    const products = await scrapeHamrobazaar(Hurl);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error scraping hamrobazar:", error);
    return NextResponse.json(
      { error: "Failed to scrape hamrobazar" },
      { status: 500 }
    );
  }
}
