/**
 * SearchBar Component
 *
 * Search input with debouncing and sanitization for terpene search.
 * Implements 300ms debounce delay to reduce unnecessary filtering.
 *
 * @see tasks.md T063
 */

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { sanitizeSearchQuery } from '../../utils/sanitize';

/**
 * Component props
 */
export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes (after debounce) */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Maximum input length */
  maxLength?: number;
  /** Results count for ARIA live region */
  resultsCount?: number;
}

/**
 * SearchBar component with debouncing
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function SearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
  debounceMs = 300,
  maxLength,
  resultsCount,
}: SearchBarProps): React.ReactElement {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync localValue when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Sanitize input: prevent XSS, trim, and convert to lowercase (T095)
  const sanitize = useCallback(
    (input: string): string => {
      // Apply XSS sanitization first (NFR-SEC-001)
      let sanitized = sanitizeSearchQuery(input);

      // Convert to lowercase for case-insensitive search
      sanitized = sanitized.toLowerCase();

      // Apply maxLength if specified
      if (maxLength && sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
      }

      return sanitized;
    },
    [maxLength]
  );

  // Handle input change with debouncing
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocalValue(newValue);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        const sanitized = sanitize(newValue);
        onChange(sanitized);
      }, debounceMs);
    },
    [onChange, sanitize, debounceMs]
  );

  // Handle clear button click (immediate, no debounce)
  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');

    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Focus input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange]);

  const defaultPlaceholder = t('search.placeholder', 'Search terpenes by name, aroma, or effects...');
  const defaultAriaLabel = t('search.ariaLabel', 'Search for terpenes');

  return (
    <Box>
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder || defaultPlaceholder}
        inputProps={{
          'aria-label': ariaLabel || defaultAriaLabel,
          maxLength,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: localValue && (
            <InputAdornment position="end">
              <IconButton aria-label={t('search.clear', 'Clear search')} onClick={handleClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* ARIA live region for results count */}
      {resultsCount !== undefined && (
        <Box
          role="status"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {resultsCount === 1
            ? t('search.oneResult', '1 result found')
            : t('search.resultsCount', {
                defaultValue: '{{count}} results found',
                count: resultsCount,
              })}
        </Box>
      )}
    </Box>
  );
}
