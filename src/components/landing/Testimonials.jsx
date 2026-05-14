import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const fallbackTestimonials = [
  {
    client_name: "Lisa T.",
    neighborhood: "Kakaʻako",
    content_en: "I've tried a few cleaning services in Honolulu and Pulumi is by far the best. Shoko is thorough, on time, and my condo actually sparkles after every visit. Worth every penny.",
    content_ja: "ホノルルでいくつかのクリーニングサービスを試しましたが、プルミが断然最高です。翔子さんは丁寧で時間通りに来てくださり、毎回コンドミニアムが輝くようです。",
    rating: 5,
    service_type: "regular_cleaning",
  },
  {
    client_name: "Kevin & Dana M.",
    neighborhood: "Ward Village",
    content_en: "We have Pulumi come every two weeks and it's been a game changer for our family. The kids' rooms, the kitchen — everything is spotless. Shoko genuinely cares about doing a great job.",
    content_ja: "隔週でプルミに来てもらっており、家族にとって大きな変化をもたらしました。子供部屋もキッチンも、すべてが清潔です。翔子さんは本当に仕事に誇りを持っています。",
    rating: 5,
    service_type: "regular_cleaning",
  },
  {
    client_name: "Yuki N.",
    neighborhood: "Ala Moana",
    content_en: "日本語でやり取りできてとても助かりました。細かいところまで丁寧に掃除してくださり、アパートが生まれ変わったようです。また必ずお願いします！",
    content_ja: "日本語でやり取りできてとても助かりました。細かいところまで丁寧に掃除してくださり、アパートが生まれ変わったようです。また必ずお願いします！",
    rating: 5,
    service_type: "deep_cleaning",
  },
  {
    client_name: "Robert C.",
    neighborhood: "Kahala",
    content_en: "I live on the mainland and Shoko does check-ins on my Honolulu condo. She sends photos, flags anything that needs attention, and I never have to worry. Completely reliable.",
    content_ja: "本土に住んでおり、翔子さんにホノルルのコンドミニアムのチェックインをお願いしています。写真を送ってくれて、問題があれば報告してくれます。完全に信頼できます。",
    rating: 5,
    service_type: "inspection",
  },
  {
    client_name: "Malia K.",
    neighborhood: "Mānoa",
    content_en: "Hired Pulumi for a move-out deep clean and got my full deposit back — first time that's ever happened! The place looked better than when I moved in. Highly recommend.",
    content_ja: "退去時のディープクリーニングをお願いしたところ、敷金が全額戻ってきました。引っ越してきた時より綺麗になっていました！強くお勧めします。",
    rating: 5,
    service_type: "deep_cleaning",
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