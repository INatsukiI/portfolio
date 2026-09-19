import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { OS } from '../theme'
import { OSButton } from './ui/OSButton'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

/**
 * アプリ全体を覆うトップレベル ErrorBoundary。
 * WindowErrorBoundary で捕捉しきれない致命的なエラー（デスクトップ本体のレンダー失敗など）が
 * 発生した場合に、真っ白/真っ黒な画面ではなくブランド付きの復旧画面を表示する。
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): Partial<AppErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] OMU/OS で致命的なエラーが発生しました', error, errorInfo.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center font-mono"
          style={{ background: OS.desktopDark, color: OS.chromeFg }}
        >
          <div
            className="text-3xl font-bold tracking-[0.3em]"
            style={{ color: OS.accent, textShadow: '0 0 40px rgba(0,212,255,0.5)' }}
          >
            OMU/OS
          </div>
          <AlertTriangle size={40} strokeWidth={1.5} color={OS.red} aria-hidden="true" />
          <div>
            <p className="m-0 text-sm font-bold tracking-wide" style={{ color: OS.red }}>
              // KERNEL PANIC
            </p>
            <p className="m-0 mt-2 max-w-md text-sm" style={{ color: OS.inkSoft }}>
              予期しないエラーが発生し、OMU/OS を継続できませんでした。再読み込みしてください。
            </p>
          </div>
          <OSButton primary onClick={this.handleReload}>再読み込み</OSButton>
        </div>
      )
    }
    return this.props.children
  }
}
