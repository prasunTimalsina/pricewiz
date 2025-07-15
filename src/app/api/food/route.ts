import { scrapeFoodMandu } from "../../../lib/foodmandu";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        const Furl = `https://foodmandu.com/Restaurant/Index?q=${query}&k=restaurant&cty=1`;

        const products = await scrapeFoodMandu(Furl);

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Error scraping foodmandu:", error);
        return NextResponse.json({ error: "Failed to scrape foodmandu" }, { status: 500 });
    }
}

