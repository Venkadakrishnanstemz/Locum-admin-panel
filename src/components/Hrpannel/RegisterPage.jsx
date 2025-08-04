import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'hr'
  });
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

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some((user) => user.email === formData.email)) {
      setError('User already exists');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newUser = {
        ...formData,
        id: Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3182ce&color=fff`
      };

      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
            minLength="6"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ ...styles.input, paddingRight: '1rem' }}
            required
          >
            <option value="hr">HR Manager</option>
            <option value="admin">Administrator</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#80cbc4' : '#00796b',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #64d6a6, #3cc8b5)',
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
  button: {
    width: '100%',
    padding: '0.75rem',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px'
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '14px',
    color: '#555'
  },
  error: {
    color: '#d32f2f',
    backgroundColor: '#fbe9e7',
    border: '1px solid #f44336',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem'
  }
};

export default RegisterPage;
