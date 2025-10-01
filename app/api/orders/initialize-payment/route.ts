import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Initialize-payment route - Received request:', body);
    const response = await axios.post(`${process.env.BACKEND_URL || 'http://localhost:8080'}/api/orders/initialize-payment`, body, {      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });
    console.log('Initialize-payment route - Backend response:', response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Initialize-payment route - Error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to initialize payment';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
