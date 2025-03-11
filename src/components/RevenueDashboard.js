import React from 'react';

function RevenueDashboard({ credits, reports }) {
  const remainingCredits = credits - (reports.length * 1);

  return (
    <div>
      <h2>Your Revenue Dashboard</h2>
      <p><strong>Total Reports Submitted:</strong> {reports.length}</p>
      <p><strong>Credits Earned:</strong> {credits}</p>
      <p><strong>Remaining Credits:</strong> {remainingCredits}</p>
      {remainingCredits <= 0 && <p>You need to submit more reports or pay next month’s subscription.</p>}
    </div>
  );
}

export default RevenueDashboard;
