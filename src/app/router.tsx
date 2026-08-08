import { Navigate, Route, Routes } from 'react-router-dom'
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
        <Route path="/overtime" element={<FeaturePlaceholderPage title="Overtime" />} />
        <Route path="/attendance" element={<FeaturePlaceholderPage title="Attendance" />} />
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
