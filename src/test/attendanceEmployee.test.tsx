import { fireEvent, render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { server } from './server'
import { addCheckIn, updateCheckOut } from '../features/attendance/api/attendanceApi'
import { useCurrentPosition } from '../features/attendance/hooks/useCurrentPosition'

describe('employee Attendance actions', () => {
  it('sends only server-supported check-in values without client identity or time', async () => {
    let body: Record<string, unknown> | undefined
    server.use(http.post('http://localhost:5278/api/Attendance/AddCheckIn', async ({ request }) => { body = await request.json() as Record<string, unknown>; return HttpResponse.json({ id: 'record-1' }) }))
    await addCheckIn({ latitude: 16.8409, longitude: 96.1735, remark: 'Starting shift', outsideLocationReason: null })
    expect(body).toEqual({ latitude: 16.8409, longitude: 96.1735, remark: 'Starting shift', outsideLocationReason: null })
    expect(body).not.toHaveProperty('employeeId')
    expect(body).not.toHaveProperty('companyId')
    expect(body).not.toHaveProperty('checkInDateTimeUtc')
  })

  it('uses the attendance record id for checkout and sends no client calculations', async () => {
    let path = ''; let body: Record<string, unknown> | undefined
    server.use(http.put('http://localhost:5278/api/Attendance/UpdateCheckOut/:id', async ({ request, params }) => { path = String(params.id); body = await request.json() as Record<string, unknown>; return HttpResponse.json({ id: 'record-1' }) }))
    await updateCheckOut('record-1', { latitude: 16, longitude: 96, remark: null, outsideLocationReason: null, rowVersion: 'AQ==' })
    expect(path).toBe('record-1')
    expect(body).toEqual({ latitude: 16, longitude: 96, remark: null, outsideLocationReason: null, rowVersion: 'AQ==' })
    expect(body).not.toHaveProperty('workMinutes')
    expect(body).not.toHaveProperty('checkOutDateTimeUtc')
  })

  it('requests browser location only after an explicit user action', () => {
    const getCurrentPosition = vi.fn()
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition } })
    function Harness() { const location = useCurrentPosition(); return <><span>{location.state}</span><button onClick={location.request}>Use Current Location</button></> }
    render(<Harness />)
    expect(getCurrentPosition).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Use Current Location' }))
    expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), expect.objectContaining({ enableHighAccuracy: true, maximumAge: 0 }))
  })
})
