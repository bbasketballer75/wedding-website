/**
 * Photo Tagging System for Post-Wedding Site
 * Allows guests to tag themselves and others in wedding photos
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../PhotoTagging.css';

const PhotoTagging = ({ photoId, photoUrl, existingTags, onTagAdded, onTagRemoved, isGuest }) => {
  const [tags, setTags] = useState(existingTags || []);
  const [isTagging, setIsTagging] = useState(false);
  const [tagPosition, setTagPosition] = useState({ x: 0, y: 0 });
  const [showTagForm, setShowTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagEmail, setNewTagEmail] = useState('');

  useEffect(() => {
    setTags(existingTags || []);
  }, [existingTags]);

  const handlePhotoClick = (event) => {
    if (!isTagging) return;

    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setTagPosition({ x, y });
    setShowTagForm(true);
  };

  const handleSubmitTag = async (e) => {
    e.preventDefault();

    if (!newTagName.trim()) return;

    const tagData = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      email: newTagEmail.trim(),
      position: tagPosition,
      photoId,
      timestamp: new Date().toISOString(),
      isVerified: false,
    };

    try {
      // Submit to backend for verification
      const response = await fetch('/api/photo-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });

      if (response.ok) {
        const savedTag = await response.json();
        setTags((prev) => [...prev, savedTag]);
        onTagAdded?.(savedTag);

        // Reset form
        setNewTagName('');
        setNewTagEmail('');
        setShowTagForm(false);
        setIsTagging(false);
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      const response = await fetch(`/api/photo-tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTags((prev) => prev.filter((tag) => tag.id !== tagId));
        onTagRemoved?.(tagId);
      }
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  return (
    <div className="photo-tagging-container">
      <button
        className="photo-wrapper"
        onClick={handlePhotoClick}
        type="button"
        disabled={!isTagging}
        aria-label={isTagging ? 'Click to tag people in this image' : 'Wedding memory'}
      >
        <img src={photoUrl} alt="Wedding memory from the celebration" className="taggable-photo" />

        {/* Render existing tags */}
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`photo-tag ${tag.isVerified ? 'verified' : 'pending'}`}
            style={{
              left: `${tag.position.x}%`,
              top: `${tag.position.y}%`,
            }}
          >
            <div className="tag-indicator">
              <span className="tag-dot"></span>
              <div className="tag-tooltip">
                <span className="tag-name">{tag.name}</span>
                {!isGuest && (
                  <button
                    className="remove-tag"
                    onClick={() => handleRemoveTag(tag.id)}
                    aria-label={`Remove tag for ${tag.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Tag form overlay */}
        {showTagForm && (
          <div
            className="tag-form-overlay"
            style={{
              left: `${tagPosition.x}%`,
              top: `${tagPosition.y}%`,
            }}
          >
            <form onSubmit={handleSubmitTag} className="tag-form">
              <div className="form-group">
                <label htmlFor="tag-name">Name *</label>
                <input
                  id="tag-name"
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Who is this?"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="tag-email">Email (optional)</label>
                <input
                  id="tag-email"
                  type="email"
                  value={newTagEmail}
                  onChange={(e) => setNewTagEmail(e.target.value)}
                  placeholder="For notifications"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Add Tag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagForm(false);
                    setIsTagging(false);
                    setNewTagName('');
                    setNewTagEmail('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </button>

      {/* Tagging controls */}
      <div className="tagging-controls">
        <button
          className={`tag-mode-btn ${isTagging ? 'active' : ''}`}
          onClick={() => setIsTagging(!isTagging)}
          aria-label={isTagging ? 'Exit tagging mode' : 'Enter tagging mode'}
        >
          {isTagging ? 'Exit Tagging' : '🏷️ Tag People'}
        </button>

        {tags.length > 0 && (
          <div className="tag-summary">
            <span className="tag-count">{tags.length} tagged</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      {isTagging && (
        <div className="tagging-instructions">
          <p>Click on a person in the photo to tag them</p>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
PhotoTagging.propTypes = {
  photoId: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  existingTags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
    })
  ),
  onTagAdded: PropTypes.func,
  onTagRemoved: PropTypes.func,
  isGuest: PropTypes.bool,
};

// Default props
PhotoTagging.defaultProps = {
  existingTags: [],
  isGuest: true,
  onTagAdded: null,
  onTagRemoved: null,
};

export default PhotoTagging;
