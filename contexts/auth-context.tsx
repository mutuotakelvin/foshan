"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useUserStore } from "@/store/user-store"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, setUser, setLoading, loadProfile, clearUser } = useUserStore()

  useEffect(() => {
    // Check for existing token in localStorage
    const getInitialSession = async () => {
      try {
        // Only run on client side
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }
        
        const token = localStorage.getItem('auth-token')
        if (token) {
          // Verify token and get user data
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            await loadProfile(userData.id)
          } else {
            localStorage.removeItem('auth-token')
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        setUser(null)
      } finally {
        // Always set loading to false after checking
        setLoading(false)
      }
    }

    getInitialSession()
  }, []) // Remove dependencies to prevent infinite re-renders

  const signOut = async () => {
    try {
      localStorage.removeItem('auth-token')
      clearUser()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading: isLoading, signOut }}>{children}</AuthContext.Provider>
}
