/**
 * TerpeneDetailModal Component
 *
 * Main modal component for displaying terpene details with Basic/Expert view toggle.
 * Implements therapeutic-focused design for medical cannabis patients.
 */

import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import ShareIcon from '@mui/icons-material/Share';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Link,
  Tooltip,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  Slide,
  AppBar as MuiAppBar,
  Toolbar,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState, useMemo, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryBadge } from './CategoryBadge';
import { DataQualityBadge } from './DataQualityBadge';
import { useShare } from '../hooks/useShare';
import { useSwipeToClose } from '../hooks/useSwipeToClose';
import type { TerpeneDetailModalProps } from '../types/terpene';
import {
  getTherapeuticColor,
  getEffectColor,
  categorizeEffects,
  parseConcentration,
  copyToClipboard,
  getConcentrationTooltip,
} from '../utils/terpeneHelpers';

/**
 * Slide transition component for mobile modal
 * Slides up from bottom on open, down on close
 */
const SlideTransition = forwardRef(function SlideTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const TerpeneDetailModal: React.FC<TerpeneDetailModalProps> = ({
  open,
  terpene,
  onClose,
  onTherapeuticPropertyClick,
  // onEffectClick removed - no longer needed after removing "All Effects" section
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNarrow = useMediaQuery('(max-width:400px)'); // Stack toggle buttons on very narrow screens
  // T122-T123: prefers-reduced-motion is handled automatically by Material UI TransitionProps
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [viewMode, setViewMode] = useState<'basic' | 'expert'>('basic'); // T111: Default to 'basic'
  const [snackbarOpen, setSnackbarOpen] = useState(false); // T151-T154: Snackbar for copy success
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // T003: Mobile-specific hooks
  const swipe = useSwipeToClose({
    onClose,
    enabled: isMobile && open,
  });

  const { share, status: shareStatus } = useShare({
    onSuccess: () => {
      setSnackbarMessage(t('modal.terpeneDetail.shareSuccess', 'Shared successfully!'));
      setSnackbarOpen(true);
    },
    onError: () => {
      setSnackbarMessage(t('modal.terpeneDetail.shareError', 'Failed to share'));
      setSnackbarOpen(true);
    },
  });

  // Categorize effects for display (Basic View - showAll = false, Expert View - showAll = true)
  const categorizedEffects = useMemo(() => {
    return terpene ? categorizeEffects(terpene.effects || [], viewMode === 'expert') : [];
  }, [terpene, viewMode]);

  // Memoize concentration data computation for performance (T104)
  const concentrationData = useMemo(() => {
    return terpene?.concentrationRange ? parseConcentration(terpene.concentrationRange, terpene.category) : null;
  }, [terpene]);

  // T003: Share handler for mobile
  const handleShare = async () => {
    if (!terpene) return;

    const effectsList = terpene.effects.slice(0, 5).join(', ');
    const effectsText = terpene.effects.length > 5 ? `${effectsList}, +${terpene.effects.length - 5} more` : effectsList;

    await share({
      title: terpene.name,
      text: `${terpene.name}\n\n${terpene.description}\n\nEffects: ${effectsText}`,
      url: `${window.location.origin}${window.location.pathname}?terpene=${encodeURIComponent(terpene.id)}`,
    });
  };

  if (!open || !terpene) return null;

  // T151-T154: Copy to clipboard handler
  const handleCopyFormula = () => {
    copyToClipboard(
      terpene.molecularData.molecularFormula,
      () => {
        setSnackbarMessage(t('modal.terpeneDetail.copySuccess', 'Molecular formula copied to clipboard'));
        setSnackbarOpen(true);
      },
      () => {
        setSnackbarMessage(t('modal.terpeneDetail.copyError', 'Failed to copy to clipboard'));
        setSnackbarOpen(true);
      }
    );
  };

  // Split aroma string into individual items
  const aromas = terpene.aroma
    .split(',')
    .map((aroma) => aroma.trim())
    .filter(Boolean);

  // Description truncation logic - increased by 50% from 120 to 180 characters
  const MAX_DESCRIPTION_LENGTH = 180;
  const shouldTruncate = terpene.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription =
    expandedDescription || !shouldTruncate ? terpene.description : terpene.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? SlideTransition : undefined}
      aria-labelledby="terpene-modal-title"
      aria-describedby="terpene-modal-description"
      PaperProps={{
        sx: {
          // UAT Fix: iOS Safari viewport height + safe area insets
          ...(isMobile && {
            height: '100dvh', // Dynamic viewport height (accounts for iOS address bar)
            paddingTop: 'env(safe-area-inset-top)', // iOS notch/status bar
            paddingBottom: 'env(safe-area-inset-bottom)', // iOS home indicator
          }),
          // T003: Apply swipe transform and opacity on mobile
          ...(isMobile && {
            transform: `translateY(${Math.max(0, swipe.deltaY)}px)`,
            opacity: swipe.opacity,
            transition: swipe.isDragging ? 'none' : 'all 0.3s ease',
          }),
        },
      }}
    >
      {/* T003: Mobile-specific AppBar with share button */}
      {/* UAT Fix: Changed position to 'sticky' for better iOS Safari compatibility */}
      {isMobile && (
        <MuiAppBar position="sticky" elevation={0}>
          <Toolbar sx={{ minHeight: 56 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label={t('modal.terpeneDetail.close', 'Close')}
              sx={{ minWidth: 48, minHeight: 48 }} // UAT Fix: Explicit touch target size
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
              {terpene.name}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleShare}
              aria-label={t('modal.terpeneDetail.share', 'Share terpene')}
              disabled={shareStatus === 'sharing'}
              sx={{ minWidth: 48, minHeight: 48 }} // UAT Fix: Explicit touch target size
            >
              <ShareIcon />
            </IconButton>
          </Toolbar>
        </MuiAppBar>
      )}

      {/* Desktop Title */}
      {!isMobile && (
        <DialogTitle id="terpene-modal-title">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              {terpene.name}
            </Typography>
            <CategoryBadge category={terpene.category} showTooltip={true} />
          </Box>
          <IconButton
            aria-label={t('modal.terpeneDetail.close', 'Close')}
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent
        {...(isMobile && {
          onTouchStart: swipe.handleTouchStart,
          onTouchMove: swipe.handleTouchMove,
          onTouchEnd: swipe.handleTouchEnd,
        })}
      >
        {/* View Toggle - T108-T124 */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newValue) => {
              if (newValue !== null) {
                setViewMode(newValue); // T113: Wire onChange
              }
            }}
            aria-label={t('modal.terpeneDetail.viewToggle.label', 'View mode selection')} // T118-T119
            sx={{
              // T116-T117: Vertical stacking on narrow mobile screens
              flexDirection: isNarrow ? 'column' : 'row',
              '& .MuiToggleButton-root': {
                // T003: Ensure touch targets ≥48px
                minHeight: isMobile ? 48 : 44,
                minWidth: isNarrow ? '100%' : 120,
                px: 2,
              },
            }}
          >
            <ToggleButton value="basic" aria-label={t('modal.terpeneDetail.viewToggle.basic', 'Basic View')}>
              {t('modal.terpeneDetail.viewToggle.basic', 'Basic View')}
            </ToggleButton>
            <ToggleButton value="expert" aria-label={t('modal.terpeneDetail.viewToggle.expert', 'Expert View')}>
              {t('modal.terpeneDetail.viewToggle.expert', 'Expert View')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Aroma section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
            Aroma Profile
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {aromas.map((aroma, index) => (
              <Chip key={index} label={aroma} size="small" />
            ))}
          </Box>
        </Box>

        {/* Description section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
            What it does for you
          </Typography>
          <Typography variant="body1" paragraph>
            {displayDescription}
          </Typography>
          {shouldTruncate && (
            <Link
              component="button"
              variant="body2"
              onClick={() => setExpandedDescription(!expandedDescription)}
              sx={{ cursor: 'pointer' }}
            >
              {expandedDescription ? 'Show less' : 'Read more...'}
            </Link>
          )}
        </Box>

        {/* Therapeutic Properties section - shown only in Basic View, moved to accordion in Expert View */}
        {viewMode === 'basic' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
              Therapeutic Properties
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {terpene.therapeuticProperties.map((property) => (
                <Chip
                  key={property}
                  label={property}
                  size="small"
                  sx={{
                    backgroundColor: getTherapeuticColor(property),
                    color: 'white',
                    cursor: onTherapeuticPropertyClick ? 'pointer' : 'default',
                  }}
                  onClick={onTherapeuticPropertyClick ? () => onTherapeuticPropertyClick(property) : undefined}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Effects section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
            Effects
          </Typography>
          {viewMode === 'basic' ? (
            // Basic View: Show only color-coded chips without category names
            <Box display="flex" flexWrap="wrap" gap={1}>
              {categorizedEffects.flatMap((category) =>
                category.effects.map((effect) => (
                  <Chip
                    key={effect}
                    label={effect}
                    size="small"
                    sx={{
                      backgroundColor: getEffectColor(effect),
                      color: 'white',
                      fontWeight: 'medium',
                    }}
                  />
                ))
              )}
            </Box>
          ) : (
            // Expert View: Show with category groupings
            <>
              {categorizedEffects.map((category) => (
                <Box key={category.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" component="h4" sx={{ mb: 1, color: 'text.secondary' }}>
                    {category.icon} {category.name}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {category.effects.map((effect) => (
                      <Chip
                        key={effect}
                        label={effect}
                        size="small"
                        sx={{
                          backgroundColor: getEffectColor(effect),
                          color: 'white',
                          fontWeight: 'medium',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Box>

        {/* Concentration Visualization section - shown only in Basic View, moved to accordion in Expert View */}
        {viewMode === 'basic' && concentrationData && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
              Concentration Range
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={terpene.concentrationRange}
                size="small"
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  fontWeight: 'medium',
                }}
              />
              <Tooltip title={getConcentrationTooltip(concentrationData.label, terpene.category)} placement="bottom" arrow>
                <Chip
                  label={`${concentrationData.label} (${Math.round(concentrationData.percentile)}%)`}
                  size="small"
                  sx={{
                    backgroundColor:
                      concentrationData.label === 'High'
                        ? 'success.light'
                        : concentrationData.label === 'Moderate'
                          ? 'warning.light'
                          : concentrationData.label === 'Low'
                            ? 'error.light'
                            : 'grey.300',
                    color: 'text.primary',
                    fontWeight: 'medium',
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Natural Sources section - Basic View shows first 3 */}
        {viewMode === 'basic' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
              Natural Sources
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {terpene.sources.slice(0, 3).map((source) => (
                <Chip key={source} label={source} size="small" />
              ))}
            </Box>
          </Box>
        )}

        {/* Expert View Content - T132-T185 */}
        {viewMode === 'expert' && (
          <Box sx={{ mt: 2 }}>
            {/* Therapeutic Details Accordion - reorganized to include therapeutic properties and concentration */}
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="therapeutic-details-content" id="therapeutic-details-header">
                <Typography variant="h6">Therapeutic Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Therapeutic Properties */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Therapeutic Properties
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {terpene.therapeuticProperties.map((property) => (
                      <Chip
                        key={property}
                        label={property}
                        size="small"
                        sx={{
                          backgroundColor: getTherapeuticColor(property),
                          color: 'white',
                          cursor: onTherapeuticPropertyClick ? 'pointer' : 'default',
                        }}
                        onClick={onTherapeuticPropertyClick ? () => onTherapeuticPropertyClick(property) : undefined}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Concentration Range */}
                {concentrationData && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      Concentration Range
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={terpene.concentrationRange}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          fontWeight: 'medium',
                        }}
                      />
                      <Tooltip title={getConcentrationTooltip(concentrationData.label, terpene.category)} placement="bottom" arrow>
                        <Chip
                          label={`${concentrationData.label} (${Math.round(concentrationData.percentile)}%)`}
                          size="small"
                          sx={{
                            backgroundColor:
                              concentrationData.label === 'High'
                                ? 'success.light'
                                : concentrationData.label === 'Moderate'
                                  ? 'warning.light'
                                  : concentrationData.label === 'Low'
                                    ? 'error.light'
                                    : 'grey.300',
                            color: 'text.primary',
                            fontWeight: 'medium',
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                )}

                {/* Notable Synergies - T140-T141 */}
                {terpene.notableDifferences && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                      Notable Synergies
                    </Typography>
                    <Typography variant="body2">{terpene.notableDifferences}</Typography>
                  </Alert>
                )}

                {/* Complete sources list - T142-T143 */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    All Natural Sources
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {terpene.sources.map((source) => (
                      <Chip key={source} label={source} size="small" />
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Molecular Properties Accordion - T145-T161 */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="molecular-properties-content"
                id="molecular-properties-header"
              >
                <Typography variant="h6">Molecular Properties</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Molecular class */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Class
                  </Typography>
                  <Typography variant="body1">{terpene.molecularData.class}</Typography>
                </Box>

                {/* Molecular formula with copy button - T149-T154 */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Molecular Formula
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">{terpene.molecularData.molecularFormula}</Typography>
                    <IconButton
                      size="small"
                      onClick={handleCopyFormula}
                      aria-label={t('modal.terpeneDetail.copyFormula', 'Copy molecular formula')}
                      title={t('modal.terpeneDetail.copyFormula', 'Copy molecular formula')}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Molecular weight */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Molecular Weight
                  </Typography>
                  <Typography variant="body1">{terpene.molecularData.molecularWeight} g/mol</Typography>
                </Box>

                {/* Boiling point */}
                {terpene.molecularData.boilingPoint && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Boiling Point
                    </Typography>
                    <Typography variant="body1">{terpene.molecularData.boilingPoint}°C</Typography>
                  </Box>
                )}

                {/* Isomer information - T159-T160 */}
                {terpene.isomerOf && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Isomer Information
                    </Typography>
                    <Typography variant="body1">
                      {terpene.isomerType} isomer of {terpene.isomerOf}
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Research & Evidence Accordion - T162-T178 */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="research-evidence-content" id="research-evidence-header">
                <Typography variant="h6">Research & Evidence</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Data Quality Badge - T164-T165 */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Data Quality
                  </Typography>
                  <DataQualityBadge quality={terpene.researchTier.dataQuality} />
                </Box>

                {/* Evidence Summary - T166-T169 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Evidence Summary
                  </Typography>
                  <Typography variant="body2">{terpene.researchTier.evidenceSummary}</Typography>
                </Box>

                {/* References - T170-T177 */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    References
                  </Typography>
                  <Box component="ol" sx={{ m: 0, pl: 3 }}>
                    {terpene.references.map((ref, index) => (
                      <Box key={index} component="li" sx={{ mb: 2 }}>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Chip label={ref.type} size="small" variant="outlined" />
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {ref.source}
                            </Typography>
                            {/* T176-T177: External link icon for URLs - use ref.url if available */}
                            {ref.url && (
                              <IconButton
                                size="small"
                                component="a"
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('modal.terpeneDetail.openReference', 'Open reference in new tab')}
                              >
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          {/* Display notes if present */}
                          {ref.notes && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', pl: 1 }}>
                              {ref.notes}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </DialogContent>

      {/* Snackbar for copy success/error notifications - T151-T154 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};
