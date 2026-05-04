import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ServiceStep from '@/components/booking/ServiceStep';
import DateTimeStep from '@/components/booking/DateTimeStep';
import DetailsStep from '@/components/booking/DetailsStep';
import ChatWidget from '@/components/chat/ChatWidget';

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

export default function Booking() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const createBooking = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = () => {
    createBooking.mutate({
      ...formData,
      service_type: selectedService,
      addons: selectedAddons,
      preferred_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      preferred_time: selectedTime,
      language: lang,
      status: 'pending',
    });
  };

  const steps = [t('booking.step1'), t('booking.step2'), t('booking.step3'), t('booking.step4')];

  const canProceed = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return !!formData.client_name && !!formData.client_email;
    return true;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-light text-foreground mb-4">
              {t('booking.success')}
            </h2>
            <Link to="/">
              <Button variant="outline" className="rounded-full font-body mt-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('nav.home')}
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] text-primary uppercase mb-3">
              <Sparkles className="w-3 h-3 inline mr-1" />
              {t('hero.tagline')}
            </p>
            <h1 className="font-heading text-4xl lg:text-5xl font-light text-foreground mb-3">
              {t('booking.title')}
            </h1>
            <p className="font-body text-base text-muted-foreground">
              {t('booking.subtitle')}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body transition-all ${
                    i <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="hidden sm:block text-xs font-body text-muted-foreground">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl border border-border p-8 lg:p-12 shadow-sm"
            >
              {step === 0 && (
                <ServiceStep
                  selectedService={selectedService}
                  onSelect={setSelectedService}
                  selectedAddons={selectedAddons}
                  onToggleAddon={toggleAddon}
                />
              )}
              {step === 1 && (
                <DateTimeStep
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              )}
              {step === 2 && (
                <DetailsStep formData={formData} onChange={setFormData} />
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="font-heading text-2xl font-light text-foreground">{t('booking.step4')}</h3>
                  <div className="space-y-4 font-body text-sm">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">{t('booking.step1')}</span>
                      <span className="font-medium text-foreground">{serviceLabels[selectedService]}</span>
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Add-ons</span>
                        <span className="font-medium text-foreground text-right">{selectedAddons.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">{t('booking.step2')}</span>
                      <span className="font-medium text-foreground">
                        {selectedDate && format(selectedDate, 'MMM d, yyyy')} — {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">{t('booking.name')}</span>
                      <span className="font-medium text-foreground">{formData.client_name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">{t('booking.email')}</span>
                      <span className="font-medium text-foreground">{formData.client_email}</span>
                    </div>
                    {formData.address && (
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">{t('booking.address')}</span>
                        <span className="font-medium text-foreground">{formData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="rounded-full font-body h-12 px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {lang === 'ja' ? '戻る' : 'Back'}
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-body h-12 px-6"
              >
                {lang === 'ja' ? '次へ' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createBooking.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-body h-12 px-8"
              >
                {createBooking.isPending ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {t('booking.submit')}
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
}