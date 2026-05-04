import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, ClipboardCheck, Heart, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const serviceImages = [
  "https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/7d906dde4_generated_ebcd3554.png",
  "https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/ed62353c1_generated_32ad972a.png",
  "https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/493c54bda_generated_1cc7e10d.png",
  "https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/904def86f_generated_cd62b700.png",
];

const serviceIcons = [Sparkles, Droplets, ClipboardCheck, Heart];
const serviceKeys = ['regular', 'deep', 'inspection', 'care'];

export default function Services() {
  const { t } = useLanguage();
  const [activeService, setActiveService] = useState(null);

  return (
    <section id="services" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">
            {t('hero.tagline')}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceKeys.map((key, i) => {
            const Icon = serviceIcons[i];
            const isActive = activeService === i;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-colors duration-300 cursor-pointer"
                onClick={() => setActiveService(isActive ? null : i)}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={serviceImages[i]}
                    alt={t(`services.${key}.title`)}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {t(`services.${key}.title`)}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                    {t(`services.${key}.desc`)}
                  </p>
                  <button className="flex items-center gap-1 text-sm font-body text-primary font-medium">
                    {t('services.whatsIncluded')}
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expandable includes */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-border">
                        <ul className="space-y-2">
                          {t(`services.${key}.includes`).map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/booking">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                {t('hero.cta')}
              </Button>
            </motion.div>
          </Link>
          <a href="mailto:pulumihawaii@gmail.com">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" className="font-body rounded-full px-8 h-12 text-base">
                Contact Now
              </Button>
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}