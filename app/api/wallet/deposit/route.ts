import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post('http://localhost:8080/api/wallet/deposit', body, {
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error || 'Deposit failed' },
      { status: error.response?.status || 500 }
    );
  }
}