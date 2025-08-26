import { NextResponse } from "next/server";
import prisma from "@/lib/data/prisma";

export async function POST(req: Request) {
  try {
    const { email, minPrice, listing } = await req.json();

    if (!email || !minPrice || !listing?.id || !listing?.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new Track
    const track = await prisma.track.create({
      data: {
        email,
        minPrice: Number(minPrice),
        listing: { connect: { id: listing.id } }, // connect Track to Listing
        prodTitle: listing.title,
      },
    });

    return NextResponse.json({ success: true, track });
  } catch (error: any) {
    console.error("Error creating track:", error);
    return NextResponse.json(
      { error: "Failed to create track" },
      { status: 500 }
    );
  }
}
