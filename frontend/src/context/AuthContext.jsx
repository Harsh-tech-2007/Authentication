import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const API = axios.create({
  baseURL: 'http://localhost:4000/api/auth',
  withCredentials: true,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/get-me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function register(username, email, password) {
    const res = await API.post('/register', { username, email, password })
    return res.data
  }

  async function login(email, password) {
    const res = await API.post('/login', { email, password })
    setUser(res.data.user)
    return res.data
  }

  async function logout() {
    await API.post('/logout')
    setUser(null)
  }

  async function verifyEmail(email, otp) {
    const res = await API.post('/verify-email', { email, otp })
    setUser(res.data.user)
    return res.data
  }

  async function forgotPassword(email) {
    const res = await API.post('/forgot-password', { email })
    return res.data
  }

  async function resetPassword(email, otp, password) {
    const res = await API.post('/reset-password', { email, otp, password })
    return res.data
  }

  async function resendVerification(email) {
    const res = await API.post('/resend-verification', { email })
    return res.data
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      register, login, logout,
      forgotPassword, resetPassword, resendVerification, verifyEmail
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
