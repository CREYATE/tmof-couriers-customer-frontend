import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/orders/history`, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Order history proxy error:', error);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to fetch order history';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}