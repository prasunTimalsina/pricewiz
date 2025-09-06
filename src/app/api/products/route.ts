import { NextResponse } from "next/server";
import prisma from "../../../lib/data/prisma";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("query")?.trim();
  if (!q)
    return NextResponse.json({ error: "query is required" }, { status: 400 });

  // Convert multi-word queries to PostgreSQL tsquery format
  // "logitech webcam" becomes "logitech & webcam"
  const searchQuery = q.split(/\s+/).join(" & ");

  const products = await prisma.product.findMany({
    where: {
      title: { search: searchQuery }, // uses the GIN index
    },
    orderBy: {
      _relevance: {
        // ranks by ts_rank_cd()
        fields: ["title"],
        search: searchQuery,
        sort: "desc",
      },
    },
    take: 20,
    include: {
      listings: true, // ✅ include all related listings
    },
  });

  return NextResponse.json(products);
}
