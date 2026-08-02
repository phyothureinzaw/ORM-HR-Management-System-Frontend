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
        <Route path="/leave" element={<FeaturePlaceholderPage title="Leave" />} />
        <Route path="/overtime" element={<FeaturePlaceholderPage title="Overtime" />} />
        <Route path="/attendance" element={<FeaturePlaceholderPage title="Attendance" />} />
        <Route path="/petty-cash" element={<FeaturePlaceholderPage title="Petty Cash" />} />
        <Route path="/reports" element={<FeaturePlaceholderPage title="Reports" />} />
        <Route path="/settings" element={<FeaturePlaceholderPage title="Settings" />} />
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
