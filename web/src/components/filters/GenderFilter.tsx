import React from 'react';

interface GenderFilterProps {
  selectedGender: string;
  onGenderChange: (gender: string) => void;
}

const GenderFilter: React.FC<GenderFilterProps> = ({ selectedGender, onGenderChange }) => {
  const genders = ['Men', 'Women', 'Boys', 'Girls'];

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
        Gender
      </h4>
      <div className="space-y-1">
        {genders.map((gender) => (
          <label key={gender} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={selectedGender === gender}
              onChange={(e) => onGenderChange(e.target.value)}
              className="w-3 h-3 text-pink-600 border-gray-300 focus:ring-pink-500 focus:ring-1"
            />
            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
              {gender}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenderFilter;