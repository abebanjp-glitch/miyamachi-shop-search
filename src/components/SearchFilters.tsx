import React, { useState } from 'react';
import { Search, X, RotateCcw, SlidersHorizontal, MapPin, Tag, ArrowUpDown } from 'lucide-react';
import { CATEGORIES, AREAS } from '../data/constants';
import { SortKey } from '../types';

interface SearchFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortKey;
  setSortBy: (sort: SortKey) => void;
  categoryCounts: Record<string, number>;
  areaCounts: Record<string, number>;
  totalFound: number;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedCategories,
  setSelectedCategories,
  selectedAreas,
  setSelectedAreas,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  categoryCounts,
  areaCounts,
  totalFound,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'category-area' | 'keyword'>(() => {
    if (searchQuery && !selectedCategories.length && !selectedAreas.length) {
      return 'keyword';
    }
    return 'category-area';
  });

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  };

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas([]);
    } else {
      setSelectedAreas([area]);
    }
  };

  const handleTabChange = (tab: 'category-area' | 'keyword') => {
    setActiveTab(tab);
    if (tab === 'category-area') {
      setSearchQuery('');
    } else {
      setSelectedCategories([]);
      setSelectedAreas([]);
    }
  };

  const activeFilterCount = selectedCategories.length + selectedAreas.length + (searchQuery ? 1 : 0);
  const suggestedKeywords = ['和菓子', 'カフェ', 'ケーキ', 'ラーメン', 'メガネ', 'カレー', '生花店', '居酒屋'];

  return (
    <div 
      className="bg-white border border-black/[0.06] rounded-[2px] p-6 sm:p-8" 
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      id="search-filters-container"
    >
      {/* Search Mode Tab Switcher */}
      <div className="flex border-b border-gray-100 -mx-6 sm:-mx-8 mb-8" id="search-mode-tabs">
        <button
          type="button"
          onClick={() => handleTabChange('category-area')}
          className={`flex-1 pb-4 text-center text-xs font-semibold tracking-[0.1em] transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 ${
            activeTab === 'category-area'
              ? 'border-brand-green text-brand-green font-bold'
              : 'border-transparent text-brand-charcoal/40 hover:text-brand-charcoal/80'
          }`}
          id="tab-category-area"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span>業種・エリアから探す</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('keyword')}
          className={`flex-1 pb-4 text-center text-xs font-semibold tracking-[0.1em] transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 ${
            activeTab === 'keyword'
              ? 'border-brand-green text-brand-green font-bold'
              : 'border-transparent text-brand-charcoal/40 hover:text-brand-charcoal/80'
          }`}
          id="tab-keyword"
        >
          <Search className="w-3.5 h-3.5 shrink-0 opacity-70" />
          <span>キーワードから探す</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'category-area' ? (
          <div className="space-y-6 animate-fadeIn" id="category-area-search-form">
            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-brand-charcoal/60 tracking-[0.08em] uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-green/75" />
                  <span>業種（ジャンル）</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCategories[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCategories(val ? [val] : []);
                    }}
                    className="w-full bg-transparent border-b border-gray-200 text-sm py-2 px-1 text-brand-charcoal font-medium focus:border-brand-green focus:outline-none cursor-pointer rounded-none appearance-none"
                    id="category-dropdown-select"
                  >
                    <option value="" className="text-brand-charcoal/60">すべての業種から選択</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-brand-charcoal/40">
                    <span className="text-[10px]">▼</span>
                  </div>
                </div>
              </div>

              {/* Area Dropdown */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-brand-charcoal/60 tracking-[0.08em] uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold/75" />
                  <span>エリア（地区）</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedAreas[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedAreas(val ? [val] : []);
                    }}
                    className="w-full bg-transparent border-b border-gray-200 text-sm py-2 px-1 text-brand-charcoal font-medium focus:border-brand-green focus:outline-none cursor-pointer rounded-none appearance-none"
                    id="area-dropdown-select"
                  >
                    <option value="" className="text-brand-charcoal/60">すべてのエリアから選択</option>
                    {AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-brand-charcoal/40">
                    <span className="text-[10px]">▼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Pills for Category */}
            <div className="space-y-3 pt-4 border-t border-gray-100/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-brand-charcoal/40 tracking-[0.05em]">
                  業種から選択する
                </span>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategories([])}
                    className="text-[10px] font-medium text-brand-accent hover:underline cursor-pointer"
                    id="clear-categories-pills-btn"
                  >
                    選択解除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5" id="category-pills-list">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  const count = categoryCounts[category] || 0;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-brand-green text-white border-brand-green font-medium'
                          : 'bg-white hover:bg-gray-50 text-brand-charcoal/80 border-gray-200'
                      }`}
                      id={`filter-category-${category}`}
                    >
                      <span>{category}</span>
                      <span className={`text-[10px] font-serif ${isSelected ? 'text-white/70' : 'text-brand-charcoal/40 font-medium'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Pills for Area */}
            <div className="space-y-3 pt-3 border-t border-gray-100/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-brand-charcoal/40 tracking-[0.05em]">
                  地区から選択する
                </span>
                {selectedAreas.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedAreas([])}
                    className="text-[10px] font-medium text-brand-accent hover:underline cursor-pointer"
                    id="clear-areas-pills-btn"
                  >
                    選択解除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5" id="area-pills-list">
                {AREAS.map((area) => {
                  const isSelected = selectedAreas.includes(area);
                  const count = areaCounts[area] || 0;
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-brand-green text-white border-brand-green font-medium'
                          : 'bg-white hover:bg-gray-50 text-brand-charcoal/80 border-gray-200'
                      }`}
                      id={`filter-area-${area}`}
                    >
                      <span>{area}</span>
                      <span className={`text-[10px] font-serif ${isSelected ? 'text-white/70' : 'text-brand-charcoal/40 font-medium'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn" id="keyword-search-form">
            <div>
              <label htmlFor="keyword-search" className="block text-[11px] font-semibold text-brand-charcoal/60 tracking-[0.08em] uppercase mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-brand-green/75" />
                <span>検索キーワードを入力</span>
              </label>
              <div className="relative">
                <input
                  id="keyword-search"
                  type="text"
                  className="w-full bg-transparent border-b border-gray-200 py-2.5 pl-8 pr-8 text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:border-brand-green focus:outline-none rounded-none transition-all"
                  placeholder="店名、取扱商品、サービス内容、住所など..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-brand-charcoal/40">
                  <Search className="h-4 w-4" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center text-brand-charcoal/30 hover:text-brand-charcoal/60 transition-colors"
                    title="クリア"
                    id="clear-keyword-btn"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Suggested Tags */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-semibold text-brand-charcoal/40 tracking-[0.05em] block">
                おすすめキーワード
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedKeywords.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => setSearchQuery(word)}
                    className="text-xs px-2.5 py-1 rounded-[2px] bg-gray-50 hover:bg-brand-green-light hover:text-brand-green text-brand-charcoal/70 transition-all cursor-pointer border border-gray-200/40"
                    id={`suggested-tag-${word}`}
                  >
                    #{word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Sorting & Statistics Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-6 text-xs text-brand-charcoal/70">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="font-semibold tracking-[0.05em] uppercase text-brand-charcoal/50">並び替え</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent border-b border-gray-200 py-1 px-1.5 font-medium focus:border-brand-green focus:outline-none cursor-pointer rounded-none appearance-none pr-4"
              id="sort-select-dropdown"
            >
              <option value="id">登録順（標準）</option>
              <option value="name-asc">五十音順（あ→ん）</option>
              <option value="name-desc">五十音順（ん→あ）</option>
              <option value="category">業種カテゴリー順</option>
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 text-brand-accent hover:underline font-medium py-1 px-1.5 transition-all cursor-pointer"
                id="reset-filters-btn"
              >
                <RotateCcw className="w-3 h-3" />
                <span>条件をクリア</span>
              </button>
            )}
            <div className="font-medium">
              該当店舗: <span className="text-base font-serif font-bold text-brand-green border-b border-brand-gold/60 pb-0.5">{totalFound}</span> 軒
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
