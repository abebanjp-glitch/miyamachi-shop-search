import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, Calendar, ShoppingBag, ExternalLink, Camera, Upload, X, Link, Trash2 } from 'lucide-react';
import { Store } from '../types';
import { getCategoryColor } from '../data/constants';

interface StoreCardProps {
  store: Store;
  searchQuery: string;
  customImage?: string;
  onUpdateImage?: (imageUrl: string) => void;
}

// Utility to escape regex special characters
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Utility to highlight searched keywords
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!text) return null;
  if (!query || !query.trim()) return <>{text}</>;

  // Split query by spaces to support multi-word search
  const words = query
    .trim()
    .split(/[\s,　]+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return <>{text}</>;

  const pattern = words.map((w) => escapeRegExp(w)).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-brand-gold-light text-brand-charcoal font-medium px-0.5 border-b border-brand-gold/60">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// Curated list of elegant, category-specific Unsplash photos (highly optimized for Japanese town look/feel)
const CATEGORY_IMAGES: Record<string, string[]> = {
  'ショッピング': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80'
  ],
  'グルメ＆スイーツ': [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581184953963-d159a2a3ab15?auto=format&fit=crop&w=600&q=80'
  ],
  'スーパー・食料品・お酒': [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1601205741712-b13c485099a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=600&q=80'
  ],
  '暮らしのサービス': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
  ],
  '医療・薬局・美容・健康': [
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
  ],
  '学ぶ・スクール': [
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  ],
  '遊ぶ・趣味・ビジネス': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80'
  ]
};

const DEFAULT_IMAGE_LIST = [
  'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=600&q=80'
];

