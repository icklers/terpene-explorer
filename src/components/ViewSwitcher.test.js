import { render, screen, fireEvent } from '@testing-library/react';
import ViewSwitcher from './ViewSwitcher';

test('renders view switcher and handles selection', () => {
  const views = ['Grid', 'Sunburst', 'Table'];
  const onViewChange = jest.fn();
  render(<ViewSwitcher views={views} onViewChange={onViewChange} />);
  
  const gridButton = screen.getByText('Grid');
  expect(gridButton).toBeInTheDocument();

  fireEvent.click(gridButton);
  expect(onViewChange).toHaveBeenCalledWith('Grid');
});
