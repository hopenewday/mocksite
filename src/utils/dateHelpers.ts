export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days)
}

export function dateDifference(start: Date, end: Date): { years: number; months: number; days: number } {
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

export function businessDaysBetween(start: Date, end: Date): number {
  let count = 0
  const current = new Date(start)
  current.setHours(0,0,0,0)
  const target = new Date(end)
  target.setHours(0,0,0,0)

  const step = current <= target ? 1 : -1

  while ((step > 0 && current <= target) || (step < 0 && current >= target)) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count += 1
    current.setDate(current.getDate() + step)
  }
  return Math.max(0, Math.abs(count))
}

export function getZodiacSign(date: Date): string {
  const d = date.getDate()
  const m = date.getMonth() + 1
  if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return 'Aquarius'
  if ((m == 2 && d >= 19) || (m == 3 && d <= 20)) return 'Pisces'
  if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return 'Aries'
  if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return 'Taurus'
  if ((m == 5 && d >= 21) || (m == 6 && d <= 20)) return 'Gemini'
  if ((m == 6 && d >= 21) || (m == 7 && d <= 22)) return 'Cancer'
  if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return 'Leo'
  if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return 'Virgo'
  if ((m == 9 && d >= 23) || (m == 10 && d <= 22)) return 'Libra'
  if ((m == 10 && d >= 23) || (m == 11 && d <= 21)) return 'Scorpio'
  if ((m == 11 && d >= 22) || (m == 12 && d <= 21)) return 'Sagittarius'
  return 'Capricorn'
}
