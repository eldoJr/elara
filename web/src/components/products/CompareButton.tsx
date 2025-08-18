import React from 'react';
import { Compare } from '@mui/icons-material';

interface CompareButtonProps {
  productId: number;
  isInComparison?: boolean;
  onToggleCompare?: (productId: number, isAdding: boolean) => void;
}

const CompareButton: React.FC<CompareButtonProps> = ({ 
  productId, 
  isInComparison = false, 
  onToggleCompare 
}) => {
  const handleToggle = () => {
    if (onToggleCompare) {
      onToggleCompare(productId, !isInComparison);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
        isInComparison 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      <Compare className="w-4 h-4" />
    </button>
  );
};

export default CompareButton;