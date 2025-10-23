import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './EffectFilter.module.css';

const translations = {
  en,
  de,
};

function EffectFilter({ effects, onFilterChange }) {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div className={styles.effectFilterContainer}>
      <label htmlFor="effect-filter" className={styles.effectFilterLabel}>{t.filter_by_effect}</label>
      <select 
        id="effect-filter"
        onChange={(e) => onFilterChange(e.target.value)}
        className={styles.effectFilterSelect}
      >
        <option value="">{t.all}</option>
        {effects.map(effect => (
          <option key={effect} value={effect}>{effect}</option>
        ))}
      </select>
    </div>
  );
}

export default EffectFilter;
