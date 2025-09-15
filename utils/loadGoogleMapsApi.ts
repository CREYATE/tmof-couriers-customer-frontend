declare global {
	interface Window {
		google?: any;
	}
}

export const loadGoogleMapsApi = async () => {
	window.google = window.google || {};
	window.google.maps = window.google.maps || { places: {} };
};