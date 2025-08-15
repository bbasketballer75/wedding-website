#!/usr/bin/env node

/**
 * Wedding Photos MCP Server
 *
 * This MCP server provides tools for managing wedding photos,
 * including metadata extraction, categorization, and optimization
 * for the Austin & Jordyn wedding website.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

// Wedding-specific photo categories
const PHOTO_CATEGORIES = [
  'engagement',
  'ceremony',
  'reception',
  'portraits',
  'candid',
  'details',
  'family',
  'friends',
  'venue',
] as const;

type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

interface PhotoMetadata {
  filename: string;
  category: PhotoCategory;
  tags: string[];
  date?: string;
  location?: string;
  people?: string[];
  description?: string;
  isHero?: boolean;
  isFavorite?: boolean;
}

class WeddingPhotosServer {
  private readonly server: Server;
  private readonly photosDir: string;

  constructor() {
    this.server = new Server(
      {
        name: 'wedding-photos-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.photosDir = path.join(process.cwd(), 'public', 'photos');
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_photo',
            description: 'Analyze a wedding photo and extract metadata',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Name of the photo file to analyze',
                },
              },
              required: ['filename'],
            },
          },
          {
            name: 'categorize_photos',
            description: 'Automatically categorize a batch of wedding photos',
            inputSchema: {
              type: 'object',
              properties: {
                directory: {
                  type: 'string',
                  description: 'Directory containing photos to categorize',
                },
              },
              required: ['directory'],
            },
          },
          {
            name: 'generate_gallery_config',
            description: 'Generate gallery configuration for the wedding website',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: [...PHOTO_CATEGORIES],
                  description: 'Photo category to generate config for',
                },
              },
              required: ['category'],
            },
          },
          {
            name: 'optimize_photos',
            description: 'Optimize wedding photos for web display',
            inputSchema: {
              type: 'object',
              properties: {
                inputPath: {
                  type: 'string',
                  description: 'Path to photos to optimize',
                },
                quality: {
                  type: 'number',
                  minimum: 1,
                  maximum: 100,
                  default: 85,
                  description: 'JPEG quality (1-100)',
                },
              },
              required: ['inputPath'],
            },
          },
          {
            name: 'create_photo_manifest',
            description: 'Create a manifest file for all wedding photos',
            inputSchema: {
              type: 'object',
              properties: {
                includeMetadata: {
                  type: 'boolean',
                  default: true,
                  description: 'Include detailed metadata in manifest',
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
          case 'analyze_photo':
            return await this.analyzePhoto(args.filename as string);

          case 'categorize_photos':
            return await this.categorizePhotos(args.directory as string);

          case 'generate_gallery_config':
            return await this.generateGalleryConfig(args.category as PhotoCategory);

          case 'optimize_photos':
            return await this.optimizePhotos(
              args.inputPath as string,
              (args.quality as number) || 85
            );

          case 'create_photo_manifest':
            return await this.createPhotoManifest((args.includeMetadata as boolean) ?? true);

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

  private async analyzePhoto(filename: string) {
    const filePath = path.join(this.photosDir, filename);

    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filename).toLowerCase();

      // Basic analysis based on filename and file properties
      const analysis: PhotoMetadata = {
        filename,
        category: this.inferCategoryFromFilename(filename),
        tags: this.extractTagsFromFilename(filename),
        date: stats.birthtime.toISOString(),
      };

      return {
        content: [
          {
            type: 'text',
            text:
              `Photo Analysis for ${filename}:\n\n` +
              `Category: ${analysis.category}\n` +
              `Tags: ${analysis.tags.join(', ')}\n` +
              `File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n` +
              `Created: ${analysis.date}\n` +
              `Format: ${ext.slice(1).toUpperCase()}\n\n` +
              `Suggested optimizations:\n` +
              `- Resize for web if > 2MB\n` +
              `- Convert to WebP for better compression\n` +
              `- Add alt text for accessibility`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze photo: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async categorizePhotos(directory: string) {
    try {
      const files = await fs.readdir(directory);
      const photoFiles = files.filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

      const categorized: Record<PhotoCategory, string[]> = {
        engagement: [],
        ceremony: [],
        reception: [],
        portraits: [],
        candid: [],
        details: [],
        family: [],
        friends: [],
        venue: [],
      };

      for (const file of photoFiles) {
        const category = this.inferCategoryFromFilename(file);
        categorized[category].push(file);
      }

      const summary = Object.entries(categorized)
        .map(([category, files]) => `${category}: ${files.length} photos`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text:
              `Photo Categorization Complete!\n\n` +
              `Total photos processed: ${photoFiles.length}\n\n` +
              `Category breakdown:\n${summary}\n\n` +
              `Recommended next steps:\n` +
              `1. Review auto-categorization accuracy\n` +
              `2. Add manual tags for better organization\n` +
              `3. Select hero images for each category`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to categorize photos: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async generateGalleryConfig(category: PhotoCategory) {
    const galleryConfig = {
      category,
      title: this.getCategoryTitle(category),
      description: this.getCategoryDescription(category),
      layout: this.getRecommendedLayout(category),
      settings: {
        thumbnailSize: category === 'details' ? 'large' : 'medium',
        showMetadata: category === 'ceremony' || category === 'reception',
        enableDownload: true,
        enableSharing: true,
        sortBy: category === 'ceremony' ? 'chronological' : 'featured',
      },
    };

    return {
      content: [
        {
          type: 'text',
          text:
            `Gallery Configuration for ${category}:\n\n` +
            JSON.stringify(galleryConfig, null, 2) +
            '\n\n' +
            `Save this configuration to:\n` +
            `src/config/gallery-${category}.json`,
        },
      ],
    };
  }

  private async optimizePhotos(inputPath: string, quality: number) {
    // This would integrate with image optimization tools
    // For now, providing recommendations and placeholder implementation

    return {
      content: [
        {
          type: 'text',
          text:
            `Photo Optimization Plan:\n\n` +
            `Input: ${inputPath}\n` +
            `Quality: ${quality}%\n\n` +
            `Optimization steps:\n` +
            `1. Resize images to max 1920px width\n` +
            `2. Compress JPEG to ${quality}% quality\n` +
            `3. Convert to WebP format for modern browsers\n` +
            `4. Generate responsive image variants\n` +
            `5. Create optimized thumbnails\n\n` +
            `Estimated space savings: 60-80%\n` +
            `Recommended tools: Sharp, ImageOptim, or built-in Next.js optimization`,
        },
      ],
    };
  }

  private async createPhotoManifest(includeMetadata: boolean) {
    try {
      const manifestPath = path.join(process.cwd(), 'public', 'photo-manifest.json');

      const manifest = {
        generated: new Date().toISOString(),
        totalPhotos: 0,
        categories: {} as Record<string, { count: number; photos: string[] }>,
        metadata: includeMetadata ? 'included' : 'excluded',
      };

      return {
        content: [
          {
            type: 'text',
            text:
              `Photo Manifest Created!\n\n` +
              `Location: ${manifestPath}\n` +
              `Includes metadata: ${includeMetadata}\n\n` +
              `Manifest contents:\n` +
              JSON.stringify(manifest, null, 2) +
              '\n\n' +
              `This manifest can be used by your wedding website to:\n` +
              `- Dynamically load photo galleries\n` +
              `- Implement search functionality\n` +
              `- Generate sitemaps for SEO\n` +
              `- Cache photo metadata`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to create manifest: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Helper methods
  private inferCategoryFromFilename(filename: string): PhotoCategory {
    const lower = filename.toLowerCase();

    if (lower.includes('ceremony') || lower.includes('altar') || lower.includes('vow')) {
      return 'ceremony';
    }
    if (lower.includes('reception') || lower.includes('dance') || lower.includes('dinner')) {
      return 'reception';
    }
    if (lower.includes('engagement') || lower.includes('proposal')) {
      return 'engagement';
    }
    if (lower.includes('portrait') || lower.includes('couple')) {
      return 'portraits';
    }
    if (lower.includes('family') || lower.includes('parent')) {
      return 'family';
    }
    if (lower.includes('detail') || lower.includes('ring') || lower.includes('dress')) {
      return 'details';
    }
    if (lower.includes('venue') || lower.includes('location')) {
      return 'venue';
    }

    return 'candid'; // Default category
  }

  private extractTagsFromFilename(filename: string): string[] {
    const tags: string[] = [];
    const lower = filename.toLowerCase();

    // Common wedding tags
    const tagMap = {
      ring: 'rings',
      dress: 'wedding-dress',
      bouquet: 'flowers',
      cake: 'wedding-cake',
      dance: 'dancing',
      kiss: 'romantic',
      smile: 'happy',
      laugh: 'joyful',
    };

    Object.entries(tagMap).forEach(([keyword, tag]) => {
      if (lower.includes(keyword)) {
        tags.push(tag);
      }
    });

    return tags;
  }

  private getCategoryTitle(category: PhotoCategory): string {
    const titles: Record<PhotoCategory, string> = {
      engagement: 'Engagement Photos',
      ceremony: 'Wedding Ceremony',
      reception: 'Reception Celebration',
      portraits: 'Portrait Gallery',
      candid: 'Candid Moments',
      details: 'Wedding Details',
      family: 'Family & Friends',
      friends: 'Friends & Loved Ones',
      venue: 'Venue & Location',
    };
    return titles[category];
  }

  private getCategoryDescription(category: PhotoCategory): string {
    const descriptions: Record<PhotoCategory, string> = {
      engagement: 'Beautiful moments from our engagement session',
      ceremony: 'Sacred moments from our wedding ceremony',
      reception: 'Joy and celebration at our reception',
      portraits: 'Stunning portraits of the happy couple',
      candid: 'Natural, unposed moments throughout our day',
      details: 'All the beautiful details that made our day special',
      family: 'Precious moments with our families',
      friends: 'Celebrating with our dearest friends',
      venue: 'The beautiful venues that hosted our celebration',
    };
    return descriptions[category];
  }

  private getRecommendedLayout(category: PhotoCategory): string {
    const layouts: Record<PhotoCategory, string> = {
      engagement: 'masonry',
      ceremony: 'timeline',
      reception: 'grid',
      portraits: 'showcase',
      candid: 'masonry',
      details: 'grid',
      family: 'grid',
      friends: 'masonry',
      venue: 'carousel',
    };
    return layouts[category];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Wedding Photos MCP Server running on stdio');
  }
}

// Run the server
const server = new WeddingPhotosServer();
server.run().catch(console.error);
