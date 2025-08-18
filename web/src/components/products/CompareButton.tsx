import React from 'react';

interface CompareButtonProps {
  productId: number;
  isInComparison: boolean;
  onToggleCompare: (productId: number, isAdding: boolean) => void;
}

const CompareButton: React.FC<CompareButtonProps> = ({
  productId,
  isInComparison,
  onToggleCompare
}) => {
  return (
    <button
      onClick={() => onToggleCompare(productId, !isInComparison)}
      className={`p-2 rounded-full transition-all hover:scale-110 ${
        isInComparison
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          : 'bg-white/90 hover:bg-white text-gray-700'
      }`}
      title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  );
};

export default CompareButton;