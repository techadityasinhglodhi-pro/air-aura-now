import React from 'react';
import { getAQILevel } from '@/config/airQualityConfig';

interface AQIGaugeProps {
  aqi: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const level = getAQILevel(aqi);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const aqiSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  // Calculate the stroke dash array for the circular progress
  const radius = size === 'sm' ? 28 : size === 'md' ? 42 : size === 'lg' ? 58 : 74;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(aqi / 500, 1); // Max AQI for visual purposes
  const strokeDashoffset = circumference - (percentage * circumference);

  // Get color based on AQI level
  const getStrokeColor = () => {
    if (aqi <= 50) return '#00e400'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#8f3f97'; // Very Unhealthy
    return '#7e0023'; // Hazardous
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Background Circle */}
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${(radius + 6) * 2} ${(radius + 6) * 2}`}
      >
        <circle
          cx={radius + 6}
          cy={radius + 6}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-muted/20"
        />
        <circle
          cx={radius + 6}
          cy={radius + 6}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${getStrokeColor()}40)`
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`font-bold ${aqiSizes[size]} text-foreground`}>
          {aqi}
        </div>
        {showLabel && (
          <div className={`${textSizes[size]} text-muted-foreground text-center leading-tight`}>
            AQI
          </div>
        )}
      </div>

      {/* Level Indicator */}
      {showLabel && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${textSizes[size]}`}
            style={{ backgroundColor: level.color }}
          >
            {level.label}
          </span>
        </div>
      )}

      {/* Pulse Animation for High AQI */}
      {aqi > 150 && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: getStrokeColor() }}
        />
      )}
    </div>
  );
};

export default AQIGauge;