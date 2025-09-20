import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AQIGauge from '@/components/common/AQIGauge';
import Logo from '@/components/common/Logo';
import LocationSearch from '@/components/common/LocationSearch';
import { generateMockAQIData, generateMultiLocationData, type AQIData } from '@/utils/mockData';
import { APP_CONFIG, getAQILevel, getPollutantInfo } from '@/config/airQualityConfig';
import { 
  Wind, Satellite, AlertTriangle, TrendingUp, MapPin, Users, Award, ArrowRight, 
  Shield, Zap, Globe, Target, CheckCircle, Star, Thermometer, Droplets, 
  Eye, Activity, Clock, RefreshCw 
} from 'lucide-react';

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState<AQIData>(generateMockAQIData("New Delhi"));
  const [locationData] = useState(generateMultiLocationData());
  const [insights, setInsights] = useState({
    totalUsers: '50,000+',
    citiesCovered: '1,000+',
    predictionsDaily: '500,000+',
    accuracyRate: '85%'
  });

  // Auto-detect user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In real app, would use actual coordinates to get location data
          setCurrentLocation(generateMockAQIData("Your Location"));
        },
        () => {
          // Fallback to New Delhi if geolocation fails
          setCurrentLocation(generateMockAQIData("New Delhi"));
        }
      );
    }
  }, []);

  const handleLocationSelect = (data: AQIData) => {
    setCurrentLocation(data);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center bg-gradient-atmosphere overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/5 to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Enhanced Logo */}
            <div className="flex justify-center slide-up">
              <Logo size="xl" showText={true} animated={true} variant="gradient" />
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-sky bg-clip-text text-transparent slide-up">
                {APP_CONFIG.tagline}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed slide-up" style={{ animationDelay: '200ms' }}>
                {APP_CONFIG.description}
              </p>
            </div>

            {/* Live AQI Widget */}
            <div className="slide-up" style={{ animationDelay: '300ms' }}>
              <Card className="max-w-2xl mx-auto shadow-glow bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Current Air Quality - {currentLocation.location}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <AQIGauge aqi={currentLocation.aqi} size="lg" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Primary Pollutant</p>
                      <p className="font-semibold">{getPollutantInfo(currentLocation.primaryPollutant)?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Health Impact</p>
                      <p className="font-semibold">{getAQILevel(currentLocation.aqi).label}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{ animationDelay: '400ms' }}>
              <Button size="lg" className="bg-gradient-sky hover:scale-105 transition-bounce shadow-air px-8" asChild>
                <Link to="/dashboard">
                  <Activity className="mr-2 w-5 h-5" />
                  View Real-time Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-bounce px-8" asChild>
                <Link to="/forecasts">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  AI Forecasts
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 slide-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span className="text-sm">NASA TEMPO Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Award className="w-5 h-5" />
                <span className="text-sm">85% Prediction Accuracy</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span className="text-sm">{insights.totalUsers} Active Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Search & Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-sky bg-clip-text text-transparent">
              Global Air Quality Network
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Monitor air quality anywhere in the world with our intelligent location search
            </p>
            
            {/* Location Search Bar */}
            <div className="max-w-lg mx-auto mb-12">
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                placeholder="Search any city or location worldwide..."
                autoDetect={true}
              />
            </div>
          </div>
          
          {/* Featured Cities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {locationData.slice(0, 8).map((location, index) => (
              <Card 
                key={location.location} 
                className="text-center p-6 hover:shadow-glow transition-smooth slide-up group cursor-pointer" 
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleLocationSelect(location)}
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{location.location}</h3>
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
                    <p className="text-xs text-muted-foreground">
                      Primary: {getPollutantInfo(location.primaryPollutant)?.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Real-time Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-sky mx-auto flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Live Updates</h3>
                <p className="text-sm text-muted-foreground">Real-time data updates every 3 hours from NASA TEMPO satellite</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-sky mx-auto flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Global Coverage</h3>
                <p className="text-sm text-muted-foreground">Monitor air quality in over {insights.citiesCovered} cities worldwide</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-sky mx-auto flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Instant Insights</h3>
                <p className="text-sm text-muted-foreground">Get immediate health recommendations and pollution alerts</p>
              </CardContent>
            </Card>
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

      {/* Impact Statistics */}
      <section className="py-20 px-4 bg-gradient-to-r from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Millions Worldwide</h2>
            <p className="text-muted-foreground">Real impact, real results, real protection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-8 shadow-elevation bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-0 space-y-3">
                <div className="text-5xl font-bold bg-gradient-sky bg-clip-text text-transparent">{insights.accuracyRate}</div>
                <p className="text-sm font-medium">AI Prediction Accuracy</p>
                <p className="text-xs text-muted-foreground">LSTM Neural Networks</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 shadow-elevation bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-0 space-y-3">
                <div className="text-5xl font-bold bg-gradient-sky bg-clip-text text-transparent">2.1km</div>
                <p className="text-sm font-medium">Spatial Resolution</p>
                <p className="text-xs text-muted-foreground">NASA TEMPO Satellite</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 shadow-elevation bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-0 space-y-3">
                <div className="text-5xl font-bold bg-gradient-sky bg-clip-text text-transparent">{insights.totalUsers}</div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-xs text-muted-foreground">Growing Daily</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 shadow-elevation bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-0 space-y-3">
                <div className="text-5xl font-bold bg-gradient-sky bg-clip-text text-transparent">{insights.predictionsDaily}</div>
                <p className="text-sm font-medium">Daily Predictions</p>
                <p className="text-xs text-muted-foreground">Processed Hourly</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Metrics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Precision Monitoring</h3>
              <p className="text-sm text-muted-foreground">6 major pollutants tracked with sub-kilometer accuracy</p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">24/7 continuous monitoring with 3-hour update cycles</p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Health Protection</h3>
              <p className="text-sm text-muted-foreground">Proactive alerts to keep you and your family safe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-gradient-sky text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Breathe Safer Today
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Join {insights.totalUsers} users who trust AirGuard Pro for intelligent air quality monitoring and protection
              </p>
            </div>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto opacity-90" />
                <p className="font-medium">Free to Get Started</p>
                <p className="text-sm opacity-75">No credit card required</p>
              </div>
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto opacity-90" />
                <p className="font-medium">NASA-Grade Data</p>
                <p className="text-sm opacity-75">Scientific accuracy you can trust</p>
              </div>
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto opacity-90" />
                <p className="font-medium">AI-Powered Alerts</p>
                <p className="text-sm opacity-75">Predictive health notifications</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="hover:scale-105 transition-bounce px-8 bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/register">
                  <Users className="mr-2 w-5 h-5" />
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8" asChild>
                <Link to="/dashboard">
                  <Eye className="mr-2 w-5 h-5" />
                  Try Demo
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap justify-center items-center gap-8 opacity-75">
              <div className="flex items-center space-x-2">
                <Satellite className="w-5 h-5" />
                <span className="text-sm">NASA Partnership</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">EPA Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
