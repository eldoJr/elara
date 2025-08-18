import React from 'react';

interface DiscountFilterProps {
  selectedDiscount: string;
  onDiscountChange: (discount: string) => void;
}

const DiscountFilter: React.FC<DiscountFilterProps> = ({ 
  selectedDiscount, 
  onDiscountChange 
}) => {
  const discountRanges = [
    { value: '10', label: '10%+' },
    { value: '20', label: '20%+' },
    { value: '30', label: '30%+' },
    { value: '40', label: '40%+' },
    { value: '50', label: '50%+' },
  ];

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        Discount
      </h4>
      <div className="space-y-1">
        {discountRanges.map((range) => (
          <label key={range.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="discount"
              value={range.value}
              checked={selectedDiscount === range.value}
              onChange={(e) => onDiscountChange(e.target.value)}
              className="w-3 h-3 text-pink-600 border-gray-300 focus:ring-pink-500 focus:ring-1"
            />
            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
              {range.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DiscountFilter;