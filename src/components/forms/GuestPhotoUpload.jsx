import { Camera, Heart, MessageCircle, Upload } from 'lucide-react';
import { useState } from 'react';

const GuestPhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    uploaderName: '',
    uploaderEmail: '',
    uploaderMessage: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs
    const previewUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreview(previewUrls);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreview(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.uploaderName || selectedFiles.length === 0) {
      alert('Please provide your name and select at least one photo');
      return;
    }

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('uploaderName', formData.uploaderName);
      uploadFormData.append('uploaderEmail', formData.uploaderEmail);
      uploadFormData.append('uploaderMessage', formData.uploaderMessage);

      selectedFiles.forEach((file) => {
        uploadFormData.append('photos', file);
      });

      const response = await fetch('/api/memories/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadSuccess(true);
        setFormData({ uploaderName: '', uploaderEmail: '', uploaderMessage: '' });
        setSelectedFiles([]);
        setPreview([]);

        // Auto-hide success message after 5 seconds
        setTimeout(() => setUploadSuccess(false), 5000);
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <Heart className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-green-800 mb-2">Thank You for Sharing! 💕</h3>
          <p className="text-green-700 mb-4">
            Your photos have been uploaded successfully and will be reviewed shortly. We're so
            grateful you're helping us preserve these beautiful memories!
          </p>
          {formData.uploaderEmail && (
            <p className="text-sm text-green-600">
              We've sent a thank you email to {formData.uploaderEmail}
            </p>
          )}
          <button
            onClick={() => setUploadSuccess(false)}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Upload More Photos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Camera className="w-12 h-12 text-rose-500 mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-3xl font-bold text-gray-800 mb-2">Share Your Wedding Photos</h3>
        <p className="text-gray-600">
          Help us build a complete collection of our special day by sharing the photos you took!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="uploaderName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="uploaderName"
              name="uploaderName"
              value={formData.uploaderName}
              onChange={handleInputChange}
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="uploaderEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              id="uploaderEmail"
              name="uploaderEmail"
              value={formData.uploaderEmail}
              onChange={handleInputChange}
              aria-describedby="email-help"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p id="email-help" className="text-xs text-gray-500 mt-1">
              We'll send you a thank you message
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="uploaderMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Message (optional)
          </label>
          <textarea
            id="uploaderMessage"
            name="uploaderMessage"
            value={formData.uploaderMessage}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Share a memory or message about these photos..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Select Photos *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-700 mb-1">Click to select photos</p>
              <p className="text-sm text-gray-500">JPG, PNG, WEBP, HEIC up to 10MB each</p>
            </label>
          </div>
        </div>

        {/* Photo Preview */}
        {preview.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Selected Photos ({preview.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {preview.map((item, index) => (
                <div key={`${item.name}-${index}`} className="relative group">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={uploading || !formData.uploaderName || selectedFiles.length === 0}
            className="px-8 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              <span className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Share Photos
              </span>
            )}
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Your photos will be reviewed before being added to our public
            gallery. This helps us maintain the quality and appropriateness of our memory
            collection.
          </p>
        </div>
      </form>
    </div>
  );
};

export default GuestPhotoUpload;
