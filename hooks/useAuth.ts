import React from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

const auth = getAuth()

export function useAuth() {
  const [user, setUser] = React.useState<User>()

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user)
      } else {
        // User is signed out
        setUser(undefined)
      }
    })

    return unsubscribeFromAuthStatuChanged
  }, [])

  return {
    user
  }
}
