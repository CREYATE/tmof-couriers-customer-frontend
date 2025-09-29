import { NextRequest, NextResponse } from 'next/server';

interface EstimateRequest {
  pickupAddress: string;
  deliveryAddress: string;
  weight?: number;
  serviceType: string;
}

interface EstimateResponse {
  distanceKm: number;
  price: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EstimateRequest = await request.json();

    // Validate required fields
    if (!body.pickupAddress || !body.deliveryAddress || !body.serviceType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: pickupAddress, deliveryAddress, and serviceType are required',
          distanceKm: 0,
          price: 0
        },
        { status: 400 }
      );
    }

    // Prepare request for backend
    const backendRequest = {
      pickupAddress: body.pickupAddress.trim(),
      deliveryAddress: body.deliveryAddress.trim(),
      weight: body.weight || 1.0, // Default to 1kg if not provided
      serviceType: body.serviceType.toUpperCase(),
      // Add other fields that might be expected by the backend
      recipientName: "Guest User", // Placeholder for public estimates
      recipientPhone: "0000000000", // Placeholder for public estimates
      description: "Quotation estimate" // Placeholder for public estimates
    };

    console.log('Making public estimate request to backend:', backendRequest);

    // Call the public backend endpoint
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/orders/public/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header needed for public endpoint
      },
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Backend response error:', errorData);
      return NextResponse.json(
        { 
          error: errorData.error || `Backend error: ${response.status} ${response.statusText}`,
          distanceKm: 0,
          price: 0
        },
        { status: response.status }
      );
    }

    const data: EstimateResponse = await response.json();
    console.log('Backend response:', data);

    // Validate backend response
    if (data.error) {
      return NextResponse.json(
        { 
          error: data.error,
          distanceKm: 0,
          price: 0
        },
        { status: 400 }
      );
    }

    if (data.distanceKm == null || data.price == null) {
      return NextResponse.json(
        { 
          error: 'Invalid response from backend: missing distance or price',
          distanceKm: 0,
          price: 0
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      distanceKm: Number(data.distanceKm),
      price: Number(data.price),
    });

  } catch (error: any) {
    console.error('Public estimate API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error.message || 'Unknown error'),
        distanceKm: 0,
        price: 0
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}