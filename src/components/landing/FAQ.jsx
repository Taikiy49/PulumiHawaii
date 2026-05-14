import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const faqs = [
  {
    q_en: "Do you bring your own cleaning supplies?",
    q_ja: "清掃用品はご持参いただけますか？",
    a_en: "Yes! We bring everything we need — professional-grade, eco-friendly products that are safe for your home and family. If you have a preferred product you'd like us to use, just let us know and we're happy to accommodate.",
    a_ja: "はい、すべてご持参します。プロ仕様の環境に優しい製品を使用しており、ご家族に安全です。ご希望の製品がある場合はお知らせください。喜んで対応いたします。",
  },
  {
    q_en: "I have pets — is that okay?",
    q_ja: "ペットがいますが、大丈夫ですか？",
    a_en: "Absolutely! We love animals and are experienced cleaning homes with pets. We ask that you let us know in advance so we can plan accordingly. If your pets are anxious around strangers, it helps to have them in a separate room or outside during the clean.",
    a_ja: "もちろんです！動物が大好きで、ペットのいるお家の清掃に慣れています。事前にお知らせいただければ、適切に対応いたします。知らない人が苦手なペットの場合は、清掃中は別の部屋や外にいてもらうとスムーズです。",
  },
  {
    q_en: "Do I need to be home during the cleaning?",
    q_ja: "清掃中は在宅する必要がありますか？",
    a_en: "Not at all! Many of our clients share a key, door code, or lockbox access. We treat every home with the utmost respect and care whether you're there or not. Off-island owners especially love our check-in service for this reason.",
    a_ja: "必要ありません！多くのお客様がカギやドアコード、ロックボックスでアクセスを共有してくださっています。在宅・不在に関わらず、お客様のお家を最大限の敬意と丁寧さで扱います。島外のオーナー様にも特に喜ばれているサービスです。",
  },
  {
    q_en: "How do I provide access if I'm off-island?",
    q_ja: "島外にいる場合、どのようにアクセスを提供すればよいですか？",
    a_en: "Easy — just share your door code, lockbox combination, or building entry instructions with us ahead of time. After every visit, we'll send you a summary with photos so you always know exactly how your property was left.",
    a_ja: "簡単です。事前にドアコード、ロックボックスの番号、または建物への入り方をお知らせください。毎回訪問後に写真付きのレポートをお送りしますので、物件の状況を常に確認していただけます。",
  },
  {
    q_en: "What's included in a regular cleaning vs. a deep clean?",
    q_ja: "定期清掃とディープクリーニングの違いは何ですか？",
    a_en: "Regular cleaning covers all the essentials — vacuuming, mopping, bathrooms, kitchen surfaces, dusting, and tidying. A deep clean goes further: inside appliances, baseboards, cabinet interiors, window sills, and those easy-to-miss spots. We recommend starting with a deep clean if it's your first time with us.",
    a_ja: "定期清掃は掃除機がけ、モップがけ、バスルーム、キッチン、ほこり取りなどの基本的な内容です。ディープクリーニングはさらに踏み込んで、家電内部、幅木、キャビネット内部、窓枠など見落としがちな場所も対応します。初回のお客様にはディープクリーニングをお勧めしています。",
  },
  {
    q_en: "Do you offer recurring discounts?",
    q_ja: "定期割引はありますか？",
    a_en: "Yes! We reward our regular clients with automatic discounts — 10% for monthly, 15% for bi-weekly, and 20% for weekly service. The more consistent the schedule, the more you save. You can select your preferred frequency when booking.",
    a_ja: "はい！定期ご利用のお客様には自動割引をご提供しています。月1回は10%割引、隔週は15%割引、毎週は20%割引です。スケジュールが一定であるほど、よりお得になります。ご予約時に頻度をお選びください。",
  },
  {
    q_en: "How do I pay?",
    q_ja: "支払い方法は？",
    a_en: "After we review your booking request, we'll send you a custom quote by email with a secure Stripe payment link. No payment is collected upfront — you only pay once you've received and approved your quote.",
    a_ja: "ご予約内容を確認後、安全なStripe決済リンク付きのお見積もりをメールでお送りします。事前のお支払いは不要です。お見積もりを受け取り、承認いただいてからのお支払いとなります。",
  },
];

export default function FAQ() {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">
            {lang === 'ja' ? 'よくある質問' : 'FAQ'}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground mb-4">
            {lang === 'ja' ? 'ご質問にお答えします' : "Questions? We've Got Answers."}
          </h2>
          <p className="font-body text-base text-muted-foreground">
            {lang === 'ja'
              ? 'ご不明な点はお気軽にお問い合わせください。'
              : "Don't see your question here? Feel free to reach out — we're always happy to help."}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="border border-border rounded-2xl overflow-hidden bg-card"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors pr-4">
                    {lang === 'ja' ? faq.q_ja : faq.q_en}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 font-body text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                        {lang === 'ja' ? faq.a_ja : faq.a_en}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}