export const getStoreImageUrl = (store: Store, customImage?: string) => {
  if (customImage) return customImage;
  if (store.officialImage) return store.officialImage;
  if (store.image) return store.image;

  const name = store.name || '';
  const services = store.services || '';

  // 1. Specific popular store overrides in Miyamachi
  if (name.includes('エンドー餅店')) {
    return 'https://images.unsplash.com/photo-1582381449548-b5419e5de7ff?auto=format&fit=crop&w=600&q=80'; // Traditional wagashi/mochi
  }
  if (name.includes('貴玲')) {
    return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'; // Accessory / Jewelry craft
  }
  if (name.includes('メガネ')) {
    return 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80'; // Spectacles/optical shop
  }
  if (name.includes('さまん')) {
    return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80'; // Pet grooming dog
  }
  if (name.includes('菅野')) {
    return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'; // Futon bedding/bed style
  }
  if (name.includes('ケイキ')) {
    return 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=600&q=80'; // Vintage audio/record player
  }
  if (name.includes('華') || name.includes('生花') || name.includes('おのでら') || name.includes('花')) {
    return 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80'; // Beautiful fresh floristry
  }
  if (name.includes('モルソー')) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'; // Antique furniture shop front
  }
  if (name.includes('カフェ') || name.includes('café') || name.includes('コーヒー') || name.includes('珈琲')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'; // Chic warm cafe
  }
  if (name.includes('一元')) {
    return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'; // High-end Chinese meal table
  }
  if (name.includes('ル・ボア')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'; // Elegant Patisserie/cakes
  }

  // 2. Powerful keyword-matching rules for auto-populating 150+ stores
  // Soba/Udon/Noodles
  if (name.includes('そば') || name.includes('蕎麦') || name.includes('うどん') || name.includes('庵') || services.includes('そば')) {
    return 'https://images.unsplash.com/photo-1618090584126-129cd1f3fbbb?auto=format&fit=crop&w=600&q=80'; // Fresh Japanese buckwheat soba
  }
  // Ramen/Chinese
  if (name.includes('ラーメン') || name.includes('らーめん') || name.includes('中華') || name.includes('餃子') || name.includes('麺') || services.includes('ラーメン') || services.includes('中華')) {
    return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'; // Steaming ramen broth bowl
  }
  // Izakaya/Bar/Yakitori/Sake
  if (name.includes('居酒屋') || name.includes('やきとり') || name.includes('焼鳥') || name.includes('バル') || name.includes('酒') || name.includes('スナック') || name.includes('バー') || services.includes('お酒') || services.includes('スナック')) {
    return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'; // Ambient sake barrels and glasses
  }
  // Sushi/Fish
  if (name.includes('寿司') || name.includes('鮨') || name.includes('魚') || name.includes('鮮魚') || services.includes('寿司')) {
    return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'; // Deluxe sushi platter
  }
  // Yakiniku/Barbecue/Meat
  if (name.includes('焼肉') || name.includes('肉') || name.includes('ホルモン') || name.includes('牛') || name.includes('精肉')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'; // Sizzling wagyu grill
  }
  // Laundry/Dry cleaning
  if (name.includes('クリーニング') || name.includes('ランドリー') || services.includes('クリーニング')) {
    return 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80'; // Aesthetic clean laundry line
  }
  // Beauty Salon/Barber/Hair/Nails
  if (name.includes('美容') || name.includes('理容') || name.includes('サロン') || name.includes('ヘア') || name.includes('カット') || name.includes('髪') || name.includes('ネイル') || services.includes('カット') || services.includes('ヘア')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'; // Clean premium salon chair
  }
  // Medical Clinic/Dentist/Pharmacy/Osteopathy
  if (name.includes('歯科') || name.includes('医院') || name.includes('クリニック') || name.includes('薬局') || name.includes('接骨') || name.includes('整骨') || name.includes('整体') || name.includes('内科') || name.includes('診療') || name.includes('クリニック') || services.includes('処方')) {
    return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'; // Clean clinic lobby
  }
  // Bicycle/Cycle repair
  if (name.includes('サイクル') || name.includes('自転車') || name.includes('輪') || services.includes('自転車')) {
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80'; // Bikes standing outside
  }
  // Convenience stores
  if (name.includes('セブン') || name.includes('ローソン') || name.includes('ファミリーマート') || name.includes('ファミマ') || name.includes('コンビニ')) {
    return 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'; // Bright convenience retail aisles
  }
  // Supermarkets/Greens/Groceries
  if (name.includes('スーパー') || name.includes('八百屋') || name.includes('市場') || name.includes('青果') || name.includes('食料') || name.includes('新鮮')) {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'; // Colorful vegetable produce crates
  }
  // Bookstore/Stationery
  if (name.includes('書店') || name.includes('文具') || name.includes('本') || name.includes('書籍') || services.includes('本') || services.includes('文房具')) {
    return 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80'; // Authentic book stack / quiet reading
  }
  // Apparel/Boutique fashion
  if (name.includes('服') || name.includes('洋服') || name.includes('婦人服') || name.includes('ブティック') || services.includes('服')) {
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'; // Warm clothes hanging on rack
  }
  // Electronics/Appliance/Audio repair
  if (name.includes('オーディオ') || name.includes('電器') || name.includes('電気') || name.includes('カメラ') || services.includes('家電')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; // Quality retro tech/sound
  }

  // 3. Fallback to standard category arrays
  const list = CATEGORY_IMAGES[store.category] || DEFAULT_IMAGE_LIST;
  const index = store.id % list.length;
  return list[index];
};

