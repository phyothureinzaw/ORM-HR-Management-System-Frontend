import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

export function Alert({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div role="status" className={cn('alert', className)} {...props}>{children}</div>
}
