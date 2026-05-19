import type { Search } from './db-queries'

export function toJSON(searches: Search[]): string {
  return JSON.stringify(searches, null, 2)
}

function csvEscape(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

export function toCSV(searches: Search[]): string {
  const headers = ['id', 'location', 'lat', 'lon', 'date_from', 'date_to', 'weather_json', 'created_at', 'updated_at']
  const rows = searches.map((s) =>
    headers.map((h) => csvEscape(s[h as keyof Search])).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function xmlEscape(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function toXML(searches: Search[]): string {
  const items = searches
    .map((s) => {
      const fields = Object.entries(s)
        .map(([k, v]) => `    <${k}>${xmlEscape(v)}</${k}>`)
        .join('\n')
      return `  <search>\n${fields}\n  </search>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<searches>\n${items}\n</searches>`
}

export function toMarkdown(searches: Search[]): string {
  const headers = ['ID', 'Location', 'Lat', 'Lon', 'Date From', 'Date To', 'Created At']
  const separator = headers.map(() => '---').join(' | ')
  const headerRow = headers.join(' | ')
  const rows = searches.map((s) =>
    [s.id, s.location, s.lat, s.lon, s.date_from, s.date_to, s.created_at].join(' | ')
  )
  return [`# Weather Search History`, '', headerRow, separator, ...rows].join('\n')
}

export async function toPDF(searches: Search[]): Promise<Buffer> {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(16)
  doc.text('WeatherWise - Search History', 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toISOString()}`, 14, 22)

  autoTable(doc, {
    startY: 28,
    head: [['ID', 'Location', 'Lat', 'Lon', 'Date From', 'Date To', 'Created At']],
    body: searches.map((s) => [
      s.id,
      s.location,
      s.lat.toFixed(4),
      s.lon.toFixed(4),
      s.date_from,
      s.date_to,
      s.created_at,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  const buffer = Buffer.from(doc.output('arraybuffer'))
  return buffer
}
