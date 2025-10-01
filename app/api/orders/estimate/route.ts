import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log('Estimate request body:', body);

    // Ensure includeTrailer is included, default to false if not provided
    const requestBody = {
      pickupAddress: body.pickupAddress,
      deliveryAddress: body.deliveryAddress,
      weight: body.weight || 1.0,
      serviceType: body.serviceType,
      includeTrailer: body.includeTrailer ?? false, // Default to false if undefined
      description: body.description,
      recipientName: body.recipientName,
      recipientPhone: body.recipientPhone,
      recipientEmail: body.recipientEmail,
      deliveryNotes: body.deliveryNotes,
      preferredTime: body.preferredTime,
      useWallet: body.useWallet,
    };

  const response = await axios.post(`${process.env.BACKEND_URL || 'http://localhost:8080'}/api/orders/estimate`, requestBody, {      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    // Log the full response for debugging
    console.log('Estimate response:', response.data);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Estimate proxy error:', error);
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'Failed to calculate estimate';
    return NextResponse.json(
      {
        error: errorMessage,
        distanceKm: 0.0,
        price: 0.0,
        baseFee: 0.0,
        trailerFee: 0.0,
      },
      { status }
    );
  }
}