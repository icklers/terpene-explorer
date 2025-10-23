import { render, screen, fireEvent } from '@testing-library/react';
import EffectFilter from './EffectFilter';

test('renders effect filter and handles selection', () => {
  const effects = ['Sedative', 'Anxiolytic'];
  const onFilterChange = jest.fn();
  render(<EffectFilter effects={effects} onFilterChange={onFilterChange} />);
  
  const selectElement = screen.getByRole('combobox');
  expect(selectElement).toBeInTheDocument();

  fireEvent.change(selectElement, { target: { value: 'Sedative' } });
  expect(onFilterChange).toHaveBeenCalledWith('Sedative');
});
