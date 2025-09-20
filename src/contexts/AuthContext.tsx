import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferences: {
    pollutantThresholds: Record<string, number>;
    alertSettings: {
      sms: boolean;
      email: boolean;
      push: boolean;
    };
    locations: string[];
    customTemplates: {
      sms: string;
      email: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('airguard-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock login - in real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "demo@airguard.com" && password === "demo123") {
        const mockUser: User = {
          id: "demo-user",
          email,
          name: "Demo User",
          phone: "+1234567890",
          preferences: {
            pollutantThresholds: {
              PM25: 35,
              PM10: 150,
              O3: 70,
              NO2: 100,
              SO2: 75,
              CO: 35
            },
            alertSettings: {
              sms: true,
              email: true,
              push: true
            },
            locations: ["New Delhi", "Mumbai"],
            customTemplates: {
              sms: "🚨 AIR ALERT: {location} AQI is {aqi} ({level}). Take precautions!",
              email: "Air Quality Alert for {location}: Current AQI is {aqi} ({level}). {recommendation}"
            }
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('airguard-user', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        preferences: {
          pollutantThresholds: {
            PM25: 35,
            PM10: 150,
            O3: 70,
            NO2: 100,
            SO2: 75,
            CO: 35
          },
          alertSettings: {
            sms: false,
            email: true,
            push: true
          },
          locations: [],
          customTemplates: {
            sms: "🚨 AIR ALERT: {location} AQI is {aqi} ({level}). Take precautions!",
            email: "Air Quality Alert for {location}: Current AQI is {aqi} ({level}). {recommendation}"
          }
        }
      };
      
      setUser(newUser);
      localStorage.setItem('airguard-user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('airguard-user');
  };

  const updatePreferences = (newPreferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...newPreferences }
      };
      setUser(updatedUser);
      localStorage.setItem('airguard-user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    updatePreferences,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};