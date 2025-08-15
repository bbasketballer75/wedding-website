import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import winston from 'winston';
import MemoryEmailService from '../services/MemoryEmailService.js';

class GuestPhotoUploadService {
  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    this.bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME);
    this.emailService = new MemoryEmailService();

    // Configure multer for memory storage
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: parseInt(process.env.GUEST_UPLOAD_MAX_SIZE) || 10485760, // 10MB
      },
      fileFilter: this.fileFilter.bind(this),
    });
  }

  fileFilter(req, file, cb) {
    const allowedFormats = (process.env.GUEST_UPLOAD_FORMATS || 'jpg,jpeg,png,webp,heic').split(
      ','
    );
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);

    if (allowedFormats.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File format ${fileExtension} not allowed. Allowed formats: ${allowedFormats.join(', ')}`
        )
      );
    }
  }

  async processGuestUpload(files, uploaderInfo) {
    const uploadResults = [];

    for (const file of files) {
      try {
        const processedImage = await this.optimizeImage(file.buffer);
        const fileName = this.generateFileName(file, uploaderInfo);
        const uploadResult = await this.uploadToGCS(processedImage, fileName, file.mimetype);

        const photoRecord = await this.createPhotoRecord({
          fileName,
          originalName: file.originalname,
          uploader: uploaderInfo,
          gcsUrl: uploadResult.url,
          status: process.env.GUEST_UPLOAD_REQUIRE_APPROVAL === 'true' ? 'pending' : 'approved',
          uploadedAt: new Date(),
          category: 'guest-uploaded',
        });

        uploadResults.push(photoRecord);

        // Send thank you email
        if (uploaderInfo.email) {
          await this.emailService.sendPhotoUploadThankYou({
            uploaderName: uploaderInfo.name,
            uploaderEmail: uploaderInfo.email,
            photoCount: files.length,
          });
        }

        winston.info(`Guest photo uploaded successfully: ${fileName} by ${uploaderInfo.name}`);
      } catch (error) {
        winston.error(`Failed to process guest upload:`, error);
        uploadResults.push({ error: error.message, file: file.originalname });
      }
    }

    return uploadResults;
  }

  async optimizeImage(buffer) {
    try {
      // Optimize image for web viewing while maintaining quality
      return await sharp(buffer)
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();
    } catch (error) {
      winston.error('Image optimization failed:', error);
      return buffer; // Return original if optimization fails
    }
  }

  generateFileName(file, uploaderInfo) {
    const timestamp = Date.now();
    const cleanUploaderName = uploaderInfo.name.replace(/[^a-zA-Z0-9]/g, '');
    const fileExtension = path.extname(file.originalname);
    return `guest-uploads/${cleanUploaderName}-${timestamp}${fileExtension}`;
  }

  async uploadToGCS(buffer, fileName, mimeType) {
    const file = this.bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType,
        metadata: {
          uploadType: 'guest-photo',
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
        resolve({
          url: `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${fileName}`,
          fileName,
        });
      });
      stream.end(buffer);
    });
  }

  async createPhotoRecord(photoData) {
    // This would integrate with your database (Firestore/MongoDB)
    // For now, returning the structure that would be saved
    return {
      id: this.generateId(),
      fileName: photoData.fileName,
      originalName: photoData.originalName,
      uploaderName: photoData.uploader.name,
      uploaderEmail: photoData.uploader.email,
      uploaderMessage: photoData.uploader.message || '',
      gcsUrl: photoData.gcsUrl,
      status: photoData.status,
      uploadedAt: photoData.uploadedAt,
      category: photoData.category,
      approvedAt: photoData.status === 'approved' ? new Date() : null,
      metadata: {
        source: 'guest-upload',
        requiresModeration: photoData.status === 'pending',
      },
    };
  }

  generateId() {
    return `guest_photo_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  async getGuestUploads(status = 'all') {
    // This would query your database for guest uploads
    // Implementation depends on your database choice (Firestore/MongoDB)
    try {
      // Example structure - replace with actual database query
      const uploads = await this.queryDatabase({
        category: 'guest-uploaded',
        ...(status !== 'all' && { status }),
      });

      return uploads;
    } catch (error) {
      winston.error('Failed to retrieve guest uploads:', error);
      throw error;
    }
  }

  async approveGuestPhoto(photoId, adminInfo) {
    try {
      // Update photo status to approved
      const updateResult = await this.updatePhotoStatus(photoId, 'approved', adminInfo);

      winston.info(`Guest photo approved: ${photoId} by ${adminInfo.adminName}`);
      return updateResult;
    } catch (error) {
      winston.error(`Failed to approve guest photo ${photoId}:`, error);
      throw error;
    }
  }

  async updatePhotoStatus(photoId, status, adminInfo) {
    // Database update implementation
    return {
      id: photoId,
      status,
      approvedAt: status === 'approved' ? new Date() : null,
      approvedBy: adminInfo.adminName,
      updatedAt: new Date(),
    };
  }

  async queryDatabase(_query) {
    // Placeholder for database query implementation
    // Replace with actual Firestore or MongoDB query
    return [];
  }
}

export default GuestPhotoUploadService;
