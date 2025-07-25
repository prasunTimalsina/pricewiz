// app/api/product/[id]/route.ts
import prisma from "@/lib/data/prisma";
import { getSimilarProducts } from "@/lib/data/tfidf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  // Fetch the base product
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      listings: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Fetch other products for recommendation
  const otherProducts = await prisma.product.findMany({
    where: {
      id: {
        not: id,
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Compute recommendations using cosine similarity
  const similarProductsRaw = getSimilarProducts(product, otherProducts);

  const recommended = similarProductsRaw
    .filter((p) => p.similarity > 0.2) // tweak similarity threshold
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5); // return top 5

  return NextResponse.json({
    product,
    recommendedProducts: recommended,
  });
}
