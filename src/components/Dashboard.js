import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import SubmitReport from './SubmitReport';
import Search from './Search';

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('yourReports');

  // ✅ Business Profile State
  const [businessName, setBusinessName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        listenForBusinessReports(user.uid);
        fetchBusinessProfile(user.uid);
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

  // ✅ Fetch Business Profile Data
  const fetchBusinessProfile = async (businessId) => {
    const docRef = doc(db, 'users', businessId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setBusinessName(data.businessName || '');
      setBusinessWebsite(data.businessWebsite || '');
      setBusinessPhone(data.businessPhone || '');
    }
  };

  // ✅ Handle Saving Business Profile
  const handleSaveBusinessProfile = async () => {
    const userId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userId);

    await setDoc(docRef, {
      businessName,
      businessWebsite,
      businessPhone,
    }, { merge: true });

    alert('✅ Business profile saved successfully.');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';

    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch (error) {
      console.error("⚠️ Error formatting timestamp:", error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* TABS MENU */}
      <div className="tabs">
        <button 
          className={activeTab === 'yourReports' ? 'active' : ''} 
          onClick={() => setActiveTab('yourReports')}
        >
          Your Reports
        </button>

        <button 
          className={activeTab === 'searchReports' ? 'active' : ''} 
          onClick={() => setActiveTab('searchReports')}
        >
          Search Reports
        </button>

        <button 
          className={activeTab === 'submitReport' ? 'active' : ''} 
          onClick={() => setActiveTab('submitReport')}
        >
          Submit a Report
        </button>

        <button 
          className={activeTab === 'businessProfile' ? 'active' : ''} 
          onClick={() => setActiveTab('businessProfile')}
        >
          Business Profile
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="tab-content">
        {activeTab === 'yourReports' && (
          <>
            <h2>Your Submitted Reports</h2>
            {loading ? (
              <p>Loading your reports...</p>
            ) : reports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              <ul>
                {reports.map((report) => (
                  <li key={report.id}>
                    <strong>Phone Number:</strong> {report.customerPhone || 'N/A'}<br />
                    <strong>Reason:</strong> {report.reason || 'N/A'}<br />
                    <strong>Type:</strong>{' '}
                    {report.isPositive ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>
                        ✅ Positive
                      </span>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>
                        🚫 Negative
                      </span>
                    )}<br />
                    <strong>Date Submitted:</strong> {formatTimestamp(report.timestamp)}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {activeTab === 'searchReports' && (
          <>
            <Search />
          </>
        )}

        {activeTab === 'submitReport' && (
          <>
            <SubmitReport />
          </>
        )}

        {/* ✅ BUSINESS PROFILE TAB */}
        {activeTab === 'businessProfile' && (
          <div className="business-profile">
            <h2>Business Profile</h2>
            <p>Add your business information. This will be displayed on the Recognition Wall if you are a top performer.</p>

            <div>
              <label>Business Name:</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label>Business Website:</label>
              <input 
                type="text" 
                value={businessWebsite} 
                onChange={(e) => setBusinessWebsite(e.target.value)} 
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label>Business Phone:</label>
              <input 
                type="text" 
                value={businessPhone} 
                onChange={(e) => setBusinessPhone(e.target.value)} 
                placeholder="Business Phone Number"
              />
            </div>

            <button onClick={handleSaveBusinessProfile}>Save Profile</button>
          </div>
        )}
      </div>

      {/* STYLES */}
      <style>
        {`
          .tabs {
            display: flex;
            gap: 10px;
            margin: 20px 0;
          }

          .tabs button {
            background-color: #e0e0e0;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s ease;
          }

          .tabs button.active {
            background-color: #4CAF50;
            color: white;
          }

          .business-profile input {
            display: block;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
