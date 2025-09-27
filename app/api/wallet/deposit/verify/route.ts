import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Verify deposit request received:', body);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await axios.post('http://localhost:8080/api/wallet/deposit/verify', body, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend verify response:', response.data);

    if (response.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: response.data?.error || 'Verification failed' },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error('Verify deposit API error:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.response?.data?.error || error.response?.data || error.message || 'Deposit verification failed' 
      },
      { status: error.response?.status || 500 }
    );
  }
}