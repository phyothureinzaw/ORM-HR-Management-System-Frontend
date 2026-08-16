import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import { archiveNotification, getMyNotificationById, getMyNotifications, getMyUnreadNotificationCount, getMyNotificationPreferences, updateAllNotificationsAsRead, updateMyNotificationPreference, updateNotificationAsRead } from '../api/notificationApi'
import { normalizeNotificationFilters, notificationKeys } from '../api/notificationKeys'
import type { NotificationFilters, NotificationPreferenceUpdate, NotificationStateRequest } from '../types/notification.types'

function useNotificationScope() {
  const user = useAppSelector((state) => state.auth.user)
  return { enabled: stateIsAuthenticated(useAppSelector((state) => state.auth.status)), scope: user ? `${user.companyId}:${user.userId}` : '' }
}

function stateIsAuthenticated(status: string) { return status === 'authenticated' }

export function useNotificationList(filters: Partial<NotificationFilters> = {}) {
  const { enabled, scope } = useNotificationScope(); const normalized = normalizeNotificationFilters(filters)
  return useQuery({ queryKey: notificationKeys.list(scope, normalized), queryFn: ({ signal }) => getMyNotifications(normalized, signal), enabled, placeholderData: (previous) => previous })
}
export function useNotificationUnreadCount() {
  const { enabled, scope } = useNotificationScope()
  return useQuery({ queryKey: notificationKeys.unreadCount(scope), queryFn: ({ signal }) => getMyUnreadNotificationCount(signal), enabled, refetchInterval: enabled ? 45_000 : false, refetchOnWindowFocus: true })
}
export function useNotificationDetails(id: string | undefined) {
  const { enabled, scope } = useNotificationScope()
  return useQuery({ queryKey: notificationKeys.detail(scope, id ?? ''), queryFn: ({ signal }) => getMyNotificationById(id as string, signal), enabled: enabled && Boolean(id) })
}
export function useNotificationPreferences() {
  const { enabled, scope } = useNotificationScope()
  return useQuery({ queryKey: notificationKeys.preferences(scope), queryFn: ({ signal }) => getMyNotificationPreferences(signal), enabled })
}
export function useNotificationMutations() {
  const client = useQueryClient(); const { scope } = useNotificationScope()
  const refresh = () => { void client.invalidateQueries({ queryKey: notificationKeys.lists(scope) }); void client.invalidateQueries({ queryKey: notificationKeys.unreadCount(scope) }) }
  const markRead = useMutation({ mutationFn: ({ id, request }: { id: string; request: NotificationStateRequest }) => updateNotificationAsRead(id, request), onSuccess: (value) => { void client.invalidateQueries({ queryKey: notificationKeys.detail(scope, value.id) }); refresh() } })
  const markAllRead = useMutation({ mutationFn: updateAllNotificationsAsRead, onSuccess: refresh })
  const archive = useMutation({ mutationFn: ({ id, request }: { id: string; request: NotificationStateRequest }) => archiveNotification(id, request), onSuccess: (value) => { void client.invalidateQueries({ queryKey: notificationKeys.detail(scope, value.id) }); refresh() } })
  const updatePreference = useMutation({ mutationFn: (request: NotificationPreferenceUpdate) => updateMyNotificationPreference(request), onSuccess: (value) => { client.setQueryData<unknown[]>(notificationKeys.preferences(scope), (current) => current?.map((item) => (item as { id: string }).id === value.id ? value : item) ?? [value]) } })
  return { markRead, markAllRead, archive, updatePreference }
}
