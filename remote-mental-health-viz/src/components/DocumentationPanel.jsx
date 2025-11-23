const DocumentationPanel = ({ copy, datasetCount }) => {
  if (!copy) return null

  const sections = copy.sections ?? []

  return (
    <section className="section section--wide">

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
