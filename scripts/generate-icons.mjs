import sharp from 'sharp';

const input = '/tmp/awesome-grok-bot-logo.png';
const publicDir = '/Users/leo/Projects/grokbots/public';

// Favicon 32x32
await sharp(input)
  .resize(32, 32)
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(`${publicDir}/favicon-32x32.png`);

// Favicon 16x16
await sharp(input)
  .resize(16, 16)
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(`${publicDir}/favicon-16x16.png`);

// Apple Touch Icon 180x180
await sharp(input)
  .resize(180, 180)
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(`${publicDir}/apple-touch-icon.png`);

// Android Chrome 192x192
await sharp(input)
  .resize(192, 192)
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(`${publicDir}/android-chrome-192x192.png`);

// Android Chrome 512x512
await sharp(input)
  .resize(512, 512)
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(`${publicDir}/android-chrome-512x512.png`);

// Logo for navbar usage (optimized 64x64)
await sharp(input)
  .resize(64, 64)
  .png({ quality: 90, compressionLevel: 9 })
  .toFile(`${publicDir}/logo-64.png`);

// Full size logo (compressed)
await sharp(input)
  .resize(512, 512)
  .png({ quality: 85, compressionLevel: 9 })
  .toFile(`${publicDir}/logo.png`);

// OG Image (1200x630 with logo centered on white background)
const logoForOg = await sharp(input)
  .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
  .composite([{ input: logoForOg, gravity: 'centre' }])
  .png({ quality: 85, compressionLevel: 9 })
  .toFile(`${publicDir}/og-image.png`);

console.log('All icons generated successfully!');
