'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface StoryAuthor {
  name: string;
  email: string;
  relationship: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  author: StoryAuthor;
  category: string;
  tags: string[];
  status: string;
  createdAt: string;
  isFeatured?: boolean;
}

interface StorySubmission {
  title: string;
  content: string;
  author: StoryAuthor;
  category: string;
}

interface StoriesData {
  stories: Story[];
  categories: Array<{ name: string; count: number }>;
  featuredStories: Story[];
  totalStories: number;
}

/**
 * 📖 Guest Stories Page
 * Collection of heartfelt stories from wedding guests
 */
export default function GuestStoriesPage() {
  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const loadStoriesData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch stories with category filter
      const storiesUrl =
        selectedCategory === 'all'
          ? '/api/guest-stories'
          : `/api/guest-stories?category=${selectedCategory}`;

      const [storiesResponse, categoriesResponse, featuredResponse] = await Promise.all([
        fetch(storiesUrl),
        fetch('/api/guest-stories/categories'),
        fetch('/api/guest-stories/featured'),
      ]);

      if (!storiesResponse.ok || !categoriesResponse.ok || !featuredResponse.ok) {
        throw new Error('Failed to load stories data');
      }

      const [storiesResult, categoriesResult, featuredResult] = await Promise.all([
        storiesResponse.json(),
        categoriesResponse.json(),
        featuredResponse.json(),
      ]);

      setStoriesData({
        stories: storiesResult.data || [],
        categories: categoriesResult.data || [],
        featuredStories: featuredResult.data || [],
        totalStories: storiesResult.pagination?.total || 0,
      });

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Fallback data
      const fallbackData = {
        stories: [
          {
            id: '1',
            title: 'A Beautiful Beginning',
            content: 'I remember when Austin first told me about Jordyn...',
            author: { name: 'Sarah Johnson', email: 'sarah@example.com', relationship: 'friend' },
            category: 'memories',
            tags: ['love', 'friendship'],
            status: 'approved',
            createdAt: new Date().toISOString(),
            isFeatured: true,
          },
        ],
        categories: [
          { name: 'memories', count: 5 },
          { name: 'advice', count: 3 },
        ],
        featuredStories: [],
        totalStories: 1,
      };
      setStoriesData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadStoriesData();
  }, [loadStoriesData]);

  const handleStorySubmit = async (storyData: StorySubmission) => {
    try {
      const response = await fetch('/api/guest-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit story');
      }

      // Reload stories data
      await loadStoriesData();
      setShowSubmissionForm(false);

      // Show success message
      alert('Thank you for sharing your story! It will be reviewed and published soon.');
    } catch (err) {
      alert('Failed to submit story. Please try again.');
      console.error('Story submission error:', err);
    }
  };

  if (loading) {
    return (
      <div className="stories-loading">
        <div className="loading-spinner"></div>
        <p>Loading beautiful stories...</p>
      </div>
    );
  }

  if (error && !storiesData) {
    return (
      <div className="stories-error">
        <h2>Unable to load stories</h2>
        <p>{error}</p>
        <button onClick={loadStoriesData}>Try Again</button>
      </div>
    );
  }

  const categories = storiesData?.categories || [];
  const stories = storiesData?.stories || [];
  const featuredStories = storiesData?.featuredStories || [];

  return (
    <div className="guest-stories-page">
      <div className="stories-header">
        <h1>📖 Our Story Collection</h1>
        <p>Beautiful memories shared by our loved ones</p>
      </div>

      <div className="stories-actions">
        <div className="category-filters">
          <button
            className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Stories ({storiesData?.totalStories || 0})
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-filter ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name.replace('_', ' ').toUpperCase()} ({category.count})
            </button>
          ))}
        </div>

        <button
          className="submit-story-btn"
          onClick={() => setShowSubmissionForm(!showSubmissionForm)}
        >
          ✍️ Share Your Story
        </button>
      </div>

      {showSubmissionForm && (
        <StorySubmissionForm
          onSubmit={handleStorySubmit}
          onCancel={() => setShowSubmissionForm(false)}
        />
      )}

      {featuredStories.length > 0 && (
        <div className="featured-stories">
          <div className="featured-header">
            <h2>✨ Featured Stories</h2>
            <p>Heartwarming tales that captured our hearts</p>
          </div>

          <div className="featured-grid">
            {featuredStories.map((story) => (
              <div key={story.id} className="featured-story">
                <div className="story-header">
                  <div className="story-title">{story.title}</div>
                  <div className="story-meta">
                    <span className="story-author">By {story.author.name}</span>
                    <span className="story-category">{story.category.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="story-content">{story.content}</div>

                {story.tags.length > 0 && (
                  <div className="story-tags">
                    {story.tags.map((tag, index) => (
                      <span key={`tag-${index}`} className="story-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="all-stories">
        <div className="all-stories-header">
          <h2>All Stories</h2>
          <p>Every story is special and cherished</p>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <div className="story-header">
                <div className="story-title">{story.title}</div>
                <div className="story-meta">
                  <span className="story-author">By {story.author.name}</span>
                  <span className="story-category">{story.category.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="story-preview">{story.content}</div>

              <a href="#" className="read-more">
                Read Full Story →
              </a>

              {story.tags.length > 0 && (
                <div className="story-tags">
                  {story.tags.slice(0, 3).map((tag, index) => (
                    <span key={`tag-${index}`} className="story-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorySubmissionForm({
  onSubmit,
  onCancel,
}: {
  readonly onSubmit: (data: StorySubmission) => void;
  readonly onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: {
      name: '',
      email: '',
      relationship: '',
    },
    category: 'memories',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('author.')) {
      const authorField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="submission-form">
      <div className="form-header">
        <h3>Share Your Story</h3>
        <p>Tell us about a special memory with Austin & Jordyn</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="story-title-1">
            Story Title *
          </label>
          <input
            id="story-title-1"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Give your story a beautiful title..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="your-name-2">
            Your Name *
          </label>
          <input
            id="your-name-2"
            type="text"
            className="form-input"
            value={formData.author.name}
            onChange={(e) => handleChange('author.name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email-3">
            Email *
          </label>
          <input
            id="email-3"
            type="email"
            className="form-input"
            value={formData.author.email}
            onChange={(e) => handleChange('author.email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="relationship-to-couple-4">
            Relationship to Couple
          </label>
          <select
            id="relationship-to-couple-4"
            className="form-select"
            value={formData.author.relationship}
            onChange={(e) => handleChange('author.relationship', e.target.value)}
          >
            <option value="">Select relationship...</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="neighbor">Neighbor</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="story-category-5">
            Story Category
          </label>
          <select
            id="story-category-5"
            className="form-select"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="memories">Memories</option>
            <option value="advice">Advice</option>
            <option value="funny_moments">Funny Moments</option>
            <option value="first_meetings">First Meetings</option>
            <option value="adventures">Adventures</option>
            <option value="heartfelt">Heartfelt</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="your-story-6">
            Your Story *
          </label>
          <textarea
            id="your-story-6"
            className="form-textarea"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Share your beautiful memory, advice, or story about Austin & Jordyn..."
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="form-btn primary">
            Submit Story
          </button>
          <button type="button" className="form-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
