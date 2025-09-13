import GoogleMapComponent from '@/components/Maps/GoogleMapComponent';
import LocationPicker from '@/components/Maps/LocationPicker';

export default function MapPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#ffd215]">Map</h1>
      <LocationPicker />
      <GoogleMapComponent />
    </div>
  );
}