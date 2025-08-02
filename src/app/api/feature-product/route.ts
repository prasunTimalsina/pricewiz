import { NextResponse } from "next/server";
import prisma from "@/lib/data/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productIds } = body;

    if (
      !Array.isArray(productIds) ||
      productIds.some((id) => typeof id !== "number")
    ) {
      return NextResponse.json(
        { error: "productIds must be an array of numbers" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        listings: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
