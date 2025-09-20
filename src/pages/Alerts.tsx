import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlertSettingsComponent from '@/components/common/AlertSettings';
import { generateAlertsData, type AlertData } from '@/utils/mockData';
import { Bell, BellRing, Clock, MapPin, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>(generateAlertsData());
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'moderate'>('all');

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread':
        return !alert.read;
      case 'high':
        return alert.type === 'high';
      case 'moderate':
        return alert.type === 'moderate';
      default:
        return true;
    }
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'moderate':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <BellRing className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'high':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Bell className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Air Quality Alerts</h1>
            <p className="text-muted-foreground">Stay informed about air quality changes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all as read ({unreadCount})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Alerts ({alerts.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({alerts.filter(a => !a.read).length})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High Priority ({alerts.filter(a => a.type === 'high').length})
            </Button>
            <Button
              variant={filter === 'moderate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('moderate')}
            >
              Moderate ({alerts.filter(a => a.type === 'moderate').length})
            </Button>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent className="p-0">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No alerts to show</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`shadow-elevation hover:shadow-glow transition-smooth ${
                    !alert.read ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <Badge variant={getAlertVariant(alert.type) as any}>
                              {alert.type === 'high' ? 'High Priority' : 
                               alert.type === 'moderate' ? 'Moderate' : 'Reminder'}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {alert.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(alert.timestamp)}
                            </div>
                          </div>
                          <p className="text-foreground">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>AQI: <strong className="text-foreground">{alert.aqi}</strong></span>
                            <span>Primary Pollutant: <strong className="text-foreground">{alert.pollutant}</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!alert.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(alert.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AlertSettingsComponent />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Alert Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-2">
                <div className="text-3xl font-bold text-red-500">
                  {alerts.filter(a => a.type === 'high').length}
                </div>
                <p className="text-sm text-muted-foreground">High Priority Alerts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-2">
                <div className="text-3xl font-bold text-yellow-500">
                  {alerts.filter(a => a.type === 'moderate').length}
                </div>
                <p className="text-sm text-muted-foreground">Moderate Alerts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-2">
                <div className="text-3xl font-bold text-blue-500">
                  {alerts.filter(a => a.type === 'reminder').length}
                </div>
                <p className="text-sm text-muted-foreground">Reminders</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-elevation">
              <CardContent className="p-0 space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {alerts.filter(a => !a.read).length}
                </div>
                <p className="text-sm text-muted-foreground">Unread Alerts</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Locations with Alerts */}
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Most Alerted Locations</CardTitle>
              <CardDescription>Locations with the most air quality alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  alerts.reduce((acc, alert) => {
                    acc[alert.location] = (acc[alert.location] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{location}</span>
                      </div>
                      <Badge variant="outline">{count} alerts</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Types Distribution */}
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Alert Distribution</CardTitle>
              <CardDescription>Breakdown of alert types over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{alerts.filter(a => a.type === 'high').length}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ 
                          width: `${(alerts.filter(a => a.type === 'high').length / alerts.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{alerts.filter(a => a.type === 'moderate').length}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500"
                        style={{ 
                          width: `${(alerts.filter(a => a.type === 'moderate').length / alerts.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Reminders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{alerts.filter(a => a.type === 'reminder').length}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ 
                          width: `${(alerts.filter(a => a.type === 'reminder').length / alerts.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;