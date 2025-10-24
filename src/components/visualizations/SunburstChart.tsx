/**
 * SunburstChart Component
 *
 * D3.js-based sunburst chart for hierarchical terpene visualization.
 * Displays terpenes grouped by effects with click-to-filter interaction.
 *
 * @see tasks.md T065
 */

import { Box, Tooltip } from '@mui/material';
import * as d3 from 'd3';
import { hierarchy, partition } from 'd3-hierarchy';
import React, { useEffect, useRef, useState } from 'react';

import type { SunburstNode } from '../../utils/sunburstTransform';

/**
 * Component props
 */
export interface SunburstChartProps {
  /** Hierarchical data for sunburst */
  data: SunburstNode;
  /** Callback when slice is clicked */
  onSliceClick: (node: SunburstNode) => void;
  /** Chart width (default: 600) */
  width?: number;
  /** Chart height (default: 600) */
  height?: number;
}

/**
 * SunburstChart component using D3.js
 *
 * @param props - Component props
 * @returns Rendered component
 */
export function SunburstChart({
  data,
  onSliceClick,
  width = 600,
  height = 600,
}: SunburstChartProps): React.ReactElement {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    content: '',
  });

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Sunburst chart showing terpenes grouped by effects');

    // Create hierarchy
    const root = hierarchy(data)
      .sum((d: any) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create partition layout
    const partitionLayout = partition<SunburstNode>()
      .size([2 * Math.PI, radius]);

    partitionLayout(root);

    // Arc generator
    const arc = d3
      .arc<d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1);

    // Create slices
    const slices = svg
      .selectAll('g')
      .data(root.descendants().filter((d) => d.depth > 0) as d3.HierarchyRectangularNode<SunburstNode>[])
      .join('g')
      .attr('class', 'slice');

    // Add paths
    slices
      .append('path')
      .attr('d', (d) => arc(d))
      .attr('fill', (d) => d.data.color || '#ccc')
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('data-name', (d) => d.data.name)
      .attr('cursor', 'pointer')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) => {
        if (d.data.type === 'effect') {
          return `${d.data.name} effect, ${d.value} terpenes`;
        } else {
          return `${d.data.name} terpene`;
        }
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        onSliceClick(d.data);
      })
      .on('keydown', function(event, d) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSliceClick(d.data);
        }
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill-opacity', 1);

        const content = d.data.type === 'effect'
          ? `${d.data.name}: ${d.value} terpenes`
          : d.data.name;

        setTooltip({
          show: true,
          x: event.clientX,
          y: event.clientY,
          content,
        });
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill-opacity', 0.8);
        setTooltip((prev) => ({ ...prev, show: false }));
      })
      .on('focus', function() {
        d3.select(this).attr('fill-opacity', 1);
      })
      .on('blur', function() {
        d3.select(this).attr('fill-opacity', 0.8);
      });

    // Add labels for larger slices
    slices
      .append('text')
      .attr('transform', (d: d3.HierarchyRectangularNode<SunburstNode>) => {
        const angle = ((d.x0 + d.x1) / 2) * (180 / Math.PI);
        const rotate = angle - 90;
        const radius = (d.y0 + d.y1) / 2;
        return `rotate(${rotate}) translate(${radius},0) rotate(${angle > 180 ? 180 : 0})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')
      .text((d: d3.HierarchyRectangularNode<SunburstNode>) => {
        const arcLength = (d.x1 - d.x0) * (d.y0 + d.y1) / 2;
        return arcLength > 30 ? d.data.name : '';
      });

    // Keyboard navigation
    const pathElements = svg.selectAll('path').nodes() as SVGPathElement[];

    pathElements.forEach((path, index) => {
      d3.select(path).on('keydown', function(event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          const nextIndex = (index + 1) % pathElements.length;
          const nextElement = pathElements[nextIndex];
          if (nextElement) nextElement.focus();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          const prevIndex = (index - 1 + pathElements.length) % pathElements.length;
          const prevElement = pathElements[prevIndex];
          if (prevElement) prevElement.focus();
        }
      });
    });

  }, [data, width, height, onSliceClick]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg ref={svgRef} />

      {/* Tooltip */}
      {tooltip.show && (
        <Tooltip
          open={tooltip.show}
          title={tooltip.content}
          placement="top"
          arrow
          PopperProps={{
            anchorEl: {
              clientHeight: 0,
              clientWidth: 0,
              getBoundingClientRect: () => ({
                top: tooltip.y,
                left: tooltip.x,
                right: tooltip.x,
                bottom: tooltip.y,
                width: 0,
                height: 0,
                x: tooltip.x,
                y: tooltip.y,
                toJSON: () => ({}),
              }),
            },
          }}
        >
          <Box />
        </Tooltip>
      )}
    </Box>
  );
}
