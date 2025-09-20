import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AQIGauge from '@/components/common/AQIGauge';
import { generateMockAQIData, generateMultiLocationData } from '@/utils/mockData';
import { APP_CONFIG, getAQILevel, getPollutantInfo } from '@/config/airQualityConfig';
import { MapPin, Thermometer, Droplets, Wind, RefreshCw, Clock } from 'lucide-react';

const Dashboard = () => {
  const [currentData, setCurrentData] = useState(generateMockAQIData("New Delhi"));
  const [locationData, setLocationData] = useState(generateMultiLocationData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentData(generateMockAQIData("New Delhi"));
    setLocationData(generateMultiLocationData());
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
      {/* Header */}
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

        {/* Environmental Conditions */}
        <Card className="lg:col-span-2 shadow-elevation">
          <CardHeader>
            <CardTitle>Environmental Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="font-semibold">25°C</p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-semibold">65%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <Wind className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold">12 km/h</p>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Pollutant Analysis */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle>Detailed Pollutant Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Individual pollutant levels with circular indicators</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pollutantCards.map((pollutant, index) => (
              <div key={pollutant.name} className="text-center space-y-4 slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative mx-auto">
                  <AQIGauge 
                    aqi={Math.min(pollutant.value / pollutant.threshold * 100, 400)} 
                    size="md" 
                    showLabel={false}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold">{pollutant.value}</div>
                    <div className="text-xs text-muted-foreground">{pollutant.unit}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{pollutant.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{pollutant.description}</p>
                  <Badge 
                    variant={pollutant.level === 'high' ? 'destructive' : pollutant.level === 'medium' ? 'secondary' : 'default'}
                    className="mt-2"
                  >
                    {pollutant.level === 'high' ? 'Above Threshold' : pollutant.level === 'medium' ? 'Moderate' : 'Good'}
                  </Badge>
                </div>
              </div>
            ))}
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