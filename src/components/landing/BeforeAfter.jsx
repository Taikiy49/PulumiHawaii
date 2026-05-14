import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85&fit=crop',
    label: 'Kitchen',
    label_ja: 'キッチン',
  },
  {
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&fit=crop',
    label: 'Living Room',
    label_ja: 'リビング',
  },
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85&fit=crop',
    label: 'Bathroom',
    label_ja: 'バスルーム',
  },
  {
    src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=85&fit=crop',
    label: 'Bedroom',
    label_ja: 'ベッドルーム',
  },
];

export default function CleaningGallery() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {/* Large featured image */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={IMAGES[active].src}
                alt={IMAGES[active].label}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Label overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-6 py-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="font-body text-white text-lg font-medium"
                >
                  {language === 'ja' ? IMAGES[active].label_ja : IMAGES[active].label}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Thumbnail grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {IMAGES.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-xl overflow-hidden aspect-square shadow-lg transition-all duration-300 ${
                  active === i ? 'ring-2 ring-primary ring-offset-2' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                  <p className="font-body text-white text-xs font-medium">
                    {language === 'ja' ? img.label_ja : img.label}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${
                active === i ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-border hover:bg-primary/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}