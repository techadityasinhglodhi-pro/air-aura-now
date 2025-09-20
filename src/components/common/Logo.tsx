import React from 'react';
import { Wind, Shield, Zap, Layers } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  variant?: 'default' | 'white' | 'gradient';
}

const Logo = ({ size = 'md', showText = true, animated = false, variant = 'default' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const getIconColor = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'gradient':
        return 'text-primary';
      default:
        return 'text-primary';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'gradient':
        return 'bg-gradient-sky bg-clip-text text-transparent';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Logo Icon Container */}
      <div className={`relative ${animated ? 'floating-animation' : ''}`}>
        {/* Background Circle */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-sky p-1 shadow-glow`}>
          {/* Main Wind Icon */}
          <Wind className={`w-full h-full text-white ${animated ? 'animate-pulse' : ''}`} />
        </div>
        
        {/* Decorative Elements */}
        {size !== 'sm' && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-80"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 opacity-60"></div>
          </>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold ${getTextColor()}`}>
            AirGuard Pro
          </span>
          {size === 'xl' && (
            <span className="text-sm text-muted-foreground">
              Intelligent Air Quality Monitoring
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;