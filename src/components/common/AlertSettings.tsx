import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_CONFIG } from '@/config/airQualityConfig';
import { Bell, Mail, MessageSquare, Settings, Save, AlertTriangle, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  phoneNumber: string;
  email: string;
  pollutantThresholds: Record<string, number>;
  customMessages: {
    sms: string;
    email: string;
    push: string;
  };
  alertFrequency: string;
  locations: string[];
}

const AlertSettingsComponent = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AlertSettings>({
    smsEnabled: false,
    emailEnabled: true,
    pushEnabled: true,
    phoneNumber: '',
    email: '',
    pollutantThresholds: {
      PM25: 35,
      PM10: 150,
      O3: 70,
      NO2: 100,
      SO2: 75,
      CO: 35
    },
    customMessages: {
      sms: '🚨 AIR ALERT: {location} AQI is {aqi} ({level}). {pollutant} levels elevated. Stay safe!',
      email: 'Air Quality Alert for {location}\n\nCurrent AQI: {aqi} ({level})\nPrimary Pollutant: {pollutant}\n\nRecommendation: {recommendation}\n\nStay safe!',
      push: '{location}: AQI {aqi}. {recommendation}'
    },
    alertFrequency: 'immediate',
    locations: ['New Delhi']
  });

  const handleSave = () => {
    // In real app, would save to backend
    localStorage.setItem('alertSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your alert preferences have been updated successfully.",
    });
  };

  const handleThresholdChange = (pollutant: string, value: number[]) => {
    setSettings(prev => ({
      ...prev,
      pollutantThresholds: {
        ...prev.pollutantThresholds,
        [pollutant]: value[0]
      }
    }));
  };

  const handleMessageChange = (type: keyof AlertSettings['customMessages'], value: string) => {
    setSettings(prev => ({
      ...prev,
      customMessages: {
        ...prev.customMessages,
        [type]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="channels" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="channels">Notification Channels</TabsTrigger>
              <TabsTrigger value="thresholds">Pollutant Thresholds</TabsTrigger>
              <TabsTrigger value="messages">Custom Messages</TabsTrigger>
            </TabsList>

            {/* Notification Channels */}
            <TabsContent value="channels" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SMS Settings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      SMS Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable SMS</Label>
                      <Switch 
                        checked={settings.smsEnabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsEnabled: checked }))}
                      />
                    </div>
                    {settings.smsEnabled && (
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={settings.phoneNumber}
                          onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Email Settings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Email</Label>
                      <Switch 
                        checked={settings.emailEnabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
                      />
                    </div>
                    {settings.emailEnabled && (
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={settings.email}
                          onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Push Settings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Push</Label>
                      <Switch 
                        checked={settings.pushEnabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushEnabled: checked }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select 
                        value={settings.alertFrequency}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, alertFrequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pollutant Thresholds */}
            <TabsContent value="thresholds" className="space-y-6">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Set custom thresholds for each pollutant. You'll receive alerts when levels exceed these values.
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(APP_CONFIG.POLLUTANTS).map(([key, pollutant]) => (
                    <Card key={key}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{pollutant.name}</span>
                          <Badge variant="outline">{pollutant.unit}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Threshold</Label>
                            <span className="text-sm font-medium">
                              {settings.pollutantThresholds[key]} {pollutant.unit}
                            </span>
                          </div>
                          <Slider
                            value={[settings.pollutantThresholds[key]]}
                            onValueChange={(value) => handleThresholdChange(key, value)}
                            max={pollutant.defaultThreshold * 2}
                            min={pollutant.defaultThreshold * 0.5}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.floor(pollutant.defaultThreshold * 0.5)}</span>
                            <span>Default: {pollutant.defaultThreshold}</span>
                            <span>{pollutant.defaultThreshold * 2}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{pollutant.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Custom Messages */}
            <TabsContent value="messages" className="space-y-6">
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Customize your alert messages. Use variables: {'{location}'}, {'{aqi}'}, {'{level}'}, {'{pollutant}'}, {'{recommendation}'}
                </div>

                <div className="space-y-6">
                  {/* SMS Template */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        SMS Template
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={settings.customMessages.sms}
                        onChange={(e) => handleMessageChange('sms', e.target.value)}
                        rows={3}
                        placeholder="SMS alert message template..."
                      />
                    </CardContent>
                  </Card>

                  {/* Email Template */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Template
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={settings.customMessages.email}
                        onChange={(e) => handleMessageChange('email', e.target.value)}
                        rows={6}
                        placeholder="Email alert message template..."
                      />
                    </CardContent>
                  </Card>

                  {/* Push Template */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Push Notification Template
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={settings.customMessages.push}
                        onChange={(e) => handleMessageChange('push', e.target.value)}
                        rows={2}
                        placeholder="Push notification template..."
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Preview */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-sm">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">SMS Preview:</Label>
                      <p className="text-sm p-3 bg-background rounded border">
                        {settings.customMessages.sms
                          .replace('{location}', 'New Delhi')
                          .replace('{aqi}', '156')
                          .replace('{level}', 'Unhealthy')
                          .replace('{pollutant}', 'PM2.5')
                          .replace('{recommendation}', 'Limit outdoor activities')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} className="bg-gradient-sky">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSettingsComponent;