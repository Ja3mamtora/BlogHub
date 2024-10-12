
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signInError, setSignInError] = useState(null);
    const { authState, setAuthInfo } = useContext(AuthContext);
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const showWelcomeToast = () => {
      toast.success('Welcome!', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    };
  
    useEffect(() => {
      showWelcomeToast();
    }, []);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response) {
          throw new Error('Failed to sign in');
        }
  
        const data = await response.json();
        const token = data.token;
        const expiryTime = data.data.expiryTime;
  
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("expiryTime", expiryTime);
          console.log('User signed in successfully');
          toast.success('Signed-In successfully!', {
            autoClose: 3000,
            hideProgressBar: true,
          });
          navigate('/dashboard');
        } else {
          throw new Error('Token not found in response');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        toast.error('Sign-In Failed!', {
          autoClose: 3000,
          hideProgressBar: true,
        });
        setSignInError('Failed to sign in. Please check your credentials or verify your email and try again.');
      }
    };
  
    const styles = {
      wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e3f2fd',
        color: '#ffffff',
        margin: '-8px',
        padding: '10px',
      },
      container: {
        maxWidth: '400px',
        width: '100%',
        padding: '2em',
        borderRadius: '10px',
        backgroundColor: '#28282f',
        boxShadow: '0 10px 20px rgba(-2.5, 0, 0, 3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      header: {
        fontSize: '2em',
        lineHeight: '1.1',
        textAlign: 'center',
        marginBottom: '0.5em',
      },
      form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      label: {
        display: 'block',
        marginBottom: '0.5em',
        fontWeight: '600',
        width: '100%',
      },
      input: {
        width: '100%',
        padding: '0.5em',
        border: '1px solid #444',
        borderRadius: '4px',
        boxSizing: 'border-box',
        marginBottom: '1em',
        backgroundColor: '#333',
        color: '#fff',
      },
      button: {
        width: '100%',
        padding: '0.75em',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: '500',
        transition: 'background-color 0.25s',
      },
      buttonHover: {
        backgroundColor: '#0056b3',
      },
      formFooter: {
        marginTop: '1em',
        textAlign: 'center',
      },
      link: {
        color: '#ffffff',
        textDecoration: 'none',
      },
      error: {
        color: 'red',
        textAlign: 'center',
        marginTop: '1em',
      },
      '@media (max-width: 600px)': {
        container: {
          padding: '1em',
        },
        header: {
          fontSize: '1.5em',
        },
        button: {
          fontSize: '0.875em',
        },
      },
    };
    
  
    if (authState.isAuthenticated) {
      return <Navigate to="/dashboard" replace={true} />;
    }
  
    return (
      <div style={styles.wrapper}>
        <ToastContainer />
        <div style={styles.container}>
          <h2 style={styles.header}>Sign In</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={{ marginBottom: '1em', width: '100%' }}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                style={styles.input}
                required
              />
            </div>
            <div style={{ marginBottom: '1em', width: '100%' }}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                style={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            >
              Sign in
            </button>
          </form>
          {signInError && (
            <div style={styles.error}>
              {signInError}
            </div>
          )}
          <div style={styles.formFooter}>
            <a href="/signup" style={styles.link}>Don't have an account? <b>Sign up</b></a>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignIn;