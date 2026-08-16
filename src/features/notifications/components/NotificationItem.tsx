import { Archive, Bell, Check, ExternalLink, Info, Layers, ShieldAlert } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { NotificationSummary } from '../types/notification.types'
import { eventLabel, exactTime, isSafeActionUrl, moduleClass, priorityLabel, relativeTime, summaryText } from '../utils/notificationFormatters'

export function NotificationItem({ notification, onOpen, onArchive, busy = false }: { notification: NotificationSummary; onOpen: (notification: NotificationSummary) => void; onArchive?: (notification: NotificationSummary) => void; busy?: boolean }) {
  const Icon = notification.priority === 3 ? ShieldAlert : notification.priority === 2 ? Info : notification.module === 'System' ? Bell : Layers
  return <article className={`notification-item ${notification.isRead ? 'notification-read' : 'notification-unread'}`}>
    <button type="button" className="notification-item-main" onClick={() => onOpen(notification)} disabled={busy} aria-label={`${notification.isRead ? '' : 'Unread: '}${summaryText(notification)}`}>
      <span className={`notification-item-icon ${moduleClass(notification.module)}`} aria-hidden="true"><Icon size={16} /></span>
      <span className="notification-item-copy"><span className="notification-item-topline"><span className="notification-module-label">{notification.module}</span><span className="notification-event-label">{eventLabel(notification.eventType)}</span>{!notification.isRead && <span className="notification-unread-label">Unread</span>}</span><strong>{notification.title}</strong><span>{notification.message}</span><time dateTime={notification.createdAtUtc} title={exactTime(notification.createdAtUtc)}>{relativeTime(notification.createdAtUtc)}</time></span>
      <span className="notification-item-priority" aria-label={`Priority ${priorityLabel(notification.priority)}`}>{notification.priority > 1 && <><span className={`notification-priority-dot priority-${notification.priority}`} aria-hidden="true" />{priorityLabel(notification.priority)}</>}</span>
    </button>
    <span className="notification-item-actions">{isSafeActionUrl(notification.actionUrl) && <ExternalLink size={14} aria-hidden="true" />}{notification.isRead && <Check size={14} aria-label="Read" />}{onArchive && <Button type="button" variant="ghost" size="sm" aria-label={`Archive ${notification.title}`} onClick={() => onArchive(notification)} disabled={busy}><Archive size={15} aria-hidden="true" /></Button>}</span>
  </article>
}
