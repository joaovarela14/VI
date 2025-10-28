import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const sleepOrder = ['Poor', 'Average', 'Good']

const HoursVsSleepScatter = ({ data }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0) {
      return
    }

    const width = 420
    const height = 320
    const margin = { top: 24, right: 32, bottom: 48, left: 80 }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const sleepLevels = Array.from(new Set([...sleepOrder, ...data.map((d) => d.sleepQuality)])).filter(Boolean)

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.hoursWorked))
      .nice()
      .range([0, innerWidth])

    const yScale = d3
      .scaleBand()
      .domain(sleepLevels)
      .range([innerHeight, 0])
      .padding(0.3)

    const colorScale = d3
      .scaleOrdinal()
      .domain(['Low', 'Medium', 'High'])
      .range(['#34d399', '#fbbf24', '#f87171'])

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    chartGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', '#94a3b8')
      )
      .call((g) => g.selectAll('path').attr('stroke', '#334155'))
      .call((g) => g.selectAll('line').attr('stroke', '#334155'))

    chartGroup
      .append('g')
      .call(d3.axisLeft(yScale))
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', '#94a3b8')
      )
      .call((g) => g.selectAll('path').attr('stroke', '#334155'))
      .call((g) => g.selectAll('line').attr('stroke', '#334155'))

    const jitter = () => (Math.random() - 0.5) * (yScale.bandwidth() * 0.5)

    chartGroup
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(d.hoursWorked))
      .attr('cy', (d) => (yScale(d.sleepQuality) ?? innerHeight) + yScale.bandwidth() / 2 + jitter())
      .attr('r', 5)
      .attr('fill', (d) => colorScale(d.stressLevel))
      .attr('fill-opacity', 0.9)
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 1)
      .append('title')
      .text(
        (d) =>
          `${d.employeeId}\nHours per week: ${d.hoursWorked}\nSleep quality: ${d.sleepQuality}\nStress level: ${d.stressLevel}`
      )

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${margin.top - 12})`)

    const legendItem = legend
      .selectAll('g')
      .data(colorScale.domain())
      .join('g')
      .attr('transform', (_, i) => `translate(${i * 110},0)`)

    legendItem
      .append('circle')
      .attr('r', 6)
      .attr('cx', 6)
      .attr('cy', 6)
      .attr('fill', (d) => colorScale(d))

    legendItem
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('fill', '#cbd5f5')
      .attr('font-size', 12)
      .text((d) => d)
  }, [data])

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Hours worked vs. sleep quality</h3>
        <p>Each dot represents an employee, colored by self-reported stress level. Light jitter prevents overplotting.</p>
      </div>
      <svg ref={svgRef} role="img" aria-label="Scatter plot relating hours worked to sleep quality" />
    </div>
  )
}

export default HoursVsSleepScatter
