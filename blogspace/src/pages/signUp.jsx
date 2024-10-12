import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retype, setRetype] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showWelcomeToast = () => {
    toast.success('Welcome!', {
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  useEffect(() => {
    showWelcomeToast();
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRetypeChange = (event) => {
    setRetype(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidPassword(password)) {
      toast.error(
        'Password must be at least 8 characters long, contain one uppercase letter, and one special character.',
        {
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
      return;
    }

    if (password !== retype) {
      toast.error('Passwords do not match!', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      toast.success('Signed up successfully! Verify your email.', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      window.location.href = '/signin';
    } catch (error) {
      toast.error('Sign-up failed!', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#e3f2fd',
      margin: '-8px',
      padding: '10px',
    },
    container: {
      maxWidth: '400px',
      width: '100%',
      padding: '2em',
      borderRadius: '10px',
      backgroundColor: '#282828',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#ffffff',
    },
    header: {
      fontSize: '2em',
      textAlign: 'center',
      marginBottom: '0.5em',
      color: '#ffffff',
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
      color: '#ffffff',
    },
    input: {
      width: '100%',
      padding: '0.5em',
      border: '1px solid #444',
      borderRadius: '4px',
      backgroundColor: '#333',
      color: '#ffffff',
      marginBottom: '1em',
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

  return (
    <div style={styles.wrapper}>
      <ToastContainer />
      <div style={styles.container}>
        <h2 style={styles.header}>Sign Up</h2>
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
          <div style={{ marginBottom: '1em', width: '100%' }}>
            <label htmlFor="retype" style={styles.label}>Re-Type Password</label>
            <input
              type="password"
              id="retype"
              value={retype}
              onChange={handleRetypeChange}
              style={styles.input}
              required
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={isSubmitting}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p>By signing up, you accept our <b>terms</b> and <b>privacy policy</b>.</p>
        </form>
        <div style={styles.formFooter}>
          <a href="/signin" style={styles.link}>Already have an account? <b>Sign In</b></a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
