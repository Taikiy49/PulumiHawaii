import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, ClipboardCheck, Heart } from 'lucide-react';

const SERVICES = [
  { id: 'regular_cleaning', label: 'Regular Cleaning', icon: Sparkles },
  { id: 'deep_cleaning', label: 'Deep Cleaning', icon: Droplets },
  { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
  { id: 'care_services', label: 'Care Services', icon: Heart },
];

const QUICK_ACTIONS = [
  { label: 'Book a Service', action: 'book' },
  { label: 'View Pricing', action: 'pricing' },
  { label: 'Contact Us', action: 'contact' },
];

export default function ChatQuickActions({ onSelectService, onSelectAction, isVisible }) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-3 px-4 py-3"
    >
      {/* Services */}
      <div>
        <p className="text-xs font-body text-muted-foreground mb-2 uppercase tracking-wider">Services</p>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES.map(service => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectService(service.label)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-body text-foreground">{service.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-body text-muted-foreground mb-2 uppercase tracking-wider">Quick Links</p>
        <div className="flex gap-2">
          {QUICK_ACTIONS.map(action => (
            <motion.button
              key={action.action}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectAction(action.action)}
              className="flex-1 px-3 py-2 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-secondary/20 hover:border-secondary/40 transition-colors text-xs font-body text-foreground"
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}