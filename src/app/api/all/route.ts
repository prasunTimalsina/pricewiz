import { scrapeDaraz } from "../../../lib/daraz";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        const lowPrice = 100;
        const highPrice = 1000;

        const searchURL = `https://www.daraz.com.np/catalog/?q=${query}&price=${lowPrice}-${highPrice}`;
        const products = await scrapeDaraz(searchURL);

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Error scraping Daraz:", error);
        return NextResponse.json({ error: "Failed to scrape Daraz" }, { status: 500 });
    }
}

