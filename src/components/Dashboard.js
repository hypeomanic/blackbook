import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import SubmitReport from './SubmitReport';
import Search from './Search';
import BusinessProfile from './BusinessProfile';

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitExpanded, setIsSubmitExpanded] = useState(false);
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        listenForBusinessReports(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const listenForBusinessReports = (businessId) => {
    const q = query(collection(db, 'reports'), where('businessId', '==', businessId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const businessReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(businessReports);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleSearchResult = (result) => {
    setSearchResult(result);
  };

  return (
    <div className="dashboard-container">
      {/* ✅ WELCOME BANNER */}
      <div className="welcome-banner">
        <h1>Welcome Back, {user?.email}</h1>
        <p>Manage customer reports, view submissions, and track customer performance history.</p>
        <div className="button-group">
          <button onClick={() => setIsProfileExpanded(!isProfileExpanded)}>Business Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ✅ BUSINESS PROFILE EXPANDING SECTION */}
      <div className={`profile-section ${isProfileExpanded ? 'expanded' : ''}`}>
        {isProfileExpanded && <BusinessProfile />}
      </div>

      {/* ✅ SEARCH CUSTOMER HISTORY */}
      <div className="search-section">
        <Search onSearchResult={handleSearchResult} />
        {searchResult && (
          <div className="search-result-box">
            <h3>Customer Search Result</h3>
            <div className="result-grid">
              <div><strong>Name:</strong> {searchResult.name}</div>
              <div><strong>Credit Score:</strong> {searchResult.creditScore}</div>
              <div><strong>Last Report:</strong> {searchResult.lastReport}</div>
              <div><strong>Number of Reports:</strong> {searchResult.reportCount}</div>
              <div><strong>Positive Reports:</strong> {searchResult.positiveReports}</div>
              <div><strong>Negative Reports:</strong> {searchResult.negativeReports}</div>
            </div>
          </div>
        )}
      </div>
{/* ✅ Customer Score Range Visualizer */}
<div className="score-visualizer">
  {/* ✅ Tab Header */}
  <div style={{
    textAlign: 'center',
    marginBottom: '-10px',
    position: 'relative',
    zIndex: '10'
  }}>
    <div style={{
      backgroundColor: '#222',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '8px 8px 0 0',
      display: 'inline-block',
      boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
    }}>
      Understanding Customer Scores
    </div>
  </div>

  {/* ✅ Color Gradient Meter */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '0 0 8px 8px',
    overflow: 'hidden',
    border: '2px solid #e0e0e0',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
  }}>
    <div style={{
      flex: 1,
      padding: '20px',
      backgroundColor: '#FF3B30',
      color: '#fff',
      textAlign: 'center'
    }}>
      <h4>0 - 399</h4>
      <p>High Risk</p>
    </div>

    <div style={{
      flex: 1,
      padding: '20px',
      backgroundColor: '#FF9F00',
      color: '#fff',
      textAlign: 'center'
    }}>
      <h4>400 - 650</h4>
      <p>Moderate Risk</p>
    </div>

    <div style={{
      flex: 1,
      padding: '20px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      textAlign: 'center'
    }}>
      <h4>651 - 799</h4>
      <p>Good Customer</p>
    </div>

    <div style={{
      flex: 1,
      padding: '20px',
      backgroundColor: '#388E3C',
      color: '#fff',
      textAlign: 'center'
    }}>
      <h4>800 - 1000</h4>
      <p>Excellent Customer</p>
    </div>
  </div>

  {/* ✅ SUPER SEXY DISCLAIMER BAR (WATCH THIS) */}
  <div style={{
    backgroundColor: '#121212',
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '0 0 8px 8px',
    textAlign: 'center',
    borderTop: '2px solid #444',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    animation: 'glow 1.5s infinite alternate'
  }}>
    Every customer starts with a default score of <strong>700</strong>. 
    Positive reports <span style={{ color: '#4CAF50' }}>increase</span> their score, 
    while negative reports <span style={{ color: '#FF3B30' }}>decrease</span> it.
  </div>

  {/* ✅ 🔥 ADD THE GLOW EFFECT */}
  <style>
    {`
      @keyframes glow {
        0% {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        100% {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
        }
      }
    `}
  </style>
</div>

      {/* ✅ EXPANDABLE SECTIONS */}
      <div className="report-sections">
        <div className="card" onClick={() => setIsSubmitExpanded(!isSubmitExpanded)}>
          <h3>📩 Submit a Report</h3>
          <p>File a positive or negative report about a customer.</p>
        </div>
        <div className="card" onClick={() => setIsViewExpanded(!isViewExpanded)}>
          <h3>📜 View Your Reports</h3>
          <p>See all the reports you've submitted.</p>
        </div>
      </div>

      {/* ✅ SUBMIT REPORT EXPANDING SECTION */}
      <div className={`submit-section ${isSubmitExpanded ? 'expanded' : ''}`}>
        {isSubmitExpanded && <SubmitReport />}
      </div>

      {/* ✅ VIEW REPORTS EXPANDING SECTION */}
      <div className={`view-section ${isViewExpanded ? 'expanded' : ''}`}>
        {isViewExpanded && (
          <div>
            <h3>Your Reports</h3>
            {loading ? (
              <p>Loading reports...</p>
            ) : reports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              <ul className="report-list">
                {reports.map(report => (
                  <li key={report.id}>
                    <strong>Phone:</strong> {report.customerPhone} <br />
                    <strong>Reason:</strong> {report.reason} <br />
                    <strong>Status:</strong> 
                    <span style={{ color: report.isPositive ? 'green' : 'red' }}>
                      {report.isPositive ? 'Positive' : 'Negative'}
                    </span> <br />
                    <strong>Date:</strong> {new Date(report.timestamp?.toDate()).toLocaleDateString()} <br />
                    <hr />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ✅ FULL PAGE STYLES */}
      <style>
        {`
          .dashboard-container {
            padding: 40px;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }

          .welcome-banner {
            background-color: #4CAF50;
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
          }

          .search-section {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
          }

          .search-result-box {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            max-width: 600px;
          }

          .report-sections {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }

          .card {
            flex: 1;
            background-color: white;
            border: 1px solid #e0e0e0;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
          }

          .card:hover {
            background-color: #f9f9f9;
          }

          .report-list li {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
