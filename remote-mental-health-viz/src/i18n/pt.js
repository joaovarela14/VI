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
    allIndustries: "Todos os sectores",
    satisfactionMap,
  },
  hero: {
    eyebrow: "Explorador da saúde mental no trabalho remoto",
    title: "Espaço modular de insights",
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
  stressLab: {
    eyebrow: "Laboratório interativo de stress",
    title: "Remoto vs Presencial",
    description:
      "Usa as horas trabalhadas, a carga de reuniões, a qualidade do sono e a distribuição por género para moldar as personas. Os avatares reagem ao dataset filtrado, mudando postura e cores de stress conforme o cenário.",
    modelsLabel: "Personas 3D a comparar remoto e presencial",
    remoteLabel: "Remoto / híbrido",
    onsiteLabel: "Presencial",
    context: {
      remote: {
        icon: "🏡",
        label: "Base em casa",
      },
      onsite: {
        icon: "🏢",
        label: "Piso de escritório",
      },
    },
    states: {
      calm: "Calmo",
      balanced: "Em alerta",
      strained: "Sobrecarregado",
    },
    panel: {
      title: "Ajusta a amostra",
      subtitle:
        "Interage com o laboratório de stress para explorar os estados remoto vs presencial.",
      reset: "Repor parâmetros",
      hours: {
        label: "Horas por semana",
        unit: "h/sem",
      },
      companySupport: {
        label: "Apoio da empresa",
        unit: "/5",
      },
      sleep: {
        label: "Qualidade do sono",
        labels: {
          Poor: "Mau",
          Average: "Razoável",
          Good: "Bom",
        },
      },
      gender: {
        label: "Foco de género",
        hint: "Marca as caixas para destacar identidades específicas. Sem seleção inclui todas as pessoas.",
      },
      differenceLabel: "Gap remoto vs presencial",
    },
    genderOptions: [
      {
        id: "female",
        label: "Feminino",
        matches: ["female"],
      },
      {
        id: "male",
        label: "Masculino",
        matches: ["male"],
      },
      {
        id: "nonbinary",
        label: "Não-binário",
        matches: ["non-binary"],
      },
      {
        id: "unspecified",
        label: "Sem especificar",
        matches: ["prefer not to say"],
      },
    ],
  },
  navigation: {
    label: "MIND@WORK",
    toggle: {
      open: "Mostrar navegação",
      close: "Esconder navegação",
    },
    tabs: [
      {
        id: "persona-model",
        label: "Modelos interativos",
        description:
          "Avatares SVG que reagem aos filtros do dataset, alterando expressões conforme o cenário.",
      },
      {
        id: "workload-dashboard",
        label: "Visão geral",
        description: "Distribuição global do stress e indicadores de saúde mental.",
        note: "Alterne entre visualizações de nível de stress e condição de saúde mental.",
      },
      {
        id: "workspace-influence",
        label: "Local de trabalho",
        description:
          "Insights sobre a mistura de modalidades ao combinar bolhas e cortes de isolamento social.",
        note: "Passe o rato sobre as bolhas e barras para informação detalhada e classificações.",
      },
      {
        id: "mental-health",
        label: "Saúde mental",
        description:
          "Tendências de acesso a apoio e o mapa de calor sono vs stress.",
        note: "Passe o rato sobre os gráficos para métricas detalhadas e número de respostas.",
      },
      {
        id: "documentation",
        label: "Documentação",
        description:
          "Notas do dataset, metodologia e mapa de variáveis.",
      },
    ],
  },
  documentation: {
    heading: "Documentação do dataset",
    intro:
      "O dataset Impact of Remote Work on Mental Health agrega respostas anonimizadas que descrevem carga de trabalho, estilo de vida e sinais de bem-estar entre profissionais remotos, híbridos e presenciais.",
    stats: [
      {
        id: "records",
        label: "Registos de colaboradores",
        value: (count) => {
          const value = count != null ? integerFormatter.format(count) : "—";
          return `${value} pessoas`;
        },
      },
      {
        id: "source",
        label: "Fonte",
        value: "Impact of Remote Work on Mental Health (Kaggle)",
      },
      {
        id: "format",
        label: "Formato",
        value: "CSV UTF-8, separado por vírgulas",
      },
    ],
    radarShowcase: {
      heading: "Spider chart: distribuição de funções por modalidade",
      intro:
        "Usa o radar para perceber que funções lideram em cada local de trabalho. Passa o rato pelo gráfico para ler proporções exatas antes de mergulhar nas notas qualitativas.",
    },
    sections: [],
  },
  datasetOverviewChart: {
    title: "Níveis de stress por região",
    conditionTitle: "Condições de saúde mental por região",
    description:
      "Começa com o panorama geral de como os níveis de stress se distribuem em cada região.",
    ariaLabel:
      "Gráfico de barras empilhadas com filtros onde se compara o stress por região",
    instructions:
      "Usa os dropdowns para filtrar o dataset e clica numa barra para mostrar as estatísticas contextuais ao lado.",
    empty: "Nenhum colaborador corresponde aos filtros seleccionados.",
    legend: stressLevels,
    filters: {
      ariaLabel: "Filtros do dataset",
      industry: "Filtrar por indústria",
      role: "Filtrar por função",
      location: "Filtrar por localização",
      allIndustries: "Todas as indústrias",
      allRoles: "Todas as funções",
      allLocations: "Todas as localizações",
    },
    modeLabel: "Métrica empilhada",
    modeOptions: {
      stress: "Nível de stress",
      condition: "Condição de saúde mental",
    },
    filtersLabel: "Filtros",
    tooltip: ({ region, categoryLabel, count, percentage }) =>
      `${region} — ${categoryLabel}: ${formatCount(
        count
      )} pessoas (${percentFormatter.format(
        Math.min(Math.max(percentage ?? 0, 0), 1)
      )})`,
    formatters: {
      count: (value) => formatCount(value ?? 0),
      decimal: (value) => decimalFormatter.format(value ?? 0),
      percent: (value) =>
        percentFormatter.format(Math.min(Math.max(value ?? 0, 0), 1)),
    },
    yAxisLabel: "Número de colaboradores",
    details: {
      overviewTitle: "Conjunto filtrado",
      overviewSubtitle: "Métricas para todas as pessoas nos filtros activos.",
      regionTitle: (region) => `Visão de ${region}`,
      regionSubtitle:
        "Métricas recalculadas apenas para a região seleccionada.",
      employees: "Colaboradores",
      productivity: "Alteração na produtividade",
      satisfaction: "Satisfação com o trabalho remoto",
      physicalActivity: "Actividade física",
      productivityUnavailable:
        "Sem respostas sobre produtividade para estes filtros.",
      satisfactionUnavailable:
        "Sem respostas de satisfação para estes filtros.",
      activityUnavailable:
        "Sem respostas de actividade física para estes filtros.",
      productivityLabels: {
        Increase: "Aumento",
        Decrease: "Queda",
        "No Change": "Sem alteração",
      },
      activityLabels: {
        Daily: "Diária",
        Weekly: "Semanal",
        None: "Sem actividade",
      },
      unknown: "Desconhecido",
    },
  },
  socialIsolationBar: {
    title: 'Isolamento social por continente',
    description:
      'Classificação média de isolamento social (1 = baixo, 5 = elevado) por continente. Refine por género e acesso a apoio psicológico.',
    hint: 'Passe o rato sobre as barras para classificações detalhadas',
    legendTitle: "Modalidade de trabalho",
    filters: {
      region: "Filtrar por continente",
      gender: "Filtrar por género",
      access: "Filtrar acesso a apoio",
      allRegions: "Todos os continentes",
      allGenders: "Todos os géneros",
      accessYes: "Com apoio",
      accessNo: "Sem apoio",
    },
    axisLabel: "Classificação média de isolamento",
    empty: "Sem respostas de isolamento social para estes filtros.",
    tooltip: ({ region, location, average, count }) =>
      `${region} — ${location}\nClassificação média: ${decimalFormatter.format(
        average ?? 0
      )}\nRespostas: ${integerFormatter.format(count ?? 0)}`,
  },
  sleepStressMatrix: {
    title: 'Qualidade do sono vs. stress',
    description:
      'O mapa de calor revela como a qualidade do sono varia consoante o nível de stress. Foque uma condição de saúde mental específica para identificar padrões distintos de descanso.',
    hint: 'Passe o rato sobre as células para ver número de respostas',
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
    legend: {
      unsatisfied: "Insatisfeitos",
      neutral: "Neutros",
      satisfied: "Satisfeitos",
    },
  },
  scatter: {
    title: 'Horas, local de trabalho e reuniões influenciam stress',
    description:
      'A cor codifica a modalidade, o tamanho das bolhas reflete o stress e o eixo vertical mostra as reuniões virtuais por semana.',
    hint: 'Passe o rato sobre as bolhas para informação detalhada',
    filterLabel: "Localização de trabalho",
    industryFilterLabel: "Filtrar por área",
    sampleFilterLabel: "Limite da amostra",
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
      All: "Todos os sectores",
    },
    sampleFilterOptions: {
      All: "Todos os pontos",
      200: "200",
      500: "500",
      1000: "1000",
      2000: "2000",
    },
    sampleFilterUnavailable:
      "Não existem respostas suficientes para este tamanho de amostra",
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
    title: 'Equilíbrio trabalho-vida por experiência / idade',
    description:
      'Compare a classificação média de equilíbrio trabalho-vida entre pessoas com e sem acesso a recursos de saúde mental. Altere o eixo X para observar a tendência por idade ou anos de experiência.',
    hint: 'Passe o rato sobre os pontos da linha para métricas completas',
    hint: 'Passe o rato sobre os pontos da linha para métricas completas',
    toggleLabel: "Selecionar eixo horizontal",
    xOptions: {
      age: "Idade",
      experience: "Anos de experiência",
    },
    yAxisLabel: "Equilíbrio trabalho-vida médio",
    legendTitle: "Acesso a saúde mental",
    legend: {
      yes: "Com acesso a apoio",
      no: "Sem acesso a apoio",
    },
    empty:
      "Não existem dados de equilíbrio trabalho-vida para apresentar com estas definições.",
    ariaLabel:
      "Gráfico de linhas que mostra o equilíbrio trabalho-vida médio por idade ou experiência, dividido pelo acesso a apoio psicológico",
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
       <div class="chart-tooltip__meta">Número de funções: <strong>${formatCount(
         count
       )}</strong></div>`,
  },
  dataLab: {
    heading: "Documentação do dataset",
    intro:
      "Explora todas as variáveis quantitativas e qualitativas disponíveis. Passa o rato sobre cada nome para consultar valores e intervalos presentes na amostra.",
    datasetOverview: {
      title: "Visão do inquérito",
      paragraphs: [
        "À medida que o trabalho remoto se torna a norma, é essencial compreender o impacto no bem-estar mental dos colaboradores. Este dataset mostra como o trabalho remoto afecta os níveis de stress, o equilíbrio trabalho-vida e as condições de saúde mental em múltiplos sectores e regiões.",
        "Com 5 000 registos recolhidos em todo o mundo, o dataset oferece pistas sobre modalidade de trabalho (remoto, híbrido, presencial), níveis de stress, acesso a recursos de saúde mental e satisfação laboral. Foi concebido para apoiar investigadores, equipas de RH e empresas a avaliar a influência crescente do trabalho remoto na produtividade e no bem-estar.",
      ],
      topics: [
        {
          title: "Escopo em resumo",
          description:
            "As respostas abrangem profissionais remotos, híbridos e presenciais, em várias indústrias e continentes, mantendo o foco em como o contexto molda os indicadores de bem-estar.",
        },
        {
          title: "Como os dados foram recolhidos",
          description:
            "O CSV compila um inquérito global e anónimo onde colaboradores reportaram stress, carga de trabalho, acesso a apoio e satisfação através de perguntas estruturadas.",
        },
        {
          title: "Controlos de qualidade",
          description:
            "Entradas sem campos críticos foram removidas e identificadores repetidos foram eliminados, deixando uma tabela consistente pronta para filtros e análise visual.",
        },
      ],
    },
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
        description:
          "Classificação autorrelatada de 1 (fraco) a 5 (excelente).",
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
  error: "Não foi possível carregar os dados. Tente novamente mais tarde. ",
  footer:
    "Projeto desenvolvido por João Varela e Carolina Prata para a unidade curricular de Visualização de Informação.",
};

export default pt
