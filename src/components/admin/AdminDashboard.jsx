import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getAllAlbumMedia, moderateMedia } from '../../services/api';
import ModerationCard from './ModerationCard';
import './AdminDashboard.css';

const AdminDashboard = ({ adminKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modAction, setModAction] = useState({}); // { [id]: 'pending' | 'success' | 'error' }

  useEffect(() => {
    const fetchAllMedia = async () => {
      if (!adminKey || typeof adminKey !== 'string') {
        setError('Invalid admin key');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllAlbumMedia(adminKey);
        if (response && response.data) {
          setMedia(response.data);
        } else {
          setError('Invalid response from server');
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Could not fetch media. Is the admin key correct?';
        setError(errorMessage);
        console.error('Failed to fetch media:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMedia();
  }, [adminKey]);

  const handleModeration = useCallback(
    async (photoId, isApproved) => {
      if (!photoId || typeof photoId !== 'string') {
        setError('Invalid photo ID');
        return;
      }

      setModAction((prev) => ({ ...prev, [photoId]: 'pending' }));
      setSuccess(null);
      try {
        await moderateMedia(photoId, isApproved, adminKey);
        setMedia((prevMedia) =>
          prevMedia.map((item) => (item._id === photoId ? { ...item, approved: isApproved } : item))
        );
        setModAction((prev) => ({ ...prev, [photoId]: 'success' }));
        setSuccess(isApproved ? 'Media approved.' : 'Media denied and removed.');
      } catch (err) {
        setModAction((prev) => ({ ...prev, [photoId]: 'error' }));
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to update status. Please try again.';
        setError(errorMessage);
        console.error('Moderation failed:', err);
      }
    },
    [adminKey]
  );

  if (isLoading)
    return (
      <div className="loading" aria-live="polite">
        Loading submissions...
      </div>
    );
  if (error)
    return (
      <div className="error-message" role="alert">
        {error}
      </div>
    );

  return (
    <div className="admin-dashboard" aria-label="Admin moderation dashboard">
      {success && (
        <div className="form-success" aria-live="polite">
          {success}
        </div>
      )}
      {media.length === 0 ? (
        <div className="empty-state" aria-live="polite">
          No submissions to moderate.
        </div>
      ) : (
        media.map((item) => (
          <ModerationCard
            key={item._id}
            item={item}
            modAction={modAction}
            handleModeration={handleModeration}
          />
        ))
      )}
    </div>
  );
};

AdminDashboard.propTypes = {
  adminKey: PropTypes.string.isRequired,
};

export default AdminDashboard;
