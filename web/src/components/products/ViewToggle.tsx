import React from 'react';
import { GridView, ViewList } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(_, newView) => newView && onViewChange(newView)}
      size="small"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <ToggleButton value="grid" className="px-3 py-1">
        <GridView fontSize="small" />
      </ToggleButton>
      <ToggleButton value="list" className="px-3 py-1">
        <ViewList fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewToggle;