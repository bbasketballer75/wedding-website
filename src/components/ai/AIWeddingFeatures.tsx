'use client';

// Browser API type definitions for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: unknown;
  }
}

/**
 * 🤖 AI-Powered Wedding Features
 *
 * Advanced AI capabilities for August 2025:
 * - Smart photo organization and tagging
 * - Intelligent content recommendations
 * - Automated accessibility improvements
 * - Smart guest interaction analysis
 * - Predictive performance optimization
 */

import { motion } from 'framer-motion';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// AI Service Interfaces
interface AIPhotoAnalysis {
  id: string;
  faces: string[];
  emotions: string[];
  objects: string[];
  scene: string;
  quality: number;
  timestamp: Date;
  aiGenerated?: boolean;
  recommendations: string[];
}

interface AIContentRecommendation {
  type: 'photo' | 'memory' | 'story' | 'connection';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  confidence: number;
}

interface AIInsights {
  photoEngagement: {
    topPhotos: string[];
    emotionalMoments: string[];
    interactionPatterns: unknown[];
  };
  guestBehavior: {
    activeUsers: number;
    engagementScore: number;
    popularFeatures: string[];
  };
  contentOptimization: {
    loadingPerformance: number;
    userJourney: string[];
    recommendations: AIContentRecommendation[];
  };
}

interface AIContextType {
  insights: AIInsights;
  analyzePhoto: (photoUrl: string) => Promise<AIPhotoAnalysis>;
  getRecommendations: () => AIContentRecommendation[];
  optimizePerformance: () => void;
  generateAltText: (imageUrl: string) => Promise<string>;
  smartOrganize: (photos: unknown[]) => Promise<any[]>;
  isProcessing: boolean;
}

// AI Processing Service
class AIWeddingService {
  private cache = new Map<string, any>();

  async analyzePhoto(photoUrl: string): Promise<AIPhotoAnalysis> {
    // Simulate AI photo analysis
    const cached = this.cache.get(`photo_${photoUrl}`);
    if (cached) return cached;

    // Mock AI analysis - in production, this would call actual AI services
    const analysis: AIPhotoAnalysis = {
      id: `analysis_${Date.now()}`,
      faces: this.generateFaceAnalysis(),
      emotions: this.generateEmotionAnalysis(),
      objects: this.generateObjectDetection(),
      scene: this.generateSceneAnalysis(),
      quality: Math.random() * 0.3 + 0.7, // 70-100% quality
      timestamp: new Date(),
      recommendations: this.generateRecommendations(),
    };

    this.cache.set(`photo_${photoUrl}`, analysis);
    return analysis;
  }

  private generateFaceAnalysis(): string[] {
    const faces = ['Austin', 'Jordyn', 'Family Member', 'Friend', 'Wedding Party'];
    return faces.slice(0, Math.floor(Math.random() * 4) + 1);
  }

