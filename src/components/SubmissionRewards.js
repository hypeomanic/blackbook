import React from 'react';

function SubmissionRewards({ credits, reports }) {
  const remainingReportsForFreeMonth = 100 - (reports.length % 100);

  return (
    <div>
      <h2>Submission Rewards</h2>
      <p><strong>Total Reports Submitted:</strong> {reports.length}</p>
      <p><strong>Total Credits Earned:</strong> {credits}</p>
      <p><strong>Reports Until Next Free Month:</strong> {remainingReportsForFreeMonth}</p>
    </div>
  );
}

export default SubmissionRewards;
