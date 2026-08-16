import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { archiveNotification, getMyNotifications, updateMyNotificationPreference } from '../features/notifications/api/notificationApi'
import { notificationKeys } from '../features/notifications/api/notificationKeys'
import { eventLabel, isSafeActionUrl, relativeTime } from '../features/notifications/utils/notificationFormatters'
import { server } from './server'
import { NotificationItem } from '../features/notifications/components/NotificationItem'
import { renderWithProviders } from './testUtils'

const notification = { id: 'notification-1', module: 'Leave' as const, eventType: 'LeaveRequestSubmitted', title: '<img src=x onerror=alert(1)>', message: '<script>alert(1)</script>', entityType: 'LeaveRequest', entityId: 'leave-1', actionUrl: '/leave/requests/leave-1', priority: 1 as const, isRead: false, createdAtUtc: new Date().toISOString(), expiresAtUtc: null, rowVersion: 'version-1' }

describe('Notification contracts and safety', () => {
  it('scopes list, detail, and unread keys by authenticated identity', () => {
    expect(notificationKeys.lists('company-1:user-1')).toEqual(['notifications', 'company-1:user-1', 'list'])
    expect(notificationKeys.detail('company-1:user-1', 'notification-1')).toEqual(['notifications', 'company-1:user-1', 'detail', 'notification-1'])
    expect(notificationKeys.lists('company-1:user-1')).not.toEqual(notificationKeys.lists('company-2:user-1'))
  })

  it('serializes backend notification filters without empty values', async () => {
    let requestUrl = ''
    server.use(http.get('http://localhost:5278/api/Notification/GetMyNotifications', ({ request }) => { requestUrl = request.url; return HttpResponse.json({ items: [], pageNumber: 2, pageSize: 20, totalCount: 0, totalPages: 0, hasPreviousPage: true, hasNextPage: false }) }))
    await getMyNotifications({ module: 'Leave', isRead: false, fromDate: '2026-08-01', toDate: '2026-08-31', pageNumber: 2, pageSize: 20 })
    const query = new URL(requestUrl).searchParams
    expect(query.get('module')).toBe('Leave')
    expect(query.get('isRead')).toBe('false')
    expect(query.get('fromDate')).toBe('2026-08-01')
    expect(query.get('pageNumber')).toBe('2')
    expect(query.has('eventType')).toBe(false)
  })

  it('sends archive and preference RowVersion payloads exactly', async () => {
    let archiveBody: unknown; let preferenceBody: unknown
    server.use(
      http.put('http://localhost:5278/api/Notification/ArchiveNotification/notification-1', async ({ request }) => { archiveBody = await request.json(); return HttpResponse.json({ id: 'notification-1' }) }),
      http.put('http://localhost:5278/api/NotificationPreference/UpdateMyNotificationPreference', async ({ request }) => { preferenceBody = await request.json(); return HttpResponse.json({ id: 'preference-1' }) }),
    )
    await archiveNotification('notification-1', { rowVersion: 'notification-version' })
    await updateMyNotificationPreference({ module: 'Leave', eventType: 'LeaveRequestSubmitted', isInAppEnabled: true, isEmailEnabled: false, isPushEnabled: false, rowVersion: 'preference-version' })
    expect(archiveBody).toEqual({ rowVersion: 'notification-version' })
    expect(preferenceBody).toEqual({ module: 'Leave', eventType: 'LeaveRequestSubmitted', isInAppEnabled: true, isEmailEnabled: false, isPushEnabled: false, rowVersion: 'preference-version' })
  })

  it('allows only same-origin application paths for deep links', () => {
    expect(isSafeActionUrl('/notifications')).toBe(true)
    expect(isSafeActionUrl('/leave/requests/1')).toBe(true)
    expect(isSafeActionUrl('https://evil.example/')).toBe(false)
    expect(isSafeActionUrl('//evil.example/')).toBe(false)
    expect(isSafeActionUrl('/\\evil.example')).toBe(false)
    expect(isSafeActionUrl('javascript:alert(1)')).toBe(false)
  })

  it('provides readable event and relative-time labels', () => {
    expect(eventLabel('OvertimeRequestSubmitted')).toBe('Overtime request submitted')
    expect(relativeTime(new Date(Date.now() - 5 * 60 * 1000).toISOString())).toBe('5 minutes ago')
    expect(relativeTime('not-a-date')).toBe('Unknown time')
  })

  it('renders notification content as escaped text and exposes meaningful actions', () => {
    const onOpen = vi.fn()
    renderWithProviders(<NotificationItem notification={notification} onOpen={onOpen} onArchive={vi.fn()} />)
    expect(screen.getByText(notification.title)).toBeInTheDocument()
    expect(screen.getByText(notification.message)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /unread:/i }))
    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /archive/i })).toBeInTheDocument()
  })
})
