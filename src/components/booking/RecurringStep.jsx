import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, Check, Tag } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const PLANS = [
  { key: 'one_time', discount: 0 },
  { key: 'monthly', discount: 10 },
  { key: 'biweekly', discount: 15 },
  { key: 'weekly', discount: 20 },
];

const content = {
  en: {
    title: 'How often would you like service?',
    subtitle: 'Recurring plans save you money — cancel anytime.',
    one_time: { label: 'One-Time', desc: 'Single visit, no commitment', badge: null },
    monthly: { label: 'Monthly', desc: 'Once a month', badge: 'Save 10%' },
    biweekly: { label: 'Bi-Weekly', desc: 'Twice a month', badge: 'Save 15% · Most Popular' },
    weekly: { label: 'Weekly', desc: 'Every week', badge: 'Save 20%' },
    savings: (pct) => `Your quote will reflect a ${pct}% recurring discount.`,
  },
  ja: {
    title: 'サービスの頻度を選んでください',
    subtitle: '定期プランはお得です — いつでもキャンセル可能。',
    one_time: { label: '1回のみ', desc: '1回限りのご利用', badge: null },
    monthly: { label: '月1回', desc: '月に1回', badge: '10%割引' },
    biweekly: { label: '隔週', desc: '月に2回', badge: '15%割引・人気No.1' },
    weekly: { label: '毎週', desc: '毎週', badge: '20%割引' },
    savings: (pct) => `お見積もりに${pct}%の定期割引が適用されます。`,
  },
};

export default function RecurringStep({ frequency, onSelect }) {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;
  const selected = PLANS.find(p => p.key === frequency) || PLANS[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-2xl font-light text-foreground mb-1">{c.title}</h3>
        <p className="font-body text-sm text-muted-foreground">{c.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const info = c[plan.key];
          const isSelected = frequency === plan.key;

          return (
            <motion.button
              key={plan.key}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(plan.key)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {plan.discount === 0 ? <Check className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-body text-base font-semibold text-foreground">{info.label}</p>
                    <p className="font-body text-sm text-muted-foreground">{info.desc}</p>
                  </div>
                </div>
                {info.badge && (
                  <span className="font-body text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {info.badge}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected.discount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 bg-green-50 border border-green-200 rounded-xl"
        >
          <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="font-body text-sm text-green-800 font-medium">{c.savings(selected.discount)}</p>
        </motion.div>
      )}
    </div>
  );
}