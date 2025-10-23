import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function SunburstChart({ data, onSliceClick }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) {
      return; // Ensure ref is attached to DOM and data is available
    }

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 6;

    // Clear previous chart to prevent duplicates on re-render
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Data transformation for Sunburst Chart
    // Create a root node for the hierarchy
    const rootData = { name: "Terpenes", children: [] };

    // Group data by category and then by effect
    const categoriesMap = new Map();

    data.forEach(terpene => {
      if (!categoriesMap.has(terpene.category)) {
        categoriesMap.set(terpene.category, { name: terpene.category, children: [] });
      }
      const categoryNode = categoriesMap.get(terpene.category);

      terpene.effects.forEach(effect => {
        let effectNode = categoryNode.children.find(child => child.name === effect);
        if (!effectNode) {
          effectNode = { name: effect, children: [] };
          categoryNode.children.push(effectNode);
        }
        effectNode.children.push({ name: terpene.name, value: 1, data: terpene }); // Add terpene as a leaf node
      });
    });

    rootData.children = Array.from(categoriesMap.values());

    const root = d3.hierarchy(rootData)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);

    const partition = d3.partition()
      .size([2 * Math.PI, root.height + 1]);

    partition(root);

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .outerRadius(d => radius * (d.y1 + 1))
      .innerRadius(d => radius * d.y0);

    // Color scale (placeholder for now)
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll('path')
      .data(root.descendants().filter(d => d.depth))
      .enter().append('path')
      .attr("display", d => d.depth ? null : "none")
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", d => color((d.children ? d : d.parent).data.name))
      .on("click", (event, d) => onSliceClick(d.data.data || d.data)); // Pass original terpene data or category/effect data

  }, [data, onSliceClick]);

  return <svg role="img" ref={svgRef}></svg>;
}

export default SunburstChart;
