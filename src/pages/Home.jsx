import React from 'react';
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
import TrustBar from '@/components/landing/TrustBar';
import RecurringPlans from '@/components/landing/RecurringPlans';

export default function Home() {
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
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}