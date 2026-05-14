import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Identity card replacing photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-xl p-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="font-heading text-3xl text-primary">S</span>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-foreground">Shoko</p>
                <p className="font-body text-sm text-muted-foreground mt-1">{t('about.role')}</p>
                <p className="font-body text-xs text-primary mt-2 tracking-wider uppercase">Pulumi Hawaii, LLC</p>
              </div>
              <div className="border-t border-border pt-6">
                <p className="font-heading text-xl italic text-muted-foreground leading-snug">
                  "Every home deserves to feel cared for."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">{t('about.subtitle')}</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground mb-8 leading-tight">
              {t('about.title')}
            </h2>
            <div className="space-y-5 font-body text-base text-muted-foreground leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>

            {/* Promise */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="font-body text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                {t('promise.title')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t('promise.items').map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}