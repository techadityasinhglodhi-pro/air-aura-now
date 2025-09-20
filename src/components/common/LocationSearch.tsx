import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateMockAQIData, type AQIData } from '@/utils/mockData';
import { getAQILevel } from '@/config/airQualityConfig';
import { Search, MapPin, Locate, Clock, Star } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (data: AQIData) => void;
  placeholder?: string;
  autoDetect?: boolean;
}

const LocationSearch = ({ onLocationSelect, placeholder = "Search for a city or location...", autoDetect = true }: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AQIData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Mock city suggestions
  const popularCities = [
    'New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'New York', 'Los Angeles', 'London', 'Paris', 'Tokyo'
  ];

  useEffect(() => {
    // Load recent searches and favorites from localStorage
    const recent = localStorage.getItem('recentSearches');
    const favs = localStorage.getItem('favoriteLocations');
    if (recent) setRecentSearches(JSON.parse(recent));
    if (favs) setFavorites(JSON.parse(favs));
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = popularCities
        .filter(city => city.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(city => generateMockAQIData(city));
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleLocationSelect = (location: AQIData) => {
    setQuery(location.location);
    setIsOpen(false);
    onLocationSelect(location);
    
    // Add to recent searches
    const updated = [location.location, ...recentSearches.filter(l => l !== location.location)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) return;
    
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mock location detection - in real app would reverse geocode
        const mockLocation = generateMockAQIData("Your Location");
        mockLocation.coordinates = [longitude, latitude];
        handleLocationSelect(mockLocation);
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      }
    );
  };

  const toggleFavorite = (location: string) => {
    const updated = favorites.includes(location)
      ? favorites.filter(l => l !== location)
      : [...favorites, location];
    setFavorites(updated);
    localStorage.setItem('favoriteLocations', JSON.stringify(updated));
  };

  const handleRecentSearch = (location: string) => {
    const data = generateMockAQIData(location);
    handleLocationSelect(data);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-12"
        />
        {autoDetect && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCurrentLocation}
            disabled={isDetecting}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
          >
            <Locate className={`w-4 h-4 ${isDetecting ? 'animate-pulse' : ''}`} />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-elevation max-h-96 overflow-auto">
          <CardContent className="p-0">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="border-b">
                <div className="p-3 text-sm font-medium text-muted-foreground">Search Results</div>
                {results.map((result) => (
                  <div
                    key={result.location}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleLocationSelect(result)}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{result.location}</p>
                        <p className="text-sm text-muted-foreground">AQI: {result.aqi}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: getAQILevel(result.aqi).color + '20', 
                          borderColor: getAQILevel(result.aqi).color 
                        }}
                      >
                        {getAQILevel(result.aqi).label.split(' ')[0]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(result.location);
                        }}
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(result.location) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length <= 1 && (
              <div className="border-b">
                <div className="p-3 text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </div>
                {recentSearches.map((location) => (
                  <div
                    key={location}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleRecentSearch(location)}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{location}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(location);
                      }}
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(location) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && query.length <= 1 && (
              <div>
                <div className="p-3 text-sm font-medium text-muted-foreground flex items-center">
                  <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                  Favorites
                </div>
                {favorites.map((location) => (
                  <div
                    key={location}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleRecentSearch(location)}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;