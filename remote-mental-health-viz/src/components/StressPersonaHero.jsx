import { useMemo, useState } from 'react'
import './stress-model.css'

const DEFAULTS = {
  hours: 40,
  meetings: 6,
  sleep: 2,
}

const STRESS_NUMERIC = {
  low: 0.25,
  medium: 0.55,
  high: 0.85,
}

const SLEEP_LEVELS = ['Poor', 'Average', 'Good']

const clampPercent = (value) => {
  if (!Number.isFinite(Number(value))) {
    return 0
  }
  return Math.max(0, Math.min(100, Number(value)))
}

const formatPercent = (value) => `${Math.round(clampPercent(value))}%`

const toStateKey = (percent) => {
  const p = clampPercent(percent)
  if (p <= 33) return 'calm'
  if (p <= 66) return 'balanced'
  return 'strained'
}

const toSleepScore = (value) => {
  if (!value) {
    return DEFAULTS.sleep
  }
  const index = SLEEP_LEVELS.findIndex((level) => level.toLowerCase() === String(value).toLowerCase())
  return index >= 0 ? index + 1 : DEFAULTS.sleep
}

const sleepLabelFromScore = (value, copy) => {
  const key = SLEEP_LEVELS[value - 1] ?? SLEEP_LEVELS[DEFAULTS.sleep - 1]
  return copy?.panel?.sleep?.labels?.[key] ?? key
}

const sanitizeDataset = (rows) =>
  rows.filter(
    (row) =>
      Number.isFinite(row.hoursWorked) &&
      Number.isFinite(row.virtualMeetings) &&
      typeof row.sleepQuality === 'string'
  )

const getModelPalette = (percent) => {
  const value = clampPercent(percent) / 100
  const hue = 145 - value * 120
  const saturation = 55 + value * 30
  const lightness = 58 - value * 18
  const glowLightness = 70 - value * 40
  return {
    primary: `hsl(${hue} ${saturation}% ${lightness}%)`,
    glow: `hsla(${hue} ${saturation}% ${glowLightness}%, 0.45)`,
  }
}

const StressModel = ({ label, percent, stateLabel, variant = 'remote', context }) => {
  const stateKey = toStateKey(percent)
  const palette = getModelPalette(percent)
  const inlineStyle = {
    '--model-color': palette.primary,
    '--model-glow': palette.glow,
    '--model-lean': { calm: '0deg', balanced: '3deg', strained: '7deg' }[stateKey],
    '--model-head': { calm: '0deg', balanced: '-4deg', strained: '10deg' }[stateKey],
    '--model-bob': { calm: '0px', balanced: '6px', strained: '10px' }[stateKey],
  }

  const isRemote = variant === 'remote'

  return (
    <div className={`stress-model stress-model--${variant} stress-model--${stateKey}`} style={inlineStyle}>
      {context?.label && (
        <p className="stress-model__tag">
          {context?.icon && (
            <span className="stress-model__tag-icon" aria-hidden="true">
              {context.icon}
            </span>
          )}
          <span>{context.label}</span>
        </p>
      )}

      <div className="stress-model__scene">
        <div className="stress-model__backdrop" aria-hidden="true">
          {isRemote ? (
            <>
              <div className="scene-window" />
              <div className="scene-plant" />
              <div className="scene-shelf">
                <div className="scene-book" />
                <div className="scene-book" />
                <div className="scene-mug" />
              </div>
              <div className="scene-floor" />
              <div className="scene-rug" />
              <div className="scene-desk scene-desk--remote">
                <div className="scene-desk-top" />
                <div className="scene-laptop">
                  <div className="scene-laptop-screen" />
                </div>
                <div className="scene-tablet" />
              </div>
              <div className="scene-chair scene-chair--remote" />
              <div className="scene-cat" />
            </>
          ) : (
            <>
              <div className="scene-desk-lamp" />
              <div className="scene-skyline">
                <span />
                <span />
                <span />
              </div>
              <div className="scene-desk scene-desk--onsite">
                <div className="scene-monitor">
                  <div className="scene-monitor-screen" />
                  <div className="scene-monitor-stand" />
                </div>
                <div className="scene-phone" />
                <div className="scene-cup" />
              </div>
              <div className="scene-chair scene-chair--onsite" />
              <div className="scene-calendar" />
            </>
          )}
        </div>

        <div className="stress-model__figure" aria-hidden="true">
          <div className="stress-model__torso">
            <div className="stress-model__head">
              <span className="stress-model__eye stress-model__eye--left" />
              <span className="stress-model__eye stress-model__eye--right" />
              <span className="stress-model__mouth" />
              {stateKey === 'strained' && <div className="stress-sweat" />}
            </div>
            <div className="stress-model__arm stress-model__arm--left" />
            <div className="stress-model__arm stress-model__arm--right" />
          </div>
          <div className="stress-model__legs">
            <span className="stress-model__leg stress-model__leg--left" />
            <span className="stress-model__leg stress-model__leg--right" />
          </div>
        </div>

        <div className="stress-model__shadow" aria-hidden="true" />
      </div>

      <div className="stress-model__bar">
        <div className="stress-bar-label">{label}</div>
        <div className="stress-bar-container">
          <div className={`stress-bar-fill stress-bar-fill--${stateKey}`} style={{ width: `${clampPercent(percent)}%` }} />
          <span className="stress-bar-percentage">{formatPercent(percent)}</span>
        </div>
        <div className="stress-bar-state">{stateLabel}</div>
      </div>
    </div>
  )
}

