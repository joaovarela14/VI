import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const ACCESS_OPTIONS = {
  all: 'all',
  yes: 'yes',
  no: 'no',
}

const WORK_LOCATIONS = ['Remote', 'Hybrid', 'Onsite']

const SocialIsolationBarChart = ({ data, theme, copy, common, showHeader = true }) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [filters, setFilters] = useState({
    region: 'all',
    gender: 'all',
    access: ACCESS_OPTIONS.yes,
  })

  const regionOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.region).filter(Boolean))).sort()
  }, [data])

  const genderOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.gender).filter(Boolean))).sort()
  }, [data])

  const filteredDataset = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    return data.filter((item) => {
      const matchesGender = filters.gender === 'all' || item.gender === filters.gender
      const matchesAccess = filters.access === ACCESS_OPTIONS.yes ? item.hasMentalHealthResources : !item.hasMentalHealthResources
      return matchesGender && matchesAccess
    })
  }, [data, filters.access, filters.gender])

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

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const width = 640
    const height = 360
    const margin = { top: 72, right: 32, bottom: 64, left: 64 }

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const regionDomain = filters.region === 'all' ? regionOptions : regionOptions.filter((region) => region === filters.region)
    const aggregated = regionDomain
      .map((region) => {
        const rows = filteredDataset.filter((item) => item.region === region)
        const locations = WORK_LOCATIONS.map((location) => {
          const locationRows = rows.filter((item) => item.workLocation === location)
          const values = locationRows.map((item) => item.socialIsolationRating).filter((value) => Number.isFinite(value))
          const average = values.length ? d3.mean(values) : null
          return {
            region,
            location,
            average,
            count: values.length,
          }
        })
        const totalResponses = locations.reduce((sum, item) => sum + item.count, 0)
        return {
          region,
          locations,
          hasData: totalResponses > 0,
        }
      })
      .filter((item) => item.hasData)

    if (!aggregated.length) {
      if (tooltip) {
        tooltip.style('opacity', 0)
      }
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .text(copy.empty)
      return
    }

    if (!containerNode || !tooltip) {
      return
    }

    const hideTooltip = () => {
      tooltip.style('opacity', 0)
    }

    const workLocationLabels = common?.workLocations ?? {}

    const showTooltip = (event, item) => {
      const bounds = containerNode.getBoundingClientRect()
      const tooltipContent =
        copy
          .tooltip({
            region: item.region,
            location: workLocationLabels[item.location] ?? item.location,
            average: item.average,
            count: item.count,
          })
          ?.replace(/\n/g, '<br />') ?? ''

      tooltip.style('opacity', 1).html(tooltipContent)

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

    const xScale = d3
      .scaleBand()
      .domain(aggregated.map((item) => item.region))
      .range([0, innerWidth])
      .paddingInner(0.25)
      .paddingOuter(0.1)

    const xSubScale = d3.scaleBand().domain(WORK_LOCATIONS).range([0, xScale.bandwidth()]).padding(0.15)

    const yScale = d3.scaleLinear().domain([0, 5]).range([innerHeight, 0])

    const colorScale = d3
      .scaleOrdinal()
      .domain(WORK_LOCATIONS)
      .range(['#38bdf8', '#c084fc', '#f97316'])

    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    chartGroup
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('font-size', 12))
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    chartGroup
      .append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((value) => value.toFixed ? value.toFixed(0) : value))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('font-size', 12))
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    chartGroup
      .append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -48)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 13)
      .attr('font-weight', 500)
      .text(copy.axisLabel)

    const regionGroups = chartGroup
      .selectAll('.region-group')
      .data(aggregated)
      .join('g')
      .attr('class', 'region-group')
      .attr('transform', (item) => `translate(${xScale(item.region) ?? 0}, 0)`)

    const bars = regionGroups
      .selectAll('.bar')
      .data((item) => item.locations)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (item) => xSubScale(item.location) ?? 0)
      .attr('width', xSubScale.bandwidth())
      .attr('y', (item) => (item.average != null ? yScale(item.average) : innerHeight))
      .attr('height', (item) => (item.average != null ? innerHeight - yScale(item.average) : 0))
      .attr('rx', 4)
      .attr('fill', (item) => colorScale(item.location))

    const valueFormatter = d3.format('.1f')

    bars
      .filter((item) => item.count > 0)
      .on('mouseenter', showTooltip)
      .on('mousemove', showTooltip)
      .on('mouseleave', hideTooltip)

    regionGroups
      .selectAll('.bar-label')
      .data((item) => item.locations.filter((location) => location.count > 0))
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (item) => (xSubScale(item.location) ?? 0) + xSubScale.bandwidth() / 2)
      .attr('y', (item) => Math.max(yScale(item.average ?? 0) - 6, 12))
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .text((item) => valueFormatter(item.average ?? 0))

    const legendTitle = copy.legendTitle ?? copy.legendHeading ?? ''
    const legend = svg
      .append('g')
      .attr('class', 'legend legend--vertical')
      .attr('transform', `translate(${width - margin.right - 140}, ${margin.top - 48})`)

    if (legendTitle) {
      legend
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', legendColor)
        .attr('font-size', 13)
        .attr('font-weight', 600)
        .text(legendTitle)
    }

    const legendItems = legend
      .selectAll('.legend-item')
      .data(WORK_LOCATIONS)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, index) => `translate(0, ${(index + 1) * 24})`)

    legendItems
      .append('circle')
      .attr('r', 7)
      .attr('cx', 7)
      .attr('cy', 0)
      .attr('fill', (location) => colorScale(location))
      .attr('stroke', gridColor)
      .attr('stroke-width', 1)

    legendItems
      .append('text')
      .attr('x', 24)
      .attr('y', 4)
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .text((location) => workLocationLabels[location] ?? location)
  }, [common, copy, filteredDataset, filters.region, regionOptions, theme])

  const handleFilterChange = (name) => (event) => {
    const value = event.target.value
    setFilters((current) => ({
      ...current,
      [name]: value,
    }))
  }

  return (
    <div ref={containerRef} className="chart-card chart-card--wide chart-card--tall">
      <div className="chart-header">
        <div className="chart-header__top">
          {showHeader && (
            <div>
              <h3>{copy.title}</h3>
              <p>{copy.description}</p>
            </div>
          )}
          <div className="chart-header__filters">
            <label className="chart-controls chart-filter-group">
              <span className="chart-filter-label">{copy.filters.region}</span>
              <select className="chart-select" value={filters.region} onChange={handleFilterChange('region')}>
                <option value="all">{copy.filters.allRegions}</option>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label className="chart-controls chart-filter-group">
              <span className="chart-filter-label">{copy.filters.gender}</span>
              <select className="chart-select" value={filters.gender} onChange={handleFilterChange('gender')}>
                <option value="all">{copy.filters.allGenders}</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </label>
            <label className="chart-controls chart-filter-group">
              <span className="chart-filter-label">{copy.filters.access}</span>
              <select className="chart-select" value={filters.access} onChange={handleFilterChange('access')}>
                <option value={ACCESS_OPTIONS.yes}>{copy.filters.accessYes}</option>
                <option value={ACCESS_OPTIONS.no}>{copy.filters.accessNo}</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <svg ref={svgRef} role="img" aria-label={copy.title} />
    </div>
  )
}

export default SocialIsolationBarChart
