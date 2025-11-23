import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const stressLevels = ['Low', 'Medium', 'High']
const productivityOrder = ['Increase', 'No Change', 'Decrease']
const satisfactionOrder = ['Satisfied', 'Neutral', 'Unsatisfied']
const activityOrder = ['Daily', 'Weekly', 'None']
const ALL = '__all__'

const getOrderIndex = (order, value) => {
  const index = order.indexOf(value)
  return index === -1 ? order.length : index
}

const DatasetOverviewChart = ({ data, theme, copy, common }) => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  const [industryFilter, setIndustryFilter] = useState(ALL)
  const [roleFilter, setRoleFilter] = useState(ALL)
  const [locationFilter, setLocationFilter] = useState(ALL)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [metricMode, setMetricMode] = useState('stress')

  const stressLabels = copy?.legend ?? common?.stressLevels ?? {}
  const satisfactionLegend = copy?.satisfactionPie?.legend ?? {}
  const satisfactionMap = common?.satisfactionMap ?? {}
  const activityLabels = copy?.details?.activityLabels ?? {}
  const productivityLabels = copy?.details?.productivityLabels ?? {}
  const conditionLabels = common?.conditions ?? {}

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

  const conditionOrder = useMemo(
    () => Array.from(new Set(data.map((d) => d.mentalHealthCondition))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
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

  useEffect(() => {
    if (metricMode === 'condition' && conditionOrder.length === 0) {
      setMetricMode('stress')
    }
  }, [conditionOrder, metricMode])

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

  const activeCategories = metricMode === 'stress' ? stressLevels : conditionOrder
  const metricKey = metricMode === 'stress' ? 'stressLevel' : 'mentalHealthCondition'
  const metricLabels = metricMode === 'stress' ? stressLabels : conditionLabels

  const aggregated = useMemo(() => {
    return regionOrder.map((region) => {
      const rows = regionGroups.get(region) ?? []

      const counts = activeCategories.reduce(
        (acc, category) => {
          acc[category] = 0
          return acc
        },
        {}
      )

      rows.forEach((row) => {
        const value = row[metricKey]
        if (value != null && counts[value] != null) {
          counts[value] += 1
        }
      })

      return {
        region,
        total: rows.length,
        ...counts,
      }
    })
  }, [activeCategories, metricKey, regionGroups, regionOrder])

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
    const margin = { top: 48, right: 160, bottom: 72, left: 56 }

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

    const stack = d3.stack().keys(activeCategories)
    const series = stack(aggregated)

    const colorRange =
      metricMode === 'stress'
        ? ['#34d399', '#fbbf24', '#f87171']
        : activeCategories.map((_, index) => {
            const palette = d3.schemeTableau10 ?? []
            if (!palette.length) {
              return `hsl(${(index * 47) % 360} 70% 55%)`
            }
            return palette[index % palette.length]
          })
    const colorScale = d3.scaleOrdinal().domain(activeCategories).range(colorRange)
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

    const yAxisGroup = chartGroup
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

    yAxisGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 12)
      .attr('fill', axisColor)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('text-anchor', 'middle')
      .text(copy?.yAxisLabel ?? 'Number of employees')

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
        categoryLabel: metricLabels[level] ?? level,
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
      .attr('class', 'legend legend--vertical')
      .attr('transform', `translate(${width - margin.right}, ${margin.top})`)

    legend
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', legendColor)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .text(metricMode === 'stress' ? copy.modeOptions?.stress : copy.modeOptions?.condition)

    legend
      .selectAll('g')
      .data(activeCategories)
      .join('g')
      .attr('transform', (_, index) => `translate(0, ${(index + 1) * 20})`)
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
          .text((d) => metricLabels[d] ?? d)
      })
  }, [activeCategories, aggregated, copy, handleRegionClick, metricLabels, metricMode, selectedRegion, theme])

  const selectedRows = useMemo(() => {
    if (selectedRegion && regionGroups.has(selectedRegion)) {
      return regionGroups.get(selectedRegion)
    }
    return filteredData
  }, [filteredData, regionGroups, selectedRegion])

  const totalSelected = selectedRows.length

  const productivityDistribution = useMemo(() => {
    if (!totalSelected) {
      return []
    }
    const rows = selectedRows.filter((row) => row.productivityChange)
    const counts = d3.rollups(
      rows,
      (values) => values.length,
      (row) => row.productivityChange
    )
    return counts
      .sort((a, b) => {
        const aIndex = getOrderIndex(productivityOrder, a[0])
        const bIndex = getOrderIndex(productivityOrder, b[0])
        if (aIndex !== bIndex) {
          return aIndex - bIndex
        }
        return d3.descending(a[1], b[1])
      })
      .map(([value, count]) => ({
        id: value ?? 'unknown',
        label: productivityLabels[value] ?? value ?? copy.details.unknown,
        count,
        percentage: totalSelected > 0 ? count / totalSelected : 0,
      }))
  }, [copy.details?.unknown, productivityLabels, selectedRows, totalSelected])

  const satisfactionDistribution = useMemo(() => {
    if (!totalSelected) {
      return []
    }
    const rows = selectedRows.filter((row) => row.satisfaction)
    const counts = d3.rollups(
      rows,
      (values) => values.length,
      (row) => {
        const normalized = (row.satisfaction ?? '').toLowerCase()
        return satisfactionMap[normalized] ?? row.satisfaction ?? copy.details.unknown
      }
    )
    return counts
      .sort((a, b) => {
        const aValue = (a[0] ?? '').toLowerCase()
        const bValue = (b[0] ?? '').toLowerCase()
        const aIndex = getOrderIndex(satisfactionOrder, aValue)
        const bIndex = getOrderIndex(satisfactionOrder, bValue)
        if (aIndex !== bIndex) {
          return aIndex - bIndex
        }
        return d3.descending(a[1], b[1])
      })
      .map(([value, count]) => ({
        id: value ?? 'unknown',
        label: satisfactionLegend[value] ?? value ?? copy.details.unknown,
        count,
        percentage: totalSelected > 0 ? count / totalSelected : 0,
      }))
  }, [copy.details?.unknown, satisfactionLegend, satisfactionMap, selectedRows, totalSelected])

  const physicalActivityDistribution = useMemo(() => {
    if (!totalSelected) {
      return []
    }
    const rows = selectedRows.filter((row) => row.physicalActivity)
    const counts = d3.rollups(
      rows,
      (values) => values.length,
      (row) => row.physicalActivity
    )
    return counts
      .sort((a, b) => {
        const aIndex = getOrderIndex(activityOrder, a[0])
        const bIndex = getOrderIndex(activityOrder, b[0])
        if (aIndex !== bIndex) {
          return aIndex - bIndex
        }
        return d3.descending(a[1], b[1])
      })
      .map(([value, count]) => ({
        id: value ?? 'unknown',
        label: activityLabels[value] ?? value ?? copy.details.unknown,
        count,
        percentage: totalSelected > 0 ? count / totalSelected : 0,
      }))
  }, [activityLabels, copy.details?.unknown, selectedRows, totalSelected])

  const detailsTitle = selectedRegion ? copy.details.regionTitle(selectedRegion) : copy.details.overviewTitle
  const detailsSubtitle = selectedRegion ? copy.details.regionSubtitle : copy.details.overviewSubtitle

  const formatCount = copy.formatters?.count ?? ((value) => value ?? 0)

  const hasFilteredData = filteredData.length > 0 && activeCategories.length > 0
  const chartTitle = metricMode === 'condition' ? copy.conditionTitle ?? copy.title : copy.title
  const conditionToggleDisabled = conditionOrder.length === 0

  return (
    <div className="chart-card chart-card--wide chart-card--tall dataset-overview-card" ref={containerRef}>
      <div className="chart-header">
        <div className="chart-header__top">
          <div>
            <h3>{chartTitle}</h3>
            <p>{copy.description}</p>
          </div>
          <div className="dataset-overview__controls">
            <div className="dataset-overview__modes" role="group" aria-label={copy.modeLabel}>
              <button
                type="button"
                className={`dataset-overview__mode-button ${metricMode === 'stress' ? 'is-active' : ''}`}
                onClick={() => setMetricMode('stress')}
                aria-pressed={metricMode === 'stress'}
              >
                {copy.modeOptions?.stress}
              </button>
              <button
                type="button"
                className={`dataset-overview__mode-button ${metricMode === 'condition' ? 'is-active' : ''}`}
                onClick={() => setMetricMode('condition')}
                aria-pressed={metricMode === 'condition'}
                disabled={conditionToggleDisabled}
              >
                {copy.modeOptions?.condition}
              </button>
            </div>
          </div>
          {copy.instructions && <p className="dataset-overview__hint dataset-overview__hint--inline">{copy.instructions}</p>}
          <div className="dataset-overview__controls dataset-overview__controls--filters">
            <span className="dataset-overview__filters-label">{copy.filtersLabel}</span>
            <div className="chart-header__filters dataset-overview__filters" role="group" aria-label={copy.filters.ariaLabel}>
              <label className="chart-filter-group" htmlFor="dataset-overview-industry">
                <span className="chart-filter-label">{copy.filters.industry}</span>
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
              </label>

              <label className="chart-filter-group" htmlFor="dataset-overview-role">
                <span className="chart-filter-label">{copy.filters.role}</span>
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
              </label>

              <label className="chart-filter-group" htmlFor="dataset-overview-location">
                <span className="chart-filter-label">{copy.filters.location}</span>
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
              </label>
            </div>
          </div>
        </div>
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
            <div>
              <h4>{detailsTitle}</h4>
              <p>{detailsSubtitle}</p>
            </div>
            <div className="dataset-details__stat dataset-details__stat--inline">
              <p className="dataset-details__label">{copy.details.employees}</p>
              <p className="dataset-details__value">{formatCount(totalSelected)}</p>
            </div>
          </div>

          <div className="dataset-details__block">
            <p className="dataset-details__label">{copy.details.productivity}</p>
            {productivityDistribution.length ? (
              <div className="dataset-details__bars">
                {productivityDistribution.map((item) => (
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
              <p className="dataset-details__placeholder">{copy.details.productivityUnavailable}</p>
            )}
          </div>

          <div className="dataset-details__block">
            <p className="dataset-details__label">{copy.details.satisfaction}</p>
            {satisfactionDistribution.length ? (
              <div className="dataset-details__bars">
                {satisfactionDistribution.map((item) => (
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
              <p className="dataset-details__placeholder">{copy.details.satisfactionUnavailable}</p>
            )}
          </div>

          <div className="dataset-details__block">
            <p className="dataset-details__label">{copy.details.physicalActivity}</p>
            {physicalActivityDistribution.length ? (
              <div className="dataset-details__bars">
                {physicalActivityDistribution.map((item) => (
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
              <p className="dataset-details__placeholder">{copy.details.activityUnavailable}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetOverviewChart
