import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const STRESS_LEVELS = ['Low', 'Medium', 'High']
const SLEEP_LEVELS = ['Poor', 'Average', 'Good']

const SleepStressMatrix = ({ data, theme, copy, common, showHeader = true }) => {
  const cardRef = useRef(null)
  const svgRef = useRef(null)
  const [condition, setCondition] = useState('all')
  const [cardWidth, setCardWidth] = useState(0)

  const conditionOptions = useMemo(() => {
    const values = Array.from(new Set(data.map((item) => item.mentalHealthCondition || 'Other'))).sort()
    return values
  }, [data])

  const legendData = useMemo(() => {
    // Usa 600 para "all conditions", 200 para condições específicas
    const maxValue = condition === 'all' ? 600 : 200
    
    const colorScale = d3.scaleSequential((t) => {
      // Cores: verde -> amarelo -> laranja -> vermelho
      const h = (1 - t) * 120 + t * 0 // De 120° (verde) para 0° (vermelho)
      const s = 75 + t * 15 // Saturação aumenta de 75% para 90%
      const l = 75 - t * 25 // Luminosidade diminui de 75% para 50%
      return `hsl(${h}, ${s}%, ${l}%)`
    }).domain([0, maxValue])
    
    // Create gradient stops from 0 to maxValue
    const stops = Array.from({ length: 5 }, (_, index) => ({
      offset: (index / 4) * 100,
      color: colorScale((index / 4) * maxValue),
      value: Math.round((index / 4) * maxValue),
    }))

    return { maxValue, stops }
  }, [condition])

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return
    }
    const node = cardRef.current
    if (!node) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const nextWidth = entry.contentRect.width
      setCardWidth((current) => {
        if (Math.abs(current - nextWidth) < 1) {
          return current
        }
        return nextWidth
      })
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const svgNode = svgRef.current
    if (!svgNode) {
      return
    }
    const svg = d3.select(svgNode)
    svg.selectAll('*').remove()

    const styles = getComputedStyle(document.body)
    const axisColor = styles.getPropertyValue('--chart-axis-color').trim() || '#94a3b8'
    const gridColor = styles.getPropertyValue('--chart-grid-stroke').trim() || '#334155'
    const legendColor = styles.getPropertyValue('--chart-legend-text').trim() || '#cbd5f5'

    const MIN_WIDTH = 600
    const effectiveWidth = Math.max(cardWidth || svgNode.clientWidth || 0, MIN_WIDTH)
    const width = Number.isFinite(effectiveWidth) ? effectiveWidth : MIN_WIDTH
    const height = 420
    const margin = { top: 20, right: 24, bottom: 72, left: 88 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const filtered = data.filter((item) => condition === 'all' || (item.mentalHealthCondition ?? 'Other') === condition)

    const matrix = STRESS_LEVELS.flatMap((stressLevel) =>
      SLEEP_LEVELS.map((sleepLevel) => {
        const count = filtered.filter(
          (item) => item.stressLevel === stressLevel && item.sleepQuality === sleepLevel
        ).length
        return {
          stressLevel,
          sleepLevel,
          count,
        }
      })
    )

    const maxValue = d3.max(matrix, (entry) => entry.count) ?? 0

    if (maxValue === 0) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .text(copy.empty)
      return
    }

    const xScale = d3.scaleBand().domain(SLEEP_LEVELS).range([margin.left, width - margin.right]).padding(0.15)
    const yDomain = [...STRESS_LEVELS].reverse()
    const yScale = d3.scaleBand().domain(yDomain).range([margin.top, height - margin.bottom]).padding(0.15)

    const colorScale = d3
      .scaleSequential((t) => {
        // Cores: verde -> amarelo -> laranja -> vermelho
        const h = (1 - t) * 120 + t * 0 // De 120° (verde) para 0° (vermelho)
        const s = 75 + t * 15 // Saturação aumenta de 75% para 90%
        const l = 75 - t * 25 // Luminosidade diminui de 75% para 50%
        return `hsl(${h}, ${s}%, ${l}%)`
      })
      .domain([0, condition === 'all' ? 600 : 200])

    const sleepLabels = common?.sleepQuality ?? {}
    const stressLabels = common?.stressLevels ?? {}

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((value) => sleepLabels[value] ?? value))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('font-size', 16))
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat((value) => stressLabels[value] ?? value))
      .call((g) => g.selectAll('text').attr('fill', axisColor).attr('font-size', 16))
      .call((g) => g.selectAll('path').attr('stroke', gridColor))
      .call((g) => g.selectAll('line').attr('stroke', gridColor))

    svg
      .append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 16)
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .text(copy.xAxisLabel ?? 'Sleep quality')

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + innerHeight / 2))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', axisColor)
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .text(copy.yAxisLabel ?? 'Stress level')

    const cells = svg
      .append('g')
      .selectAll('rect')
      .data(matrix)
      .join('rect')
      .attr('x', (entry) => xScale(entry.sleepLevel) ?? 0)
      .attr('y', (entry) => yScale(entry.stressLevel) ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 8)
      .attr('fill', (entry) => colorScale(entry.count))
      .attr('opacity', (entry) => (entry.count === 0 ? 0.1 : 0.95))

    cells
      .append('title')
      .text((entry) =>
        copy.tooltip({
          stressLabel: stressLabels[entry.stressLevel] ?? entry.stressLevel,
          sleepLabel: sleepLabels[entry.sleepLevel] ?? entry.sleepLevel,
          count: entry.count,
        })
      )

    svg
      .append('g')
      .selectAll('text')
      .data(matrix)
      .join('text')
      .attr('x', (entry) => (xScale(entry.sleepLevel) ?? 0) + xScale.bandwidth() / 2)
      .attr('y', (entry) => (yScale(entry.stressLevel) ?? 0) + yScale.bandwidth() / 2 + 6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#0f172a')
      .attr('font-size', 16)
      .attr('font-weight', 600)
      .text((entry) => (entry.count > 0 ? entry.count : ''))
  }, [cardWidth, condition, common, copy, data, theme])

  return (
    <div ref={cardRef} className="chart-card chart-card--tall">
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
              <span className="chart-filter-label">{copy.filters.condition}</span>
              <select className="chart-select" value={condition} onChange={(event) => setCondition(event.target.value)}>
                <option value="all">{copy.filters.allConditions}</option>
                {conditionOptions.map((option) => (
                  <option key={option} value={option}>
                    {common?.conditions?.[option] ?? option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      {legendData.maxValue > 0 && (
        <div className="sleep-stress-matrix__legend">
          <h4 className="sleep-stress-matrix__legend-title">{copy.axisLabel || 'Frequency'}</h4>
          <div className="sleep-stress-matrix__legend-gradient">
            <div 
              className="sleep-stress-matrix__gradient-bar"
              style={{
                background: `linear-gradient(to right, ${legendData.stops.map(s => s.color).join(', ')})`
              }}
            />
            <div className="sleep-stress-matrix__gradient-labels">
              <span>0</span>
              <span>{legendData.maxValue}</span>
            </div>
          </div>
        </div>
      )}
      <svg ref={svgRef} role="img" aria-label={copy.title} />
    </div>
  )
}

export default SleepStressMatrix
