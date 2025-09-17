import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const body = await request.json();
    console.log('Orders API route received:', body);
    
    const { path } = await params; // Await params
    const pathString = path.join('/'); // e.g., 'estimate', 'initialize-payment', 'verify-payment'

    const backendEndpoint = `${BACKEND_URL}/api/orders/${pathString}`;
    console.log('Forwarding to backend:', backendEndpoint, body);

    try {
        const token = request.headers.get('authorization');
        const response = await axios.post(backendEndpoint, body, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Orders API route error:', error.message);
        return NextResponse.json({ error: error.message }, { status: error.response?.status || 500 });
    }
}