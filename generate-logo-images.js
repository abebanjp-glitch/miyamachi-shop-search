import fs from 'fs';
import sharp from 'sharp';

// 1. Official Full Logo Mark (SVG)
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024" fill="none">
  <defs>
    <!-- 絞り染めの滲み・繊維の揺らぎを表現する高品質SVGフィルター -->
    <filter id="shibori-bleed" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feGaussianBlur in="displaced" stdDeviation="3.5" result="blurred" />
      <feMerge>
        <feMergeNode in="blurred" />
        <feMergeNode in="SourceGraphic" opacity="0.1" />
      </feMerge>
    </filter>

    <!-- 絞り染め（雪花絞り風）のグラデーション：淡い桜色（#F9D9E0）をベースにした上品な色調 -->
    <radialGradient id="shibori-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FCEDF0" stopOpacity="0.95" />
      <stop offset="35%" stopColor="#F9D9E0" stopOpacity="0.8" />
      <stop offset="70%" stopColor="#F4BCC7" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#F9D9E0" stopOpacity="0" />
    </radialGradient>
  </defs>

  {/* 絞り染め（雪花絞り風）の背景装飾 */}
  <g filter="url(#shibori-bleed)" opacity="0.8" transform="translate(34, 44) scale(0.8) translate(-42, -54)">
    {/* 1. 外側の雪花絞り（抽象的な六角星型の染め模様） */}
    <path
      d="M 76 54 Q 65 60 59 83.4 Q 50 75 25 83.4 Q 26 68 8 54 Q 20 48 25 24.6 Q 37 34 59 24.6 Q 62 42 76 54 Z"
      fill="url(#shibori-grad)"
    />

    {/* 2. 内側のやや濃い2層目の染め（濃淡の揺らぎ・グラデーション感の演出） */}
    <path
      d="M 66 54 Q 58 58 54 74 Q 48 68 30 74 Q 31 63 18 54 Q 27 50 30 34 Q 39 41 54 34 Q 56 46 66 54 Z"
      fill="#F5BCC8"
      opacity="0.35"
    />

    {/* 3. 雪花絞り特有の折り目・筋（伝統的な技法の質感を模した微細なストローク） */}
    <line x1="42" y1="54" x2="76" y2="54" stroke="#F5BCC8" strokeWidth="1.2" opacity="0.3" strokeDasharray="1.5 1" />
    <line x1="42" y1="54" x2="59" y2="83.4" stroke="#F5BCC8" strokeWidth="1.2" opacity="0.3" strokeDasharray="1.5 1" />
    <line x1="42" y1="54" x2="25" y2="83.4" stroke="#F5BCC8" strokeWidth="1.2" opacity="0.3" strokeDasharray="1.5 1" />
    <line x1="42" y1="54" x2="8" y2="54" stroke="#F5BCC8" strokeWidth="1.2" opacity="0.3" strokeDasharray="1.5 1" />
    <line x1="42" y1="54" x2="25" y2="24.6" stroke="#F5BCC8" strokeWidth="1.2" opacity="0.3" strokeDasharray="1.5 1" />
    <line x1="42" y1="54" x2="59" y2="24.6" stroke="#F5BCC8" strokeWidth="1.2" opacity="0.3" strokeDasharray="1.5 1" />

    {/* 4. 中心部の染め残り風の表現（淡いコントラスト） */}
    <circle cx="42" cy="54" r="8" fill="#FCEDF0" opacity="0.55" />
  </g>

  {/* 1. 石鳥居 (淡いシックなグレー #A1A1AA) */}
  {/* 笠木・島木 */}
  <path 
    d="M 16 38 C 28 34, 46 34, 58 38 L 57 43 C 45 39, 29 39, 17 43 Z" 
    fill="#A1A1AA"
  />
  {/* 貫 */}
  <path 
    d="M 21 49 L 53 49 L 53 52 L 21 52 Z" 
    fill="#A1A1AA"
  />
  {/* 左柱・右柱 */}
  <path 
    d="M 27 42 L 25 76 C 25 77.5, 27 78.5, 29 78.5 C 31 78.5, 32 77.5, 32 42 Z" 
    fill="#A1A1AA"
  />
  <path 
    d="M 47 42 L 47 76 C 47 77.5, 49 78.5, 51 78.5 C 53 78.5, 52 77.5, 52 42 Z" 
    fill="#A1A1AA"
  />
  {/* 額束 */}
  <rect 
    x="36.5" 
    y="42" 
    width="3" 
    height="7" 
    fill="#A1A1AA"
  />

  {/* 2. 「お」の3画目（深みのある緑 #006036） */}
  <g transform="translate(51, 68) scale(0.85) translate(-51, -68)">
    <path 
      d="M 49 53 C 60 53, 75 56, 73 69 C 71 80, 50 83, 37 77 C 29 73, 27 65, 34 59 C 41 53, 51 55, 55 62 C 57 66, 55 70, 50 70 C 46 70, 44 66, 47 63 C 49 61, 52 62, 52 64" 
      stroke="#006036"
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </g>
  
  {/* 3. 右上の丸 (鮮やかな朱赤 #E60012) */}
  <circle 
    cx="68" 
    cy="38" 
    r="6.5" 
    fill="#E60012"
  />
</svg>
`;

// 2. Simple Red Torii Gate (SVG)
const toriiSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
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

async function generateAllImages() {
  try {
    console.log('Generating high-resolution images...');

    // A. Official Logo Mark - PNG (Transparent Background)
    const logoBuffer = Buffer.from(logoSvg.trim());
    await sharp(logoBuffer)
      .png()
      .toFile('public/miyamachi_logo_mark.png');
    console.log('✓ Generated public/miyamachi_logo_mark.png (Transparent)');

    // A-2. Duplicate Official Logo Mark to toriimark.png
    await sharp(logoBuffer)
      .png()
      .toFile('public/toriimark.png');
    console.log('✓ Generated public/toriimark.png (Transparent)');

    // B. Official Logo Mark - JPG (White Background)
    await sharp(logoBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 95 })
      .toFile('public/miyamachi_logo_mark.jpg');
    console.log('✓ Generated public/miyamachi_logo_mark.jpg (White background)');

    // C. Simple Torii - PNG (Transparent Background)
    const toriiBuffer = Buffer.from(toriiSvg.trim());
    await sharp(toriiBuffer)
      .png()
      .toFile('public/torii_icon.png');
    console.log('✓ Generated public/torii_icon.png (Transparent)');

    // D. Simple Torii - JPG (White Background)
    await sharp(toriiBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 95 })
      .toFile('public/torii_icon.jpg');
    console.log('✓ Generated public/torii_icon.jpg (White background)');

    console.log('All image assets successfully compiled!');
  } catch (err) {
    console.error('Error generating images:', err);
    process.exit(1);
  }
}

generateAllImages();
