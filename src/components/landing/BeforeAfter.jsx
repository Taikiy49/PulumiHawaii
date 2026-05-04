import React, { useState, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function BeforeAfter() {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => { if (isDragging.current) handleMove(e.clientX); };
  const handleTouchMove = (e) => { handleMove(e.touches[0].clientX); };

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">
            {t('transformation.subtitle')}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground">
            {t('transformation.title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            {/* After (background) */}
            <img
              src="https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/edfb84a01_generated_f0ce72d8.png"
              alt="After cleaning"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before (foreground, clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/da7cc88dd_generated_268b108f.png"
                alt="Before cleaning"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${containerRef.current?.offsetWidth || 1000}px`, maxWidth: 'none' }}
              />
            </div>

            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-lg"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-primary/60" />
                  <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-primary/60" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-foreground/70 text-white text-sm font-body backdrop-blur-sm">
              {t('transformation.before')}
            </div>
            <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-primary/90 text-white text-sm font-body backdrop-blur-sm">
              {t('transformation.after')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}