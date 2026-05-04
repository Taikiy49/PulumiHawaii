import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { key: 'services', href: '/#services' },
  { key: 'about', href: '/#about' },
  { key: 'testimonials', href: '/#testimonials' },
  { key: 'contact', href: '/#contact' },
];

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-heading text-2xl font-semibold tracking-wide text-foreground">
              PULUMI
            </span>
            <span className="hidden sm:block text-xs tracking-[0.3em] text-muted-foreground uppercase font-body">
              Hawaii
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
              >
                {t(`nav.${link.key}`)}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:border-primary/30 transition-all text-sm font-body"
            >
              <span className={`transition-opacity ${lang === 'en' ? 'opacity-100 font-semibold' : 'opacity-50'}`}>EN</span>
              <span className="text-border mx-1">|</span>
              <span className={`transition-opacity font-jp ${lang === 'ja' ? 'opacity-100 font-semibold' : 'opacity-50'}`}>JP</span>
            </button>

            <a href="tel:8082277729" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-body">(808) 227-7729</span>
            </a>

            <Link to="/booking">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body text-sm tracking-wide rounded-full px-6 h-11">
                {t('nav.booking')}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleLang}
              className="px-2 py-1 rounded border border-border text-xs font-body"
            >
              {lang === 'en' ? 'JP' : 'EN'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map(link => (
                <button
                  key={link.key}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-base font-body text-foreground py-2"
                >
                  {t(`nav.${link.key}`)}
                </button>
              ))}
              <hr className="border-border" />
              <Link to="/booking" className="block">
                <Button className="w-full bg-primary text-primary-foreground rounded-full h-12 font-body">
                  {t('nav.booking')}
                </Button>
              </Link>
              <a href="tel:8082277729" className="flex items-center gap-2 text-muted-foreground py-2 font-body">
                <Phone className="w-4 h-4" />
                (808) 227-7729
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}