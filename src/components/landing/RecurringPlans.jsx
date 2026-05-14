import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';

const plans = [
  {
    key: 'monthly',
    discount: 10,
    color: 'border-border',
    badge: null,
  },
  {
    key: 'biweekly',
    discount: 15,
    color: 'border-primary',
    badge: true, // most popular
  },
  {
    key: 'weekly',
    discount: 20,
    color: 'border-border',
    badge: null,
  },
];

const content = {
  en: {
    eyebrow: 'Save More, Stress Less',
    title: 'Recurring Plans',
    subtitle: 'Lock in consistent service and save up to 20%. Cancel anytime.',
    monthly: { label: 'Monthly', freq: '1× per month', perks: ['10% off every visit', 'Priority scheduling', 'Consistent team'] },
    biweekly: { label: 'Bi-Weekly', freq: '2× per month', perks: ['15% off every visit', 'Priority scheduling', 'Consistent team', 'Most popular plan'] },
    weekly: { label: 'Weekly', freq: 'Every week', perks: ['20% off every visit', 'Priority scheduling', 'Consistent team', 'Best for busy homes'] },
    cta: 'Book a Recurring Plan',
    popular: 'Most Popular',
    noContract: '✓ No long-term contract · Cancel anytime',
  },
  ja: {
    eyebrow: '節約して、もっと楽に',
    title: '定期プラン',
    subtitle: '最大20%割引の定期プランで、いつも清潔な住まいを。いつでもキャンセル可能。',
    monthly: { label: '月1回プラン', freq: '月1回', perks: ['毎回10%割引', '優先スケジューリング', '担当者固定'] },
    biweekly: { label: '隔週プラン', freq: '月2回', perks: ['毎回15%割引', '優先スケジューリング', '担当者固定', '最も人気のプラン'] },
    weekly: { label: '毎週プラン', freq: '毎週', perks: ['毎回20%割引', '優先スケジューリング', '担当者固定', '忙しいご家庭に最適'] },
    cta: '定期プランを予約する',
    popular: '人気No.1',
    noContract: '✓ 長期契約不要・いつでもキャンセル可能',
  },
};

export default function RecurringPlans() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <section id="plans" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3 flex items-center justify-center gap-2">
            <Repeat className="w-3 h-3" />
            {c.eyebrow}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground mb-4">{c.title}</h2>
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">{c.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => {
            const info = c[plan.key];
            const isPopular = !!plan.badge;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative bg-card rounded-3xl border-2 p-8 flex flex-col ${
                  isPopular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground font-body text-xs font-semibold px-4 py-1.5 rounded-full">
                      {c.popular}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-light text-foreground mb-1">{info.label}</h3>
                  <p className="font-body text-sm text-muted-foreground">{info.freq}</p>
                </div>

                <div className="mb-6">
                  <span className="font-heading text-5xl font-light text-primary">{plan.discount}%</span>
                  <span className="font-body text-base text-muted-foreground ml-2">{lang === 'ja' ? '割引' : 'off'}</span>
                  <p className="font-body text-xs text-muted-foreground mt-1">{lang === 'ja' ? '毎回の訪問ごと' : 'every visit'}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {info.perks.map((perk, j) => (
                    <li key={j} className="flex items-center gap-2.5 font-body text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link to="/booking">
                  <Button
                    className={`w-full rounded-full h-11 font-body text-sm group ${
                      isPopular
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
                  >
                    {c.cta}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center font-body text-sm text-muted-foreground mt-8"
        >
          {c.noContract}
        </motion.p>
      </div>
    </section>
  );
}