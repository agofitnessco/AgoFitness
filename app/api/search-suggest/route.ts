import { getProducts } from "lib/shopify";
import { NextRequest, NextResponse } from "next/server";

const SUGGEST_LIMIT = 4;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const query = req.nextUrl.searchParams.get("q")?.trim() || undefined;

  const products = await getProducts(
    query
      ? { query, sortKey: "RELEVANCE" }
      : { sortKey: "BEST_SELLING", reverse: true },
  );

  return NextResponse.json({ products: products.slice(0, SUGGEST_LIMIT) });
}
