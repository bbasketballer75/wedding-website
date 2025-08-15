'use client';

/**
 * 💕 INTERACTIVE LOVE STORY TIMELINE ✨
 * Beautiful animated journey through Austin & Jordyn's relationship
 */

import { useEffect, useRef, useState } from 'react';
import { ConfettiCelebration } from '../../utils/features/magicalInteractions.js';

const InteractiveLoveTimeline = ({ className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef(null);
  const intervalRef = useRef(null);

  // Love story milestones (customize with your actual story!)
  const milestones = [
    {
      date: 'March 15, 2019',
      title: 'First Met 💫',
      story:
        "Our eyes met across the crowded coffee shop, and somehow we both knew this was the beginning of something magical. Austin spilled his latte when he saw Jordyn's smile.",
      photo: '/images/highlights/sunset-couple.webp',
      icon: '☕',
      color: '#FFB6C1',
      location: 'Starbucks on Main Street',
    },
    {
      date: 'June 8, 2019',
      title: 'First Date 🌹',
      story:
        'A perfect evening at the local park, complete with a picnic under the stars. We talked until 2 AM and knew we had found something special.',
      photo: '/images/highlights/first-dance.webp',
      icon: '🌟',
      color: '#DDA0DD',
      location: 'Riverside Park',
    },
    {
      date: 'November 22, 2019',
      title: 'Made It Official 💕',
      story:
        'After months of growing closer, we officially became a couple on this beautiful autumn day. The leaves were falling, but we were falling harder for each other.',
      photo: '/images/highlights/ceremony-kiss.webp',
      icon: '💕',
      color: '#FFD700',
      location: 'Central Park',
    },
    {
      date: 'February 14, 2020',
      title: "First Valentine's 💖",
      story:
        "Our first Valentine's Day together was absolutely perfect. Austin surprised Jordyn with handwritten poems and her favorite chocolate. The beginning of many romantic traditions.",
      photo: '/images/first-valentine.jpg',
      icon: '💝',
      color: '#FF69B4',
      location: 'Cozy Italian Restaurant',
    },
    {
      date: 'August 12, 2020',
      title: 'Moved In Together 🏠',
      story:
        'We took the big step and got our first apartment together. Assembling IKEA furniture has never been so romantic! This became our first real home as a couple.',
      photo: '/images/new-home.jpg',
      icon: '🏡',
      color: '#98FB98',
      location: 'Our First Apartment',
    },
    {
      date: 'December 24, 2021',
      title: 'The Proposal ✨',
      story:
        'On Christmas Eve, under the twinkling lights and surrounded by family, Austin got down on one knee. Jordyn said yes before he could even finish the question! It was pure magic.',
      photo: '/images/proposal.jpg',
      icon: '💍',
      color: '#E6E6FA',
      location: 'Family Christmas Gathering',
    },
    {
      date: 'June 15, 2022',
      title: 'Engagement Party 🎉',
      story:
        'We celebrated our engagement with all our loved ones. Dancing, laughter, and so much joy filled the evening. Everyone could see how perfect we are together.',
      photo: '/images/engagement-party.jpg',
      icon: '🎊',
      color: '#F0E68C',
      location: 'Garden Venue',
    },
    {
      date: 'Today',
      title: 'Our Wedding Day! 👰‍♀️🤵‍♂️',
      story:
        "The day we've been dreaming of is finally here! We're so excited to start this new chapter as husband and wife, surrounded by all the people we love most.",
      photo: '/images/wedding-day.jpg',
      icon: '💒',
      color: '#FFF8DC',
      location: 'Beautiful Wedding Venue',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % milestones.length);
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, milestones.length]);

  const handleMilestoneClick = (index) => {
    setActiveIndex(index);
    setIsPlaying(false);
    ConfettiCelebration.trigger(timelineRef.current, 25);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatDate = (dateString) => {
    if (dateString === 'Today') return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentMilestone = () => milestones[activeIndex];

  return (
    <div className={`interactive-love-timeline ${className}`} ref={timelineRef}>
      {/* Header */}
      <div className="timeline-header fade-in-up">
        <h2 className="timeline-title text-shimmer">💕 Our Love Story Journey ✨</h2>
        <p className="timeline-subtitle">
          From first glance to forever - here's how our magical story unfolded
        </p>
        <button className="autoplay-btn btn-magical" onClick={toggleAutoPlay}>
          {isPlaying ? '⏸️ Pause Story' : '▶️ Play Story'}
        </button>
      </div>

      {/* Main Timeline Container */}
      <div className="timeline-container">
        {/* Timeline Line */}
        <div className="timeline-line">
          <div
            className="timeline-progress"
            style={{
              height: `${((activeIndex + 1) / milestones.length) * 100}%`,
            }}
          />
            </div>

        {/* Timeline Milestones */}
        <div className="milestones-container">
          {milestones.map((milestone, index) => (
            <div
              key={`milestone-${milestone.date}-${index}`}
              className={`milestone-item ${index === activeIndex ? 'active' : ''} ${
                index <= activeIndex ? 'completed' : ''
              } stagger-animation elegant-lift`}
              style={{ '--delay': `${index * 0.2}s` }}
               role="button" tabIndex={0} onClick={() => handleMilestoneClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(index); } }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();  => handleMilestoneClickindex(e); } }}
            >
              <div
                className="milestone-marker sparkle"
                style={{ '--milestone-color': milestone.color }}
              >
                <span className="milestone-icon">{milestone.icon}</span>
              </div>

              <div className="milestone-content">
                <div className="milestone-date">{formatDate(milestone.date)}</div>
                <div className="milestone-title">{milestone.title}</div>
                {index === activeIndex && (
                  <div className="milestone-location">📍 {milestone.location}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Story Display */}
        <div className="featured-story">
          <div className="story-card fade-in-up">
            <div className="story-image-container">
              <img
                src={getCurrentMilestone().photo}
                alt={getCurrentMilestone().title}
                className="story-image photo-magic"
                onError={(e) => {
                  e.target.src = '/images/placeholder-love.jpg';
                }}
              />
            <div
                className="story-overlay"
                style={{ '--story-color': getCurrentMilestone().color }}
              >
                <div className="story-icon heart-pulse">{getCurrentMilestone().icon}</div>
              </div>
            </div>

            <div className="story-content">
              <div className="story-date">{formatDate(getCurrentMilestone().date)}</div>
              <h3 className="story-title">{getCurrentMilestone().title}</h3>
              <p className="story-text">{getCurrentMilestone().story}</p>
              <div className="story-location">
                <span className="location-icon">📍</span>
                {getCurrentMilestone().location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="timeline-controls fade-in-up">
        <button
          className="control-btn btn-magical"
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          ❮ Previous
        </button>

        <div className="progress-dots">
          {milestones.map((milestone, index) => (
            <button
              key={`dot-${milestone.date}-${index}`}
              className={`progress-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleMilestoneClick(index)}
              aria-label={`Go to milestone ${index + 1}: ${milestone.title}`}
            />
          ))}
        </div>

        <button
          className="control-btn btn-magical"
          onClick={() => setActiveIndex(Math.min(milestones.length - 1, activeIndex + 1))}
          disabled={activeIndex === milestones.length - 1}
        >
          Next ❯
        </button>
      </div>

      {/* Fun Stats */}
      <div className="love-stats fade-in-up">
        <div className="stat-item">
          <div className="stat-number text-shimmer">{milestones.length}</div>
          <div className="stat-label">Beautiful Moments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number text-shimmer">{new Date().getFullYear() - 2019}</div>
          <div className="stat-label">Years Together</div>
        </div>
        <div className="stat-item">
          <div className="stat-number text-shimmer">∞</div>
          <div className="stat-label">Love Forever</div>
        </div>
      </div>
    </div>
  );
};


InteractiveLoveTimeline.propTypes = {
  className: PropTypes.string
};

export default InteractiveLoveTimeline;
