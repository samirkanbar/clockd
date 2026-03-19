import { useState, useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    netlifyIdentity.on('init', (u) => {
      setUser(u)
      setIsLoading(false)
    })

    netlifyIdentity.on('login', (u) => {
      setUser(u)
      netlifyIdentity.close()
    })

    netlifyIdentity.on('logout', () => {
      setUser(null)
    })

    netlifyIdentity.init()

    return () => {
      netlifyIdentity.off('init')
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
    }
  }, [])

  const login = () => netlifyIdentity.open()
  const logout = () => netlifyIdentity.logout()

  return { user, isLoading, login, logout }
}
