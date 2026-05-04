import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight, Sparkles, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/69f84d2fdf4aa6c0a11ac115/7912d27d3_generated_c1916de8.png"
          alt="Luxury Hawaiian condominium with ocean views"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-2xl">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              {t('hero.tagline')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] text-foreground mb-6"
          >
            {t('hero.subtitle')}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-body text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/booking">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body text-base rounded-full px-8 h-14 group">
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:8082277729">
              <Button variant="outline" className="font-body text-base rounded-full px-8 h-14 border-border hover:bg-secondary">
                <Phone className="w-4 h-4 mr-2" />
                {t('hero.callCta')}
              </Button>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: MapPin, label: t('hero.badge1') },
              { icon: Sparkles, label: t('hero.badge2') },
              { icon: Clock, label: t('hero.badge3') },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                <badge.icon className="w-4 h-4 text-primary" />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}