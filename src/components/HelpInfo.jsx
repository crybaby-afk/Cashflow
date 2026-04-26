export default function HelpInfo() {
  return (
    <aside className="help-info" aria-label="Cashbook help information">
      <div className="help-info__header">
        <h3>How to Use the Cashbook</h3>
      </div>
      <div className="help-info__content">
        <article className="help-item">
          <h4>Recording Money In</h4>
          <p>
            Use the "Add Entry" page to record fees payments, donations, grants, or any other
            money received by the school. Select "Money In" as the transaction type.
          </p>
        </article>
        <article className="help-item">
          <h4>Recording Money Out</h4>
          <p>
            Record school expenses like supplies, utilities, maintenance, or staff payments.
            Select "Money Out" as the transaction type.
          </p>
        </article>
        <article className="help-item">
          <h4>Understanding the Balance</h4>
          <p>
            The closing balance follows the cashbook rule: <strong>Opening Balance + Money In - Money Out = Closing Balance</strong>
          </p>
        </article>
        <article className="help-item">
          <h4>Opening Balance</h4>
          <p>
            Set your opening balance in Settings. This is the starting amount before any
            transactions for the current period. Update it when starting a new term or year.
          </p>
        </article>
        <article className="help-item">
          <h4>Searching & Filtering</h4>
          <p>
            Use the search bar on the Cashbook page to find specific transactions by
            category, note, amount, or date. Use the filter chips to show only money in or
            money out.
          </p>
        </article>
      </div>
    </aside>
  )
}