import { NextResponse, NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function wrapText(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + (line ? ' ' : '') + w).length > maxLen) {
      if (line) lines.push(line)
      line = w
    } else {
      line = line ? line + ' ' + w : w
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function GET(_request: NextRequest) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const pdfDoc = await PDFDocument.create()
  const pageSize = { width: 595.28, height: 841.89 }
  let page = pdfDoc.addPage([pageSize.width, pageSize.height])
  const margin = 32
  let y = page.getHeight() - margin

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const sanitize = (s: string) =>
    s
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u00A0]/g, ' ')

  const ensureSpace = (requiredHeight = 14) => {
    if (y - requiredHeight < margin) {
      page = pdfDoc.addPage([pageSize.width, pageSize.height])
      y = page.getHeight() - margin
    }
  }

  const drawHeading = (text: string, size = 16) => {
    const safe = sanitize(text)
    const textWidth = fontBold.widthOfTextAtSize(safe, size)
    ensureSpace(size + 8)
    page.drawText(safe, { x: (page.getWidth() - textWidth) / 2, y, size, font: fontBold, color: rgb(0.07, 0.09, 0.15) })
    y -= size + 8
  }

  const drawSubtle = (text: string, size = 9) => {
    const safe = sanitize(text)
    const textWidth = font.widthOfTextAtSize(safe, size)
    ensureSpace(size + 12)
    page.drawText(safe, { x: (page.getWidth() - textWidth) / 2, y, size, font, color: rgb(0.42, 0.45, 0.5) })
    y -= size + 12
  }

  const drawParagraph = (text: string, size = 10, maxWidth = page.getWidth() - margin * 2, lineHeight = 13) => {
    const approxCharsPerLine = Math.max(20, Math.floor(maxWidth / (size * 0.55)))
    for (const line of wrapText(sanitize(text), approxCharsPerLine)) {
      ensureSpace(lineHeight)
      page.drawText(line, { x: margin, y, size, font, color: rgb(0.07, 0.09, 0.15) })
      y -= lineHeight
    }
    y -= 2
  }

  const drawList = (items: string[], size = 10, bullet = '-', indent = 12, lineHeight = 13) => {
    for (const item of items) {
      const lines = wrapText(sanitize(item), Math.floor((page.getWidth() - margin * 2 - indent) / (size * 0.55)))
      ensureSpace(lineHeight)
      page.drawText(bullet, { x: margin, y, size, font, color: rgb(0.07, 0.09, 0.15) })
      page.drawText(lines[0], { x: margin + indent, y, size, font, color: rgb(0.07, 0.09, 0.15) })
      y -= lineHeight
      for (const cont of lines.slice(1)) {
        ensureSpace(lineHeight)
        page.drawText(cont, { x: margin + indent, y, size, font, color: rgb(0.07, 0.09, 0.15) })
        y -= lineHeight
      }
    }
    y -= 2
  }

  const section = (num: number, title: string) => {
    ensureSpace(18)
    page.drawText(`${num}. ${sanitize(title)}`, { x: margin, y, size: 12, font: fontBold, color: rgb(0.07, 0.09, 0.15) })
    y -= 14
  }

  const company = 'FOSHAN SHUNLIMING FURNITURE CO.,LTD'
  const lastUpdated = 'Last Updated: November 2025'
  const email = 'info@compressionsofa.store'
  const phone = '+85593697395'
  const address = 'Zhaojia Industrial Zone, Zhongye West Third Road, Nanhai District, Foshan City'

  drawHeading('Shipping Policy')
  drawSubtle(lastUpdated)

  drawParagraph(`Thank you for shopping with ${company}. We aim to provide our customers with a smooth and transparent delivery experience for all our sofa and furniture orders. Please read the following policy carefully to understand how we handle shipping and delivery.`)

  section(1, 'Order Processing')
  drawParagraph('All orders are processed within 1–3 business days after payment confirmation. Once your order has been processed and scheduled for dispatch, you will receive a confirmation email with your tracking details.')
  drawParagraph('Processing times may vary during peak seasons or promotional periods.')

  section(2, 'Shipping and Delivery Timeline')
  drawList([
    'Local (Within China): 5–10 business days — Standard ground delivery via trusted logistics partners.',
    'Regional (Neighboring Countries): 10–15 business days — International delivery handled by our freight carriers. Customs processing may extend delivery times.',
    'International: 15–25 business days — Delivery time may vary depending on customs clearance and local courier services.',
    'Air Shipping (Worldwide): 3–7 business days — Fast and secure air freight delivery for select sofa models and regions.',
  ])
  drawParagraph('Note: Delivery times are estimates and may vary due to factors beyond our control such as weather conditions, customs delays, or high-demand periods.')

  section(3, 'Shipping Costs')
  drawParagraph('Shipping costs are calculated based on your location, order size, and weight. The total shipping cost will be displayed at checkout before payment. We occasionally offer free shipping promotions on select items or order values — check our homepage or product pages for details.')

  section(4, 'Order Tracking')
  drawParagraph('Once your order has been shipped, you will receive a tracking number via email or SMS. You can use this number to track your order’s status directly on the courier’s website.')

  section(5, 'Delivery and Receiving')
  drawParagraph('To ensure safe delivery, our team or delivery partners will contact you prior to arrival. Please ensure someone is available to receive and inspect your order at the delivery address. We recommend checking the packaging and product upon delivery and reporting any visible damage immediately.')

  section(6, 'Delays or Delivery Issues')
  drawParagraph(`If your order is delayed or you experience delivery issues, please contact our Customer Support Team at ${email} or call ${phone}. We will assist you promptly in tracking and resolving any concerns.`)

  section(7, 'Damaged or Lost Items')
  drawParagraph('If your sofa or furniture item arrives damaged or is lost in transit, please notify us within 48 hours of delivery. We will work with our shipping partners to investigate and arrange a replacement or refund as per our Return Policy.')

  section(8, 'Contact Us')
  drawList([
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    company,
  ])

  // Footer page numbers
  const pages = pdfDoc.getPages()
  pages.forEach((p, i) => {
    const footer = `Page ${i + 1} of ${pages.length}`
    p.drawText(footer, {
      x: pageSize.width - margin - font.widthOfTextAtSize(footer, 10),
      y: margin - 24,
      size: 10,
      font,
      color: rgb(0.42, 0.45, 0.5),
    })
  })

  const bytes = await pdfDoc.save()
  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="CompressionSofa-Shipping-Policy.pdf"',
    'Content-Length': String(bytes.length),
  })
  return new NextResponse(Buffer.from(bytes), { status: 200, headers })
}


