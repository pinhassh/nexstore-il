// Israel's geographic centre (Beer-Sheva / Negev midpoint)
const ISRAEL_LAT = 31.0461;
const ISRAEL_LNG = 34.8516;

// Shipping rate: $5 base + $0.01 per km
const BASE_USD = 5;
const RATE_PER_KM = 0.01;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance (km) between a point and Israel's centre. */
export function distanceFromIsraelKm(lat: number, lng: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat - ISRAEL_LAT);
  const dLng = toRad(lng - ISRAEL_LNG);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(ISRAEL_LAT)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Shipping cost in USD rounded to 2 dp. */
export function calcShippingCost(lat: number, lng: number): number {
  const km = distanceFromIsraelKm(lat, lng);
  return Math.round((BASE_USD + km * RATE_PER_KM) * 100) / 100;
}
