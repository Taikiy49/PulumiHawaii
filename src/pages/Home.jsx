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

  // Update document title and meta tags
  useEffect(() => {
    document.title = 'Pulumi Hawaii — Premium Cleaning & Property Care on Oʻahu | Honolulu';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Trusted premium cleaning and property care services for Oʻahu. Regular cleaning, deep cleaning, inspections, and care services. Free estimates within 24 hours.');
    }
    
    // Scroll to section if requested
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <main className="min-h-screen bg-background" role="main">
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="trust">
        <TrustBar />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="plans">
        <RecurringPlans />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="before-after">
        <BeforeAfter />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="why-choose">
        <WhyChooseUs />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
      <ChatWidget />
    </main>
  );
}