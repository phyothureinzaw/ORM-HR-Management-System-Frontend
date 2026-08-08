import type { LeaveBalance } from '../types/leave.types'

const amount = (value: number) => `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} days`

export function LeaveBalanceCards({ balances }: { balances: LeaveBalance[] }) {
  if (!balances.length) return <p className="muted">No current-year leave balances are configured.</p>
  return <div className="balance-grid">{balances.map((balance) => { const total = Math.max(balance.totalAllocatedDays, 0); const usedPercent = total ? Math.min(100, (balance.usedDays / total) * 100) : 0; return <article className="card balance-card" key={balance.id}><div className="balance-card-header"><strong>{balance.leaveType.name}</strong><span>{amount(balance.availableDays)} available</span></div><div className="balance-progress" aria-label={`${balance.leaveType.name}: ${Math.round(usedPercent)} percent used`}><span style={{ width: `${usedPercent}%` }} /></div><div className="balance-card-stats"><span>Used <b>{amount(balance.usedDays)}</b></span><span>Pending <b>{amount(balance.pendingDays)}</b></span></div><small>Total allocated: {amount(balance.totalAllocatedDays)}</small></article> })}</div>
}
