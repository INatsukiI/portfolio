import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WinContact } from './WinContact'

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText('お名前'), 'Taro')
  await user.type(screen.getByPlaceholderText('メールアドレス'), 'taro@example.com')
  await user.tab()
  await user.type(screen.getByPlaceholderText('メッセージを入力してください...'), 'Hello!')
}

describe('WinContact', () => {
  it('links セクションにリンクが表示される', () => {
    render(<WinContact />)
    expect(screen.getByText('github.com/INatsukiI')).toBeTruthy()
    expect(screen.getByText('x.com/ooooomuu')).toBeTruthy()
    // zenn は専用ウィンドウ（zenn.dev/）に分離したため contact には表示しない
    expect(screen.queryByText('zenn.dev/ooooomu')).toBeNull()
  })

  it('To フィールドにメールアドレスが表示される', () => {
    render(<WinContact />)
    expect(screen.getByText('n.omura5517@gmail.com')).toBeTruthy()
  })

  it('初期状態では MAIL APP / GMAIL ボタンが無効', () => {
    render(<WinContact />)
    expect(screen.getByRole('button', { name: /MAIL APP/i }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: /GMAIL/i }).hasAttribute('disabled')).toBe(true)
  })

  it('初期状態では「お名前を入力してください」が表示される', () => {
    render(<WinContact />)
    expect(screen.getByText(/お名前を入力してください/)).toBeTruthy()
  })

  it('名前入力後は「返信先のメールアドレスを入力してください」に変わる', async () => {
    const user = userEvent.setup()
    render(<WinContact />)
    await user.type(screen.getByPlaceholderText('お名前'), 'Taro')
    expect(screen.getByText(/返信先のメールアドレスを入力してください/)).toBeTruthy()
  })

  it('名前・メール入力後は「メッセージを入力してください」に変わる', async () => {
    const user = userEvent.setup()
    render(<WinContact />)
    await user.type(screen.getByPlaceholderText('お名前'), 'Taro')
    await user.type(screen.getByPlaceholderText('メールアドレス'), 'taro@example.com')
    expect(screen.getByText(/メッセージを入力してください/)).toBeTruthy()
  })

  it('おかしなメールアドレスを入力してフォーカスを外すとエラーが表示される', async () => {
    const user = userEvent.setup()
    render(<WinContact />)
    const emailInput = screen.getByPlaceholderText('メールアドレス')
    await user.type(emailInput, 'notanemail')
    await user.tab()
    expect(screen.getByText('✕ 有効なメールアドレスを入力してください')).toBeTruthy()
  })

  it('正しいメールアドレスを入力するとエラーが消える', async () => {
    const user = userEvent.setup()
    render(<WinContact />)
    const emailInput = screen.getByPlaceholderText('メールアドレス')
    // まず不正な値でエラーを出す
    await user.type(emailInput, 'bad')
    await user.tab()
    expect(screen.getByText('✕ 有効なメールアドレスを入力してください')).toBeTruthy()
    // 正しい値に修正するとエラーが消える
    await user.clear(emailInput)
    await user.type(emailInput, 'valid@example.com')
    expect(screen.queryByText('✕ 有効なメールアドレスを入力してください')).toBeNull()
  })

  it('全必須項目が揃うとボタンが有効になる', async () => {
    const user = userEvent.setup()
    render(<WinContact />)
    await fillValidForm(user)
    expect(screen.getByRole('button', { name: /MAIL APP/i }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: /GMAIL/i }).hasAttribute('disabled')).toBe(false)
  })

  describe('送信後のフィードバック', () => {
    let openSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      openSpy = vi.spyOn(window, 'open')
    })

    afterEach(() => {
      openSpy.mockRestore()
    })

    it('MAIL APP 押下後に「メールアプリを開きました」と表示される', async () => {
      openSpy.mockReturnValue(null)
      const user = userEvent.setup()
      render(<WinContact />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /MAIL APP/i }))
      expect(screen.getByRole('status').textContent).toContain('メールアプリを開きました')
    })

    it('GMAIL 押下でポップアップが開けた場合「Gmail を開きました」と表示される', async () => {
      openSpy.mockReturnValue(window)
      const user = userEvent.setup()
      render(<WinContact />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /GMAIL/i }))
      expect(screen.getByRole('status').textContent).toContain('Gmail を開きました')
    })

    it('GMAIL 押下でポップアップがブロックされた場合エラーメッセージが表示される', async () => {
      openSpy.mockReturnValue(null)
      const user = userEvent.setup()
      render(<WinContact />)
      await fillValidForm(user)
      await user.click(screen.getByRole('button', { name: /GMAIL/i }))
      expect(screen.getByRole('status').textContent).toContain('ポップアップがブロックされました')
    })
  })
})
