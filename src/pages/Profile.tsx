import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { APP_CONFIG } from '@/config/airQualityConfig';
import { User, Bell, Settings, MapPin, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updatePreferences } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [thresholds, setThresholds] = useState(user?.preferences.pollutantThresholds || {});
  const [alertSettings, setAlertSettings] = useState(user?.preferences.alertSettings || {
    sms: false,
    email: true,
    push: true
  });
  const [customTemplates, setCustomTemplates] = useState(user?.preferences.customTemplates || {
    sms: "🚨 AIR ALERT: {location} AQI is {aqi} ({level}). Take precautions!",
    email: "Air Quality Alert for {location}: Current AQI is {aqi} ({level}). {recommendation}"
  });
  const [locations, setLocations] = useState<string[]>(user?.preferences.locations || []);
  const [newLocation, setNewLocation] = useState('');

  const handleSaveProfile = () => {
    // Save profile data
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const handleSaveThresholds = () => {
    updatePreferences({ pollutantThresholds: thresholds });
    toast({
      title: "Thresholds updated",
      description: "Your custom pollutant thresholds have been saved."
    });
  };

  const handleSaveAlerts = () => {
    updatePreferences({ 
      alertSettings,
      customTemplates
    });
    toast({
      title: "Alert settings updated",
      description: "Your notification preferences have been saved."
    });
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      const updatedLocations = [...locations, newLocation.trim()];
      setLocations(updatedLocations);
      updatePreferences({ locations: updatedLocations });
      setNewLocation('');
      toast({
        title: "Location added",
        description: `${newLocation} has been added to your watched locations.`
      });
    }
  };

  const handleRemoveLocation = (location: string) => {
    const updatedLocations = locations.filter(loc => loc !== location);
    setLocations(updatedLocations);
    updatePreferences({ locations: updatedLocations });
    toast({
      title: "Location removed",
      description: `${location} has been removed from your watched locations.`
    });
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-sky rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and personalize your air quality experience</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Thresholds
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Locations
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <Button onClick={handleSaveProfile} className="bg-gradient-sky">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thresholds Tab */}
        <TabsContent value="thresholds">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Custom Pollutant Thresholds</CardTitle>
              <CardDescription>Set personalized alert thresholds for each pollutant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(APP_CONFIG.POLLUTANTS).map(([key, pollutant]) => (
                  <div key={key} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{pollutant.name}</h3>
                        <p className="text-xs text-muted-foreground">{pollutant.fullName}</p>
                      </div>
                      <Badge variant="outline">{pollutant.unit}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`threshold-${key}`}>Alert Threshold</Label>
                      <Input
                        id={`threshold-${key}`}
                        type="number"
                        value={thresholds[key] || pollutant.defaultThreshold}
                        onChange={(e) => setThresholds({ ...thresholds, [key]: Number(e.target.value) })}
                        className="text-right"
                      />
                      <p className="text-xs text-muted-foreground">
                        Default: {pollutant.defaultThreshold} {pollutant.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveThresholds} className="bg-gradient-sky">
                <Save className="w-4 h-4 mr-2" />
                Save Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <div className="space-y-6">
            <Card className="shadow-elevation">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive air quality alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                    </div>
                    <Switch
                      checked={alertSettings.sms}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, sms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive detailed alerts via email</p>
                    </div>
                    <Switch
                      checked={alertSettings.email}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={alertSettings.push}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, push: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elevation">
              <CardHeader>
                <CardTitle>Custom Alert Templates</CardTitle>
                <CardDescription>Personalize your notification messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sms-template">SMS Template</Label>
                  <Textarea
                    id="sms-template"
                    value={customTemplates.sms}
                    onChange={(e) => setCustomTemplates({ ...customTemplates, sms: e.target.value })}
                    placeholder="🚨 AIR ALERT: {location} AQI is {aqi} ({level}). Take precautions!"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {"{location}, {aqi}, {level}, {pollutant}, {recommendation}"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-template">Email Template</Label>
                  <Textarea
                    id="email-template"
                    value={customTemplates.email}
                    onChange={(e) => setCustomTemplates({ ...customTemplates, email: e.target.value })}
                    placeholder="Air Quality Alert for {location}: Current AQI is {aqi} ({level}). {recommendation}"
                    rows={4}
                  />
                </div>
                <Button onClick={handleSaveAlerts} className="bg-gradient-sky">
                  <Save className="w-4 h-4 mr-2" />
                  Save Alert Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Watched Locations</CardTitle>
              <CardDescription>Manage locations you want to monitor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Enter city name..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                />
                <Button onClick={handleAddLocation} variant="outline">
                  Add Location
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Your Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                      onClick={() => handleRemoveLocation(location)}
                    >
                      {location} ×
                    </Badge>
                  ))}
                  {locations.length === 0 && (
                    <p className="text-sm text-muted-foreground">No locations added yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;