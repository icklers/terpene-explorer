import React, { useContext } from 'react';
import ThemeToggleButton from './ThemeToggleButton';
import LanguageSwitcher from './LanguageSwitcher';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Import localization files
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './Layout.module.css';

const translations = {
  en,
  de,
};

function Layout({ children }) {
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const t = translations[language];

  return (
    <div className={`${styles.layoutContainer} ${theme === 'dark' ? styles.dark : ''}`}>
      <header className={`${styles.header} ${theme === 'dark' ? styles.dark : ''}`}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>{t.app_title}</h1>
          <div className={styles.controls}>
            <ThemeToggleButton />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main>
        <div className={styles.mainContent}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
