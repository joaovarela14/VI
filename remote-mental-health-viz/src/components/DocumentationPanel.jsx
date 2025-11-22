const DocumentationPanel = ({ copy, datasetCount }) => {
  if (!copy) return null

  const stats = copy.stats ?? []
  const sections = copy.sections ?? []

  const renderStatValue = (stat) => {
    if (typeof stat.value === 'function') {
      return stat.value(datasetCount)
    }
    return stat.value
  }

  return (
    <section className="section section--wide">
      <h2>{copy.heading}</h2>
      {copy.intro && <p className="section__intro">{copy.intro}</p>}

      {stats.length > 0 && (
        <div className="documentation-meta">
          {stats.map((stat) => (
            <div key={stat.id} className="documentation-meta__card">
              <p className="documentation-meta__label">{stat.label}</p>
              <p className="documentation-meta__value">{renderStatValue(stat)}</p>
            </div>
          ))}
        </div>
      )}

      {sections.map((section) => (
        <div key={section.id ?? section.title} className="documentation-section">
          <h3>{section.title}</h3>
          {section.body && <p>{section.body}</p>}
          {section.items?.length > 0 && (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  )
}

export default DocumentationPanel
