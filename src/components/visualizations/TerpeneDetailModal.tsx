/**
 * TerpeneDetailModal Component
 *
 * Controlled modal component for displaying detailed terpene information.
 * Uses keepMounted for smooth in-place content updates when clicking different rows.
 *
 * @see specs/002-terpene-data-model/contracts/data-service.md
 * @see specs/002-terpene-data-model/spec.md - FR-004
 */

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Divider, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getEffectColor } from '../../services/colorService';
import { getCategoryForEffect } from '../../services/filterService';
import type { TerpeneDetailModalProps } from '../../types/terpene';

/**
 * Modal component displaying comprehensive terpene information
 *
 * Displays 7 fields in specified order:
 * 1. Effects
 * 2. Taste
 * 3. Description
 * 4. Therapeutic Properties
 * 5. Notable Differences (if present)
 * 6. Boiling Point (if present)
 * 7. Natural Sources
 *
 * @param props - Modal properties
 * @param props.open - Controls modal visibility
 * @param props.terpene - Terpene to display (null when closed)
 * @param props.onClose - Callback when user closes modal
 */
export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps> = ({ open, terpene, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Dialog
      open={open && terpene !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="terpene-detail-title"
      aria-describedby="terpene-detail-description"
      keepMounted
    >
      {terpene && (
        <>
          <DialogTitle id="terpene-detail-title">{terpene.name}</DialogTitle>

          <DialogContent>
            {/* 1. Effects Section */}
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {t('terpeneDetails.fields.effects')}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {terpene.effects.map((effect: string) => {
                  const categoryPalette = (theme.palette as unknown as { category?: Record<string, string> }).category;
                  const categoryId = getCategoryForEffect(effect);
                  const categoryColor =
                    categoryId && categoryPalette && categoryPalette[categoryId] ? categoryPalette[categoryId] : getEffectColor(effect);
                  const contrastText = theme.palette.getContrastText ? theme.palette.getContrastText(categoryColor) : '#ffffff';

                  return (
                    <Chip
                      key={effect}
                      label={effect}
                      size="small"
                      sx={{
                        backgroundColor: categoryColor,
                        color: contrastText,
                        borderColor: categoryColor,
                        fontWeight: 500,
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 2. Taste Section */}
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {t('terpeneDetails.fields.taste')}
              </Typography>
              <Typography>{terpene.taste}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 3. Description Section */}
            <Box mb={2} id="terpene-detail-description">
              <Typography variant="h6" gutterBottom>
                {t('terpeneDetails.fields.description')}
              </Typography>
              <Typography>{terpene.description}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 4. Therapeutic Properties Section */}
            {terpene.therapeuticProperties.length > 0 && (
              <>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {t('terpeneDetails.fields.therapeuticProperties')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {terpene.therapeuticProperties.map((prop: string) => (
                      <Chip key={prop} label={prop} color="secondary" size="small" />
                    ))}
                  </Stack>
                </Box>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* 5. Notable Differences Section (optional) */}
            {terpene.notableDifferences && (
              <>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {t('terpeneDetails.fields.notableDifferences')}
                  </Typography>
                  <Typography>{terpene.notableDifferences}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* 6. Boiling Point Section (optional) */}
            {terpene.molecularData.boilingPoint !== null && (
              <>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    {t('terpeneDetails.fields.boilingPoint')}
                  </Typography>
                  <Typography>
                    {terpene.molecularData.boilingPoint}
                    {t('terpeneDetails.celsius')}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* 7. Sources Section */}
            {terpene.sources.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  {t('terpeneDetails.fields.sources')}
                </Typography>
                <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                  {terpene.sources.map((source: string, index: number) => (
                    <Box component="li" key={index} sx={{ mb: 0.5 }}>
                      <Typography>{source}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="primary">
              {t('terpeneDetails.close')}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
