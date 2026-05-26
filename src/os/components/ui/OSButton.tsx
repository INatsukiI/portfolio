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
      className="font-mono text-xs tracking-widest"
    >
      {children}
    </Button>
  )
}
