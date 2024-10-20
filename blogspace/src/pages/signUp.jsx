import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const quotes = [
  "A reader lives a thousand lives before he dies. The man who never reads lives only one. - George R.R. Martin",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
  "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book. - Groucho Marx",
  "You can never get a cup of tea large enough or a book long enough to suit me. - C.S. Lewis",
  "Reading is essential for those who seek to rise above the ordinary. - Jim Rohn"
]

export default function Component() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retype, setRetype] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!isValidPassword(password)) {
      toast.error('Password must be at least 8 characters long, contain one uppercase letter, and one special character.')
      return
    }

    if (password !== retype) {
      toast.error('Passwords do not match!')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Signed up successfully! Verify your email.')
      navigate('/signin')
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('Sign-up failed!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
    return passwordRegex.test(password)
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="card shadow-lg" style={{ 
        maxWidth: '450px', 
        width: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: 'none',
        borderRadius: '15px'
      }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4" style={{ fontWeight: '300', color: '#333' }}>Sign Up</h2>
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
            <div className="mb-3">
              <label htmlFor="retype" className="form-label" style={{ color: '#555' }}>Re-Type Password</label>
              <input
                type="password"
                className="form-control"
                id="retype"
                value={retype}
                onChange={(e) => setRetype(e.target.value)}
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
            }} disabled={isSubmitting}>
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center mt-3" style={{ color: '#555', fontSize: '0.9em' }}>
            By signing up, you accept our <b>terms</b> and <b>privacy policy</b>.
          </p>
          <div className="text-center mt-3">
            <a href="/signin" className="text-decoration-none" style={{ color: '#4a4a4a' }}>Already have an account? <b>Sign In</b></a>
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