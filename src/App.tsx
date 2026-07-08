import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, SortKey } from './types';
import storesData from './data/miyamachi_stores.json';
import { CATEGORIES, AREAS } from './data/constants';
import { StoreCard } from './components/StoreCard';
import { SearchFilters } from './components/SearchFilters';
import { AlertCircle, RefreshCw, ExternalLink, X, Music, VolumeX, Star, Lock, Unlock, Download, Image } from 'lucide-react';
import { HeroSlider } from './components/HeroSlider';
import { playBGM, pauseBGM } from './utils/audio';

const LogoSVG = () => {
  // 決定された公式ロゴカラー（③ 東照宮の伝統美）
  const colors = {
    torii: '#A1A1AA', // 淡色のグレー（シックで上品なグレー）へ変更
    curve: '#006036', // ご指定の深みのある緑（#006036）へ変更
    dot: '#E60012'    // 鮮やかな朱色へ変更
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-[74px] h-[74px] sm:w-[110px] sm:h-[110px] shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 輝くシルバー（プラチナ・銀色）の線形グラデーション */}
        <linearGradient id="silver-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="20%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#CBD5E1" />
          <stop offset="60%" stopColor="#F8FAFC" />
          <stop offset="80%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

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

      {/* 絞り染め（雪花絞り風）の背景装飾：全体を20%縮小し、緑の図形や赤丸とのバランスを整えるため左上に配置 */}
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

      {/* 1. 石鳥居 (「お」の1〜2画目を兼ねた、格調高いゴールド。実物の東照宮の石造りの佇まいに絢爛な光を添えて) */}
      {/* 笠木・島木（上のそり返った横棒） */}
      <path 
        d="M 16 38 C 28 34, 46 34, 58 38 L 57 43 C 45 39, 29 39, 17 43 Z" 
        fill={colors.torii}
      />
      {/* 貫（下の横棒） */}
      <path 
        d="M 21 49 L 53 49 L 53 52 L 21 52 Z" 
        fill={colors.torii}
      />
      {/* 左柱・右柱 */}
      <path 
        d="M 27 42 L 25 76 C 25 77.5, 27 78.5, 29 78.5 C 31 78.5, 32 77.5, 32 42 Z" 
        fill={colors.torii}
      />
      <path 
        d="M 47 42 L 47 76 C 47 77.5, 49 78.5, 51 78.5 C 53 78.5, 52 77.5, 52 42 Z" 
        fill={colors.torii}
      />
      {/* 額束（中央の束柱） */}
      <rect 
        x="36.5" 
        y="42" 
        width="3" 
        height="7" 
        fill={colors.torii}
      />
 
      {/* 2. 「お」の3画目（漆黒。流れるような美しい曲線ストローク） */}
      <g transform="translate(51, 68) scale(0.85) translate(-51, -68)">
        <path 
          d="M 49 53 C 60 53, 75 56, 73 69 C 71 80, 50 83, 37 77 C 29 73, 27 65, 34 59 C 41 53, 51 55, 55 62 C 57 66, 55 70, 50 70 C 46 70, 44 66, 47 63 C 49 61, 52 62, 52 64" 
          stroke={colors.curve}
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
      
      {/* 3. 右上の丸 (「お」の4画目の点。神威と人情を包む朱赤) */}
      <circle 
        cx="68" 
        cy="38" 
        r="6.5" 
        fill={colors.dot}
      />
    </svg>
  );
};
 
