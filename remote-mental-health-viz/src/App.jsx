import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import StressByLocationChart from './components/StressByLocationChart'
import MentalHealthByRegionChart from './components/MentalHealthByRegionChart'
import HoursVsSleepScatter from './components/HoursVsSleepScatter'
import DatasetOverviewChart from './components/DatasetOverviewChart'
import OverviewMetrics from './components/OverviewMetrics'
import MultiDimensionScatter from './components/MultiDimensionScatter'
import IndustryRadar from './components/IndustryRadar'
import DataLabPanel from './components/DataLabPanel'
import WorkLifeBalanceLineChart from './components/WorkLifeBalanceLineChart'
import SatisfactionPieChart from './components/SatisfactionPieChart'
import SocialIsolationBarChart from './components/SocialIsolationBarChart'
import ConditionActivityStressChart from './components/ConditionActivityStressChart'
import SleepStressMatrix from './components/SleepStressMatrix'
import DocumentationPanel from './components/DocumentationPanel'
import StressPersonaHero from './components/StressPersonaHero'
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
  const [activeTab, setActiveTab] = useState('workload')
  const [activeSubTab, setActiveSubTab] = useState('workload-metrics')
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')

  const copy = translations[language]
  const navigationTabs = useMemo(() => copy.navigation?.tabs ?? [], [copy.navigation])
  const activeTabConfig = useMemo(() => navigationTabs.find((tab) => tab.id === activeTab), [navigationTabs, activeTab])
  const activeSubTabs = activeTabConfig?.subTabs ?? []
  const activeSubTabConfig = useMemo(
    () => activeSubTabs.find((subTab) => subTab.id === activeSubTab),
    [activeSubTabs, activeSubTab]
  )

  useEffect(() => {
    const classList = document.body.classList
    classList.remove('theme-dark', 'theme-light')
    classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    if (!navigationTabs.length) {
      return
    }
    setActiveTab((current) => {
      if (navigationTabs.some((tab) => tab.id === current)) {
        return current
      }
      return navigationTabs[0].id
    })
  }, [navigationTabs])

  useEffect(() => {
    if (!activeTabConfig) {
      setActiveSubTab(null)
      return
    }
    const subTabs = activeTabConfig.subTabs ?? []
    if (!subTabs.length) {
      setActiveSubTab(null)
      return
    }
    setActiveSubTab((current) => {
      if (subTabs.some((subTab) => subTab.id === current)) {
        return current
      }
      return subTabs[0].id
    })
  }, [activeTabConfig])

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

  const renderContent = () => {
    if (activeTab === 'documentation') {
      const radarShowcase = copy.documentation?.radarShowcase
      return (
        <>
          <DocumentationPanel copy={copy.documentation} datasetCount={datasetCount} />
          <DataLabPanel copy={copy.dataLab} data={data} common={copy.common} />
          <section className="section section--wide">
            <h2>{radarShowcase?.heading ?? copy.industryRadar?.title}</h2>
            {radarShowcase?.intro && <p className="section__intro">{radarShowcase.intro}</p>}
            <div className="chart-grid chart-grid--single">
              <IndustryRadar data={data} theme={theme} copy={copy.industryRadar} common={copy.common} showHeader={false} />
            </div>
          </section>
        </>
      )
    }

    const subTabInfo = activeSubTabConfig
    switch (activeSubTab) {
      case 'workload-metrics':
        return (
          <>
            <section className="section section--wide">
              <h2>{subTabInfo?.label ?? copy.overview.heading}</h2>
              {subTabInfo?.description && <p className="section__intro">{subTabInfo.description}</p>}
              <OverviewMetrics metrics={copy.overview.metrics} stats={stats} />
              <div className="chart-grid chart-grid--single">
                <DatasetOverviewChart data={data} theme={theme} copy={copy.datasetOverviewChart} common={copy.common} />
              </div>
            </section>

            <section className="section section--wide">
              <h2>{copy.hoursVsSleep.title}</h2>
              <p className="section__intro">{copy.hoursVsSleep.description}</p>
              <div className="chart-grid chart-grid--single">
                <HoursVsSleepScatter data={data} theme={theme} copy={copy.hoursVsSleep} common={copy.common} />
              </div>
            </section>
          </>
        )
      case 'wellbeing-stress':
        return (
          <section className="section section--wide">
            <h2>{subTabInfo?.label}</h2>
            {subTabInfo?.description && <p className="section__intro">{subTabInfo.description}</p>}
            <div className="chart-grid">
              <StressByLocationChart data={data} theme={theme} copy={copy.stressByLocation} common={copy.common} />
              <MentalHealthByRegionChart data={data} theme={theme} copy={copy.mentalHealthByRegion} common={copy.common} />
            </div>
          </section>
        )
      case 'wellbeing-sentiment':
        return (
          <section className="section section--wide">
            <h2>{subTabInfo?.label ?? copy.satisfactionPie?.title}</h2>
            {subTabInfo?.description && <p className="section__intro">{subTabInfo.description}</p>}
            <div className="chart-grid chart-grid--single">
              <SatisfactionPieChart data={data} theme={theme} copy={copy.satisfactionPie} common={copy.common} showHeader={false} />
            </div>
          </section>
        )
      case 'mental-health-overview':
        return (
          <section className="section section--wide">
            <h2>{subTabInfo?.label ?? copy.workLifeBalanceLine?.title}</h2>
            {subTabInfo?.description && <p className="section__intro">{subTabInfo.description}</p>}
            <div className="chart-grid">
              <WorkLifeBalanceLineChart data={data} theme={theme} copy={copy.workLifeBalanceLine} showHeader={false} />
              <SleepStressMatrix data={data} theme={theme} copy={copy.sleepStressMatrix} common={copy.common} showHeader={false} />
            </div>
          </section>
        )
      case 'workspace-influence-overview': {
        const meetingCopy = copy.deepDive?.meeting
        const isolationCopy = copy.deepDive?.socialIsolation
        const heading = subTabInfo?.label ?? meetingCopy?.heading
        const intro =
          subTabInfo?.description ?? meetingCopy?.intro ?? isolationCopy?.intro
        return (
          <section className="section section--wide">
            {heading && <h2>{heading}</h2>}
            {intro && <p className="section__intro">{intro}</p>}
            <div className="chart-grid">
              <MultiDimensionScatter data={data} theme={theme} copy={copy.scatter} common={copy.common} showHeader={false} />
              <SocialIsolationBarChart data={data} theme={theme} copy={copy.socialIsolationBar} showHeader={false} />
            </div>
          </section>
        )
      }
      case 'roles-activity':
        return (
          <section className="section section--wide">
            <h2>{subTabInfo?.label}</h2>
            {subTabInfo?.description && <p className="section__intro">{subTabInfo.description}</p>}
            <div className="chart-grid chart-grid--single">
              <ConditionActivityStressChart data={data} theme={theme} copy={copy.conditionActivityStress} common={copy.common} showHeader={false} />
            </div>
          </section>
        )
      case 'roles-industry':
        return (
          <section className="section section--wide">
            <h2>{subTabInfo?.label ?? copy.industryRadar?.title}</h2>
            {subTabInfo?.description && <p className="section__intro">{subTabInfo.description}</p>}
            <div className="chart-grid chart-grid--single">
              <IndustryRadar data={data} theme={theme} copy={copy.industryRadar} common={copy.common} showHeader={false} />
            </div>
          </section>
        )
      default:
        return null
    }
  }

  const mainContent = renderContent()

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <div className="hero__top-bar">
            <div>
              {copy.hero.eyebrow && <p className="hero__eyebrow">{copy.hero.eyebrow}</p>}
              {copy.hero.title && <h1>{copy.hero.title}</h1>}
            </div>
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
                <span className="theme-toggle__label">{themeButtonLabel}</span>
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

          {copy.stressLab && <StressPersonaHero data={data} copy={copy.stressLab} theme={theme} />}

          {navigationTabs.length > 0 && (
            <div className="hero__navigation">
              <nav className="hero__tabs hero__tabs--primary" role="tablist" aria-label={copy.navigation?.label}>
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-selected={activeTab === tab.id}
                    className={`hero__tab hero__tab--primary ${activeTab === tab.id ? 'hero__tab--active' : ''}`}
                  >
                    <span className="hero__tab-label">{tab.label}</span>
                    <span className="hero__tab-description">{tab.description}</span>
                  </button>
                ))}
              </nav>

              {activeSubTabs.length > 0 && (
                <nav
                  className="hero__tabs hero__tabs--secondary"
                  role="tablist"
                  aria-label={copy.navigation?.subLabel ?? (activeTabConfig ? `${activeTabConfig.label} sections` : undefined)}
                >
                  {activeSubTabs.map((subTab) => (
                    <button
                      key={subTab.id}
                      role="tab"
                      type="button"
                      onClick={() => setActiveSubTab(subTab.id)}
                      aria-selected={activeSubTab === subTab.id}
                      className={`hero__tab hero__tab--secondary ${activeSubTab === subTab.id ? 'hero__tab--active' : ''}`}
                    >
                      <span className="hero__tab-label">{subTab.label}</span>
                      <span className="hero__tab-description">{subTab.description}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          )}
        </div>
      </header>

      <main>{mainContent}</main>

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
