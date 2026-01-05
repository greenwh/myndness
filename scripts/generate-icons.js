// Generate PWA icons for Myndness
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'static', 'icons');

// Myndness brand color - calming blue
const PRIMARY_COLOR = '#2563eb';
const BACKGROUND_COLOR = '#ffffff';

// Create a simple icon with "M" letter
async function createIcon(size, filename, maskable = false) {
	// Create SVG with the letter M
	const padding = maskable ? Math.floor(size * 0.1) : Math.floor(size * 0.15);
	const innerSize = size - padding * 2;
	const fontSize = Math.floor(innerSize * 0.6);

	const svg = `
		<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
			<rect width="${size}" height="${size}" fill="${BACKGROUND_COLOR}" rx="${maskable ? 0 : size * 0.2}"/>
			<circle cx="${size/2}" cy="${size/2}" r="${innerSize/2}" fill="${PRIMARY_COLOR}"/>
			<text
				x="${size/2}"
				y="${size/2}"
				font-family="Arial, sans-serif"
				font-size="${fontSize}"
				font-weight="bold"
				fill="white"
				text-anchor="middle"
				dominant-baseline="central"
			>M</text>
		</svg>
	`;

	await sharp(Buffer.from(svg))
		.png()
		.toFile(join(iconsDir, filename));

	console.log(`Created ${filename}`);
}

// Ensure icons directory exists
await mkdir(iconsDir, { recursive: true });

// Generate required PWA icons
await createIcon(192, 'icon-192.png');
await createIcon(512, 'icon-512.png');
await createIcon(512, 'icon-512-maskable.png', true);

// Also create a favicon
await createIcon(32, 'favicon-32.png');
await createIcon(180, 'apple-touch-icon.png');

console.log('All icons generated successfully!');
