import React from 'react';

function ReferralProgram({ referralLink, referralCredits }) {
  return (
    <div>
      <h2>Referral Program</h2>
      <p>Invite other businesses to join the platform and earn credits!</p>
      <p><strong>Your Referral Link:</strong></p>
      <input 
        type="text" 
        value={referralLink} 
        readOnly 
        style={{ width: '100%', padding: '10px' }}
      />
      <p><strong>Credits Earned From Referrals:</strong> {referralCredits}</p>
      <p>For every business you refer, you get <strong>50 credits</strong> ($50 off your subscription).</p>
    </div>
  );
}

export default ReferralProgram;
