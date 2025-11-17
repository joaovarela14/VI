import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const ACCESS_KEYS = ['yes', 'no']
const ACCESS_COLORS = {
  yes: '#22c55e',
  no: '#f87171',
}

const WorkLifeBalanceLineChart = ({ data, theme, copy }) => {
  const [dimension, setDimension] = useState('age')
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        Number.isFinite(row.workLifeBalance) &&
        (Number.isFinite(row.age) || Number.isFinite(row.yearsExperience))
      ),
    [data]
  )

  const series = useMemo(() => {
    const accessor = dimension === 'age' ? 'age' : 'yearsExperience'

    const grouped = d3.rollups(
      filteredData.filter((row) => Number.isFinite(row[accessor])),
      (records) => ({
        average: d3.mean(records, (item) => item.workLifeBalance) ?? 0,
        count: records.length,
      }),
      (row) => (row.hasMentalHealthResources ? 'yes' : 'no'),
      (row) => row[accessor]
    )

    return grouped
      .map(([accessKey, entries]) => ({
        id: accessKey,
        values: Array.from(entries, ([xValue, metrics]) => ({
          x: xValue,
          average: metrics.average,
          count: metrics.count,
        }))
          .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.average))
          .sort((a, b) => a.x - b.x),
      }))
      .filter((dataset) => dataset.values.length > 0)
  }, [dimension, filteredData])

  useEffect(() => {
    const containerNode = containerRef.current
    const tooltip = containerNode
      ? d3
          .select(containerNode)
          .selectAll('.chart-tooltip')
          .data([null])
          .join('div')
          .attr('class', 'chart-tooltip')
          .style('opacity', 0)
      : null

    if (!containerNode || !tooltip || series.length === 0) {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()
      if (tooltip) {
        tooltip.style('opacity', 0)
      }
      return
    }

    const hideTooltip = () => {
      tooltip.style('opacity', 0)
    }

    const showTooltip = (event, datum, accessKey) => {
      const bounds = containerNode.getBoundingClientRect()
      const accessLabel = copy.legend[accessKey] ?? accessKey
      const xLabel = copy.xOptions[dimension]

      tooltip
        .style('opacity', 1)
        .html(
          copy.tooltip({
            accessLabel,
            xLabel,
            xValue: datum.x,
            average: datum.average,
            count: datum.count,
          })
        )

      const tooltipNode = tooltip.node()
      const tooltipWidth = tooltipNode?.offsetWidth ?? 0
      const tooltipHeight = tooltipNode?.offsetHeight ?? 0

      let left = event.clientX - bounds.left + 16
      let top = event.clientY - bounds.top + 16

      if (left + tooltipWidth > bounds.width - 8) {
        left = bounds.width - tooltipWidth - 8
      }
      if (top + tooltipHeight > bounds.height - 8) {
        top = event.clientY - bounds.top - tooltipHeight - 16
      }
      if (left < 8) left = 8
      if (top < 8) top = 8

      tooltip.style('left', `${left}px`).style('top', `${top}px`)
    }

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const width = 640
    const height = 360
    const margin = { top: 48, right: 200, bottom: 56, left: 64 }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const allPoints = series.flatMap((dataset) => dataset.values)
    const xExtent = d3.extent(allPoints, (point) => point.x)
    if (xExtent[0] === xExtent[1]) {
      const value = xExtent[0] ?? 0
      xExtent[0] = value - 1
      xExtent[1] = value + 1
    }
    const yMax = d3.max(allPoints, (point) => point.average) ?? 5
    const yDomainMax = Math.max(yMax, 5)

    const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]).nice()
    const yScale = d3.scaleLinear().domain([0, yDomainMax]).range([innerHeight, 0]).nice()

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    chartGroup
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .call((g) => g.selectAll('line').attr('stroke', gridColor).attr('stroke-opacity', 0.2))
      .call((g) => g.selectAll('path').remove())

    chartGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
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
      .call(d3.axisLeft(yScale).ticks(5))
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', axisColor)
      )
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    const xLabel = chartGroup
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 12)
      .text(copy.xOptions[dimension])

    const yLabel = chartGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -48)
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 12)
      .text(copy.yAxisLabel)

    const lineGenerator = d3
      .line()
      .defined((point) => Number.isFinite(point.x) && Number.isFinite(point.average))
      .x((point) => xScale(point.x))
      .y((point) => yScale(point.average))
      .curve(d3.curveMonotoneX)

    chartGroup
      .selectAll('.line-series')
      .data(series)
      .join('path')
      .attr('class', 'line-series')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .attr('stroke', (dataset) => ACCESS_COLORS[dataset.id] ?? '#60a5fa')
      .attr('d', (dataset) => lineGenerator(dataset.values))

    chartGroup
      .selectAll('.line-points')
      .data(series)
      .join('g')
      .attr('class', 'line-points')
      .selectAll('circle')
      .data((dataset) => dataset.values.map((point) => ({ ...point, accessKey: dataset.id })))
      .join('circle')
      .attr('cx', (datum) => xScale(datum.x))
      .attr('cy', (datum) => yScale(datum.average))
      .attr('r', 4)
      .attr('fill', (datum) => ACCESS_COLORS[datum.accessKey] ?? '#60a5fa')
      .attr('stroke', gridColor)
      .attr('stroke-width', 1)
      .on('mouseenter', (event, datum) => showTooltip(event, datum, datum.accessKey))
      .on('mousemove', (event, datum) => showTooltip(event, datum, datum.accessKey))
      .on('mouseleave', hideTooltip)

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)

    legend
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', legendColor)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .text(copy.legendTitle)

    const legendItems = legend
      .selectAll('g')
      .data(ACCESS_KEYS)
      .join('g')
      .attr('transform', (_, index) => `translate(0, ${(index + 1) * 24})`)

    legendItems
      .append('line')
      .attr('x1', 0)
      .attr('y1', 6)
      .attr('x2', 24)
      .attr('y2', 6)
      .attr('stroke-width', 3)
      .attr('stroke', (key) => ACCESS_COLORS[key] ?? '#60a5fa')

    legendItems
      .append('text')
      .attr('x', 32)
      .attr('y', 9)
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .text((key) => copy.legend[key] ?? key)

    return () => {
      hideTooltip()
    }
  }, [copy, dimension, series, theme])

  const handleDimensionChange = (event) => {
    setDimension(event.target.value)
  }

  const hasData = series.length > 0

  return (
    <div ref={containerRef} className="chart-card chart-card--wide chart-card--tall">
      <div className="chart-header">
        <div className="chart-header__top">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.description}</p>
          </div>
          <label className="chart-controls">
            <span className="visually-hidden">{copy.toggleLabel}</span>
            <select className="chart-select" value={dimension} onChange={handleDimensionChange}>
              {Object.entries(copy.xOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {!hasData ? (
        <p className="chart-empty">{copy.empty}</p>
      ) : (
        <svg ref={svgRef} role="img" aria-label={copy.ariaLabel} />
      )}
    </div>
  )
}

export default WorkLifeBalanceLineChart
