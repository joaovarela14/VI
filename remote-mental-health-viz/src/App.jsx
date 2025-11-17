import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import StressByLocationChart from './components/StressByLocationChart'
import MentalHealthByRegionChart from './components/MentalHealthByRegionChart'
import HoursVsSleepScatter from './components/HoursVsSleepScatter'
import OverviewMetrics from './components/OverviewMetrics'
import MultiDimensionScatter from './components/MultiDimensionScatter'
import IndustryRadar from './components/IndustryRadar'
import WorkLifeBalanceLineChart from './components/WorkLifeBalanceLineChart'
import SatisfactionPieChart from './components/SatisfactionPieChart'
import SocialIsolationBarChart from './components/SocialIsolationBarChart'
import ConditionActivityStressChart from './components/ConditionActivityStressChart'
import SleepStressMatrix from './components/SleepStressMatrix'
import en from './i18n/en'
import pt from './i18n/pt'
import './App.css'

const dataUrl = new URL('../data/Impact_of_Remote_Work_on_Mental_Health.csv', import.meta.url)

const positiveSatisfaction = new Set(['satisfied', 'very satisfied', 'extremely satisfied'])

const translations = {
  en,
  pt,
}

const parseNumber = (value) => {
  const number = Number.parseFloat(value)
  return Number.isFinite(number) ? number : undefined
}

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')

  const copy = translations[language]

  useEffect(() => {
    const classList = document.body.classList
    classList.remove('theme-dark', 'theme-light')
    classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    const loadData = async () => {
      try {
        const parsed = await d3.csv(dataUrl, (row) => ({
          employeeId: row.Employee_ID,
          age: parseNumber(row.Age),
          gender: row.Gender,
          jobRole: row.Job_Role,
          industry: row.Industry,
          yearsExperience: parseNumber(row.Years_of_Experience),
          workLocation: row.Work_Location,
          hoursWorked: parseNumber(row.Hours_Worked_Per_Week),
          virtualMeetings: parseNumber(row.Number_of_Virtual_Meetings),
          workLifeBalance: parseNumber(row.Work_Life_Balance_Rating),
          stressLevel: row.Stress_Level,
          mentalHealthCondition: row.Mental_Health_Condition,
          hasMentalHealthResources: row.Access_to_Mental_Health_Resources === 'Yes',
          productivityChange: row.Productivity_Change,
          socialIsolationRating: parseNumber(row.Social_Isolation_Rating),
          satisfaction: row.Satisfaction_with_Remote_Work,
          companySupport: parseNumber(row.Company_Support_for_Remote_Work),
          physicalActivity: row.Physical_Activity,
          sleepQuality: row.Sleep_Quality,
          region: row.Region,
        }))

        setData(parsed)
        setError(false)
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const stats = useMemo(() => {
    if (!data.length) {
      return {
        avgHours: 0,
        highStressShare: 0,
        satisfiedShare: 0,
        avgMeetings: 0,
        resourceAccessShare: 0,
      }
    }

    const hoursValues = data.map((d) => d.hoursWorked).filter((value) => Number.isFinite(value))
    const meetingsValues = data.map((d) => d.virtualMeetings).filter((value) => Number.isFinite(value))

    const avgHours = d3.mean(hoursValues) ?? 0
    const avgMeetings = d3.mean(meetingsValues) ?? 0
    const highStressShare = data.filter((d) => d.stressLevel === 'High').length / data.length
    const satisfiedShare =
      data.filter((d) => positiveSatisfaction.has((d.satisfaction ?? '').toLowerCase())).length / data.length
    const resourceAccessShare = data.filter((d) => d.hasMentalHealthResources).length / data.length

    return {
      avgHours,
      avgMeetings,
      highStressShare,
      satisfiedShare,
      resourceAccessShare,
    }
  }, [data])

  const tabs = copy.hero.tabs
  const datasetCount = data.length > 0 ? data.length : null
  const themeButtonLabel = theme === 'dark' ? copy.hero.buttons.theme.light : copy.hero.buttons.theme.dark
  const languageButtonLabel = language === 'en' ? copy.hero.buttons.language.toPortuguese : copy.hero.buttons.language.toEnglish
  const controlsLabel = `${copy.hero.buttons.theme.aria} / ${copy.hero.buttons.language.aria}`

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const toggleLanguage = () => {
    setLanguage((current) => (current === 'en' ? 'pt' : 'en'))
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <div className="hero__top-bar">
            <p className="hero__eyebrow">{copy.hero.eyebrow}</p>
            <div className="hero__controls" role="group" aria-label={controlsLabel}>
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                aria-label={copy.hero.buttons.theme.aria}
              >
                <span className="theme-toggle__icon" aria-hidden="true">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
                <span className="theme-toggle__label">
                  {themeButtonLabel}
                </span>
              </button>
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleLanguage}
                aria-pressed={language === 'pt'}
                aria-label={copy.hero.buttons.language.aria}
              >
                <span className="theme-toggle__icon" aria-hidden="true">
                  🌐
                </span>
                <span className="theme-toggle__label">{languageButtonLabel}</span>
              </button>
            </div>
          </div>
          <h1>{copy.hero.title}</h1>
          <p className="hero__lead">{copy.hero.lead}</p>
          <div className="hero__meta">
            <span>{copy.hero.meta.datasetSize(datasetCount)}</span>
            <span>{copy.hero.meta.source}</span>
          </div>
          <nav className="hero__tabs" role="tablist" aria-label={copy.hero.tablistLabel}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
                className={`hero__tab ${activeTab === tab.id ? 'hero__tab--active' : ''}`}
              >
                <span className="hero__tab-label">{tab.label}</span>
                <span className="hero__tab-description">{tab.description}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {activeTab === 'overview' ? (
          <>
            <section className="section section--wide">
              <h2>{copy.overview.heading}</h2>
              <p className="section__intro">{copy.overview.intro}</p>
              <OverviewMetrics metrics={copy.overview.metrics} stats={stats} />
            </section>

            <section className="section section--wide section--charts">
              <h2>{copy.overview.charts.heading}</h2>
              <p className="section__intro">{copy.overview.charts.intro}</p>
              <div className="chart-grid chart-grid--triple">
                <StressByLocationChart data={data} theme={theme} copy={copy.stressByLocation} common={copy.common} />
                <MentalHealthByRegionChart data={data} theme={theme} copy={copy.mentalHealthByRegion} common={copy.common} />
                <HoursVsSleepScatter data={data} theme={theme} copy={copy.hoursVsSleep} common={copy.common} />
              </div>
            </section>

            <section className="section section--wide">
              <h2>{copy.overview.highlightsTitle}</h2>
              <div className="insights">
                {copy.overview.insights.map((insight, index) => (
                  <p key={index}>
                    <strong>{insight.emphasis}</strong> {insight.detail}
                  </p>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="sections-grid">
            <section className="section section--grid-child">
              <h2>{copy.deepDive.workLife.heading}</h2>
              <p className="section__intro">{copy.deepDive.workLife.intro}</p>
              <div className="chart-grid chart-grid--single">
                <WorkLifeBalanceLineChart data={data} theme={theme} copy={copy.workLifeBalanceLine} />
              </div>
            </section>

            <section className="section section--grid-child">
              <h2>{copy.deepDive.meeting.heading}</h2>
              <p className="section__intro">{copy.deepDive.meeting.intro}</p>
              <div className="chart-grid chart-grid--single">
                <MultiDimensionScatter data={data} theme={theme} copy={copy.scatter} common={copy.common} />
              </div>
            </section>

            <section className="section section--grid-child">
              <h2>{copy.deepDive.socialIsolation.heading}</h2>
              <p className="section__intro">{copy.deepDive.socialIsolation.intro}</p>
              <div className="chart-grid chart-grid--single">
                <SocialIsolationBarChart data={data} theme={theme} copy={copy.socialIsolationBar} />
              </div>
            </section>

            <section className="section section--grid-child">
              <h2>{copy.deepDive.conditionStress.heading}</h2>
              <p className="section__intro">{copy.deepDive.conditionStress.intro}</p>
              <div className="chart-grid chart-grid--single">
                <ConditionActivityStressChart
                  data={data}
                  theme={theme}
                  copy={copy.conditionActivityStress}
                  common={copy.common}
                />
              </div>
            </section>

            <section className="section section--grid-child">
              <h2>{copy.deepDive.sleepStress.heading}</h2>
              <p className="section__intro">{copy.deepDive.sleepStress.intro}</p>
              <div className="chart-grid chart-grid--single">
                <SleepStressMatrix data={data} theme={theme} copy={copy.sleepStressMatrix} common={copy.common} />
              </div>
            </section>

            <section className="section section--grid-child">
              <h2>{copy.deepDive.satisfaction.heading}</h2>
              <p className="section__intro">{copy.deepDive.satisfaction.intro}</p>
              <div className="chart-grid chart-grid--single">
                <SatisfactionPieChart data={data} theme={theme} copy={copy.satisfactionPie} common={copy.common} />
              </div>
            </section>

            <section className="section section--grid-child">
              <h2>{copy.deepDive.sector.heading}</h2>
              <p className="section__intro">{copy.deepDive.sector.intro}</p>
              <IndustryRadar data={data} theme={theme} copy={copy.industryRadar} common={copy.common} />
            </section>
          </div>
        )}
      </main>

      <footer className="page-footer">
        <p>{copy.footer}</p>
      </footer>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true" />
          <span>{copy.loading}</span>
        </div>
      )}
      {error && !loading && <div className="error-banner">{copy.error}</div>}
    </div>
  )
}

export default App
