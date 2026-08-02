import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <section className={cn('card', className)} {...props}>{children}</section>
}

export function CardHeader({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('card-header', className)} {...props}>{children}</div>
}

export function CardContent({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('card-content', className)} {...props}>{children}</div>
}
