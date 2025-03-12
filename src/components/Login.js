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
      {/* ✅ LEFT SIDE - Sales Content */}
      <div className="content-section">
        <h1>📊 Track Customer Behavior & Protect Your Business</h1>
        <p>
          Ever had a customer fail to pay, damage property, or cause major issues?  
          <strong> Blackbook Platform</strong> allows businesses like yours to submit reports  
          on customers who create negative experiences — protecting other businesses from the same fate.
        </p>

        <h3>💡 How It Works:</h3>
        <div className="steps">
          <div className="step">
            <strong>✅ Step 1: Submit Reports</strong>
            <p>
              Anytime you have a great or bad experience with a customer, you can submit a report.  
              Positive reports improve their customer credit score. Negative reports decrease it.
            </p>
          </div>

          <div className="step">
            <strong>✅ Step 2: Build a Customer Credit Score</strong>
            <p>
              Customers accumulate a "Customer Credit Score" based on how they treat businesses.  
              This score helps protect you and others from repeat bad customers.
            </p>
          </div>

          <div className="step">
            <strong>✅ Step 3: Protect Yourself and Others</strong>
            <p>
              When another business submits a report about a customer, you'll be able to  
              see their history BEFORE you serve them — protecting your business from unnecessary headaches.
            </p>
          </div>

          <div className="step">
            <strong>✅ 100% Free For Businesses</strong>
            <p>
              This platform is 100% free for businesses to use. There are no hidden fees,  
              no premium upgrades — just pure protection for your business.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ RIGHT SIDE - Login Form */}
      <div className="form-section">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? 
          <span 
            className="link"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </span>
        </p>
      </div>

      {/* ✅ BEAUTIFUL INLINE CSS */}
      <style>
        {`
          .login-container {
            display: flex;
            max-width: 1000px;
            margin: 50px auto;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
          }

          .content-section {
            flex: 1;
            background-color: #4CAF50;
            color: white;
            padding: 40px;
          }

          .content-section h1 {
            font-size: 24px;
            margin-bottom: 15px;
          }

          .content-section p {
            margin-bottom: 15px;
          }

          .content-section .steps {
            margin-top: 20px;
          }

          .content-section .step {
            background-color: #3b9f48;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
          }

          .form-section {
            flex: 1;
            padding: 40px;
            background-color: white;
          }

          .form-section h2 {
            margin-bottom: 20px;
          }

          .form-section input, .form-section button {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
          }

          .form-section button {
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
          }

          .form-section button:hover {
            background-color: #45a049;
          }

          .form-section .link {
            color: #4CAF50;
            text-decoration: underline;
            cursor: pointer;
          }

          .error-message {
            color: red;
            font-size: 14px;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
