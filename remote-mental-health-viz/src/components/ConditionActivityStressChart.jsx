import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const STRESS_ORDER = ['Low', 'Medium', 'High']

const ConditionActivityStressChart = ({ data, theme, copy, common }) => {
  const svgRef = useRef(null)
  const [activity, setActivity] = useState('all')

  const activityOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.physicalActivity).filter(Boolean))).sort()
  }, [data])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const width = 640
    const height = 360
    const margin = { top: 48, right: 64, bottom: 72, left: 72 }

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const filtered = data.filter((item) => activity === 'all' || item.physicalActivity === activity)

    const conditionLabels = common?.conditions ?? {}
    const stressLabels = common?.stressLevels ?? {}
    const dataConditions = Array.from(new Set(filtered.map((item) => item.mentalHealthCondition || 'Other')))
    const conditionOrder = Array.from(new Set([...(Object.keys(conditionLabels)), ...dataConditions]))
    const aggregated = conditionOrder
      .map((conditionKey) => {
        const rows = filtered.filter((item) => (item.mentalHealthCondition ?? 'Other') === conditionKey)
        const total = rows.length
        const breakdown = STRESS_ORDER.map((level) => {
          const count = rows.filter((item) => item.stressLevel === level).length
          return {
            level,
            count,
            percent: total > 0 ? (count / total) * 100 : 0,
          }
        })

        return {
          condition: conditionKey,
          total,
          breakdown,
        }
      })
      .filter((entry) => entry.total > 0)

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
      .domain(aggregated.map((entry) => entry.condition))
      .range([margin.left, width - margin.right])
      .padding(0.35)

    const yMax = d3.max(aggregated, (entry) => entry.total) ?? 0

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height - margin.bottom, margin.top])

    const colorScale = d3
      .scaleOrdinal()
      .domain(STRESS_ORDER)
      .range(['#34d399', '#fbbf24', '#f87171'])

    const stack = d3.stack().keys(STRESS_ORDER).value((d, key) => {
      const found = d.breakdown.find((item) => item.level === key)
      return found ? found.count : 0
    })

    const series = stack(aggregated)

    const chartGroup = svg.append('g')

    chartGroup
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((value) => conditionLabels[value] ?? value))
      .call((g) =>
        g
          .selectAll('text')
          .attr('fill', axisColor)
          .attr('font-size', 12)
          .attr('text-anchor', 'end')
          .attr('dx', '-0.6em')
          .attr('dy', '0.15em')
          .attr('transform', 'rotate(-28)')
      )
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    chartGroup
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(4))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('font-size', 12))
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    chartGroup
      .append('text')
      .attr('x', -(height / 2))
      .attr('y', margin.left - 56)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 13)
      .attr('font-weight', 500)
      .text(copy.axis?.y ?? '')

    const groups = chartGroup.selectAll('.layer').data(series).join('g').attr('fill', ({ key }) => colorScale(key))

    groups
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d) => xScale(d.data.condition) ?? 0)
      .attr('y', (d) => yScale(d[1]))
      .attr('height', (d) => Math.max(yScale(d[0]) - yScale(d[1]), 0))
      .attr('width', xScale.bandwidth())
      .each(function (segment) {
        const parentDatum = d3.select(this.parentNode).datum()
        const level = parentDatum.key
        const breakdown = segment.data.breakdown.find((item) => item.level === level)
        d3.select(this)
          .append('title')
          .text(
            copy.tooltip({
              condition: conditionLabels[segment.data.condition] ?? segment.data.condition,
              stressLabel: stressLabels[level] ?? level,
              count: breakdown?.count ?? 0,
              percent: breakdown?.percent ?? 0,
            })
          )
      })

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${margin.top - 24})`)

    STRESS_ORDER.forEach((level, index) => {
      const group = legend.append('g').attr('transform', `translate(${index * 120}, 0)`)
      group
        .append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 3)
        .attr('fill', colorScale(level))

      group
        .append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('fill', legendColor)
        .attr('font-size', 12)
        .text(stressLabels[level] ?? level)
    })
  }, [activity, common, copy, data, theme])

  return (
    <div className="chart-card chart-card--wide chart-card--medium">
      <div className="chart-header">
        <div className="chart-header__top">
          <div>
            <h3>{copy.title}</h3>
            <p>{copy.description}</p>
          </div>
          <div className="chart-header__filters">
            <label className="chart-controls">
              <span className="visually-hidden">{copy.filters.activity}</span>
              <select className="chart-select" value={activity} onChange={(event) => setActivity(event.target.value)}>
                <option value="all">{copy.filters.allActivities}</option>
                {activityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      <svg ref={svgRef} role="img" aria-label={copy.title} />
    </div>
  )
}

export default ConditionActivityStressChart
