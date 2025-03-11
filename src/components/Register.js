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
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        businessName,
        businessPhone,
        businessWebsite,
        reportsSubmitted: 0,
      });

      alert('✅ Registration successful. Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error("⚠️ Error registering user:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register Your Business</h2>
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
          placeholder="Business Phone" 
          value={businessPhone} 
          onChange={(e) => setBusinessPhone(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Business Website" 
          value={businessWebsite} 
          onChange={(e) => setBusinessWebsite(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
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
        <button type="submit">Register</button>
      </form>

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
            margin: 10px 0;
            padding: 10px;
          }

          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
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
