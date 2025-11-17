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

const industries = {
  Consulting: 'Consulting',
  Education: 'Education',
  Finance: 'Finance',
  Healthcare: 'Healthcare',
  IT: 'IT',
  Manufacturing: 'Manufacturing',
  Retail: 'Retail',
}

const mentalHealthConditions = {
  Anxiety: 'Anxiety',
  Depression: 'Depression',
  Burnout: 'Burnout',
  'No condition': 'No reported condition',
  Other: 'Other',
}

const satisfactionMap = {
  unsatisfied: 'unsatisfied',
  dissatisfied: 'unsatisfied',
  'very unsatisfied': 'unsatisfied',
  satisfied: 'satisfied',
  'very satisfied': 'satisfied',
  'extremely satisfied': 'satisfied',
  neutral: 'neutral',
  indifferent: 'neutral',
  'neither satisfied nor dissatisfied': 'neutral',
}

const formatCount = (value) => integerFormatter.format(value ?? 0)

const en = {
  common: {
    stressLevels,
    workLocations,
    sleepQuality,
    industries,
    conditions: mentalHealthConditions,
    mentalHealthAccess: {
      yes: 'Yes',
      no: 'No',
    },
    allLocations: 'All locations',
    allIndustries: 'All industries',
    satisfactionMap,
  },
  hero: {
    eyebrow: 'Remote work mental health explorer',
    title: 'Impact of Remote Work on Mental Health',
    lead:
      'This dashboard summarises a synthetic survey that captures how professionals across industries experience remote work. Explore stress levels, regional differences in mental health conditions, and the connection between working hours and sleep quality.',
    meta: {
      datasetSize: (count) => {
        const value = count != null ? integerFormatter.format(count) : '—'
        return `Dataset size: ${value} employees`
      },
      source: 'Source: Impact of Remote Work on Mental Health survey',
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
  socialIsolationBar: {
    title: 'Social isolation by continent',
    description:
      'Average social isolation rating (1 = low, 5 = high) split by continent. Refine the data by gender and access to mental health resources.',
    filters: {
      region: 'Filter by continent',
      gender: 'Filter by gender',
      access: 'Filter by mental health access',
      allRegions: 'All continents',
      allGenders: 'All genders',
      allAccess: 'All access levels',
      accessYes: 'Has support',
      accessNo: 'No support',
    },
    axisLabel: 'Average isolation rating',
    empty: 'No social isolation responses match the selected filters.',
    tooltip: ({ region, average, count }) =>
      `${region}\nAverage rating: ${decimalFormatter.format(average ?? 0)}\nResponses: ${integerFormatter.format(count ?? 0)}`,
  },
  conditionActivityStress: {
    title: 'Stress levels by mental health condition',
    description:
      'Stacked bars highlight how often each stress level is reported for every mental health condition. Filter the distribution by physical activity frequency to see how sport habits relate to pressure.',
    filters: {
      activity: 'Filter by physical activity',
      allActivities: 'All activity levels',
    },
    axis: {
      y: 'Employees',
    },
    empty: 'No responses are available for the selected activity level.',
    tooltip: ({ condition, stressLabel, count, percent }) =>
      `${condition} — ${stressLabel}\nPeople: ${formatCount(count)}\nShare: ${percentFormatter.format((percent ?? 0) / 100)}`,
  },
  sleepStressMatrix: {
    title: 'Sleep quality vs. stress',
    description:
      'A heatmap reveals how sleep quality changes with stress levels. Focus on a specific mental health condition to uncover distinctive rest patterns.',
    filters: {
      condition: 'Filter by mental health condition',
      allConditions: 'All conditions',
    },
    axisLabel: 'People',
    xAxisLabel: 'Sleep quality',
    yAxisLabel: 'Stress level',
    empty: 'No sleep quality details are available for the selected condition.',
    tooltip: ({ stressLabel, sleepLabel, count }) =>
      `${stressLabel} — ${sleepLabel}\nPeople: ${formatCount(count)}`,
  },
  satisfactionPie: {
    title: 'Remote work satisfaction split',
    description:
      'Track how employees rate their remote work experience. Filter by sector or region to reveal contrasting sentiment.',
    ariaLabel: 'Pie chart comparing satisfaction levels with remote work filtered by sector or region',
    legendTitle: 'Satisfaction level',
    legend: {
      unsatisfied: 'Unsatisfied',
      neutral: 'Neutral',
      satisfied: 'Satisfied',
    },
    filters: {
      sector: 'Filter by sector',
      region: 'Filter by region',
      allSectors: 'All sectors',
      allRegions: 'All regions',
    },
    empty: 'No responses are available for the selected filters.',
    tooltip: ({ label, count, percentage }) =>
      `${label}: ${formatCount(count)} employees (${percentFormatter.format((percentage ?? 0) / 100)})`,
  },
  scatter: {
    title: 'Hours, stress, and meeting cadence',
    description:
      'Colour encodes workplace arrangement, bubble size reflects stress levels, and the vertical axis shows virtual meetings per week.',
    filterLabel: 'Filter by work location',
    industryFilterLabel: 'Filter by work area',
    sampleFilterLabel: 'Limit random sample',
    legendHeading: 'Work location',
    sizeLegendHeading: 'Stress level',
    xAxisLabel: 'Hours worked per week',
    yAxisLabel: 'Virtual meetings per week',
    filterOptions: {
      All: 'All locations',
      Remote: 'Remote',
      Hybrid: 'Hybrid',
      Onsite: 'Onsite',
    },
    industryFilterOptions: {
      All: 'All industries',
    },
    sampleFilterOptions: {
      All: 'Show all points',
      200: 'Random sample (max 200)',
      500: 'Random sample (max 500)',
      1000: 'Random sample (max 1,000)',
      2000: 'Random sample (max 2,000)',
      5000: 'Random sample (max 5,000)',
    },
    sampleFilterUnavailable: 'Not enough responses for this sample size',
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
  workLifeBalanceLine: {
    title: 'Work-life balance by experience',
    description:
      'Compare average work-life balance ratings between people with and without access to mental health resources. Switch the X axis to view the trend by age or years of experience.',
    toggleLabel: 'Select horizontal axis',
    xOptions: {
      age: 'Age',
      experience: 'Years of experience',
    },
    yAxisLabel: 'Average work-life balance',
    legendTitle: 'Mental health access',
    legend: {
      yes: 'Yes',
      no: 'No',
    },
    empty: 'No work-life balance information is available for the selected settings.',
    ariaLabel: 'Line chart showing average work-life balance by age or experience split by mental health access',
    tooltip: ({ accessLabel, xLabel, xValue, average, count }) =>
      `<div class="chart-tooltip__title">${accessLabel}</div>
       <div class="chart-tooltip__meta">${xLabel}: <strong>${integerFormatter.format(xValue ?? 0)}</strong></div>
       <div class="chart-tooltip__meta">Average work-life balance: <strong>${decimalFormatter.format(average ?? 0)}</strong></div>
       <div class="chart-tooltip__meta">Responses: <strong>${integerFormatter.format(count ?? 0)}</strong></div>`,
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
    workLife: {
      heading: 'Work-life balance and support access',
      intro:
        'See how access to mental health resources relates to perceived work-life balance across different ages or experience levels.',
    },
    meeting: {
      heading: 'Virtual meetings load',
      intro:
        'Visualise how weekly hours, stress, and meeting load intersect for each workplace. Use the colours to compare locations and the bubble size to understand how are the stress levels.',
    },
    socialIsolation: {
      heading: 'Isolation intensity by continent',
      intro:
        'Compare the average social isolation rating across continents, and slice the view by gender or access to mental health support to reveal vulnerable groups.',
    },
    conditionStress: {
      heading: 'Stress mix by condition and activity',
      intro:
        'Inspect how reported stress levels shift across anxiety, depression, burnout, or other conditions. Toggle the physical activity filter to identify routines that coincide with lower stress.',
    },
    sleepStress: {
      heading: 'Rest patterns under stress',
      intro:
        'Use the heatmap to study how sleep quality changes at each stress level, and focus on a specific mental health condition to spot where rest deteriorates most.',
    },
    satisfaction: {
      heading: 'Remote work satisfaction filters',
      intro:
        'Slice the sentiment data by sector or region to uncover where remote work feels more supportive or frustrating. Hover the pie chart to read exact counts and percentages.',
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
    'Project for the Information Visualization course, developed by João Varela and Carolina Prata.',
}

export default en
