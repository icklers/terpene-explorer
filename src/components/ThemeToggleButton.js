import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './ThemeToggleButton.module.css';

const translations = {
  en,
  de,
};

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggleButton} ${theme === 'dark' ? styles.dark : ''}`}
    >
      {theme === 'light' ? t.switch_to_dark_mode : t.switch_to_light_mode}
    </button>
  );
}

export default ThemeToggleButton;
