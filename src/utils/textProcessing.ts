/**
 * Remove extra spaces from text
 */
export function removeExtraSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Remove line breaks from text
 */
export function removeLineBreaks(text: string): string {
  return text.replace(/[\r\n]+/g, ' ')
}

/**
 * Trim whitespace from text
 */
export function trimWhitespace(text: string): string {
  return text.trim()
}

/**
 * Remove special characters (keep alphanumeric, spaces, basic punctuation)
 */
export function removeSpecialChars(text: string, keepBasicPunctuation = true): string {
  if (keepBasicPunctuation) {
    return text.replace(/[^a-zA-Z0-9\s.,!?;:]/g, '')
  }
  return text.replace(/[^a-zA-Z0-9\s]/g, '')
}

/**
 * Remove numbers from text
 */
export function removeNumbers(text: string): string {
  return text.replace(/\d+/g, '')
}

/**
 * Remove punctuation from text
 */
export function removePunctuation(text: string): string {
  return text.replace(/[.,/#!$%^&*;:{}=\-_`~()?[]"']/g, '')
}

/**
 * Convert to lowercase
 */
export function toLowerCase(text: string): string {
  return text.toLowerCase()
}

/**
 * Convert to uppercase
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase()
}

/**
 * Capitalize first letter of each word
 */
export function toTitleCase(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}

/**
 * Count lines in text
 */
export function countLines(text: string): number {
  if (!text) return 0
  return text.split(/[\r\n]+/).length
}

/**
 * Count characters (with or without spaces)
 */
export function countCharacters(text: string, includeSpaces = true): number {
  if (includeSpaces) {
    return text.length
  }
  return text.replace(/\s/g, '').length
}

/**
 * Count unique lines
 */
export function countUniqueLines(text: string, caseSensitive = true): number {
  if (!text) return 0
  const lines = text.split(/[\r\n]+/)
  const uniqueLines = caseSensitive 
    ? [...new Set(lines)]
    : [...new Set(lines.map(line => line.toLowerCase()))]
  return uniqueLines.length
}

/**
 * Find and remove duplicate lines
 */
export function removeDuplicateLines(text: string, caseSensitive = true): string[] {
  const lines = text.split(/[\r\n]+/)
  const seen = new Set<string>()
  const result: string[] = []
  
  lines.forEach(line => {
    const key = caseSensitive ? line : line.toLowerCase()
    if (key !== '' && !seen.has(key)) {
      seen.add(key)
      result.push(line)
    } else if (key === '') {
      result.push(line) // Keep empty lines
    }
  })
  
  return result
}

/**
 * Sort lines alphabetically
 */
export function sortLines(text: string, caseSensitive = true): string[] {
  const lines = text.split(/[\r\n]+/)
  
  return caseSensitive 
    ? lines.sort()
    : lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}

/**
 * Remove empty lines
 */
export function removeEmptyLines(text: string): string {
  return text.replace(/^\s*[\r\n]/gm, '').replace(/^[\r\n]+|[\r\n]+$/g, '')
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Escape HTML characters
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Unescape HTML characters
 */
export function unescapeHtml(text: string): string {
  const div = document.createElement('div')
  div.innerHTML = text
  return div.textContent || div.innerText || ''
}

/**
 * Extract numbers from text
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+\.?\d*/g)
  return matches ? matches.map(Number) : []
}

/**
 * Extract emails from text
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  return [...new Set(text.match(emailRegex) || [])]
}

/**
 * Extract URLs from text
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
  return [...new Set(text.match(urlRegex) || [])]
}

/**
 * Generate summary statistics for text
 */
export function getTextStatistics(text: string): {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  paragraphs: number
  uniqueLines: number
  averageWordsPerLine: number
} {
  const lines = text.split(/[\r\n]+/)
  const paragraphs = text.split(/[\r\n]{2,}/).filter(p => p.trim())
  
  return {
    characters: text.length,
    charactersNoSpaces: countCharacters(text, false),
    words: countWords(text),
    lines: countLines(text),
    paragraphs: paragraphs.length,
    uniqueLines: countUniqueLines(text),
    averageWordsPerLine: Math.round(countWords(text) / countLines(text) * 10) / 10
  }
}