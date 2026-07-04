import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideItem {
  id: number;
  imageFallback: string;
  imageDefault: string;
  title: string;
  description: string;
  alt: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    imageFallback: '/torii.jpeg',
    imageDefault: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1600',
    title: '',
    description: '朱に染まらぬ、白い石鳥居。仙台東照宮の参道は、四百年前と変わらぬ静けさで、今日もこの町の入り口に立っています。',
    alt: '仙台東照宮の白い石鳥居と参道'
  },
  {
    id: 2,
    imageFallback: '/shoten1.jpeg',
    imageDefault: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1600',
    title: '',
    description: 'レトロな理容室のサインポール、すれ違う子どもたち。お宮町の通りを行き交う人々の笑顔が、この街の温かい日常を紡いでいます。',
    alt: 'お宮町の日常的な街並みとレトロな理容室ささげん'
  },
  {
    id: 3,
    imageFallback: '/coffee.png',
    imageDefault: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=1600',
    alt: '挽きたての珈琲',
    title: '',
    description: '挽きたての珈琲、蒸したての餅、店主のひと声。お宮町の一日は、そんな小さな温もりの積み重ねでできています。'
  }
];

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageSources, setImageSources] = useState<string[]>(
    SLIDES.map(slide => slide.imageFallback)
  );

  // Check if local files fail to load, and fallback to Unsplash images
  const handleImageError = (index: number) => {
    setImageSources(prev => {
      const updated = [...prev];
      updated[index] = SLIDES[index].imageDefault;
      return updated;
    });
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % SLIDES.length);
  };

  return (
    <div 
      className="relative w-full max-w-[1500px] aspect-video sm:rounded-none overflow-hidden bg-neutral-900 group"
      id="hero-slider-container"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full" id="slider-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            id={`slide-${currentIndex}`}
          >
            {/* Background Image Cover */}
            <img
              src={imageSources[currentIndex]}
              alt={SLIDES[currentIndex].alt}
              onError={() => handleImageError(currentIndex)}
              className="absolute inset-0 w-full h-full object-cover scale-105 select-none"
              style={{ filter: 'brightness(0.65)' }}
              referrerPolicy="no-referrer"
              id={`slide-img-${currentIndex}`}
            />

            {/* Centered Slide Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-6 sm:px-20 sm:py-16 z-20 select-none gap-4">
              <p 
                className="text-xs sm:text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed font-normal font-serif tracking-[0.1em] max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.85)' }}
                id={`slide-text-${currentIndex}`}
              >
                {SLIDES[currentIndex].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrow - Left */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/10 hover:bg-black/35 text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center cursor-pointer"
        aria-label="前へ"
        id="slider-prev-btn"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Navigation Arrow - Right */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/10 hover:bg-black/35 text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center cursor-pointer"
        aria-label="次へ"
        id="slider-next-btn"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5" id="slider-pagination">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`スライド ${index + 1} を表示`}
            id={`slider-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
};
