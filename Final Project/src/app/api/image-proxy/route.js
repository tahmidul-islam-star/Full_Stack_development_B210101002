import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "url parameter is required" }, { status: 400 });
    }

    // Fetch image server-side to bypass browser CORS rules
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch image: ${response.statusText}` }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      dataUrl,
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
