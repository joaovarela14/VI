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
  companySupport: 3,
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
      Number.isFinite(row.companySupport) &&
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


      <div className="stress-model__layout">
       <div className="stress-model__scene">
         <div className="stress-model__asset-wrapper">
           <img src={personaSrc} loading="lazy" alt={personaAlt} className="stress-model__asset" />
            <div className={`stress-model__bar ${variant === 'onsite' ? 'stress-model__bar--left' : 'stress-model__bar--right'}`}>
             <div className="stress-bar-container">
               <div className={`stress-bar-fill stress-bar-fill--${stateKey}`} style={{ height: `${clampPercent(percent)}%` }} />
             </div>
             <span className="stress-bar-percentage">{formatPercent(percent)}</span>
           </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StressPersonaHero({ data = [], copy = {}, theme = 'light' }) {
  const genderOptions = copy?.genderOptions ?? []
  const [hours, setHours] = useState(DEFAULTS.hours)
  const [companySupport, setCompanySupport] = useState(DEFAULTS.companySupport)
  const [sleepFocus, setSleepFocus] = useState(DEFAULTS.sleep)
  const [genderFilters, setGenderFilters] = useState(() => genderOptions.map((option) => option.id))

  const sanitizedRows = useMemo(() => sanitizeDataset(data), [data])

  const locationScores = useMemo(() => {
    if (!sanitizedRows.length) {
      return {
        remote: 0,
        onsite: 0,
      }
    }

    const matchSet = new Set()
    genderFilters.forEach((genderId) => {
      const option = genderOptions.find((item) => item.id === genderId)
      if (option) {
        option.matches.forEach((match) => matchSet.add(match.toLowerCase()))
      }
    })
    const shouldFilterGender = matchSet.size > 0

    const gaussian = (delta, scale) => Math.exp(-Math.pow(delta / scale, 2))

    const sliderInfluence =
      ((hours - DEFAULTS.hours) / 20) * 25 -
      ((companySupport - DEFAULTS.companySupport) / 3) * 18 -
      ((sleepFocus - DEFAULTS.sleep) / 2) * 22

    const computeScore = (predicate) => {
      const rows = sanitizedRows.filter(predicate)
      if (!rows.length) {
        return 0
      }

      let totalWeight = 0
      let weightedStress = 0

      rows.forEach((row) => {
        const genderValue = String(row.gender ?? '').trim().toLowerCase()
        if (shouldFilterGender && !matchSet.has(genderValue)) {
          return
        }

        const rowCompanySupport = Number.isFinite(row.companySupport) ? row.companySupport : DEFAULTS.companySupport
        const rowSleepScore = toSleepScore(row.sleepQuality)
        const weight =
          gaussian((row.hoursWorked ?? DEFAULTS.hours) - hours, 10) *
          gaussian((rowCompanySupport ?? DEFAULTS.companySupport) - companySupport, 2) *
          gaussian(rowSleepScore - sleepFocus, 0.9)

        if (weight <= 0.0001) {
          return
        }

        totalWeight += weight
        const numericStress = STRESS_NUMERIC[row.stressLevel?.toLowerCase()] ?? STRESS_NUMERIC.medium
        weightedStress += weight * numericStress
      })

      let basePercent
      if (totalWeight > 0) {
        basePercent = (weightedStress / totalWeight) * 100
      } else {
        const fallbackAvg =
          rows.reduce(
            (sum, row) => sum + (STRESS_NUMERIC[row.stressLevel?.toLowerCase()] ?? STRESS_NUMERIC.medium),
            0
          ) / rows.length
        basePercent = fallbackAvg * 100
      }

      return clampPercent(basePercent + sliderInfluence)
    }

    const remotePredicate = (row) => String(row.workLocation ?? '').toLowerCase() !== 'onsite'
    const onsitePredicate = (row) => String(row.workLocation ?? '').toLowerCase() === 'onsite'

    return {
      remote: computeScore(remotePredicate),
      onsite: computeScore(onsitePredicate),
    }
  }, [sanitizedRows, genderFilters, genderOptions, hours, companySupport, sleepFocus])

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
    setCompanySupport(DEFAULTS.companySupport)
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

          <div className="comparison-controls">
            <div className="control-group">
              <label htmlFor="hours-slider" className="control-label">
                {copy?.panel?.hours?.label} <strong>{hours} {copy?.panel?.hours?.unit}</strong>
              </label>
              <div className="slider-wrapper">
                <input
                  id="hours-slider"
                  type="range"
                  min="25"
                  max="60"
                  step="1"
                  value={hours}
                  onChange={(event) => setHours(Number.parseInt(event.target.value, 10))}
                  disabled={genderFilters.length === 0}
                  className="control-slider control-slider--remote"
                />
                <div className="slider-ticks">
                  {[25, 30, 35, 40, 45, 50, 55, 60].map((tick) => (
                    <div key={tick} className="slider-tick" style={{ left: `${((tick - 25) / (60 - 25)) * 100}%` }}>
                      <span className="slider-tick-mark"></span>
                      <span className="slider-tick-label">{tick}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="company-support-slider" className="control-label">
                {copy?.panel?.companySupport?.label} <strong>{companySupport} {copy?.panel?.companySupport?.unit}</strong>
              </label>
              <div className="slider-wrapper">
                <input
                  id="company-support-slider"
                  type="range"
                  min="1"
                  max="5"
                  value={companySupport}
                  onChange={(event) => setCompanySupport(Number.parseInt(event.target.value, 10))}
                  disabled={genderFilters.length === 0}
                  className="control-slider control-slider--onsite control-slider--snap"
                />
                <div className="slider-ticks">
                  {[1, 2, 3, 4, 5].map((tick) => (
                    <div key={tick} className="slider-tick" style={{ left: `${((tick - 1) / (5 - 1)) * 100}%` }}>
                      <span className="slider-tick-mark"></span>
                      <span className="slider-tick-label">{tick}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="sleep-slider" className="control-label">
                {copy?.panel?.sleep?.label} <strong>{sleepLabel}</strong>
              </label>
              <div className="slider-wrapper">
                <input
                  id="sleep-slider"
                  type="range"
                  min="1"
                  max="3"
                  value={sleepFocus}
                  onChange={(event) => setSleepFocus(Number.parseInt(event.target.value, 10))}
                  disabled={genderFilters.length === 0}
                  className="control-slider control-slider--sleep control-slider--snap"
                />
                <div className="slider-ticks">
                  {['Poor', 'Average', 'Good'].map((label, index) => (
                    <div key={index + 1} className="slider-tick" style={{ left: `${(index / 2) * 100}%` }}>
                      <span className="slider-tick-mark"></span>
                      <span className="slider-tick-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="comparison-genders comparison-genders--minimal">
            <div className="comparison-genders__grid" role="group" aria-label={copy?.panel?.gender?.label}>
              {genderOptions.map((option) => {
                const isSelected = genderFilters.includes(option.id)
                return (
                  <label
                    key={option.id}
                    className={`comparison-checkbox${isSelected ? ' comparison-checkbox--active' : ''}`}
                  >
                    <span className="comparison-checkbox__chip">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateGenderFilters(option.id)}
                        className="comparison-checkbox__input"
                      />
                      <span className="comparison-checkbox__text">{option.label}</span>
                    </span>
                  </label>
                )
              })}
            </div>
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
