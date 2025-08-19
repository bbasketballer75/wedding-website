import Image from 'next/image';
import PropTypes from 'prop-types';
import { memo } from 'react';

const MediaPreview = memo(({ item }) => {
  if (item.mimetype.startsWith('image/')) {
    return (
      <div className="relative w-full h-0 pb-[66%]">
        <Image
          src={item.filepath}
          alt="Submission preview"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
      </div>
    );
  }
  if (item.mimetype.startsWith('video/')) {
    return <video src={item.filepath} controls muted loop aria-label="Submission video preview" />;
  }
  return null;
});

const ModerationCard = memo(({ item, modAction, handleModeration }) => (
  <section
    key={item._id}
    className={`moderation-card ${item.approved ? 'is-approved' : 'is-pending'}`}
    aria-label={`Submission by ${item.uploadedBy}, status: ${item.approved ? 'approved' : 'pending'}`}
  >
    <div className="media-preview">
      <MediaPreview item={item} />
    </div>
    <div className="moderation-info">
      <p>
        <strong>Status:</strong> {item.approved ? 'Approved' : 'Pending Approval'}
      </p>
      <p>
        <strong>Uploaded by:</strong> {item.uploadedBy}
      </p>
      <p>
        <strong>Date:</strong> {new Date(item.timestamp).toLocaleDateString()}
      </p>
    </div>
    <div className="moderation-actions">
      <button
        onClick={() => handleModeration(item._id, true)}
        disabled={item.approved || modAction[item._id] === 'pending'}
        className="approve-button"
        aria-busy={modAction[item._id] === 'pending'}
        aria-label={`Approve submission by ${item.uploadedBy}`}
      >
        {modAction[item._id] === 'pending' ? 'Approving...' : 'Approve'}
      </button>
      <button
        onClick={() => handleModeration(item._id, false)}
        disabled={!item.approved || modAction[item._id] === 'pending'}
        className="deny-button"
        aria-busy={modAction[item._id] === 'pending'}
        aria-label={`Deny submission by ${item.uploadedBy}`}
      >
        {modAction[item._id] === 'pending' ? 'Denying...' : 'Deny'}
      </button>
      {modAction[item._id] === 'error' && (
        <span className="error-message" role="alert">
          Failed to update. Try again.
        </span>
      )}
    </div>
  </section>
));

MediaPreview.propTypes = {
  item: PropTypes.shape({
    mimetype: PropTypes.string.isRequired,
    filepath: PropTypes.string.isRequired,
  }).isRequired,
};

ModerationCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    approved: PropTypes.bool.isRequired,
    uploadedBy: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired,
    filepath: PropTypes.string.isRequired,
  }).isRequired,
  modAction: PropTypes.objectOf(PropTypes.string).isRequired,
  handleModeration: PropTypes.func.isRequired,
};

export default ModerationCard;
