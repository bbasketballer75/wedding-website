import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { uploadMedia } from '../../services/api';
import './UploadForm.css';

const MAX_FILE_SIZE_MB = 100;
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/ogg',
  'video/x-msvideo',
  'video/x-matroska',
];

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setMessage('');
    setError('');
    const selected = e.target.files[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Invalid file type. Please select an image or video.');
      setFile(null);
      fileInputRef.current.value = '';
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      fileInputRef.current.value = '';
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    setIsUploading(true);
    try {
      await uploadMedia(formData);
      setMessage('Thank you! Your file has been uploaded and is awaiting approval.');
      setFile(null);
      fileInputRef.current.value = '';
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h2>Contribute to Our Album</h2>
      <p>Share your favorite moments from our special day!</p>
      <form onSubmit={handleSubmit} aria-label="Upload media form">
        <label htmlFor="media-upload" className="sr-only">
          Select image or video to upload
        </label>
        <input
          type="file"
          id="media-upload"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          className="file-input"
          aria-required="true"
          aria-label="Select image or video to upload"
          disabled={isUploading}
        />
        <button
          type="submit"
          disabled={isUploading}
          className="upload-button"
          aria-busy={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      {message && <output className="success-message">{message}</output>}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

UploadForm.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadForm;
