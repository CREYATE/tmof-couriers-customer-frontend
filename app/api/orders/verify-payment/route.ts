import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post('http://localhost:8080/api/orders/verify-payment', body, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Verify payment proxy error:', error);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to verify payment';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
