/**
 * WarningSnackbar Component
 *
 * Displays validation warnings as dismissible snackbar notifications.
 * Implements Material UI Snackbar with Alert for FR-015.
 *
 * @see tasks.md T054
 */

import { Snackbar, Alert } from '@mui/material';
import React from 'react';

/**
 * Component props
 */
export interface WarningSnackbarProps {
  /** Warnings to display */
  warnings: string[] | null;
  /** Open state */
  open: boolean;
  /** Callback when snackbar is closed */
  onClose: () => void;
  /** Auto-hide duration in milliseconds (default: 6000) */
  autoHideDuration?: number;
}

/**
 * WarningSnackbar component
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function WarningSnackbar({ warnings, open, onClose, autoHideDuration = 6000 }: WarningSnackbarProps): React.ReactElement {
  if (!warnings || warnings.length === 0) {
    return <></>;
  }

  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={onClose} severity="warning" variant="filled" sx={{ width: '100%' }}>
        {warnings.length === 1 ? (
          warnings[0]
        ) : (
          <>
            <strong>Data validation warnings:</strong>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </>
        )}
      </Alert>
    </Snackbar>
  );
}
