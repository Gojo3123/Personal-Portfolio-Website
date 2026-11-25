import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/** Catches render errors anywhere in the tree and shows a friendly recovery screen. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong' }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center text-white">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Something unexpected happened</h1>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            An error interrupted this page. Your data is safe — try reloading or going back.
          </p>
          <p className="mt-2 max-w-md rounded-lg bg-white/5 px-3 py-2 font-mono text-xs text-slate-500">
            {this.state.message}
          </p>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="gradient-bg flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              <RefreshCw className="h-4 w-4" /> Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
