const OverviewMetrics = ({ metrics = [], stats }) => (
  <div className="metrics-row">
    {metrics.map((metric) => (
      <article key={metric.id} className="metric-card">
        <h3>{metric.title}</h3>
        <p className="metric-card__value">{metric.value(stats)}</p>
        <p className="metric-card__description">{metric.description}</p>
      </article>
    ))}
  </div>
)

export default OverviewMetrics
