import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const fallbackTestimonials = [
  {
    client_name: "Sarah M.",
    neighborhood: "Kakaʻako",
    content_en: "Shoko's attention to detail is extraordinary. Our condo has never felt so clean and fresh. She treats our home with the same care as her own.",
    content_ja: "翔子さんの細部へのこだわりは素晴らしいです。コンドミニアムがこれほど清潔で新鮮に感じたことはありません。",
    rating: 5,
    service_type: "regular_cleaning",
  },
  {
    client_name: "James K.",
    neighborhood: "Ward Village",
    content_en: "We manage several vacation rentals and Pulumi has been incredible. Guests consistently comment on how immaculate the units are upon arrival.",
    content_ja: "複数のバケーションレンタルを管理していますが、プルミは素晴らしいです。ゲストは到着時のユニットの清潔さを常に称賛してくれます。",
    rating: 5,
    service_type: "deep_cleaning",
  },
  {
    client_name: "Yuki T.",
    neighborhood: "Ala Moana",
    content_en: "As a Japanese-speaking homeowner, having bilingual service means everything. Shoko understands exactly what I need without any communication barriers.",
    content_ja: "日本語を話すオーナーとして、バイリンガルサービスは全てを意味します。翔子さんはコミュニケーションの壁なく私のニーズを正確に理解してくれます。",
    rating: 5,
    service_type: "inspection",
  },
  {
    client_name: "Michael R.",
    neighborhood: "Kahala",
    content_en: "The property check-in service gives me complete peace of mind while I'm on the mainland. Professional photos and detailed reports every time.",
    content_ja: "本土にいる間、物件チェックインサービスは完全な安心感を与えてくれます。毎回プロの写真と詳細な報告書をいただけます。",
    rating: 5,
    service_type: "inspection",
  },
];

export default function Testimonials() {
  const { t, lang } = useLanguage();

  const { data: dbTestimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">
            {t('testimonials.subtitle')}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground">
            {t('testimonials.title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow duration-500"
            >
              <Quote className="w-8 h-8 text-primary/15 mb-4" />
              <p className="font-body text-base text-foreground leading-relaxed mb-6">
                {lang === 'ja' && testimonial.content_ja ? testimonial.content_ja : testimonial.content_en}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {testimonial.client_name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {testimonial.neighborhood} Resident
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}