import { useState, useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'

// Initialize once at module level, not inside the component
netlifyIdentity.init()

export function useAuth() {
  const [user, setUser] = useState(() => netlifyIdentity.currentUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const onInit = (u) => {
      setUser(u)
      setIsLoading(false)
    }
    const onLogin = (u) => {
      setUser(u)
      netlifyIdentity.close()
    }
    const onLogout = () => setUser(null)

    netlifyIdentity.on('init', onInit)
    netlifyIdentity.on('login', onLogin)
    netlifyIdentity.on('logout', onLogout)

    // init event may have already fired before this effect ran
    setIsLoading(false)

    return () => {
      netlifyIdentity.off('init', onInit)
      netlifyIdentity.off('login', onLogin)
      netlifyIdentity.off('logout', onLogout)
    }
  }, [])

  return {
    user,
    isLoading,
    login: () => netlifyIdentity.open(),
    logout: () => netlifyIdentity.logout(),
  }
}
