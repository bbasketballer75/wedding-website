import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, '..', 'public', 'images');

function findNonWebPImages(dir, images = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findNonWebPImages(fullPath, images);
    } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
      const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (!fs.existsSync(webpPath)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

async function convertToWebP(imagePath) {
  try {
    const ext = path.extname(imagePath);
    const webpPath = imagePath.replace(new RegExp(ext + '$', 'i'), '.webp');

    console.log(`Converting ${imagePath} to WebP...`);

    await sharp(imagePath).webp({ quality: 85, effort: 6 }).toFile(webpPath);

    console.log(`✅ Converted: ${path.basename(webpPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${imagePath}:`, error.message);
    return false;
  }
}

async function convertAll() {
  console.log('🔍 Finding non-WebP images...');
  const images = findNonWebPImages(imageDir);

  if (images.length === 0) {
    console.log('✅ All images are already optimized!');
    return;
  }

  console.log(`📸 Found ${images.length} images to convert:`);
  images.forEach((img) => console.log(`  - ${path.relative(imageDir, img)}`));

  console.log('\n🚀 Starting conversion...');
  let successCount = 0;

  for (const imagePath of images) {
    const success = await convertToWebP(imagePath);
    if (success) successCount++;
  }

  console.log(
    `\n🎉 Conversion complete! ${successCount}/${images.length} images converted successfully.`
  );
}

convertAll().catch(console.error);
