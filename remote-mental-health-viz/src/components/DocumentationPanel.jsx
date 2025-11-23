const DocumentationPanel = ({ copy }) => {
  if (!copy) return null

  const sections = copy.sections ?? []

  return (
    <section className="section section--wide documentation-variables">
      {sections.length > 0 && (
        <div className="documentation-variables__grid">
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
        </div>
      )}
    </section>
  )
}

export default DocumentationPanel
