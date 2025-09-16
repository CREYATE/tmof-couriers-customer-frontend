// utils/secureGoogleMaps.ts

export const loadGoogleMapsApi = async (): Promise<void> => {
  // No direct API loading, just log for proxy
  return new Promise((resolve) => {
    console.log('Using secure maps proxy for Google Maps functionality');
    resolve();
  });
};

export const calculateDistanceSecure = async (
  origins: string,
  destinations: string
): Promise<{ distance: number; duration: number } | null> => {
  try {
    console.log('Calling Spring Boot proxy for distance calculation:', { origins, destinations });

    const response = await fetch('/api/maps/distance-matrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origins,
        destinations,
        mode: 'driving',
        units: 'metric'
      })
    });

    const data = await response.json();

    console.log('Spring Boot proxy response:', data);

    if (response.ok && data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
      const element = data.rows[0].elements[0];
      const result = {
        distance: Math.round(element.distance.value / 1000 * 100) / 100,
        duration: element.duration.value
      };
      console.log('Distance calculation successful:', result);
      return result;
    } else {
      console.warn('Distance calculation failed - API response status:', data.status);
      if (data.error_message) {
        console.warn('API error message:', data.error_message);
      }
      return null;
    }
  } catch (error) {
    console.error('Secure distance calculation failed:', error);
    return null;
  }
};

export const geocodeAddressSecure = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    console.log('Calling Spring Boot proxy for geocoding:', address);

    const response = await fetch('/api/maps/geocoding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });

    const data = await response.json();

    console.log('Geocoding proxy response:', data);

    if (response.ok && data.status === 'OK' && data.results?.[0]) {
      const location = data.results[0].geometry.location;
      const result = { lat: location.lat, lng: location.lng };
      console.log('Geocoding successful:', result);
      return result;
    } else {
      console.warn('Geocoding failed - API response status:', data.status);
      if (data.error_message) {
        console.warn('API error message:', data.error_message);
      }
      return null;
    }
  } catch (error) {
    console.error('Secure geocoding failed:', error);
    return null;
  }
};