import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { ThemeContext } from '../contexts/ThemeContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './TableView.module.css';

const translations = {
  en,
  de,
};

function TableView({ terpenes }) {
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const t = translations[language];

  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.table} ${theme === 'dark' ? styles.dark : ''}`}>
        <thead>
          <tr>
            <th className={`${styles.tableHeader} ${theme === 'dark' ? styles.dark : ''}`}>{t.name}</th>
            <th className={`${styles.tableHeader} ${theme === 'dark' ? styles.dark : ''}`}>{t.aroma}</th>
            <th className={`${styles.tableHeader} ${theme === 'dark' ? styles.dark : ''}`}>{t.effects}</th>
            <th className={`${styles.tableHeader} ${theme === 'dark' ? styles.dark : ''}`}>{t.sources}</th>
          </tr>
        </thead>
        <tbody>
          {terpenes.map(terpene => (
            <tr key={terpene.id}>
              <td className={`${styles.tableData} ${theme === 'dark' ? styles.dark : ''}`}>{terpene.name}</td>
              <td className={`${styles.tableData} ${theme === 'dark' ? styles.dark : ''}`}>{terpene.aroma}</td>
              <td className={`${styles.tableData} ${theme === 'dark' ? styles.dark : ''}`}>{terpene.effects.join(', ')}</td>
              <td className={`${styles.tableData} ${theme === 'dark' ? styles.dark : ''}`}>{terpene.sources.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
