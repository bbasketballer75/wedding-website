#!/usr/bin/env node

/**
 * Playwright MCP Server for Austin's Wedding Website
 * Provides browser automation, testing, and web interaction capabilities
 *
 * Features:
 * - Browser automation (Chromium, Firefox, Safari)
 * - Web page navigation and interaction
 * - Element finding and manipulation
 * - Screenshot and PDF generation
 * - Form automation and testing
 * - Performance monitoring
 *
 * @author Austin Porada
 * @date 2025-01-08
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { chromium, firefox, webkit } from 'playwright';

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.page = null;
    this.context = null;

    // Performance and optimization settings
    this.defaultViewport = { width: 1280, height: 720 };
    this.defaultTimeout = 30000;
    this.defaultWaitFor = 'networkidle'; // Better for SPA apps

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'launch_browser',
          description: 'Launch a browser instance (chromium, firefox, or webkit)',
          inputSchema: {
            type: 'object',
            properties: {
              browserType: {
                type: 'string',
                enum: ['chromium', 'firefox', 'webkit'],
                default: 'chromium',
                description: 'Type of browser to launch',
              },
              headless: {
                type: 'boolean',
                default: true,
                description: 'Run browser in headless mode',
              },
              viewport: {
                type: 'object',
                properties: {
                  width: { type: 'number', default: 1280 },
                  height: { type: 'number', default: 720 },
                },
                description: 'Browser viewport size',
              },
            },
          },
        },
        {
          name: 'navigate_to',
          description: 'Navigate to a specific URL',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to navigate to',
              },
              waitFor: {
                type: 'string',
                enum: ['load', 'domcontentloaded', 'networkidle'],
                default: 'load',
                description: 'Wait condition for page load',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'take_screenshot',
          description: 'Take a screenshot of the current page',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to save screenshot',
              },
              fullPage: {
                type: 'boolean',
                default: false,
                description: 'Capture full page',
              },
              quality: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                default: 80,
                description: 'Screenshot quality (for JPEG)',
              },
            },
          },
        },
        {
          name: 'click_element',
          description: 'Click on an element by selector',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element',
              },
              waitFor: {
                type: 'boolean',
                default: true,
                description: 'Wait for element to be visible',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'fill_input',
          description: 'Fill an input field with text',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the input field',
              },
              text: {
                type: 'string',
                description: 'Text to fill in the input',
              },
              clear: {
                type: 'boolean',
                default: true,
                description: 'Clear field before filling',
              },
            },
            required: ['selector', 'text'],
          },
        },
        {
          name: 'get_element_text',
          description: 'Get text content from an element',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'wait_for_element',
          description: 'Wait for an element to appear or meet a condition',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element',
              },
              state: {
                type: 'string',
                enum: ['attached', 'detached', 'visible', 'hidden'],
                default: 'visible',
                description: 'Element state to wait for',
              },
              timeout: {
                type: 'number',
                default: 30000,
                description: 'Timeout in milliseconds',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'evaluate_script',
          description: 'Execute JavaScript on the page',
          inputSchema: {
            type: 'object',
            properties: {
              script: {
                type: 'string',
                description: 'JavaScript code to execute',
              },
            },
            required: ['script'],
          },
        },
        {
          name: 'get_page_info',
          description: 'Get current page information (title, URL, etc.)',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'close_browser',
          description: 'Close the browser instance',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args);
          case 'navigate_to':
            return await this.navigateTo(args);
          case 'take_screenshot':
            return await this.takeScreenshot(args);
          case 'click_element':
            return await this.clickElement(args);
          case 'fill_input':
            return await this.fillInput(args);
          case 'get_element_text':
            return await this.getElementText(args);
          case 'wait_for_element':
            return await this.waitForElement(args);
          case 'evaluate_script':
            return await this.evaluateScript(args);
          case 'get_page_info':
            return await this.getPageInfo(args);
          case 'close_browser':
            return await this.closeBrowser(args);
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

  async launchBrowser(args) {
    const { browserType = 'chromium', headless = true, viewport = this.defaultViewport } = args;

    try {
      if (this.browser) {
        await this.browser.close();
      }

      // Map browser types to imports
      const browsers = { chromium, firefox, webkit };
      const browserClass = browsers[browserType];

      if (!browserClass) {
        throw new Error(`Unknown browser type: ${browserType}`);
      }

      // Enhanced launch options for better performance and debugging
      this.browser = await browserClass.launch({
        headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
        ],
      });

      this.context = await this.browser.newContext({
        viewport,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        permissions: ['notifications'],
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      this.page = await this.context.newPage();

      // Set default timeouts
      this.page.setDefaultTimeout(this.defaultTimeout);
      this.page.setDefaultNavigationTimeout(this.defaultTimeout);

      return {
        content: [
          {
            type: 'text',
            text: `Browser ${browserType} launched successfully (headless: ${headless}, viewport: ${viewport.width}x${viewport.height})`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to launch browser: ${error.message}`);
    }
  }

  async navigateTo(args) {
    const { url, waitFor = 'load' } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      await this.page.goto(url, { waitUntil: waitFor });
      const title = await this.page.title();

      return {
        content: [
          {
            type: 'text',
            text: `Navigated to ${url}\nPage title: ${title}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to navigate to ${url}: ${error.message}`);
    }
  }

  async takeScreenshot(args) {
    const { path, fullPage = false, quality = 80 } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      await this.page.screenshot({
        path,
        fullPage,
        quality: path?.endsWith('.jpg') || path?.endsWith('.jpeg') ? quality : undefined,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Screenshot saved${path ? ` to ${path}` : ' to buffer'} (fullPage: ${fullPage})`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to take screenshot: ${error.message}`);
    }
  }

  async clickElement(args) {
    const { selector, waitFor = true } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      if (waitFor) {
        await this.page.waitForSelector(selector, { state: 'visible' });
      }
      await this.page.click(selector);

      return {
        content: [
          {
            type: 'text',
            text: `Clicked element: ${selector}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to click element ${selector}: ${error.message}`);
    }
  }

  async fillInput(args) {
    const { selector, text, clear = true } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      if (clear) {
        await this.page.fill(selector, text);
      } else {
        await this.page.type(selector, text);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Filled input ${selector} with: ${text}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to fill input ${selector}: ${error.message}`);
    }
  }

  async getElementText(args) {
    const { selector } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      const text = await this.page.textContent(selector);

      return {
        content: [
          {
            type: 'text',
            text: `Element text for ${selector}: ${text}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get text from ${selector}: ${error.message}`);
    }
  }

  async waitForElement(args) {
    const { selector, state = 'visible', timeout = 30000 } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      await this.page.waitForSelector(selector, { state, timeout });

      return {
        content: [
          {
            type: 'text',
            text: `Element ${selector} is now ${state}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Timeout waiting for ${selector} to be ${state}: ${error.message}`);
    }
  }

  async evaluateScript(args) {
    const { script } = args;

    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      const result = await this.page.evaluate(script);

      return {
        content: [
          {
            type: 'text',
            text: `Script result: ${JSON.stringify(result, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to execute script: ${error.message}`);
    }
  }

  async getPageInfo(_args) {
    if (!this.page) {
      throw new Error('No browser page available. Launch browser first.');
    }

    try {
      const title = await this.page.title();
      const url = this.page.url();
      const viewport = this.page.viewportSize();

      return {
        content: [
          {
            type: 'text',
            text: `Page Info:\n  Title: ${title}\n  URL: ${url}\n  Viewport: ${viewport?.width}x${viewport?.height}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get page info: ${error.message}`);
    }
  }

  async closeBrowser(_args) {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        return {
          content: [
            {
              type: 'text',
              text: 'Browser closed successfully',
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: 'No browser instance to close',
            },
          ],
        };
      }
    } catch (error) {
      throw new Error(`Failed to close browser: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP Server running on stdio');
    console.error(
      'Available tools: launch_browser, navigate_to, take_screenshot, click_element, fill_input, get_element_text, wait_for_element, evaluate_script, get_page_info, close_browser'
    );
    console.error('Browser automation and testing capabilities ready!');
  }
}

const server = new PlaywrightMCPServer();
server.run().catch(console.error);
