// AirGuard Pro Configuration File
// This file contains all customizable values for the frontend

export const APP_CONFIG = {
  // App Information
  name: "AirGuard Pro",
  tagline: "Breathe Safer with AI-Powered Air Quality Predictions",
  description: "Intelligent air quality forecasting platform combining NASA TEMPO satellite data with ground sensors for predictive air quality alerts.",
  
  // Company Information
  company: {
    name: "AirGuard Technologies",
    email: "support@airguardpro.com",
    phone: "+1-800-AIR-GUARD",
    address: "123 Clean Air Drive, Sky City, CA 90210"
  },

  // Air Quality Index Thresholds
  AQI_LEVELS: {
    GOOD: { min: 0, max: 50, label: "Good", color: "#00e400", description: "Air quality is satisfactory" },
    MODERATE: { min: 51, max: 100, label: "Moderate", color: "#ffff00", description: "Air quality is acceptable" },
    UNHEALTHY_SENSITIVE: { min: 101, max: 150, label: "Unhealthy for Sensitive Groups", color: "#ff7e00", description: "Sensitive individuals may experience symptoms" },
    UNHEALTHY: { min: 151, max: 200, label: "Unhealthy", color: "#ff0000", description: "Everyone may experience symptoms" },
    VERY_UNHEALTHY: { min: 201, max: 300, label: "Very Unhealthy", color: "#8f3f97", description: "Health alert: everyone may experience serious effects" },
    HAZARDOUS: { min: 301, max: 500, label: "Hazardous", color: "#7e0023", description: "Emergency conditions: entire population affected" }
  },

  // Pollutants Configuration
  POLLUTANTS: {
    PM25: {
      name: "PM2.5",
      fullName: "Fine Particulate Matter",
      unit: "μg/m³",
      description: "Particles smaller than 2.5 micrometers",
      healthImpact: "Can penetrate deep into lungs and bloodstream",
      sources: ["Vehicle emissions", "Industrial processes", "Wildfires"],
      defaultThreshold: 35
    },
    PM10: {
      name: "PM10",
      fullName: "Coarse Particulate Matter", 
      unit: "μg/m³",
      description: "Particles smaller than 10 micrometers",
      healthImpact: "Can cause respiratory irritation",
      sources: ["Dust", "Pollen", "Construction"],
      defaultThreshold: 150
    },
    O3: {
      name: "O₃",
      fullName: "Ground-level Ozone",
      unit: "ppb",
      description: "Formed by reaction of sunlight with pollutants",
      healthImpact: "Can cause breathing difficulties",
      sources: ["Vehicle emissions", "Industrial facilities"],
      defaultThreshold: 70
    },
    NO2: {
      name: "NO₂",
      fullName: "Nitrogen Dioxide",
      unit: "ppb", 
      description: "Gas formed from burning fuel",
      healthImpact: "Can inflame airways and worsen asthma",
      sources: ["Vehicle emissions", "Power plants"],
      defaultThreshold: 100
    },
    SO2: {
      name: "SO₂",
      fullName: "Sulfur Dioxide",
      unit: "ppb",
      description: "Gas from burning sulfur-containing fuel",
      healthImpact: "Can cause respiratory problems",
      sources: ["Power plants", "Industrial processes"],
      defaultThreshold: 75
    },
    CO: {
      name: "CO",
      fullName: "Carbon Monoxide",
      unit: "ppm",
      description: "Colorless, odorless gas",
      healthImpact: "Reduces oxygen delivery to organs",
      sources: ["Vehicle emissions", "Faulty heating systems"],
      defaultThreshold: 35
    }
  },

  // Map Configuration
  MAP_SETTINGS: {
    defaultCenter: [28.6139, 77.2090], // New Delhi coordinates
    defaultZoom: 10,
    styles: {
      satellite: "mapbox://styles/mapbox/satellite-v9",
      light: "mapbox://styles/mapbox/light-v11", 
      dark: "mapbox://styles/mapbox/dark-v11",
      streets: "mapbox://styles/mapbox/streets-v12",
      outdoors: "mapbox://styles/mapbox/outdoors-v12"
    }
  },

  // Forecasting Configuration
  FORECAST_PERIODS: {
    hourly: { label: "Next 24 Hours", hours: 24 },
    daily: { label: "Next 7 Days", days: 7 },
    weekly: { label: "Next 4 Weeks", weeks: 4 },
    monthly: { label: "Next 3 Months", months: 3 }
  },

  // Alert Templates
  ALERT_TEMPLATES: {
    sms: {
      high: "🚨 AIR ALERT: {location} AQI is {aqi} ({level}). {pollutant} levels elevated. {recommendation}",
      moderate: "⚠️ Air Quality Alert: {location} AQI {aqi}. Consider limiting outdoor activities.",
      reminder: "📅 Reminder: {location} forecast shows {level} air quality on {date}. Plan accordingly!"
    },
    email: {
      high: {
        subject: "🚨 High Air Quality Alert for {location}",
        body: "Current AQI: {aqi} ({level})\nPrimary Pollutant: {pollutant}\nRecommendation: {recommendation}\n\nStay safe!"
      },
      moderate: {
        subject: "⚠️ Air Quality Advisory for {location}", 
        body: "Current AQI: {aqi}\nConditions: {level}\nAdvice: {recommendation}"
      }
    },
    push: {
      high: { title: "High Air Quality Alert", body: "{location}: AQI {aqi}. {recommendation}" },
      moderate: { title: "Air Quality Advisory", body: "{location}: AQI {aqi}. Consider precautions." }
    }
  },

  // Health Recommendations
  HEALTH_RECOMMENDATIONS: {
    GOOD: {
      general: "Great day for outdoor activities!",
      exercise: "Perfect conditions for all outdoor exercises",
      sensitive: "No precautions needed"
    },
    MODERATE: {
      general: "Generally acceptable air quality",
      exercise: "Outdoor activities are fine for most people",
      sensitive: "Sensitive individuals should consider limiting prolonged outdoor activities"
    },
    UNHEALTHY_SENSITIVE: {
      general: "Sensitive groups should reduce outdoor activities",
      exercise: "Consider indoor alternatives for exercise",
      sensitive: "Limit outdoor activities, especially children and elderly"
    },
    UNHEALTHY: {
      general: "Everyone should limit outdoor activities",
      exercise: "Avoid outdoor exercise, stay indoors",
      sensitive: "Stay indoors, close windows, use air purifiers"
    },
    VERY_UNHEALTHY: {
      general: "Avoid outdoor activities",
      exercise: "Stay indoors, avoid all outdoor exercise",
      sensitive: "Emergency conditions - remain indoors with air purification"
    },
    HAZARDOUS: {
      general: "Emergency conditions - remain indoors",
      exercise: "No outdoor activities",
      sensitive: "Health emergency - seal home, use air purifiers"
    }
  },

  // Data Sources
  DATA_SOURCES: {
    tempo: {
      name: "NASA TEMPO",
      description: "Tropospheric Emissions Monitoring of Pollution",
      resolution: "2.1km × 4.5km",
      updateFrequency: "Hourly",
      coverage: "North America"
    },
    groundSensors: {
      name: "Ground Monitoring Stations", 
      description: "EPA and OpenAQ sensor networks",
      updateFrequency: "Real-time",
      coverage: "Global"
    },
    weather: {
      name: "NOAA Weather Data",
      description: "Meteorological conditions affecting air quality",
      updateFrequency: "Hourly",
      coverage: "Global"
    }
  },

  // Features Toggle
  FEATURES: {
    enableLogin: true,
    enableAlerts: true,
    enableCalendar: true,
    enableForecasting: true,
    enableMaps: true,
    enableExport: true,
    enableCompare: true,
    enableHealthRecommendations: true
  },

  // API Endpoints (Mock data for demo)
  API_ENDPOINTS: {
    currentAQI: "/api/current-aqi",
    forecast: "/api/forecast",
    alerts: "/api/alerts",
    locations: "/api/locations",
    historical: "/api/historical"
  }
};

// Helper functions for configuration
export const getAQILevel = (aqi: number) => {
  const levels = APP_CONFIG.AQI_LEVELS;
  if (aqi <= levels.GOOD.max) return levels.GOOD;
  if (aqi <= levels.MODERATE.max) return levels.MODERATE;
  if (aqi <= levels.UNHEALTHY_SENSITIVE.max) return levels.UNHEALTHY_SENSITIVE;
  if (aqi <= levels.UNHEALTHY.max) return levels.UNHEALTHY;
  if (aqi <= levels.VERY_UNHEALTHY.max) return levels.VERY_UNHEALTHY;
  return levels.HAZARDOUS;
};

export const getPollutantInfo = (pollutant: string) => {
  return APP_CONFIG.POLLUTANTS[pollutant as keyof typeof APP_CONFIG.POLLUTANTS];
};

export const getHealthRecommendation = (level: string) => {
  return APP_CONFIG.HEALTH_RECOMMENDATIONS[level as keyof typeof APP_CONFIG.HEALTH_RECOMMENDATIONS];
};