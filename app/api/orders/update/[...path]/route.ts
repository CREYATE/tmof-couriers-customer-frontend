import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const body = await request.json();
    console.log('Order update route - Received request:', body);
    const { path } = await params;
    const pathString = path.join('/');

    const backendEndpoint = `${BACKEND_URL}/api/orders/update/${pathString}`;
    console.log('Order update route - Backend endpoint:', backendEndpoint);
    const response = await axios.put(backendEndpoint, body, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });
    console.log('Order update route - Backend response:', response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Order update route - Error:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to update order';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}