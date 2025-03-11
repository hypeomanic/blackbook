import React, { useState } from 'react';

function AutoReport({ onSubmitReport }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [behavior, setBehavior] = useState('Failed Payment');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReport({
      customerName,
      phoneNumber,
      behavior,
      notes,
      date: new Date().toLocaleDateString()
    });
    setCustomerName('');
    setPhoneNumber('');
    setBehavior('Failed Payment');
    setNotes('');
  };

  return (
    <div>
      <h2>Submit Behavior Report</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Customer Name" 
          value={customerName} 
          onChange={(e) => setCustomerName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
        />
        <select 
          value={behavior} 
          onChange={(e) => setBehavior(e.target.value)}
        >
          <option value="Failed Payment">Failed Payment</option>
          <option value="No Show">No Show</option>
          <option value="Hostile Behavior">Hostile Behavior</option>
          <option value="Chargeback Abuse">Chargeback Abuse</option>
        </select>
        <textarea 
          placeholder="Additional Notes (Optional)" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default AutoReport;
