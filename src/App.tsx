import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, SortKey } from './types';
import storesData from './data/miyamachi_stores.json';
import { CATEGORIES, AREAS } from './data/constants';
import { StoreCard } from './components/StoreCard';
import { SearchFilters } from './components/SearchFilters';
import { AlertCircle, RefreshCw, ExternalLink, X, Music, VolumeX } from 'lucide-react';
import { HeroSlider } from './components/HeroSlider';
import { playBGM, pauseBGM } from './utils/audio';

const LogoSVG = () => {
  // 決定された公式ロゴカラー（③ 東照宮の伝統美）
  const colors = {
    torii: '#C59B27', // 絢爛な金箔・金泥ゴールド
    curve: '#1F1F1F', // 重厚な漆塗りの漆黒
    dot: '#D63C3C'    // 神威と人情の朱赤
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-16 h-16 sm:w-24 sm:h-24 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
      <path 
        d="M 49 53 C 60 53, 75 56, 73 69 C 71 80, 50 83, 37 77 C 29 73, 27 65, 34 59 C 41 53, 51 55, 55 62 C 57 66, 55 70, 50 70 C 46 70, 44 66, 47 63 C 49 61, 52 62, 52 64" 
        stroke={colors.curve}
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
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
      <span className="sr-only">宮町商店街 店舗検索｜仙台市青葉区宮町の183店舗をさがす</span>
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

  // BGM State (Default is muted/off)
  const [bgmOn, setBgmOn] = useState<boolean>(false);

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
    let result = [...stores];

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
  }, [stores, selectedCategories, selectedAreas, searchQuery]);

  // Reset pagination count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategories, selectedAreas, searchQuery]);

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
    // Default Shinto order or registration sequence
    return items.sort((a, b) => a.id - b.id);
  }, [filteredStores, sortBy]);

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

      {/* Hero Banner Header */}
      <header className="bg-brand-base py-10 sm:py-14 px-4 relative overflow-hidden border-b border-b-black/[0.04]" id="page-header">
        <HeroBackgroundPattern />

        {/* Subtle, elegant BGM Toggle Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center" id="bgm-control-container">
          <button
            onClick={() => setBgmOn((prev) => !prev)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-black/[0.06] shadow-xs transition-all duration-300 group cursor-pointer"
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
          <AnimatedTitle />
          
          {/* Poetic description */}
          <p className="text-xs sm:text-sm text-brand-charcoal/75 max-w-xl leading-relaxed tracking-[0.08em] font-medium mb-6">
            仙台東照宮の門前町、お宮町。
            <br />
            四百年、この道は誰かの行きつけでした。
            <br />
            次はあなたのお店を。——全183店舗から、さがす。
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
                <motion.h2 
                  className="font-serif font-semibold tracking-[0.15em] text-lg sm:text-3.5xl leading-none flex items-baseline whitespace-nowrap"
                  style={{ transformOrigin: "46% center" }}
                  initial={{ 
                    opacity: 0, 
                    scale: 1.5,
                    rotateY: -180,
                    color: "#B08D57" // Elegant Gold to start
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                    color: "#1C1C1A" // Transitions to premium Charcoal Black
                  }}
                  transition={{ 
                    duration: 1.8,
                    ease: [0.16, 1, 0.3, 1], // Smooth custom cubic bezier easing
                    delay: 1.6
                  }}
                >
                  お宮町
                </motion.h2>
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

            {/* Hero Slider with 16:9 Aspect Ratio */}
            <div className="w-full mt-8 mb-4 sm:mt-12 sm:mb-6 flex justify-center">
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
          {(selectedCategories.length > 0 || selectedAreas.length > 0 || searchQuery) && (
            <div className="bg-white border border-black/[0.05] rounded-[2px] p-4 mb-8 flex flex-wrap items-center gap-2 text-xs" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <span className="text-brand-charcoal/50 font-semibold tracking-wider uppercase shrink-0">現在の選択条件:</span>
              
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
                <AnimatePresence mode="popLayout">
                  {visibleStores.map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      searchQuery={searchQuery}
                      customImage={customImages[store.id]}
                      onUpdateImage={(url) => handleUpdateImage(store.id, url)}
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
                <li className="text-gray-500 text-[10px] leading-relaxed pt-2 border-t border-gray-800/50">
                  本アプリは検索機能向上のための独立した店舗検索ページとして動作しています。
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-800/40 mt-12 pt-8 text-center text-[10px] text-gray-500 tracking-wider">
            <p>© 2026 宮町商店街振興組合. All Rights Reserved. Designed with reverence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
