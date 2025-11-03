/**
 * TerpeneCardGrid Component
 *
 * Mobile-optimized card grid for displaying terpenes.
 * Uses TanStack Virtual for performance with large lists (>50 items).
 * Implements touch-friendly interactions with haptic feedback.
 *
 * @see tasks.md T002
 */

import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Grid2 as Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Terpene } from '../../types/terpene';
import { triggerHapticFeedback, HapticPattern } from '../../utils/haptics';

/**
 * Component props
 */
export interface TerpeneCardGridProps {
  /** Filtered terpenes to display */
  terpenes: Terpene[];
  /** Card click handler (opens detail modal) */
  onTerpeneClick: (terpene: Terpene) => void;
  /** Whether to enable virtual scrolling (default: auto based on count) */
  enableVirtualization?: boolean;
}

/**
 * Card data optimized for mobile display
 */
interface TerpeneCardData {
  id: string;
  name: string;
  aroma: string;
  topEffects: string[];
  additionalEffectCount: number;
}

/**
 * Transform terpene data for card display
 */
function toCardData(terpene: Terpene): TerpeneCardData {
  return {
    id: terpene.id,
    name: terpene.name,
    aroma: terpene.aroma,
    topEffects: terpene.effects.slice(0, 3),
    additionalEffectCount: Math.max(0, terpene.effects.length - 3),
  };
}

/**
 * Individual terpene card component
 */
interface TerpeneCardProps {
  terpene: Terpene;
  onClick: (terpene: Terpene) => void;
}

const TerpeneCard: React.FC<TerpeneCardProps> = React.memo(({ terpene, onClick }) => {
  const { t } = useTranslation();
  const cardData = useMemo(() => toCardData(terpene), [terpene]);

  const handleClick = () => {
    // Trigger haptic feedback on tap
    triggerHapticFeedback(HapticPattern.TAP);
    onClick(terpene);
  };

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 180,
        transition: 'all 0.2s ease-in-out',
        // Touch target size: ensure card is tappable with minimum 44x44px
        '&:active': {
          transform: 'scale(0.98)', // Pressed state visual feedback
          boxShadow: 4, // Elevation change on press (1→4)
        },
      }}
      elevation={1}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          // Ensure minimum touch target size (44x44px per WCAG AA)
          minHeight: 180,
          padding: 0,
        }}
        aria-label={t('card.terpene.ariaLabel', 'View details for {{name}}', { name: cardData.name })}
      >
        <CardContent sx={{ width: '100%', flexGrow: 1 }}>
          {/* Terpene Name */}
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {cardData.name}
          </Typography>

          {/* Aroma */}
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {cardData.aroma}
          </Typography>

          {/* Top 3 Effects */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {cardData.topEffects.map((effect) => (
              <Chip
                key={effect}
                label={effect}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            ))}
          </Box>

          {/* "+X more" indicator */}
          {cardData.additionalEffectCount > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontStyle: 'italic',
              }}
            >
              {t('card.terpene.moreEffects', '+{{count}} more', { count: cardData.additionalEffectCount })}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

TerpeneCard.displayName = 'TerpeneCard';

/**
 * TerpeneCardGrid component
 *
 * Displays terpenes in a responsive card grid with optional virtual scrolling.
 * Automatically enables virtualization for lists >50 items.
 *
 * @param props - Component props
 * @returns Rendered component
 */
export const TerpeneCardGrid: React.FC<TerpeneCardGridProps> = ({
  terpenes,
  onTerpeneClick,
  enableVirtualization,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Auto-enable virtualization for large lists
  const shouldVirtualize = enableVirtualization ?? terpenes.length > 50;

  // Grid columns: 1 on mobile, 2 on tablet/desktop
  const columns = isMobile ? 1 : 2;

  // Virtualization setup
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate number of rows for virtualization
  const rowCount = Math.ceil(terpenes.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height (card height + gap)
    overscan: 5, // Render 5 extra rows above/below viewport
    enabled: shouldVirtualize,
  });

  // Get terpenes for a specific row
  const getTerpenesForRow = (rowIndex: number): Terpene[] => {
    const startIndex = rowIndex * columns;
    const endIndex = Math.min(startIndex + columns, terpenes.length);
    return terpenes.slice(startIndex, endIndex);
  };

  if (terpenes.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          py: 4,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No terpenes found
        </Typography>
      </Box>
    );
  }

  // Render without virtualization (small lists)
  if (!shouldVirtualize) {
    return (
      <Grid container spacing={2} sx={{ p: { xs: 2, sm: 3 } }}>
        {terpenes.map((terpene) => (
          <Grid key={terpene.id} size={{ xs: 12, sm: 6 }}>
            <TerpeneCard terpene={terpene} onClick={onTerpeneClick} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Render with virtualization (large lists)
  return (
    <Box
      ref={parentRef}
      sx={{
        height: '100%',
        overflow: 'auto',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowTerpenes = getTerpenesForRow(virtualRow.index);

          return (
            <Box
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Grid container spacing={2}>
                {rowTerpenes.map((terpene) => (
                  <Grid key={terpene.id} size={{ xs: 12, sm: 6 }}>
                    <TerpeneCard terpene={terpene} onClick={onTerpeneClick} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

TerpeneCardGrid.displayName = 'TerpeneCardGrid';
