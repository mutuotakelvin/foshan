"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { uploadResume, validateResumeFile, getFileIcon, formatFileSize } from "@/lib/file-upload"
import { useAuth } from "@/contexts/auth-context"

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string, fileSize: number) => void
  userId: string
  currentFile?: {
    name: string
    size: number
    url: string
  }
  disabled?: boolean
}

export function FileUpload({ onFileUploaded, userId, currentFile, disabled = false }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  // Check if user is authenticated and matches the userId
  const isAuthenticated = user && user.id === userId

  useEffect(() => {
    if (!isAuthenticated) {
      setError("You must be logged in to upload files")
    } else {
      setError("")
    }
  }, [isAuthenticated])

  const handleFileSelect = async (file: File) => {
    if (!isAuthenticated) {
      setError("You must be logged in to upload files")
      return
    }

    setError("")
    setSuccess("")
    setUploadProgress(0)

    // Validate file
    const validation = validateResumeFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setUploading(true)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await uploadResume(file, userId)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url && result.fileName && result.fileSize) {
        setSuccess(`File "${result.fileName}" uploaded successfully!`)
        onFileUploaded(result.url, result.fileName, result.fileSize)
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (err) {
      setError("An unexpected error occurred during upload")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
      setTimeout(() => {
        setUploadProgress(0)
        setSuccess("")
      }, 3000)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    if (!isAuthenticated) {
      setError("You must be logged in to upload files")
      return
    }

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const openFileDialog = () => {
    if (!isAuthenticated) {
      setError("You must be logged in to upload files")
      return
    }
    fileInputRef.current?.click()
  }

  const removeCurrentFile = () => {
    onFileUploaded("", "", 0)
    setSuccess("")
    setError("")
  }

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You must be logged in to upload files.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current File Display */}
      {currentFile && currentFile.name && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(currentFile.name)}</span>
            <div>
              <p className="font-medium text-green-800">{currentFile.name}</p>
              <p className="text-sm text-green-600">{formatFileSize(currentFile.size)}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeCurrentFile}
            disabled={disabled || uploading}
            className="text-green-700 hover:text-green-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
        } ${disabled || !isAuthenticated ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={disabled || !isAuthenticated ? undefined : openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploading || !isAuthenticated}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="text-slate-600">Uploading...</p>
            <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 mb-2">
              {dragOver ? "Drop your file here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-slate-500">PDF, DOC, DOCX, TXT (max 5MB)</p>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              disabled={disabled || !isAuthenticated}
              onClick={(e) => {
                e.stopPropagation()
                openFileDialog()
              }}
            >
              <File className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
