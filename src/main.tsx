import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import { AppErrorBoundary } from './os/components/AppErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* デスクトップ本体のレンダーで致命的な例外が起きても真っ暗にならないようにする */}
    <AppErrorBoundary>
      {/* OS の「視差効果を減らす」設定時は Framer Motion のアニメを抑制（WCAG 2.3.3） */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </AppErrorBoundary>
  </StrictMode>,
)
