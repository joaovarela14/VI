import { useMemo, useState } from 'react'
import remoteCalmAsset from '../assets/persona-remote-calm.svg'
import remoteBalancedAsset from '../assets/persona-remote-balanced.svg'
import remoteStrainedAsset from '../assets/persona-remote-strained.svg'
import onsiteCalmAsset from '../assets/persona-onsite-calm.svg'
import onsiteBalancedAsset from '../assets/persona-onsite-balanced.svg'
import onsiteStrainedAsset from '../assets/persona-onsite-strained.svg'
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
  const baseHue = 205 - value * 28
  const chroma = 32 + value * 18
  const accentHue = 18 + value * 18
  const washLightness = 86 - value * 16

  return {
    primary: `hsl(${baseHue} ${chroma}% ${58 - value * 10}%)`,
    glow: `hsla(${baseHue} ${chroma + 12}% ${78 - value * 12}%, 0.48)`,
    accent: `hsl(${accentHue} 60% ${74 - value * 18}%)`,
    wash: `hsl(${(baseHue + accentHue) / 2} 42% ${washLightness}%)`,
  }
}

const personaAssets = {
  remote: {
    calm: remoteCalmAsset,
    balanced: remoteBalancedAsset,
    strained: remoteStrainedAsset,
  },
  onsite: {
    calm: onsiteCalmAsset,
    balanced: onsiteBalancedAsset,
    strained: onsiteStrainedAsset,
  },
}

const StressModel = ({ label, percent, stateLabel, variant = 'remote', context }) => {
  const stateKey = toStateKey(percent)
  const palette = getModelPalette(percent)
  const inlineStyle = {
    '--mood-primary': palette.primary,
    '--mood-glow': palette.glow,
    '--mood-accent': palette.accent,
    '--scene-wash': palette.wash,
  }

  const isRemote = variant === 'remote'
  const personaSrc = personaAssets[variant]?.[stateKey] ?? personaAssets[variant]?.balanced
  const personaAlt = isRemote ? 'Remote professional illustration' : 'On-site professional illustration'

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
        <div className="stress-model__asset-wrapper">
          <img src={personaSrc} loading="lazy" alt={personaAlt} className="stress-model__asset" />
        </div>
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
        <h2>{copy?.title}</h2>

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
