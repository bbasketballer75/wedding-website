import { useEffect, useState } from 'react';

/**
 * 💝 Guest Story Collection Component
 * Allows wedding guests to share detailed stories and memories
 */
const GuestStoryCollection = () => {
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState({
    guestName: '',
    relationship: '',
    storyTitle: '',
    storyContent: '',
    favoriteMemory: '',
    wishForCouple: '',
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relationshipTypes = [
    'Family - Bride',
    'Family - Groom',
    'College Friend',
    'High School Friend',
    'Work Colleague',
    'Neighbor',
    'Wedding Party',
    'Childhood Friend',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storyData = {
        ...newStory,
        submittedAt: new Date().toISOString(),
        id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // API call to save story
      const response = await fetch('/api/guest-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        setStories((prev) => [storyData, ...prev]);
        setNewStory({
          guestName: '',
          relationship: '',
          storyTitle: '',
          storyContent: '',
          favoriteMemory: '',
          wishForCouple: '',
          photos: [],
        });

        // Show success message
        alert('Thank you for sharing your story! It means the world to Austin & Jordyn. 💕');
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Sorry, there was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Load existing stories
    fetch('/api/guest-stories')
      .then((res) => res.json())
      .then((data) => setStories(data.stories || []))
      .catch((err) => console.error('Error loading stories:', err));
  }, []);

  return (
    <div className="guest-story-collection">
      <style>{`
        .guest-story-collection {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
        }

        .story-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .story-header h1 {
          color: #8b7a8a;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .story-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .story-form {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(139, 122, 138, 0.1);
          margin-bottom: 3rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #8b7a8a;
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8b7a8a;
        }

        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }

        .submit-btn {
          background: linear-gradient(135deg, #8b7a8a, #d4a574);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s;
          width: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .stories-display {
          margin-top: 3rem;
        }

        .stories-display h2 {
          color: #8b7a8a;
          text-align: center;
          margin-bottom: 2rem;
        }

        .story-card {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #d4a574;
        }

        .story-meta {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .story-title {
          color: #8b7a8a;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .story-content {
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .story-highlight {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #8b7a8a;
          margin: 1rem 0;
          font-style: italic;
        }
      `}</style>

      <div className="story-header">
        <h1>Share Your Story</h1>
        <p>
          Austin & Jordyn would love to hear your favorite memories, stories, and wishes for their
          future together. Your words will become part of their digital memory book forever. 💕
        </p>
      </div>

      <form className="story-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guestName">Your Name *</label>
          <input
            type="text"
            id="guestName"
            required
            value={newStory.guestName}
            onChange={(e) => setNewStory((prev) => ({ ...prev, guestName: e.target.value }))}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="relationship">How do you know Austin & Jordyn? *</label>
          <select
            id="relationship"
            required
            value={newStory.relationship}
            onChange={(e) => setNewStory((prev) => ({ ...prev, relationship: e.target.value }))}
          >
            <option value="">Select your relationship</option>
            {relationshipTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="storyTitle">Story Title *</label>
          <input
            type="text"
            id="storyTitle"
            required
            value={newStory.storyTitle}
            onChange={(e) => setNewStory((prev) => ({ ...prev, storyTitle: e.target.value }))}
            placeholder="Give your story a memorable title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="favoriteMemory">Favorite Memory with Austin & Jordyn</label>
          <textarea
            id="favoriteMemory"
            value={newStory.favoriteMemory}
            onChange={(e) => setNewStory((prev) => ({ ...prev, favoriteMemory: e.target.value }))}
            placeholder="Share a special memory you have with the couple..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="storyContent">Your Story *</label>
          <textarea
            id="storyContent"
            required
            value={newStory.storyContent}
            onChange={(e) => setNewStory((prev) => ({ ...prev, storyContent: e.target.value }))}
            placeholder="Tell your story... How did you meet? What makes them special? Any funny moments?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="wishForCouple">Wishes for Their Future</label>
          <textarea
            id="wishForCouple"
            value={newStory.wishForCouple}
            onChange={(e) => setNewStory((prev) => ({ ...prev, wishForCouple: e.target.value }))}
            placeholder="Share your hopes and wishes for Austin & Jordyn's future together..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '💕 Sharing Your Story...' : '💝 Share My Story'}
        </button>
      </form>

      <div className="stories-display">
        <h2>Stories from Friends & Family</h2>
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <div className="story-meta">
              {story.guestName} • {story.relationship} •{' '}
              {new Date(story.submittedAt).toLocaleDateString()}
            </div>
            <h3 className="story-title">{story.storyTitle}</h3>
            <div className="story-content">{story.storyContent}</div>

            {story.favoriteMemory && (
              <div className="story-highlight">
                <strong>Favorite Memory:</strong> {story.favoriteMemory}
              </div>
            )}

            {story.wishForCouple && (
              <div className="story-highlight">
                <strong>Wishes for the Future:</strong> {story.wishForCouple}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestStoryCollection;
