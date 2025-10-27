import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/theme/darkTheme';
import { FilterControls } from '@/components/filters/FilterControls';

// Mock Effect type
interface Effect {
  name: string;
  displayName: {
    en: string;
    de?: string;
  };
  color: string;
  terpeneCount: number;
}

describe('FilterChips Integration Test', () => {
  const mockEffects: Effect[] = [
    {
      name: 'energizing',
      displayName: { en: 'Energizing' },
      color: '#4caf50',
      terpeneCount: 5,
    },
    {
      name: 'relaxing',
      displayName: { en: 'Relaxing' },
      color: '#ffb300',
      terpeneCount: 3,
    },
    {
      name: 'focus',
      displayName: { en: 'Focus' },
      color: '#2196f3',
      terpeneCount: 2,
    },
  ];

  const mockOnToggleEffect = vi.fn();
  const mockOnClearFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render chips with correct initial styling', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={[]}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    const energizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });
    const relaxingChip = screen.getByRole('button', { name: /relaxing, 3 terpenes/i });

    // Check initial unselected state styling
    expect(energizingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.background.paper, // dark card surface
      borderColor: darkTheme.palette.primary.main, // green to prevent layout shift
      color: darkTheme.palette.primary.main, // green text
    });

    expect(relaxingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.background.paper, // dark card surface
      borderColor: darkTheme.palette.primary.main, // green to prevent layout shift
      color: darkTheme.palette.primary.main, // green text
    });
  });

  it('should apply selected styling when chip is selected', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={['energizing']}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    const energizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });
    const relaxingChip = screen.getByRole('button', { name: /relaxing, 3 terpenes/i });

    // Selected chip should have light background and green border
    expect(energizingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.action.selected, // light elevated background
      borderColor: darkTheme.palette.primary.main, // green border
      color: darkTheme.palette.primary.contrastText, // white text
    });

    // Unselected chip should have dark background and green border
    expect(relaxingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.background.paper, // dark card surface
      borderColor: darkTheme.palette.primary.main, // green border to prevent layout shift
      color: darkTheme.palette.primary.main, // green text
    });
  });

  it('should call onToggleEffect when a chip is clicked', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={[]}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    const energizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });

    fireEvent.click(energizingChip);

    expect(mockOnToggleEffect).toHaveBeenCalledWith('energizing');
  });

  it('should not cause layout shift when selecting/deselecting chips', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={[]}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    const energizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });

    // Get initial size
    const initialRect = energizingChip.getBoundingClientRect();

    // Click to select (should not change size due to transparent border on unselected)
    fireEvent.click(energizingChip);

    // Get size after selection
    const afterSelectRect = energizingChip.getBoundingClientRect();

    // The size should be the same (prevent layout shift)
    // Using toEqual to check if the dimensions are the same
    expect(initialRect.width).toBe(afterSelectRect.width);
    expect(initialRect.height).toBe(afterSelectRect.height);
  });

  it('should update chip state from unselected to selected and back', () => {
    const { rerender } = render(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={[]}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    const energizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });

    // Initially unselected
    expect(energizingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.background.paper, // dark card surface
      borderColor: darkTheme.palette.primary.main, // green to prevent layout shift
      color: darkTheme.palette.primary.main, // green text
    });

    // Simulate selection by re-rendering with the effect selected
    rerender(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={['energizing']}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    // Check that it's now styled as selected
    const updatedEnergizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });
    expect(updatedEnergizingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.action.selected, // light elevated background
      borderColor: darkTheme.palette.primary.main, // green border
      color: darkTheme.palette.primary.contrastText, // white text
    });

    // Simulate deselection by re-rendering with no selected effects
    rerender(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={[]}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    // Check that it's now styled as unselected again
    const deselectedEnergizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });
    expect(deselectedEnergizingChip).toHaveStyle({
      backgroundColor: darkTheme.palette.background.paper, // dark card surface
      borderColor: darkTheme.palette.primary.main, // green to prevent layout shift
      color: darkTheme.palette.primary.main, // green text
    });
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <FilterControls
          effects={mockEffects}
          selectedEffects={['energizing']}
          onToggleEffect={mockOnToggleEffect}
          onClearFilters={mockOnClearFilters}
        />
      </ThemeProvider>
    );

    const energizingChip = screen.getByRole('button', { name: /energizing, 5 terpenes/i });

    // Selected chip should have aria-pressed="true"
    expect(energizingChip).toHaveAttribute('aria-pressed', 'true');

    // Unselected chip should have aria-pressed="false"
    const relaxingChip = screen.getByRole('button', { name: /relaxing, 3 terpenes/i });
    expect(relaxingChip).toHaveAttribute('aria-pressed', 'false');
  });
});
