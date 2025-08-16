import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { getAllAlbumMedia, moderateMedia } from '../../services/api';
import PerformanceDashboard from '../performance/PerformanceDashboard';
import ModerationCard from './ModerationCard';

const AdminDashboard = ({ adminKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modAction, setModAction] = useState({}); // { [id]: 'pending' | 'success' | 'error' }
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'performance'

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
      <style>{`
        .admin-tabs {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .admin-tab {
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .admin-tab:hover {
          color: #374151;
          background: #f9fafb;
        }

        .admin-tab.active {
          color: #8b7a8a;
          border-bottom-color: #8b7a8a;
          background: #faf9fa;
        }

        .tab-content {
          min-height: 200px;
        }
      `}</style>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'moderation' ? 'active' : ''}`}
          onClick={() => setActiveTab('moderation')}
        >
          📝 Content Moderation
        </button>
        <button
          className={`admin-tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          📊 Performance Monitor
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'moderation' && (
          <>
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
          </>
        )}

        {activeTab === 'performance' && <PerformanceDashboard />}
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  adminKey: PropTypes.string.isRequired,
};

export default AdminDashboard;
