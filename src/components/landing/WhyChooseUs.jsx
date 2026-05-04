import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, MapPin, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const content = {
  en: {
    eyebrow: "Why Pulumi Hawaii",
    heading: "Local, Affordable & Fast",
    subheading: "Oʻahu homeowners choose us because we combine competitive pricing with same-week availability and a detail-first approach you won't find at big cleaning chains.",
    pillars: [
      {
        icon: DollarSign,
        title: "Competitive Pricing",
        desc: "Transparent, fair rates with no hidden fees. Free estimates on every job — no obligation.",
      },
      {
        icon: Clock,
        title: "24-Hour Response",
        desc: "Send us a message and we'll get back to you within 24 hours to confirm your booking.",
      },
      {
        icon: MapPin,
        title: "Oʻahu-Based & Local",
        desc: "We live and work here. We know every neighborhood from Kailua to Kapolei.",
      },
      {
        icon: ShieldCheck,
        title: "Detail-First Quality",
        desc: "Every visit follows a thorough checklist. No corners cut, no tasks skipped.",
      },
    ],
    cta: "Get a Free Estimate",
    note: "Serving condos, homes & vacation rentals across Oʻahu",
  },
  ja: {
    eyebrow: "プルミハワイを選ぶ理由",
    heading: "地元密着・リーズナブル・迅速対応",
    subheading: "オアフ島のオーナー様に選ばれる理由は、競争力ある価格と素早い対応、そして細部へのこだわりです。",
    pillars: [
      {
        icon: DollarSign,
        title: "リーズナブルな価格",
        desc: "隠れた費用なし、透明な料金体系。全案件に無料見積もりを提供します。",
      },
      {
        icon: Clock,
        title: "24時間以内にご返答",
        desc: "お問い合わせいただければ24時間以内にご返答し、予約を確認いたします。",
      },
      {
        icon: MapPin,
        title: "オアフ島在住・地元密着",
        desc: "カイルアからカポレイまで、島内全域に対応しています。",
      },
      {
        icon: ShieldCheck,
        title: "細部へのこだわり",
        desc: "毎回チェックリストに沿った丁寧な作業。手抜きは一切ありません。",
      },
    ],
    cta: "無料見積もりを依頼する",
    note: "オアフ島全域のコンドミニアム・一戸建て・バケーションレンタルに対応",
  },
};

export default function WhyChooseUs() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <section className="py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden relative">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-32 translate-y-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] text-primary-foreground/60 uppercase mb-3">
            {c.eyebrow}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light mb-5">
            {c.heading}
          </h2>
          <p className="font-body text-base text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
            {c.subheading}
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {c.pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300 cursor-default"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <pillar.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-body text-base font-semibold mb-2">{pillar.title}</h3>
              <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link to="/booking">
            <Button className="bg-white text-primary hover:bg-white/90 font-body rounded-full px-8 h-12 text-base group">
              {c.cta}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary-foreground/70 font-body text-sm">
            <div className="flex">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current text-yellow-300" />)}
            </div>
            <span>{c.note}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}