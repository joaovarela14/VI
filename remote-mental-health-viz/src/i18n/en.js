const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('en-US')

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
})

const meetingsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const stressLevels = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
}

const workLocations = {
  Remote: 'Remote',
  Hybrid: 'Hybrid',
  Onsite: 'Onsite',
}

const sleepQuality = {
  Poor: 'Poor',
  Average: 'Average',
  Good: 'Good',
}

const mentalHealthConditions = {
  Anxiety: 'Anxiety',
  Depression: 'Depression',
  Burnout: 'Burnout',
  'No condition': 'No reported condition',
  Other: 'Other',
}

const formatCount = (value) => integerFormatter.format(value ?? 0)

const en = {
  common: {
    stressLevels,
    workLocations,
    sleepQuality,
    conditions: mentalHealthConditions,
    allLocations: 'All locations',
  },
  hero: {
    eyebrow: 'Remote work mental health explorer',
    title: 'How hybrid work patterns shape employee wellbeing',
    lead:
      'This dashboard summarises a synthetic survey that captures how professionals across industries experience remote work. Explore stress levels, regional differences in mental health conditions, and the connection between working hours and sleep quality.',
    meta: {
      datasetSize: (count) => {
        const value = count != null ? integerFormatter.format(count) : '—'
        return `Dataset size: ${value} employees`
      },
      source: 'Source: Impact of Remote Work on Mental Health survey (fictional)',
    },
    tablistLabel: 'Dashboard views',
    tabs: [
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
    buttons: {
      theme: {
        light: 'Switch to light mode',
        dark: 'Switch to dark mode',
        aria: 'Toggle light and dark theme',
      },
      language: {
        toEnglish: 'Switch to English',
        toPortuguese: 'Switch to Portuguese',
        aria: 'Change language',
      },
    },
  },
  overview: {
    heading: 'At a glance',
    intro:
      'Key indicators provide context before you dive into the detailed visual analysis. They highlight workload, meeting load, access to support, and the share of people thriving or struggling.',
    highlightsTitle: 'What to look for',
    metrics: [
      {
        id: 'avgHours',
        title: 'Average weekly hours',
        description: 'Typical workload reported by the respondents each week.',
        value: (stats) => `${decimalFormatter.format(stats.avgHours ?? 0)} h`,
      },
      {
        id: 'highStress',
        title: 'High stress prevalence',
        description: 'Share of people who describe their stress level as high.',
        value: (stats) => percentFormatter.format(stats.highStressShare ?? 0),
      },
      {
        id: 'satisfiedShare',
        title: 'Satisfied with remote work',
        description: 'Percentage of employees expressing satisfaction with remote work.',
        value: (stats) => percentFormatter.format(stats.satisfiedShare ?? 0),
      },
      {
        id: 'avgMeetings',
        title: 'Average virtual meetings',
        description: 'How many video calls people typically attend in a week.',
        value: (stats) => `${meetingsFormatter.format(stats.avgMeetings ?? 0)} / week`,
      },
      {
        id: 'resourceAccess',
        title: 'Access to mental health resources',
        description: 'Employees who state that their company provides mental health support.',
        value: (stats) => percentFormatter.format(stats.resourceAccessShare ?? 0),
      },
    ],
    charts: {
      heading: 'Explore the survey results',
      intro:
        'Three complementary visualisations reveal how context, location, and lifestyle relate to wellbeing. Hover the charts to inspect precise counts.',
    },
    insights: [
      {
        emphasis: 'Compare remote settings.',
        detail:
          'The stacked bars clarify whether onsite, hybrid, or fully remote roles face the highest stress burden.',
      },
      {
        emphasis: 'Scan regional disparities.',
        detail:
          'The mental health condition chart highlights where anxiety, depression, or burnout surface most often, guiding targeted interventions.',
      },
      {
        emphasis: 'Balance workload and rest.',
        detail:
          'The scatter plot helps you spot when long working hours coincide with poor sleep, especially for those experiencing high stress.',
      },
    ],
  },
  stressByLocation: {
    title: 'Stress levels by work location',
    description: 'Stacked counts of employees experiencing low, medium, or high stress by workplace arrangement.',
    legend: stressLevels,
    tooltip: ({ location, level, count, percent }) =>
      `${location} — ${level}: ${formatCount(count)} people (${percentFormatter.format((percent ?? 0) / 100)})`,
  },
  mentalHealthByRegion: {
    title: 'Mental health conditions by region',
    description: 'Stacked bars show how often depression, anxiety, and other reported conditions appear in each region.',
    legend: mentalHealthConditions,
    tooltip: ({ region, condition, count, percent }) =>
      `${region} — ${condition}: ${formatCount(count)} people (${percentFormatter.format((percent ?? 0) / 100)})`,
  },
  hoursVsSleep: {
    title: 'Hours worked vs. sleep quality',
    description:
      'Each dot represents an employee, coloured by self-reported stress level. Light jitter prevents overplotting.',
    legend: stressLevels,
    tooltip: ({ employeeId, hoursWorked, sleepQualityLabel, stressLevelLabel }) =>
      `${employeeId}\nHours per week: ${decimalFormatter.format(hoursWorked ?? 0)}\nSleep quality: ${sleepQualityLabel}\nStress level: ${stressLevelLabel}`,
  },
  scatter: {
    title: 'Hours, stress, and meeting cadence',
    description:
      'Colour encodes workplace arrangement, bubble size reflects stress levels, and the vertical axis shows virtual meetings per week.',
    filterLabel: 'Filter by work location',
    legendHeading: 'Work location',
    sizeLegendHeading: 'Stress level',
    filterOptions: {
      All: 'All locations',
      Remote: 'Remote',
      Hybrid: 'Hybrid',
      Onsite: 'Onsite',
    },
    empty: 'No responses with meeting and stress details are available.',
    tooltip: ({ employeeId, locationLabel, stressLabel, hoursWorked, virtualMeetings }) =>
      `<div class="chart-tooltip__title">${employeeId}</div>
       <div class="chart-tooltip__meta">${locationLabel}</div>
       <div class="chart-tooltip__meta">Stress: <strong>${stressLabel}</strong></div>
       <div class="chart-tooltip__meta">Hours per week: <strong>${decimalFormatter.format(hoursWorked ?? 0)}</strong></div>
       <div class="chart-tooltip__meta">Virtual meetings: <strong>${meetingsFormatter.format(
         virtualMeetings ?? 0
       )}</strong></div>`,
  },
  industryRadar: {
    title: 'Role mix within a sector',
    description:
      'Pick a sector to explore how job roles are distributed across work locations. Vertices show the most common roles for the selected industry.',
    sectorLabel: 'Select sector',
    locationLabel: 'Filter by work location',
    legendTitle: 'Work location',
    empty: 'Select a sector with available job role information to populate the radar chart.',
    optionAllLocations: 'All locations',
    ringLabel: (value) => percentFormatter.format(Math.min(value ?? 0, 1)),
    tooltip: ({ role, locationLabel, share, total, count }) =>
      `<div class="chart-tooltip__title">${role}</div>
       <div class="chart-tooltip__meta">${locationLabel}</div>
       <div class="chart-tooltip__meta">Share: <strong>${percentFormatter.format(Math.min(share ?? 0, 1))}</strong></div>
       <div class="chart-tooltip__meta">Responses in location: <strong>${formatCount(total)}</strong></div>
       <div class="chart-tooltip__meta">Approx. role count: <strong>${formatCount(count)}</strong></div>`,
  },
  deepDive: {
    meeting: {
      heading: 'Meeting load vs. stress',
      intro:
        'Visualise how weekly hours, stress, and meeting load intersect for each workplace arrangement. Use the colours to compare locations and the bubble size to understand how meeting-heavy schedules relate to pressure.',
    },
    sector: {
      heading: 'Sector mix by job role',
      intro:
        'Choose a sector to see which job roles dominate within each work setting. Filter by work location to inspect how remote, hybrid, and onsite teams differ inside that industry.',
    },
  },
  loading: 'Loading survey responses…',
  error: 'We were unable to load the dataset. Please try again later.',
  footer:
    'Prototype created for the Information Visualisation course. Built with React, Vite, and d3.js to demonstrate a human-centred approach to exploring wellbeing in distributed teams.',
}

export default en
