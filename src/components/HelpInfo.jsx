export default function HelpInfo() {
  return (
    <aside className="help-info" aria-label="Cashbook help information">
      <div className="help-info__header">
        <h3>Quick Guide</h3>
      </div>
      <div className="help-info__content">
        <article className="help-item">
          <h4>Add Entry</h4>
          <p>Use "Add Entry" to record money in (fees, donations) or out (expenses).</p>
        </article>
        <article className="help-item">
          <h4>Balance</h4>
          <p>Formula: Opening + In - Out = Balance</p>
        </article>
        <article className="help-item">
          <h4>Search</h4>
          <p>Use the search bar to find transactions by category, note, amount, or date.</p>
        </article>
        <article className="help-item">
          <h4>Opening Balance</h4>
          <p>Set in Settings. Update when starting a new term or year.</p>
        </article>
      </div>
    </aside>
  )
}