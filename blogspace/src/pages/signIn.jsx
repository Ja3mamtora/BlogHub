import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signInError, setSignInError] = useState(null)
  const { authState, login } = useContext(AuthContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSignInError(null)
    try {
      const response = await axios.post('https://api.example.com/signin', {
        email,
        password
      })
      
      if (response.data && response.data.token) {
        login(response.data.token)
        toast.success('Signed in successfully!')
        navigate('/dashboard')
      } else {
        throw new Error('No token received from the server')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setSignInError('Failed to sign in. Please check your credentials and try again.')
      toast.error('Sign-in failed. Please try again.')
    }
  }

  useEffect(() => {
    toast.info('Welcome to our minimalist blog!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }, [])

  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace={true} />
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="card shadow-lg" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: 'none',
        borderRadius: '15px'
      }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4" style={{ fontWeight: '300', color: '#333' }}>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ color: '#555' }}>Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: 'none', borderRadius: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ color: '#555' }}>Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: 'none', borderRadius: '8px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ 
              backgroundColor: '#4a4a4a', 
              border: 'none', 
              borderRadius: '8px',
              padding: '10px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>Sign in</button>
          </form>
          {signInError && (
            <div className="alert alert-danger mt-3" role="alert" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#721c24', border: 'none', borderRadius: '8px' }}>
              {signInError}
            </div>
          )}
          <div className="text-center mt-3">
            <a href="/signup" className="text-decoration-none" style={{ color: '#4a4a4a' }}>Don't have an account? <b>Sign up</b></a>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}