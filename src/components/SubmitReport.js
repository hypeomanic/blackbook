import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SubmitReport() {
  const [user, setUser] = useState(null);
  const [reportType, setReportType] = useState('positive');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const positiveOptions = [
    { label: 'Tips Well', value: 'TipsWell', points: +12 },
    { label: 'Very Responsive', value: 'VeryResponsive', points: +3 },
    { label: 'Good Conversation', value: 'GoodConversation', points: +5 },
    { label: 'Left Positive Review', value: 'LeftPositiveReview', points: +15 },
    { label: 'Gave a Referral', value: 'GaveReferral', points: +21 },
  ];

  const negativeOptions = [
    { label: 'Did Not Pay', value: 'DidNotPay', points: -21 },
    { label: 'Poor Communication', value: 'PoorCommunication', points: -3 },
    { label: 'Showed Up Late', value: 'ShowedUpLate', points: -12 },
    { label: 'Unfriendly or Rude', value: 'UnfriendlyOrRude', points: -10 },
    { label: 'No Show', value: 'NoShow', points: -18 },
  ];

  // ✅ Detect logged-in user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  // ✅ Dynamically load options based on report type
  const getOptions = () => {
    return reportType === 'positive' ? positiveOptions : negativeOptions;
  };

  // ✅ Handle Phone Number Format
  const normalizePhoneNumber = (input) => {
    return input.replace(/\D/g, '');
  };

  // ✅ Check if a report was filed in the last 30 days
  const hasReportedInLast30Days = async () => {
    const normalizedPhone = normalizePhoneNumber(customerPhone);
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    const q = query(
      collection(db, 'reports'),
      where('customerPhone', '==', normalizedPhone),
      where('businessId', '==', user.uid),
    );

    const querySnapshot = await getDocs(q);

    let hasRecentReport = false;
    let nextAvailableDate = null;

    querySnapshot.forEach(doc => {
      const reportDate = doc.data().timestamp.toDate();
      if (reportDate >= THIRTY_DAYS_AGO) {
        hasRecentReport = true;
        nextAvailableDate = new Date(reportDate);
        nextAvailableDate.setDate(nextAvailableDate.getDate() + 30);
      }
    });

    return { hasRecentReport, nextAvailableDate };
  };

  // ✅ Handle Submit Function
  const handleSubmit = async () => {
    if (!customerPhone || !reason) {
      alert('⚠️ Please fill out all fields.');
      return;
    }

    const normalizedPhone = normalizePhoneNumber(customerPhone);
    if (normalizedPhone.length !== 10) {
      alert('⚠️ Invalid phone number. Please enter a 10-digit number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const { hasRecentReport, nextAvailableDate } = await hasReportedInLast30Days();

    if (hasRecentReport) {
      setErrorMessage(`🚨 You already submitted a report for this customer. You can submit again on: ${nextAvailableDate.toLocaleDateString()}`);
      setSubmitting(false);
      return;
    }

    const selectedOption = getOptions().find(opt => opt.value === reason);
    const pointImpact = selectedOption ? selectedOption.points : 0;

    try {
      await addDoc(collection(db, 'reports'), {
        businessId: user.uid,
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
      console.error('⚠️ Error submitting report:', error);
      alert('⚠️ Error submitting report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-report-container">
      <h2>Submit a Report</h2>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

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
          maxLength="14"
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

      <style>
        {`
          .submit-report-container {
            background-color: #f9f9f9;
            padding: 25px;
            border-radius: 12px;
            max-width: 550px;
            margin: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }

          h2 {
            margin-bottom: 15px;
          }

          input, select {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 12px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
          }

          button:hover {
            background-color: #388E3C;
          }

          .error-message {
            background-color: #FFEBEE;
            color: #B71C1C;
            border: 1px solid #FFCDD2;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            transition: all 0.3s;
          }
        `}
      </style>
    </div>
  );
}

export default SubmitReport;
