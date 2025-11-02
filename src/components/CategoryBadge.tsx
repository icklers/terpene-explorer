/**
 * CategoryBadge Component
 *
 * Displays a colored badge for terpene categories (Core/Secondary/Minor)
 * with semantic color coding for visual hierarchy.
 */

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

export interface CategoryBadgeProps {
  category: 'Core' | 'Secondary' | 'Minor';
  size?: 'small' | 'medium';
  showTooltip?: boolean; // T211: Add tooltip prop
}

// Semantic color mapping for category badges
const CATEGORY_COLORS: Record<'Core' | 'Secondary' | 'Minor', 'primary' | 'secondary' | 'default'> = {
  Core: 'primary',
  Secondary: 'secondary',
  Minor: 'default',
};

// T213-T216: Tooltip texts for each category
const CATEGORY_TOOLTIPS: Record<'Core' | 'Secondary' | 'Minor', string> = {
  Core: 'High-prevalence, clinically well-defined terpenes with extensive research',
  Secondary: 'Moderate prevalence terpenes with growing clinical evidence',
  Minor: 'Lower prevalence terpenes with emerging research',
};

/**
 * CategoryBadge - Visual indicator for terpene prevalence/research tier
 *
 * @param category - Terpene category: Core (high prevalence), Secondary (moderate), Minor (low)
 * @param size - Badge size: small or medium (default: medium)
 * @param showTooltip - Whether to show explanatory tooltip on hover (default: false)
 * @returns Material UI Chip component with semantic color coding and optional tooltip
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'medium', showTooltip = false }) => {
  const chip = <Chip label={category} size={size} color={CATEGORY_COLORS[category]} />;

  // T212: Wrap in Tooltip if showTooltip is true
  if (showTooltip) {
    return (
      <Tooltip title={CATEGORY_TOOLTIPS[category]} placement="bottom" arrow>
        {chip}
      </Tooltip>
    );
  }

  return chip;
};
