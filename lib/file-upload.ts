export interface FileUploadResult {
  success: boolean
  url?: string
  fileName?: string
  fileSize?: number
  error?: string
}

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    }
  }

  // Check file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "File must be PDF, DOC, DOCX, or TXT format",
    }
  }

  // Check file name
  if (!file.name || file.name.trim() === "") {
    return {
      valid: false,
      error: "File must have a valid name",
    }
  }

  return { valid: true }
}

export async function uploadResume(file: File, userId: string): Promise<FileUploadResult> {
  try {
    console.log("Starting resume upload for user:", userId)
    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Validate file
    const validation = validateResumeFile(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    // Upload file via API
    const response = await fetch('/api/upload/resume', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Upload failed'
      }
    }

    console.log("Resume upload completed successfully")

    return {
      success: true,
      url: result.url,
      fileName: result.fileName,
      fileSize: result.fileSize,
    }
  } catch (err) {
    console.error("Unexpected error during file upload:", err)
    return {
      success: false,
      error: "An unexpected error occurred during file upload",
    }
  }
}

export async function deleteResume(userId: string, fileName: string): Promise<boolean> {
  try {
    const response = await fetch('/api/upload/resume', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, fileName })
    })

    return response.ok
  } catch (err) {
    console.error("Unexpected error deleting resume:", err)
    return false
  }
}

export function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase()

  switch (ext) {
    case "pdf":
      return "📄"
    case "doc":
    case "docx":
      return "📝"
    case "txt":
      return "📃"
    default:
      return "📎"
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}