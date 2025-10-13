import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserProfile, CustomerProfile, JobSeekerProfile } from "@/lib/auth-new"

interface User {
  id: string
  email: string
}

interface UserState {
  // Auth state
  user: User | null
  profile: UserProfile | null
  fullProfile: CustomerProfile | JobSeekerProfile | null

  // Loading states
  isLoading: boolean
  isProfileLoading: boolean

  // Error state
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setFullProfile: (profile: CustomerProfile | JobSeekerProfile | null) => void
  setLoading: (loading: boolean) => void
  setProfileLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Async actions
  loadProfile: (userId: string) => Promise<void>
  loadFullProfile: (userId: string, userType: string) => Promise<void>
  updateJobSeekerProfile: (updates: any) => Promise<{ success: boolean; error?: string }>
  clearUser: () => void

  // Cache management
  lastProfileFetch: number | null
  lastFullProfileFetch: number | null
  shouldRefetchProfile: () => boolean
  shouldRefetchFullProfile: () => boolean
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      profile: null,
      fullProfile: null,
      isLoading: false,
      isProfileLoading: false,
      error: null,
      lastProfileFetch: null,
      lastFullProfileFetch: null,

      // Basic setters
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setFullProfile: (fullProfile) => set({ fullProfile }),
      setLoading: (isLoading) => set({ isLoading }),
      setProfileLoading: (isProfileLoading) => set({ isProfileLoading }),
      setError: (error) => set({ error }),

      // Cache helpers
      shouldRefetchProfile: () => {
        const { lastProfileFetch } = get()
        if (!lastProfileFetch) return true
        return Date.now() - lastProfileFetch > CACHE_DURATION
      },

      shouldRefetchFullProfile: () => {
        const { lastFullProfileFetch } = get()
        if (!lastFullProfileFetch) return true
        return Date.now() - lastFullProfileFetch > CACHE_DURATION
      },

      // Load basic profile
      loadProfile: async (userId: string) => {
        const { profile, shouldRefetchProfile } = get()

        // Return cached profile if still valid
        if (profile && profile.id === userId && !shouldRefetchProfile()) {
          console.log("Using cached profile")
          return
        }

        set({ isProfileLoading: true, error: null })

        try {
          console.log("Fetching fresh profile for:", userId)
          const response = await fetch(`/api/auth/profile/${userId}`)
          
          if (response.ok) {
            const userProfile = await response.json()
            set({
              profile: userProfile,
              lastProfileFetch: Date.now(),
              isProfileLoading: false,
            })
          } else {
            set({
              error: "Failed to load profile",
              isProfileLoading: false,
            })
          }
        } catch (error) {
          console.error("Error loading profile:", error)
          set({
            error: "Failed to load profile",
            isProfileLoading: false,
          })
        }
      },

      // Load full profile (customer or job seeker specific)
      loadFullProfile: async (userId: string, userType: string) => {
        const { fullProfile, shouldRefetchFullProfile } = get()

        // Return cached full profile if still valid
        if (fullProfile && fullProfile.id === userId && !shouldRefetchFullProfile()) {
          console.log("Using cached full profile")
          return
        }

        set({ isProfileLoading: true, error: null })

        try {
          console.log("Fetching fresh full profile for:", userId, "type:", userType)
          const response = await fetch(`/api/auth/profile/${userId}/full?type=${userType}`)
          
          if (response.ok) {
            const profile = await response.json()
            set({
              fullProfile: profile,
              lastFullProfileFetch: Date.now(),
              isProfileLoading: false,
            })
          } else {
            set({
              error: "Failed to load full profile",
              isProfileLoading: false,
            })
          }
        } catch (error) {
          console.error("Error loading full profile:", error)
          set({
            error: "Failed to load full profile",
            isProfileLoading: false,
          })
        }
      },

      // Update job seeker profile
      updateJobSeekerProfile: async (updates: any) => {
        try {
          const { user } = get()
          if (!user) throw new Error("No user found")

          console.log("Updating job seeker profile with:", updates)

          const response = await fetch(`/api/auth/profile/${user.id}/job-seeker`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
          })

          if (response.ok) {
            // Refresh the profile data after successful update
            await get().loadProfile(user.id)
            await get().loadFullProfile(user.id, "job_seeker")
            return { success: true }
          } else {
            const error = await response.json()
            return { success: false, error: error.message }
          }
        } catch (error: any) {
          console.error("Failed to update job seeker profile:", error)
          return { success: false, error: error.message }
        }
      },

      // Clear all user data
      clearUser: () =>
        set({
          user: null,
          profile: null,
          fullProfile: null,
          error: null,
          lastProfileFetch: null,
          lastFullProfileFetch: null,
          isLoading: false,
          isProfileLoading: false,
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        // Only persist non-sensitive data
        profile: state.profile,
        fullProfile: state.fullProfile,
        lastProfileFetch: state.lastProfileFetch,
        lastFullProfileFetch: state.lastFullProfileFetch,
      }),
    },
  ),
)
