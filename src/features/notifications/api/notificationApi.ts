import { apiClient } from '../../../lib/api/apiClient'
import type { NotificationDetails, NotificationFilters, NotificationPage, NotificationPreference, NotificationPreferenceUpdate, NotificationStateRequest, NotificationSummary } from '../types/notification.types'

const params = (filters: NotificationFilters) => ({
  ...(filters.module ? { module: filters.module } : {}),
  ...(filters.isRead === undefined ? {} : { isRead: filters.isRead }),
  ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
  ...(filters.toDate ? { toDate: filters.toDate } : {}),
  pageNumber: filters.pageNumber,
  pageSize: filters.pageSize,
})

export async function getMyNotifications(filters: NotificationFilters, signal?: AbortSignal) {
  return (await apiClient.get<NotificationPage>('/api/Notification/GetMyNotifications', { params: params(filters), signal })).data
}
export async function getMyUnreadNotificationCount(signal?: AbortSignal) {
  return (await apiClient.get<{ unreadCount: number }>('/api/Notification/GetMyUnreadNotificationCount', { signal })).data
}
export async function getMyNotificationById(id: string, signal?: AbortSignal) {
  return (await apiClient.get<NotificationDetails>(`/api/Notification/GetMyNotificationById/${encodeURIComponent(id)}`, { signal })).data
}
export async function updateNotificationAsRead(id: string, request: NotificationStateRequest) {
  return (await apiClient.put<NotificationSummary>(`/api/Notification/UpdateNotificationAsRead/${encodeURIComponent(id)}`, request)).data
}
export async function updateAllNotificationsAsRead() {
  return (await apiClient.put<number>('/api/Notification/UpdateAllNotificationsAsRead')).data
}
export async function archiveNotification(id: string, request: NotificationStateRequest) {
  return (await apiClient.put<NotificationSummary>(`/api/Notification/ArchiveNotification/${encodeURIComponent(id)}`, request)).data
}
export async function getMyNotificationPreferences(signal?: AbortSignal) {
  return (await apiClient.get<NotificationPreference[]>('/api/NotificationPreference/GetMyNotificationPreferences', { signal })).data
}
export async function updateMyNotificationPreference(request: NotificationPreferenceUpdate) {
  return (await apiClient.put<NotificationPreference>('/api/NotificationPreference/UpdateMyNotificationPreference', request)).data
}
