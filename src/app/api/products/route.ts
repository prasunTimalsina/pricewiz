import { NextResponse } from "next/server";
import prisma from "../../../lib/data/prisma";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("query")?.trim();
  if (!q)
    return NextResponse.json({ error: "query is required" }, { status: 400 });

  const products = await prisma.product.findMany({
    where: {
      title: { search: q }, // uses the GIN index
    },
    orderBy: {
      _relevance: {
        // ranks by ts_rank_cd()
        fields: ["title"],
        search: q,
        sort: "desc",
      },
    },
    take: 20,
    select: { id: true, title: true },
  });

  return NextResponse.json(products);
}
