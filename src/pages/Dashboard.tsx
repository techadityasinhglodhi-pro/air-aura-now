import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AQIGauge from '@/components/common/AQIGauge';
import LocationSearch from '@/components/common/LocationSearch';
import { generateMockAQIData, generateMultiLocationData, type AQIData } from '@/utils/mockData';
import { APP_CONFIG, getAQILevel, getPollutantInfo } from '@/config/airQualityConfig';
import { 
  MapPin, Thermometer, Droplets, Wind, RefreshCw, Clock, Eye, Gauge,
  Sun, Cloud, Umbrella, Snowflake, Activity, Zap, AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [currentData, setCurrentData] = useState<AQIData>(generateMockAQIData("New Delhi"));
  const [locationData, setLocationData] = useState(generateMultiLocationData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [environmentalData, setEnvironmentalData] = useState({
    temperature: Math.floor(Math.random() * 15) + 20,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    pressure: Math.floor(Math.random() * 30) + 1000,
    visibility: Math.floor(Math.random() * 10) + 5,
    uvIndex: Math.floor(Math.random() * 11),
    dewPoint: Math.floor(Math.random() * 10) + 15
  });

  // Auto-detect user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const userLocationData = generateMockAQIData("Your Location");
          setCurrentData(userLocationData);
        },
        () => {
          setCurrentData(generateMockAQIData("New Delhi"));
        }
      );
    }
  }, []);

  const handleLocationSelect = (data: AQIData) => {
    setCurrentData(data);
    // Update environmental data when location changes
    setEnvironmentalData({
      temperature: Math.floor(Math.random() * 15) + 20,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure: Math.floor(Math.random() * 30) + 1000,
      visibility: Math.floor(Math.random() * 10) + 5,
      uvIndex: Math.floor(Math.random() * 11),
      dewPoint: Math.floor(Math.random() * 10) + 15
    });
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentData(generateMockAQIData(currentData.location));
    setLocationData(generateMultiLocationData());
    setEnvironmentalData({
      temperature: Math.floor(Math.random() * 15) + 20,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure: Math.floor(Math.random() * 30) + 1000,
      visibility: Math.floor(Math.random() * 10) + 5,
      uvIndex: Math.floor(Math.random() * 11),
      dewPoint: Math.floor(Math.random() * 10) + 15
    });
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const pollutantCards = Object.entries(currentData.pollutants).map(([key, value]) => {
    const info = getPollutantInfo(key);
    const level = value > (info?.defaultThreshold || 100) ? 'high' : value > (info?.defaultThreshold || 100) * 0.7 ? 'medium' : 'low';
    
    return {
      name: info?.name || key,
      value,
      unit: info?.unit || '',
      level,
      description: info?.description || '',
      threshold: info?.defaultThreshold || 100
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header with Location Search */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Real-time Air Quality Dashboard</h1>
            <p className="text-muted-foreground mt-2">Live air quality data from NASA TEMPO and ground sensors</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              onClick={refreshData} 
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="max-w-xl">
          <LocationSearch 
            onLocationSelect={handleLocationSelect}
            placeholder="Search for any location to monitor air quality..."
            autoDetect={true}
          />
        </div>
      </div>

      {/* Current Location Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AQI Display */}
        <Card className="lg:col-span-1 text-center p-6 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <MapPin className="w-5 h-5 mr-2" />
              {currentData.location}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AQIGauge aqi={currentData.aqi} size="xl" />
            <div className="mt-8">
              <p className="text-sm text-muted-foreground">Primary Pollutant</p>
              <Badge variant="outline" className="mt-1">
                {getPollutantInfo(currentData.primaryPollutant)?.name || currentData.primaryPollutant}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Conditions - Enhanced */}
        <Card className="lg:col-span-2 shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Environmental Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="font-semibold">{environmentalData.temperature}°C</p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-semibold">{environmentalData.humidity}%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <Wind className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold">{environmentalData.windSpeed} km/h</p>
                  <p className="text-sm text-muted-foreground">Wind {environmentalData.windDirection}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <Gauge className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="font-semibold">{environmentalData.pressure} hPa</p>
                  <p className="text-sm text-muted-foreground">Pressure</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
                <Sun className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="font-semibold">UV {environmentalData.uvIndex}</p>
                  <p className="text-sm text-muted-foreground">UV Index</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
                <Eye className="w-8 h-8 text-gray-500" />
                <div>
                  <p className="font-semibold">{environmentalData.visibility} km</p>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
                <Droplets className="w-8 h-8 text-teal-500" />
                <div>
                  <p className="font-semibold">{environmentalData.dewPoint}°C</p>
                  <p className="text-sm text-muted-foreground">Dew Point</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
                <Zap className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="font-semibold">{getAQILevel(currentData.aqi).label}</p>
                  <p className="text-sm text-muted-foreground">Air Quality</p>
                </div>
              </div>
            </div>
            
            {/* Health Recommendation */}
            <div className="mt-6 p-4 rounded-lg bg-muted/30">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Health Recommendation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getAQILevel(currentData.aqi).description}. 
                    {currentData.aqi > 100 ? ' Consider limiting outdoor activities.' : ' Great day for outdoor activities!'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Pollutant Analysis - Enhanced */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Detailed Pollutant Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">Individual pollutant levels with enhanced circular indicators</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pollutantCards.map((pollutant, index) => (
              <div key={pollutant.name} className="text-center space-y-4 slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative mx-auto group-hover:scale-105 transition-smooth">
                  {/* Enhanced Circular Progress */}
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-muted/20"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={getAQILevel(Math.min(pollutant.value / pollutant.threshold * 100, 400)).color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${(Math.min(pollutant.value / pollutant.threshold, 1) * 283)} 283`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(var(--primary), 0.3))'
                        }}
                      />
                    </svg>
                    {/* Center Values */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-lg font-bold">{pollutant.value}</div>
                      <div className="text-xs text-muted-foreground">{pollutant.unit}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{pollutant.name}</h3>
                  <p className="text-xs text-muted-foreground px-2">{pollutant.description}</p>
                  <div className="space-y-1">
                    <Badge 
                      variant={pollutant.level === 'high' ? 'destructive' : pollutant.level === 'medium' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {pollutant.level === 'high' ? 'Above Threshold' : pollutant.level === 'medium' ? 'Moderate' : 'Good'}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Threshold: {pollutant.threshold} {pollutant.unit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 p-4 rounded-lg bg-muted/20 border-l-4 border-primary">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Primary Pollutant: {getPollutantInfo(currentData.primaryPollutant)?.fullName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {getPollutantInfo(currentData.primaryPollutant)?.description}. Health Impact: {getPollutantInfo(currentData.primaryPollutant)?.healthImpact}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Locations */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle>Other Locations</CardTitle>
          <p className="text-sm text-muted-foreground">Air quality in major cities</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {locationData.slice(1).map((location, index) => (
              <Card key={location.location} className="text-center p-4 hover:shadow-glow transition-smooth">
                <CardContent className="p-0 space-y-3">
                  <h3 className="font-semibold text-sm">{location.location}</h3>
                  <AQIGauge aqi={location.aqi} size="sm" showLabel={false} />
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{location.aqi}</p>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ backgroundColor: getAQILevel(location.aqi).color + '20', borderColor: getAQILevel(location.aqi).color }}
                    >
                      {getAQILevel(location.aqi).label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Status */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle>Data Sources Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(APP_CONFIG.DATA_SOURCES).map(([key, source]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <h3 className="font-semibold">{source.name}</h3>
                  <p className="text-sm text-muted-foreground">{source.updateFrequency}</p>
                </div>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;