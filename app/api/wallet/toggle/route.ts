import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activate = searchParams.get('activate');
    if (activate === null) {
      throw new Error('Missing activate parameter');
    }

    const response = await axios.post(`${BACKEND_URL}/api/wallet/toggle?activate=${activate}`, {}, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Wallet toggle proxy error:', error);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to toggle wallet status';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}