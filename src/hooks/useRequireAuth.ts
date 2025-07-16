import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

interface UseRequireAuthOptions {
  redirectTo?: string
  redirectIfAuthenticated?: boolean
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/', redirectIfAuthenticated = false } = options
  const router = useRouter()
  const { isLoaded, userId } = useAuth()

  useEffect(() => {
    if (!isLoaded) return

    if (redirectIfAuthenticated && userId) {
      // Redirect authenticated users (for landing page)
      router.push('/menus')
    } else if (!redirectIfAuthenticated && !userId) {
      // Redirect unauthenticated users (for protected pages)
      router.push(redirectTo)
    }
  }, [isLoaded, userId, router, redirectTo, redirectIfAuthenticated])

  return {
    isLoaded,
    userId,
    isAuthenticated: !!userId,
    isLoading: !isLoaded
  }
} 