const AnimatedTitle = () => {
  const sentence = "この町に、まだ知らない一軒がある。";
  const characters = Array.from(sentence);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const childVariants = {
    hidden: { 
      opacity: 0,
      y: 8,
      filter: "blur(2px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.h1 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-[14px] min-[360px]:text-[16px] min-[390px]:text-[18px] sm:text-xl md:text-2.5xl font-serif font-normal tracking-[0.12em] text-brand-charcoal leading-tight mb-4 whitespace-nowrap flex justify-center flex-wrap"
    >
      <span className="sr-only">宮町商店街 店舗検索｜仙台市青葉区宮町の{storesData.length}店舗をさがす</span>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="inline-block"
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const HeroBackgroundPattern = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="seigaiha" width="60" height="30" patternUnits="userSpaceOnUse">
          <path d="M 0 0 A 30 30 0 0 1 60 0 M -30 15 A 30 30 0 0 1 30 15 M 30 15 A 30 30 0 0 1 90 15 M 0 30 A 30 30 0 0 1 60 30" fill="none" stroke="#1B4332" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha)" />
    </svg>
  </div>
);

const ITEMS_PER_PAGE = 12;

export default function App() {
  // Convert untyped JSON to typed Store[]
  const stores = storesData as Store[];

  // Shuffled stores for initial display (created once on page load using Fisher-Yates)
  const [shuffledStores] = useState<Store[]>(() => {
    const copy = [...(storesData as Store[])];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  });

  // BGM State (Default is muted/off)
  const [bgmOn, setBgmOn] = useState<boolean>(false);

  // Dynamically update document title & meta tags to avoid hardcoded numbers and match current storesData length
  useEffect(() => {
    const totalCount = stores.length;
    document.title = `宮町商店街 店舗検索｜仙台市青葉区宮町の${totalCount}店舗をさがす`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `仙台市青葉区・宮町商店街の店舗検索サイト。業種・エリア・キーワードから、宮町、東照宮、小田原、小松島など10エリア${totalCount}店舗を簡単に検索できます。営業時間や取扱商品、地図情報も掲載。`);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `宮町商店街 店舗検索｜仙台市青葉区宮町の${totalCount}店舗をさがす`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', `仙台市青葉区・宮町商店街の店舗を業種・エリア・キーワードから検索。宮町、東照宮、小田原など10エリア${totalCount}店舗の営業時間・取扱商品情報を掲載。`);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', `宮町商店街 店舗検索｜仙台市青葉区宮町の${totalCount}店舗をさがす`);
    }
  }, [stores.length]);

  // Synchronize BGM playback with volume fades
  useEffect(() => {
    if (bgmOn) {
      playBGM();
    } else {
      pauseBGM();
    }
    return () => {
      pauseBGM();
    };
  }, [bgmOn]);

  // Filter & Sort States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortKey>('id');

  // Favorites state with LocalStorage persistence
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('miyamachi_favorite_stores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const handleToggleFavorite = (storeId: number) => {
    setFavorites((prev) => {
      const next = prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId];
      try {
        localStorage.setItem('miyamachi_favorite_stores', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save favorites:', err);
      }
      return next;
    });
  };
  
  // Custom Images state with LocalStorage persistence
  const [customImages, setCustomImages] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('miyamachi_custom_store_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleUpdateImage = (storeId: number, url: string) => {
    setCustomImages((prev) => {
      const next = { ...prev };
      if (!url) {
        delete next[storeId];
      } else {
        next[storeId] = url;
      }
      try {
        localStorage.setItem('miyamachi_custom_store_images', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save custom images:', err);
      }
      return next;
    });
  };

  // Admin Mode states with LocalStorage persistence
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('miyamachi_admin_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'miyamachi') {
      setIsAdmin(true);
      try {
        localStorage.setItem('miyamachi_admin_mode', 'true');
      } catch (err) {
        console.error('Failed to save admin state:', err);
      }
      setIsAdminModalOpen(false);
      setAdminPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('パスワードが正しくありません。');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.setItem('miyamachi_admin_mode', 'false');
    } catch (err) {
      console.error('Failed to clear admin state:', err);
    }
  };

  // ZIP Download States
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [downloadProgressText, setDownloadProgressText] = useState<string>('');

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    setDownloadProgressText('準備中...');
    try {
      const pathname = window.location.pathname;
      const zipUrl = pathname.includes('/miyamachi-shop-search')
        ? '/miyamachi-shop-search/project.zip'
        : '/project.zip';

      console.log('Fetching ZIP from dynamic URL:', zipUrl);
      setDownloadProgressText('ロード中...');
      
      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      if (blob.size === 0 || blob.type.includes('text/html')) {
        throw new Error('Downloaded file is empty or invalid (HTML template returned).');
      }

      setDownloadProgressText('展開中...');
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'miyamachi-shop-search.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadProgressText('完了！');
      setTimeout(() => setDownloadProgressText(''), 2500);
    } catch (err) {
      console.error('ZIP fetch failed, falling back to direct open:', err);
      const pathname = window.location.pathname;
      const fallbackUrl = pathname.includes('/miyamachi-shop-search')
        ? '/miyamachi-shop-search/project.zip'
        : '/project.zip';
      
      window.open(fallbackUrl, '_blank');
      setDownloadProgressText('別タブで開きました');
      setTimeout(() => setDownloadProgressText(''), 4000);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleDownloadImage = async (fileName: string, defaultName: string) => {
    try {
      const pathname = window.location.pathname;
      const fileUrl = pathname.includes('/miyamachi-shop-search')
        ? `/miyamachi-shop-search/${fileName}`
        : `/${fileName}`;

      console.log('Fetching image from dynamic URL:', fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      if (blob.size === 0 || blob.type.includes('text/html')) {
        throw new Error('Downloaded file is empty or invalid (HTML template returned).');
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = defaultName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Image fetch failed, falling back to direct open in new tab:', err);
      const pathname = window.location.pathname;
      const fallbackUrl = pathname.includes('/miyamachi-shop-search')
        ? `/miyamachi-shop-search/${fileName}`
        : `/${fileName}`;
      
      window.open(fallbackUrl, '_blank');
    }
  };
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Read query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const sort = (params.get('sort') || 'id') as SortKey;
    const cats = params.get('categories');
    const areas = params.get('areas');

    if (q) setSearchQuery(q);
    if (sort) setSortBy(sort);
    if (cats) setSelectedCategories(cats.split(',').filter(Boolean));
    if (areas) setSelectedAreas(areas.split(',').filter(Boolean));
  }, []);

  // Update query parameters on change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (sortBy !== 'id') params.set('sort', sortBy);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedAreas.length > 0) params.set('areas', selectedAreas.join(','));

    const searchStr = params.toString();
    const newUrl = window.location.pathname + (searchStr ? '?' + searchStr : '');
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, sortBy, selectedCategories, selectedAreas]);

  // Compute static store counts for each filter chip
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = stores.filter((s) => s.category === cat).length;
    });
    return counts;
  }, [stores]);

  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    AREAS.forEach((area) => {
      counts[area] = stores.filter((s) => s.area === area).length;
    });
    return counts;
  }, [stores]);

  // Multi-word partial search + category + area filters
  const filteredStores = useMemo(() => {
    // Shuffled array is used if it's the initial state (no categories, areas, search keyword, favorites, or non-default sorting selected)
    const isInitialState = 
      selectedCategories.length === 0 && 
      selectedAreas.length === 0 && 
      !searchQuery.trim() && 
      !showOnlyFavorites &&
      sortBy === 'id';

    let result = isInitialState && shuffledStores.length > 0
      ? [...shuffledStores]
      : [...stores];

    // 0. Only show favorites filter
    if (showOnlyFavorites) {
      result = result.filter((store) => favorites.includes(store.id));
    }

    // 1. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((store) => selectedCategories.includes(store.category));
    }

    // 2. Area Filter
    if (selectedAreas.length > 0) {
      result = result.filter((store) => selectedAreas.includes(store.area));
    }

    // 3. Keyword Search (Partial match across Name, Services, Address, Category, and Area)
    if (searchQuery.trim()) {
      const words = searchQuery
        .trim()
        .toLowerCase()
        .split(/[\s,　]+/)
        .filter(Boolean);

      result = result.filter((store) => {
        return words.every((word) => {
          return (
            store.name.toLowerCase().includes(word) ||
            store.services.toLowerCase().includes(word) ||
            store.address.toLowerCase().includes(word) ||
            store.category.toLowerCase().includes(word) ||
            store.area.toLowerCase().includes(word)
          );
        });
      });
    }

    return result;
  }, [stores, shuffledStores, selectedCategories, selectedAreas, searchQuery, showOnlyFavorites, favorites, sortBy]);

  // Reset pagination count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategories, selectedAreas, searchQuery, showOnlyFavorites]);

  // Sorting Logic
  const sortedAndFilteredStores = useMemo(() => {
    const items = [...filteredStores];
    if (sortBy === 'name-asc') {
      return items.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    }
    if (sortBy === 'name-desc') {
      return items.sort((a, b) => b.name.localeCompare(a.name, 'ja'));
    }
    if (sortBy === 'category') {
      return items.sort((a, b) => a.category.localeCompare(b.category, 'ja'));
    }

    // Check if we are in the initial display state where we should keep the shuffle
    const isInitialState = 
      selectedCategories.length === 0 && 
      selectedAreas.length === 0 && 
      !searchQuery.trim() && 
      !showOnlyFavorites &&
      sortBy === 'id';

    if (isInitialState) {
      return items; // Keep shuffled order
    }

    // Default Shinto order or registration sequence
    return items.sort((a, b) => a.id - b.id);
  }, [filteredStores, sortBy, selectedCategories, selectedAreas, searchQuery, showOnlyFavorites]);

  // Slice visible stores
  const visibleStores = useMemo(() => {
    return sortedAndFilteredStores.slice(0, visibleCount);
  }, [sortedAndFilteredStores, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedAreas([]);
    setSearchQuery('');
    setSortBy('id');
    setShowOnlyFavorites(false);
  };

  const handleRemoveCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleRemoveArea = (area: string) => {
    setSelectedAreas((prev) => prev.filter((a) => a !== area));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-base" id="app-root">
      {/* Top Accent Line */}
      <div className="h-1 bg-brand-green w-full flex-none" />

      {/* Admin Mode Top Banner */}
      {isAdmin && (
        <div className="bg-amber-500 text-white py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-4 shadow-sm z-40 relative border-b border-black/10" id="admin-banner">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
            <span>管理者モード有効中（各店舗の写真を変更できます）</span>
          </span>
          <button
            type="button"
            onClick={handleAdminLogout}
            className="bg-white/15 hover:bg-white/25 active:bg-white/35 text-white px-3 py-1 rounded-[2px] border border-white/20 font-semibold cursor-pointer transition-colors text-[11px]"
            id="admin-logout-btn"
          >
            ログアウト
          </button>
        </div>
      )}

      {/* Hero Banner Header */}
      <header className="bg-brand-base py-6 sm:py-14 px-4 relative overflow-hidden border-b border-b-black/[0.04]" id="page-header">
        <HeroBackgroundPattern />

        {/* Subtle, elegant BGM Toggle Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center" id="bgm-control-container">
          <button
            onClick={() => setBgmOn((prev) => !prev)}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-black/[0.06] shadow-xs transition-all duration-300 group cursor-pointer"
            title={bgmOn ? "BGMをミュート" : "BGMを再生（お宮町の風情）"}
            aria-label="BGMを切り替え"
            id="bgm-toggle-btn"
          >
            {bgmOn ? (
              <Music className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-brand-green fill-brand-green/85 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-brand-charcoal/50 group-hover:text-brand-charcoal/70 transition-colors duration-300" />
            )}
          </button>
        </div>
        
        <div className="max-w-[1500px] mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Main Title */}
          <p className="text-[11px] sm:text-xs tracking-[0.25em] text-brand-green font-semibold mb-3 border border-brand-green/25 rounded-full px-4 py-1.5 bg-white/60">
            仙台・宮町商店街｜店舗検索サイト
          </p>
          <AnimatedTitle />
          
          {/* Poetic description */}
          <p className="text-xs sm:text-sm text-brand-charcoal/75 max-w-xl leading-relaxed tracking-[0.08em] font-medium mb-6">
            仙台東照宮の門前町、お宮町。
            <br />
            四百年、この道は誰かの行きつけでした。
            <br />
            次はあなたのお店を。——全{stores.length}店舗から、さがす。
          </p>
          {/* Logo Combo */}
          <div className="flex flex-col items-center gap-4 w-full" id="logo-container">
            <div className="flex items-center justify-center gap-4 flex-nowrap whitespace-nowrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 2.8 // Appears gracefully as the "Omiyamachi" rotation starts to settle
                }}
              >
                <LogoSVG />
              </motion.div>
              <div className="text-left border-l border-black/[0.08] pl-4 py-1 whitespace-nowrap">
                <motion.div 
                  className="h-[22px] sm:h-[38px] flex items-center whitespace-nowrap"
                  style={{ transformOrigin: "46% center" }}
                  initial={{ 
                    opacity: 0, 
                    scale: 1.5,
                    rotateY: -180,
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                  }}
                  transition={{ 
                    duration: 1.8,
                    ease: [0.16, 1, 0.3, 1], // Smooth custom cubic bezier easing
                    delay: 1.6
                  }}
                >
                  <img 
                    src={`${import.meta.env.BASE_URL || '/'}logo_in_zip.png`} 
                    alt="お宮町" 
                    className="h-full w-auto object-contain block"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <motion.p 
                  className="text-[9px] tracking-[0.22em] text-brand-charcoal/50 font-semibold uppercase mt-2.5 leading-none whitespace-nowrap"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 3.0
                  }}
                >
                  MIYAMACHI STREET
                </motion.p>
                <motion.p 
                  className="text-[9px] tracking-[0.05em] text-brand-green font-medium mt-1.5 leading-none whitespace-nowrap"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 3.1
                  }}
                >
                  宮町商店街振興組合
                </motion.p>
              </div>
            </div>
            
            {/* Official Website Link */}
            <a 
              href="https://www.omiyamachi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs text-brand-charcoal/60 hover:text-brand-green tracking-[0.08em] font-medium flex items-center gap-1.5 transition-all duration-300 border-b border-black/[0.08] hover:border-brand-green/30 pb-0.5 mt-1"
              id="official-website-link"
            >
              <span>宮町商店街振興組合 公式サイト</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Favorites Toggle Switch */}
            <div className="mt-5 flex items-center justify-center gap-3 bg-white/75 backdrop-blur-md border border-black/[0.04] rounded-full px-5 py-2 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-md" id="favorites-toggle-container">
              <button
                type="button"
                onClick={() => setShowOnlyFavorites((prev) => !prev)}
                className="flex items-center gap-3 group cursor-pointer focus:outline-none"
                id="favorites-toggle-button"
              >
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ease-in-out flex items-center ${showOnlyFavorites ? 'bg-amber-400' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${showOnlyFavorites ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-brand-charcoal/85 group-hover:text-brand-charcoal flex items-center gap-1.5 select-none transition-colors">
                  <Star className={`w-4 h-4 transition-all duration-300 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400 scale-110' : 'text-gray-400 group-hover:text-amber-500'}`} />
                  <span>お気に入り店舗のみ表示 ({favorites.length}店舗)</span>
                </span>
              </button>
            </div>

            {/* Hero Slider with 16:9 Aspect Ratio */}
            <div className="w-full mt-6 mb-2 sm:mt-12 sm:mb-6 flex justify-center">
              <HeroSlider />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto py-12" id="main-content">
        
        {/* Search UI directly under Hero */}
        <section className="max-w-3xl mx-auto px-4 mb-16" id="search-section">
          <h2 className="text-center text-sm sm:text-base font-serif font-semibold tracking-[0.15em] text-brand-charcoal/80 mb-6">
            店舗を検索する
          </h2>
          <SearchFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedAreas={selectedAreas}
            setSelectedAreas={setSelectedAreas}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categoryCounts={categoryCounts}
            areaCounts={areaCounts}
            totalFound={sortedAndFilteredStores.length}
            onReset={handleReset}
          />
          
          {/* Footnote Guide */}
          <div className="text-center text-[10px] sm:text-xs text-brand-charcoal/40 tracking-wider mt-6">
            <span>店舗情報やイベント詳細は公式HPでもご覧いただけます。</span>
            <a
              href="https://omiyamachi.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-green hover:text-brand-green-hover font-semibold underline ml-1"
            >
              <span>公式サイトへ</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

        {/* Results / Grid Area */}
        <section className="max-w-6xl mx-auto px-4" id="results-section">
          <h2 className="sr-only">宮町商店街 店舗検索結果一覧</h2>
          
          {/* Active Filters Display */}
          {(selectedCategories.length > 0 || selectedAreas.length > 0 || searchQuery || showOnlyFavorites) && (
            <div className="bg-white border border-black/[0.05] rounded-[2px] p-4 mb-8 flex flex-wrap items-center gap-2 text-xs" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <span className="text-brand-charcoal/50 font-semibold tracking-wider uppercase shrink-0">現在の選択条件:</span>
              
              {/* Favorites Only Badge */}
              {showOnlyFavorites && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-[2px] border border-amber-200/50">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>お気に入り店舗のみ</span>
                  <button
                    type="button"
                    onClick={() => setShowOnlyFavorites(false)}
                    className="text-amber-500/60 hover:text-amber-600 focus:outline-none cursor-pointer"
                    title="お気に入りフィルターを解除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Search Text */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-green-light text-brand-green px-2.5 py-1 rounded-[2px] border border-brand-green/10">
                  <span>「{searchQuery}」</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-brand-green/60 hover:text-brand-green focus:outline-none cursor-pointer"
                    title="このキーワードを削除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Categories */}
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-green text-white px-2.5 py-1 rounded-[2px]"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="text-white/70 hover:text-white focus:outline-none cursor-pointer"
                    title={`${cat} フィルターを解除`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Areas */}
              {selectedAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-gold-light text-brand-gold px-2.5 py-1 rounded-[2px] border border-brand-gold/15"
                >
                  <span>{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    className="text-brand-gold/70 hover:text-brand-gold focus:outline-none cursor-pointer"
                    title={`${area} フィルターを解除`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-brand-accent hover:underline font-semibold ml-auto cursor-pointer"
              >
                すべてクリア
              </button>
            </div>
          )}

          {/* Empty States Handling */}
          {sortedAndFilteredStores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2px] border border-black/[0.06] p-16 text-center shadow-xs"
              id="no-results-empty-state"
            >
              <div className="w-12 h-12 bg-brand-vermillion-light rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-base font-serif font-semibold text-brand-charcoal mb-2 tracking-wide">
                条件に合う店舗が見つかりませんでした
              </h3>
              <p className="text-xs text-brand-charcoal/50 max-w-md mx-auto mb-6 leading-relaxed">
                キーワードの誤字脱字がないか、あるいは絞り込みの項目（カテゴリ・エリア）を減らして再度お試しください。
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold py-3 px-6 rounded-[2px] shadow-xs transition-all cursor-pointer"
                id="reset-empty-state-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>すべての条件をリセットする</span>
              </button>
            </motion.div>
          ) : (
            /* Stores Grid Section - Luxurious 3-Column Grid */
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="stores-cards-grid">
                <AnimatePresence>
                  {visibleStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      searchQuery={searchQuery}
                      isFavorite={favorites.includes(store.id)}
                      onToggleFavorite={handleToggleFavorite}
                      customImage={customImages[store.id]}
                      onUpdateImage={(url) => handleUpdateImage(store.id, url)}
                      isAdmin={isAdmin}
                      onSelectCategory={(cat) => {
                        setSelectedCategories([cat]);
                        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onSelectArea={(area) => {
                        setSelectedAreas([area]);
                        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Incremental Rendering ("Load More" Button) */}
              {sortedAndFilteredStores.length > visibleCount && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/30 hover:border-brand-green font-semibold py-3 px-10 rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 cursor-pointer text-xs w-full sm:w-auto focus:outline-none"
                    id="load-more-stores-btn"
                  >
                    <span>さらに読み込む ({sortedAndFilteredStores.length - visibleCount}件残っています)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer Area */}
      <footer className="bg-brand-charcoal text-gray-300 mt-24 border-t border-black" id="page-footer">
        {/* Minimal Gold accent divider line */}
        <div className="h-[1px] bg-brand-gold/30 w-full" />
        
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-xs leading-relaxed">
            
            {/* Column 1 - Brand Info */}
            <div className="space-y-4">
              <h3 className="font-serif font-medium text-white flex items-center gap-2 text-sm tracking-wider">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                <span>宮町商店街振興組合</span>
              </h3>
              <p className="text-gray-400 tracking-wide">
                仙台東照宮の門前町として、また藩政時代より続く伝統の町「宮町」を愛するお店の集まりです。
              </p>
            </div>

            {/* Column 2 - Disclaimers & Notes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-widest">
                データに関するご案内
              </h4>
              <p className="text-gray-400 tracking-wide">
                ※ エリア・住所情報等は自動機械抽出された情報に基づいているため、一部表記の不整合や誤差がある場合があります。<br />
                ※ 営業時間・定休日は祝祭日や諸事情により変更となる場合があります。ご来店の際は事前にお電話等でご確認ください。
              </p>
            </div>

            {/* Column 3 - Fast Jump navigation */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-widest">
                関連リンク
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://omiyamachi.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-brand-gold transition-colors inline-flex items-center gap-1 font-semibold"
                  >
                    <span>宮町商店街 公式サイト</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li className="pt-2 border-t border-gray-800/50 flex flex-col gap-1.5">
                  <span className="text-gray-500 text-[10px] leading-relaxed">
                    本アプリは検索機能向上のための独立した店舗検索ページとして動作しています。
                  </span>
                  {!isAdmin ? (
                    <button
                      type="button"
                      onClick={() => setIsAdminModalOpen(true)}
                      className="text-gray-400 hover:text-brand-gold transition-colors text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer mt-1 self-start focus:outline-none"
                      id="admin-login-trigger"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>管理者ログイン</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdminLogout}
                      className="text-brand-green hover:text-brand-green-hover transition-colors text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer mt-1 self-start focus:outline-none"
                      id="admin-logout-trigger"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>管理者ログアウト</span>
                    </button>
                  )}
                </li>
                <li className="pt-2 border-t border-gray-800/30 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={isDownloadingZip}
                    className="text-brand-gold/90 hover:text-brand-gold disabled:text-gray-500 transition-colors text-[11px] font-semibold flex items-center gap-1.5 focus:outline-none cursor-pointer text-left"
                    id="developer-zip-download-trigger"
                  >
                    {isDownloadingZip ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {downloadProgressText ? `ZIP準備中: ${downloadProgressText}` : '最新ソースコード(ZIP)をダウンロード'}
                    </span>
                  </button>
                  <p className="text-[9px] text-gray-500 leading-normal">
                    ※ プレビューのiframe環境でダウンロードできない場合は、右上の「Visit」ボタンから別タブでアプリを開いてお試しください。
                  </p>
                </li>
                <li className="pt-2 border-t border-gray-800/30 flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">お宮町 公式ロゴマーク (1024×1024)</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadImage('miyamachi_logo_mark.png', 'miyamachi_logo_mark.png')}
                      className="text-brand-gold/90 hover:text-brand-gold transition-colors text-[11px] font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                      id="official-logo-png-download-trigger"
                    >
                      <Image className="w-3 h-3" strokeWidth={2} />
                      <span>PNG（背景透過）</span>
                    </button>
                    <span className="text-gray-600 text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadImage('miyamachi_logo_mark.jpg', 'miyamachi_logo_mark.jpg')}
                      className="text-brand-gold/90 hover:text-brand-gold transition-colors text-[11px] font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                      id="official-logo-jpg-download-trigger"
                    >
                      <Image className="w-3 h-3" strokeWidth={2} />
                      <span>JPG（背景白）</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-500 leading-normal">
                    ※ 絞り染めの背景装飾、お宮町の文字、鳥居と緑の曲線、赤丸を含む公式シンボルマーク。
                  </p>
                </li>
                <li className="pt-2 border-t border-gray-800/30 flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">お宮町 毛筆ロゴ (筆文字テキスト)</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadImage('omiyamachi_logo_transparent.png', 'omiyamachi_logo_transparent.png')}
                      className="text-brand-gold/90 hover:text-brand-gold transition-colors text-[11px] font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                      id="brush-logo-transparent-download-trigger"
                    >
                      <Image className="w-3 h-3" strokeWidth={2} />
                      <span>PNG（背景透過）</span>
                    </button>
                    <span className="text-gray-600 text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadImage('omiyamachi_logo_white.png', 'omiyamachi_logo_white.png')}
                      className="text-brand-gold/90 hover:text-brand-gold transition-colors text-[11px] font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                      id="brush-logo-white-download-trigger"
                    >
                      <Image className="w-3 h-3" strokeWidth={2} />
                      <span>PNG（白文字・背景透過）</span>
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-500 leading-normal">
                    ※ 「お宮町」の美しい伝統的な手書き毛筆（筆文字）のタイトルロゴ画像です。
                  </p>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-800/40 mt-12 pt-8 text-center text-[10px] text-gray-500 tracking-wider">
            <p>© 2026 宮町商店街振興組合. All Rights Reserved. Designed with reverence.</p>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="admin-login-modal">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setIsAdminModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-black/[0.08] rounded-md shadow-2xl p-6 sm:p-8 max-w-sm w-full relative z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                title="閉じる"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto text-brand-green">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-brand-charcoal">
                  管理者用ログイン
                </h3>
                <p className="text-xs text-brand-charcoal/60 leading-relaxed">
                  店舗情報の管理・写真を変更するには、<br />パスワードを入力してください。
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="admin-password" className="text-[10px] font-bold text-brand-charcoal/50 tracking-wider uppercase block">
                    パスワード
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    placeholder="パスワードを入力"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-[2px] text-sm focus:outline-none focus:border-brand-green/80 focus:ring-1 focus:ring-brand-green/30 transition-all bg-gray-50/30 text-brand-charcoal"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-xs text-red-500 font-medium" id="login-error-msg">
                      {passwordError}
                    </p>
                  )}
                  <p className="text-[10px] text-brand-charcoal/40 leading-relaxed pt-1">
                    ※ デモ用パスワード：<code className="bg-gray-100 px-1 py-0.5 rounded text-brand-green font-mono font-bold">miyamachi</code>
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminModalOpen(false)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-brand-charcoal/70 border border-gray-200/50 text-xs font-semibold py-2.5 rounded-[2px] cursor-pointer transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold py-2.5 rounded-[2px] cursor-pointer transition-colors shadow-xs"
                  >
                    ログイン
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
