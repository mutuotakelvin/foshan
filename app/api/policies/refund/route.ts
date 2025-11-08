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
  const pageSize = { width: 595.28, height: 841.89 } // A4
  let page = pdfDoc.addPage([pageSize.width, pageSize.height])
  const margin = 32
  let y = page.getHeight() - margin

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const ensureSpace = (requiredHeight = 18) => {
    if (y - requiredHeight < margin) {
      page = pdfDoc.addPage([pageSize.width, pageSize.height])
      y = page.getHeight() - margin
    }
  }

  const drawHeading = (text: string, size = 16) => {
    const safe = sanitize(text)
    const textWidth = fontBold.widthOfTextAtSize(safe, size)
    ensureSpace(size + 8)
    page.drawText(safe, {
      x: (page.getWidth() - textWidth) / 2,
      y,
      size,
      font: fontBold,
      color: rgb(0.07, 0.09, 0.15),
    })
    y -= size + 8
  }

  const drawSubtle = (text: string, size = 9) => {
    const safe = sanitize(text)
    const textWidth = font.widthOfTextAtSize(safe, size)
    ensureSpace(size + 18)
    page.drawText(safe, {
      x: (page.getWidth() - textWidth) / 2,
      y,
      size,
      font,
      color: rgb(0.42, 0.45, 0.5),
    })
    y -= size + 18
  }

  const sanitize = (s: string) =>
    s
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u00A0]/g, ' ')

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
    page.drawText(`${num}. ${sanitize(title)}`,
      { x: margin, y, size: 12, font: fontBold, color: rgb(0.07, 0.09, 0.15) })
    y -= 14
  }

  const lastUpdated = 'Last updated: October 31, 2025'
  const email = 'info@compressionsofa.store'
  const phone = '+85593697395'
  const address = 'Zhaojia Industrial Zone, Zhongye West Third Road, Nanhai District, Foshan City'

  drawHeading('Refund Policy')
  drawSubtle(lastUpdated)

  drawParagraph('Thank you for shopping at CompressionSofa ("we", "our", "us"). If you are not entirely satisfied with your purchase, we’re here to help.')

  section(1, 'What this policy covers')
  drawParagraph('This policy applies to purchases made via our website compressionsofa.store ("Site"). It covers product returns, cancellations, refunds and how they are processed.')

  section(2, 'Eligibility for a refund')
  drawParagraph('You may request a refund if:')
  drawList([
    'The item you purchased is defective, damaged, or materially not as described.',
    'You cancelled a service or order before it was dispatched (if applicable) or before we began work (for services).',
    'Otherwise, change of mind refunds may be handled differently (see Section 4).',
  ])
  drawParagraph('To be eligible, you must:')
  drawList([
    'Contact us within 7 days of delivery (or service start) to request a refund.',
    'Provide your order number, proof of purchase, and the reason for the refund.',
    'Return the product to us (if required) in its original condition, packaging, with all accessories, within 14 days (if relevant).',
    'Ensure that the request complies with any additional conditions stated at the product page.',
  ])

  section(3, 'How refunds are processed')
  drawList([
    'Once we receive your refund request and approve it, we will process the refund.',
    'Refunds may take between 3 to 10 working days (or as per the banking/payment channel) to reflect in your account.',
    'Refunds will be made to the same payment method used in the original purchase wherever possible.',
    'Please note: Processing fees charged by payment processors or banks are non‑refundable.',
    'We may deduct any restocking or administrative fees from the refund if your request falls under “change of mind” and these were clearly disclosed at the time of purchase.',
  ])

  section(4, 'Change of mind / non‑fault refunds')
  drawParagraph('If you simply change your mind after purchasing (for example you ordered the wrong size or colour), we may offer a refund or store credit at our discretion. In these cases:')
  drawList([
    'You must contact us within 7 days of delivery.',
    'The product must be returned unused, in original packaging, and in resalable condition.',
    'You may be responsible for the cost of returning the item and any shipping/handling fees.',
    'The refund will be for the product price paid minus any non‑refundable processing fees and minus any clearly stated administrative/restocking fees.',
    'We may instead offer exchange or store credit if preferred.',
  ])

  section(5, 'Partial refunds')
  drawParagraph('We may offer partial refunds in certain cases (for example: item returned with minor damage, missing accessories, or you received a partial benefit of the service). If we agree to a partial refund:')
  drawList([
    'We will clearly state the amount of refund and reason in our communication.',
    'We will ensure you consent to the partial refund before processing.',
  ])

  section(6, 'Chargebacks and disputes')
  drawParagraph('In the event a customer initiates a chargeback (via their bank) instead of following our refund procedure:')
  drawList([
    'We will cooperate with relevant parties to respond to chargeback claims.',
    'If value was provided (product/service delivered) and evidence supports this, we may decline the chargeback. In such cases we may provide receipts, delivery confirmations, email correspondence or other evidence.',
    'If the chargeback is accepted, the full transaction amount may be reversed to the customer, and we may not receive back our processing fees.',
    'It is in both our interests to try to resolve refund requests directly through this policy before a chargeback is filed.',
  ])

  section(7, 'How to request a refund')
  drawParagraph('Please contact our customer service team at:')
  drawList([
    `Email: ${email}`,
    'Subject line: Refund Request – Order #[your order number]',
  ])
  drawParagraph('Please provide your order number, date of purchase, reasons for refund, and any relevant photos (if product issue). We will review your request and respond within 5 business days.')

  section(8, 'Shipping/return costs')
  drawList([
    'If the refund is due to our error (defective/damaged item, wrong product), we will cover the cost of return shipping.',
    'If the refund is due to change of mind, the customer will be responsible for return shipping (unless otherwise agreed).',
    'Any original shipping charges paid by you may be non‑refundable if disclosed at purchase.',
  ])

  section(9, 'Updates to this policy')
  drawParagraph('We may revise this Refund Policy from time to time without prior notice. The “Last updated” date at the top will reflect the latest version. Your continued purchase after changes means you accept the updated terms.')

  section(10, 'Contact us')
  drawList([
    `Email: ${email}`,
    `Address: ${address}`,
    `Phone: ${phone}`,
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
    'Content-Disposition': 'attachment; filename="CompressionSofa-Refund-Policy.pdf"',
    'Content-Length': String(bytes.length),
  })
  return new NextResponse(Buffer.from(bytes), { status: 200, headers })
}


