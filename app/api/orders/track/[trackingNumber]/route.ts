import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest, { params }: { params: Promise<{ trackingNumber: string }> }) {
  try {
    const { trackingNumber } = await params;
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    console.log("Track proxy - Fetching status for trackingNumber:", trackingNumber);

    const response = await axios.get(`${backendUrl}/api/orders/track/${trackingNumber}`, {
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
      },
    });

    console.log("Track proxy - Backend status:", response.status);
    console.log("Track proxy - Backend data:", response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Track proxy error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || "Failed to fetch order status";
    return NextResponse.json({ error: errorMessage }, { status });
  }
}