import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post('http://localhost:8080/api/wallet/deposit/verify', body, {
            headers: {
                Authorization: request.headers.get('Authorization') || '',
                'Content-Type': 'application/json',
            },
        });
        
        // Handle both success and error responses from backend
        if (response.status === 200) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { success: false, error: response.data?.error || 'Verification failed' },
                { status: response.status }
            );
        }
    } catch (error: any) {
        console.error('Verify deposit API error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.response?.data?.error || error.response?.data || error.message || 'Deposit verification failed' 
            },
            { status: error.response?.status || 500 }
        );
    }
}