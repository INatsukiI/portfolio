import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WinProjects } from './WinProjects'

describe('WinProjects', () => {
  it('セクションヘッダーを表示する', () => {
    render(<WinProjects />)
    expect(screen.getByText('projects/')).toBeTruthy()
  })

  it('プロジェクト名を表示する', () => {
    render(<WinProjects />)
    expect(screen.getByText('OMU/OS')).toBeTruthy()
  })

  it('LIVE ステータスバッジを表示する', () => {
    render(<WinProjects />)
    expect(screen.getByText('LIVE')).toBeTruthy()
  })

  it('技術タグを表示する', () => {
    render(<WinProjects />)
    expect(screen.getByText('React')).toBeTruthy()
    expect(screen.getByText('TypeScript')).toBeTruthy()
  })

  it('GitHub リンクを表示する', () => {
    render(<WinProjects />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://github.com/INatsukiI/portfolio')
    expect(link.getAttribute('target')).toBe('_blank')
  })
})
