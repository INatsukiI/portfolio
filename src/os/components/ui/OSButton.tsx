import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface OSButtonProps {
  children: ReactNode
  primary?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function OSButton({ children, primary, onClick, disabled }: OSButtonProps) {
  return (
    <Button
      variant={primary ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      // 強制カラーモードで塗り/アウトラインの区別が消えても形状が分かるよう実線を担保
      className="font-mono text-sm tracking-wide fc-border"
    >
      {children}
    </Button>
  )
}
