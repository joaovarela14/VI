import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const stressLevels = ['Low', 'Medium', 'High']
const ALL = '__all__'

const DatasetOverviewChart = ({ data, theme, copy, common }) => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  const [industryFilter, setIndustryFilter] = useState(ALL)
  const [roleFilter, setRoleFilter] = useState(ALL)
  const [locationFilter, setLocationFilter] = useState(ALL)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const stressLabels = copy?.legend ?? common?.stressLevels ?? {}
  const sleepLabels = common?.sleepQuality ?? {}

  const industryOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.industry))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [data]
  )

  const roleOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.jobRole))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [data]
  )

  const locationOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.workLocation))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [data]
  )

  useEffect(() => {
    if (industryFilter !== ALL && !industryOptions.includes(industryFilter)) {
      setIndustryFilter(ALL)
    }
  }, [industryFilter, industryOptions])

  useEffect(() => {
    if (roleFilter !== ALL && !roleOptions.includes(roleFilter)) {
      setRoleFilter(ALL)
    }
  }, [roleFilter, roleOptions])

  useEffect(() => {
    if (locationFilter !== ALL && !locationOptions.includes(locationFilter)) {
      setLocationFilter(ALL)
    }
  }, [locationFilter, locationOptions])

  const filteredData = useMemo(
    () =>
      data.filter((entry) => {
        if (industryFilter !== ALL && entry.industry !== industryFilter) {
          return false
        }
        if (roleFilter !== ALL && entry.jobRole !== roleFilter) {
          return false
        }
        if (locationFilter !== ALL && entry.workLocation !== locationFilter) {
          return false
        }
        return true
      }),
    [data, industryFilter, locationFilter, roleFilter]
  )

  const regionOrder = useMemo(
    () => Array.from(new Set(data.map((d) => d.region))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [data]
  )

  const regionGroups = useMemo(() => {
    const groups = new Map()
    filteredData.forEach((entry) => {
      if (!entry.region) {
        return
      }
      const list = groups.get(entry.region) ?? []
      list.push(entry)
      groups.set(entry.region, list)
    })
    return groups
  }, [filteredData])

  const aggregated = useMemo(() => {
    return regionOrder.map((region) => {
      const rows = regionGroups.get(region) ?? []

      const counts = rows.reduce(
        (acc, row) => {
          if (stressLevels.includes(row.stressLevel)) {
            acc[row.stressLevel] += 1
          }
          return acc
        },
        {
          Low: 0,
          Medium: 0,
          High: 0,
        }
      )

      return {
        region,
        total: rows.length,
        ...counts,
      }
    })
  }, [regionGroups, regionOrder])

  useEffect(() => {
    if (selectedRegion && !aggregated.some((item) => item.region === selectedRegion)) {
      setSelectedRegion(null)
    }
  }, [aggregated, selectedRegion])

  const handleRegionClick = useCallback((region) => {
    setSelectedRegion((current) => (current === region ? null : region))
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
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
    const width = 640
    const height = 360
    const margin = { top: 48, right: 24, bottom: 72, left: 72 }

    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    if (!aggregated.length) {
      if (tooltip) {
        tooltip.style('opacity', 0)
      }
      return
    }

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'
    const highlightColor = '#38bdf8'

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xScale = d3
      .scaleBand()
      .domain(aggregated.map((d) => d.region))
      .range([0, innerWidth])
      .padding(0.35)

    const yMax = d3.max(aggregated, (d) => d.total) ?? 0
    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice()

    const stack = d3.stack().keys(stressLevels)
    const series = stack(aggregated)

    const colorScale = d3.scaleOrdinal().domain(stressLevels).range(['#34d399', '#fbbf24', '#f87171'])
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    chartGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) =>
        g
          .selectAll('text')
          .attr('font-size', 12)
          .attr('fill', axisColor)
          .attr('transform', 'rotate(-30)')
          .style('text-anchor', 'end')
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
      .selectAll('.dataset-layer')
      .data(series)
      .join('g')
      .attr('fill', ({ key }) => colorScale(key))

    const hideTooltip = () => {
      tooltip?.style('opacity', 0)
    }

    const showTooltip = (event, d) => {
      if (!tooltip || !containerNode) {
        return
      }
      const level = d3.select(event.currentTarget.parentNode).datum().key
      const count = d[1] - d[0]
      const total = d.data.total
      const percentage = total > 0 ? count / total : 0
      const content = copy.tooltip({
        region: d.data.region,
        stressLabel: stressLabels[level] ?? level,
        count,
        percentage,
      })
      const bounds = containerNode.getBoundingClientRect()
      const offsetX = event.clientX - bounds.left + 12
      const offsetY = event.clientY - bounds.top - 32

      tooltip
        .style('opacity', 1)
        .style('left', `${offsetX}px`)
        .style('top', `${offsetY}px`)
        .html(content.replace(/\n/g, '<br />'))
    }

    groups
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d) => xScale(d.data.region) ?? 0)
      .attr('y', (d) => yScale(d[1]))
      .attr('height', (d) => Math.max(0, yScale(d[0]) - yScale(d[1])))
      .attr('width', xScale.bandwidth())
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .attr('opacity', (d) => (!selectedRegion || d.data.region === selectedRegion ? 1 : 0.45))
      .attr('stroke', (d) => (selectedRegion && d.data.region === selectedRegion ? highlightColor : 'none'))
      .attr('stroke-width', (d) => (selectedRegion && d.data.region === selectedRegion ? 2 : 0))
      .attr('stroke-linejoin', 'round')
      .on('click', (_, d) => handleRegionClick(d.data.region))
      .on('mousemove', showTooltip)
      .on('mouseenter', showTooltip)
      .on('mouseleave', hideTooltip)

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${margin.top - 24})`)

    legend
      .selectAll('g')
      .data(stressLevels)
      .join('g')
      .attr('transform', (_, index) => `translate(${index * 150}, 0)`)
      .call((legendGroup) => {
        legendGroup
          .append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('rx', 2)
          .attr('fill', (d) => colorScale(d))

        legendGroup
          .append('text')
          .attr('x', 18)
          .attr('y', 10)
          .attr('fill', legendColor)
          .attr('font-size', 12)
          .text((d) => stressLabels[d] ?? d)
      })
  }, [aggregated, copy, handleRegionClick, selectedRegion, stressLabels, theme])

  const selectedRows = useMemo(() => {
    if (selectedRegion && regionGroups.has(selectedRegion)) {
      return regionGroups.get(selectedRegion)
    }
    return filteredData
  }, [filteredData, regionGroups, selectedRegion])

  const totalSelected = selectedRows.length

  const stressSummary = useMemo(
    () =>
      stressLevels.map((level) => {
        const count = selectedRows.filter((row) => row.stressLevel === level).length
        const percentage = totalSelected > 0 ? count / totalSelected : 0
        return {
          id: level,
          label: stressLabels[level] ?? level,
          count,
          percentage,
        }
      }),
    [selectedRows, stressLabels, totalSelected]
  )

  const isolationAverage = useMemo(() => {
    const values = selectedRows.map((row) => row.socialIsolationRating).filter((value) => Number.isFinite(value))
    if (!values.length) {
      return null
    }
    return d3.mean(values) ?? null
  }, [selectedRows])

  const hoursAverage = useMemo(() => {
    const values = selectedRows.map((row) => row.hoursWorked).filter((value) => Number.isFinite(value))
    if (!values.length) {
      return null
    }
    return d3.mean(values) ?? null
  }, [selectedRows])

  const resourceStats = useMemo(() => {
    if (!totalSelected) {
      return null
    }
    const withAccess = selectedRows.filter((row) => row.hasMentalHealthResources).length
    return {
      count: withAccess,
      percentage: withAccess / totalSelected,
    }
  }, [selectedRows, totalSelected])

  const sleepDistribution = useMemo(() => {
    if (!totalSelected) {
      return []
    }
    const rows = selectedRows.filter((row) => row.sleepQuality)
    const counts = d3.rollups(
      rows,
      (values) => values.length,
      (row) => row.sleepQuality
    )
    return counts
      .sort((a, b) => d3.descending(a[1], b[1]))
      .map(([quality, count]) => ({
        id: quality ?? 'unknown',
        label: sleepLabels[quality] ?? quality ?? copy.details.unknown,
        count,
        percentage: totalSelected > 0 ? count / totalSelected : 0,
      }))
  }, [copy.details?.unknown, selectedRows, sleepLabels, totalSelected])

  const detailsTitle = selectedRegion ? copy.details.regionTitle(selectedRegion) : copy.details.overviewTitle
  const detailsSubtitle = selectedRegion ? copy.details.regionSubtitle : copy.details.overviewSubtitle

  const formatCount = copy.formatters?.count ?? ((value) => value ?? 0)
  const formatDecimal = copy.formatters?.decimal ?? ((value) => value ?? 0)
  const formatPercent = copy.formatters?.percent ?? ((value) => value ?? 0)

  const hasFilteredData = filteredData.length > 0

  return (
    <div className="chart-card chart-card--wide chart-card--tall dataset-overview-card" ref={containerRef}>
      <div className="chart-header">
        <div className="chart-header__top">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.description}</p>
          </div>
          <div className="chart-header__filters" role="group" aria-label={copy.filters.ariaLabel}>
            <label className="visually-hidden" htmlFor="dataset-overview-industry">
              {copy.filters.industry}
            </label>
            <select
              id="dataset-overview-industry"
              className="chart-select"
              value={industryFilter}
              onChange={(event) => setIndustryFilter(event.target.value)}
            >
              <option value={ALL}>{copy.filters.allIndustries}</option>
              {industryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label className="visually-hidden" htmlFor="dataset-overview-role">
              {copy.filters.role}
            </label>
            <select
              id="dataset-overview-role"
              className="chart-select"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value={ALL}>{copy.filters.allRoles}</option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label className="visually-hidden" htmlFor="dataset-overview-location">
              {copy.filters.location}
            </label>
            <select
              id="dataset-overview-location"
              className="chart-select"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              <option value={ALL}>{copy.filters.allLocations}</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {copy.instructions && <p className="dataset-overview__hint">{copy.instructions}</p>}
      </div>

      <div className="dataset-overview__content">
        <div className="dataset-overview__chart">
          {hasFilteredData ? (
            <svg ref={svgRef} role="img" aria-label={copy.ariaLabel} />
          ) : (
            <p className="chart-empty">{copy.empty}</p>
          )}
        </div>
        <div className="dataset-overview__details">
          <div className="dataset-details__header">
            <h4>{detailsTitle}</h4>
            <p>{detailsSubtitle}</p>
          </div>
          <div className="dataset-details__grid">
            <div className="dataset-details__stat">
              <p className="dataset-details__label">{copy.details.employees}</p>
              <p className="dataset-details__value">{formatCount(totalSelected)}</p>
            </div>
            <div className="dataset-details__stat">
              <p className="dataset-details__label">{copy.details.avgIsolation}</p>
              <p className="dataset-details__value">
                {isolationAverage != null ? formatDecimal(isolationAverage) : copy.details.noData}
              </p>
            </div>
            <div className="dataset-details__stat">
              <p className="dataset-details__label">{copy.details.avgHours}</p>
              <p className="dataset-details__value">
                {hoursAverage != null ? formatDecimal(hoursAverage) : copy.details.noData}
              </p>
            </div>
          </div>

          <div className="dataset-details__block">
            <p className="dataset-details__label">{copy.details.sleepQuality}</p>
            {sleepDistribution.length ? (
              <div className="dataset-details__bars">
                {sleepDistribution.map((item) => (
                  <div key={item.id} className="dataset-details__bar-row">
                    <span>{item.label}</span>
                    <div className="dataset-details__bar">
                      <span style={{ width: `${Math.max(item.percentage * 100, 3)}%` }} />
                    </div>
                    <span className="dataset-details__bar-value">{formatCount(item.count)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dataset-details__placeholder">{copy.details.sleepUnavailable}</p>
            )}
          </div>

          <div className="dataset-details__block">
            <p className="dataset-details__label">{copy.details.resources}</p>
            <p className="dataset-details__value">
              {resourceStats != null ? formatCount(resourceStats.count) : copy.details.noData}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetOverviewChart
