import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads', 'resumes')

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      )
    }

    // Ensure uploads directory exists
    await ensureUploadsDir()

    // Generate unique filename with timestamp
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const timestamp = Date.now()
    const fileName = `${userId}_resume_${timestamp}.${fileExt}`
    const filePath = join(UPLOADS_DIR, fileName)

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return public URL
    const publicUrl = `/uploads/resumes/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, fileName } = await request.json()

    if (!userId || !fileName) {
      return NextResponse.json(
        { error: 'userId and fileName are required' },
        { status: 400 }
      )
    }

    const filePath = join(UPLOADS_DIR, fileName)
    
    if (existsSync(filePath)) {
      await unlink(filePath)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false, error: 'File not found' })
  } catch (error) {
    console.error('File delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
