export interface Mosque {
  id?: string;
  namn: string;
  address: string;
  rattsskola: 'sunni' | 'shia';
  lat?: number;
  lng?: number;
  beskrivning?: string;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export type CalculationMethod = 'tehran' | 'mwl'; // Simplified for now