export const StoreCard: React.FC<StoreCardProps> = ({ store, searchQuery, customImage, onUpdateImage }) => {
  const catColor = getCategoryColor(store.category);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.name)}`;

  // Photo editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイル（PNG、JPG等）を選択してください。');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setInputUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const openModal = () => {
    setInputUrl(customImage || '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (onUpdateImage) {
      onUpdateImage(inputUrl);
    }
    setIsModalOpen(false);
  };

  const handleResetImage = () => {
    if (onUpdateImage) {
      onUpdateImage('');
    }
    setInputUrl('');
    setIsModalOpen(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-[2px] border border-black/[0.06] hover:border-brand-green/50 transition-all duration-300 ease-out flex flex-col overflow-hidden relative shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.05)]"
      id={`store-card-${store.id}`}
    >
      {/* Store Image Cover */}
      <div className="relative aspect-video w-full sm:h-auto sm:aspect-video sm:w-[70%] sm:mx-auto sm:mt-5 sm:rounded-[2px] overflow-hidden bg-gray-100 flex-none group">
        <img
          src={getStoreImageUrl(store, customImage)}
          alt={store.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Change Image Trigger Button */}
        <button
          type="button"
          onClick={openModal}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-brand-green p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer z-10 flex items-center justify-center border border-gray-200/80 hover:scale-105 active:scale-95"
          title="写真を変更する"
          id={`change-image-btn-${store.id}`}
        >
          <Camera className="w-4 h-4" />
        </button>

        {customImage && (
          <span className="absolute bottom-3 left-3 bg-brand-green text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-[2px] shadow-xs border border-white/25">
            登録写真
          </span>
        )}
      </div>

      {/* Header section with category badge & area badge */}
      <div className="p-6 pb-4 border-b border-black/[0.03] flex-1 relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold text-brand-green tracking-[0.15em] uppercase">
            {store.category}
          </span>
          <span className="text-[10px] font-bold text-brand-gold tracking-[0.05em] px-2 py-0.5 border border-brand-gold/20 rounded-[2px] bg-brand-gold-light/40">
            {store.area}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-serif font-semibold text-brand-charcoal leading-snug hover:text-brand-green transition-colors tracking-wide">
          <HighlightedText text={store.name} query={searchQuery} />
        </h3>
      </div>

      {/* Details list */}
      <div className="p-6 py-5 space-y-4 flex-none border-b border-black/[0.03] text-sm text-brand-charcoal/80">
        {/* Address */}
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-brand-green/75 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-[13px] leading-relaxed break-words">{store.address}</span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-gold hover:text-brand-gold-hover transition-colors mt-1 hover:underline"
              id={`maps-link-${store.id}`}
            >
              <span>位置を確認する</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-brand-green/75 shrink-0" />
          <div className="flex-1 min-w-0">
            {store.phone ? (
              <a
                href={`tel:${store.phone.replace(/[^0-9-]/g, '')}`}
                className="text-[13px] font-semibold text-brand-charcoal hover:text-brand-accent hover:underline transition-colors focus:outline-none"
                id={`phone-link-${store.id}`}
              >
                {store.phone}
                <span className="text-[10px] text-brand-accent bg-brand-vermillion-light/70 px-1.5 py-0.5 rounded-[2px] ml-2 inline-block sm:hidden font-medium">
                  タップで発信
                </span>
              </a>
            ) : (
              <span className="text-[13px] text-brand-charcoal/40 italic">電話番号なし</span>
            )}
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-brand-green/75 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[13px] leading-relaxed break-words">
              {store.hours || '営業時間はお問い合わせください'}
            </span>
          </div>
        </div>

        {/* Closed day */}
        <div className="flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-brand-green/75 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[13px] leading-relaxed break-words">
              定休日: <span className="font-medium text-brand-charcoal">{store.closedDay || '（情報なし・無休など）'}</span>
            </span>
          </div>
        </div>

        {/* Website URL */}
        {store.website && (
          <div className="flex items-start gap-2.5 pt-0.5" id={`website-item-${store.id}`}>
            <Link className="w-4 h-4 text-brand-green/75 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold text-brand-gold uppercase tracking-wider mb-0.5">公式サイト / SNS</span>
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-brand-charcoal hover:text-brand-accent hover:underline transition-colors break-all inline-flex items-center gap-1"
                id={`website-link-${store.id}`}
              >
                <span className="truncate max-w-[200px]">{store.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                <ExternalLink className="w-3 h-3 text-brand-charcoal/30 shrink-0" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Services and products */}
      <div className="p-6 pt-5 bg-white mt-auto">
        <div className="flex items-start gap-2.5">
          <ShoppingBag className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-semibold tracking-[0.12em] text-brand-gold uppercase mb-1">
              取扱商品・サービス
            </h4>
            <p className="text-[13px] leading-relaxed text-brand-charcoal/70 break-words">
              <HighlightedText text={store.services} query={searchQuery} />
            </p>
          </div>
        </div>
      </div>

      {/* Modal for editing image */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[2px] max-w-md w-full p-6 shadow-2xl space-y-5 border border-black/[0.06] text-left relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-brand-charcoal/40 hover:text-brand-charcoal focus:outline-none cursor-pointer"
                title="閉じる"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-base font-bold text-brand-charcoal font-serif tracking-wide">
                  店舗写真の変更
                </h3>
                <p className="text-xs text-brand-charcoal/60 mt-1">
                  「{store.name}」のカードに表示する写真をお好みに変更できます。
                </p>
              </div>

              {/* Option 1: URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-charcoal/70 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-brand-green" />
                  <span>既存サイト等の写真URLを貼り付け</span>
                </label>
                <input
                  type="text"
                  value={inputUrl.startsWith('data:') ? '' : inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://omiyamachi.com/.../img.jpg"
                  className="w-full text-xs px-3 py-2.5 rounded-[2px] border border-gray-200 focus:border-brand-green focus:outline-none bg-transparent"
                />
                <p className="text-[11px] text-brand-charcoal/40 leading-relaxed">
                  ※ 公式サイト（omiyamachi.com）に掲載されている画像を右クリックし、<strong>「画像アドレスをコピー」</strong>して貼り付けると本物と同じ写真を適用できます。
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">または</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* Option 2: Drag & Drop upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-brand-charcoal/70 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-brand-gold" />
                  <span>画像をアップロード（端末から選択）</span>
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                  className={`border border-dashed rounded-[2px] p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
                    isDragging
                      ? 'border-brand-green bg-brand-green-light'
                      : 'border-gray-200 hover:border-brand-green bg-gray-50/20'
                  }`}
                >
                  <Upload className={`w-7 h-7 ${isDragging ? 'text-brand-green animate-bounce' : 'text-brand-charcoal/30'}`} />
                  <span className="text-[11px] font-semibold text-brand-charcoal/70">画像をここにドラッグ＆ドロップ</span>
                  <span className="text-[10px] text-brand-charcoal/40">または クリックしてファイルを選択</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Preview Zone */}
              {inputUrl && (
                <div className="p-3 bg-gray-50 rounded-[2px] border border-gray-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[2px] overflow-hidden bg-gray-200 shrink-0">
                    <img src={inputUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-brand-charcoal block truncate">プレビュー表示中</span>
                    <span className="text-[10px] text-brand-charcoal/40 truncate block">
                      {inputUrl.startsWith('data:') ? 'アップロードされたファイル' : inputUrl}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInputUrl('')}
                    className="text-brand-charcoal/30 hover:text-brand-accent p-1 rounded-sm focus:outline-none cursor-pointer"
                    title="クリア"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                {customImage && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-accent hover:bg-brand-vermillion-light rounded-[2px] transition-all focus:outline-none shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>初期設定に戻す</span>
                  </button>
                )}
                
                <div className="flex items-center gap-2 w-full sm:justify-end ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-brand-charcoal/50 hover:text-brand-charcoal bg-gray-50 hover:bg-gray-100 rounded-[2px] transition-all focus:outline-none cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!inputUrl}
                    className="w-full sm:w-auto px-4.5 py-2 text-xs font-bold text-white bg-brand-green hover:bg-brand-green-hover disabled:bg-gray-200 disabled:text-brand-charcoal/30 disabled:cursor-not-allowed rounded-[2px] transition-all focus:outline-none cursor-pointer"
                  >
                    変更を適用
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
