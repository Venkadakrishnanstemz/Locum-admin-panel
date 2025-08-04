import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate(user.role === 'hr' ? '/dashboard' : '/admin-dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              id="showPassword"
            />
            <label htmlFor="showPassword" style={styles.checkboxLabel}>Show Password</label>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Forgot <Link to="/forgot-username">Username</Link> /{' '}
            <Link to="/forgot-password">Password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline styles (from your design)
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    padding: '1rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    marginBottom: '1.5rem',
    color: '#00796b'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '14px'
  },
  checkboxLabel: {
    marginLeft: '0.5rem',
    color: '#333'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#00796b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '14px',
    color: '#555'
  },
  errorBox: {
    backgroundColor: '#fdecea',
    color: '#b71c1c',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '1rem'
  }
};

export default LoginPage;
