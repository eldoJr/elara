import React from 'react';

interface Color {
  name: string;
  hex: string;
}

interface ColorFilterProps {
  colors: Color[];
  selectedColors: string[];
  onColorChange: (color: string) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ 
  colors, 
  selectedColors, 
  onColorChange 
}) => {
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        Color
      </h4>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => {
          const isSelected = selectedColors.includes(color.name);
          return (
            <button
              key={color.name}
              onClick={() => onColorChange(color.name)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                isSelected 
                  ? 'border-pink-500 ring-1 ring-pink-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto" 
                     style={{ 
                       backgroundColor: color.hex === '#ffffff' ? '#000' : '#fff',
                       marginTop: '4px'
                     }} 
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorFilter;