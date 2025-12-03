export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatNumber(num: number, locale = 'en-US', options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(num)
}

export function formatPercentage(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`
}

export function formatDate(date: Date, format: string): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  
  const formats: Record<string, string> = {
    'MM/DD/YYYY': `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`,
    'DD/MM/YYYY': `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`,
    'YYYY-MM-DD': `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    'Month DD, YYYY': `${date.toLocaleString('default', { month: 'long' })} ${day}, ${year}`,
    'DD Month YYYY': ${day} ${date.toLocaleString('default', { month: 'long' })} ${year},
  }
  
  return formats[format] || formats['MM/DD/YYYY']
}