import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { GuestRoute } from '../features/auth/components/GuestRoute'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { DashboardPlaceholderPage } from '../pages/DashboardPlaceholderPage'
import { DepartmentsPage } from '../features/departments/pages/DepartmentsPage'
import { FeaturePlaceholderPage } from '../pages/FeaturePlaceholderPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterCompanyPage } from '../features/auth/pages/RegisterCompanyPage'
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import { EmployeesPage } from '../features/employees/pages/EmployeesPage'
import { AddEmployeePage, UpdateEmployeePage } from '../features/employees/pages/EmployeeFormPages'
import { EmployeeDetailsPage } from '../features/employees/pages/EmployeeDetailsPage'
import { LeaveSettingsLayout } from '../features/leave/pages/LeaveSettingsLayout'
import { LeaveTypesPage } from '../features/leave/pages/LeaveTypesPage'
import { LeaveBalancesPage } from '../features/leave/pages/LeaveBalancesPage'
import { LeaveApprovalSettingsPage } from '../features/leave/pages/LeaveApprovalSettingsPage'
import { MyLeavePage } from '../features/leave/pages/MyLeavePage'
import { AddLeaveRequestPage } from '../features/leave/pages/AddLeaveRequestPage'
import { UpdateLeaveRequestPage } from '../features/leave/pages/UpdateLeaveRequestPage'
import { LeaveRequestDetailsPage } from '../features/leave/pages/LeaveRequestDetailsPage'
import { LeaveApprovalQueuePage } from '../features/leave/pages/LeaveApprovalQueuePage'
import { CompanyLeaveRequestsPage } from '../features/leave/pages/CompanyLeaveRequestsPage'
import { WorkShiftsPage } from '../features/attendance/pages/WorkShiftsPage'
import { WorkShiftFormPage } from '../features/attendance/pages/WorkShiftFormPage'
import { LocationsPage } from '../features/attendance/pages/LocationsPage'
import { LocationFormPage } from '../features/attendance/pages/LocationFormPage'
import { AssignmentsPage } from '../features/attendance/pages/AssignmentsPage'
import { AssignmentFormPage } from '../features/attendance/pages/AssignmentFormPage'
import { AttendanceSettingsPage } from '../features/attendance/pages/AttendanceSettingsPage'
import { AttendanceTodayPage } from '../features/attendance/pages/AttendanceTodayPage'
import { AttendanceHistoryPage } from '../features/attendance/pages/AttendanceHistoryPage'
import { AttendanceDetailsPage } from '../features/attendance/pages/AttendanceDetailsPage'
import { CompanyAttendancePage } from '../features/attendance/pages/CompanyAttendancePage'
import { CompanyAttendanceDetailsPage } from '../features/attendance/pages/CompanyAttendanceDetailsPage'
import { MyAttendanceCorrectionsPage } from '../features/attendance/pages/MyAttendanceCorrectionsPage'
import { AttendanceCorrectionFormPage } from '../features/attendance/pages/AttendanceCorrectionFormPage'
import { AttendanceCorrectionDetailsPage } from '../features/attendance/pages/AttendanceCorrectionDetailsPage'
import { AttendanceCorrectionQueuePage } from '../features/attendance/pages/AttendanceCorrectionQueuePage'
import { AttendanceCorrectionReviewPage } from '../features/attendance/pages/AttendanceCorrectionReviewPage'
import { PermissionGuard } from '../features/auth/components/PermissionGuard'
import { Permissions } from '../lib/permissions'
import { OvertimeTypesPage, OvertimeTypeFormPage } from '../features/overtime/pages/OvertimeTypesPage'
import { OvertimeProjectsPage, OvertimeProjectFormPage } from '../features/overtime/pages/OvertimeProjectsPage'
import { OvertimeSettingsPage } from '../features/overtime/pages/OvertimeSettingsPage'
import { OvertimeApprovalPage, OvertimeApprovalLevelFormPage } from '../features/overtime/pages/OvertimeApprovalPage'
import { OvertimeRequestsPage } from '../features/overtime/pages/OvertimeRequestsPage'
import { OvertimeRequestFormPage } from '../features/overtime/pages/OvertimeRequestFormPage'
import { OvertimeRequestDetailsPage } from '../features/overtime/pages/OvertimeRequestDetailsPage'
import { OvertimeApprovalQueuePage } from '../features/overtime/pages/OvertimeApprovalQueuePage'
import { OvertimeApprovalDetailsPage } from '../features/overtime/pages/OvertimeApprovalDetailsPage'
import { CompanyOvertimePage } from '../features/overtime/pages/CompanyOvertimePage'
import { CompanyOvertimeDetailsPage } from '../features/overtime/pages/CompanyOvertimeDetailsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-company" element={<RegisterCompanyPage />} />
      </Route>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPlaceholderPage />} />
         <Route path="/departments" element={<DepartmentsPage />} />
         <Route path="/employees" element={<EmployeesPage />} />
         <Route path="/employees/new" element={<AddEmployeePage />} />
         <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
         <Route path="/employees/:employeeId/edit" element={<UpdateEmployeePage />} />
         <Route path="/leave" element={<MyLeavePage />} />
         <Route path="/leave/new" element={<AddLeaveRequestPage />} />
         <Route path="/leave/approvals" element={<LeaveApprovalQueuePage />} />
         <Route path="/leave/company" element={<CompanyLeaveRequestsPage />} />
         <Route path="/leave/:leaveRequestId/edit" element={<UpdateLeaveRequestPage />} />
         <Route path="/leave/:leaveRequestId" element={<LeaveRequestDetailsPage />} />
          <Route path="/overtime" element={<OvertimeRequestsPage />} />
          <Route path="/overtime/new" element={<OvertimeRequestFormPage />} />
          <Route path="/overtime/requests/:overtimeRequestId" element={<OvertimeRequestDetailsPage />} />
          <Route path="/overtime/requests/:overtimeRequestId/edit" element={<OvertimeRequestFormPage />} />
          <Route path="/overtime/approvals" element={<OvertimeApprovalQueuePage />} />
          <Route path="/overtime/approvals/:overtimeRequestId" element={<OvertimeApprovalDetailsPage />} />
          <Route path="/overtime/types" element={overtime(<OvertimeTypesPage />)} />
          <Route path="/overtime/types/new" element={overtime(<OvertimeTypeFormPage />)} />
          <Route path="/overtime/types/:overtimeTypeId/edit" element={overtime(<OvertimeTypeFormPage />)} />
          <Route path="/overtime/projects" element={overtime(<OvertimeProjectsPage />)} />
          <Route path="/overtime/projects/new" element={overtime(<OvertimeProjectFormPage />)} />
          <Route path="/overtime/projects/:overtimeProjectId/edit" element={overtime(<OvertimeProjectFormPage />)} />
          <Route path="/overtime/settings" element={overtime(<OvertimeSettingsPage />)} />
          <Route path="/overtime/approval" element={overtime(<OvertimeApprovalPage />)} />
          <Route path="/overtime/approval/levels/new" element={overtime(<OvertimeApprovalLevelFormPage />)} />
          <Route path="/overtime/approval/levels/:approvalLevelId/edit" element={overtime(<OvertimeApprovalLevelFormPage />)} />
          <Route path="/attendance" element={<AttendanceTodayPage />} />
          <Route path="/attendance/history" element={<AttendanceHistoryPage />} />
            <Route path="/attendance/my/:attendanceRecordId" element={<AttendanceDetailsPage />} />
            <Route path="/attendance/corrections" element={<MyAttendanceCorrectionsPage />} />
            <Route path="/attendance/corrections/new/:attendanceRecordId" element={<AttendanceCorrectionFormPage />} />
            <Route path="/attendance/corrections/:correctionId" element={<AttendanceCorrectionDetailsPage />} />
            <Route path="/dashboard/attendance" element={<CompanyAttendancePage />} />
            <Route path="/dashboard/attendance/corrections" element={<AttendanceCorrectionQueuePage />} />
            <Route path="/dashboard/attendance/corrections/:correctionId" element={<AttendanceCorrectionReviewPage />} />
             <Route path="/dashboard/attendance/:attendanceRecordId" element={<CompanyAttendanceDetailsPage />} />
            <Route path="/dashboard/overtime" element={overtime(<CompanyOvertimePage />)} />
            <Route path="/dashboard/overtime/requests/:overtimeRequestId" element={overtime(<CompanyOvertimeDetailsPage />)} />
           <Route path="/attendance/company/:attendanceRecordId" element={<AttendanceMonitoringDetailsRedirect />} />
           <Route path="/attendance/company" element={<AttendanceMonitoringRedirect />} />
         <Route path="/attendance/settings" element={<AttendanceSettingsPage />} />
         <Route path="/attendance/shifts" element={<WorkShiftsPage />} />
         <Route path="/attendance/shifts/new" element={<WorkShiftFormPage />} />
         <Route path="/attendance/shifts/:shiftId/edit" element={<WorkShiftFormPage />} />
         <Route path="/attendance/locations" element={<LocationsPage />} />
         <Route path="/attendance/locations/new" element={<LocationFormPage />} />
         <Route path="/attendance/locations/:locationId/edit" element={<LocationFormPage />} />
         <Route path="/attendance/assignments" element={<AssignmentsPage />} />
         <Route path="/attendance/assignments/new" element={<AssignmentFormPage />} />
         <Route path="/attendance/assignments/:assignmentId/edit" element={<AssignmentFormPage />} />
        <Route path="/petty-cash" element={<FeaturePlaceholderPage title="Petty Cash" />} />
        <Route path="/reports" element={<FeaturePlaceholderPage title="Reports" />} />
         <Route path="/settings" element={<FeaturePlaceholderPage title="Settings" />} />
         <Route path="/settings/leave" element={<LeaveSettingsLayout />}>
           <Route index element={<Navigate to="types" replace />} />
           <Route path="types" element={<LeaveTypesPage />} />
           <Route path="balances" element={<LeaveBalancesPage />} />
           <Route path="approvals" element={<LeaveApprovalSettingsPage />} />
         </Route>
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function overtime(element: ReactNode) {
  return <PermissionGuard permission={Permissions.Overtime.Manage} fallback={<Navigate to="/unauthorized" replace />}>{element}</PermissionGuard>
}

function AttendanceMonitoringRedirect() {
  const location = useLocation()
  return <PermissionGuard permission={Permissions.Attendance.Manage} fallback={<Navigate to="/unauthorized" replace />}><Navigate to={`/dashboard${location.search}`} replace /></PermissionGuard>
}

function AttendanceMonitoringDetailsRedirect() {
  const { attendanceRecordId } = useParams()
  const location = useLocation()
  return <PermissionGuard permission={Permissions.Attendance.Manage} fallback={<Navigate to="/unauthorized" replace />}><Navigate to={`/dashboard/attendance/${attendanceRecordId ?? ''}${location.search}`} replace /></PermissionGuard>
}
