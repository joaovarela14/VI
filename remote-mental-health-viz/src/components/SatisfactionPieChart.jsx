import { useEffect, useMemo, useRef } from 'react'
import * as d3 from 'd3'

const SATISFACTION_ORDER = ['unsatisfied', 'neutral', 'satisfied']
const DEFAULT_COLORS = {
  unsatisfied: '#f87171',
  neutral: '#fbbf24',
  satisfied: '#34d399',
}

const SatisfactionPieChart = ({ data, theme, copy, common }) => {
  const svgRef = useRef(null)
  const filterSelectRef = useRef(null)

  const sectorOptions = useMemo(() => {
    const values = Array.from(new Set(data.map((item) => item.industry).filter(Boolean))).sort()
    return values
  }, [data])

  const regionOptions = useMemo(() => {
    const values = Array.from(new Set(data.map((item) => item.region).filter(Boolean))).sort()
    return values
  }, [data])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const state = {
      sector: 'all',
      region: 'all',
    }

    const styles = getComputedStyle(document.body)
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const cardSurface = styles.getPropertyValue('--chart-surface').trim() || '#0f172a'

    const width = 420
    const height = 340
    const radius = Math.min(width, height) / 2 - 28
    const colorScale = (key) => DEFAULT_COLORS[key] ?? '#60a5fa'

    const svgRoot = svg.attr('viewBox', `0 0 ${width} ${height}`)
    const chartGroup = svgRoot.append('g').attr('transform', `translate(${width / 2}, ${(height / 2) + 10})`)
    const labelArc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius * 0.9)

    const legendGroup = svgRoot
      .append('g')
      .attr('transform', 'translate(24, 20)')
      .attr('class', 'legend')

    legendGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', legendColor)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .text(copy.legendTitle)

    const legendItems = legendGroup.append('g').attr('transform', 'translate(0, 22)')

    legendItems
      .selectAll('g')
      .data(SATISFACTION_ORDER)
      .join('g')
      .attr('transform', (_, index) => `translate(${index * 120}, 0)`)
      .each(function (key) {
        const item = d3.select(this)
        item
          .append('rect')
          .attr('width', 14)
          .attr('height', 14)
          .attr('rx', 3)
          .attr('fill', colorScale(key))

        item
          .append('text')
          .attr('x', 22)
          .attr('y', 11)
          .attr('fill', legendColor)
          .attr('font-size', 12)
          .text(copy.legend[key] ?? key)
      })

    const render = () => {
      const filtered = data.filter((item) => {
        const matchesSector = state.sector === 'all' || item.industry === state.sector
        const matchesRegion = state.region === 'all' || item.region === state.region
        return matchesSector && matchesRegion
      })

      const counts = d3.rollups(
        filtered,
        (values) => values.length,
        (item) => {
          const satisfaction = (item.satisfaction ?? '').toLowerCase()
          return common.satisfactionMap[satisfaction] ? common.satisfactionMap[satisfaction] : 'other'
        }
      )

      const total = d3.sum(counts, ([, value]) => value)
      const scaleData = SATISFACTION_ORDER.map((key) => {
        const entry = counts.find(([label]) => label === key)
        return {
          key,
          count: entry ? entry[1] : 0,
          percentage: total > 0 ? (entry ? (entry[1] / total) * 100 : 0) : 0,
        }
      })

      chartGroup.selectAll('*').remove()

      if (total === 0) {
        chartGroup
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', axisColor)
          .text(copy.empty)
        return
      }

      const pieGenerator = d3
        .pie()
        .value((datum) => datum.count)
        .sort((a, b) => SATISFACTION_ORDER.indexOf(a.key) - SATISFACTION_ORDER.indexOf(b.key))

      const arcGenerator = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)

      const arcs = chartGroup.selectAll('path').data(pieGenerator(scaleData)).join('path')

      arcs
        .attr('d', arcGenerator)
        .attr('fill', (datum) => colorScale(datum.data.key))
        .attr('stroke', styles.getPropertyValue('--chart-border') || 'rgba(148, 163, 184, 0.3)')
        .attr('stroke-width', 1.5)
        .append('title')
        .text((datum) =>
          copy.tooltip({
            label: copy.legend[datum.data.key] ?? datum.data.key,
            count: datum.data.count,
            percentage: datum.data.percentage,
          })
        )

      const labelGroup = chartGroup
        .append('g')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')

      labelGroup
        .selectAll('text')
        .data(pieGenerator(scaleData))
        .join('text')
        .attr('transform', (datum) => {
          const [x, y] = labelArc.centroid(datum)
          return `translate(${x}, ${y})`
        })
        .attr('fill', axisColor)
        .attr('font-size', 13)
        .attr('font-weight', 600)
        .attr('stroke', cardSurface)
        .attr('stroke-width', 4)
        .attr('paint-order', 'stroke fill')
        .style('filter', 'drop-shadow(0 1px 3px rgba(15, 23, 42, 0.35))')
        .text((datum) => {
          const value = Math.round(datum.data.percentage)
          return value > 0 ? `${value}%` : ''
        })
    }

    render()

    const selectContainers = filterSelectRef.current?.querySelectorAll('select') ?? []
    selectContainers.forEach((selectNode) => {
      selectNode.addEventListener('change', (event) => {
        const target = event.target
        if (target.name === 'sector') {
          state.sector = target.value
        }
        if (target.name === 'region') {
          state.region = target.value
        }
        render()
      })
    })

    return () => {
      selectContainers.forEach((selectNode) => {
        selectNode.replaceWith(selectNode.cloneNode(true))
      })
    }
  }, [common, copy, data, theme])

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-header__top">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.description}</p>
          </div>
          <div ref={filterSelectRef} className="chart-header__filters">
            <label className="chart-controls">
              <span className="visually-hidden">{copy.filters.sector}</span>
              <select className="chart-select" name="sector" defaultValue="all">
                <option value="all">{copy.filters.allSectors}</option>
                {sectorOptions.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </label>
            <label className="chart-controls">
              <span className="visually-hidden">{copy.filters.region}</span>
              <select className="chart-select" name="region" defaultValue="all">
                <option value="all">{copy.filters.allRegions}</option>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      <svg ref={svgRef} role="img" aria-label={copy.ariaLabel} />
    </div>
  )
}

export default SatisfactionPieChart
