import React from 'react';
import CareTeamCard from './CareTeamCard';

const CareTeam = () => {
  const team = [
    { name: `Abebe Balcha, MD`, role: 'Physical Therapist', imgSrc: 'link-to-image1.jpg' },
    { name: 'Chramlin Dougie, MD', role: 'Family Medicine', imgSrc: 'link-to-image2.jpg' },
    { name: 'Dooson Dougie, MD', role: 'Family Medicine', imgSrc: 'link-to-image3.jpg' },
    { name: 'Bugy Bagir, MD', role: 'Family Medicine', imgSrc: 'link-to-image4.jpg' },
  ];

  return (
    <div className="care-team-container">
      <h2>Your Care Team</h2>
      <p>We are Here to Guide you on every step you Take, Feel Free to contact us!!</p>
      <div className="care-team-list">
        {team.map((member, index) => (
          <CareTeamCard
            key={index}
            name={member.name}
            role={member.role}
            imgSrc={member.imgSrc}
          />
        ))}
      </div>
      <div className="see-all">
        <button>See All (8) →</button>
      </div>
    </div>
  );
};

export default CareTeam;
