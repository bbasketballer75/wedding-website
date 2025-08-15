#!/usr/bin/env node

/**
 * Node.js Time MCP Server - Replaces Python time server
 * 100% JavaScript implementation for perfect compatibility
 *
 * @author Austin Porada
 * @date 2025-01-08
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

class NodeJSTimeMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nodejs-time-mcp-server',
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
          name: 'get_current_time',
          description: 'Get current time in specified timezone with JavaScript',
          inputSchema: {
            type: 'object',
            properties: {
              timezone: {
                type: 'string',
                default: 'America/New_York',
                description: 'IANA timezone name (e.g., America/New_York, Europe/London)',
              },
              format: {
                type: 'string',
                enum: ['iso', 'local', 'utc', 'timestamp'],
                default: 'iso',
                description: 'Output format',
              },
            },
          },
        },
        {
          name: 'convert_time',
          description: 'Convert time between timezones with JavaScript',
          inputSchema: {
            type: 'object',
            properties: {
              time: {
                type: 'string',
                description: 'Time in HH:MM format or ISO string',
              },
              source_timezone: {
                type: 'string',
                default: 'America/New_York',
                description: 'Source timezone',
              },
              target_timezone: {
                type: 'string',
                description: 'Target timezone',
              },
              date: {
                type: 'string',
                description: 'Specific date (YYYY-MM-DD), defaults to today',
              },
            },
            required: ['time', 'target_timezone'],
          },
        },
        {
          name: 'wedding_countdown',
          description: 'Calculate time remaining until wedding date',
          inputSchema: {
            type: 'object',
            properties: {
              wedding_date: {
                type: 'string',
                description: 'Wedding date in YYYY-MM-DD format',
              },
              wedding_time: {
                type: 'string',
                default: '16:00',
                description: 'Wedding time in HH:MM format',
              },
              timezone: {
                type: 'string',
                default: 'America/New_York',
                description: 'Wedding timezone',
              },
            },
            required: ['wedding_date'],
          },
        },
        {
          name: 'schedule_planner',
          description: 'Plan wedding schedule across multiple timezones',
          inputSchema: {
            type: 'object',
            properties: {
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    time: { type: 'string' },
                    duration: { type: 'number' },
                  },
                },
                description: 'Wedding events with times',
              },
              main_timezone: {
                type: 'string',
                default: 'America/New_York',
                description: 'Main wedding timezone',
              },
              guest_timezones: {
                type: 'array',
                items: { type: 'string' },
                description: 'Guest timezones for conversion',
              },
            },
            required: ['events'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_current_time':
            return await this.getCurrentTime(args);
          case 'convert_time':
            return await this.convertTime(args);
          case 'wedding_countdown':
            return await this.weddingCountdown(args);
          case 'schedule_planner':
            return await this.schedulePlanner(args);
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

  async getCurrentTime(args) {
    const { timezone = 'America/New_York', format = 'iso' } = args;

    try {
      const now = new Date();
      const options = { timeZone: timezone };

      let formattedTime;
      let isDST = false;

      switch (format) {
        case 'iso':
          formattedTime = now.toLocaleString('sv-SE', {
            ...options,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          });
          break;
        case 'local':
          formattedTime = now.toLocaleString('en-US', options);
          break;
        case 'utc':
          formattedTime = now.toISOString();
          break;
        case 'timestamp':
          formattedTime = Math.floor(now.getTime() / 1000);
          break;
        default:
          formattedTime = now.toISOString();
      }

      // Determine if DST is active
      const jan = new Date(now.getFullYear(), 0, 1);
      const jul = new Date(now.getFullYear(), 6, 1);
      const janOffset = jan.getTimezoneOffset();
      const julOffset = jul.getTimezoneOffset();
      isDST = Math.min(janOffset, julOffset) === now.getTimezoneOffset();

      return {
        content: [
          {
            type: 'text',
            text:
              `🕐 Current Time Information\n` +
              `📍 Timezone: ${timezone}\n` +
              `⏰ Time: ${formattedTime}\n` +
              `🌅 Daylight Saving: ${isDST ? 'Active' : 'Inactive'}\n` +
              `📅 Format: ${format}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get current time: ${error.message}`);
    }
  }

  async convertTime(args) {
    const { time, source_timezone = 'America/New_York', target_timezone, date } = args;

    try {
      const baseDate = date ? new Date(`${date}T00:00:00`) : new Date();

      // Parse time (HH:MM format)
      const [hours, minutes] = time.includes(':')
        ? time.split(':').map(Number)
        : [parseInt(time), 0];

      // Create source date
      const sourceDate = new Date(baseDate);
      sourceDate.setHours(hours, minutes, 0, 0);

      // Format for source timezone
      const sourceFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: source_timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      // Format for target timezone
      const targetFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: target_timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      // Calculate time difference
      const sourceOffset = this.getTimezoneOffset(sourceDate, source_timezone);
      const targetOffset = this.getTimezoneOffset(sourceDate, target_timezone);
      const diffHours = (targetOffset - sourceOffset) / 60;
      const diffSign = diffHours >= 0 ? '+' : '';

      return {
        content: [
          {
            type: 'text',
            text:
              `🔄 Time Conversion\n` +
              `📍 From: ${source_timezone}\n` +
              `   ⏰ ${sourceFormatted}\n` +
              `📍 To: ${target_timezone}\n` +
              `   ⏰ ${targetFormatted}\n` +
              `⏱️ Time Difference: ${diffSign}${diffHours}h`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to convert time: ${error.message}`);
    }
  }

  async weddingCountdown(args) {
    const { wedding_date, wedding_time = '16:00', timezone = 'America/New_York' } = args;

    try {
      const [_hours, _minutes] = wedding_time.split(':').map(Number);
      const weddingDateTime = new Date(`${wedding_date}T${wedding_time}:00`);

      // Adjust for timezone
      const now = new Date();
      const timeUntilWedding = weddingDateTime.getTime() - now.getTime();

      if (timeUntilWedding < 0) {
        return {
          content: [
            {
              type: 'text',
              text:
                `🎉 Congratulations! Your wedding has already happened!\n` +
                `💒 Wedding was on ${wedding_date} at ${wedding_time} (${timezone})`,
            },
          ],
        };
      }

      const days = Math.floor(timeUntilWedding / (1000 * 60 * 60 * 24));
      const hours_remaining = Math.floor(
        (timeUntilWedding % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes_remaining = Math.floor((timeUntilWedding % (1000 * 60 * 60)) / (1000 * 60));

      return {
        content: [
          {
            type: 'text',
            text:
              `💍 Wedding Countdown\n` +
              `📅 Wedding Date: ${wedding_date}\n` +
              `⏰ Wedding Time: ${wedding_time} (${timezone})\n` +
              `⏳ Time Remaining:\n` +
              `   📆 ${days} days\n` +
              `   🕐 ${hours_remaining} hours\n` +
              `   ⏱️ ${minutes_remaining} minutes\n\n` +
              `🎊 Almost there! Can't wait to celebrate!`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to calculate wedding countdown: ${error.message}`);
    }
  }

  async schedulePlanner(args) {
    const { events, main_timezone = 'America/New_York', guest_timezones = [] } = args;

    try {
      const schedule = events.map((event) => {
        const eventTime = new Date(`2025-01-01T${event.time}:00`);
        const conversions = guest_timezones.map((tz) => {
          const converted = eventTime.toLocaleString('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          });
          return `${tz}: ${converted}`;
        });

        return {
          name: event.name,
          mainTime: `${event.time} (${main_timezone})`,
          conversions,
          duration: event.duration || 60,
        };
      });

      const scheduleText = schedule
        .map((event) => {
          const conversionText =
            event.conversions.length > 0 ? '\n   ' + event.conversions.join('\n   ') : '';

          return (
            `📅 ${event.name}\n` +
            `   ⏰ ${event.mainTime}\n` +
            `   ⏱️ Duration: ${event.duration} minutes${conversionText}`
          );
        })
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text:
              `📋 Wedding Schedule Planner\n` +
              `🏠 Main Timezone: ${main_timezone}\n` +
              `🌍 Guest Timezones: ${guest_timezones.join(', ') || 'None'}\n\n` +
              scheduleText,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create schedule: ${error.message}`);
    }
  }

  getTimezoneOffset(date, timezone) {
    const utc1 = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const utc2 = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (utc2.getTime() - utc1.getTime()) / (1000 * 60);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Node.js Time MCP Server running on stdio');
    console.error(
      'Available tools: get_current_time, convert_time, wedding_countdown, schedule_planner'
    );
    console.error('100% JavaScript time handling ready!');
  }
}

const server = new NodeJSTimeMCPServer();
server.run().catch(console.error);
