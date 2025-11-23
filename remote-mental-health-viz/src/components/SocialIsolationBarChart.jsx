import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const ACCESS_OPTIONS = {
  all: 'all',
  yes: 'yes',
  no: 'no',
}

const SocialIsolationBarChart = ({ data, theme, copy, showHeader = true }) => {
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
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const width = 640
    const height = 360
    const margin = { top: 36, right: 32, bottom: 64, left: 64 }

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const regionDomain = filters.region === 'all' ? regionOptions : regionOptions.filter((region) => region === filters.region)
    const aggregated = regionDomain
      .map((region) => {
        const rows = filteredDataset.filter((item) => item.region === region)
        const values = rows.map((item) => item.socialIsolationRating).filter((value) => Number.isFinite(value))
        const average = values.length ? d3.mean(values) : null
        return {
          region,
          average,
          count: values.length,
        }
      })
      .filter((item) => item.count > 0)

    if (!aggregated.length) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .text(copy.empty)
      return
    }

    const xScale = d3
      .scaleBand()
      .domain(aggregated.map((item) => item.region))
      .range([0, innerWidth])
      .padding(0.35)

    const yScale = d3.scaleLinear().domain([0, 5]).range([innerHeight, 0])

    const colorScale = d3
      .scaleLinear()
      .domain([1, 3, 5])
      .range(['#38bdf8', '#818cf8', '#f97316'])

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

    const bars = chartGroup
      .selectAll('.bar')
      .data(aggregated)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (item) => xScale(item.region) ?? 0)
      .attr('y', (item) => yScale(item.average ?? 0))
      .attr('width', xScale.bandwidth())
      .attr('height', (item) => innerHeight - yScale(item.average ?? 0))
      .attr('rx', 6)
      .attr('fill', (item) => colorScale(item.average ?? 0))

    const valueFormatter = d3.format('.1f')

    bars
      .append('title')
      .text((item) =>
        copy.tooltip({
          region: item.region,
          average: item.average,
          count: item.count,
        })
      )

    chartGroup
      .selectAll('.bar-label')
      .data(aggregated)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (item) => (xScale(item.region) ?? 0) + xScale.bandwidth() / 2)
      .attr('y', (item) => Math.max(yScale(item.average ?? 0) - 6, 12))
      .attr('text-anchor', 'middle')
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .text((item) => valueFormatter(item.average ?? 0))
  }, [copy, filteredDataset, filters.region, regionOptions, theme])

  const handleFilterChange = (name) => (event) => {
    const value = event.target.value
    setFilters((current) => ({
      ...current,
      [name]: value,
    }))
  }

  return (
    <div className="chart-card chart-card--wide chart-card--tall">
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
