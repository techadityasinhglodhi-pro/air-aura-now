import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/airQualityConfig';
import { Wind, Satellite, Users, Target, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Wind className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-sky bg-clip-text text-transparent">
          About AirGuard Pro
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {APP_CONFIG.description}
        </p>
      </div>

      {/* Mission Section */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-6 h-6 mr-2" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            AirGuard Pro is dedicated to protecting public health by providing accurate, real-time air quality 
            information and predictive insights. We combine cutting-edge satellite technology with ground-based 
            monitoring to deliver the most comprehensive air quality platform available.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-elevation hover:shadow-glow transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Satellite className="w-5 h-5 mr-2" />
              NASA TEMPO Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              First-of-its-kind integration with NASA's TEMPO satellite for hourly pollution monitoring 
              at 2.1km × 4.5km resolution across North America.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elevation hover:shadow-glow transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2" />
              Community-Driven
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Powered by data from thousands of ground monitoring stations worldwide, 
              creating a comprehensive global air quality network.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elevation hover:shadow-glow transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="w-5 h-5 mr-2" />
              AI-Powered Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Advanced LSTM neural networks provide accurate air quality forecasts 
              with 85% prediction accuracy for up to 7 days ahead.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            Technology & Data Sources
          </CardTitle>
          <CardDescription>
            Powered by cutting-edge technology and reliable data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Data Sources</h3>
              <div className="space-y-3">
                {Object.entries(APP_CONFIG.DATA_SOURCES).map(([key, source]) => (
                  <div key={key} className="flex items-start space-x-3">
                    <Badge variant="outline">{source.updateFrequency}</Badge>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                      <p className="text-xs text-muted-foreground">Coverage: {source.coverage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Technology</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Frontend</span>
                  <Badge>React + TypeScript</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Styling</span>
                  <Badge>Tailwind CSS</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maps</span>
                  <Badge>Mapbox GL JS</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Charts</span>
                  <Badge>Recharts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI Models</span>
                  <Badge>LSTM Neural Networks</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Get in Touch</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {APP_CONFIG.company.email}</p>
                <p><strong>Phone:</strong> {APP_CONFIG.company.phone}</p>
                <p><strong>Address:</strong> {APP_CONFIG.company.address}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">
                Our team is available 24/7 to help you with any questions or issues. 
                Reach out to us anytime for technical support, feature requests, or general inquiries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-6 shadow-elevation">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-primary">85%</div>
            <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 shadow-elevation">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-primary">2.1km</div>
            <p className="text-sm text-muted-foreground">Spatial Resolution</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 shadow-elevation">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <p className="text-sm text-muted-foreground">Real-time Monitoring</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 shadow-elevation">
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-primary">Global</div>
            <p className="text-sm text-muted-foreground">Coverage</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;