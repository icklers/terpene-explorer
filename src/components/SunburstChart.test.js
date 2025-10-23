import { render, screen } from '@testing-library/react';
import SunburstChart from './SunburstChart';
import * as d3 from 'd3';

// Mock d3.select to return a mock selection object
const mockSelection = {
  attr: jest.fn().mockReturnThis(),
  append: jest.fn().mockReturnThis(),
  style: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  selectAll: jest.fn(() => mockSelection), // selectAll should also return a mock selection
  data: jest.fn(() => mockSelection),
  enter: jest.fn(() => mockSelection),
};

jest.spyOn(d3, 'select').mockReturnValue(mockSelection);

// Mock d3.hierarchy, partition, and arc
jest.spyOn(d3, 'hierarchy').mockReturnValue({
  sum: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  descendants: jest.fn(() => ([{ depth: 1, data: { name: 'mock' } }])),
});
jest.spyOn(d3, 'partition').mockReturnValue(jest.fn(() => jest.fn()));
jest.spyOn(d3, 'arc').mockReturnValue(jest.fn());

test('renders sunburst chart', () => {
  const data = [
    { id: '1', name: 'Myrcene', effects: ['Sedative'] },
    { id: '2', name: 'Linalool', effects: ['Anxiolytic'] },
  ];
  const onSliceClick = jest.fn();
  render(<SunburstChart data={data} onSliceClick={onSliceClick} />);
  const svgElement = screen.getByRole('img'); // Assuming SVG is rendered as an image role
  expect(svgElement).toBeInTheDocument();

  // Verify that d3.select was called with the SVG element
  expect(d3.select).toHaveBeenCalledWith(svgElement);
});
