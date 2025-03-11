import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Search() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Function to normalize phone number for search
  const normalizePhoneNumber = (input) => {
    return input.replace(/\D/g, '');
  };

  // ✅ Handle Search
  const handleSearch = async () => {
    if (phoneNumber.trim() === '') return;
    setLoading(true);
    setResults([]);

    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      const q = query(collection(db, 'reports'), where('customerPhone', '>=', ''), where('customerPhone', '<=', '\uf8ff'));
      const querySnapshot = await getDocs(q);

      const filteredResults = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(report => {
          const savedPhone = normalizePhoneNumber(report.customerPhone);
          return savedPhone.includes(normalizedPhone);
        });

      if (filteredResults.length === 0) {
        setResults([]);
      } else {
        setResults(filteredResults);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error searching reports:', error);
      setLoading(false);
    }
  };

  // ✅ Function to calculate cumulative risk score
  const calculateRiskScore = (reports) => {
    let score = 300; // ✅ Everyone starts "Safe" at 300

    reports.forEach(report => {
      if (report.isPositive) {
        score -= 30; // ✅ Positive reports DECREASE score
      } else {
        score += 100; // ✅ Negative reports INCREASE score
      }
    });

    // ✅ Clamp the score between 0 and 1000
    if (score < 0) score = 0;
    if (score > 1000) score = 1000;
    return score;
  };

  // ✅ Get the most recent report date
  const getMostRecentDate = (reports) => {
    if (reports.length === 0) return 'N/A';
    const sortedReports = reports.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    const mostRecent = sortedReports[0].timestamp.toDate();
    return new Date(mostRecent).toLocaleString();
  };

  // ✅ Count report types
  const getReportSummary = (reports) => {
    const summary = {};
    reports.forEach(report => {
      const type = report.feedbackType;
      if (!summary[type]) {
        summary[type] = 1;
      } else {
        summary[type]++;
      }
    });
    return summary;
  };

  // ✅ Determine score color
  const getScoreColor = (score) => {
    if (score < 300) return '#4CAF50'; // Green (Very Safe)
    if (score < 600) return '#FFA500'; // Orange (Moderate Risk)
    return '#FF0000'; // Red (High Risk)
  };

  return (
    <div className="search-container">
      <h2>Search Customer History</h2>
      <input 
        type="text"
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Searching...</p>}

      {results.length === 0 && !loading && (
        <p>No reports found for this number.</p>
      )}

      {results.length > 0 && (
        <div>
          <h3>Search Results</h3>

          {/* ✅ Single Circle Score */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            <div style={{ width: '100px', height: '100px' }}>
              <CircularProgressbar
                value={calculateRiskScore(results)}
                text={calculateRiskScore(results)}
                styles={{
                  path: { stroke: getScoreColor(calculateRiskScore(results)) },
                  text: { fill: getScoreColor(calculateRiskScore(results)) },
                  trail: { stroke: '#e0e0e0' }
                }}
              />
            </div>

            <div>
              <strong>Risk Score:</strong> {calculateRiskScore(results)} <br />
              <strong>Most Recent Report:</strong> {getMostRecentDate(results)} <br />
              <strong>Total Reports Submitted:</strong> {results.length} <br />
            </div>
          </div>

          {/* ✅ Condensed Report Breakdown */}
          <h4>Report Breakdown</h4>
          <ul>
            {Object.entries(getReportSummary(results)).map(([type, count]) => (
              <li key={type}>
                <strong>{type}:</strong> {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