function StressPersonaHero({ data = [], copy = {}, theme = 'light' }) {
  const genderOptions = copy?.genderOptions ?? []
  const [hours, setHours] = useState(DEFAULTS.hours)
  const [meetings, setMeetings] = useState(DEFAULTS.meetings)
  const [sleepFocus, setSleepFocus] = useState(DEFAULTS.sleep)
  const [genderFilters, setGenderFilters] = useState(() => genderOptions.map((option) => option.id))

  const sanitizedRows = useMemo(() => sanitizeDataset(data), [data])

  const filteredRows = useMemo(() => {
    if (!sanitizedRows.length) {
      return []
    }

    const matchSet = new Set()
    genderFilters.forEach((genderId) => {
      const option = genderOptions.find((item) => item.id === genderId)
      if (option) {
        option.matches.forEach((match) => matchSet.add(match.toLowerCase()))
      }
    })
    const shouldFilterGender = matchSet.size > 0

    return sanitizedRows.filter((row) => {
      if (Math.abs(row.hoursWorked - hours) > 5) {
        return false
      }

      if (Math.abs((row.virtualMeetings ?? meetings) - meetings) > 2.5) {
        return false
      }

      const rowSleepScore = toSleepScore(row.sleepQuality)
      if (Math.abs(rowSleepScore - sleepFocus) > 0.6) {
        return false
      }

      if (shouldFilterGender) {
        const genderValue = String(row.gender ?? '').trim().toLowerCase()
        if (!matchSet.has(genderValue)) {
          return false
        }
      }

      return true
    })
  }, [sanitizedRows, genderFilters, genderOptions, hours, meetings, sleepFocus])

  const baseRows = filteredRows.length ? filteredRows : sanitizedRows

  const locationScores = useMemo(() => {
    if (!baseRows.length) {
      return {
        remote: 0,
        onsite: 0,
      }
    }

    const remotePredicate = (row) => String(row.workLocation ?? '').toLowerCase() !== 'onsite'
    const onsitePredicate = (row) => String(row.workLocation ?? '').toLowerCase() === 'onsite'

    let remoteRows = baseRows.filter(remotePredicate)
    if (!remoteRows.length) {
      remoteRows = sanitizedRows.filter(remotePredicate)
    }

    let onsiteRows = baseRows.filter(onsitePredicate)
    if (!onsiteRows.length) {
      onsiteRows = sanitizedRows.filter(onsitePredicate)
    }

    const calcAverage = (rows) => {
      if (!rows.length) {
        return 0
      }
      const total = rows.reduce((sum, row) => sum + (STRESS_NUMERIC[row.stressLevel?.toLowerCase()] ?? STRESS_NUMERIC.medium), 0)
      return Math.round((total / rows.length) * 100)
    }

    return {
      remote: calcAverage(remoteRows),
      onsite: calcAverage(onsiteRows),
    }
  }, [baseRows, sanitizedRows])

  const updateGenderFilters = (genderId) => {
    setGenderFilters((current) => {
      if (current.includes(genderId)) {
        return current.filter((id) => id !== genderId)
      }
      return [...current, genderId]
    })
  }

  const handleReset = () => {
    setHours(DEFAULTS.hours)
    setMeetings(DEFAULTS.meetings)
    setSleepFocus(DEFAULTS.sleep)
    setGenderFilters(genderOptions.map((option) => option.id))
  }

  const remotePercent = clampPercent(locationScores.remote)
  const onsitePercent = clampPercent(locationScores.onsite)
  const remoteStateKey = toStateKey(remotePercent)
  const onsiteStateKey = toStateKey(onsitePercent)
  const remoteContext = copy?.context?.remote
  const onsiteContext = copy?.context?.onsite
  const remoteStateLabel = copy?.states?.[remoteStateKey] ?? remoteStateKey
  const onsiteStateLabel = copy?.states?.[onsiteStateKey] ?? onsiteStateKey
  const differenceValue = formatPercent(Math.abs(remotePercent - onsitePercent))
  const sleepLabel = sleepLabelFromScore(sleepFocus, copy)

  return (
    <section className={`stress-lab stress-lab--${theme}`}>
      <div className="stress-lab__intro">
        <p className="stress-lab__eyebrow">{copy?.eyebrow}</p>
        <h2>{copy?.title}</h2>
        <p className="stress-lab__lead">{copy?.description}</p>
      </div>

      <div className="stress-lab__models" role="group" aria-label={copy?.modelsLabel}>
        <StressModel
          label={copy?.remoteLabel}
          percent={remotePercent}
          stateLabel={remoteStateLabel}
          variant="remote"
          context={remoteContext}
        />

        <div className="stress-lab__comparison">
          <div className="comparison-header">
            <p className="comparison-title">{copy?.panel?.title}</p>
            <p className="comparison-subtitle">{copy?.panel?.subtitle}</p>
          </div>

          <div className="comparison-vs" aria-hidden="true">
            VS
          </div>

          <div className="comparison-controls">
            <div className="control-group">
              <label htmlFor="hours-slider" className="control-label">
                {copy?.panel?.hours?.label} <strong>{hours} {copy?.panel?.hours?.unit}</strong>
              </label>
              <input
                id="hours-slider"
                type="range"
                min="25"
                max="60"
                step="1"
                value={hours}
                onChange={(event) => setHours(Number.parseInt(event.target.value, 10))}
                className="control-slider control-slider--remote"
              />
            </div>

            <div className="control-group">
              <label htmlFor="meetings-slider" className="control-label">
                {copy?.panel?.meetings?.label} <strong>{meetings} {copy?.panel?.meetings?.unit}</strong>
              </label>
              <input
                id="meetings-slider"
                type="range"
                min="0"
                max="14"
                step="1"
                value={meetings}
                onChange={(event) => setMeetings(Number.parseInt(event.target.value, 10))}
                className="control-slider control-slider--onsite"
              />
            </div>

            <div className="control-group">
              <label htmlFor="sleep-slider" className="control-label">
                {copy?.panel?.sleep?.label} <strong>{sleepLabel}</strong>
              </label>
              <input
                id="sleep-slider"
                type="range"
                min="1"
                max="3"
                step="1"
                value={sleepFocus}
                onChange={(event) => setSleepFocus(Number.parseInt(event.target.value, 10))}
                className="control-slider control-slider--sleep"
              />
            </div>
          </div>

          <fieldset className="comparison-genders">
            <legend>{copy?.panel?.gender?.label}</legend>
            <p className="comparison-genders__hint">{copy?.panel?.gender?.hint}</p>
            <div className="comparison-genders__grid">
              {genderOptions.map((option) => (
                <label key={option.id} className="comparison-checkbox">
                  <input
                    type="checkbox"
                    checked={genderFilters.includes(option.id)}
                    onChange={() => updateGenderFilters(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="comparison-diff">
            <span className="diff-label">{copy?.panel?.differenceLabel}</span>
            <span className="diff-value">{differenceValue}</span>
          </div>

          <button type="button" className="comparison-reset" onClick={handleReset}>
            {copy?.panel?.reset}
          </button>
        </div>

        <StressModel
          label={copy?.onsiteLabel}
          percent={onsitePercent}
          stateLabel={onsiteStateLabel}
          variant="onsite"
          context={onsiteContext}
        />
      </div>
    </section>
  )
}

export default StressPersonaHero
