import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-semibold tracking-wide mb-2">
              PULUMI HAWAII
            </h3>
            <p className="font-body text-sm text-background/60 mb-4">{t('footer.tagline')}</p>
            <p className="font-body text-sm text-background/50 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold tracking-wider uppercase mb-4 text-background/80">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3 font-body text-sm text-background/50">
              <li><a href="/#services" className="hover:text-background transition-colors">{t('nav.services')}</a></li>
              <li><a href="/#about" className="hover:text-background transition-colors">{t('nav.about')}</a></li>
              <li><a href="/#testimonials" className="hover:text-background transition-colors">{t('nav.testimonials')}</a></li>
              <li><Link to="/booking" className="hover:text-background transition-colors">{t('nav.booking')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-sm font-semibold tracking-wider uppercase mb-4 text-background/80">
              {t('footer.getInTouch')}
            </h4>
            <ul className="space-y-3 font-body text-sm text-background/50">
              <li>
                <a href="mailto:pulumihawaii@gmail.com" className="hover:text-background transition-colors">
                  pulumihawaii@gmail.com
                </a>
              </li>
              <li>{t('contact.addressValue')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-background/40">
            {t('footer.rights')}
          </p>
          <p className="font-body text-xs text-background/40">
            {t('footer.pricing')}
          </p>
        </div>
      </div>
    </footer>
  );
}