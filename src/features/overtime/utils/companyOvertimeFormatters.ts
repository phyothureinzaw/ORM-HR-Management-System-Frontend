import type { OvertimeCompanyFilters } from '../types/overtime.types'

export function validDateRange(filters: OvertimeCompanyFilters) { return filters.fromDate && filters.toDate && filters.fromDate > filters.toDate ? 'From date cannot be later than To date.' : null }
