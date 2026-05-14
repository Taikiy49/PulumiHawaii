import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Home, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const stats = [
  { icon: ShieldCheck, en: 'Locally Owned & Operated', ja: '地元経営' },
  { icon: Star,        en: 'Fully Insured LLC',         ja: '保険加入済みLLC' },
  { icon: Home,        en: 'Regular cleaning from $120', ja: '定期清掃 $120〜' },
  { icon: Clock,       en: 'Same-Week Availability',    ja: '今週中の対応可能' },
];

export default function TrustBar() {
  const { lang } = useLanguage();

  return (
    <section className="bg-primary py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 divide-y-2 lg:divide-y-0 lg:divide-x divide-white/20">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-center justify-center gap-3 py-3 lg:py-0 lg:px-6"
            >
              <s.icon className="w-5 h-5 text-white/80 flex-shrink-0" />
              <span className="font-body text-sm font-medium text-white/90">
                {lang === 'ja' ? s.ja : s.en}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}