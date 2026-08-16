import type { NotificationFilters } from '../types/notification.types'

export const notificationKeys = {
  all: (scope = '') => ['notifications', scope] as const,
  lists: (scope = '') => [...notificationKeys.all(scope), 'list'] as const,
  list: (scope: string, filters: NotificationFilters) => [...notificationKeys.lists(scope), filters] as const,
  details: (scope = '') => [...notificationKeys.all(scope), 'detail'] as const,
  detail: (scope: string, id: string) => [...notificationKeys.details(scope), id] as const,
  unreadCount: (scope = '') => [...notificationKeys.all(scope), 'unread-count'] as const,
  preferences: (scope = '') => [...notificationKeys.all(scope), 'preferences'] as const,
}

export function normalizeNotificationFilters(filters: Partial<NotificationFilters> = {}): NotificationFilters {
  return {
    ...(filters.module ? { module: filters.module } : {}),
    ...(filters.isRead === undefined ? {} : { isRead: filters.isRead }),
    ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
    ...(filters.toDate ? { toDate: filters.toDate } : {}),
    pageNumber: Math.max(1, filters.pageNumber ?? 1),
    pageSize: Math.min(100, Math.max(1, filters.pageSize ?? 20)),
  }
}
