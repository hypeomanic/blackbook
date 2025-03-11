import React from 'react';

function MonthlyPerformanceReport({ reports, credits, referralCredits }) {
  const totalCredits = credits + referralCredits;
  const totalReports = reports.length;

  return (
    <div>
      <h2>Monthly Performance Report</h2>
      <p><strong>Total Reports Submitted:</strong> {totalReports}</p>
      <p><strong>Total Earned Credits:</strong> {totalCredits}</p>
      <p><strong>Credits From Submissions:</strong> {credits}</p>
      <p><strong>Credits From Referrals:</strong> {referralCredits}</p>

      <h3>Breakdown of This Month's Reports:</h3>
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            <strong>Customer:</strong> {report.customerName} <br />
            <strong>Behavior:</strong> {report.behavior} <br />
            <strong>Date:</strong> {report.date}
          </li>
        ))}
      </ul>

      <h3>What Happens Next?</h3>
      <p>Your credits will automatically reduce your subscription cost.</p>
      <p>Submit more reports or referrals to keep earning credits!</p>
    </div>
  );
}

export default MonthlyPerformanceReport;
