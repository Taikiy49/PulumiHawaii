import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, ClipboardCheck, Heart, Check } from 'lucide-react';

const serviceIcons = {
  regular_cleaning: Sparkles,
  deep_cleaning: Droplets,
  inspection: ClipboardCheck,
  care_services: Heart,
};

const serviceKeys = {
  regular_cleaning: 'regular',
  deep_cleaning: 'deep',
  inspection: 'inspection',
  care_services: 'care',
};

export default function ServiceStep({ selectedService, onSelect, selectedAddons, onToggleAddon }) {
  const { t } = useLanguage();
  const services = ['regular_cleaning', 'deep_cleaning', 'inspection', 'care_services'];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading text-2xl font-light text-foreground mb-2">
          {t('booking.selectService')}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {services.map(service => {
            const Icon = serviceIcons[service];
            const key = serviceKeys[service];
            const isSelected = selectedService === service;

            return (
              <motion.button
                key={service}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(service)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/20 bg-card'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-body text-base font-semibold text-foreground">
                      {t(`services.${key}.title`)}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
                      {t(`services.${key}.desc`)}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Addons */}
      <div>
        <h3 className="font-heading text-2xl font-light text-foreground mb-2">
          {t('booking.selectAddons')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {t('addons.items').map((addon, i) => {
            const isSelected = selectedAddons.includes(addon);
            return (
              <button
                key={i}
                onClick={() => onToggleAddon(addon)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm font-body ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'border border-border'
                }`}>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span>{addon}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}