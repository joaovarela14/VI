import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const MentalHealthByRegionChart = ({ data, theme, copy, common }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0) {
      return
    }

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const width = 420
    const height = 340
    const margin = { top: 40, right: 24, bottom: 64, left: 64 }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const regions = Array.from(new Set(data.map((d) => d.region)))
    const conditions = Array.from(new Set(data.map((d) => d.mentalHealthCondition)))
    const conditionLabels = copy?.legend ?? common?.conditions ?? {}

    const aggregated = regions.map((region) => {
      const rows = data.filter((d) => d.region === region)
      const totals = conditions.reduce((acc, condition) => {
        acc[condition] = rows.filter((d) => d.mentalHealthCondition === condition).length
        return acc
      }, {})

      return {
        region,
        total: rows.length,
        ...totals,
      }
    })

    const stack = d3.stack().keys(conditions)
    const series = stack(aggregated)

    const xScale = d3.scaleBand().domain(regions).range([0, innerWidth]).padding(0.4)

    const yMax = d3.max(aggregated, (d) => d.total) ?? 0
    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice()

    const colorScale = d3.scaleOrdinal(conditions, d3.schemeTableau10)

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    chartGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', axisColor)
      )
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    chartGroup
      .append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => (Number.isInteger(d) ? d : ''))
      )
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', axisColor)
      )
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    const groups = chartGroup
      .selectAll('.layer')
      .data(series)
      .join('g')
      .attr('fill', ({ key }) => colorScale(key))

    groups
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d) => xScale(d.data.region) ?? 0)
      .attr('y', (d) => yScale(d[1]))
      .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .append('title')
      .text(function (d) {
        const condition = d3.select(this.parentNode).datum().key
        const count = d[1] - d[0]
        const total = d.data.total
        const percent = total > 0 ? Math.round((count / total) * 100) : 0
        return copy.tooltip({
          region: d.data.region,
          condition: conditionLabels[condition] ?? condition,
          count,
          percent,
        })
      })

    const legend = svg
      .append('g')
      .attr('class', 'legend legend--grid')
      .attr('transform', `translate(${margin.left}, ${height - 24})`)

    const legendItem = legend
      .selectAll('g')
      .data(conditions)
      .join('g')
      .attr('transform', (_, i) => {
        const column = i % 3
        const row = Math.floor(i / 3)
        return `translate(${column * 130}, ${row * -20})`
      })

    legendItem
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('rx', 2)
      .attr('fill', (d) => colorScale(d))

    legendItem
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .text((d) => conditionLabels[d] ?? d)
  }, [common, copy, data, theme])

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
      </div>
      <svg ref={svgRef} role="img" aria-label="Stacked bar chart comparing mental health conditions across global regions" />
    </div>
  )
}

export default MentalHealthByRegionChart
