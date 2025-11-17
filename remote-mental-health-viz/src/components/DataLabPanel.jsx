import { useMemo } from 'react'

const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return '—'
  }
  return numberFormatter.format(value)
}

const VariableList = ({
  items = [],
  showDescriptions = true,
  showValues = true,
  valuesMap = {},
  columns = 1,
  tooltipMap = {},
}) => {
  const classes = ['variable-list']
  if (columns > 1) {
    classes.push('variable-list--columns')
  }

  return (
    <ul className={classes.join(' ')}>
      {items.map((item) => {
        const values = valuesMap[item.id] ?? []

        const tooltip = tooltipMap[item.id]
        const showTooltipValues = !showValues && values.length > 0
        const hasTooltip = Boolean(tooltip) || showTooltipValues

        return (
          <li key={item.id} className={`variable-list__item${hasTooltip ? ' variable-list__item--tooltip' : ''}`}>
            <span className="variable-list__name" title={tooltip}>
              {item.name}
            </span>

            {showDescriptions && (item.type || item.description) && (
              <span className="variable-list__description">
                {item.type && <span className="variable-list__type">{item.type}</span>}
                {item.description}
              </span>
            )}

            {showValues && values.length > 0 && (
              <div className="variable-list__values">
                {values.map((value) => (
                  <span key={value} className="variable-list__value">
                    {value}
                  </span>
                ))}
              </div>
            )}

            {hasTooltip && (
              <div className="variable-list__tooltip" aria-hidden="true">
                {showTooltipValues ? (
                  <div className="variable-list__tooltip-values">
                    {values.map((value) => (
                      <span key={value} className="variable-list__value">
                        {value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="variable-list__tooltip-text">{tooltip}</span>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const buildQualitativeValues = (data, common, qualitativeItems = []) => {
  if (!qualitativeItems.length) {
    return {}
  }

  const map = new Map()
  const addValue = (key, value) => {
    if (!value || typeof value !== 'string') {
      return
    }
    const trimmed = value.trim()
    if (!trimmed) return
    if (!map.has(key)) {
      map.set(key, new Set())
    }
    map.get(key).add(trimmed)
  }

  data.forEach((row) => {
    addValue('stress', common?.stressLevels?.[row.stressLevel] ?? row.stressLevel)
    addValue('gender', row.gender)
    addValue('role', row.jobRole)
    addValue('industry', common?.industries?.[row.industry] ?? row.industry)
    addValue('location', common?.workLocations?.[row.workLocation] ?? row.workLocation)
    addValue('condition', common?.conditions?.[row.mentalHealthCondition] ?? row.mentalHealthCondition)

    if (typeof row.hasMentalHealthResources === 'boolean') {
      addValue(
        'access',
        row.hasMentalHealthResources ? common?.mentalHealthAccess?.yes ?? 'Yes' : common?.mentalHealthAccess?.no ?? 'No'
      )
    }

    addValue('productivity', row.productivityChange)
    addValue('satisfaction', row.satisfaction)
    addValue('activity', row.physicalActivity)
    addValue('sleep', common?.sleepQuality?.[row.sleepQuality] ?? row.sleepQuality)
    addValue('region', row.region)
  })

  const result = {}
  for (const [key, values] of map.entries()) {
    result[key] = Array.from(values).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }
  return result
}

const buildQuantitativeTooltips = (data, quantitativeItems = []) => {
  if (!quantitativeItems.length) {
    return {}
  }

  const fieldMap = {
    age: (row) => row.age,
    experience: (row) => row.yearsExperience,
    hours: (row) => row.hoursWorked,
    meetings: (row) => row.virtualMeetings,
    balance: (row) => row.workLifeBalance,
    isolation: (row) => row.socialIsolationRating,
    companySupport: (row) => row.companySupport,
  }

  const tooltips = {}

  quantitativeItems.forEach((item) => {
    const accessor = fieldMap[item.id]
    if (!accessor) {
      return
    }

    let min = Infinity
    let max = -Infinity

    data.forEach((row) => {
      const value = accessor(row)
      if (Number.isFinite(value)) {
        if (value < min) min = value
        if (value > max) max = value
      }
    })

    if (min !== Infinity && max !== -Infinity) {
      tooltips[item.id] = `${formatNumber(min)} – ${formatNumber(max)}`
    }
  })

  return tooltips
}

const DataLabPanel = ({ copy, data, common }) => {
  const qualitativeValues = useMemo(
    () => buildQualitativeValues(data, common, copy?.qualitative ?? []),
    [common, copy?.qualitative, data]
  )
  const qualitativeTooltips = useMemo(() => {
    const map = {}
    Object.entries(qualitativeValues).forEach(([key, values]) => {
      if (values.length) {
        map[key] = values.join(', ')
      }
    })
    return map
  }, [qualitativeValues])

  const quantitativeTooltips = useMemo(
    () => buildQuantitativeTooltips(data, copy?.quantitative ?? []),
    [copy?.quantitative, data]
  )

  if (!copy) return null

  return (
    <section className="section section--wide">
      <h2>{copy.heading}</h2>

      <p className="section__intro">{copy.intro}</p>

      <div className="variable-grid">
        <div className="variable-card">
          <p className="variable-card__eyebrow">{copy.quantitativeHeading}</p>
          <VariableList items={copy.quantitative} showValues={false} columns={2} tooltipMap={quantitativeTooltips} />
        </div>

        <div className="variable-card">
          <p className="variable-card__eyebrow">{copy.qualitativeHeading}</p>
          <VariableList
            items={copy.qualitative}
            showValues={false}
            columns={2}
            tooltipMap={qualitativeTooltips}
            valuesMap={qualitativeValues}
          />
        </div>
      </div>
    </section>
  )
}

export default DataLabPanel
