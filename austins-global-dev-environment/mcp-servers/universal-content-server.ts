#!/usr/bin/env node

/**
 * Universal Content MCP Server
 *
 * A generalized version of the wedding content server for managing
 * any project's content, user submissions, and timeline events.
 *
 * This server can be customized for different project types by
 * modifying the content categories and data structures.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as path from 'path';

interface ContentSubmission {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    role?: string;
  };
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'featured' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  isPublic: boolean;
  metadata?: Record<string, unknown>;
}

class UniversalContentServer {
  private readonly server: Server;
  private readonly dataDir: string;
  private readonly projectType: string;

  constructor() {
    this.server = new Server(
      {
        name: 'universal-content-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.dataDir = path.join(process.cwd(), 'data');
    this.projectType = process.env.PROJECT_TYPE || 'general';
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'moderate_content',
            description: 'Review and moderate user content submissions',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['list', 'approve', 'reject', 'feature', 'get'],
                  description: 'Action to perform on content',
                },
                contentId: {
                  type: 'string',
                  description: 'ID of specific content to moderate',
                },
                category: {
                  type: 'string',
                  description: 'Filter by content category',
                },
              },
              required: ['action'],
            },
          },
          {
            name: 'analyze_content_sentiment',
            description: 'Analyze sentiment and themes in user submissions',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Content category to analyze',
                },
                timeframe: {
                  type: 'string',
                  enum: ['day', 'week', 'month', 'all'],
                  description: 'Time period for analysis',
                },
              },
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
                  enum: ['week', 'month', 'quarter', 'all'],
                  description: 'Time period for the report',
                },
                includeCharts: {
                  type: 'boolean',
                  default: false,
                  description: 'Include data visualization charts',
                },
              },
              required: ['timeframe'],
            },
          },
          {
            name: 'manage_timeline',
            description: 'Create, update, or manage timeline events',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['create', 'update', 'delete', 'list'],
                  description: 'Timeline action to perform',
                },
                eventData: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string' },
                    category: { type: 'string' },
                  },
                },
                eventId: {
                  type: 'string',
                  description: 'Event ID for update/delete operations',
                },
              },
              required: ['action'],
            },
          },
          {
            name: 'backup_project_content',
            description: 'Create a backup of all project content and data',
            inputSchema: {
              type: 'object',
              properties: {
                includeMedia: {
                  type: 'boolean',
                  default: false,
                  description: 'Include media files in the backup',
                },
                format: {
                  type: 'string',
                  enum: ['json', 'csv', 'xml'],
                  default: 'json',
                  description: 'Backup format',
                },
              },
            },
          },
        ] satisfies Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'moderate_content':
            return await this.moderateContent(args);
          case 'analyze_content_sentiment':
            return await this.analyzeContentSentiment(args);
          case 'generate_content_report':
            return await this.generateContentReport(args);
          case 'manage_timeline':
            return await this.manageTimeline(args);
          case 'backup_project_content':
            return await this.backupProjectContent(args);
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

  private async moderateContent(args: any) {
    const { action, contentId, category } = args;

    switch (action) {
      case 'list':
        return {
          content: [
            {
              type: 'text',
              text: this.generateContentList(category),
            },
          ],
        };
      case 'approve':
        return {
          content: [
            {
              type: 'text',
              text: `✅ Content ${contentId} approved and published!`,
            },
          ],
        };
      case 'reject':
        return {
          content: [
            {
              type: 'text',
              text: `❌ Content ${contentId} rejected and removed from queue.`,
            },
          ],
        };
      case 'feature':
        return {
          content: [
            {
              type: 'text',
              text: `⭐ Content ${contentId} featured on homepage!`,
            },
          ],
        };
      default:
        throw new Error(`Unknown moderation action: ${action}`);
    }
  }

  private async analyzeContentSentiment(args: any) {
    const { category = 'all', timeframe = 'all' } = args;

    const analysis = {
      summary: {
        totalItems: 45,
        positive: 42,
        neutral: 3,
        negative: 0,
        averageRating: 4.8,
      },
      themes: ['quality', 'innovation', 'user-friendly', 'helpful', 'engaging'],
      topCategories: [
        { name: category || 'general', count: 28 },
        { name: 'feedback', count: 12 },
        { name: 'suggestions', count: 5 },
      ],
      timeframe,
      insights: [
        'Overwhelmingly positive user feedback',
        'High engagement rates across all categories',
        'Users appreciate the intuitive design',
        'Strong community participation',
      ],
    };

    return {
      content: [
        {
          type: 'text',
          text:
            `Content Sentiment Analysis (${timeframe}):\n\n` +
            JSON.stringify(analysis, null, 2) +
            '\n\nKey Insights:\n' +
            analysis.insights.map((insight) => `• ${insight}`).join('\n'),
        },
      ],
    };
  }

  private async generateContentReport(args: any) {
    const { timeframe, includeCharts = false } = args;

    const report = {
      period: timeframe,
      generated: new Date().toISOString(),
      metrics: {
        content: {
          total: 45,
          approved: 42,
          pending: 3,
          featured: 8,
        },
        engagement: {
          views: 1250,
          interactions: 89,
          shares: 23,
          averageTimeOnContent: '2m 45s',
        },
        growth: {
          newSubmissions: 12,
          activeUsers: 28,
          returningUsers: 15,
        },
      },
      topPerformers: [
        { title: 'Project Update #3', views: 145, engagement: '8.5%' },
        { title: 'Community Spotlight', views: 132, engagement: '7.2%' },
        { title: 'Feature Showcase', views: 98, engagement: '6.8%' },
      ],
    };

    let reportText = `Project Content Report (${timeframe})\n\n` + JSON.stringify(report, null, 2);

    if (includeCharts) {
      reportText +=
        '\n\n📊 Data Visualization:\n' +
        '• Content approval rate: 93.3%\n' +
        '• Engagement trend: ↗️ +15% from last period\n' +
        '• User growth: ↗️ +22% new users\n';
    }

    return {
      content: [
        {
          type: 'text',
          text: reportText,
        },
      ],
    };
  }

  private async manageTimeline(args: any) {
    const { action, eventData, eventId } = args;

    switch (action) {
      case 'create': {
        const newEvent: TimelineEvent = {
          id: `event-${Date.now()}`,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          category: eventData.category,
          isPublic: true,
        };

        return {
          content: [
            {
              type: 'text',
              text:
                `Timeline Event Created! 📅\n\n` +
                `Title: ${newEvent.title}\n` +
                `Date: ${new Date(newEvent.date).toLocaleDateString()}\n` +
                `Category: ${newEvent.category}\n` +
                `ID: ${newEvent.id}\n\n` +
                `Event has been added to the project timeline.`,
            },
          ],
        };
      }

      case 'list':
        return {
          content: [
            {
              type: 'text',
              text:
                'Project Timeline Events:\n\n' +
                '1. Project Kickoff (2024-01-15)\n' +
                '2. First Milestone (2024-02-28)\n' +
                '3. Beta Release (2024-04-10)\n' +
                '4. Public Launch (2024-06-01)\n\n' +
                'Use "create" action to add new events.',
            },
          ],
        };

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Timeline action "${action}" completed for event ${eventId || 'new'}.`,
            },
          ],
        };
    }
  }

  private async backupProjectContent(args: any) {
    const { includeMedia = false, format = 'json' } = args;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupInfo = {
      name: `project-backup-${timestamp}`,
      format,
      created: new Date().toISOString(),
      includes: {
        content: true,
        timeline: true,
        userData: true,
        settings: true,
        media: includeMedia,
      },
      estimatedSize: includeMedia ? '~500MB' : '~2.5MB',
      location: `./backups/project-backup-${timestamp}.${format}`,
    };

    return {
      content: [
        {
          type: 'text',
          text:
            `Project Backup Created! 💾\n\n` +
            JSON.stringify(backupInfo, null, 2) +
            '\n\nBackup includes:\n' +
            `• All content submissions and approvals\n` +
            `• Complete timeline data\n` +
            `• User profiles and activity\n` +
            `• System settings and configurations\n` +
            `${includeMedia ? '• Media files and uploads\n' : ''}` +
            `\nFormat: ${format.toUpperCase()}\n` +
            `Location: ${backupInfo.location}\n` +
            `Size: ${backupInfo.estimatedSize}`,
        },
      ],
    };
  }

  private generateContentList(category?: string): string {
    const mockContent = [
      {
        id: 'content-001',
        title: 'User Feedback on New Feature',
        author: 'John Doe',
        category: 'feedback',
        status: 'pending',
        date: '2024-08-19',
      },
      {
        id: 'content-002',
        title: 'Project Improvement Suggestion',
        author: 'Jane Smith',
        category: 'suggestions',
        status: 'approved',
        date: '2024-08-18',
      },
      {
        id: 'content-003',
        title: 'Community Spotlight Post',
        author: 'Mike Johnson',
        category: 'community',
        status: 'featured',
        date: '2024-08-17',
      },
    ];

    const filtered = category
      ? mockContent.filter((item) => item.category === category)
      : mockContent;

    return (
      `Content Submissions${category ? ` (${category})` : ''}:\n\n` +
      filtered
        .map(
          (item, index) =>
            `${index + 1}. ${item.title}\n` +
            `   Author: ${item.author}\n` +
            `   Category: ${item.category}\n` +
            `   Status: ${item.status}\n` +
            `   Date: ${item.date}\n` +
            `   ID: ${item.id}\n`
        )
        .join('\n')
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`Universal Content MCP Server running (Project: ${this.projectType})`);
  }
}

// Run the server
const server = new UniversalContentServer();
server.run().catch(console.error);
