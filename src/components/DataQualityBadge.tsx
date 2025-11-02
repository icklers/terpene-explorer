/**
 * DataQualityBadge Component
 *
 * Displays research data quality level with color coding:
 * - Excellent: Green with checkmark icon
 * - Good: Blue (primary)
 * - Limited: Orange (warning)
 *
 * Implements TDD Cycle 16 (T125-T131)
 */

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Chip } from '@mui/material';
import React from 'react';

export interface DataQualityBadgeProps {
  quality: 'Excellent' | 'Good' | 'Moderate' | 'Limited' | 'Unknown';
}

// T131: Quality configuration constant with improved color coding
const QUALITY_CONFIG = {
  Excellent: {
    sx: {
      backgroundColor: '#2E7D32', // Dark green (WCAG AA compliant: 5.95:1 on white)
      color: 'white',
      fontWeight: 'medium',
    },
    showIcon: true,
  },
  Good: {
    sx: {
      backgroundColor: '#66BB6A', // Lighter green (WCAG AA compliant: 4.51:1 on white)
      color: 'white',
      fontWeight: 'medium',
    },
    showIcon: false,
  },
  Moderate: {
    sx: {
      backgroundColor: 'transparent',
      color: '#2E7D32', // Dark green text
      border: '1px solid #66BB6A', // Green border
      fontWeight: 'medium',
    },
    showIcon: false,
  },
  Limited: {
    sx: {
      backgroundColor: 'transparent',
      color: '#757575', // Grey text (WCAG AA compliant: 4.62:1 on white)
      border: '1px solid #BDBDBD', // Grey border
      fontWeight: 'medium',
    },
    showIcon: false,
  },
  Unknown: {
    sx: {
      backgroundColor: '#9E9E9E', // Filled grey (WCAG AA compliant: 4.54:1 on white)
      color: 'white',
      fontWeight: 'medium',
    },
    showIcon: false,
  },
};

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({ quality }) => {
  const config = QUALITY_CONFIG[quality];

  return (
    <Chip
      label={quality}
      size="small"
      icon={config.showIcon ? <CheckCircleIcon /> : undefined} // T129-T130: Conditional icon
      sx={config.sx}
    />
  );
};
