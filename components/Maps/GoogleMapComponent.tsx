"use client";

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = { lat: -26.2041, lng: 28.0473 }; // Johannesburg

export default function TrackParcelMap({ trackingNumber, currentLocation }: { trackingNumber: string; currentLocation: string | null }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (currentLocation) {
      const [lat, lng] = currentLocation.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition({ lat, lng });
      } else {
        console.error('Invalid location format:', currentLocation);
        setPosition(null);
      }
    } else {
      setPosition(null);
    }
  }, [currentLocation]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || defaultCenter}
        zoom={position ? 15 : 10}
      >
        {position && (
          <Marker
            position={position}
            label={{ text: `Parcel ${trackingNumber}`, color: 'black' }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}