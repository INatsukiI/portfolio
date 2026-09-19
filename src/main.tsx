import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* OS の「視差効果を減らす」設定時は Framer Motion のアニメを抑制（WCAG 2.3.3） */}
    {/* motion コンポーネントは軽量な m + LazyMotion（domAnimation のみ）に絞り、
        drag/layout などここで使わない機能をバンドルから外す */}
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <App />
      </LazyMotion>
    </MotionConfig>
  </StrictMode>,
)
