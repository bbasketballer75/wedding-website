import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, createGuestbookEntry } from '../../services/api';
import LoadingScreen from '../../components/ui/LoadingScreen';
import GuestPhotoUpload from '../../components/forms/GuestPhotoUpload';
import './GuestbookPage.css';

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const response = await getGuestbookEntries();
        setEntries(response.data);
      } catch (error) {
        console.error('Failed to load guestbook entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      if (!message.trim()) {
        setFormError(
          'We long to hear the whispers of your heart! Please share a beautiful message with us.'
        );
        setIsSubmitting(false);
        return;
      }
      await createGuestbookEntry({ name, message });
      setSuccess(
        'Your exquisite words have been lovingly woven into our memory book! Thank you for blessing us with the poetry of your heart. 💖'
      );
      setMessage('');
      setName('');
      // Refresh entries
      const response = await getGuestbookEntries();
      setEntries(response.data);
    } catch {
      setFormError(
        'A gentle breeze interrupted our connection! Please try sharing your heart again in just a moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="guestbook-page">
      {isLoading && <LoadingScreen message="Gathering all the beautiful words and blessings..." />}
      {!isLoading && (
        <>
          <h2 id="guestbook-title" className="section-title">
            Our Sacred Memory Book
          </h2>
          <p className="guestbook-subheading">
            Your precious words become golden threads in the tapestry of our love story. Share a
            cherished memory from our wedding celebration, offer wisdom from your heart, recount a
            moment that made you smile, or simply leave us a blessing. Each message becomes an
            eternal keepsake in our journey of love.
          </p>
          <form
            className="guestbook-form"
            onSubmit={handleSubmit}
            aria-labelledby="guestbook-title"
            noValidate
          >
            <fieldset>
              <legend className="sr-only">Add a guestbook entry</legend>
              <div className="input-group">
                <label className="label" htmlFor="guestbook-name">
                  Name (optional)
                </label>
                <input
                  className="input"
                  id="guestbook-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-describedby="name-help"
                />
                <div id="name-help" className="sr-only">
                  Optional field for your name, up to 100 characters
                </div>
              </div>
              <div className="input-group">
                <label className="label" htmlFor="guestbook-message">
                  Message *
                </label>
                <textarea
                  className="textarea"
                  id="guestbook-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  placeholder="Pour your heart into words... share a magical memory, offer wisdom for our journey, or simply bless us with your love!"
                  required
                  aria-required="true"
                  aria-describedby="message-help"
                  aria-invalid={formError ? 'true' : 'false'}
                  rows={4}
                />
                <div id="message-help" className="input-description">
                  Let your soul speak - we treasure every word, every blessing, every beautiful
                  thought you share.
                </div>
              </div>
            </fieldset>
            {formError && (
              <div className="form-error" role="alert" aria-live="assertive">
                {formError}
              </div>
            )}
            {success && (
              <div className="form-success" aria-live="polite">
                {success}
              </div>
            )}
            <button
              className="button"
              type="submit"
              disabled={isSubmitting}
              aria-describedby={isSubmitting ? 'submit-status' : undefined}
            >
              {isSubmitting ? 'Weaving Your Words into Our Story...' : 'Share Your Heart & Soul 💝'}
            </button>
            {isSubmitting && (
              <div id="submit-status" className="sr-only" aria-live="polite">
                Submitting your guestbook entry, please wait...
              </div>
            )}
          </form>
          <section
            className="messages"
            aria-labelledby="entries-title"
            role="log"
            aria-live="polite"
          >
            <h3 id="entries-title" className="sr-only">
              Guestbook Entries
            </h3>
            {entries.length === 0 ? (
              <div className="empty-state">
                This sacred space awaits the first beautiful blessing. Will you be the one to begin
                our memory book?
              </div>
            ) : (
              <>
                <div className="sr-only" aria-live="polite">
                  {entries.length} guestbook {entries.length === 1 ? 'entry' : 'entries'} available
                </div>
                {entries.map((entry, index) => (
                  <article
                    className="message"
                    key={entry._id || entry.timestamp || index}
                    aria-labelledby={`entry-${index}-author`}
                  >
                    <div
                      id={`entry-${index}-author`}
                      className="message-name"
                      aria-label="Message from"
                    >
                      {entry.name || 'Anonymous Guest'}
                    </div>
                    <div className="message-text" aria-label="Message content">
                      {entry.message}
                    </div>
                    <time
                      className="message-date sr-only"
                      dateTime={entry.timestamp}
                      aria-label="Posted on"
                    >
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </time>
                  </article>
                ))}
              </>
            )}
          </section>

          {/* Photo Upload Section */}
          <section
            className="photo-upload-section"
            style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e2e8f0' }}
          >
            <h3
              style={{
                textAlign: 'center',
                marginBottom: '1rem',
                fontSize: '1.5rem',
                color: '#4a5568',
              }}
            >
              Share Your Wedding Memories
            </h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#718096' }}>
              Help us preserve the magic of May 10th, 2025 by uploading your favorite photos from
              our special day!
            </p>
            <GuestPhotoUpload />
          </section>
        </>
      )}
    </div>
  );
};

export default GuestbookPage;
