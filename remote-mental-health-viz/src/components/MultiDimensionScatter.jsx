import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const locationOrder = ['Remote', 'Hybrid', 'Onsite']
const stressLevels = ['Low', 'Medium', 'High']

const MultiDimensionScatter = ({ data, theme, copy, common }) => {
  const [selectedLocation, setSelectedLocation] = useState('All')
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  const filteredData = useMemo(
    () =>
      data.filter((d) => {
        const hasValues =
          Number.isFinite(d.hoursWorked) && Number.isFinite(d.virtualMeetings) && d.stressLevel && d.workLocation
        const matchesLocation = selectedLocation === 'All' || d.workLocation === selectedLocation
        return hasValues && matchesLocation
      }),
    [data, selectedLocation]
  )

  const locationOptions = useMemo(() => ['All', ...locationOrder], [])

  const activeLocations = useMemo(
    () => (selectedLocation === 'All' ? locationOrder : [selectedLocation]),
    [selectedLocation]
  )

  const stressSizeScale = useMemo(
    () =>
      new Map([
        ['Low', 10],
        ['Medium', 15],
        ['High', 20],
      ]),
    []
  )

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

    if (!filteredData.length) {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()
      if (tooltip) {
        tooltip.style('opacity', 0)
      }
      return
    }

    if (!containerNode || !tooltip) {
      return
    }

    const locationLabels = common?.workLocations ?? {}
    const stressLabels = common?.stressLevels ?? {}

    const hideTooltip = () => {
      tooltip.style('opacity', 0)
    }

    const showTooltip = (event, datum) => {
      const bounds = containerNode.getBoundingClientRect()
      const locationLabel = locationLabels[datum.workLocation] ?? datum.workLocation
      const stressLabel = stressLabels[datum.stressLevel] ?? datum.stressLevel

      tooltip
        .style('opacity', 1)
        .html(
          copy.tooltip({
            employeeId: datum.employeeId,
            locationLabel,
            stressLabel,
            hoursWorked: datum.hoursWorked,
            virtualMeetings: datum.virtualMeetings,
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
    const margin = { top: 36, right: 160, bottom: 56, left: 64 }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xExtent = d3.extent(filteredData, (d) => d.hoursWorked)
    const meetingsExtent = d3.extent(filteredData, (d) => d.virtualMeetings)

    const xScale = d3
      .scaleLinear()
      .domain([Math.floor((xExtent[0] ?? 0) / 5) * 5, Math.ceil((xExtent[1] ?? 60) / 5) * 5])
      .range([0, innerWidth])
      .nice()

    const yMin = Math.min(0, meetingsExtent[0] ?? 0)
    const yMax = Math.max(meetingsExtent[1] ?? 10, 4)
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]).nice()

    const colorScale = d3
      .scaleOrdinal()
      .domain(locationOrder)
      .range(['#38bdf8', '#c084fc', '#f97316'])

    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

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
      .call(d3.axisBottom(xScale).ticks(6).tickFormat((d) => `${d} h`))
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
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d}`))
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', axisColor)
      )
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    chartGroup
      .selectAll('circle')
      .data(filteredData)
      .join('circle')
      .attr('cx', (d) => xScale(d.hoursWorked))
      .attr('cy', (d) => yScale(d.virtualMeetings) ?? innerHeight)
      .attr('r', (d) => stressSizeScale.get(d.stressLevel) ?? 12)
      .attr('fill', (d) => colorScale(d.workLocation))
      .attr('fill-opacity', 0.8)
      .attr('stroke', gridColor)
      .attr('stroke-width', 1)
      .on('mouseenter', showTooltip)
      .on('mousemove', showTooltip)
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
      .text(copy.legendHeading)

    const legendItem = legend
      .selectAll('.legend-item')
      .data(activeLocations)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${(i + 1) * 24})`)

    legendItem
      .append('circle')
      .attr('r', 7)
      .attr('cx', 7)
      .attr('cy', 0)
      .attr('fill', (d) => colorScale(d))
      .attr('stroke', gridColor)
      .attr('stroke-width', 1)

    legendItem
      .append('text')
      .attr('x', 24)
      .attr('y', 4)
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .text((d) => common?.workLocations?.[d] ?? d)

    const sizeLegend = legend.append('g').attr('transform', `translate(0, ${activeLocations.length * 24 + 32})`)

    sizeLegend
      .append('text')
      .attr('fill', legendColor)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .text(copy.sizeLegendHeading)

    const stressEntries = stressLevels.map((level) => ({
      level,
      radius: stressSizeScale.get(level) ?? 12,
    }))

    sizeLegend
      .selectAll('g')
      .data(stressEntries)
      .join('g')
      .attr('transform', (_, i) => `translate(0, ${(i + 1) * 28})`)
      .each(function ({ level, radius }) {
        const group = d3.select(this)
        group
          .append('circle')
          .attr('cx', 12)
          .attr('cy', 0)
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', legendColor)
          .attr('stroke-width', 1)

        group
          .append('text')
          .attr('x', 32)
          .attr('y', 4)
          .attr('fill', legendColor)
          .attr('font-size', 12)
          .text(common?.stressLevels?.[level] ?? level)
      })
    return () => {
      hideTooltip()
    }
  }, [activeLocations, common, copy, filteredData, stressSizeScale, theme])

  return (
    <div ref={containerRef} className="chart-card chart-card--wide">
      <div className="chart-header">
        <div className="chart-header__top">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.description}</p>
          </div>
          <label className="chart-controls">
            <span className="visually-hidden">{copy.filterLabel}</span>
            <select
              className="chart-select"
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
            >
              {locationOptions.map((option) => {
                const label = copy.filterOptions[option] ?? option
                return (
                  <option key={option} value={option}>
                    {label}
                  </option>
                )
              })}
            </select>
          </label>
        </div>
      </div>
      {filteredData.length === 0 ? (
        <p className="chart-empty">{copy.empty}</p>
      ) : (
        <svg ref={svgRef} role="img" aria-label="Scatter plot relating hours, stress levels, and meeting counts across work locations" />
      )}
    </div>
  )
}

export default MultiDimensionScatter
