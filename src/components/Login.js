import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <a href="/register">Create one here</a>
      </p>

      <style>
        {`
          .login-container {
            max-width: 400px;
            margin: 50px auto;
            text-align: center;
          }
          input {
            display: block;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
          }
          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
          }
          button:hover {
            background-color: #388E3C;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
