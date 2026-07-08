import fs from 'fs';
import sharp from 'sharp';

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g id="torii-gate">
    <!-- Kasagi (Top Black Lintel) curved upwards at the ends -->
    <path d="M 60,95 Q 256,115 452,95 L 452,110 Q 256,130 60,110 Z" fill="#1A1A1A" />
    
    <!-- Shimaki (Upper Red Lintel just under Kasagi) -->
    <path d="M 70,110 Q 256,130 442,110 L 436,140 Q 256,155 76,140 Z" fill="#E60012" />
    
    <!-- Nuki (Middle horizontal beam) -->
    <rect x="90" y="195" width="332" height="24" fill="#E60012" />
    
    <!-- Gakuzuka (Center vertical strut between Shimaki and Nuki) -->
    <rect x="246" y="138" width="20" height="60" fill="#E60012" />
    
    <!-- Gaku (The central tablet, black with gold border) -->
    <rect x="226" y="150" width="60" height="36" rx="3" fill="#1A1A1A" stroke="#D4AF37" stroke-width="2.5" />
    <circle cx="256" cy="168" r="4" fill="#D4AF37" />
    
    <!-- Left Pillar (Hashira) - slightly inclined inwards -->
    <polygon points="175,445 188,140 212,140 199,445" fill="#E60012" />
    
    <!-- Right Pillar (Hashira) - slightly inclined inwards -->
    <polygon points="337,445 324,140 300,140 313,445" fill="#E60012" />

    <!-- Daiishi (Pillar Black Bases) -->
    <rect x="165" y="440" width="44" height="22" rx="4" fill="#1A1A1A" />
    <rect x="303" y="440" width="44" height="22" rx="4" fill="#1A1A1A" />
    
    <!-- Kusabi (Wedges around Nuki) -->
    <rect x="174" y="190" width="8" height="34" fill="#1A1A1A" />
    <rect x="208" y="190" width="8" height="34" fill="#1A1A1A" />
    <rect x="296" y="190" width="8" height="34" fill="#1A1A1A" />
    <rect x="330" y="190" width="8" height="34" fill="#1A1A1A" />
  </g>
</svg>
`;

async function generatePng() {
  try {
    console.log('Generating high-resolution transparent Torii PNG...');
    const buffer = Buffer.from(svgContent.trim());
    
    // Output transparent PNG to public directory
    await sharp(buffer)
      .png()
      .toFile('public/torii_icon.png');
      
    console.log('Successfully generated public/torii_icon.png!');
  } catch (err) {
    console.error('Error generating PNG:', err);
    process.exit(1);
  }
}

generatePng();
