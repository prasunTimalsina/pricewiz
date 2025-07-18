import { NextRequest, NextResponse } from "next/server";
import { scrapeAll } from "@/lib/data/index";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid query provided." },
        { status: 400 }
      );
    }

    const results = await scrapeAll(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in scraping process:", error);
    return NextResponse.json(
      { error: "Failed to scrape one or more sources." },
      { status: 500 }
    );
  }
}
