import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Search() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const normalizePhoneNumber = (input) => input.replace(/\D/g, '');

  const handleSearch = async () => {
    if (phoneNumber.trim() === '') return;
    setLoading(true);
    setResults([]);
    setIsFirstSearch(false);

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

      setResults(filteredResults);
      setLoading(false);
    } catch (error) {
      console.error('Error searching reports:', error);
      setLoading(false);
    }
  };

  const calculateRiskScore = (reports) => {
    let score = 700;
    reports.forEach(report => score += report.points);
    if (score < 0) score = 0;
    if (score > 1000) score = 1000;
    return score;
  };

  const getMostRecentDate = (reports) => {
    if (reports.length === 0) return 'No Reports Available';
    const sortedReports = reports.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    const mostRecent = sortedReports[0].timestamp.toDate();
    return new Date(mostRecent).toLocaleString();
  };

  const getReportSummary = (reports) => {
    const summary = {};
    let totalPositive = 0;
    let totalNegative = 0;

    reports.forEach(report => {
      const reason = report.reason || 'No Reason Provided';
      summary[reason] = (summary[reason] || 0) + 1;
      if (report.points > 0) totalPositive++;
      else totalNegative++;
    });

    summary['✅ Total Positive Reports'] = totalPositive;
    summary['❌ Total Negative Reports'] = totalNegative;
    return summary;
  };

  const getScoreColor = (score) => {
    if (score <= 399) return '#FF0000';
    if (score >= 400 && score <= 650) return '#FFA500';
    if (score >= 651) return '#4CAF50';
  };

  return (
    <div className="search-section">
      <div className="search-card">
        <h2>Search Customer History</h2>
        <input 
          type="text"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {loading && <p>Searching...</p>}

        {!loading && !isFirstSearch && (
          <div className="search-results">
            <div className="result-header">
              <div className="score-small">
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

              <div className="customer-info">
                <p><strong>Customer Score:</strong> {calculateRiskScore(results)}</p>
                <p><strong>Most Recent Report:</strong> {getMostRecentDate(results)}</p>
                <p><strong>Total Reports:</strong> {results.length}</p>
              </div>
            </div>

            <div className="report-breakdown">
              <div className="column">
                <div className="row">
                  <h4>✅ Total Positive Reports:</h4>
                  <p>{getReportSummary(results)['✅ Total Positive Reports']}</p>
                </div>
                <div className="row">
                  <h4>❌ Total Negative Reports:</h4>
                  <p>{getReportSummary(results)['❌ Total Negative Reports']}</p>
                </div>
              </div>

              <div className="column">
                <h4>Report Breakdown:</h4>
                {Object.entries(getReportSummary(results)).map(([reason, count]) => (
                  !reason.includes('Total') && (
                    <div className="row" key={reason}>
                      <strong>{reason}:</strong>
                      <p>{count}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
{`
.search-section {
  padding: 20px;
}

.search-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 1000px;
  margin: 0 auto;
}

.search-card input {
  width: 95%;
  padding: 10px;
  margin-bottom: 10px;
}

.search-card button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.score-small {
  width: 100px;
  height: 100px;
}

.customer-info p {
  margin: 5;
}

/* ✅🔥 THIS IS THE SECTION YOU CARE ABOUT 🔥✅ */
.report-breakdown {
  display: flex;
  gap: 40px;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.column {
  flex: 1;
  min-width: 250px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  margin-bottom: 15px; /* ✅ THIS ADDS A BIGGER GAP BETWEEN LINES */
}

.row p {
  font-size: 14px;
  margin: 0;
  font-weight: bold;
  color: #000;
}

.column h4 {
  font-size: 14px;
  margin-bottom: 5px;
  text-transform: uppercase;
  font-weight: bold;
  color: #000;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 5px;
}

.column p {
  font-size: 14px;
  font-weight: bold;
  color: #000;
}

/* ✅ Added larger gap between TOTAL reports and Breakdown */
.column .row:not(:last-child) {
  margin-bottom: 25px;
}

/* ✅ Increased space between sections */
.column h4:not(:first-child) {
  margin-top: 25px;
}
`}
</style>

    </div>
  );
}

export default Search;
