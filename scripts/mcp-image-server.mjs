#!/usr/bin/env node

/**
 * Image Processing MCP Server
 * Provides powerful image manipulation capabilities for wedding website
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageProcessingMCPServer {
  constructor() {
    // Configure Sharp for optimal performance
    sharp.cache({ items: 50, memory: 100 * 1024 * 1024 }); // 100MB cache
    sharp.concurrency(4); // Use 4 threads for parallel processing

    this.tools = [
      {
        name: 'resize_image',
        description: 'Resize an image to specified dimensions with quality optimization',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: { type: 'string', description: 'Path to input image' },
            outputPath: { type: 'string', description: 'Path for output image' },
            width: { type: 'number', description: 'Target width in pixels' },
            height: {
              type: 'number',
              description: 'Target height in pixels (optional, maintains aspect ratio if omitted)',
            },
            quality: {
              type: 'number',
              description: 'Quality 1-100 (default: 85)',
              minimum: 1,
              maximum: 100,
            },
          },
          required: ['inputPath', 'outputPath', 'width'],
        },
      },
      {
        name: 'convert_format',
        description: 'Convert image to different format (JPEG, PNG, WebP, AVIF)',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: { type: 'string', description: 'Path to input image' },
            outputPath: { type: 'string', description: 'Path for output image' },
            format: {
              type: 'string',
              enum: ['jpeg', 'png', 'webp', 'avif'],
              description: 'Target format',
            },
            quality: {
              type: 'number',
              description: 'Quality 1-100 (default: 85)',
              minimum: 1,
              maximum: 100,
            },
          },
          required: ['inputPath', 'outputPath', 'format'],
        },
      },
      {
        name: 'create_thumbnail',
        description: 'Create optimized thumbnails for wedding photo galleries',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: { type: 'string', description: 'Path to input image' },
            outputDir: { type: 'string', description: 'Directory for thumbnail outputs' },
            sizes: {
              type: 'array',
              items: { type: 'number' },
              description: 'Array of thumbnail sizes (default: [150, 300, 600])',
            },
            format: {
              type: 'string',
              enum: ['jpeg', 'png', 'webp'],
              description: 'Output format (default: webp)',
            },
          },
          required: ['inputPath', 'outputDir'],
        },
      },
      {
        name: 'optimize_for_web',
        description: 'Optimize images for web with multiple format outputs and responsive sizes',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: { type: 'string', description: 'Path to input image' },
            outputDir: { type: 'string', description: 'Directory for optimized outputs' },
            generateSrcSet: {
              type: 'boolean',
              description: 'Generate responsive srcset images (default: true)',
            },
            formats: {
              type: 'array',
              items: { type: 'string', enum: ['jpeg', 'webp', 'avif'] },
              description: "Output formats (default: ['webp', 'jpeg'])",
            },
          },
          required: ['inputPath', 'outputDir'],
        },
      },
      {
        name: 'get_image_info',
        description: 'Get detailed information about an image file',
        inputSchema: {
          type: 'object',
          properties: {
            imagePath: { type: 'string', description: 'Path to image file' },
          },
          required: ['imagePath'],
        },
      },
      {
        name: 'batch_process',
        description: 'Process multiple images in a directory with the same operations',
        inputSchema: {
          type: 'object',
          properties: {
            inputDir: { type: 'string', description: 'Directory containing input images' },
            outputDir: { type: 'string', description: 'Directory for processed images' },
            operation: {
              type: 'string',
              enum: ['resize', 'convert', 'optimize', 'thumbnail'],
              description: 'Operation to perform on all images',
            },
            options: {
              type: 'object',
              description: 'Options for the operation (width, height, format, quality, etc.)',
            },
          },
          required: ['inputDir', 'outputDir', 'operation'],
        },
      },
    ];
  }

  async resizeImage(args) {
    try {
      const { inputPath, outputPath, width, height, quality = 85 } = args;

      // Ensure output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      let pipeline = sharp(inputPath).resize(width, height, {
        withoutEnlargement: true,
        fit: 'inside',
      });

      // Apply format-specific optimization
      const ext = path.extname(outputPath).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality, progressive: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality, progressive: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality });
      }

      await pipeline.toFile(outputPath);

      const stats = await fs.stat(outputPath);
      return {
        success: true,
        outputPath,
        size: stats.size,
        message: `Image resized to ${width}${height ? `x${height}` : ''} and saved to ${outputPath}`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async convertFormat(args) {
    try {
      const { inputPath, outputPath, format, quality = 85 } = args;

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      let pipeline = sharp(inputPath);

      switch (format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality, progressive: true });
          break;
        case 'png':
          pipeline = pipeline.png({ quality });
          break;
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality });
          break;
      }

      await pipeline.toFile(outputPath);

      const stats = await fs.stat(outputPath);
      return {
        success: true,
        outputPath,
        format,
        size: stats.size,
        message: `Image converted to ${format} and saved to ${outputPath}`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createThumbnail(args) {
    try {
      const { inputPath, outputDir, sizes = [150, 300, 600], format = 'webp' } = args;

      await fs.mkdir(outputDir, { recursive: true });

      const inputName = path.parse(inputPath).name;
      const results = [];

      for (const size of sizes) {
        const outputPath = path.join(outputDir, `${inputName}_${size}.${format}`);

        let pipeline = sharp(inputPath).resize(size, size, {
          fit: 'cover',
          position: 'center',
        });

        if (format === 'webp') {
          pipeline = pipeline.webp({ quality: 85 });
        } else if (format === 'jpeg') {
          pipeline = pipeline.jpeg({ quality: 85, progressive: true });
        } else if (format === 'png') {
          pipeline = pipeline.png({ quality: 85 });
        }

        await pipeline.toFile(outputPath);

        const stats = await fs.stat(outputPath);
        results.push({
          size: `${size}x${size}`,
          path: outputPath,
          fileSize: stats.size,
        });
      }

      return {
        success: true,
        thumbnails: results,
        message: `Created ${results.length} thumbnails in ${format} format`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async optimizeForWeb(args) {
    try {
      const { inputPath, outputDir, generateSrcSet = true, formats = ['webp', 'jpeg'] } = args;

      await fs.mkdir(outputDir, { recursive: true });

      const inputName = path.parse(inputPath).name;
      const results = [];

      // Responsive sizes for srcset
      const responsiveSizes = generateSrcSet ? [640, 750, 828, 1080, 1200, 1920] : [1200];

      for (const format of formats) {
        for (const width of responsiveSizes) {
          const outputPath = path.join(outputDir, `${inputName}_${width}.${format}`);

          let pipeline = sharp(inputPath).resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside',
          });

          if (format === 'webp') {
            pipeline = pipeline.webp({ quality: 85 });
          } else if (format === 'jpeg') {
            pipeline = pipeline.jpeg({ quality: 85, progressive: true });
          } else if (format === 'avif') {
            pipeline = pipeline.avif({ quality: 75 });
          }

          await pipeline.toFile(outputPath);

          const stats = await fs.stat(outputPath);
          results.push({
            format,
            width,
            path: outputPath,
            fileSize: stats.size,
          });
        }
      }

      return {
        success: true,
        optimizedImages: results,
        srcSetReady: generateSrcSet,
        message: `Optimized image in ${formats.length} format(s) with ${responsiveSizes.length} responsive sizes`,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getImageInfo(args) {
    try {
      const { imagePath } = args;

      const metadata = await sharp(imagePath).metadata();
      const stats = await fs.stat(imagePath);

      return {
        success: true,
        info: {
          format: metadata.format,
          width: metadata.width,
          height: metadata.height,
          channels: metadata.channels,
          depth: metadata.depth,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha,
          fileSize: stats.size,
          fileSizeReadable: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
          aspectRatio:
            metadata.width && metadata.height
              ? (metadata.width / metadata.height).toFixed(2)
              : null,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async batchProcess(args) {
    try {
      const { inputDir, outputDir, operation, options = {} } = args;

      await fs.mkdir(outputDir, { recursive: true });

      const files = await fs.readdir(inputDir);
      const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file));

      const results = [];

      for (const file of imageFiles) {
        const inputPath = path.join(inputDir, file);
        const outputName = path.parse(file).name;

        try {
          let result;

          switch (operation) {
            case 'resize':
              const resizeOutput = path.join(outputDir, file);
              result = await this.resizeImage({
                inputPath,
                outputPath: resizeOutput,
                ...options,
              });
              break;

            case 'convert':
              const convertOutput = path.join(
                outputDir,
                `${outputName}.${options.format || 'webp'}`
              );
              result = await this.convertFormat({
                inputPath,
                outputPath: convertOutput,
                ...options,
              });
              break;

            case 'optimize':
              result = await this.optimizeForWeb({
                inputPath,
                outputDir: path.join(outputDir, outputName),
                ...options,
              });
              break;

            case 'thumbnail':
              result = await this.createThumbnail({
                inputPath,
                outputDir: path.join(outputDir, 'thumbnails'),
                ...options,
              });
              break;

            default:
              result = { success: false, error: `Unknown operation: ${operation}` };
          }

          results.push({
            file,
            success: result.success,
            result: result.success ? result : result.error,
          });
        } catch (error) {
          results.push({
            file,
            success: false,
            error: error.message,
          });
        }
      }

      const successful = results.filter((r) => r.success).length;

      return {
        success: true,
        processed: results.length,
        successful,
        failed: results.length - successful,
        results,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async handleToolCall(name, args) {
    switch (name) {
      case 'resize_image':
        return await this.resizeImage(args);
      case 'convert_format':
        return await this.convertFormat(args);
      case 'create_thumbnail':
        return await this.createThumbnail(args);
      case 'optimize_for_web':
        return await this.optimizeForWeb(args);
      case 'get_image_info':
        return await this.getImageInfo(args);
      case 'batch_process':
        return await this.batchProcess(args);
      default:
        return { success: false, error: `Unknown tool: ${name}` };
    }
  }

  async start() {
    console.log('Image Processing MCP Server starting...');
    console.log('Available tools:', this.tools.map((t) => t.name).join(', '));
    console.log('Server ready for image processing operations!');

    // Keep the server running
    process.stdin.resume();
  }
}

// Start the server
const server = new ImageProcessingMCPServer();
server.start().catch(console.error);

export default ImageProcessingMCPServer;
