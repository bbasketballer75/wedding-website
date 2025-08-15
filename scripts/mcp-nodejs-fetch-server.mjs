#!/usr/bin/env node

/**
 * Node.js Fetch MCP Server - Replaces Python fetch server
 * 100% JavaScript implementation for perfect compatibility
 *
 * @author Austin Porada
 * @date 2025-01-08
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

class NodeJSFetchMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nodejs-fetch-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'fetch_url',
          description: 'Fetch and process web content with JavaScript/Node.js',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to fetch',
              },
              max_length: {
                type: 'number',
                default: 5000,
                description: 'Maximum content length',
              },
              raw: {
                type: 'boolean',
                default: false,
                description: 'Return raw HTML instead of readable content',
              },
              user_agent: {
                type: 'string',
                default: 'Austin-Wedding-Website-Bot/1.0',
                description: 'Custom User-Agent string',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'fetch_multiple',
          description: 'Fetch multiple URLs concurrently',
          inputSchema: {
            type: 'object',
            properties: {
              urls: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of URLs to fetch',
              },
              max_length: {
                type: 'number',
                default: 2000,
                description: 'Maximum content length per URL',
              },
            },
            required: ['urls'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'fetch_url':
            return await this.fetchUrl(args);
          case 'fetch_multiple':
            return await this.fetchMultiple(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async fetchUrl(args) {
    const {
      url,
      max_length = 5000,
      raw = false,
      user_agent = 'Austin-Wedding-Website-Bot/1.0',
    } = args;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': user_agent,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
        },
        timeout: 30000,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      if (raw) {
        const truncated = html.length > max_length ? html.substring(0, max_length) + '...' : html;
        return {
          content: [
            {
              type: 'text',
              text: `Raw HTML from ${url}:\n\n${truncated}`,
            },
          ],
        };
      }

      // Use Readability to extract clean content
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!article) {
        // Fallback to simple text extraction
        const textContent = dom.window.document.body?.textContent || html;
        const cleaned = textContent.replace(/\s+/g, ' ').trim();
        const truncated =
          cleaned.length > max_length ? cleaned.substring(0, max_length) + '...' : cleaned;

        return {
          content: [
            {
              type: 'text',
              text: `Content from ${url}:\n\n${truncated}`,
            },
          ],
        };
      }

      const content = `${article.title ? article.title + '\n\n' : ''}${article.textContent}`;
      const truncated =
        content.length > max_length ? content.substring(0, max_length) + '...' : content;

      return {
        content: [
          {
            type: 'text',
            text:
              `📄 Content from ${url}\n` +
              `📊 Title: ${article.title || 'No title'}\n` +
              `📏 Length: ${content.length} characters\n` +
              `⏱️ Fetch time: ${new Date().toISOString()}\n\n` +
              `${truncated}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to fetch ${url}: ${error.message}`,
          },
        ],
      };
    }
  }

  async fetchMultiple(args) {
    const { urls, max_length = 2000 } = args;

    try {
      const fetchPromises = urls.map(async (url) => {
        try {
          const result = await this.fetchUrl({ url, max_length, raw: false });
          return {
            url,
            success: true,
            content: result.content[0].text,
          };
        } catch (error) {
          return {
            url,
            success: false,
            error: error.message,
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      const successful = results.filter((r) => r.success).length;

      const summary = `📊 Fetched ${urls.length} URLs: ${successful} successful, ${urls.length - successful} failed\n\n`;
      const details = results
        .map((result) => {
          if (result.success) {
            return `✅ ${result.url}\n${result.content}\n`;
          } else {
            return `❌ ${result.url}\nError: ${result.error}\n`;
          }
        })
        .join('\n---\n\n');

      return {
        content: [
          {
            type: 'text',
            text: summary + details,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fetch multiple URLs: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Node.js Fetch MCP Server running on stdio');
    console.error('Available tools: fetch_url, fetch_multiple');
    console.error('100% JavaScript web fetching ready!');
  }
}

const server = new NodeJSFetchMCPServer();
server.run().catch(console.error);
