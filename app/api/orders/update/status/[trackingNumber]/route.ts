import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ trackingNumber: string }> }) {
  try {
    const body = await request.json();
    const { trackingNumber } = await params;
    const response = await axios.put(`${BACKEND_URL}/api/orders/update/status/${trackingNumber}`, body, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Update status proxy error:', error);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to update status';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
