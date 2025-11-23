import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import DatasetOverviewChart from './components/DatasetOverviewChart'
import MultiDimensionScatter from './components/MultiDimensionScatter'
import WorkLifeBalanceLineChart from './components/WorkLifeBalanceLineChart'
import SocialIsolationBarChart from './components/SocialIsolationBarChart'
import SleepStressMatrix from './components/SleepStressMatrix'
import DocumentationPanel from './components/DocumentationPanel'
import DataLabPanel from './components/DataLabPanel'
import IndustryRadar from './components/IndustryRadar'
import StressPersonaHero from './components/StressPersonaHero'
import en from './i18n/en'
import pt from './i18n/pt'
import './App.css'

const dataUrl = new URL('../data/Impact_of_Remote_Work_on_Mental_Health.csv', import.meta.url)

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
  const [activeTab, setActiveTab] = useState('persona-model')
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')

  const copy = translations[language]
  const navigationTabs = useMemo(() => copy.navigation?.tabs ?? [], [copy.navigation])
  const activeTabConfig = useMemo(() => navigationTabs.find((tab) => tab.id === activeTab), [navigationTabs, activeTab])
  const heroTitle = activeTabConfig?.label ?? copy.hero.title
  const heroSubtitle = activeTabConfig?.description ?? ''
  const hasNavigation = navigationTabs.length > 0
  const navigationId = 'primary-navigation'

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

  const datasetCount = data.length > 0 ? data.length : null
  const themeButtonLabel = theme === 'dark' ? copy.hero.buttons.theme.light : copy.hero.buttons.theme.dark
  const languageButtonLabel =
    language === 'en' ? copy.hero.buttons.language.toPortuguese : copy.hero.buttons.language.toEnglish
  const languageToggleIcon = language === 'en' ? '🇵🇹' : '🇺🇸'
  const controlsLabel = `${copy.hero.buttons.theme.aria} / ${copy.hero.buttons.language.aria}`

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const toggleLanguage = () => {
    setLanguage((current) => (current === 'en' ? 'pt' : 'en'))
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'workload-dashboard':
        return (
          <>
            <section className="section section--wide">
              <div className="chart-grid chart-grid--single">
                <DatasetOverviewChart data={data} theme={theme} copy={copy.datasetOverviewChart} common={copy.common} />
              </div>
            </section>
          </>
        )
      case 'documentation': {
        const radarShowcase = copy.documentation?.radarShowcase
        const documentationStats = copy.documentation?.stats ?? []
        const formatDocumentationStat = (stat) => {
          if (typeof stat.value === 'function') {
            return stat.value(datasetCount)
          }
          return stat.value
        }
        return (
          <>
            <section className="section section--wide documentation-showcase">
              <div className="documentation-showcase__meta">
                {copy.documentation?.heading && <p className="documentation-showcase__heading">{copy.documentation.heading}</p>}
                {copy.documentation?.intro && <p className="documentation-showcase__intro">{copy.documentation.intro}</p>}
                {documentationStats.length > 0 && (
                  <div className="documentation-showcase__stats">
                    {documentationStats.map((stat) => (
                      <div key={stat.id} className="documentation-showcase__stat-card">
                        <p className="documentation-showcase__stat-label">{stat.label}</p>
                        <p className="documentation-showcase__stat-value">{formatDocumentationStat(stat)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="documentation-showcase__chart">
                <div className="documentation-showcase__chart-header">
                  <h2>{radarShowcase?.heading ?? copy.industryRadar?.title}</h2>
                  {radarShowcase?.intro && <p className="section__intro">{radarShowcase.intro}</p>}
                </div>
                <div className="documentation-showcase__chart-canvas">
                  <IndustryRadar data={data} theme={theme} copy={copy.industryRadar} common={copy.common} showHeader={false} />
                </div>
              </div>
            </section>
            <DocumentationPanel copy={copy.documentation} />
            <DataLabPanel copy={copy.dataLab} data={data} common={copy.common} />
          </>
        )
      }
      case 'workspace-influence': {
        return (
          <section className="section section--wide">
            <div className="chart-grid">
              <MultiDimensionScatter data={data} theme={theme} copy={copy.scatter} common={copy.common} showHeader={false} />
              <SocialIsolationBarChart data={data} theme={theme} copy={copy.socialIsolationBar} common={copy.common} showHeader={false} />
            </div>
          </section>
        )
      }
      case 'mental-health': {
        return (
          <section className="section section--wide">
            <div className="chart-grid">
              <WorkLifeBalanceLineChart data={data} theme={theme} copy={copy.workLifeBalanceLine} showHeader={false} />
              <SleepStressMatrix data={data} theme={theme} copy={copy.sleepStressMatrix} common={copy.common} showHeader={false} />
            </div>
          </section>
        )
      }
      case 'persona-model': {
        return (
          <section className="section section--wide">
            <StressPersonaHero data={data} copy={copy.stressLab} theme={theme} />
          </section>
        )
      }
      default:
        return null
    }
  }

  const mainContent = renderContent()

  return (
    <div className="page">
      <div className="app-shell">
        {hasNavigation && (
          <aside className="sidebar" aria-label={copy.navigation?.label}>
            <div className="sidebar__inner">
              {copy.navigation?.label && (
                <div className="sidebar__brand">
                  <img src="/logo.png" alt="" className="sidebar__brand-icon" />
                  <p className="sidebar__eyebrow">{copy.navigation.label}</p>
                </div>
              )}
              {copy.navigation?.subLabel && <p className="sidebar__hint">{copy.navigation.subLabel}</p>}
              <nav id={navigationId} className="sidebar-nav" role="tablist" aria-label={copy.navigation?.label}>
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    aria-selected={activeTab === tab.id}
                    className={`sidebar-nav__tab ${activeTab === tab.id ? 'sidebar-nav__tab--active' : ''}`}
                  >
                    <span className="sidebar-nav__label">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        <div className="app-shell__content">
          <header className="hero">
            <div className="hero__content">
              <div className="hero__top-bar">
                <div>
                  {copy.hero.eyebrow && <p className="hero__eyebrow">{copy.hero.eyebrow}</p>}
                  {heroTitle && <h1>{heroTitle}</h1>}
                  {heroSubtitle && <p className="hero__lead">{heroSubtitle}</p>}
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
                      {languageToggleIcon}
                    </span>
                    <span className="theme-toggle__label">{languageButtonLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main>{mainContent}</main>

          <footer className="page-footer">
            <p>{copy.footer}</p>
          </footer>
        </div>
      </div>

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
