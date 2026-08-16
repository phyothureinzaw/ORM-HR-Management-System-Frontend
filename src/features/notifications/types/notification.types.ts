export type NotificationModule = 'System' | 'Leave' | 'Attendance' | 'Overtime'
export type NotificationPriority = 1 | 2 | 3

export type NotificationSummary = {
  id: string
  module: NotificationModule
  eventType: string
  title: string
  message: string
  entityType: string | null
  entityId: string | null
  actionUrl: string | null
  priority: NotificationPriority
  isRead: boolean
  createdAtUtc: string
  expiresAtUtc: string | null
  rowVersion: string
}

export type NotificationDetails = {
  notification: NotificationSummary
  actorUserId: string | null
  actorDisplayName: string | null
}

export type NotificationPage = {
  items: NotificationSummary[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type NotificationFilters = {
  module?: NotificationModule
  isRead?: boolean
  fromDate?: string
  toDate?: string
  pageNumber: number
  pageSize: number
}

export type NotificationPreference = {
  id: string
  module: NotificationModule
  eventType: string
  isInAppEnabled: boolean
  isEmailEnabled: boolean
  isPushEnabled: boolean
  rowVersion: string
}

export type NotificationPreferenceUpdate = {
  module: NotificationModule
  eventType: string
  isInAppEnabled: boolean
  isEmailEnabled: boolean
  isPushEnabled: boolean
  rowVersion?: string
}

export type NotificationStateRequest = { rowVersion?: string }
