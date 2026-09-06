import { useEffect, useId, useRef, useState } from 'react'
import { GitFork, AtSign, ExternalLink, Send, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// contact[].key → lucide アイコンのマッピング
const LINK_ICON: Record<string, LucideIcon> = {
  gh: GitFork,
  x:  AtSign,
}

const FIELD_CLASS = 'h-9 font-mono'

export function WinContact() {
  const { contact, email } = PROFILE

  const nameId    = useId()
  const emailId   = useId()
  const emailErrId = useId()
  const subjectId = useId()
  const bodyId    = useId()

  const [fromName,   setFromName]   = useState('')
  const [fromEmail,  setFromEmail]  = useState('')
  const [emailError, setEmailError] = useState(false)
  const [subject,    setSubject]    = useState('')
  const [body,       setBody]       = useState('')
  const [feedback, setFeedback] = useState<{ text: string; kind: 'success' | 'error' } | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
  }, [])

  const showFeedback = (text: string, kind: 'success' | 'error') => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedback({ text, kind })
    feedbackTimer.current = setTimeout(() => setFeedback(null), 4000)
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleEmailChange = (val: string) => {
    setFromEmail(val)
    if (emailError && EMAIL_RE.test(val)) setEmailError(false)
  }

  const handleEmailBlur = () => {
    if (fromEmail.trim() !== '') setEmailError(!EMAIL_RE.test(fromEmail))
  }

  const canSend = fromName.trim() !== '' && fromEmail.trim() !== '' && !emailError && body.trim() !== ''

  // 未入力項目を優先順に1つだけ案内（emailError はインライン表示があるので除外）
  const hintMessage = (() => {
    if (canSend) return null
    if (!fromName.trim())  return 'お名前を入力してください'
    if (!fromEmail.trim()) return '返信先のメールアドレスを入力してください'
    if (emailError)        return null   // FROM 行のインラインエラーで表示済み
    if (!body.trim())      return 'メッセージを入力してください'
    return null
  })()

  const buildParams = () => {
    const fullBody = `${body}\n\n---\nFrom: ${fromName} <${fromEmail}>`
    const subj     = subject.trim() || '（ポートフォリオからのメッセージ）'
    return { subj, fullBody }
  }

  const handleMailApp = () => {
    if (!canSend) return
    const { subj, fullBody } = buildParams()
    window.open(`mailto:${email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(fullBody)}`)
    // mailto はブラウザによって window.open の戻り値が不定なため、成功扱いにする
    showFeedback('メールアプリを開きました', 'success')
  }

  const handleGmail = () => {
    if (!canSend) return
    const { subj, fullBody } = buildParams()
    const win = window.open(
      `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(fullBody)}`,
      '_blank',
    )
    if (win) showFeedback('Gmail を開きました', 'success')
    else showFeedback('ポップアップがブロックされました。ブラウザの設定をご確認ください', 'error')
  }

  const labelClass = 'font-mono text-sm tracking-wide uppercase block mb-1'

  return (
    <div className="font-sans flex flex-col gap-5">

      {/* ── Links ─────────────────────────────────── */}
      <div>
        <SectionHead as="h3">links/</SectionHead>
        <ul className="mt-3 fc-border rounded-md border border-border overflow-hidden list-none p-0 m-0">
          {contact.filter(c => c.key !== 'zenn').map((c) => {
            const Icon = LINK_ICON[c.key] ?? ExternalLink
            return (
              <li key={c.key}>
                <a
                  href={`https://${c.val}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/10 border-b border-border/50 last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <Icon size={16} style={{ color: OS.accent }} aria-hidden="true" />
                  <span
                    className="font-mono text-sm tracking-wide uppercase w-14 flex-shrink-0"
                    style={{ color: OS.inkSoft }}
                  >
                    {c.label}
                  </span>
                  <span className="font-mono text-sm text-primary flex-1 underline underline-offset-2 break-all">{c.val}</span>
                  <ExternalLink size={12} style={{ color: OS.inkSoft }} aria-hidden="true" />
                  <span className="sr-only">（新しいタブで開く）</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Compose ───────────────────────────────── */}
      <div>
        <SectionHead as="h3">message/</SectionHead>
        <form
          className="mt-3 fc-border rounded-md border border-border overflow-hidden flex flex-col"
          style={{ background: 'rgba(6,14,28,0.7)' }}
          onSubmit={(e) => e.preventDefault()}
        >
          {/* NEW MESSAGE bar */}
          <div
            className="fc-border-b flex items-center gap-2 px-4 py-2.5 border-b border-border/50"
            style={{ background: OS.chromeHi }}
          >
            <span className="font-mono text-sm tracking-wide" style={{ color: OS.accent }}>
              NEW MESSAGE
            </span>
          </div>

          <div className="flex flex-col gap-4 px-4 py-4">
            {/* To */}
            <div>
              <span className={labelClass} style={{ color: OS.inkSoft }}>To</span>
              <span className="font-mono text-sm break-all" style={{ color: OS.chromeFg }}>{email}</span>
            </div>

            {/* お名前 */}
            <div>
              <label htmlFor={nameId} className={labelClass} style={{ color: OS.inkSoft }}>
                お名前 <span style={{ color: OS.red }}>*</span>
              </label>
              <Input
                id={nameId}
                placeholder="お名前"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className={FIELD_CLASS}
                required
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor={emailId} className={labelClass} style={{ color: OS.inkSoft }}>
                メールアドレス <span style={{ color: OS.red }}>*</span>
              </label>
              <Input
                id={emailId}
                placeholder="メールアドレス"
                type="email"
                value={fromEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className={FIELD_CLASS}
                required
                aria-invalid={emailError}
                aria-describedby={emailError ? emailErrId : undefined}
              />
              {emailError && (
                <p
                  id={emailErrId}
                  role="alert"
                  className="mt-1.5 font-mono text-sm"
                  style={{ color: OS.red }}
                >
                  ✕ 有効なメールアドレスを入力してください
                </p>
              )}
            </div>

            {/* 件名 */}
            <div>
              <label htmlFor={subjectId} className={labelClass} style={{ color: OS.inkSoft }}>
                件名（任意）
              </label>
              <Input
                id={subjectId}
                placeholder="件名（任意）"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            {/* 本文 */}
            <div>
              <label htmlFor={bodyId} className={labelClass} style={{ color: OS.inkSoft }}>
                メッセージ <span style={{ color: OS.red }}>*</span>
              </label>
              <Textarea
                id={bodyId}
                placeholder="メッセージを入力してください..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="font-mono text-sm min-h-[104px] resize-y"
                required
              />
            </div>
          </div>

          {/* Send buttons */}
          <div
            className="fc-border-t flex flex-wrap justify-end items-center gap-2 px-4 py-3 border-t border-border/50"
            style={{ background: OS.bodyShade }}
          >
            {(feedback || hintMessage) && (
              <span
                role="status"
                aria-live="polite"
                className="font-mono text-sm mr-auto"
                style={{ color: feedback ? (feedback.kind === 'success' ? OS.green : OS.red) : OS.inkSoft }}
              >
                {feedback ? `${feedback.kind === 'success' ? '✓' : '✕'} ${feedback.text}` : `› ${hintMessage}`}
              </span>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canSend}
              onClick={handleMailApp}
              className="font-mono text-sm tracking-wide gap-1.5 fc-border"
            >
              <Mail size={14} aria-hidden="true" />
              MAIL APP
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canSend}
              onClick={handleGmail}
              className="font-mono text-sm tracking-wide gap-1.5 fc-border"
            >
              <Send size={14} aria-hidden="true" />
              GMAIL
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}
