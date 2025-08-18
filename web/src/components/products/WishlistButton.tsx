import React, { useState } from 'react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface WishlistButtonProps {
  productId: number;
  isInWishlist?: boolean;
  onToggleWishlist?: (productId: number, isAdding: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  isInWishlist = false, 
  onToggleWishlist 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    
    if (onToggleWishlist) {
      onToggleWishlist(productId, newState);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isAnimating ? 'animate-pulse' : ''
      } ${
        isWishlisted 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      }`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? (
        <Favorite className="w-5 h-5" />
      ) : (
        <FavoriteBorder className="w-5 h-5" />
      )}
    </button>
  );
};

export default WishlistButton;