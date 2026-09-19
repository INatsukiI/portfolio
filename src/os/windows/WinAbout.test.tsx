import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WinAbout } from './WinAbout'
import { PROFILE } from '../../profile'

describe('WinAbout', () => {
  it('プロフィール名と肩書きが表示される', () => {
    render(<WinAbout />)
    expect(screen.getByText(PROFILE.name)).toBeTruthy()
    expect(screen.getByText(PROFILE.title, { exact: false })).toBeTruthy()
  })

  it('アバター画像が遅延読み込み・非同期デコードで表示される', () => {
    render(<WinAbout />)
    const img = screen.getByAltText(`${PROFILE.name} のアバター`) as HTMLImageElement
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('decoding')).toBe('async')
    expect(img.width).toBe(88)
    expect(img.height).toBe(88)
  })

  it('アバター画像が WebP で 1x/2x を出し分ける', () => {
    render(<WinAbout />)
    const img = screen.getByAltText(`${PROFILE.name} のアバター`) as HTMLImageElement
    expect(img.src).toContain('avatar-88.webp')
    expect(img.srcset).toContain('avatar-88.webp 1x')
    expect(img.srcset).toContain('avatar-176.webp 2x')
  })
})
