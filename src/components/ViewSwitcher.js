import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './ViewSwitcher.module.css';

const translations = {
  en,
  de,
};

function ViewSwitcher({ views, onViewChange }) {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div className={styles.viewSwitcherContainer}>
      {views.map(view => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={styles.viewSwitcherButton}
        >
          {t[view.toLowerCase()]}
        </button>
      ))}
    </div>
  );
}

export default ViewSwitcher;
