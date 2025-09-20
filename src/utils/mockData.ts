// Mock data generator for AirGuard Pro
import { APP_CONFIG } from '@/config/airQualityConfig';

export interface AQIData {
  aqi: number;
  level: string;
  primaryPollutant: string;
  location: string;
  timestamp: string;
  pollutants: {
    PM25: number;
    PM10: number;
    O3: number;
    NO2: number;
    SO2: number;
    CO: number;
  };
  coordinates: [number, number];
}

export interface ForecastData {
  timestamp: string;
  aqi: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pollutants: {
    PM25: number;
    PM10: number;
    O3: number;
    NO2: number;
    SO2: number;
    CO: number;
  };
}

// Generate mock current AQI data
export const generateMockAQIData = (location: string = "New Delhi"): AQIData => {
  const baseAQI = Math.floor(Math.random() * 300) + 20;
  const pollutants = {
    PM25: Math.floor(Math.random() * 100) + 10,
    PM10: Math.floor(Math.random() * 200) + 20,
    O3: Math.floor(Math.random() * 150) + 20,
    NO2: Math.floor(Math.random() * 100) + 15,
    SO2: Math.floor(Math.random() * 80) + 5,
    CO: Math.floor(Math.random() * 50) + 1
  };

  // Determine primary pollutant (highest relative to threshold)
  const primaryPollutant = Object.entries(pollutants).reduce((max, [key, value]) => {
    const threshold = APP_CONFIG.POLLUTANTS[key as keyof typeof APP_CONFIG.POLLUTANTS]?.defaultThreshold || 100;
    const ratio = value / threshold;
    return ratio > (pollutants[max as keyof typeof pollutants] / (APP_CONFIG.POLLUTANTS[max as keyof typeof APP_CONFIG.POLLUTANTS]?.defaultThreshold || 100))
      ? key : max;
  }, 'PM25');

  const coordinates: [number, number] = location === "New Delhi" 
    ? [77.2090 + (Math.random() - 0.5) * 0.1, 28.6139 + (Math.random() - 0.5) * 0.1]
    : [77.2090 + (Math.random() - 0.5) * 2, 28.6139 + (Math.random() - 0.5) * 2];

  return {
    aqi: baseAQI,
    level: Object.values(APP_CONFIG.AQI_LEVELS).find(level => baseAQI <= level.max)?.label || "Hazardous",
    primaryPollutant,
    location,
    timestamp: new Date().toISOString(),
    pollutants,
    coordinates
  };
};

// Generate forecast data
export const generateForecastData = (hours: number = 24): ForecastData[] => {
  const forecasts: ForecastData[] = [];
  const baseAQI = Math.floor(Math.random() * 200) + 30;
  
  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(Date.now() + i * 60 * 60 * 1000).toISOString();
    const variation = (Math.random() - 0.5) * 40;
    const aqi = Math.max(20, Math.min(400, baseAQI + variation + Math.sin(i / 4) * 20));
    
    forecasts.push({
      timestamp,
      aqi: Math.floor(aqi),
      temperature: Math.floor(Math.random() * 15) + 20,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      pollutants: {
        PM25: Math.floor(Math.random() * 80) + 10,
        PM10: Math.floor(Math.random() * 150) + 20,
        O3: Math.floor(Math.random() * 120) + 20,
        NO2: Math.floor(Math.random() * 80) + 15,
        SO2: Math.floor(Math.random() * 60) + 5,
        CO: Math.floor(Math.random() * 40) + 1
      }
    });
  }
  
  return forecasts;
};

// Generate multiple locations data
export const generateMultiLocationData = (): AQIData[] => {
  const locations = [
    "New Delhi",
    "Mumbai", 
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow"
  ];
  
  return locations.map(location => generateMockAQIData(location));
};

// Generate historical data
export const generateHistoricalData = (days: number = 30): { date: string; aqi: number }[] => {
  const historical = [];
  const baseAQI = Math.floor(Math.random() * 150) + 50;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 60;
    const seasonalEffect = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 30;
    const aqi = Math.max(20, Math.min(400, baseAQI + variation + seasonalEffect));
    
    historical.push({
      date: date.toISOString().split('T')[0],
      aqi: Math.floor(aqi)
    });
  }
  
  return historical;
};

// Generate alerts data
export interface AlertData {
  id: string;
  type: 'high' | 'moderate' | 'reminder';
  location: string;
  aqi: number;
  pollutant: string;
  timestamp: string;
  read: boolean;
  message: string;
}

export const generateAlertsData = (): AlertData[] => {
  const alerts: AlertData[] = [];
  const locations = ["New Delhi", "Mumbai", "Bangalore"];
  
  for (let i = 0; i < 10; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const aqi = Math.floor(Math.random() * 300) + 50;
    const type = aqi > 150 ? 'high' : aqi > 100 ? 'moderate' : 'reminder';
    const pollutant = ['PM2.5', 'PM10', 'O3', 'NO2'][Math.floor(Math.random() * 4)];
    
    alerts.push({
      id: `alert-${i}`,
      type,
      location,
      aqi,
      pollutant,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      read: Math.random() > 0.3,
      message: `${location} AQI is ${aqi}. Primary pollutant: ${pollutant}.`
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};