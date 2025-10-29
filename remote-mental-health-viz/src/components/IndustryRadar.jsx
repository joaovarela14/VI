import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const workLocations = ['Remote', 'Hybrid', 'Onsite']

const IndustryRadar = ({ data, theme, copy, common }) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  const industryOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.industry))).filter(Boolean).sort(),
    [data]
  )

  const [selectedIndustry, setSelectedIndustry] = useState(() => industryOptions[0] ?? '')
  const [locationFilter, setLocationFilter] = useState('All')

  useEffect(() => {
    if (industryOptions.length && !industryOptions.includes(selectedIndustry)) {
      setSelectedIndustry(industryOptions[0])
    }
  }, [industryOptions, selectedIndustry])

  const roleAxes = useMemo(() => {
    if (!selectedIndustry) {
      return []
    }

    const rows = data.filter((d) => d.industry === selectedIndustry && d.jobRole)
    const counts = d3.rollups(
      rows,
      (values) => values.length,
      (d) => d.jobRole
    )
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, 6)
      .map(([role]) => role)

    return counts
  }, [data, selectedIndustry])

  const activeLocations = useMemo(
    () => (locationFilter === 'All' ? workLocations : [locationFilter]),
    [locationFilter]
  )

  const grouped = useMemo(() => {
    if (!selectedIndustry || !roleAxes.length) {
      return []
    }

    const filtered = data.filter(
      (d) =>
        d.industry === selectedIndustry &&
        d.jobRole &&
        (locationFilter === 'All' || d.workLocation === locationFilter)
    )

    return activeLocations.map((location) => {
      const rows = filtered.filter((d) => d.workLocation === location)
      const total = rows.length
      return {
        location,
        total,
        totals: roleAxes.map((role) => {
          if (!total) {
            return 0
          }
          const count = rows.filter((d) => d.jobRole === role).length
          return count / total
        }),
      }
    })
  }, [activeLocations, data, locationFilter, roleAxes, selectedIndustry])

  const hasData = grouped.some(({ total }) => total > 0)

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

    if (!selectedIndustry || !roleAxes.length || !hasData) {
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

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const width = 640
    const height = 420
    const margin = { top: 40, right: 160, bottom: 40, left: 80 }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2
    const centerX = margin.left + (width - margin.left - margin.right) / 2
    const centerY = margin.top + (height - margin.top - margin.bottom) / 2

    const angleSlice = (Math.PI * 2) / roleAxes.length
    const maxValue = d3.max(grouped, (group) => d3.max(group.totals)) ?? 0
    const scaleMax = maxValue > 0 ? maxValue : 1
    const radialScale = d3.scaleLinear().domain([0, scaleMax]).range([0, radius])
    const levelSteps = [0.25, 0.5, 0.75, 1]
    const ringValues = levelSteps.map((step) => step * scaleMax)

    const gridContainer = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`)

    ringValues.forEach((value) => {
      const radiusValue = radialScale(value)
      gridContainer
        .append('circle')
        .attr('r', radiusValue)
        .attr('fill', 'none')
        .attr('stroke', gridColor)
        .attr('stroke-opacity', 0.2)
      gridContainer
        .append('text')
        .attr('x', 0)
        .attr('y', -radiusValue - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .attr('font-size', 11)
        .text(copy.ringLabel ? copy.ringLabel(value) : value)
    })

    roleAxes.forEach((role, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const lineEndX = Math.cos(angle) * radialScale(scaleMax)
      const lineEndY = Math.sin(angle) * radialScale(scaleMax)

      gridContainer
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', lineEndX)
        .attr('y2', lineEndY)
        .attr('stroke', gridColor)
        .attr('stroke-opacity', 0.4)

      svg
        .append('text')
        .attr('x', centerX + Math.cos(angle) * (radialScale(scaleMax) + 16))
        .attr('y', centerY + Math.sin(angle) * (radialScale(scaleMax) + 16))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', axisColor)
        .attr('font-size', 12)
        .text(role)
    })

    const colorScale = d3.scaleOrdinal(workLocations, ['#38bdf8', '#22c55e', '#f97316'])

    const radarLine = d3
      .lineRadial()
      .radius((d) => radialScale(d))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed.tension(0.6))

    const radarGroup = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`)

    radarGroup
      .selectAll('.radar-area')
      .data(grouped)
      .join('path')
      .attr('class', 'radar-area')
      .attr('d', (d) => radarLine(d.totals))
      .attr('fill', (d) => colorScale(d.location))
      .attr('fill-opacity', 0.15)
      .attr('stroke', (d) => colorScale(d.location))
      .attr('stroke-width', 2)

    const hideTooltip = () => {
      tooltip.style('opacity', 0)
    }

    const showTooltip = (event, datum) => {
      const bounds = containerNode.getBoundingClientRect()
      const groupMeta = grouped.find((group) => group.location === datum.location)
      const total = groupMeta?.total ?? 0
      const count = total ? Math.round(datum.value * total) : 0
      const locationLabel = common?.workLocations?.[datum.location] ?? datum.location

      tooltip
        .style('opacity', 1)
        .html(
          copy.tooltip({
            role: roleAxes[datum.index],
            locationLabel,
            share: datum.value,
            total,
            count,
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

    radarGroup
      .selectAll('.radar-points')
      .data(grouped)
      .join('g')
      .attr('class', 'radar-points')
      .selectAll('circle')
      .data((d) => d.totals.map((value, index) => ({ value, index, location: d.location })))
      .join('circle')
      .attr('cx', (d) => radialScale(d.value) * Math.cos(d.index * angleSlice - Math.PI / 2))
      .attr('cy', (d) => radialScale(d.value) * Math.sin(d.index * angleSlice - Math.PI / 2))
      .attr('r', 4)
      .attr('fill', (d) => colorScale(d.location))
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
      .text(copy.legendTitle)

    const legendItem = legend
      .selectAll('g')
      .data(activeLocations)
      .join('g')
      .attr('transform', (_, i) => `translate(0, ${(i + 1) * 22})`)

    legendItem
      .append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .attr('rx', 3)
      .attr('fill', (d) => colorScale(d))
      .attr('stroke', gridColor)
      .attr('stroke-width', 1)

    legendItem
      .append('text')
      .attr('x', 22)
      .attr('y', 11)
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .text((d) => common?.workLocations?.[d] ?? d)
    return () => {
      hideTooltip()
    }
  }, [activeLocations, common, copy, grouped, hasData, roleAxes, selectedIndustry, theme])

  const noData = !selectedIndustry || !roleAxes.length || !hasData

  return (
    <div ref={containerRef} className="chart-card chart-card--wide">
      <div className="chart-header">
        <div className="industry-radar__controls">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.description}</p>
          </div>
          <div className="industry-radar__filters">
            <label>
              <span className="visually-hidden">{copy.sectorLabel}</span>
              <select
                className="chart-select"
                value={selectedIndustry}
                onChange={(event) => setSelectedIndustry(event.target.value)}
              >
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="visually-hidden">{copy.locationLabel}</span>
              <select
                className="chart-select"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
              >
                <option value="All">{copy.optionAllLocations}</option>
                {workLocations.map((location) => (
                  <option key={location} value={location}>
                    {common?.workLocations?.[location] ?? location}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      {noData ? (
        <p className="chart-empty">{copy.empty}</p>
      ) : (
        <svg ref={svgRef} role="img" aria-label="Radar chart comparing job role distribution within a sector by work location" />
      )}
    </div>
  )
}

export default IndustryRadar
