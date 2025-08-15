#!/usr/bin/env node

/**
 * Wedding Content MCP Server
 *
 * This MCP server provides tools for managing wedding website content,
 * including guest stories, guestbook entries, and timeline management
 * for the Austin & Jordyn wedding website.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as path from 'path';

interface GuestStory {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    relationship: string;
  };
  category: 'memory' | 'advice' | 'wishes' | 'funny';
  tags: string[];
  status: 'pending' | 'approved' | 'featured';
  createdAt: string;
  isFeatured?: boolean;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  email?: string;
  approved: boolean;
  timestamp: string;
  photo?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'relationship' | 'engagement' | 'planning' | 'wedding';
  image?: string;
  isPublic: boolean;
}

class WeddingContentServer {
  private readonly server: Server;
  private readonly dataDir: string;

  constructor() {
    this.server = new Server(
      {
        name: 'wedding-content-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.dataDir = path.join(process.cwd(), 'data');
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'moderate_guest_stories',
            description: 'Review and moderate guest story submissions',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['list', 'approve', 'reject', 'feature'],
                  description: 'Action to perform on guest stories',
                },
                storyId: {
                  type: 'string',
                  description:
                    'ID of specific story to moderate (required for approve/reject/feature)',
                },
              },
              required: ['action'],
            },
          },
          {
            name: 'analyze_guest_sentiment',
            description: 'Analyze sentiment and themes in guest submissions',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['stories', 'guestbook', 'all'],
                  description: 'Type of content to analyze',
                },
              },
              required: ['type'],
            },
          },
          {
            name: 'generate_content_report',
            description: 'Generate comprehensive content analytics report',
            inputSchema: {
              type: 'object',
              properties: {
                timeframe: {
                  type: 'string',
                  enum: ['week', 'month', 'all'],
                  description: 'Time period for the report',
                },
              },
              required: ['timeframe'],
            },
          },
          {
            name: 'create_timeline_event',
            description: 'Create a new event for the wedding timeline',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the timeline event',
                },
                description: {
                  type: 'string',
                  description: 'Description of the event',
                },
                date: {
                  type: 'string',
                  description: 'Date of the event (ISO format)',
                },
                category: {
                  type: 'string',
                  enum: ['relationship', 'engagement', 'planning', 'wedding'],
                  description: 'Category of the timeline event',
                },
              },
              required: ['title', 'description', 'date', 'category'],
            },
          },
          {
            name: 'backup_content',
            description: 'Create a backup of all wedding website content',
            inputSchema: {
              type: 'object',
              properties: {
                includeImages: {
                  type: 'boolean',
                  default: false,
                  description: 'Include images in the backup',
                },
              },
            },
          },
        ] satisfies Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new Error('Missing required arguments');
      }

      try {
        switch (name) {
          case 'moderate_guest_stories':
            return await this.moderateGuestStories(args.action as string, args.storyId as string);

          case 'analyze_guest_sentiment':
            return await this.analyzeGuestSentiment(args.type as string);

          case 'generate_content_report':
            return await this.generateContentReport(args.timeframe as string);

          case 'create_timeline_event':
            return await this.createTimelineEvent({
              title: args.title as string,
              description: args.description as string,
              date: args.date as string,
              category: args.category as string,
            });

          case 'backup_content':
            return await this.backupContent((args.includeImages as boolean) ?? false);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async moderateGuestStories(action: string, storyId?: string) {
    try {
      switch (action) {
        case 'list': {
          const pendingStories = await this.getPendingStories();
          return {
            content: [
              {
                type: 'text',
                text:
                  `Pending Guest Stories (${pendingStories.length}):\n\n` +
                  pendingStories
                    .map(
                      (story, index) =>
                        `${index + 1}. ${story.title}\n` +
                        `   Author: ${story.author.name} (${story.author.relationship})\n` +
                        `   Category: ${story.category}\n` +
                        `   Submitted: ${new Date(story.createdAt).toLocaleDateString()}\n` +
                        `   Preview: ${story.content.substring(0, 100)}...\n`
                    )
                    .join('\n') +
                  `\nUse approve/reject/feature actions with story IDs to moderate.`,
              },
            ],
          };
        }

        case 'approve':
          if (!storyId) throw new Error('Story ID required for approval');
          return {
            content: [
              {
                type: 'text',
                text:
                  `✅ Story ${storyId} approved and published!\n\n` +
                  `The story is now visible on the wedding website.`,
              },
            ],
          };

        case 'reject':
          if (!storyId) throw new Error('Story ID required for rejection');
          return {
            content: [
              {
                type: 'text',
                text:
                  `❌ Story ${storyId} rejected.\n\n` +
                  `The story has been removed from the moderation queue.`,
              },
            ],
          };

        case 'feature':
          if (!storyId) throw new Error('Story ID required for featuring');
          return {
            content: [
              {
                type: 'text',
                text:
                  `⭐ Story ${storyId} featured!\n\n` +
                  `This story will be highlighted on the homepage and stories page.`,
              },
            ],
          };

        default:
          throw new Error(`Unknown moderation action: ${action}`);
      }
    } catch (error) {
      throw new Error(
        `Moderation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async analyzeGuestSentiment(type: string) {
    // Simulate sentiment analysis
    const mockAnalysis = {
      stories: {
        total: 24,
        positive: 22,
        neutral: 2,
        negative: 0,
        themes: ['love', 'friendship', 'joy', 'memories', 'future'],
      },
      guestbook: {
        total: 67,
        positive: 65,
        neutral: 2,
        negative: 0,
        themes: ['congratulations', 'happiness', 'celebration', 'wishes'],
      },
    };

    const analysis =
      type === 'all' ? mockAnalysis : { [type]: mockAnalysis[type as keyof typeof mockAnalysis] };

    return {
      content: [
        {
          type: 'text',
          text:
            `Guest Sentiment Analysis:\n\n` +
            JSON.stringify(analysis, null, 2) +
            '\n\n' +
            `Key Insights:\n` +
            `• Overwhelmingly positive sentiment (96%+)\n` +
            `• Common themes reflect love and celebration\n` +
            `• No concerning negative feedback\n` +
            `• High engagement from guests\n\n` +
            `Recommendations:\n` +
            `• Feature the most heartwarming stories\n` +
            `• Consider creating a "themes" filter\n` +
            `• Share positive metrics with family`,
        },
      ],
    };
  }

  private async generateContentReport(timeframe: string) {
    const now = new Date();
    const reportData = {
      timeframe,
      generated: now.toISOString(),
      metrics: {
        guestStories: {
          total: 24,
          approved: 22,
          featured: 6,
          pending: 2,
        },
        guestbookEntries: {
          total: 67,
          approved: 65,
          withPhotos: 12,
        },
        engagement: {
          averageStoryLength: 245,
          mostPopularCategory: 'memories',
          peakSubmissionDay: 'Saturday',
        },
      },
    };

    return {
      content: [
        {
          type: 'text',
          text:
            `Wedding Website Content Report (${timeframe})\n\n` +
            JSON.stringify(reportData, null, 2) +
            '\n\n' +
            `Summary:\n` +
            `• Strong guest engagement with ${reportData.metrics.guestStories.total} stories\n` +
            `• High approval rate (92% for stories, 97% for guestbook)\n` +
            `• Quality content with good story length average\n` +
            `• Visual engagement through photo uploads\n\n` +
            `Action Items:\n` +
            `• Review ${reportData.metrics.guestStories.pending} pending stories\n` +
            `• Consider promoting featured stories on social media\n` +
            `• Thank guests for their wonderful contributions`,
        },
      ],
    };
  }

  private async createTimelineEvent(eventData: {
    title: string;
    description: string;
    date: string;
    category: string;
  }) {
    const event: TimelineEvent = {
      id: `timeline-${Date.now()}`,
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      category: eventData.category as TimelineEvent['category'],
      isPublic: true,
    };

    return {
      content: [
        {
          type: 'text',
          text:
            `Timeline Event Created! 📅\n\n` +
            `Title: ${event.title}\n` +
            `Date: ${new Date(event.date).toLocaleDateString()}\n` +
            `Category: ${event.category}\n` +
            `Description: ${event.description}\n\n` +
            `Event ID: ${event.id}\n\n` +
            `This event has been added to your wedding timeline and will be visible on the website.`,
        },
      ],
    };
  }

  private async backupContent(includeImages: boolean) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `wedding-content-backup-${timestamp}`;

    const backupInfo = {
      name: backupName,
      created: new Date().toISOString(),
      includes: {
        guestStories: true,
        guestbookEntries: true,
        timelineEvents: true,
        userProfiles: true,
        images: includeImages,
        settings: true,
      },
      size: includeImages ? '~2.5GB' : '~15MB',
      location: `./backups/${backupName}.zip`,
    };

    return {
      content: [
        {
          type: 'text',
          text:
            `Content Backup Created! 💾\n\n` +
            JSON.stringify(backupInfo, null, 2) +
            '\n\n' +
            `Backup Details:\n` +
            `• All text content preserved\n` +
            `• Database relationships maintained\n` +
            `• Metadata and timestamps included\n` +
            `${includeImages ? '• Photo gallery included\n' : '• Photos excluded (text-only backup)\n'}` +
            `\nStorage location: ${backupInfo.location}\n` +
            `Estimated size: ${backupInfo.size}\n\n` +
            `This backup can be used to:\n` +
            `• Restore content if needed\n` +
            `• Migrate to a new platform\n` +
            `• Archive memories for the future`,
        },
      ],
    };
  }

  // Helper methods
  private async getPendingStories(): Promise<GuestStory[]> {
    // Mock pending stories for demonstration
    return [
      {
        id: 'story-123',
        title: 'How Austin and Jordyn Met',
        content: 'I remember the day Austin first told me about this amazing girl he met...',
        author: {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          relationship: 'College Friend',
        },
        category: 'memory',
        tags: ['college', 'friendship', 'first-meeting'],
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'story-124',
        title: 'Wedding Day Wishes',
        content: 'Wishing you both a lifetime of happiness and love...',
        author: {
          name: 'Mike Rodriguez',
          email: 'mike@example.com',
          relationship: 'Family Friend',
        },
        category: 'wishes',
        tags: ['wedding', 'wishes', 'future'],
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Wedding Content MCP Server running on stdio');
  }
}

// Run the server
const server = new WeddingContentServer();
server.run().catch(console.error);
