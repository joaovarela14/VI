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
  unsatisfied: 'Unsatisfied',
  dissatisfied: 'unsatisfied',
  'very unsatisfied': 'unsatisfied',
  satisfied: 'Satisfied',
  'very satisfied': 'satisfied',
  'extremely satisfied': 'satisfied',
  neutral: 'Neutral',
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
    title: 'Modular insights workspace',
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
  stressLab: {
    eyebrow: 'Interactive stress lab',
    title: 'Remote vs Onsite',
    description:
      'Use hours worked, meeting load, sleep quality, and the gender mix to morph the personas. The avatars react to the filtered dataset, shifting posture and stress colors as the scenario changes.',
    modelsLabel: '3D personas comparing remote and onsite contexts',
    remoteLabel: 'Remote / hybrid',
    onsiteLabel: 'On-site',
    context: {
      remote: {
        icon: '🏡',
        label: 'Home base',
      },
      onsite: {
        icon: '🏢',
        label: 'Office floor',
      },
    },
    states: {
      calm: 'Grounded',
      balanced: 'On alert',
      strained: 'Overloaded',
    },
    panel: {
      title: 'Adjust the sample',
      subtitle: 'Interact with the stress persona lab to explore remote vs onsite stress moods.',
      reset: 'Reset inputs',
      hours: {
        label: 'Hours per week',
        unit: 'hrs',
      },
      companySupport: {
        label: 'Company support',
        unit: '/5',
      },
      sleep: {
        label: 'Sleep quality',
        labels: {
          Poor: 'Poor',
          Average: 'Average',
          Good: 'Good',
        },
      },
      gender: {
        label: 'Gender focus',
        hint: 'Tick the checkboxes to focus on specific identities. Clear all to include everyone.',
      },
      differenceLabel: 'Remote vs. onsite gap',
    },
    genderOptions: [
      {
        id: 'female',
        label: 'Female',
        matches: ['female'],
      },
      {
        id: 'male',
        label: 'Male',
        matches: ['male'],
      },
      {
        id: 'nonbinary',
        label: 'Non-binary',
        matches: ['non-binary'],
      },
      {
        id: 'unspecified',
        label: 'Not specified',
        matches: ['prefer not to say'],
      },
    ],
  },
  navigation: {
    label: 'MIND@WORK',
    toggle: {
      open: 'Show navigation',
      close: 'Hide navigation',
    },
    tabs: [
      {
        id: 'persona-model',
        label: 'Interactive models',
        description: 'SVG images that react to dataset filters, shifting facil expressions as the scenario changes.',
      },
      {
        id: 'workload-dashboard',
        label: 'Overview dashboard',
        description: 'Global stress distribution and mental-health indicators.',
        note: 'Toggle between stress level and mental health condition views.',
      },
      {
        id: 'workspace-influence',
        label: 'Workspace',
        description: 'Workplace mix insights that combine bubble trends with isolation splits.',
        note: 'Hover over bubbles and bars for detailed information and ratings.',
      },
      {
        id: 'mental-health',
        label: 'Mental health',
        description: 'Support access trends and the sleep vs. stress temperature map.',
        note: 'Hover over charts for detailed metrics and respondent counts.',
      },
      {
        id: 'documentation',
        label: 'Documentation',
        description: 'Dataset notes, methodology, and variable map.',
      },
    ],
  },
  documentation: {
    heading: 'Dataset documentation',
    intro:
      'The Impact of Remote Work on Mental Health dataset consolidates anonymised survey responses describing workload, lifestyle, and wellbeing signals across remote, hybrid, and onsite professionals.',
    stats: [
      {
        id: 'records',
        label: 'Employee records',
        value: (count) => {
          const value = count != null ? integerFormatter.format(count) : '—'
          return `${value} employees`
        },
      },
      {
        id: 'source',
        label: 'Source',
        value: 'Impact of Remote Work on Mental Health (Kaggle)',
      },
      {
        id: 'format',
        label: 'Format',
        value: 'UTF-8 CSV, comma separated',
      },
    ],
    radarShowcase: {
      heading: 'Spider chart: role mix by workplace',
      intro:
        'Use the industry radar to see which job roles lead within each work location. Hover the spider chart to read exact proportions before diving into the qualitative notes below.',
    },
    sections: [],
  },
  datasetOverviewChart: {
    title: 'Stress levels by region',
    conditionTitle: 'Mental health conditions by region',
    description:
      'Start with the broad picture of how stress levels stack up in each region. ',
    ariaLabel: 'Interactive stacked bar chart showing stress distribution by region with filters',
    instructions: 'Use the dropdowns to filter the dataset and click a bar to inspect that region in the details panel.',
    empty: 'No employees match the selected filters.',
    legend: stressLevels,
    filters: {
      ariaLabel: 'Dataset filters',
      industry: 'Filter by industry',
      role: 'Filter by job role',
      location: 'Filter by work location',
      allIndustries: 'All industries',
      allRoles: 'All roles',
      allLocations: 'All locations',
    },
    modeLabel: 'Stacked metric',
    modeOptions: {
      stress: 'Stress level',
      condition: 'Mental health condition',
    },
    filtersLabel: 'Filters',
    tooltip: ({ region, categoryLabel, count, percentage }) =>
      `${region} — ${categoryLabel}: ${formatCount(count)} employees (${percentFormatter.format(Math.min(Math.max(percentage ?? 0, 0), 1))})`,
    formatters: {
      count: (value) => formatCount(value ?? 0),
      decimal: (value) => decimalFormatter.format(value ?? 0),
      percent: (value) => percentFormatter.format(Math.min(Math.max(value ?? 0, 0), 1)),
    },
    yAxisLabel: 'Number of employees',
    details: {
      overviewTitle: 'Filtered dataset',
      overviewSubtitle: 'Stats for everyone included by the active filters.',
      regionTitle: (region) => `${region} snapshot`,
      regionSubtitle: 'Metrics recalculated for the selected region.',
      employees: 'Employees',
      productivity: 'Productivity change',
      satisfaction: 'Remote work satisfaction',
      physicalActivity: 'Physical activity',
      productivityUnavailable: 'No productivity responses are available for the selected filters.',
      satisfactionUnavailable: 'No satisfaction responses are available for the selected filters.',
      activityUnavailable: 'No physical activity responses are available for the selected filters.',
      productivityLabels: {
        Increase: 'Increase',
        Decrease: 'Decrease',
        'No Change': 'No change',
      },
      activityLabels: {
        Daily: 'Daily',
        Weekly: 'Weekly',
        None: 'No activity',
      },
      unknown: 'Unknown',
    },
  },
  socialIsolationBar: {
    title: 'Social isolation by continent',
    description:
      'Average social isolation rating (1 = low, 5 = high) split by continent. Refine the data by gender and access to mental health resources.',
    hint: 'Hover over bars for detailed ratings',
    legendTitle: 'Work location',
    filters: {
      region: 'Filter by continent',
      gender: 'Filter by gender',
      access: 'Filter by mental health access',
      allRegions: 'All continents',
      allGenders: 'All genders',
      accessYes: 'Has support',
      accessNo: 'No support',
    },
    axisLabel: 'Average isolation rating',
    empty: 'No social isolation responses match the selected filters.',
    tooltip: ({ region, location, average, count }) =>
      `${region} — ${location}\nAverage rating: ${decimalFormatter.format(average ?? 0)}\nResponses: ${integerFormatter.format(count ?? 0)}`,
  },
  sleepStressMatrix: {
    title: 'Sleep quality vs. stress',
    description:
      'A heatmap reveals how sleep quality changes with stress levels. Focus on a specific mental health condition to uncover distinctive rest patterns.',
    hint: 'Hover over cells to see respondent counts',
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
    legend: {
      unsatisfied: 'Unsatisfied',
      neutral: 'Neutral',
      satisfied: 'Satisfied',
    },
  },
  scatter: {
    title: 'Hours, work location and meetings influence on stress',
    description:
      'Colour encodes workplace arrangement, bubble size reflects stress levels, and the vertical axis shows virtual meetings per week.',
    hint: 'Hover over bubbles for detailed information',
    filterLabel: 'Work location',
    industryFilterLabel: 'Filter by work area',
    sampleFilterLabel: 'Sample limit',
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
      200: '200',
      500: '500',
      1000: '1000',
      2000: '2000'
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
    title: 'Work-life balance by experience / age',
    description:
      'Compare average work-life balance ratings between people with and without access to mental health resources. Switch the X axis to view the trend by age or years of experience.',
    hint: 'Hover over line points for complete metrics',
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
       <div class="chart-tooltip__meta">Role count: <strong>${formatCount(count)}</strong></div>`,
  },
  loading: 'Loading survey responses…',
  error: 'We were unable to load the dataset. Please try again later.',
  footer:
    'Project for the Information Visualization course, developed by João Varela and Carolina Prata.',
  dataLab: {
    heading: 'Dataset Documentation',
    intro:
      'Explore every quantitative and qualitative variable available in the dataset. Hover each variable name to preview the values it can take.',
    datasetOverview: {
      title: 'Survey snapshot',
      paragraphs: [
        "As remote work becomes the new norm, it's essential to understand its impact on employees' mental well-being. This dataset dives into how working remotely affects stress levels, work-life balance, and mental health conditions across various industries and regions.",
        'With 5,000 records collected from employees worldwide, this dataset provides valuable insights into key areas like work location (remote, hybrid, onsite), stress levels, access to mental health resources, and job satisfaction. It’s designed to help researchers, HR professionals, and businesses assess the growing influence of remote work on productivity and well-being.',
      ],
      topics: [
        {
          title: 'Scope at a glance',
          description:
            'Responses span remote, hybrid, and onsite professionals across multiple industries and continents, keeping the focus on how context shapes wellbeing indicators.',
        },
        {
          title: 'How data was compiled',
          description:
            'The CSV aggregates an anonymous global survey where employees reported stress, workload, access to support, and satisfaction levels via structured questions.',
        },
        {
          title: 'Quality checks',
          description:
            'Entries missing key fields were discarded and repeated employee identifiers removed, leaving a consistent table ready for filtering and visual analysis.',
        },
      ],
    },
    quantitativeHeading: 'Quantitative metrics',
    qualitativeHeading: 'Qualitative signals',
    quantitative: [
      {
        id: 'age',
        name: 'Age',
        type: 'Integer',
        description: 'Age in years.',
      },
      {
        id: 'experience',
        name: 'Years_of_Experience',
        type: 'Integer',
        description: 'Total years of professional experience.',
      },
      {
        id: 'hours',
        name: 'Hours_Worked_Per_Week',
        type: 'Integer',
        description: 'Weekly hours dedicated to work.',
      },
      {
        id: 'meetings',
        name: 'Number_of_Virtual_Meetings',
        type: 'Integer',
        description: 'Virtual meetings attended per week.',
      },
      {
        id: 'balance',
        name: 'Work_Life_Balance_Rating',
        type: 'Integer',
        description: 'Self-rating from 1 (poor) to 5 (excellent).',
      },
      {
        id: 'isolation',
        name: 'Social_Isolation_Rating',
        type: 'Integer',
        description: 'Perceived isolation score from 1 to 5.',
      },
      {
        id: 'companySupport',
        name: 'Company_Support_for_Remote_Work',
        type: 'Integer',
        description: 'Support rating from 1 (low) to 5 (high).',
      },
    ],
    qualitative: [
      {
        id: 'stress',
        name: 'Stress_Level',
        type: 'String',
        description: 'Self-reported stress intensity.',
      },
      {
        id: 'gender',
        name: 'Gender',
        type: 'String',
        description: 'Participant gender identity.',
      },
      {
        id: 'role',
        name: 'Job_Role',
        type: 'String',
        description: 'Stated job role.',
      },
      {
        id: 'industry',
        name: 'Industry',
        type: 'String',
        description: 'Industry sector.',
      },
      {
        id: 'location',
        name: 'Work_Location',
        type: 'String',
        description: 'Remote, hybrid, or onsite mode.',
      },
      {
        id: 'condition',
        name: 'Mental_Health_Condition',
        type: 'String',
        description: 'Reported mental health condition.',
      },
      {
        id: 'access',
        name: 'Access_to_Mental_Health_Resources',
        type: 'String',
        description: 'States if a company provides mental health resources.',
      },
      {
        id: 'productivity',
        name: 'Productivity_Change',
        type: 'String',
        description: 'Perceived productivity shift.',
      },
      {
        id: 'satisfaction',
        name: 'Satisfaction_with_Remote_Work',
        type: 'String',
        description: 'Sentiment about remote work.',
      },
      {
        id: 'activity',
        name: 'Physical_Activity',
        type: 'String',
        description: 'Physical activity frequency.',
      },
      {
        id: 'sleep',
        name: 'Sleep_Quality',
        type: 'String',
        description: 'Sleep quality rating.',
      },
      {
        id: 'region',
        name: 'Region',
        type: 'String',
        description: 'Geographic region.',
      },
    ],
  },
}

export default en
