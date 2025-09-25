import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const type = searchParams.get('type');

    const url = new URL('http://localhost:8080/api/wallet/transactions');
    url.searchParams.set('page', page);
    url.searchParams.set('size', size);
    if (type) url.searchParams.set('type', type);

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch transactions' },
      { status: error.response?.status || 500 }
    );
  }
}