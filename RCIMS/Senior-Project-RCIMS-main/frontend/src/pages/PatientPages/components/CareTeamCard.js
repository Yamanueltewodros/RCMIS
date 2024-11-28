import React from 'react';
import Doc from './Doc1.jpg';
import './CareTeamCard.css'; // Importing CSS for styling
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SendIcon from '@mui/icons-material/Send';
const CareTeamCard = ({ name, role, imgSrc }) => {
  return (
    <div className="care-team-card">
      <img src={Doc} alt={name} className="care-team-img" />
      <div className="care-team-info">
        <h4>{name}</h4>
        <p>{role}</p>
      </div>
      <div className="care-team-actions">
        <button className="icon-btn">
          <CalendarMonthIcon /> {/* Calendar Icon */}
        </button>
        <button className="icon-btn">
          <SendIcon /> {/* Message Icon */}
        </button>
      </div>
    </div>
  );
};

export default CareTeamCard;
