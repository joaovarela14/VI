import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import StressByLocationChart from './components/StressByLocationChart'
import MentalHealthByRegionChart from './components/MentalHealthByRegionChart'
import HoursVsSleepScatter from './components/HoursVsSleepScatter'
import MultiDimensionScatter from './components/MultiDimensionScatter'
import IndustryRadar from './components/IndustryRadar'
import './App.css'

const dataUrl = new URL('../data/Impact_of_Remote_Work_on_Mental_Health.csv', import.meta.url)

const positiveSatisfaction = new Set(['satisfied', 'very satisfied', 'extremely satisfied'])

const parseNumber = (value) => {
  const number = Number.parseFloat(value)
  return Number.isFinite(number) ? number : undefined
}

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [theme, setTheme] = useState('dark')

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
        setLoading(false)
      } catch (err) {
        setError('We were unable to load the dataset. Please try again later.')
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

  const tabs = useMemo(
    () => [
      {
        id: 'overview',
        label: 'Overview story',
        description: 'Highlights workload, stress, and support access at a glance.',
      },
      {
        id: 'deep-dive',
        label: 'Work patterns lab',
        description: 'Analyse meeting load and sector mix by role and location.',
      },
    ],
    []
  )

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Remote work mental health explorer</p>
          <h1>How hybrid work patterns shape employee wellbeing</h1>
          <p className="hero__lead">
            This dashboard summarises a synthetic survey that captures how professionals across industries experience remote
            work. Explore stress levels, regional differences in mental health conditions, and the connection between working
            hours and sleep quality.
          </p>
          <div className="hero__meta">
            <span>Dataset size: {data.length || '—'} employees</span>
            <span>Source: Impact of Remote Work on Mental Health survey (fictional)</span>
          </div>
        </div>
        <div className="hero__footer">
          <nav className="hero__tabs" role="tablist" aria-label="Dashboard views">
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
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label="Toggle light and dark theme"
          >
            <span className="theme-toggle__icon" aria-hidden="true">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
            <span className="theme-toggle__label">
              {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'overview' ? (
          <>
            <section className="section">
              <h2>At a glance</h2>
              <p className="section__intro">
                Key indicators provide context before you dive into the detailed visual analysis. They highlight workload, meeting
                load, access to support, and the share of people thriving or struggling.
              </p>
              <div className="metrics-grid">
                <article className="metric-card">
                  <h3>Average weekly hours</h3>
                  <p className="metric-card__value">{stats.avgHours.toFixed(1)} h</p>
                  <p className="metric-card__description">Typical workload reported by the respondents each week.</p>
                </article>
                <article className="metric-card">
                  <h3>High stress prevalence</h3>
                  <p className="metric-card__value">{Math.round(stats.highStressShare * 100)}%</p>
                  <p className="metric-card__description">Share of people who describe their stress level as high.</p>
                </article>
                <article className="metric-card">
                  <h3>Satisfied with remote work</h3>
                  <p className="metric-card__value">{Math.round(stats.satisfiedShare * 100)}%</p>
                  <p className="metric-card__description">Percentage of employees expressing satisfaction with remote work.</p>
                </article>
                <article className="metric-card">
                  <h3>Average virtual meetings</h3>
                  <p className="metric-card__value">{stats.avgMeetings.toFixed(1)} / week</p>
                  <p className="metric-card__description">How many video calls people typically attend in a week.</p>
                </article>
                <article className="metric-card">
                  <h3>Access to mental health resources</h3>
                  <p className="metric-card__value">{Math.round(stats.resourceAccessShare * 100)}%</p>
                  <p className="metric-card__description">Employees who state that their company provides mental health support.</p>
                </article>
              </div>
            </section>

            <section className="section section--charts">
              <h2>Explore the survey results</h2>
              <p className="section__intro">
                Three complementary visualisations reveal how context, location, and lifestyle relate to wellbeing. Hover the charts
                to inspect precise counts.
              </p>
              <div className="chart-grid">
                <StressByLocationChart data={data} theme={theme} />
                <MentalHealthByRegionChart data={data} theme={theme} />
                <HoursVsSleepScatter data={data} theme={theme} />
              </div>
            </section>

            <section className="section">
              <h2>What to look for</h2>
              <div className="insights">
                <p>
                  <strong>Compare remote settings.</strong> The stacked bars clarify whether onsite, hybrid, or fully remote roles face the
                  highest stress burden.
                </p>
                <p>
                  <strong>Scan regional disparities.</strong> The mental health condition chart highlights where anxiety, depression, or
                  burnout surface most often, guiding targeted interventions.
                </p>
                <p>
                  <strong>Balance workload and rest.</strong> The scatter plot helps you spot when long working hours coincide with poor
                  sleep, especially for those experiencing high stress.
                </p>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="section">
              <h2>Meeting load vs. stress</h2>
              <p className="section__intro">
                Visualise how weekly hours and meeting cadence intersect for each workplace arrangement. Colour compares job
                locations, bubble size captures stress levels, and the Y axis shows the number of virtual meetings per week.
              </p>
              <div className="chart-grid chart-grid--single">
                <MultiDimensionScatter data={data} theme={theme} />
              </div>
            </section>

            <section className="section">
              <h2>Sector mix by job role</h2>
              <p className="section__intro">
                Choose a sector to see which job roles dominate within each work setting. Filter by work location to inspect how
                remote, hybrid, and onsite teams differ inside that industry.
              </p>
              <IndustryRadar data={data} theme={theme} />
            </section>
          </>
        )}
      </main>

      <footer className="page-footer">
        <p>
          Prototype created for the Information Visualisation course. Built with React, Vite, and d3.js to demonstrate a
          human-centred approach to exploring wellbeing in distributed teams.
        </p>
      </footer>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true" />
          <span>Loading survey responses…</span>
        </div>
      )}
      {error && !loading && <div className="error-banner">{error}</div>}
    </div>
  )
}

export default App
