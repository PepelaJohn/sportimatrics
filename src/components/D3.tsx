import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface D3ChartProps {
  data: { name: string; minutesPlayed: number }[];
}

export const D3Chart: React.FC<D3ChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.minutesPlayed) || 0])
      .nice()
      .range([height, 0]);

    const g = svg
      .append("g")
      .attr("max-width", "50px")
      .attr("overflow", "hidden")
      .attr("background-color", "50px")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .selectAll(".tick text")
      .attr("fill", "#8d8d8dea")

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
      .selectAll(".tick text")
      .attr("fill", "#fff") // Y-axis labels color

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name) || 0)
      .attr("max-width", "50px")
      .attr("overflow", "hidden")
      .attr("background-color", "50px")
      .attr("y", (d) => y(d.minutesPlayed))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.minutesPlayed))
      .attr("fill", "steelblue"); // Bar color

    svg.style("background-color", "#3333330"); 
    svg.style("border", "1px solid #33333342")// SVG background color
  }, [data]);

  return <svg ref={svgRef} width={700} height={400} />;
};
