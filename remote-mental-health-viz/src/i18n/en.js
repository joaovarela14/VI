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
  navigation: {
    label: 'Primary content tabs',
    subLabel: 'Sections inside the selected tab',
    tabs: [
      {
        id: 'workload',
        label: 'Workload & balance',
        description: 'Hours, meetings, and balance indicators driven by numeric drivers.',
        subTabs: [
          {
            id: 'workload-metrics',
            label: 'Workload dashboard',
            description: 'Overview KPIs plus the hours vs. sleep scatter.',
          },
          {
            id: 'workload-balance',
            label: 'Balance by support',
            description: 'Track work-life ratings split by access to mental health resources.',
          },
          {
            id: 'workload-meetings',
            label: 'Meetings vs. stress',
            description: 'Link hours, meeting load, stress, and locations in one scatter.',
          },
        ],
      },
      {
        id: 'wellbeing',
        label: 'Wellbeing signals',
        description: 'Stress, conditions, isolation, and sleep quality indicators.',
        subTabs: [
          {
            id: 'wellbeing-stress',
            label: 'Stress & conditions',
            description: 'Location stress mix plus mental health prevalence by region.',
          },
          {
            id: 'wellbeing-habits',
            label: 'Isolation & sleep',
            description: 'Compare isolation averages and sleep quality vs. stress.',
          },
          {
            id: 'wellbeing-sentiment',
            label: 'Satisfaction & support',
            description: 'Slice satisfaction sentiment by sector and region filters.',
          },
        ],
      },
      {
        id: 'roles',
        label: 'Roles & industries',
        description: 'Role mix, physical activity, and remote environment context.',
        subTabs: [
          {
            id: 'roles-activity',
            label: 'Activity & stress mix',
            description: 'Mental health conditions contrasted with physical activity levels.',
          },
          {
            id: 'roles-industry',
            label: 'Industry radar',
            description: 'Top job roles by industry, split by remote set-up.',
          },
        ],
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
    sections: [],
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
  dataLab: {
    heading: 'Dataset Overview',
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
