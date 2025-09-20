import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import AQIGauge from '@/components/common/AQIGauge';
import { generateForecastData } from '@/utils/mockData';
import { getAQILevel, APP_CONFIG } from '@/config/airQualityConfig';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CalendarDays, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const Forecasts = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [hourlyData] = useState(generateForecastData(24));
  const [dailyData] = useState(generateForecastData(168).filter((_, i) => i % 24 === 0)); // Weekly data
  const [monthlyData] = useState(generateForecastData(720).filter((_, i) => i % 168 === 0)); // Monthly data

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">AQI: <span className="font-bold">{data.aqi}</span></p>
          <p className="text-sm">Level: <span className="font-bold">{getAQILevel(data.aqi).label}</span></p>
          <p className="text-sm">Temperature: {data.temperature}°C</p>
          <p className="text-sm">Humidity: {data.humidity}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <TrendingUp className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Air Quality Forecasts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered predictions using LSTM neural networks for accurate air quality forecasting
        </p>
      </div>

      <Tabs defaultValue="hourly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hourly">Next 24 Hours</TabsTrigger>
          <TabsTrigger value="daily">Next 7 Days</TabsTrigger>
          <TabsTrigger value="weekly">Next 4 Weeks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Hourly Forecast */}
        <TabsContent value="hourly" className="space-y-6">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                24-Hour Forecast
              </CardTitle>
              <CardDescription>Hourly air quality predictions for the next day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatTime}
                      interval="preserveStartEnd"
                    />
                    <YAxis domain={[0, 300]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hourlyData.slice(0, 12).map((data, index) => (
              <Card key={index} className="text-center p-3 hover:shadow-glow transition-smooth">
                <CardContent className="p-0 space-y-2">
                  <p className="text-sm text-muted-foreground">{formatTime(data.timestamp)}</p>
                  <AQIGauge aqi={data.aqi} size="sm" showLabel={false} />
                  <p className="text-sm font-semibold">{data.aqi}</p>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: getAQILevel(data.aqi).color + '20', 
                      borderColor: getAQILevel(data.aqi).color 
                    }}
                  >
                    {getAQILevel(data.aqi).label.split(' ')[0]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Daily Forecast */}
        <TabsContent value="daily" className="space-y-6">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                7-Day Forecast
              </CardTitle>
              <CardDescription>Daily air quality predictions for the next week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData.slice(0, 7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatDate}
                    />
                    <YAxis domain={[0, 300]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="aqi" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {dailyData.slice(0, 7).map((data, index) => {
              const date = new Date(data.timestamp);
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <Card key={index} className={`text-center p-4 hover:shadow-glow transition-smooth ${isToday ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-0 space-y-3">
                    <div>
                      <p className="text-sm font-semibold">{isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className="text-xs text-muted-foreground">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <AQIGauge aqi={data.aqi} size="sm" showLabel={false} />
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{data.aqi}</p>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: getAQILevel(data.aqi).color + '20', 
                          borderColor: getAQILevel(data.aqi).color 
                        }}
                      >
                        {getAQILevel(data.aqi).label.split(' ')[0]}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <p>{data.temperature}°C</p>
                      <p>{data.windSpeed} km/h</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Weekly Forecast */}
        <TabsContent value="weekly" className="space-y-6">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>4-Week Outlook</CardTitle>
              <CardDescription>Long-term air quality trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData.slice(0, 4)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis domain={[0, 300]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthlyData.slice(0, 4).map((data, index) => {
              const date = new Date(data.timestamp);
              const weekNumber = index + 1;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-glow transition-smooth">
                  <CardContent className="p-0 space-y-4">
                    <div>
                      <p className="text-lg font-semibold">Week {weekNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <AQIGauge aqi={data.aqi} size="md" showLabel={false} />
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{data.aqi}</p>
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: getAQILevel(data.aqi).color + '20', 
                          borderColor: getAQILevel(data.aqi).color 
                        }}
                      >
                        {getAQILevel(data.aqi).label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-elevation">
              <CardHeader>
                <CardTitle>Planning Calendar</CardTitle>
                <CardDescription>Select a date to view air quality forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    good: (date) => Math.random() > 0.7,
                    moderate: (date) => Math.random() > 0.5,
                    unhealthy: (date) => Math.random() > 0.8,
                  }}
                  modifiersStyles={{
                    good: { backgroundColor: '#dcfce7', color: '#15803d' },
                    moderate: { backgroundColor: '#fef3c7', color: '#d97706' },
                    unhealthy: { backgroundColor: '#fee2e2', color: '#dc2626' },
                  }}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              {selectedDate && (
                <Card className="shadow-elevation">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <AQIGauge aqi={120} size="lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span>25°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span>65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind Speed:</span>
                        <span>12 km/h</span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Recommendation</p>
                          <p className="text-sm text-muted-foreground">
                            Moderate air quality. Sensitive individuals should consider limiting prolonged outdoor activities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-elevation">
                <CardHeader>
                  <CardTitle>Model Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Prediction Accuracy:</span>
                    <Badge variant="default">85%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Model Type:</span>
                    <Badge variant="outline">LSTM Neural Network</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated:</span>
                    <span className="text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forecasts;