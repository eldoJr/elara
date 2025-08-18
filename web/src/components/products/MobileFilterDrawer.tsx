import React from 'react';
import { Drawer, IconButton, Typography } from '@mui/material';
import { Close, FilterList } from '@mui/icons-material';
import FilterSidebar from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  activeFilters
}) => {
  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => !isOpen && onClose()}
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-blue-700 transition-colors"
      >
        <FilterList />
      </button>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        className="md:hidden"
        PaperProps={{
          className: "w-80 max-w-[90vw]"
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Typography variant="h6" className="font-semibold">
            Filters
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <FilterSidebar 
            onFiltersChange={onFiltersChange}
            activeFilters={activeFilters}
          />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default MobileFilterDrawer;