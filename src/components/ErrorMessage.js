import React from 'react';
import styles from './ErrorMessage.module.css';

function ErrorMessage({ message }) {
  return (
    <div className={styles.errorMessageContainer} role="alert">
      <strong className={styles.errorMessageStrong}>Error!</strong>
      <span className={styles.errorMessageSpan}> {message}</span>
    </div>
  );
}

export default ErrorMessage;