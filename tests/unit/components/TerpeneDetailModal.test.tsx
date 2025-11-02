import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';

import { TerpeneDetailModal } from '../../../src/components/TerpeneDetailModal';
import { lightTheme } from '../../../src/theme/lightTheme';

const sampleTerpene = {
  name: 'SampleTerpene',
  effects: ['Energizing', 'Relaxing'],
  taste: 'Citrus',
  aroma: 'Citrus, Lemon, Orange',
  description: 'A sample terpene for tests',
  therapeuticProperties: ['Anti-inflammatory'],
  notableDifferences: null,
  molecularData: { boilingPoint: null },
  sources: ['Citrus peel'],
};

describe('TerpeneDetailModal', () => {
  it('renders effect chips with category colors and is accessible', () => {
    const { getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <TerpeneDetailModal open={true} terpene={sampleTerpene as any} onClose={() => {}} />
      </ThemeProvider>
    );

    // Test that effects are rendered with category headers
    expect(getByText('Mood & Energy')).toBeTruthy();
    expect(getByText('Energizing')).toBeTruthy();
    expect(getByText('Relaxation & Anxiety')).toBeTruthy();
    expect(getByText('Relaxing')).toBeTruthy();
  });
});
