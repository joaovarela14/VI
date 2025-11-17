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

const industries = {
  Consulting: 'Consultoria',
  Education: 'Educação',
  Finance: 'Finanças',
  Healthcare: 'Saúde',
  IT: 'Tecnologia',
  Manufacturing: 'Indústria',
  Retail: 'Retalho',
}

const mentalHealthConditions = {
  Anxiety: 'Ansiedade',
  Depression: 'Depressão',
  Burnout: 'Burnout',
  'No condition': 'Sem condição reportada',
  Other: 'Outra',
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

const pt = {
  common: {
    stressLevels,
    workLocations,
    sleepQuality,
    industries,
    conditions: mentalHealthConditions,
    mentalHealthAccess: {
      yes: "Sim",
      no: "Não",
    },
    allLocations: "Todas as localizações",
    allIndustries: "Todas as áreas",
    satisfactionMap,
  },
  hero: {
    eyebrow: "Explorador da saúde mental em trabalho remoto",
    title: "Como os modelos híbridos moldam o bem-estar das equipas",
    lead: "Este painel resume um inquérito sintético sobre a experiência de profissionais em trabalho remoto. Explore níveis de stress, diferenças regionais nas condições de saúde mental e a relação entre horas trabalhadas e qualidade do sono.",
    meta: {
      datasetSize: (count) => {
        const value = count != null ? integerFormatter.format(count) : "—";
        return `Dimensão do inquérito: ${value} colaboradores`;
      },
      source: "Fonte: Impact of Remote Work on Mental Health",
    },
    tablistLabel: "Vistas do painel",
    tabs: [
      {
        id: "data-lab",
        label: "Estúdio imersivo",
        description:
          "Antecipe experiências 3D e consulte todas as variáveis disponíveis.",
      },
      {
        id: "overview",
        label: "História geral",
        description:
          "Destaca carga de trabalho, stress e apoio disponível de forma imediata.",
      },
      {
        id: "deep-dive",
        label: "Laboratório de padrões",
        description:
          "Analise reuniões semanais e a mistura sectorial por função e localização.",
      },
    ],
    buttons: {
      theme: {
        light: "Mudar para modo claro",
        dark: "Mudar para modo escuro",
        aria: "Alternar entre modo claro e escuro",
      },
      language: {
        toEnglish: "Mudar para Inglês",
        toPortuguese: "Mudar para Português",
        aria: "Alterar idioma",
      },
    },
  },
  overview: {
    heading: "Em destaque",
    intro:
      "Os indicadores principais dão contexto antes de explorar as visualizações. Mostram carga de trabalho, ritmo de reuniões, acesso a apoio e a proporção de pessoas em equilíbrio ou em dificuldade.",
    highlightsTitle: "Pontos de atenção",
    metrics: [
      {
        id: "avgHours",
        title: "Horas semanais médias",
        description:
          "Carga típica reportada pelos participantes ao longo da semana.",
        value: (stats) => `${decimalFormatter.format(stats.avgHours ?? 0)} h`,
      },
      {
        id: "highStress",
        title: "Prevalência de stress elevado",
        description:
          "Percentagem de pessoas que descrevem o seu nível de stress como elevado.",
        value: (stats) => percentFormatter.format(stats.highStressShare ?? 0),
      },
      {
        id: "satisfiedShare",
        title: "Satisfação com trabalho remoto",
        description:
          "Colaboradores que demonstram satisfação com o trabalho remoto.",
        value: (stats) => percentFormatter.format(stats.satisfiedShare ?? 0),
      },
      {
        id: "avgMeetings",
        title: "Reuniões virtuais médias",
        description: "Número típico de reuniões por videochamada numa semana.",
        value: (stats) =>
          `${meetingsFormatter.format(stats.avgMeetings ?? 0)} / semana`,
      },
      {
        id: "resourceAccess",
        title: "Acesso a apoio psicológico",
        description:
          "Colaboradores que referem ter recursos de saúde mental fornecidos pela empresa.",
        value: (stats) =>
          percentFormatter.format(stats.resourceAccessShare ?? 0),
      },
    ],
    charts: {
      heading: "Explore os resultados do inquérito",
      intro:
        "Três visualizações complementares revelam como contexto, localização e estilo de vida se relacionam com o bem-estar. Passe com o rato para ver contagens exactas.",
    },
    insights: [
      {
        emphasis: "Compare os modelos de trabalho.",
        detail:
          "As barras empilhadas mostram se funções presenciais, híbridas ou totalmente remotas concentram mais stress.",
      },
      {
        emphasis: "Observe disparidades regionais.",
        detail:
          "O gráfico de condições de saúde mental evidencia onde ansiedade, depressão ou burnout surgem com maior frequência.",
      },
      {
        emphasis: "Equilibre carga e descanso.",
        detail:
          "O diagrama de dispersão ajuda a identificar quando longas jornadas coincidem com sono frágil, sobretudo em situações de elevado stress.",
      },
    ],
  },
  stressByLocation: {
    title: "Níveis de stress por modelo de trabalho",
    description:
      "Contagens empilhadas de colaboradores com stress baixo, médio ou elevado por modalidade laboral.",
    legend: stressLevels,
    tooltip: ({ location, level, count, percent }) =>
      `${location} — ${level}: ${formatCount(
        count
      )} pessoas (${percentFormatter.format((percent ?? 0) / 100)})`,
  },
  mentalHealthByRegion: {
    title: "Condições de saúde mental por região",
    description:
      "As barras empilhadas mostram a frequência de depressão, ansiedade e outras condições por região.",
    legend: mentalHealthConditions,
    tooltip: ({ region, condition, count, percent }) =>
      `${region} — ${condition}: ${formatCount(
        count
      )} pessoas (${percentFormatter.format((percent ?? 0) / 100)})`,
  },
  hoursVsSleep: {
    title: "Horas trabalhadas vs. qualidade de sono",
    description:
      "Cada ponto representa um colaborador, com cor consoante o nível de stress. Um ligeiro desalinhamento evita sobreposição.",
    legend: stressLevels,
    tooltip: ({
      employeeId,
      hoursWorked,
      sleepQualityLabel,
      stressLevelLabel,
    }) =>
      `${employeeId}\nHoras por semana: ${decimalFormatter.format(
        hoursWorked ?? 0
      )}\nQualidade de sono: ${sleepQualityLabel}\nNível de stress: ${stressLevelLabel}`,
  },
  socialIsolationBar: {
    title: "Isolamento social por continente",
    description:
      "Classificação média de isolamento social (1 = baixo, 5 = elevado) por continente. Refine por género e acesso a apoio psicológico.",
    filters: {
      region: "Filtrar por continente",
      gender: "Filtrar por género",
      access: "Filtrar por acesso a apoio",
      allRegions: "Todos os continentes",
      allGenders: "Todos os géneros",
      allAccess: "Todos os níveis de acesso",
      accessYes: "Com apoio",
      accessNo: "Sem apoio",
    },
    axisLabel: "Classificação média de isolamento",
    empty: "Sem respostas de isolamento social para estes filtros.",
    tooltip: ({ region, average, count }) =>
      `${region}\nClassificação média: ${decimalFormatter.format(
        average ?? 0
      )}\nRespostas: ${integerFormatter.format(count ?? 0)}`,
  },
  conditionActivityStress: {
    title: "Stress por condição de saúde mental",
    description:
      "As barras empilhadas mostram a frequência de cada nível de stress para cada condição de saúde mental. Filtre pela frequência de atividade física para perceber como o desporto se relaciona com a pressão.",
    filters: {
      activity: "Filtrar por atividade física",
      allActivities: "Todas as frequências",
    },
    axis: {
      y: "Colaboradores",
    },
    empty: "Sem respostas para esta combinação de atividade física.",
    tooltip: ({ condition, stressLabel, count, percent }) =>
      `${condition} — ${stressLabel}\nPessoas: ${formatCount(
        count
      )}\nPercentagem: ${percentFormatter.format((percent ?? 0) / 100)}`,
  },
  sleepStressMatrix: {
    title: "Qualidade do sono vs. stress",
    description:
      "O mapa de calor revela como a qualidade do sono varia consoante o nível de stress. Foque uma condição de saúde mental específica para identificar padrões distintos de descanso.",
    filters: {
      condition: "Filtrar por condição de saúde mental",
      allConditions: "Todas as condições",
    },
    axisLabel: "Pessoas",
    xAxisLabel: "Qualidade do sono",
    yAxisLabel: "Nível de stress",
    empty: "Sem dados de sono para a condição selecionada.",
    tooltip: ({ stressLabel, sleepLabel, count }) =>
      `${stressLabel} — ${sleepLabel}\nPessoas: ${formatCount(count)}`,
  },
  satisfactionPie: {
    title: "Satisfação com trabalho remoto",
    description:
      "Acompanhe como os colaboradores avaliam o trabalho remoto. Filtre por sector ou região para revelar diferenças de sentimento.",
    ariaLabel:
      "Gráfico circular que mostra a repartição da satisfação com trabalho remoto filtrada por sector ou região",
    legendTitle: "Nível de satisfação",
    legend: {
      unsatisfied: "Insatisfeitos",
      neutral: "Neutros",
      satisfied: "Satisfeitos",
    },
    filters: {
      sector: "Filtrar por sector",
      region: "Filtrar por região",
      allSectors: "Todos os sectores",
      allRegions: "Todas as regiões",
    },
    empty: "Sem respostas para estas combinações de filtros.",
    tooltip: ({ label, count, percentage }) =>
      `${label}: ${formatCount(count)} pessoas (${percentFormatter.format(
        (percentage ?? 0) / 100
      )})`,
  },
  scatter: {
    title: "Ritmo de reuniões, stress e carga horária",
    description:
      "A cor indica a modalidade de trabalho, o tamanho do círculo reflete o stress e o eixo vertical mostra o número de reuniões virtuais por semana.",
    filterLabel: "Filtrar por localização de trabalho",
    industryFilterLabel: "Filtrar por área de trabalho",
    sampleFilterLabel: "Limitar amostra aleatória",
    legendHeading: "Modalidade de trabalho",
    sizeLegendHeading: "Nível de stress",
    xAxisLabel: "Horas trabalhadas por semana",
    yAxisLabel: "Reuniões virtuais por semana",
    filterOptions: {
      All: "Todas as localizações",
      Remote: "Remoto",
      Hybrid: "Híbrido",
      Onsite: "Presencial",
    },
    industryFilterOptions: {
      All: "Todas as áreas",
    },
    sampleFilterOptions: {
      All: "Mostrar todos os pontos",
      200: "Amostra aleatória (até 200)",
      500: "Amostra aleatória (até 500)",
      1000: "Amostra aleatória (até 1 000)",
      2000: "Amostra aleatória (até 2 000)",
      5000: "Amostra aleatória (até 5 000)",
    },
    sampleFilterUnavailable: "Sem respostas suficientes para este tamanho de amostra",
    empty: "Sem respostas com informação de reuniões e stress para apresentar.",
    tooltip: ({
      employeeId,
      locationLabel,
      stressLabel,
      hoursWorked,
      virtualMeetings,
    }) =>
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
    title: "Equilíbrio trabalho-vida por experiência",
    description:
      "Compare a classificação média de equilíbrio trabalho-vida entre pessoas com e sem acesso a recursos de saúde mental. Altere o eixo X para observar a tendência por idade ou anos de experiência.",
    toggleLabel: "Selecionar eixo horizontal",
    xOptions: {
      age: "Idade",
      experience: "Anos de experiência",
    },
    yAxisLabel: "Equilíbrio trabalho-vida médio",
    legendTitle: "Acesso a saúde mental",
    legend: {
      yes: "Com apoio de saúde mental",
      no: "Sem apoio de saúde mental",
    },
    empty:
      "Não existem dados de equilíbrio trabalho-vida para apresentar nestas definições.",
    ariaLabel:
      "Gráfico de linhas que mostra equilíbrio trabalho-vida médio por idade ou experiência dividido por acesso a saúde mental",
    tooltip: ({ accessLabel, xLabel, xValue, average, count }) =>
      `<div class="chart-tooltip__title">${accessLabel}</div>
       <div class="chart-tooltip__meta">${xLabel}: <strong>${integerFormatter.format(
        xValue ?? 0
      )}</strong></div>
       <div class="chart-tooltip__meta">Equilíbrio médio: <strong>${decimalFormatter.format(
         average ?? 0
       )}</strong></div>
       <div class="chart-tooltip__meta">Respostas: <strong>${integerFormatter.format(
         count ?? 0
       )}</strong></div>`,
  },
  industryRadar: {
    title: "Distribuição de funções por sector",
    description:
      "Escolha um sector para ver que funções predominam em cada modalidade de trabalho. Filtre para comparar equipas remotas, híbridas e presenciais.",
    sectorLabel: "Selecionar sector",
    locationLabel: "Filtrar por modalidade",
    legendTitle: "Modalidade",
    empty:
      "Selecione um sector com informação de funções para preencher o radar.",
    optionAllLocations: "Todas as localizações",
    ringLabel: (value) => percentFormatter.format(Math.min(value ?? 0, 1)),
    tooltip: ({ role, locationLabel, share, total, count }) =>
      `<div class="chart-tooltip__title">${role}</div>
       <div class="chart-tooltip__meta">${locationLabel}</div>
       <div class="chart-tooltip__meta">Proporção: <strong>${percentFormatter.format(
         Math.min(share ?? 0, 1)
       )}</strong></div>
       <div class="chart-tooltip__meta">Respostas na modalidade: <strong>${formatCount(
         total
       )}</strong></div>
       <div class="chart-tooltip__meta">Funções estimadas: <strong>${formatCount(
         count
       )}</strong></div>`,
  },
  deepDive: {
    workLife: {
      heading: "Equilíbrio trabalho-vida e apoio disponível",
      intro:
        "Veja como o acesso a recursos de saúde mental se relaciona com o equilíbrio trabalho-vida percebido em diferentes idades ou níveis de experiência.",
    },
    meeting: {
      heading: "Carga de reuniões vs. stress",
      intro:
        "Visualize como horas semanais, stress e número de reuniões se relacionam em cada modalidade. Use as cores para comparar localizações e o tamanho do círculo para perceber calendários mais intensos.",
    },
    socialIsolation: {
      heading: "Intensidade de isolamento por continente",
      intro:
        "Compare a classificação média de isolamento social entre continentes e aplique filtros por género ou acesso a apoio psicológico para identificar grupos vulneráveis.",
    },
    conditionStress: {
      heading: "Mistura de stress por condição e atividade",
      intro:
        "Observe como os níveis de stress variam entre ansiedade, depressão, burnout ou outras condições. Ajuste o filtro de atividade física para descobrir rotinas associadas a menor pressão.",
    },
    sleepStress: {
      heading: "Padrões de descanso sob stress",
      intro:
        "Use o mapa de calor para estudar como a qualidade do sono muda em cada nível de stress e foque uma condição específica para perceber onde o descanso degrada mais.",
    },
    satisfaction: {
      heading: "Satisfação filtrada por contexto",
      intro:
        "Aplique filtros de sector ou região para perceber onde o trabalho remoto é visto com mais entusiasmo ou frustração. Passe o rato no gráfico circular para ver contagens e percentagens exactas.",
    },
    sector: {
      heading: "Funções predominantes por sector",
      intro:
        "Escolha um sector para perceber que funções lideram em cada modelo de trabalho. Filtre por modalidade para identificar focos de especialização ou lacunas.",
    },
  },
  dataLab: {
    heading: "Mapa das variáveis",
    intro:
      "Enquanto preparamos os modelos 3D interativos, explore todas as variáveis quantitativas e qualitativas disponíveis. Esta lista ajuda a planear que sinais irá ligar aos futuros protótipos.",
    quantitativeHeading: "Variáveis quantitativas",
    qualitativeHeading: "Variáveis qualitativas",
    quantitative: [
      {
        id: "age",
        name: "Age",
        type: "Integer",
        description: "Idade em anos.",
      },
      {
        id: "experience",
        name: "Years_of_Experience",
        type: "Integer",
        description: "Total de anos de experiência profissional.",
      },
      {
        id: "hours",
        name: "Hours_Worked_Per_Week",
        type: "Integer",
        description: "Horas semanais dedicadas ao trabalho.",
      },
      {
        id: "meetings",
        name: "Number_of_Virtual_Meetings",
        type: "Integer",
        description: "Reuniões virtuais por semana.",
      },
      {
        id: "balance",
        name: "Work_Life_Balance_Rating",
        type: "Integer",
        description: "Classificação autorrelatada de 1 (fraco) a 5 (excelente).",
      },
      {
        id: "isolation",
        name: "Social_Isolation_Rating",
        type: "Integer",
        description: "Pontuação de isolamento percebido de 1 a 5.",
      },
      {
        id: "companySupport",
        name: "Company_Support_for_Remote_Work",
        type: "Integer",
        description: "Avaliação de suporte de 1 (baixo) a 5 (alto).",
      },
    ],
    qualitative: [
      {
        id: "stress",
        name: "Stress_Level",
        type: "String",
        description: "Intensidade de stress autorrelatada.",
      },
      {
        id: "gender",
        name: "Gender",
        type: "String",
        description: "Identidade de género do participante.",
      },
      {
        id: "role",
        name: "Job_Role",
        type: "String",
        description: "Função profissional declarada.",
      },
      {
        id: "industry",
        name: "Industry",
        type: "String",
        description: "Sector de atuação.",
      },
      {
        id: "location",
        name: "Work_Location",
        type: "String",
        description: "Modalidade remota, híbrida ou presencial.",
      },
      {
        id: "condition",
        name: "Mental_Health_Condition",
        type: "String",
        description: "Condição de saúde mental mencionada.",
      },
      {
        id: "access",
        name: "Access_to_Mental_Health_Resources",
        type: "String",
        description: "Indica se a empresa fornece recursos de saúde mental.",
      },
      {
        id: "productivity",
        name: "Productivity_Change",
        type: "String",
        description: "Perceção de variação de produtividade.",
      },
      {
        id: "satisfaction",
        name: "Satisfaction_with_Remote_Work",
        type: "String",
        description: "Sentimento relativamente ao trabalho remoto.",
      },
      {
        id: "activity",
        name: "Physical_Activity",
        type: "String",
        description: "Frequência de atividade física.",
      },
      {
        id: "sleep",
        name: "Sleep_Quality",
        type: "String",
        description: "Classificação da qualidade do sono.",
      },
      {
        id: "region",
        name: "Region",
        type: "String",
        description: "Região geográfica.",
      },
    ],
  },
  loading: "A carregar respostas do inquérito…",
  error: "Não foi possível carregar os dados. Tente novamente mais tarde.",
  footer:
    "Projeto desenvolvido por João Varela e Carolina Prata para a unidade curricular de Visualização de Informação.",
};

export default pt