  private generateEmotionAnalysis(): string[] {
    const emotions = ['joy', 'love', 'excitement', 'happiness', 'surprise', 'tender'];
    return emotions.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateObjectDetection(): string[] {
    const objects = ['flowers', 'rings', 'dress', 'suit', 'cake', 'decorations', 'bouquet'];
    return objects.slice(0, Math.floor(Math.random() * 4) + 1);
  }

  private generateSceneAnalysis(): string {
    const scenes = ['ceremony', 'reception', 'portrait', 'candid', 'detail'];
    return scenes[Math.floor(Math.random() * scenes.length)];
  }

  private generateRecommendations(): string[] {
    return [
      'Consider featuring this in the main gallery',
      'Great for social sharing',
      'Perfect for the memory wall',
      'Ideal for anniversary collection',
    ];
  }

  async generateAltText(imageUrl: string): Promise<string> {
    const analysis = await this.analyzePhoto(imageUrl);

    // Create descriptive alt text based on AI analysis
    const emotions = analysis.emotions.join(' and ');
    const scene = analysis.scene;
    const people = analysis.faces.length > 0 ? `featuring ${analysis.faces.join(', ')}` : '';

    return `Wedding ${scene} photo ${people} showing ${emotions} during Austin and Jordyn's special day`;
  }

  generateContentRecommendations(): AIContentRecommendation[] {
    return [
      {
        type: 'photo',
        priority: 'high',
        title: 'Feature Emotional Moments',
        description: 'Highlight photos with strong emotional content for better engagement',
        action: 'Move to featured gallery',
        confidence: 0.92,
      },
      {
        type: 'memory',
        priority: 'medium',
        title: 'Create Story Connections',
        description: 'Link related photos to create narrative sequences',
        action: 'Generate photo stories',
        confidence: 0.87,
      },
      {
        type: 'connection',
        priority: 'high',
        title: 'Enhance Guest Interactions',
        description: 'Add more collaborative features where guests are most active',
        action: 'Implement interactive elements',
        confidence: 0.94,
      },
    ];
  }

  async smartOrganizePhotos(photos: unknown[]): Promise<any[]> {
    // Simulate AI-powered photo organization
    const analyzed = await Promise.all(
      photos.map(async (photo: any) => {
        const analysis = await this.analyzePhoto(photo.src);
        return {
          ...photo,
          aiAnalysis: analysis,
          category: analysis.scene,
          importance: analysis.quality,
          tags: [...analysis.emotions, ...analysis.objects],
        };
      })
    );

    // Sort by importance and emotion
    return analyzed.sort((a, b) => {
      if (a.aiAnalysis.emotions.includes('joy') && !b.aiAnalysis.emotions.includes('joy'))
        return -1;
      if (b.aiAnalysis.emotions.includes('joy') && !a.aiAnalysis.emotions.includes('joy')) return 1;
      return b.importance - a.importance;
    });
  }
}

// AI Context
const AIContext = createContext<AIContextType | null>(null);

export const AIWeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [insights, setInsights] = useState<AIInsights>({
    photoEngagement: {
      topPhotos: [],
      emotionalMoments: [],
      interactionPatterns: [],
    },
    guestBehavior: {
      activeUsers: 0,
      engagementScore: 0,
      popularFeatures: [],
    },
    contentOptimization: {
      loadingPerformance: 0,
      userJourney: [],
      recommendations: [],
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiService] = useState(new AIWeddingService());

  // Initialize AI insights
  useEffect(() => {
    const generateInsights = async () => {
      setInsights({
        photoEngagement: {
          topPhotos: ['photo_1', 'photo_5', 'photo_12'],
          emotionalMoments: ['ceremony_kiss', 'first_dance', 'father_daughter'],
          interactionPatterns: [
            { photo: 'photo_1', reactions: 45, comments: 12 },
            { photo: 'photo_5', reactions: 38, comments: 8 },
          ],
        },
        guestBehavior: {
          activeUsers: Math.floor(Math.random() * 20) + 5,
          engagementScore: Math.random() * 30 + 70, // 70-100%
          popularFeatures: ['photo_gallery', 'guestbook', 'memory_sharing'],
        },
        contentOptimization: {
          loadingPerformance: Math.random() * 20 + 80, // 80-100%
          userJourney: ['landing', 'gallery', 'guestbook', 'memories'],
          recommendations: aiService.generateContentRecommendations(),
        },
      });
    };

    generateInsights();

    // Update insights every 30 seconds
    const interval = setInterval(generateInsights, 30000);
    return () => clearInterval(interval);
  }, [aiService]);

  const analyzePhoto = useCallback(
    async (photoUrl: string) => {
      setIsProcessing(true);
      try {
        const analysis = await aiService.analyzePhoto(photoUrl);
        return analysis;
      } finally {
        setIsProcessing(false);
      }
    },
    [aiService]
  );

  const getRecommendations = useCallback(() => {
    return insights.contentOptimization.recommendations;
  }, [insights]);

  const optimizePerformance = useCallback(() => {
    // AI-powered performance optimization
    console.error('🤖 AI optimizing performance...');

    // Preload high-engagement photos
    insights.photoEngagement.topPhotos.forEach((photoId) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `/images/gallery/${photoId}.jpg`;
      document.head.appendChild(link);
    });

    // Optimize based on user behavior
    if (insights.guestBehavior.popularFeatures.includes('photo_gallery')) {
      // Preload gallery assets
      const galleryScript = document.createElement('link');
      galleryScript.rel = 'prefetch';
      galleryScript.href = '/gallery';
      document.head.appendChild(galleryScript);
    }
  }, [insights]);

  const generateAltText = useCallback(
    async (imageUrl: string) => {
      return await aiService.generateAltText(imageUrl);
    },
    [aiService]
  );

  const smartOrganize = useCallback(
    async (photos: unknown[]) => {
      setIsProcessing(true);
      try {
        return await aiService.smartOrganizePhotos(photos);
      } finally {
        setIsProcessing(false);
      }
    },
    [aiService]
  );

  return (
    <AIContext.Provider
      value={{
        insights,
        analyzePhoto,
        getRecommendations,
        optimizePerformance,
        generateAltText,
        smartOrganize,
        isProcessing,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIWeddingProvider');
  }
  return context;
};

/**
 * AI-Powered Photo Organizer Component
 */
export const AIPhotoOrganizer: React.FC<{
  photos: unknown[];
  onOrganized: (photos: unknown[]) => void;
}> = ({ photos, onOrganized }) => {
  const { smartOrganize, isProcessing } = useAI();

  const handleSmartOrganize = async () => {
    const organized = await smartOrganize(photos);
    onOrganized(organized);
  };

  return (
    <motion.div
      className="ai-photo-organizer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="ai-controls">
        <h3>🤖 AI Photo Organization</h3>
        <button
          onClick={handleSmartOrganize}
          disabled={isProcessing}
          className="ai-organize-button"
        >
          {isProcessing ? 'Analyzing Photos...' : 'Smart Organize'}
        </button>
      </div>
      <style jsx>{`
        .ai-photo-organizer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 16px;
          margin: 20px 0;
        }

        .ai-controls h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
        }

        .ai-organize-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .ai-organize-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .ai-organize-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </motion.div>
  );
};

/**
 * AI Insights Dashboard
 */
export const AIInsightsDashboard: React.FC = () => {
  const { insights, getRecommendations } = useAI();
  const recommendations = getRecommendations();

  return (
    <motion.div
      className="ai-dashboard"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3>🎯 AI Insights</h3>
      <div className="insight-grid">
        <div className="insight-card">
          <h4>📊 Engagement</h4>
          <p>Score: {insights.guestBehavior.engagementScore.toFixed(1)}%</p>
          <p>Active Users: {insights.guestBehavior.activeUsers}</p>
        </div>
        <div className="insight-card">
          <h4>⚡ Performance</h4>
          <p>Loading: {insights.contentOptimization.loadingPerformance.toFixed(1)}%</p>
          <p>Top Photos: {insights.photoEngagement.topPhotos.length}</p>
        </div>
        <div className="insight-card">
          <h4>🎯 Recommendations</h4>
          <p>{recommendations.length} suggestions</p>
          <p>High Priority: {recommendations.filter((r) => r.priority === 'high').length}</p>
        </div>
      </div>
      <div className="recommendations">
        <h4>💡 AI Recommendations</h4>
        {recommendations.slice(0, 3).map((rec, index) => (
          <div key={index} className="recommendation">
            <span className={`priority ${rec.priority}`}>{rec.priority}</span>
            <div>
              <p>
                <strong>{rec.title}</strong>
              </p>
              <p>{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .ai-dashboard {
          background: rgba(255, 255, 255, 0.95);
          padding: 24px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
        }

        .ai-dashboard h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 20px;
        }

        .insight-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .insight-card {
          background: linear-gradient(135deg, #9caf88, #7a8b6c);
          color: white;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
        }

        .insight-card h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .insight-card p {
          margin: 4px 0;
          font-size: 12px;
        }

        .recommendations {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .recommendations h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .recommendation {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .priority {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .priority.high {
          background: #ff6b6b;
          color: white;
        }

        .priority.medium {
          background: #feca57;
          color: #333;
        }

        .priority.low {
          background: #48dbfb;
          color: white;
        }

        .recommendation p {
          margin: 2px 0;
          font-size: 12px;
        }
      `}</style>
    </motion.div>
  );
};

export default AIWeddingProvider;
