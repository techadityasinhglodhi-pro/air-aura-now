import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AQIGauge from '@/components/common/AQIGauge';
import { generateMultiLocationData } from '@/utils/mockData';
import { APP_CONFIG, getAQILevel } from '@/config/airQualityConfig';
import { Map, Layers, MapPin, Satellite, Eye, Filter } from 'lucide-react';

const Maps = () => {
  const [selectedMapStyle, setSelectedMapStyle] = useState('satellite');
  const [selectedPollutant, setSelectedPollutant] = useState('AQI');
  const [locationData] = useState(generateMultiLocationData());
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const mapStyles = [
    { value: 'satellite', label: 'Satellite', description: 'High-resolution satellite imagery' },
    { value: 'light', label: 'Light', description: 'Clean, minimal style' },
    { value: 'dark', label: 'Dark', description: 'Dark theme for night viewing' },
    { value: 'streets', label: 'Streets', description: 'Detailed street information' },
    { value: 'outdoors', label: 'Outdoors', description: 'Topographic and outdoor features' }
  ];

  const pollutantOptions = [
    { value: 'AQI', label: 'Overall AQI' },
    ...Object.entries(APP_CONFIG.POLLUTANTS).map(([key, pollutant]) => ({
      value: key,
      label: pollutant.name
    }))
  ];

  // Mock map component - in real implementation, this would be Mapbox
  const MapVisualization = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Map className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold">Interactive Map View</p>
            <p className="text-sm text-muted-foreground">
              Style: {mapStyles.find(s => s.value === selectedMapStyle)?.label}
            </p>
            <p className="text-sm text-muted-foreground">
              Showing: {pollutantOptions.find(p => p.value === selectedPollutant)?.label}
            </p>
          </div>
        </div>
      </div>

      {/* Simulated location markers */}
      <div className="absolute inset-0">
        {locationData.slice(0, 5).map((location, index) => (
          <div
            key={location.location}
            className="absolute cursor-pointer hover:scale-110 transition-smooth"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 20}%`
            }}
            onClick={() => setSelectedLocation(location)}
          >
            <div className="relative">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: getAQILevel(location.aqi).color }}
              />
              <div className="absolute -top-8 -left-4 bg-white rounded px-2 py-1 text-xs font-medium shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {location.location}: {location.aqi}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button variant="outline" size="sm" className="bg-white/90">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="bg-white/90">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Map className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Interactive Air Quality Maps</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visualize air quality data with multiple satellite views and pollutant overlays
        </p>
      </div>

      <Tabs defaultValue="live-map" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live-map">Live Map</TabsTrigger>
          <TabsTrigger value="comparison">Location Compare</TabsTrigger>
          <TabsTrigger value="layers">Data Layers</TabsTrigger>
        </TabsList>

        {/* Live Map */}
        <TabsContent value="live-map" className="space-y-6">
          {/* Map Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Satellite className="w-4 h-4 mr-2" />
                  Map Style
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={selectedMapStyle} onValueChange={setSelectedMapStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mapStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Layers className="w-4 h-4 mr-2" />
                  Data Layer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={selectedPollutant} onValueChange={setSelectedPollutant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AQI">Overall AQI</SelectItem>
                    <SelectItem value="PM25">PM2.5</SelectItem>
                    <SelectItem value="PM10">PM10</SelectItem>
                    <SelectItem value="O3">O₃</SelectItem>
                    <SelectItem value="NO2">NO₂</SelectItem>
                    <SelectItem value="SO2">SO₂</SelectItem>
                    <SelectItem value="CO">CO</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Data Source</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Badge variant="default" className="bg-green-500">NASA TEMPO</Badge>
                <Badge variant="outline">Ground Sensors</Badge>
                <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Map */}
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Real-time Air Quality Map</CardTitle>
              <CardDescription>
                Interactive map showing current air quality levels with {mapStyles.find(s => s.value === selectedMapStyle)?.label.toLowerCase()} view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapVisualization />
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Air Quality Index Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(APP_CONFIG.AQI_LEVELS).map((level) => (
                  <div key={level.label} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: level.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">{level.label}</p>
                      <p className="text-xs text-muted-foreground">{level.min}-{level.max}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Location Comparison</CardTitle>
              <CardDescription>Compare air quality across multiple cities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationData.slice(0, 6).map((location) => (
                  <Card key={location.location} className="text-center p-4 hover:shadow-glow transition-smooth">
                    <CardContent className="p-0 space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold">{location.location}</h3>
                      </div>
                      <AQIGauge aqi={location.aqi} size="md" showLabel={false} />
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{location.aqi}</p>
                        <Badge 
                          variant="outline"
                          style={{ 
                            backgroundColor: getAQILevel(location.aqi).color + '20', 
                            borderColor: getAQILevel(location.aqi).color 
                          }}
                        >
                          {getAQILevel(location.aqi).label}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Primary: {location.primaryPollutant}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Layers */}
        <TabsContent value="layers" className="space-y-6">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Available Data Layers</CardTitle>
              <CardDescription>Different data sources and visualization options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Satellite Data</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">NASA TEMPO</p>
                        <p className="text-sm text-muted-foreground">Tropospheric pollution monitoring</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">MODIS Terra/Aqua</p>
                        <p className="text-sm text-muted-foreground">Daily global coverage</p>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sentinel-5P</p>
                        <p className="text-sm text-muted-foreground">European satellite data</p>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Ground Sensors</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">EPA Monitors</p>
                        <p className="text-sm text-muted-foreground">Official regulatory monitors</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">OpenAQ Network</p>
                        <p className="text-sm text-muted-foreground">Global community sensors</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">PurpleAir</p>
                        <p className="text-sm text-muted-foreground">Crowdsourced air quality data</p>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pollutant-specific layers */}
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Pollutant Layers</CardTitle>
              <CardDescription>Individual pollutant visualization options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(APP_CONFIG.POLLUTANTS).map(([key, pollutant]) => (
                  <div key={key} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{pollutant.name}</h3>
                      <Badge variant="outline">{pollutant.unit}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pollutant.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>Threshold: {pollutant.defaultThreshold} {pollutant.unit}</span>
                      <Button variant="ghost" size="sm">View Layer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Location Info */}
      {selectedLocation && (
        <Card className="shadow-elevation border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {selectedLocation.location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <AQIGauge aqi={selectedLocation.aqi} size="lg" />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Pollutant Levels</h4>
                {Object.entries(selectedLocation.pollutants).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm">{APP_CONFIG.POLLUTANTS[key as keyof typeof APP_CONFIG.POLLUTANTS]?.name || key}:</span>
                    <span className="text-sm font-medium">{String(value)} {APP_CONFIG.POLLUTANTS[key as keyof typeof APP_CONFIG.POLLUTANTS]?.unit}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Health Information</h4>
                <p className="text-sm text-muted-foreground">
                  {getAQILevel(selectedLocation.aqi).description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                >
                  Close Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Maps;