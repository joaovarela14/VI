const decimalFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('pt-PT')

const percentFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'percent',
  maximumFractionDigits: 0,
})

const meetingsFormatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const stressLevels = {
  Low: 'Baixo',
  Medium: 'Médio',
  High: 'Elevado',
}

const workLocations = {
  Remote: 'Remoto',
  Hybrid: 'Híbrido',
  Onsite: 'Presencial',
}

const sleepQuality = {
  Poor: 'Fraca',
  Average: 'Razoável',
  Good: 'Boa',
}

const mentalHealthConditions = {
  Anxiety: 'Ansiedade',
  Depression: 'Depressão',
  Burnout: 'Burnout',
  'No condition': 'Sem condição reportada',
  Other: 'Outra',
}

const formatCount = (value) => integerFormatter.format(value ?? 0)

const pt = {
  common: {
    stressLevels,
    workLocations,
    sleepQuality,
    conditions: mentalHealthConditions,
    mentalHealthAccess: {
      yes: 'Com apoio de saúde mental',
      no: 'Sem apoio de saúde mental',
    },
    allLocations: 'Todas as localizações',
  },
  hero: {
    eyebrow: 'Explorador da saúde mental em trabalho remoto',
    title: 'Como os modelos híbridos moldam o bem-estar das equipas',
    lead:
      'Este painel resume um inquérito sintético sobre a experiência de profissionais em trabalho remoto. Explore níveis de stress, diferenças regionais nas condições de saúde mental e a relação entre horas trabalhadas e qualidade do sono.',
    meta: {
      datasetSize: (count) => {
        const value = count != null ? integerFormatter.format(count) : '—'
        return `Dimensão do inquérito: ${value} colaboradores`
      },
      source: 'Fonte: Impact of Remote Work on Mental Health (inquérito fictício)',
    },
    tablistLabel: 'Vistas do painel',
    tabs: [
      {
        id: 'overview',
        label: 'História geral',
        description: 'Destaca carga de trabalho, stress e apoio disponível de forma imediata.',
      },
      {
        id: 'deep-dive',
        label: 'Laboratório de padrões',
        description: 'Analise reuniões semanais e a mistura sectorial por função e localização.',
      },
    ],
    buttons: {
      theme: {
        light: 'Mudar para modo claro',
        dark: 'Mudar para modo escuro',
        aria: 'Alternar entre modo claro e escuro',
      },
      language: {
        toEnglish: 'Mudar para Inglês',
        toPortuguese: 'Mudar para Português',
        aria: 'Alterar idioma',
      },
    },
  },
  overview: {
    heading: 'Em destaque',
    intro:
      'Os indicadores principais dão contexto antes de explorar as visualizações. Mostram carga de trabalho, ritmo de reuniões, acesso a apoio e a proporção de pessoas em equilíbrio ou em dificuldade.',
    highlightsTitle: 'Pontos de atenção',
    metrics: [
      {
        id: 'avgHours',
        title: 'Horas semanais médias',
        description: 'Carga típica reportada pelos participantes ao longo da semana.',
        value: (stats) => `${decimalFormatter.format(stats.avgHours ?? 0)} h`,
      },
      {
        id: 'highStress',
        title: 'Prevalência de stress elevado',
        description: 'Percentagem de pessoas que descrevem o seu nível de stress como elevado.',
        value: (stats) => percentFormatter.format(stats.highStressShare ?? 0),
      },
      {
        id: 'satisfiedShare',
        title: 'Satisfação com trabalho remoto',
        description: 'Colaboradores que demonstram satisfação com o trabalho remoto.',
        value: (stats) => percentFormatter.format(stats.satisfiedShare ?? 0),
      },
      {
        id: 'avgMeetings',
        title: 'Reuniões virtuais médias',
        description: 'Número típico de reuniões por videochamada numa semana.',
        value: (stats) => `${meetingsFormatter.format(stats.avgMeetings ?? 0)} / semana`,
      },
      {
        id: 'resourceAccess',
        title: 'Acesso a apoio psicológico',
        description: 'Colaboradores que referem ter recursos de saúde mental fornecidos pela empresa.',
        value: (stats) => percentFormatter.format(stats.resourceAccessShare ?? 0),
      },
    ],
    charts: {
      heading: 'Explore os resultados do inquérito',
      intro:
        'Três visualizações complementares revelam como contexto, localização e estilo de vida se relacionam com o bem-estar. Passe com o rato para ver contagens exactas.',
    },
    insights: [
      {
        emphasis: 'Compare os modelos de trabalho.',
        detail:
          'As barras empilhadas mostram se funções presenciais, híbridas ou totalmente remotas concentram mais stress.',
      },
      {
        emphasis: 'Observe disparidades regionais.',
        detail:
          'O gráfico de condições de saúde mental evidencia onde ansiedade, depressão ou burnout surgem com maior frequência.',
      },
      {
        emphasis: 'Equilibre carga e descanso.',
        detail:
          'O diagrama de dispersão ajuda a identificar quando longas jornadas coincidem com sono frágil, sobretudo em situações de elevado stress.',
      },
    ],
  },
  stressByLocation: {
    title: 'Níveis de stress por modelo de trabalho',
    description: 'Contagens empilhadas de colaboradores com stress baixo, médio ou elevado por modalidade laboral.',
    legend: stressLevels,
    tooltip: ({ location, level, count, percent }) =>
      `${location} — ${level}: ${formatCount(count)} pessoas (${percentFormatter.format((percent ?? 0) / 100)})`,
  },
  mentalHealthByRegion: {
    title: 'Condições de saúde mental por região',
    description: 'As barras empilhadas mostram a frequência de depressão, ansiedade e outras condições por região.',
    legend: mentalHealthConditions,
    tooltip: ({ region, condition, count, percent }) =>
      `${region} — ${condition}: ${formatCount(count)} pessoas (${percentFormatter.format((percent ?? 0) / 100)})`,
  },
  hoursVsSleep: {
    title: 'Horas trabalhadas vs. qualidade de sono',
    description:
      'Cada ponto representa um colaborador, com cor consoante o nível de stress. Um ligeiro desalinhamento evita sobreposição.',
    legend: stressLevels,
    tooltip: ({ employeeId, hoursWorked, sleepQualityLabel, stressLevelLabel }) =>
      `${employeeId}\nHoras por semana: ${decimalFormatter.format(
        hoursWorked ?? 0
      )}\nQualidade de sono: ${sleepQualityLabel}\nNível de stress: ${stressLevelLabel}`,
  },
  scatter: {
    title: 'Ritmo de reuniões, stress e carga horária',
    description:
      'A cor indica a modalidade de trabalho, o tamanho do círculo reflete o stress e o eixo vertical mostra o número de reuniões virtuais por semana.',
    filterLabel: 'Filtrar por localização de trabalho',
    legendHeading: 'Modalidade de trabalho',
    sizeLegendHeading: 'Nível de stress',
    filterOptions: {
      All: 'Todas as localizações',
      Remote: 'Remoto',
      Hybrid: 'Híbrido',
      Onsite: 'Presencial',
    },
    empty: 'Sem respostas com informação de reuniões e stress para apresentar.',
    tooltip: ({ employeeId, locationLabel, stressLabel, hoursWorked, virtualMeetings }) =>
      `<div class="chart-tooltip__title">${employeeId}</div>
       <div class="chart-tooltip__meta">${locationLabel}</div>
       <div class="chart-tooltip__meta">Stress: <strong>${stressLabel}</strong></div>
       <div class="chart-tooltip__meta">Horas por semana: <strong>${decimalFormatter.format(
         hoursWorked ?? 0
       )}</strong></div>
       <div class="chart-tooltip__meta">Reuniões virtuais: <strong>${meetingsFormatter.format(
         virtualMeetings ?? 0
       )}</strong></div>`,
  },
  workLifeBalanceLine: {
    title: 'Equilíbrio trabalho-vida por experiência',
    description:
      'Compare a classificação média de equilíbrio trabalho-vida entre pessoas com e sem acesso a recursos de saúde mental. Altere o eixo X para observar a tendência por idade ou anos de experiência.',
    toggleLabel: 'Selecionar eixo horizontal',
    xOptions: {
      age: 'Idade',
      experience: 'Anos de experiência',
    },
    yAxisLabel: 'Equilíbrio trabalho-vida médio',
    legendTitle: 'Acesso a saúde mental',
    legend: {
      yes: 'Com apoio de saúde mental',
      no: 'Sem apoio de saúde mental',
    },
    empty: 'Não existem dados de equilíbrio trabalho-vida para apresentar nestas definições.',
    ariaLabel: 'Gráfico de linhas que mostra equilíbrio trabalho-vida médio por idade ou experiência dividido por acesso a saúde mental',
    tooltip: ({ accessLabel, xLabel, xValue, average, count }) =>
      `<div class="chart-tooltip__title">${accessLabel}</div>
       <div class="chart-tooltip__meta">${xLabel}: <strong>${integerFormatter.format(xValue ?? 0)}</strong></div>
       <div class="chart-tooltip__meta">Equilíbrio médio: <strong>${decimalFormatter.format(average ?? 0)}</strong></div>
       <div class="chart-tooltip__meta">Respostas: <strong>${integerFormatter.format(count ?? 0)}</strong></div>`,
  },
  industryRadar: {
    title: 'Distribuição de funções por sector',
    description:
      'Escolha um sector para ver que funções predominam em cada modalidade de trabalho. Filtre para comparar equipas remotas, híbridas e presenciais.',
    sectorLabel: 'Selecionar sector',
    locationLabel: 'Filtrar por modalidade',
    legendTitle: 'Modalidade',
    empty: 'Selecione um sector com informação de funções para preencher o radar.',
    optionAllLocations: 'Todas as localizações',
    ringLabel: (value) => percentFormatter.format(Math.min(value ?? 0, 1)),
    tooltip: ({ role, locationLabel, share, total, count }) =>
      `<div class="chart-tooltip__title">${role}</div>
       <div class="chart-tooltip__meta">${locationLabel}</div>
       <div class="chart-tooltip__meta">Proporção: <strong>${percentFormatter.format(
         Math.min(share ?? 0, 1)
       )}</strong></div>
       <div class="chart-tooltip__meta">Respostas na modalidade: <strong>${formatCount(total)}</strong></div>
       <div class="chart-tooltip__meta">Funções estimadas: <strong>${formatCount(count)}</strong></div>`,
  },
  deepDive: {
    workLife: {
      heading: 'Equilíbrio trabalho-vida e apoio disponível',
      intro:
        'Veja como o acesso a recursos de saúde mental se relaciona com o equilíbrio trabalho-vida percebido em diferentes idades ou níveis de experiência.',
    },
    meeting: {
      heading: 'Carga de reuniões vs. stress',
      intro:
        'Visualize como horas semanais, stress e número de reuniões se relacionam em cada modalidade. Use as cores para comparar localizações e o tamanho do círculo para perceber calendários mais intensos.',
    },
    sector: {
      heading: 'Funções predominantes por sector',
      intro:
        'Escolha um sector para perceber que funções lideram em cada modelo de trabalho. Filtre por modalidade para identificar focos de especialização ou lacunas.',
    },
  },
  loading: 'A carregar respostas do inquérito…',
  error: 'Não foi possível carregar os dados. Tente novamente mais tarde.',
  footer:
    'Protótipo criado para a unidade de Visualização de Informação. Construído com React, Vite e d3.js para demonstrar uma abordagem centrada nas pessoas ao explorar o bem-estar em equipas distribuídas.',
}

export default pt
