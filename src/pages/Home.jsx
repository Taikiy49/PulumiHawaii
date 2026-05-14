import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import BeforeAfter from '@/components/landing/BeforeAfter';
import Testimonials from '@/components/landing/Testimonials';
import WhyChooseUs from '@/components/landing/WhyChooseUs';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import FAQ from '@/components/landing/FAQ';
import TrustBar from '@/components/landing/TrustBar';
import RecurringPlans from '@/components/landing/RecurringPlans';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <Services />
      <RecurringPlans />
      <About />
      <BeforeAfter />
      <Testimonials />
      <WhyChooseUs />
      <FAQ />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}