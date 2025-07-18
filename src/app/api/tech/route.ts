import { scrapeIiti } from "../../../lib/scrapper/itti";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const Iurl = `https://itti.com.np/search/result?q=${query}&category_type=search`;
    const products = await scrapeIiti(Iurl);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error scraping itti:", error);
    return NextResponse.json(
      { error: "Failed to scrape itti" },
      { status: 500 }
    );
  }
}
