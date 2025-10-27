import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/theme/darkTheme';
import { ViewModeToggle } from '@/components/common/ViewModeToggle';

describe('ViewModeToggle Integration Test', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render toggle buttons with correct initial state', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="sunburst" onChange={mockOnChange} />
      </ThemeProvider>
    );

    // Check that both buttons are present
    const sunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const tableButton = screen.getByRole('button', { name: /table/i });

    expect(sunburstButton).toBeInTheDocument();
    expect(tableButton).toBeInTheDocument();

    // Check that the sunburst button is selected
    expect(sunburstButton).toHaveAttribute('aria-pressed', 'true');
    expect(tableButton).toHaveAttribute('aria-pressed', 'false');

    // Check the toggle group is present
    const toggleGroup = screen.getByRole('group');
    expect(toggleGroup).toBeInTheDocument();
  });

  it('should apply correct styling to selected and unselected buttons', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="sunburst" onChange={mockOnChange} />
      </ThemeProvider>
    );

    const sunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const tableButton = screen.getByRole('button', { name: /table/i });

    // Selected button should have primary.main bgcolor and primary.contrastText color
    expect(sunburstButton).toHaveStyle({
      'background-color': darkTheme.palette.primary.main,
      color: darkTheme.palette.primary.contrastText,
    });

    // Unselected button should not have the primary.main bgcolor
    expect(tableButton).not.toHaveStyle({
      'background-color': darkTheme.palette.primary.main,
    });
  });

  it('should call onChange when clicking the table button', async () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="sunburst" onChange={mockOnChange} />
      </ThemeProvider>
    );

    const tableButton = screen.getByRole('button', { name: /table/i });

    fireEvent.click(tableButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('table');
    });
  });

  it('should call onChange when clicking the sunburst button when table is selected', async () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="table" onChange={mockOnChange} />
      </ThemeProvider>
    );

    const sunburstButton = screen.getByRole('button', { name: /sunburst/i });

    fireEvent.click(sunburstButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('sunburst');
    });
  });

  it('should update selection state after mode change', async () => {
    const { rerender } = render(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="sunburst" onChange={mockOnChange} />
      </ThemeProvider>
    );

    // Initially sunburst should be selected
    const initialSunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const initialTableButton = screen.getByRole('button', { name: /table/i });
    expect(initialSunburstButton).toHaveAttribute('aria-pressed', 'true');
    expect(initialTableButton).toHaveAttribute('aria-pressed', 'false');

    // Simulate change to table and re-render
    rerender(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="table" onChange={mockOnChange} />
      </ThemeProvider>
    );

    const newSunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const newTableButton = screen.getByRole('button', { name: /table/i });
    expect(newSunburstButton).toHaveAttribute('aria-pressed', 'false');
    expect(newTableButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should not allow both buttons to be selected simultaneously', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ViewModeToggle mode="sunburst" onChange={mockOnChange} />
      </ThemeProvider>
    );

    const sunburstButton = screen.getByRole('button', { name: /sunburst/i });
    const tableButton = screen.getByRole('button', { name: /table/i });

    // Only one button should be pressed at a time (exclusive selection)
    expect(sunburstButton).toHaveAttribute('aria-pressed', 'true');
    expect(tableButton).toHaveAttribute('aria-pressed', 'false');
  });
});
