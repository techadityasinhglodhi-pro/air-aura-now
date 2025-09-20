import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Application settings and preferences</p>
        </div>
      </div>

      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Additional settings will be available here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">More settings options are being developed. Please check back later.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;