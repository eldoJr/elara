import React from 'react';

interface ModernLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

const ModernLoading: React.FC<ModernLoadingProps> = ({ 
  size = 'md', 
  variant = 'spinner',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gray-400 rounded-full animate-bounce`}></div>
        <div className={`${sizeClasses[size]} bg-gray-400 rounded-full animate-bounce animation-delay-100`}></div>
        <div className={`${sizeClasses[size]} bg-gray-400 rounded-full animate-bounce animation-delay-200`}></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`}></div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-black rounded-full animate-spin`}></div>
    </div>
  );
};

export default ModernLoading;