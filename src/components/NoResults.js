import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './NoResults.module.css';

const translations = {
  en,
  de,
};

function NoResults() {
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const t = translations[language];

  return (
    <div className={styles.noResultsContainer}>
      <p className={`${styles.noResultsText} ${theme === 'dark' ? styles.dark : ''}`}>{t.no_results}</p>
    </div>
  );
}

export default NoResults;