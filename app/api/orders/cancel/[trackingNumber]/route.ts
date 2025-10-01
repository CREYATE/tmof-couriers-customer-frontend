import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const { trackingNumber } = params;

const response = await axios.post(`${process.env.BACKEND_URL || 'http://localhost:8080'}/api/orders/cancel/${trackingNumber}`, {}, {      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    console.log('Cancel response:', response.data);

    return NextResponse.json({}, { status: response.status });
  } catch (error: any) {
    console.error('Cancel proxy error:', error);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to cancel order';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}