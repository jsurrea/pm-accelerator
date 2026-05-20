import { NextRequest, NextResponse } from 'next/server'
import { getAllSearches } from '@/lib/db-queries'
import { toJSON, toCSV, toXML, toMarkdown, toPDF } from '@/lib/export'

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format') ?? 'json'
  const validFormats = ['json', 'csv', 'xml', 'pdf', 'markdown']

  if (!validFormats.includes(format)) {
    return NextResponse.json(
      { error: `Invalid format. Must be one of: ${validFormats.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    const searches = await getAllSearches()

    switch (format) {
      case 'json': {
        const data = toJSON(searches)
        return new NextResponse(data, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="weather-searches.json"',
          },
        })
      }
      case 'csv': {
        const data = toCSV(searches)
        return new NextResponse(data, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="weather-searches.csv"',
          },
        })
      }
      case 'xml': {
        const data = toXML(searches)
        return new NextResponse(data, {
          headers: {
            'Content-Type': 'application/xml',
            'Content-Disposition': 'attachment; filename="weather-searches.xml"',
          },
        })
      }
      case 'markdown': {
        const data = toMarkdown(searches)
        return new NextResponse(data, {
          headers: {
            'Content-Type': 'text/markdown',
            'Content-Disposition': 'attachment; filename="weather-searches.md"',
          },
        })
      }
      case 'pdf': {
        const buffer = await toPDF(searches)
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="weather-searches.pdf"',
          },
        })
      }
      default:
        return NextResponse.json({ error: 'Unknown format' }, { status: 400 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
