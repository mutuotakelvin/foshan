import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db'
import type { User } from '@prisma/client'

type UserType = 'CUSTOMER' | 'JOB_SEEKER'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  zipCode?: string
  userType: UserType
  createdAt: Date
  updatedAt: Date
}

export interface CustomerProfile extends UserProfile {
  newsletterSubscribed: boolean
  totalOrders: number
  totalSpent: number
  status: string
}

export interface JobSeekerProfile extends UserProfile {
  positionInterest?: string
  experienceLevel?: string
  availability?: string
  bio?: string
  resumeUrl?: string
  resumeFileName?: string
  resumeFileSize?: number
  resumeUploadedAt?: Date
  applicationStatus: string
  verificationStatus: string
  verificationNotes?: string
  verifiedAt?: Date
  jobAlerts: boolean
  canEditApplication: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function signUp(
  email: string,
  password: string,
  userType: UserType,
  additionalData: any = {}
): Promise<{ data: any; error: any }> {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        data: null,
        error: { message: 'User already exists with this email' }
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: additionalData.firstName || '',
        lastName: additionalData.lastName || '',
        phone: additionalData.phone || '',
        address: additionalData.address || '',
        city: additionalData.city || '',
        zipCode: additionalData.zipCode || '',
        userType
      }
    })

    // Create specific profile based on user type
    if (userType === 'CUSTOMER') {
      await db.customerProfile.create({
        data: {
          userId: user.id,
          newsletterSubscribed: additionalData.newsletterSubscribed || false
        }
      })
    } else if (userType === 'JOB_SEEKER') {
      await db.jobSeekerProfile.create({
        data: {
          userId: user.id,
          positionInterest: additionalData.positionInterest || '',
          experienceLevel: additionalData.experienceLevel || '',
          availability: additionalData.availability || '',
          bio: additionalData.bio || '',
          resumeUrl: additionalData.resumeUrl || null,
          resumeFileName: additionalData.resumeFileName || null,
          resumeFileSize: additionalData.resumeFileSize || null,
          jobAlerts: additionalData.jobAlerts || false
        }
      })
    }

    return { data: { user }, error: null }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      data: null,
      error: { message: 'Failed to create user account' }
    }
  }
}

export async function signIn(email: string, password: string): Promise<{ data: any; error: any }> {
  try {
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return {
        data: null,
        error: { message: 'Invalid email or password' }
      }
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return {
        data: null,
        error: { message: 'Invalid email or password' }
      }
    }

    const token = generateToken(user.id)

    return {
      data: { user: { id: user.id, email: user.email }, token },
      error: null
    }
  } catch (error) {
    console.error('Signin error:', error)
    return {
      data: null,
      error: { message: 'Failed to sign in' }
    }
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { customerProfile: true }
    })

    if (!user || user.userType !== 'CUSTOMER' || !user.customerProfile) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      newsletterSubscribed: user.customerProfile.newsletterSubscribed,
      totalOrders: user.customerProfile.totalOrders,
      totalSpent: user.customerProfile.totalSpent,
      status: user.customerProfile.status
    }
  } catch (error) {
    console.error('Error fetching customer profile:', error)
    return null
  }
}

export async function getJobSeekerProfile(userId: string): Promise<JobSeekerProfile | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { jobSeekerProfile: true }
    })

    if (!user || user.userType !== 'JOB_SEEKER' || !user.jobSeekerProfile) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      positionInterest: user.jobSeekerProfile.positionInterest,
      experienceLevel: user.jobSeekerProfile.experienceLevel,
      availability: user.jobSeekerProfile.availability,
      bio: user.jobSeekerProfile.bio,
      resumeUrl: user.jobSeekerProfile.resumeUrl,
      resumeFileName: user.jobSeekerProfile.resumeFileName,
      resumeFileSize: user.jobSeekerProfile.resumeFileSize,
      resumeUploadedAt: user.jobSeekerProfile.resumeUploadedAt,
      applicationStatus: user.jobSeekerProfile.applicationStatus,
      verificationStatus: user.jobSeekerProfile.verificationStatus,
      verificationNotes: user.jobSeekerProfile.verificationNotes,
      verifiedAt: user.jobSeekerProfile.verifiedAt,
      jobAlerts: user.jobSeekerProfile.jobAlerts,
      canEditApplication: user.jobSeekerProfile.canEditApplication
    }
  } catch (error) {
    console.error('Error fetching job seeker profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        phone: updates.phone,
        address: updates.address,
        city: updates.city,
        zipCode: updates.zipCode
      }
    })

    return { data: user, error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { data: null, error }
  }
}

export async function updateCustomerProfile(userId: string, updates: any) {
  try {
    const profile = await db.customerProfile.update({
      where: { userId },
      data: updates
    })

    return { data: profile, error: null }
  } catch (error) {
    console.error('Error updating customer profile:', error)
    return { data: null, error }
  }
}

export async function updateJobSeekerProfile(userId: string, updates: any) {
  try {
    const profile = await db.jobSeekerProfile.update({
      where: { userId },
      data: updates
    })

    return { data: profile, error: null }
  } catch (error) {
    console.error('Error updating job seeker profile:', error)
    return { data: null, error }
  }
}
