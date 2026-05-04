import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const content = {
  en: {
    line1: "Book online in minutes! 🌺",
    line2: "Just pick a time from our availability — we'll be there.",
    cta: "Chat to Book Now",
  },
  ja: {
    line1: "今すぐ簡単にご予約！🌺",
    line2: "空き時間を選ぶだけ — すぐにお伺いします。",
    cta: "チャットで予約する",
  },
};

export default function ChatPromoPopup({ onOpen }) {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after 4 seconds
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleCta = () => {
    setVisible(false);
    setDismissed(true);
    onOpen();
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="w-72 bg-card border border-border rounded-2xl shadow-xl p-4 relative"
        >
          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-foreground leading-snug">{c.line1}</p>
              <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{c.line2}</p>
            </div>
          </div>

          <button
            onClick={handleCta}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-2 text-sm font-body font-medium hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {c.cta}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}