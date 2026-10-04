import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

import { buttonClass } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Last line of defence for render errors. Keeps a white screen from ever
 * reaching a visitor and offers a recovery path that does not require a
 * deploy — useful when a CMS document contains a malformed field.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[agency] Unhandled render error:', error, info.componentStack)
  }

  private reset = () => this.setState({ error: null })

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 py-20">
        <div className="panel w-full max-w-xl p-8 text-center sm:p-12">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="display text-display-xs">Something broke on our side</h1>
          <p className="lede mx-auto mt-4 max-w-md text-sm">
            This page failed to render. Trying again usually fixes it — if it does not, the content in the admin
            dashboard may need a quick check.
          </p>
          <pre className="mt-6 max-h-32 overflow-auto rounded-xl border border-white/10 bg-ink-900 p-4 text-left font-mono text-xs text-red-200/90">
            {error.message}
          </pre>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" className={buttonClass('primary', 'md')} onClick={this.reset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <a href="/" className={buttonClass('outline-light', 'md')}>
              Back to home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
