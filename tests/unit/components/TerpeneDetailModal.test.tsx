import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { axe } from 'vitest-axe';

import { TerpeneDetailModal } from '../../../src/components/visualizations/TerpeneDetailModal';
import { lightTheme } from '../../../src/theme/lightTheme';

const sampleTerpene = {
  name: 'SampleTerpene',
  effects: ['Energizing', 'Relaxing'],
  taste: 'Citrus',
  description: 'A sample terpene for tests',
  therapeuticProperties: ['Anti-inflammatory'],
  notableDifferences: null,
  molecularData: { boilingPoint: null },
  sources: ['Citrus peel'],
};

describe('TerpeneDetailModal', () => {
  it('renders effect chips with category colors and is accessible', async () => {
    const { getByText, container } = render(
      <ThemeProvider theme={lightTheme}>
        <TerpeneDetailModal open={true} terpene={sampleTerpene as any} onClose={() => {}} />
      </ThemeProvider>
    );

    const chip = getByText('Energizing');
    expect(chip).toBeTruthy();

    // Ensure styling applied (backgroundColor present)
    const style = window.getComputedStyle(chip as Element);
    expect(style.backgroundColor).toBeTruthy();

    // Accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
