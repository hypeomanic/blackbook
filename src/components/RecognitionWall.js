import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getAuth } from 'firebase/auth';

function RecognitionWall() {
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userReports, setUserReports] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTopBusinesses = () => {
      const q = query(collection(db, 'users'), orderBy('reportCount', 'desc'));

      onSnapshot(q, (snapshot) => {
        const businesses = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          rank: index + 1
        }));

        setTopBusinesses(businesses.slice(0, 3));

        // ✅ Find the current user's rank
        const userBusiness = businesses.find(b => b.id === user.uid);
        if (userBusiness) {
          setUserRank(userBusiness.rank);
          setUserReports(userBusiness.reportCount);
        } else {
          setUserRank('Unranked');
        }
      });
    };

    fetchTopBusinesses();
  }, [user.uid]);

  return (
    <div>
      <h2>Recognition Wall</h2>
      <p>The top 3 businesses with the most report submissions this calendar month:</p>

      <div style={{ display: 'flex', gap: '20px' }}>
        {topBusinesses.map((business, index) => (
          <div 
            key={business.id} 
            style={{ 
              border: '2px solid #ddd', 
              padding: '10px', 
              borderRadius: '5px',
              backgroundColor: business.id === user.uid ? '#f0f8ff' : '#fff'
            }}
          >
            <h3>
              #{business.rank} {business.businessName}
            </h3>
            <p><strong>Reports:</strong> {business.reportCount}</p>
            <p><strong>Website:</strong> <a href={business.businessWebsite} target="_blank" rel="noopener noreferrer">{business.businessWebsite}</a></p>
            <p><strong>Phone:</strong> {business.businessPhone}</p>
          </div>
        ))}
      </div>

      <hr />
      <h3>Your Current Rank</h3>
      {userRank !== 'Unranked' ? (
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <p><strong>Your Rank:</strong> #{userRank}</p>
          <p><strong>Total Reports:</strong> {userReports}</p>
        </div>
      ) : (
        <p>You haven't submitted any reports this month. Start submitting to rank!</p>
      )}

      <style>
        {`
          h2 {
            margin-bottom: 10px;
          }
          .top-card {
            border: 2px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
}

export default RecognitionWall;
