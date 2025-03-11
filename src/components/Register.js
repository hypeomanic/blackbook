import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

function Register() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Automatically create Business Profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        businessName,
        businessWebsite,
        businessPhone,
        email: user.email,
        createdAt: new Date(),
      });

      // ✅ Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error("⚠️ Error creating account:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Business Website (optional)"
          value={businessWebsite}
          onChange={(e) => setBusinessWebsite(e.target.value)}
        />
        <input
          type="text"
          placeholder="Business Phone Number"
          value={businessPhone}
          onChange={(e) => setBusinessPhone(e.target.value)}
          required
        />
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
        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account? <a href="/login">Log in here</a>
      </p>

      <style>
        {`
          .register-container {
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

export default Register;
