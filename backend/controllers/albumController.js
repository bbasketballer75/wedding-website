import path from 'path';
import os from 'os';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import Photo from '../models/Photo.firestore.js';
import getCloudStorage from '../services/cloudStorage.js';
import fs from 'fs/promises'; // Only for temp files

// Configure fluent-ffmpeg to use the binary from the npm package.
// This avoids the need for a manual ffmpeg installation on the server.
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// All media will be stored in GCS bucket via getCloudStorage().js

// Helper function to process a single file and upload to GCS
const processFile = async (file) => {
  const { buffer, mimetype, originalname } = file;
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = path.extname(originalname).toLowerCase();
  const tempInputPath = path.join(os.tmpdir(), `media-input-${uniqueSuffix}${extension}`);
  let tempWebpPath, tempJpegPath, tempOutputPath, gcsWebpFilename, gcsJpegFilename, finalMimetype;

  try {
    if (mimetype.startsWith('image/')) {
      // Process WebP
      gcsWebpFilename = `album/img-${uniqueSuffix}.webp`;
      tempWebpPath = path.join(os.tmpdir(), `img-${uniqueSuffix}.webp`);
      await sharp(buffer)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(tempWebpPath);
      await getCloudStorage().uploadFile(tempWebpPath, gcsWebpFilename, 'image/webp');

      // Process JPEG
      gcsJpegFilename = `album/img-${uniqueSuffix}.jpg`;
      tempJpegPath = path.join(os.tmpdir(), `img-${uniqueSuffix}.jpg`);
      await sharp(buffer)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(tempJpegPath);
      await getCloudStorage().uploadFile(tempJpegPath, gcsJpegFilename, 'image/jpeg');

      // Save both paths in DB (for backward compatibility, keep filename/filepath/mimetype as webp)
      const newMedia = new Photo({
        filename: gcsWebpFilename,
        filepath: gcsWebpFilename,
        mimetype: 'image/webp',
        webpPath: gcsWebpFilename,
        webpMimetype: 'image/webp',
        jpegPath: gcsJpegFilename,
        jpegMimetype: 'image/jpeg',
      });
      await newMedia.save();
      return { status: 'success', data: newMedia };
    } else if (mimetype.startsWith('video/')) {
      gcsWebpFilename = `album/vid-${uniqueSuffix}.mp4`;
      tempOutputPath = path.join(os.tmpdir(), `vid-${uniqueSuffix}.mp4`);
      finalMimetype = 'video/mp4';
      await fs.writeFile(tempInputPath, buffer);
      await new Promise((resolve, reject) => {
        ffmpeg(tempInputPath)
          .outputOptions([
            '-c:v libx264',
            '-preset fast',
            '-crf 28',
            '-c:a aac',
            '-b:a 128k',
            '-movflags +faststart',
            '-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease',
          ])
          .toFormat('mp4')
          .on('end', resolve)
          .on('error', (err) => reject(new Error(`FFmpeg failed: ${err.message}`)))
          .save(tempOutputPath);
      });
      await getCloudStorage().uploadFile(tempOutputPath, gcsWebpFilename, finalMimetype);
      const newMedia = new Photo({
        filename: gcsWebpFilename,
        filepath: gcsWebpFilename,
        mimetype: finalMimetype,
      });
      await newMedia.save();
      return { status: 'success', data: newMedia };
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    return { status: 'error', originalname, message: error.message };
  } finally {
    // Clean up temp files
    await fs.unlink(tempInputPath).catch(() => {});
    if (tempWebpPath) await fs.unlink(tempWebpPath).catch(() => {});
    if (tempJpegPath) await fs.unlink(tempJpegPath).catch(() => {});
    if (tempOutputPath) await fs.unlink(tempOutputPath).catch(() => {});
  }
};

export const uploadMedia = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Please upload one or more files.' });
  }

  try {
    // No need to create uploads dir; all files go to GCS

    const processingPromises = req.files.map(processFile);
    const results = await Promise.all(processingPromises);

    const uploadedFiles = results.filter((r) => r.status === 'success').map((r) => r.data);
    const errors = results.filter((r) => r.status === 'error');

    if (errors.length > 0) {
      const status = uploadedFiles.length > 0 ? 207 : 400; // 207 Multi-Status
      return res.status(status).json({
        message: 'Some files were processed with errors.',
        uploadedFiles,
        errors,
      });
    }

    res.status(201).json({
      message: 'All files uploaded successfully and are pending review.',
      files: uploadedFiles,
    });
  } catch {
    res.status(500).json({ message: 'A server error occurred during file upload.' });
  }
};

/**
 * Retrieves all approved media for the public gallery.
 */
export const getAlbumMedia = async (req, res) => {
  try {
    const media = await Photo.findApproved();
    res.json(media);
  } catch {
    res.status(500).json({ message: 'Server error fetching media.' });
  }
};

/**
 * Retrieves all media, including pending ones, for the admin dashboard.
 */
export const getAllAlbumMedia = async (req, res) => {
  try {
    const media = await Photo.findAll();
    res.json(media);
  } catch {
    res.status(500).json({ message: 'Server error fetching all media.' });
  }
};

/**
 * Approves or rejects a piece of media.
 */
export const moderateMedia = async (req, res) => {
  const { photoId, isApproved } = req.body;
  try {
    if (isApproved) {
      await Photo.updateApproval(photoId, true);
      const photo = await Photo.findById(photoId);
      if (!photo) return res.status(404).json({ message: 'Photo not found.' });
      res.json({ message: 'Media has been approved.', photo });
    } else {
      const photo = await Photo.findById(photoId);
      if (!photo) return res.status(404).json({ message: 'Photo not found.' });
      await Photo.deleteById(photoId);
      // Delete from GCS
      await getCloudStorage()
        .deleteFile(photo.filename)
        .catch(() => {});
      res.json({ message: 'Media has been rejected and deleted.' });
    }
  } catch (error) {
    console.error('Error during moderation:', error);
    res.status(500).json({ message: 'Server error during moderation.' });
  }
};
