import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion'
import './index.css'
import App from './App'
import jetbrainsMonoLatin400 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url'
import spaceGroteskLatin400 from '@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2?url'

// 初回表示で確実に使われる欧文サブセット（本文既定ウェイト）のみ先読みする。
// Noto Sans JP は Google 側の unicode-range 分割ファイルが細かく、
// 実際に使う範囲を事前に断定できないため対象外（index.css の @font-face 側で遅延ロードされる）。
for (const href of [jetbrainsMonoLatin400, spaceGroteskLatin400]) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = 'font/woff2'
  link.href = href
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

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
