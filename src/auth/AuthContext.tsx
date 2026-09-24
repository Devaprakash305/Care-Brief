import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { UserProfile, UserRole } from '../types'

interface AuthContextValue {
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string, requestedRole: UserRole) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function mapProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: String(row.id ?? ''),
    authUserId: String(row.auth_user_id ?? ''),
    name: String(row.name ?? 'User'),
    role: String(row.role ?? 'clinician'),
    department: String(row.department ?? ''),
    hospital: String(row.hospital ?? ''),
    email: String(row.email ?? ''),
    avatarUrl: (row.avatar_url ?? row.avatarUrl) as string | undefined
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (currentSession: Session | null): Promise<UserProfile | null> => {
    setSession(currentSession)
    if (!currentSession?.user) {
      setProfile(null)
      return null
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', currentSession.user.id)
      .maybeSingle()
    if (error) throw error
    const nextProfile = data ? mapProfile(data as Record<string, unknown>) : null
    setProfile(nextProfile)
    return nextProfile
  }

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error
        if (mounted) return loadProfile(data.session)
      })
      .catch((error) => console.error('Unable to restore authentication session:', error))
      .finally(() => {
        if (mounted) setLoading(false)
      })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void loadProfile(nextSession).catch((error) => console.error('Unable to load user profile:', error))
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, requestedRole: UserRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const nextProfile = await loadProfile(data.session)
    const actualRole = String(nextProfile?.role || '')
    if (actualRole && actualRole !== requestedRole && actualRole !== 'admin') {
      await supabase.auth.signOut()
      setSession(null)
      setProfile(null)
      throw new Error(`This account is registered as ${actualRole}, not ${requestedRole}.`)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  return <AuthContext.Provider value={{ session, profile, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
