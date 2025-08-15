import PropTypes from 'prop-types';
import './NotificationBanner.css';

const NotificationBanner = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <output className="notification-banner" aria-live="polite">
      <span>{message}</span>
      <button className="notification-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </output>
  );
};

NotificationBanner.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default NotificationBanner;
