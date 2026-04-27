import Icon from './Icon'

function formatActivityTime(timestamp) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export default function ActivityFeed({ activities = [] }) {
  return (
    <section className="content-card content-card--ledger">
      <div className="section-heading compact-heading">
        <div>
          <p className="section-kicker">Activity</p>
          <h3>Recent</h3>
        </div>
        <span className="pill activity-pill">
          <Icon name="activity" size={14} />
          {activities.length}
        </span>
      </div>

      {activities.length ? (
        <div className="activity-list">
          {activities.map((activity) => (
            <article key={activity.id} className="activity-item">
              <div className="activity-icon-wrap">
                <Icon name="activity" size={16} />
              </div>
              <div>
                <strong>{activity.message}</strong>
                <p>{formatActivityTime(activity.createdAt)}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state compact-empty-state">
          <h3>No activity</h3>
          <p>Actions will appear here</p>
        </div>
      )}
    </section>
  )
}
