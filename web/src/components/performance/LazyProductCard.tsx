import React, { lazy, Suspense } from 'react';

const ProductCard = lazy(() => import('../products/ProductCard'));

interface LazyProductCardProps {
  product: any;
  onAddToCart: (productId: number) => void;
  onQuickView?: (product: any) => void;
  onToggleCompare?: (productId: number, isAdding: boolean) => void;
  isInComparison?: boolean;
}

const LazyProductCard: React.FC<LazyProductCardProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    }>
      <ProductCard {...props} />
    </Suspense>
  );
};

export default LazyProductCard;