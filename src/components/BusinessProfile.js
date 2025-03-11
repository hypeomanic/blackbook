import React, { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../utils/firebase';

function BusinessProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [businessName, setBusinessName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  // ✅ Fetch the existing business info when the component loads
  useEffect(() => {
    if (user) {
      const fetchBusinessInfo = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBusinessName(data.businessName || '');
          setBusinessWebsite(data.businessWebsite || '');
          setBusinessPhone(data.businessPhone || '');
        }
      };
      fetchBusinessInfo();
    }
  }, [user]);

  // ✅ Handle form submission to save business profile info
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessName || !businessWebsite || !businessPhone) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        businessName,
        businessWebsite,
        businessPhone,
      }, { merge: true });

      alert('Business information saved successfully.');
    } catch (error) {
      console.error('Error saving business information:', error);
      alert('Failed to save business information. Please try again.');
    }
  };

  return (
    <div>
      <h2>Your Business Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Business Name:</label>
          <input 
            type="text" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your Business Name"
            required 
          />
        </div>

        <div>
          <label>Business Website:</label>
          <input 
            type="url"
            value={businessWebsite}
            onChange={(e) => setBusinessWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
            required 
          />
        </div>

        <div>
          <label>Business Phone:</label>
          <input 
            type="tel"
            value={businessPhone}
            onChange={(e) => setBusinessPhone(e.target.value)}
            placeholder="(123) 456-7890"
            required 
          />
        </div>

        <button type="submit">Save Business Info</button>
      </form>
    </div>
  );
}

export default BusinessProfile;
