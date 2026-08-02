import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button className={cn('button', `button-${variant}`, `button-${size}`, className)} {...props}>
      {children}
    </button>
  )
}
