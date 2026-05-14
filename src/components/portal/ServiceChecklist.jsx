import React, { useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHECKLISTS = {
  regular_cleaning: {
    label: 'Regular Cleaning',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    accent: 'text-blue-600',
    emoji: '🧹',
    sections: [
      {
        title: 'All Rooms',
        items: ['Dust all surfaces & furniture', 'Vacuum carpets & rugs', 'Mop hard floors', 'Empty trash cans', 'Wipe light switches & door handles'],
      },
      {
        title: 'Kitchen',
        items: ['Clean countertops & backsplash', 'Wipe exterior of appliances', 'Clean sink & faucets', 'Wipe stovetop', 'Clean microwave interior & exterior'],
      },
      {
        title: 'Bathrooms',
        items: ['Scrub toilet, sink & shower/tub', 'Clean mirrors', 'Wipe counters & fixtures', 'Replace towels (if provided)', 'Restock toiletries (if provided)'],
      },
      {
        title: 'Bedrooms',
        items: ['Make beds & change linens (if provided)', 'Dust nightstands & dressers', 'Vacuum under bed', 'Tidy visible surfaces'],
      },
    ],
  },
  deep_cleaning: {
    label: 'Deep Cleaning',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    accent: 'text-purple-600',
    emoji: '✨',
    sections: [
      {
        title: 'Everything in Regular Cleaning, PLUS:',
        items: [],
      },
      {
        title: 'Kitchen Deep Clean',
        items: ['Clean inside oven & range hood', 'Degrease stovetop grates', 'Clean inside & behind refrigerator', 'Wipe inside cabinets & drawers', 'Descale sink & faucets'],
      },
      {
        title: 'Bathroom Deep Clean',
        items: ['Scrub grout & tile', 'Descale showerhead & faucets', 'Clean behind toilet', 'Wipe inside cabinets', 'Deep clean exhaust fan'],
      },
      {
        title: 'Whole Home',
        items: ['Wipe baseboards & trim', 'Clean window sills & tracks', 'Dust ceiling fans & light fixtures', 'Wipe walls for scuffs & marks', 'Clean inside windows (interior)'],
      },
    ],
  },
  inspection: {
    label: 'Inspection & Check-Ins',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    accent: 'text-amber-600',
    emoji: '🔍',
    sections: [
      {
        title: 'Property Check',
        items: ['Inspect for leaks, damage, or maintenance issues', 'Test smoke & CO detectors', 'Check all door & window locks', 'Inspect HVAC filters', 'Check water heater & utility connections'],
      },
      {
        title: 'Exterior',
        items: ['Check roof & gutters (visual)', 'Inspect entry points', 'Check yard & landscaping condition', 'Look for pest activity signs'],
      },
      {
        title: 'Reporting',
        items: ['Photo documentation of any issues', 'Written condition report', 'Immediate alert for urgent issues', 'Recommendations for maintenance'],
      },
    ],
  },
  care_services: {
    label: 'Care Services',
    color: 'bg-green-50 border-green-200 text-green-800',
    accent: 'text-green-600',
    emoji: '🌿',
    sections: [
      {
        title: 'Property Care',
        items: ['Water indoor & outdoor plants', 'Collect mail & packages', 'Take out & bring in trash bins', 'Check for any deliveries or issues'],
      },
      {
        title: 'Maintenance Checks',
        items: ['Verify A/C & heating settings', 'Run faucets to prevent stagnation', 'Flush toilets', 'Check for unusual odors or moisture'],
      },
      {
        title: 'Communication',
        items: ['Photo update after each visit', 'Report any concerns immediately', 'Confirm all is secure on departure'],
      },
    ],
  },
};

const SERVICE_TYPES = Object.keys(CHECKLISTS);

export default function ServiceChecklist() {
  const [active, setActive] = useState('regular_cleaning');
  const [expandedSection, setExpandedSection] = useState(null);

  const checklist = CHECKLISTS[active];

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="font-heading text-xl font-semibold text-foreground">Our Service Standards</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          See exactly what's included with every visit — no surprises.
        </p>
      </div>

      {/* Service Type Tabs */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto border-b border-border scrollbar-none">
        {SERVICE_TYPES.map(type => {
          const c = CHECKLISTS[type];
          const isActive = active === type;
          return (
            <button
              key={type}
              onClick={() => { setActive(type); setExpandedSection(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                isActive
                  ? `${c.color} border-current`
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Checklist */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-3"
        >
          {checklist.sections.map((section, i) => (
            <div key={i} className={`rounded-xl border overflow-hidden ${checklist.color}`}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => setExpandedSection(expandedSection === i ? null : i)}
              >
                <span className="font-body text-sm font-semibold">{section.title}</span>
                <div className="flex items-center gap-2">
                  {section.items.length > 0 && (
                    <span className="font-body text-xs opacity-60">{section.items.length} items</span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === i ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {(expandedSection === i || section.items.length === 0) && section.items.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 border-t border-current/10 pt-3">
                      {section.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${checklist.accent}`} />
                          <span className="font-body text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <p className="font-body text-xs text-muted-foreground text-center pt-2">
            Every visit is documented with photos and notes in your portal above.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}