import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import getDbPromise from '../config/firestore-enhanced.js';

/**
 * AI Services Manager - Integrates OpenAI and Google AI for real moderation and captioning
 */
class AIServicesManager {
  constructor() {
    this.openai = null;
    this.googleAI = null;
    this.initializeServices();
  }

  /**
   * Initialize AI services based on available API keys
   */
  initializeServices() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI service initialized');
    }

    // Initialize Google AI if API key is available
    if (process.env.GOOGLE_AI_API_KEY) {
      this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
      console.log('✅ Google AI service initialized');
    }

    if (!this.openai && !this.googleAI) {
      console.warn('⚠️ No AI services initialized - using fallback implementations');
    }
  }

  /**
   * Content Moderation using OpenAI Moderation API
   * @param {string} content - Content to moderate
   * @param {string} type - Type of content (guestbook, comment, etc.)
   * @returns {Promise<object>} Moderation result
   */
  async moderateContent(content, type = 'general') {
    try {
      // Use OpenAI Moderation API if available
      if (this.openai) {
        const moderation = await this.openai.moderations.create({
          input: content,
        });

        const result = moderation.results[0];

        // Log moderation result to Firestore
        await this.logModerationResult(content, type, result, 'openai');

        return {
          flagged: result.flagged,
          categories: result.categories,
          categoryScores: result.category_scores,
          action: result.flagged ? 'reject' : 'approve',
          provider: 'openai',
          confidence: Math.max(...Object.values(result.category_scores)),
        };
      }

      // Fallback to rule-based moderation
      return await this.fallbackModeration(content, type);
    } catch (error) {
      console.error('❌ AI moderation error:', error);
      // Fallback to rule-based moderation on error
      return await this.fallbackModeration(content, type);
    }
  }

  /**
   * Generate photo captions using Google AI (Gemini) or OpenAI GPT-4V
   * @param {string} photoUrl - URL of the photo
   * @param {string} context - Additional context about the photo
   * @returns {Promise<object>} Caption generation result
   */
  async generatePhotoCaption(photoUrl, context = '') {
    try {
      // Use Google AI Gemini for image analysis
      if (this.googleAI) {
        const model = this.googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Generate a warm, celebratory caption for this wedding photo. ${context ? `Context: ${context}` : ''} 
        Keep it heartfelt and appropriate for a wedding celebration. Maximum 100 characters.`;

        // For demo purposes, we'll generate text-based captions
        // In production, you'd pass the actual image to the model
        const result = await model.generateContent(prompt);
        const caption = result.response.text();

        // Log caption generation
        await this.logCaptionGeneration(photoUrl, caption, context, 'google-ai');

        return {
          caption: caption.trim(),
          provider: 'google-ai',
          confidence: 0.9,
        };
      }

      // Use OpenAI GPT-4V if available
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Generate a warm, celebratory caption for this wedding photo. ${context ? `Context: ${context}` : ''} 
                  Keep it heartfelt and appropriate for a wedding celebration. Maximum 100 characters.`,
                },
                // Note: In production, you'd include the image here
                // {
                //   type: "image_url",
                //   image_url: { url: photoUrl }
                // }
              ],
            },
          ],
          max_tokens: 50,
        });

        const caption = response.choices[0].message.content;

        // Log caption generation
        await this.logCaptionGeneration(photoUrl, caption, context, 'openai');

        return {
          caption: caption.trim(),
          provider: 'openai',
          confidence: 0.85,
        };
      }

      // Fallback to generated captions
      return await this.fallbackCaptionGeneration(photoUrl, context);
    } catch (error) {
      console.error('❌ AI caption generation error:', error);
      return await this.fallbackCaptionGeneration(photoUrl, context);
    }
  }

  /**
   * Smart semantic search using AI embeddings
   * @param {string} query - Search query
   * @param {string} searchType - Type of search
   * @returns {Promise<object>} Search results
   */
  async performSmartSearch(query, searchType = 'general') {
    try {
      // Use OpenAI embeddings for semantic search
      if (this.openai) {
        const embedding = await this.openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: query,
        });

        // In production, you'd compare this embedding with stored photo embeddings
        // For now, we'll simulate intelligent search results
        const searchResults = await this.simulateEmbeddingSearch(
          query,
          embedding.data[0].embedding
        );

        // Log search query
        await this.logSearchQuery(query, searchType, searchResults.length, 'openai-embeddings');

        return {
          query,
          results: searchResults,
          totalResults: searchResults.length,
          provider: 'openai-embeddings',
        };
      }

      // Fallback to keyword-based search
      return await this.fallbackSearch(query, searchType);
    } catch (error) {
      console.error('❌ AI search error:', error);
      return await this.fallbackSearch(query, searchType);
    }
  }

  /**
   * Fallback moderation using rule-based approach
   */
  async fallbackModeration(content, type) {
    const inappropriateWords = [
      'spam',
      'inappropriate',
      'offensive',
      'hate',
      'violence',
      'harassment',
      'discrimination',
      'profanity',
      'vulgar',
    ];

    const lowerContent = content.toLowerCase();
    let flagged = false;
    const categories = {};

    for (const word of inappropriateWords) {
      if (lowerContent.includes(word)) {
        flagged = true;
        categories[word] = true;
      }
    }

    const result = {
      flagged,
      categories,
      action: flagged ? 'reject' : 'approve',
      provider: 'fallback-rules',
      confidence: flagged ? 0.7 : 0.9,
    };

    await this.logModerationResult(content, type, result, 'fallback');
    return result;
  }

  /**
   * Fallback caption generation
   */
  async fallbackCaptionGeneration(photoUrl, context) {
    const captions = [
      "A beautiful moment captured at Austin & Jordyn's wedding",
      'Love and joy shared between family and friends',
      'A memorable moment from this special celebration',
      'Celebrating love with those who matter most',
      'A precious memory from the wedding festivities',
      'Happiness radiating from this special day',
      'Creating memories that will last a lifetime',
    ];

    // Add context-aware captions
    if (context) {
      const contextLower = context.toLowerCase();
      if (contextLower.includes('ceremony')) {
        captions.unshift('A sacred moment during the wedding ceremony');
      } else if (contextLower.includes('reception')) {
        captions.unshift('Celebrating at the reception with loved ones');
      } else if (contextLower.includes('dance')) {
        captions.unshift('Dancing the night away in celebration');
      }
    }

    const caption = captions[Math.floor(Math.random() * captions.length)];

    await this.logCaptionGeneration(photoUrl, caption, context, 'fallback');

    return {
      caption,
      provider: 'fallback-generated',
      confidence: 0.8,
    };
  }

  /**
   * Fallback search implementation
   */
  async fallbackSearch(query, searchType) {
    // Simulate search results based on query keywords
    const sampleResults = [
      {
        id: 'photo1',
        url: '/photos/wedding-ceremony.jpg',
        caption: 'Wedding ceremony with beautiful decorations',
        relevance: 0.9,
        tags: ['ceremony', 'wedding', 'flowers', 'bride', 'groom'],
      },
      {
        id: 'photo2',
        url: '/photos/reception-dance.jpg',
        caption: 'First dance at the reception',
        relevance: 0.8,
        tags: ['reception', 'dance', 'celebration', 'music'],
      },
      {
        id: 'photo3',
        url: '/photos/family-group.jpg',
        caption: 'Family photo with all the loved ones',
        relevance: 0.7,
        tags: ['family', 'group', 'portrait', 'celebration'],
      },
    ];

    const queryLower = query.toLowerCase();
    const filteredResults = sampleResults.filter(
      (photo) =>
        photo.caption.toLowerCase().includes(queryLower) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    );

    await this.logSearchQuery(query, searchType, filteredResults.length, 'fallback');

    return {
      query,
      results: filteredResults,
      totalResults: filteredResults.length,
      provider: 'fallback-keyword',
    };
  }

  /**
   * Simulate embedding-based search (for demo)
   */
  async simulateEmbeddingSearch(query, _embedding) {
    // In production, this would query a vector database
    // For now, return intelligent results based on query analysis
    const queryLower = query.toLowerCase();

    const results = [];
    if (queryLower.includes('ceremony') || queryLower.includes('wedding')) {
      results.push({
        id: 'photo1',
        url: '/photos/ceremony-1.jpg',
        caption: 'Sacred ceremony moments',
        relevance: 0.95,
      });
    }
    if (queryLower.includes('dance') || queryLower.includes('party')) {
      results.push({
        id: 'photo2',
        url: '/photos/reception-dance.jpg',
        caption: 'Dancing and celebration',
        relevance: 0.92,
      });
    }
    if (queryLower.includes('family') || queryLower.includes('group')) {
      results.push({
        id: 'photo3',
        url: '/photos/family-group.jpg',
        caption: 'Family gathering moments',
        relevance: 0.88,
      });
    }

    return results;
  }

  /**
   * Log moderation results to Firestore
   */
  async logModerationResult(content, type, result, provider) {
    try {
      const db = await getDbPromise();
      await db.collection('ai_moderation_logs').add({
        content: content.substring(0, 100),
        type,
        result,
        provider,
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      console.error('Error logging moderation result:', error);
    }
  }

  /**
   * Log caption generation to Firestore
   */
  async logCaptionGeneration(photoUrl, caption, context, provider) {
    try {
      const db = await getDbPromise();
      await db.collection('ai_caption_logs').add({
        photoUrl,
        generatedCaption: caption,
        context: context || null,
        provider,
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      console.error('Error logging caption generation:', error);
    }
  }

  /**
   * Log search queries to Firestore
   */
  async logSearchQuery(query, searchType, resultsCount, provider) {
    try {
      const db = await getDbPromise();
      await db.collection('ai_search_logs').add({
        query,
        searchType,
        resultsCount,
        provider,
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      console.error('Error logging search query:', error);
    }
  }

  /**
   * Health check for AI services
   */
  async healthCheck() {
    const status = {
      openai: this.openai ? 'available' : 'unavailable',
      googleAI: this.googleAI ? 'available' : 'unavailable',
      fallback: 'available',
      timestamp: new Date().toISOString(),
    };

    // Test OpenAI connection if available
    if (this.openai) {
      try {
        await this.openai.models.list();
        status.openai = 'healthy';
      } catch (error) {
        status.openai = 'error';
        status.openaiError = error.message;
      }
    }

    return status;
  }
}

// Create singleton instance
const aiServices = new AIServicesManager();

export default aiServices;
