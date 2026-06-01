import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WinTerminal } from './WinTerminal'

// jsdom は scrollIntoView 未実装のためスタブ
window.HTMLElement.prototype.scrollIntoView = vi.fn()

describe('WinTerminal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('起動時のウェルカムメッセージを表示する', () => {
    render(<WinTerminal />)
    expect(screen.getByText(/OMU\/OS terminal v1\.0/)).toBeTruthy()
  })

  it('プロンプトを表示する', () => {
    render(<WinTerminal />)
    expect(screen.getByText('omu@OMU/OS:~$')).toBeTruthy()
  })

  it('help コマンドでコマンド一覧を表示する', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'help{Enter}')
    expect(screen.getByText(/Available commands/)).toBeTruthy()
    expect(screen.getByText(/clear/)).toBeTruthy()
  })

  it('ls コマンドでファイル一覧を表示する', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'ls{Enter}')
    expect(screen.getByText(/about\.txt/)).toBeTruthy()
    expect(screen.getByText(/skills\.txt/)).toBeTruthy()
  })

  it('cat about.txt でプロフィール情報を表示する', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'cat about.txt{Enter}')
    expect(screen.getByText(/name/)).toBeTruthy()
    expect(screen.getByText(/title/)).toBeTruthy()
  })

  it('cat で存在しないファイルを指定するとエラーを表示する', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'cat notexist.txt{Enter}')
    expect(screen.getByText(/No such file/)).toBeTruthy()
  })

  it('whoami コマンドでユーザー情報を表示する', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'whoami{Enter}')
    expect(screen.getByText(/ooooomu/)).toBeTruthy()
  })

  it('存在しないコマンドで command not found を表示する', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'foobar{Enter}')
    expect(screen.getByText(/command not found/)).toBeTruthy()
  })

  it('clear コマンドで画面をクリアする', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'help{Enter}')
    expect(screen.getByText(/Available commands/)).toBeTruthy()
    await user.type(input, 'clear{Enter}')
    expect(screen.queryByText(/Available commands/)).toBeNull()
  })

  it('open コマンドで onOpen コールバックを呼ぶ', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<WinTerminal onOpen={onOpen} />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'open about{Enter}')
    expect(onOpen).toHaveBeenCalledWith('about')
  })

  it('↑キーでコマンド履歴を遡る', async () => {
    const user = userEvent.setup()
    render(<WinTerminal />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    await user.type(input, 'whoami{Enter}')
    await user.keyboard('{ArrowUp}')
    expect(input.value).toBe('whoami')
  })
})
