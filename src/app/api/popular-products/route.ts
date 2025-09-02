// app/api/products/route.ts
import prisma from "@/lib/data/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      take: 20, // limit to 20
      orderBy: {
        popularity: "desc", // most popular first
      },
      include: {
        listings: true, // include related listings
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
