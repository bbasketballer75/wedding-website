import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../GuestMemorySubmission.css';

/**
 * GuestMemorySubmission Component
 * Allows wedding guests to submit memories, stories, and photos
 */
const GuestMemorySubmission = ({
  onSubmit = () => {},
  onError = () => {},
  isSubmitting = false,
  maxPhotoSize = 10 * 1024 * 1024, // 10MB
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    relationshipToBride: '',
    relationshipToGroom: '',
    memoryTitle: '',
    memoryText: '',
    favoriteMemoryType: '',
    sharePublicly: true,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const fileInputRef = useRef(null);

  // Memory type options
  const memoryTypes = [
    { value: 'wedding_day', label: 'Wedding Day Memory' },
    { value: 'relationship_story', label: 'How We Met Story' },
    { value: 'funny_moment', label: 'Funny Moment' },
    { value: 'heartfelt_message', label: 'Heartfelt Message' },
    { value: 'advice', label: 'Marriage Advice' },
    { value: 'photo_story', label: 'Photo with Story' },
    { value: 'other', label: 'Other' },
  ];

  // Validation rules
  const validateForm = (data) => {
    const newErrors = {};

    if (!data.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    } else if (data.guestName.length > 100) {
      newErrors.guestName = 'Name must be less than 100 characters';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.memoryTitle.trim()) {
      newErrors.memoryTitle = 'Memory title is required';
    } else if (data.memoryTitle.length > 200) {
      newErrors.memoryTitle = 'Title must be less than 200 characters';
    }

    if (!data.memoryText.trim()) {
      newErrors.memoryText = 'Memory description is required';
    } else if (data.memoryText.length < 10) {
      newErrors.memoryText = 'Memory must be at least 10 characters';
    } else if (data.memoryText.length > 2000) {
      newErrors.memoryText = 'Memory must be less than 2000 characters';
    }

    if (!data.favoriteMemoryType) {
      newErrors.favoriteMemoryType = 'Please select a memory type';
    }

    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedData = {
      ...formData,
      [name]: newValue,
    };

    setFormData(updatedData);

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Validate form
    const formErrors = validateForm(updatedData);
    setErrors(formErrors);
    setIsFormValid(Object.keys(formErrors).length === 0);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const fileErrors = [];

    files.forEach((file, index) => {
      // Check file type
      if (!allowedImageTypes.includes(file.type)) {
        fileErrors.push(`File ${index + 1}: Only JPEG, PNG, and WebP images are allowed`);
        return;
      }

      // Check file size
      if (file.size > maxPhotoSize) {
        fileErrors.push(
          `File ${index + 1}: File size must be less than ${maxPhotoSize / 1024 / 1024}MB`
        );
        return;
      }

      validFiles.push(file);
    });

    if (fileErrors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        photos: fileErrors.join(', '),
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        photos: null,
      }));
    }

    setSelectedFiles(validFiles);
  };

  // Remove selected file
  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setIsFormValid(false);
      return;
    }

    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        photos: selectedFiles,
        submittedAt: new Date().toISOString(),
      };

      await onSubmit(submissionData);

      // Reset form on successful submission
      setFormData({
        guestName: '',
        email: '',
        relationshipToBride: '',
        relationshipToGroom: '',
        memoryTitle: '',
        memoryText: '',
        favoriteMemoryType: '',
        sharePublicly: true,
      });
      setSelectedFiles([]);
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting memory:', error);
      onError(error);
    }
  };

  return (
    <div className="guest-memory-submission">
      <div className="memory-form-header">
        <h2>Weave Your Thread Into Our Story</h2>
        <p>
          Your precious memories are the golden threads that complete the tapestry of our love
          story. Share your treasured moments, heartfelt wishes, and captured memories from our
          celebration!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="memory-form" noValidate>
        {/* Guest Information */}
        <fieldset className="form-section">
          <legend>Tell Us Who You Are</legend>

          <div className="form-group">
            <label htmlFor="guestName" className="required">
              Your Name
            </label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              className={errors.guestName ? 'error' : ''}
              maxLength="100"
              required
              aria-describedby={errors.guestName ? 'guestName-error' : undefined}
            />
            {errors.guestName && (
              <span id="guestName-error" className="error-message" role="alert">
                {errors.guestName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="required">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              required
              aria-describedby={errors.email ? 'email-error' : 'email-help'}
            />
            <small id="email-help" className="help-text">
              We'll only use this to contact you about your submission
            </small>
            {errors.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="relationshipToBride">Relationship to Bride</label>
              <input
                type="text"
                id="relationshipToBride"
                name="relationshipToBride"
                value={formData.relationshipToBride}
                onChange={handleInputChange}
                placeholder="e.g., Sister, College Friend, Coworker"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="relationshipToGroom">Relationship to Groom</label>
              <input
                type="text"
                id="relationshipToGroom"
                name="relationshipToGroom"
                value={formData.relationshipToGroom}
                onChange={handleInputChange}
                placeholder="e.g., Brother, High School Friend, Teammate"
                maxLength="100"
              />
            </div>
          </div>
        </fieldset>

        {/* Memory Details */}
        <fieldset className="form-section">
          <legend>Share Your Treasured Memory</legend>

          <div className="form-group">
            <label htmlFor="favoriteMemoryType" className="required">
              What Kind of Precious Memory?
            </label>
            <select
              id="favoriteMemoryType"
              name="favoriteMemoryType"
              value={formData.favoriteMemoryType}
              onChange={handleInputChange}
              className={errors.favoriteMemoryType ? 'error' : ''}
              required
              aria-describedby={errors.favoriteMemoryType ? 'memoryType-error' : undefined}
            >
              <option value="">Select memory type...</option>
              {memoryTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.favoriteMemoryType && (
              <span id="memoryType-error" className="error-message" role="alert">
                {errors.favoriteMemoryType}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="memoryTitle" className="required">
              A Beautiful Title for Your Memory
            </label>
            <input
              type="text"
              id="memoryTitle"
              name="memoryTitle"
              value={formData.memoryTitle}
              onChange={handleInputChange}
              className={errors.memoryTitle ? 'error' : ''}
              placeholder="A poetic title that captures the essence of your memory"
              maxLength="200"
              required
              aria-describedby={errors.memoryTitle ? 'memoryTitle-error' : undefined}
            />
            {errors.memoryTitle && (
              <span id="memoryTitle-error" className="error-message" role="alert">
                {errors.memoryTitle}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="memoryText" className="required">
              Paint Your Memory in Words
            </label>
            <textarea
              id="memoryText"
              name="memoryText"
              value={formData.memoryText}
              onChange={handleInputChange}
              className={errors.memoryText ? 'error' : ''}
              placeholder="Let your heart speak... share the emotions, laughter, and love you felt during our celebration"
              rows="6"
              maxLength="2000"
              required
              aria-describedby={errors.memoryText ? 'memoryText-error' : 'memoryText-count'}
            />
            <div className="char-count">
              <span id="memoryText-count" className="char-counter">
                {formData.memoryText.length}/2000 characters
              </span>
            </div>
            {errors.memoryText && (
              <span id="memoryText-error" className="error-message" role="alert">
                {errors.memoryText}
              </span>
            )}
          </div>
        </fieldset>

        {/* Photo Upload */}
        <fieldset className="form-section">
          <legend>Captured Moments (Optional)</legend>

          <div className="form-group">
            <label htmlFor="photos">Share Your Captured Magic</label>
            <input
              type="file"
              id="photos"
              name="photos"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept={allowedImageTypes.join(',')}
              className={errors.photos ? 'error' : ''}
              aria-describedby={errors.photos ? 'photos-error' : 'photos-help'}
            />
            <small id="photos-help" className="help-text">
              Share the moments you captured through your lens (JPEG, PNG, WebP). Max{' '}
              {maxPhotoSize / 1024 / 1024}MB per precious photo.
            </small>
            {errors.photos && (
              <span id="photos-error" className="error-message" role="alert">
                {errors.photos}
              </span>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Your Selected Treasures:</h3>
              <ul className="file-list">
                {selectedFiles.map((file, index) => (
                  <li key={`${file.name}-${file.size}-${file.lastModified}`} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="remove-file"
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </fieldset>

        {/* Privacy Settings */}
        <fieldset className="form-section">
          <legend>How Would You Like to Share?</legend>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sharePublicly"
                checked={formData.sharePublicly}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">
                Let this beautiful memory grace our public celebration
              </span>
            </label>
            <small className="help-text">
              Uncheck if you prefer to share this precious memory privately with just the couple
            </small>
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid || isSubmitting}
            aria-describedby="submit-help"
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner" aria-hidden="true"></span> Weaving your memory
                into our story...
              </>
            ) : (
              'Gift Your Memory'
            )}
          </button>
          <small id="submit-help" className="help-text">
            Your treasured memory will be lovingly reviewed before gracing our celebration
          </small>
        </div>
      </form>
    </div>
  );
};

GuestMemorySubmission.propTypes = {
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  isSubmitting: PropTypes.bool,
  maxPhotoSize: PropTypes.number,
  allowedImageTypes: PropTypes.arrayOf(PropTypes.string),
};

export default GuestMemorySubmission;
