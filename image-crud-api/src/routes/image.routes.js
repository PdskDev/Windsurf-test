import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { Image } from '../models/image.model.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all images for authenticated user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(images.map(image => ({
      ...image.toJSON(),
      url: `${req.protocol}://${req.get('host')}/${image.path}`
    })));
  } catch (error) {
    next(error);
  }
});

// Get single image
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      ...image.toJSON(),
      url: `${req.protocol}://${req.get('host')}/${image.path}`
    });
  } catch (error) {
    next(error);
  }
});

// Upload image
router.post('/', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Process image with sharp
    const processedFilename = `processed-${req.file.filename}`;
    const processedPath = path.join(__dirname, '../../uploads', processedFilename);

    await sharp(req.file.path)
      .resize(800) // Resize to max width of 800px
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toFile(processedPath);

    // Delete original file
    await fs.unlink(req.file.path);

    const image = new Image({
      title: req.body.title,
      description: req.body.description,
      filename: processedFilename,
      path: `uploads/${processedFilename}`,
      mimetype: 'image/jpeg',
      size: (await fs.stat(processedPath)).size,
      userId: req.user._id
    });

    await image.save();

    res.status(201).json({
      ...image.toJSON(),
      url: `${req.protocol}://${req.get('host')}/${image.path}`
    });
  } catch (error) {
    next(error);
  }
});

// Update image details
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    const image = await Image.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      ...image.toJSON(),
      url: `${req.protocol}://${req.get('host')}/${image.path}`
    });
  } catch (error) {
    next(error);
  }
});

// Delete image
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', image.path);
    await fs.unlink(filePath);

    // Delete from database
    await image.deleteOne();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
