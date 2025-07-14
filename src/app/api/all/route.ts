import { scrapeDaraz } from "../../../lib/daraz";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();


        const searchURL = `https://www.daraz.com.np/catalog/?spm=a2a0e.tm80335409.search.d_go&q=${query}`;
        const products = await scrapeDaraz(searchURL);

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Error scraping Daraz:", error);
        return NextResponse.json({ error: "Failed to scrape Daraz" }, { status: 500 });
    }
}

