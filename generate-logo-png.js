import fs from 'fs';
import sharp from 'sharp';

// Exact SVG code of the official logo symbol (LogoSVG) as defined in src/App.tsx
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024" fill="none">
  <defs>
    {/* 絞り染めの滲み・繊維の揺らぎを表現する高品質SVGフィルター */}
    <filter id="shibori-bleed" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feGaussianBlur in="displaced" stdDeviation="3.5" result="blurred" />
      <feMerge>
        <feMergeNode in="blurred" />
        <feMergeNode in="SourceGraphic" opacity="0.1" />
      </feMerge>
    </filter>

    {/* 絞り染め（雪花絞り風）のグラデーション：淡い桜色（#F9D9E0）をベースにした上品な色調 */}
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

async function generatePng() {
  try {
    console.log('Generating high-resolution official logo mark PNG...');
    const buffer = Buffer.from(svgContent.trim());
    
    // Output transparent 1024x1024 PNG
    await sharp(buffer)
      .png()
      .toFile('public/miyamachi_logo_mark.png');
      
    console.log('Successfully generated public/miyamachi_logo_mark.png!');
  } catch (err) {
    console.error('Error generating PNG:', err);
    process.exit(1);
  }
}

generatePng();
