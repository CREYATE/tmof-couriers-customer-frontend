import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get('http://localhost:8080/api/wallet/balance', {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch wallet balance' },
      { status: error.response?.status || 500 }
    );
  }
}