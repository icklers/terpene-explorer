import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

import styles from './TerpeneCard.module.css';

function TerpeneCard({ terpene }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${styles.terpeneCard} ${theme === 'dark' ? styles.dark : ''}`}>
      <h3 className={styles.terpeneName}>{terpene.name}</h3>
      <p className={`${styles.terpeneAroma} ${theme === 'dark' ? styles.dark : ''}`}>{terpene.aroma}</p>
      <div className={styles.effectsContainer}>
        {terpene.effects.map(effect => (
          <span key={effect} className={`${styles.effectTag} ${theme === 'dark' ? styles.dark : ''}`}>
            {effect}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TerpeneCard;