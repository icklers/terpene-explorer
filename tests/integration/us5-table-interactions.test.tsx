import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/theme/darkTheme';
import { TerpeneTable } from '@/components/visualizations/TerpeneTable';

// Mock data for testing
interface Terpene {
  id: string;
  name: string;
  aroma: string;
  effects: string[];
  sources: string[];
}

describe('Table Interactions Integration Test', () => {
  const mockTerpenes: Terpene[] = [
    {
      id: '1',
      name: 'Limonene',
      aroma: 'Citrus',
      effects: ['energizing', 'mood-enhancing'],
      sources: ['lemon', 'orange'],
    },
    {
      id: '2',
      name: 'Myrcene',
      aroma: 'Earthy',
      effects: ['sedating', 'muscle-relaxant'],
      sources: ['mango', 'hops'],
    },
    {
      id: '3',
      name: 'Pinene',
      aroma: 'Pine',
      effects: ['focus', 'alertness'],
      sources: ['pine', 'rosemary'],
    },
    {
      id: '4',
      name: 'Linalool',
      aroma: 'Floral',
      effects: ['relaxing', 'anxiety-reducing'],
      sources: ['lavender', 'coriander'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the table with correct structure', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <TerpeneTable terpenes={mockTerpenes} />
      </ThemeProvider>
    );

    // Check that the table structure is present
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check that we have the expected number of rows (header + data rows)
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockTerpenes.length + 1); // +1 for header
  });

  it('should have correct table structure with rows and cells', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <TerpeneTable terpenes={mockTerpenes} />
      </ThemeProvider>
    );

    // Check that the table contains the expected data
    expect(screen.getByText('Limonene')).toBeInTheDocument();
    expect(screen.getByText('Myrcene')).toBeInTheDocument();
    expect(screen.getByText('Citrus')).toBeInTheDocument();
    expect(screen.getByText('Earthy')).toBeInTheDocument();
  });

  it('should render all table columns', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <TerpeneTable terpenes={mockTerpenes} />
      </ThemeProvider>
    );

    // Check header columns exist
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Aroma')).toBeInTheDocument();
    expect(screen.getByText('Effects')).toBeInTheDocument();
    expect(screen.getByText('Sources')).toBeInTheDocument();
  });
});
