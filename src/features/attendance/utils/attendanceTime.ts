type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number }

function parts(value: Date, timeZone: string): Parts {
  const values = new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(value)
  const get = (name: string) => Number(values.find((item) => item.type === name)?.value ?? 0)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute'), second: get('second') }
}

function offsetAt(value: Date, timeZone: string) {
  const current = parts(value, timeZone)
  const asUtc = Date.UTC(current.year, current.month - 1, current.day, current.hour, current.minute, current.second)
  return (asUtc - value.getTime()) / 60000
}

export function localDateTimeToIso(value: string, timeZone: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Enter a valid local date and time.')
  const [date, time] = value.split('T'); const [year, month, day] = date.split('-').map(Number); const [hour, minute] = time.split(':').map(Number)
  const wall = Date.UTC(year, month - 1, day, hour, minute, 0)
  let instant = new Date(wall)
  instant = new Date(wall - offsetAt(instant, timeZone) * 60000)
  instant = new Date(wall - offsetAt(instant, timeZone) * 60000)
  if (Number.isNaN(instant.getTime())) throw new Error('Enter a valid local date and time.')
  return instant.toISOString()
}

export function isoToLocalDateTime(value: string | null, timeZone: string) {
  if (!value) return ''
  const current = parts(new Date(value), timeZone)
  return `${String(current.year).padStart(4, '0')}-${String(current.month).padStart(2, '0')}-${String(current.day).padStart(2, '0')}T${String(current.hour).padStart(2, '0')}:${String(current.minute).padStart(2, '0')}`
}
