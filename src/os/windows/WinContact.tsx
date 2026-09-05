import { useEffect, useRef, useState } from 'react'
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

const INPUT_CLASS =
  'h-7 font-mono text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50 flex-1'

export function WinContact() {
  const { contact, email } = PROFILE

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

  return (
    <div className="font-sans text-sm flex flex-col gap-4">

      {/* ── Links ─────────────────────────────────── */}
      <div>
        <SectionHead>links/</SectionHead>
        <div className="mt-3 rounded-md border border-border overflow-hidden">
          {contact.filter(c => c.key !== 'zenn').map((c) => {
            const Icon = LINK_ICON[c.key] ?? ExternalLink
            return (
              <a
                key={c.key}
                href={`https://${c.val}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/10 border-b border-border/50 last:border-0 no-underline"
              >
                <Icon size={14} style={{ color: OS.accent }} />
                <span
                  className="font-mono text-[10px] tracking-widest uppercase w-12"
                  style={{ color: OS.inkSoft }}
                >
                  {c.label}
                </span>
                <span className="font-mono text-xs text-primary flex-1">{c.val}</span>
                <ExternalLink size={10} style={{ color: OS.inkSoft }} />
              </a>
            )
          })}
        </div>
      </div>

      {/* ── Compose ───────────────────────────────── */}
      <div>
        <SectionHead>message/</SectionHead>
        <div
          className="mt-3 rounded-md border border-border overflow-hidden"
          style={{ background: 'rgba(6,14,28,0.7)' }}
        >
          {/* NEW MESSAGE bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50"
            style={{ background: OS.chromeHi }}
          >
            <span className="font-mono text-[10px] tracking-widest" style={{ color: OS.accent }}>
              NEW MESSAGE
            </span>
          </div>

          {/* To */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50">
            <span className="font-mono text-[10px] tracking-widest uppercase w-14" style={{ color: OS.inkSoft }}>
              To
            </span>
            <span className="font-mono text-xs" style={{ color: OS.chromeFg }}>{email}</span>
          </div>

          {/* From (name + email 横並び) */}
          <div
            className="flex flex-col border-b border-border/50"
            style={emailError ? { borderColor: OS.red } : undefined}
          >
            <div className="flex items-center gap-3 px-4 py-2">
              <span className="font-mono text-[10px] tracking-widest uppercase w-14" style={{ color: OS.inkSoft }}>
                From
              </span>
              <Input
                placeholder="お名前"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className={INPUT_CLASS}
                style={{ color: OS.chromeFg }}
              />
              <span style={{ color: OS.bodyEdge }}>|</span>
              <Input
                placeholder="メールアドレス"
                type="email"
                value={fromEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className={INPUT_CLASS}
                style={{ color: emailError ? OS.red : OS.chromeFg }}
              />
            </div>
            {emailError && (
              <div className="px-4 pb-1.5 font-mono text-[10px]" style={{ color: OS.red }}>
                ✕ 有効なメールアドレスを入力してください
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border/50">
            <span className="font-mono text-[10px] tracking-widest uppercase w-14" style={{ color: OS.inkSoft }}>
              Sub
            </span>
            <Input
              placeholder="件名（任意）"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={INPUT_CLASS}
              style={{ color: OS.chromeFg }}
            />
          </div>

          {/* Body */}
          <div className="px-4 pt-3 pb-2">
            <Textarea
              placeholder="メッセージを入力してください..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="font-mono text-xs min-h-[96px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-muted-foreground/50"
              style={{ color: OS.chromeFg }}
            />
          </div>

          {/* Send buttons */}
          <div
            className="flex justify-end items-center gap-2 px-4 py-3 border-t border-border/50"
            style={{ background: OS.bodyShade }}
          >
            {(feedback || hintMessage) && (
              <span
                role="status"
                aria-live="polite"
                className="font-mono text-[10px] mr-auto"
                style={{ color: feedback ? (feedback.kind === 'success' ? OS.green : OS.red) : OS.inkSoft }}
              >
                {feedback ? `${feedback.kind === 'success' ? '✓' : '✕'} ${feedback.text}` : `› ${hintMessage}`}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={!canSend}
              onClick={handleMailApp}
              className="font-mono text-[11px] tracking-widest gap-1.5"
            >
              <Mail size={12} />
              MAIL APP
            </Button>
            <Button
              size="sm"
              disabled={!canSend}
              onClick={handleGmail}
              className="font-mono text-[11px] tracking-widest gap-1.5"
            >
              <Send size={12} />
              GMAIL
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
