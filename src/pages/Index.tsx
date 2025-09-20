import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AQIGauge from '@/components/common/AQIGauge';
import { generateMockAQIData, generateMultiLocationData } from '@/utils/mockData';
import { APP_CONFIG, getAQILevel } from '@/config/airQualityConfig';
import { Wind, Satellite, AlertTriangle, TrendingUp, MapPin, Users, Award, ArrowRight } from 'lucide-react';

const Index = () => {
  const currentData = generateMockAQIData("New Delhi");
  const locationData = generateMultiLocationData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-atmosphere overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="floating-animation">
              <Wind className="w-20 h-20 mx-auto text-primary mb-6" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-sky bg-clip-text text-transparent slide-up">
              {APP_CONFIG.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto slide-up" style={{ animationDelay: '200ms' }}>
              {APP_CONFIG.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{ animationDelay: '400ms' }}>
              <Button size="lg" className="bg-gradient-sky hover:scale-105 transition-bounce shadow-air" asChild>
                <Link to="/dashboard">
                  Check Air Quality Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-bounce" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Air Quality Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current Air Quality Overview</h2>
            <p className="text-muted-foreground">Real-time air quality data from major cities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locationData.slice(0, 4).map((location, index) => (
              <Card key={location.location} className="text-center p-6 hover:shadow-glow transition-smooth slide-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                      style={{ backgroundColor: getAQILevel(location.aqi).color + '20', borderColor: getAQILevel(location.aqi).color }}
                    >
                      {getAQILevel(location.aqi).label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground">Everything you need for comprehensive air quality monitoring</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-elevation hover:shadow-glow transition-smooth">
              <CardHeader>
                <Satellite className="w-12 h-12 text-primary mb-4" />
                <CardTitle>NASA TEMPO Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time satellite data with 2.1km × 4.5km resolution for the most accurate air quality monitoring available.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/maps">View Maps</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elevation hover:shadow-glow transition-smooth">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>AI-Powered Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  LSTM neural networks provide 85% accurate predictions up to 7 days ahead with hourly precision.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/forecasts">View Forecasts</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-elevation hover:shadow-glow transition-smooth">
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalized notifications via SMS, email, and push notifications with custom thresholds for each pollutant.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/alerts">Manage Alerts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">85%</div>
              <p className="text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2.1km</div>
              <p className="text-muted-foreground">Spatial Resolution</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <p className="text-muted-foreground">Real-time Monitoring</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">6</div>
              <p className="text-muted-foreground">Pollutants Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-sky text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Start Monitoring Air Quality Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust AirGuard Pro for accurate air quality insights
          </p>
          <Button size="lg" variant="secondary" className="hover:scale-105 transition-bounce" asChild>
            <Link to="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
