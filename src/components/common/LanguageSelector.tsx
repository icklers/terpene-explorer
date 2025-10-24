/**
 * LanguageSelector Component
 *
 * Dropdown select for switching between supported languages (English/German).
 * Integrates with i18next for internationalization.
 *
 * @see tasks.md T081
 */

import React from 'react';
import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Component props
 */
export interface LanguageSelectorProps {
  /** Currently selected language code */
  language: string;
  /** Callback when language changes */
  onChange: (language: string) => void;
}

/**
 * Supported languages
 */
const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
] as const;

/**
 * LanguageSelector component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps): React.ReactElement {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={language}
        onChange={handleChange}
        aria-label={t('language.selector', 'Language')}
        sx={{
          color: 'inherit',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '.MuiSvgIcon-root': {
            color: 'inherit',
          },
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.nativeLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
