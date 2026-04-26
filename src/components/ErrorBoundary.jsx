import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled application error:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="app-shell app-shell--centered">
        <section className="loading-card error-boundary-card">
          <p className="section-kicker">Something Went Wrong</p>
          <h2>The finance desk hit an unexpected error.</h2>
          <p className="muted-copy">
            The page can be refreshed safely. Existing saved records are still kept in storage.
          </p>
          <div className="editor-actions editor-actions--wide">
            <button type="button" onClick={this.handleReload}>
              Reload App
            </button>
          </div>
        </section>
      </div>
    )
  }
}
