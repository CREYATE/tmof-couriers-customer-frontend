import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('API route received:', body);
    const { path, ...data } = body;

    if (!path) {
      console.error('Missing path in request body');
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    let backendEndpoint: string;
    switch (path) {
      case 'login':
        backendEndpoint = `${BACKEND_URL}/api/customer/login`;
        break;
      case 'signup':
        backendEndpoint = `${BACKEND_URL}/api/customer/signup`;
        break;
      case 'google-signin':
        backendEndpoint = `${BACKEND_URL}/api/customer/google-signin`;
        break;
      default:
        console.error('Invalid path:', path);
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    console.log('Forwarding to backend:', backendEndpoint, data);
    const response = await axios.post(backendEndpoint, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Backend response:', response.data);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('API route error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}