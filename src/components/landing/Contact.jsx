import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const { t } = useLanguage();

  const contactItems = [
    { icon: Phone, label: t('contact.phone'), value: '(808) 227-7729', href: 'tel:8082277729' },
    { icon: Mail, label: t('contact.email'), value: 'pulumihawaii@gmail.com', href: 'mailto:pulumihawaii@gmail.com' },
    { icon: MapPin, label: t('contact.address'), value: t('contact.addressValue'), href: '#' },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">
              {t('contact.title')}
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-light text-foreground mb-4">
              {t('contact.subtitle')}
            </h2>

            <div className="space-y-6 mt-10">
              {contactItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="font-body text-base text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right side - CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-primary rounded-3xl p-10 lg:p-14 text-primary-foreground overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative">
              <h3 className="font-heading text-3xl font-light mb-4">
                {t('contact.requestEstimate')}
              </h3>
              <p className="font-body text-base text-primary-foreground/80 mb-2 leading-relaxed">
                {t('footer.pricing')}
              </p>
              <p className="font-body text-sm text-primary-foreground/60 mb-8">
                Direct booking is the fastest way to secure your date.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking">
                  <Button className="bg-white text-primary hover:bg-white/90 font-body rounded-full px-8 h-12 text-base group">
                    {t('nav.booking')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}