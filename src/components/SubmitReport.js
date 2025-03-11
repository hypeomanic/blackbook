import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

function SubmitReport({ user }) {
  const [reportType, setReportType] = useState('positive');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const positiveOptions = [
    { label: 'Excellent Service', value: 'excellentService', points: +10 },
    { label: 'Very Responsive', value: 'veryResponsive', points: +8 },
    { label: 'Good Follow-Up', value: 'goodFollowUp', points: +7 },
    { label: 'Punctual and On-Time', value: 'punctual', points: +9 },
    { label: 'High-Quality Work', value: 'highQualityWork', points: +10 },
  ];

  const negativeOptions = [
    { label: 'No Show', value: 'noShow', points: -20 },
    { label: 'Poor Communication', value: 'poorCommunication', points: -10 },
    { label: 'Missed Deadline', value: 'missedDeadline', points: -15 },
    { label: 'Low-Quality Work', value: 'lowQualityWork', points: -12 },
    { label: 'Overcharged or Dishonest', value: 'overcharged', points: -18 },
  ];

  const getOptions = () => {
    return reportType === 'positive' ? positiveOptions : negativeOptions;
  };

  const handleSubmit = async () => {
    if (!customerPhone || !reason) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmitting(true);

    const selectedOption = getOptions().find(opt => opt.value === reason);
    const pointImpact = selectedOption ? selectedOption.points : 0;

    try {
      await addDoc(collection(db, 'reports'), {
        userId: user.uid,
        customerPhone,
        reportType,
        reason,
        points: pointImpact,
        timestamp: Timestamp.now(),
      });

      alert('✅ Report submitted successfully.');
      setCustomerPhone('');
      setReason('');
      setReportType('positive');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('⚠️ Error submitting report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-report-container">
      <h2>Submit a Report</h2>

      <div>
        <label>Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => {
            setReportType(e.target.value);
            setReason('');
          }}
        >
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <div>
        <label>Customer Phone Number:</label>
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="(555) 555-5555"
        />
      </div>

      <div>
        <label>Reason for Report:</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select a reason</option>
          {getOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>

      {/* Styles */}
      <style>
        {`
          .submit-report-container {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
            margin: auto;
          }

          .submit-report-container h2 {
            margin-bottom: 15px;
          }

          .submit-report-container label {
            display: block;
            margin: 10px 0 5px;
          }

          .submit-report-container input,
          .submit-report-container select {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .submit-report-container button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 4px;
          }

          .submit-report-container button:disabled {
            background-color: #aaa;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
}

export default SubmitReport;
