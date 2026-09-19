import { Component, Fragment } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { OS } from '../theme'
import { OSButton } from './ui/OSButton'

interface WindowErrorBoundaryProps {
  children: ReactNode
  /** フォールバック UI に表示するウィンドウタイトル（例: "profile.txt"） */
  title?: string
  /** 「閉じる」ボタン押下時にウィンドウを閉じる処理。省略時はボタンを表示しない */
  onClose?: () => void
}

interface WindowErrorBoundaryState {
  hasError: boolean
  /** 変更するたびに children を再マウントさせるためのキー */
  resetKey: number
}

/**
 * ウィンドウ単位で子コンポーネントの例外を捕捉する ErrorBoundary。
 * 1 つのウィンドウ内で throw されても他のウィンドウ・タスクバーには影響しない。
 */
export class WindowErrorBoundary extends Component<WindowErrorBoundaryProps, WindowErrorBoundaryState> {
  state: WindowErrorBoundaryState = { hasError: false, resetKey: 0 }

  static getDerivedStateFromError(): Partial<WindowErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[WindowErrorBoundary] ${this.props.title ?? 'unknown'} でエラーが発生しました`, error, errorInfo.componentStack)
  }

  handleReload = () => {
    // resetKey を変えて children を再マウントし、hasError を解除する
    this.setState(s => ({ hasError: false, resetKey: s.resetKey + 1 }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 py-10 px-6 text-center font-mono"
        >
          <AlertTriangle size={40} strokeWidth={1.5} color={OS.red} aria-hidden="true" />
          <div>
            <p className="m-0 text-sm font-bold tracking-wide" style={{ color: OS.red }}>
              // SEGMENTATION FAULT
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: OS.inkSoft }}>
              {this.props.title ? `${this.props.title} ` : ''}このウィンドウでエラーが発生しました
            </p>
          </div>
          <div className="flex gap-2">
            <OSButton primary onClick={this.handleReload}>再読込</OSButton>
            {this.props.onClose ? <OSButton onClick={this.props.onClose}>閉じる</OSButton> : null}
          </div>
        </div>
      )
    }
    // Fragment に key を付け、resetKey が変わるたびに children を丸ごと再マウントする
    return <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
  }
}
