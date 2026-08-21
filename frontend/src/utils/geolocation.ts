/**
 * GPS and Real-Time Geolocation Utilities for AquaRegen
 */

export interface LocationDetectionResult {
  location: string;
  latitude: number;
  longitude: number;
  annualRainfall: number;
  temperature?: number;
  humidity?: number;
}

export const detectCurrentLocation = async (): Promise<LocationDetectionResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.suburb ||
            data.address?.county ||
            data.address?.state_district ||
            'Detected Location';
          const state = data.address?.state || '';
          const country = data.address?.country_code?.toUpperCase() || '';
          const locationName = `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;

          // Fetch live annual rainfall from Open-Meteo
          let annualRain = 850;
          let temp = 26;
          let humidity = 60;

          try {
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&current=temperature_2m,relative_humidity_2m&past_days=90&forecast_days=7&timezone=auto`
            );
            if (weatherRes.ok) {
              const weatherData = await weatherRes.json();
              const precipList = weatherData.daily?.precipitation_sum || [];
              const sum90 = precipList.reduce((a: number, b: number) => a + (b || 0), 0);
              annualRain = Math.round(Math.max(300, sum90 * 3.8));
              temp = weatherData.current?.temperature_2m || 26;
              humidity = weatherData.current?.relative_humidity_2m || 60;
            }
          } catch (e) {
            console.warn('Live weather lookup error:', e);
          }

          resolve({
            location: locationName,
            latitude: lat,
            longitude: lon,
            annualRainfall: annualRain,
            temperature: temp,
            humidity
          });
        } catch (err) {
          reject(err);
        }
      },
      error => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === 1) {
          msg = 'Location permission denied. You can still type your city manually.';
        } else if (error.code === 2) {
          msg = 'Location position unavailable. Please type your city manually.';
        } else if (error.code === 3) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
};
