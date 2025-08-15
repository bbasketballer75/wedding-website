#!/usr/bin/env node

/**
 * HTTP Client MCP Server for Austin's Wedding Website
 * Provides comprehensive HTTP client capabilities for API testing and debugging
 *
 * Features:
 * - HTTP requests (GET, POST, PUT, DELETE, PATCH)
 * - Headers and authentication support
 * - JSON/form-data/multipart handling
 * - Response analysis and debugging
 * - Session management with cookies
 * - Performance monitoring
 *
 * @author Austin Porada
 * @date 2025-01-08
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class HttpClientMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'http-client-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.sessions = new Map(); // Store session cookies

    // Configure axios defaults for better performance
    axios.defaults.timeout = 30000;
    axios.defaults.maxRedirects = 5;
    axios.defaults.headers.common['User-Agent'] = 'Austin-Wedding-Website-MCP/1.0';

    // Configure axios interceptors for enhanced logging
    this.setupAxiosInterceptors();
    this.setupToolHandlers();
  }

  setupAxiosInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        const duration = Date.now() - response.config.metadata.startTime;
        response.duration = duration;
        return response;
      },
      (error) => {
        if (error.config && error.config.metadata) {
          const duration = Date.now() - error.config.metadata.startTime;
          error.duration = duration;
        }
        return Promise.reject(error);
      }
    );
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'http_request',
          description: 'Make HTTP requests with comprehensive options',
          inputSchema: {
            type: 'object',
            properties: {
              method: {
                type: 'string',
                enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
                default: 'GET',
                description: 'HTTP method',
              },
              url: {
                type: 'string',
                description: 'Target URL',
              },
              headers: {
                type: 'object',
                description: 'Request headers',
                additionalProperties: { type: 'string' },
              },
              data: {
                description: 'Request body data',
              },
              params: {
                type: 'object',
                description: 'URL query parameters',
                additionalProperties: { type: 'string' },
              },
              timeout: {
                type: 'number',
                default: 30000,
                description: 'Request timeout in milliseconds',
              },
              followRedirects: {
                type: 'boolean',
                default: true,
                description: 'Follow HTTP redirects',
              },
              validateStatus: {
                type: 'boolean',
                default: false,
                description: 'Only resolve for 2xx status codes',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'test_api_endpoint',
          description: 'Test a specific API endpoint with common scenarios',
          inputSchema: {
            type: 'object',
            properties: {
              baseUrl: {
                type: 'string',
                description: 'Base URL of the API',
              },
              endpoint: {
                type: 'string',
                description: 'API endpoint path',
              },
              testCases: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    method: { type: 'string' },
                    data: {},
                    expectedStatus: { type: 'number' },
                  },
                },
                description: 'Test cases to run',
              },
            },
            required: ['baseUrl', 'endpoint'],
          },
        },
        {
          name: 'check_service_health',
          description: 'Check the health/status of a service',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'Service URL to check',
              },
              healthEndpoint: {
                type: 'string',
                default: '/health',
                description: 'Health check endpoint',
              },
              timeout: {
                type: 'number',
                default: 10000,
                description: 'Timeout in milliseconds',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'benchmark_request',
          description: 'Benchmark an HTTP request for performance analysis',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to benchmark',
              },
              method: {
                type: 'string',
                default: 'GET',
                description: 'HTTP method',
              },
              iterations: {
                type: 'number',
                default: 10,
                minimum: 1,
                maximum: 100,
                description: 'Number of iterations',
              },
              data: {
                description: 'Request body data',
              },
              headers: {
                type: 'object',
                description: 'Request headers',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'parse_response',
          description: 'Parse and analyze an HTTP response',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to fetch and parse',
              },
              parseAs: {
                type: 'string',
                enum: ['json', 'text', 'html', 'xml'],
                default: 'json',
                description: 'How to parse the response',
              },
              extractPath: {
                type: 'string',
                description: 'JSON path to extract (for JSON responses)',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'create_session',
          description: 'Create a session for maintaining cookies across requests',
          inputSchema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'Unique session identifier',
              },
              baseUrl: {
                type: 'string',
                description: 'Base URL for the session',
              },
              defaultHeaders: {
                type: 'object',
                description: 'Default headers for all requests in this session',
              },
            },
            required: ['sessionId'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'http_request':
            return await this.makeHttpRequest(args);
          case 'test_api_endpoint':
            return await this.testApiEndpoint(args);
          case 'check_service_health':
            return await this.checkServiceHealth(args);
          case 'benchmark_request':
            return await this.benchmarkRequest(args);
          case 'parse_response':
            return await this.parseResponse(args);
          case 'create_session':
            return await this.createSession(args);
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

  async makeHttpRequest(args) {
    const {
      method = 'GET',
      url,
      headers = {},
      data,
      params,
      timeout = 30000,
      followRedirects = true,
      validateStatus = false,
    } = args;

    try {
      const startTime = Date.now();

      const config = {
        method,
        url,
        headers,
        data,
        params,
        timeout,
        maxRedirects: followRedirects ? 5 : 0,
        validateStatus: validateStatus ? undefined : () => true, // Accept all status codes
      };

      const response = await axios(config);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        duration: `${duration}ms`,
        size: JSON.stringify(response.data).length,
        data: response.data,
      };

      return {
        content: [
          {
            type: 'text',
            text:
              `✅ HTTP ${method} ${url}\n` +
              `📊 Status: ${response.status} ${response.statusText}\n` +
              `⏱️ Duration: ${duration}ms\n` +
              `📦 Size: ${responseInfo.size} bytes\n` +
              `📄 Response:\n${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      const errorInfo = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      };

      return {
        content: [
          {
            type: 'text',
            text:
              `❌ HTTP ${method} ${url} FAILED\n` +
              `🚨 Error: ${error.message}\n` +
              `📊 Status: ${errorInfo.status || 'N/A'}\n` +
              `📄 Response: ${JSON.stringify(errorInfo.data || {}, null, 2)}`,
          },
        ],
      };
    }
  }

  async testApiEndpoint(args) {
    const { baseUrl, endpoint, testCases = [] } = args;
    const fullUrl = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const results = [];

    // Default test cases if none provided
    const defaultTests =
      testCases.length > 0
        ? testCases
        : [
            { name: 'GET Request', method: 'GET', expectedStatus: 200 },
            { name: 'OPTIONS Request', method: 'OPTIONS', expectedStatus: 200 },
          ];

    for (const testCase of defaultTests) {
      try {
        const response = await axios({
          method: testCase.method || 'GET',
          url: fullUrl,
          data: testCase.data,
          validateStatus: () => true,
        });

        const passed = !testCase.expectedStatus || response.status === testCase.expectedStatus;

        results.push({
          name: testCase.name,
          passed,
          status: response.status,
          expected: testCase.expectedStatus,
          response: response.data,
        });
      } catch (error) {
        results.push({
          name: testCase.name,
          passed: false,
          error: error.message,
        });
      }
    }

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;

    return {
      content: [
        {
          type: 'text',
          text:
            `🧪 API Endpoint Test Results for ${fullUrl}\n\n` +
            `📊 Results: ${passedCount}/${totalCount} tests passed\n\n` +
            results
              .map(
                (r) =>
                  `${r.passed ? '✅' : '❌'} ${r.name}\n` +
                  `   Status: ${r.status || 'ERROR'} ${r.expected ? `(expected ${r.expected})` : ''}\n` +
                  `${r.error ? `   Error: ${r.error}\n` : ''}`
              )
              .join('\n'),
        },
      ],
    };
  }

  async checkServiceHealth(args) {
    const { url, healthEndpoint = '/health', timeout = 10000 } = args;
    const healthUrl = `${url.replace(/\/$/, '')}${healthEndpoint}`;

    try {
      const startTime = Date.now();
      const response = await axios.get(healthUrl, {
        timeout,
        validateStatus: () => true,
      });
      const endTime = Date.now();

      const isHealthy = response.status >= 200 && response.status < 300;
      const duration = endTime - startTime;

      return {
        content: [
          {
            type: 'text',
            text:
              `${isHealthy ? '✅' : '❌'} Service Health Check\n` +
              `🌐 URL: ${healthUrl}\n` +
              `📊 Status: ${response.status} ${response.statusText}\n` +
              `⏱️ Response Time: ${duration}ms\n` +
              `🏥 Health: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}\n` +
              `📄 Response: ${JSON.stringify(response.data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text:
              `❌ Service Health Check FAILED\n` +
              `🌐 URL: ${healthUrl}\n` +
              `🚨 Error: ${error.message}\n` +
              `🏥 Health: UNHEALTHY`,
          },
        ],
      };
    }
  }

  async benchmarkRequest(args) {
    const { url, method = 'GET', iterations = 10, data, headers } = args;

    const results = [];
    let totalTime = 0;
    let successCount = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = Date.now();
        const response = await axios({
          method,
          url,
          data,
          headers,
          validateStatus: () => true,
        });
        const endTime = Date.now();
        const duration = endTime - startTime;

        results.push({
          iteration: i + 1,
          duration,
          status: response.status,
          success: response.status < 400,
        });

        totalTime += duration;
        if (response.status < 400) successCount++;
      } catch (error) {
        results.push({
          iteration: i + 1,
          duration: null,
          status: 'ERROR',
          success: false,
          error: error.message,
        });
      }
    }

    const avgTime = totalTime / successCount || 0;
    const successRate = (successCount / iterations) * 100;
    const durations = results.filter((r) => r.duration).map((r) => r.duration);
    const minTime = Math.min(...durations);
    const maxTime = Math.max(...durations);

    return {
      content: [
        {
          type: 'text',
          text:
            `📊 Benchmark Results for ${method} ${url}\n\n` +
            `🎯 Iterations: ${iterations}\n` +
            `✅ Success Rate: ${successRate.toFixed(1)}%\n` +
            `⏱️ Average Time: ${avgTime.toFixed(2)}ms\n` +
            `🚀 Fastest: ${minTime || 0}ms\n` +
            `🐌 Slowest: ${maxTime || 0}ms\n\n` +
            `📈 Detailed Results:\n` +
            results
              .map(
                (r) => `${r.iteration}: ${r.duration ? `${r.duration}ms` : 'FAILED'} (${r.status})`
              )
              .join('\n'),
        },
      ],
    };
  }

  async parseResponse(args) {
    const { url, parseAs = 'json', extractPath } = args;

    try {
      const response = await axios.get(url, { validateStatus: () => true });
      let parsedData = response.data;

      switch (parseAs) {
        case 'json':
          if (typeof parsedData === 'string') {
            parsedData = JSON.parse(parsedData);
          }
          if (extractPath) {
            // Simple JSON path extraction (e.g., "data.items[0].name")
            const paths = extractPath.split('.');
            let current = parsedData;
            for (const path of paths) {
              if (path.includes('[') && path.includes(']')) {
                const [key, index] = path.split(/[\[\]]/);
                current = current[key][parseInt(index)];
              } else {
                current = current[path];
              }
            }
            parsedData = current;
          }
          break;
        case 'text':
          parsedData = response.data.toString();
          break;
        case 'html':
        case 'xml':
          parsedData = response.data.toString();
          break;
      }

      return {
        content: [
          {
            type: 'text',
            text:
              `📄 Parsed Response from ${url}\n` +
              `📊 Status: ${response.status}\n` +
              `🔧 Parse Type: ${parseAs}\n` +
              `${extractPath ? `🎯 Extract Path: ${extractPath}\n` : ''}` +
              `📦 Result:\n${JSON.stringify(parsedData, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to parse response: ${error.message}`);
    }
  }

  async createSession(args) {
    const { sessionId, baseUrl, defaultHeaders = {} } = args;

    this.sessions.set(sessionId, {
      baseUrl,
      defaultHeaders,
      cookies: [],
      created: new Date().toISOString(),
    });

    return {
      content: [
        {
          type: 'text',
          text:
            `✅ HTTP Session created\n` +
            `🆔 Session ID: ${sessionId}\n` +
            `🌐 Base URL: ${baseUrl || 'None'}\n` +
            `📋 Default Headers: ${Object.keys(defaultHeaders).length} headers\n` +
            `⏰ Created: ${new Date().toLocaleString()}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('HTTP Client MCP Server running on stdio');
    console.error(
      'Available tools: http_request, test_api_endpoint, check_service_health, benchmark_request, parse_response, create_session'
    );
    console.error('API testing and debugging capabilities ready!');
  }
}

const server = new HttpClientMCPServer();
server.run().catch(console.error);
