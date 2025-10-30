import { useEffect } from 'react';
import './Notification.css';

function Notification({ message, points, onClose, teamName }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification-overlay">
      <div className="notification-card bounce-in">
        <div className="notification-icon">🎉</div>
        <h2 className="notification-title">Correct!</h2>
        <p className="notification-message">
          You scored <span className="points-highlight">{points}</span> points
        </p>
        <p className="notification-team">for {teamName}!</p>
      </div>
    </div>
  );
}

export default Notification;
