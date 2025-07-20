import ScrapeHukut from "@/lib/scrapper/hukut";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const Hurl = `https://hukut.com/search/${query}`;
    const products = await ScrapeHukut(Hurl);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error scraping Daraz:", error);
    return NextResponse.json(
      { error: "Failed to scrape Daraz" },
      { status: 500 }
    );
  }
}
