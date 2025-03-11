import React from 'react';

function Leaderboard({ topReporters }) {
  return (
    <div>
      <h2>Top Reporters This Month</h2>
      <ol>
        {topReporters.map((business, index) => (
          <li key={index}>
            {business.name} - {business.reports} Reports
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
