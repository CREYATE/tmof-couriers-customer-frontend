import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const type = searchParams.get('type');

    // Build the backend URL with query parameters
    let backendUrl = `http://localhost:8080/api/wallet/transactions?page=${page}&size=${size}`;
    if (type) {
      backendUrl += `&type=${type}`;
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const response = await axios.get(backendUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Transactions API error:', error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Access denied. Please check your authentication.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch transactions' },
      { status: error.response?.status || 500 }
    );
  }
}