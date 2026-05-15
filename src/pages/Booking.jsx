import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ServiceStep from '@/components/booking/ServiceStep';
import DateTimeStep from '@/components/booking/DateTimeStep';
import DetailsStep from '@/components/booking/DetailsStep';
import RecurringStep from '@/components/booking/RecurringStep';
import ChatWidget from '@/components/chat/ChatWidget';

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

const frequencyLabels = {
  en: { one_time: 'One-Time', weekly: 'Weekly (−20%)', biweekly: 'Bi-Weekly (−15%)', monthly: 'Monthly (−10%)' },
  ja: { one_time: '1回のみ', weekly: '毎週 (−20%)', biweekly: '隔週 (−15%)', monthly: '月1回 (−10%)' },
};

const DISCOUNT_MAP = { one_time: 0, monthly: 10, biweekly: 15, weekly: 20 };

export default function Booking() {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(0);

  // Update meta tags on page load
  useEffect(() => {
    document.title = lang === 'ja' ? 'ご予約 — Pulumi Hawaii' : 'Book Your Service — Pulumi Hawaii';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 
        lang === 'ja' 
          ? 'オアフ島での清掃サービスをご予約ください。定期清掃から深い清掃まで、今すぐ予約できます。'
          : 'Book your cleaning service on Oahu. Choose from regular cleaning, deep cleaning, inspections, and more. Get a free quote in 24 hours.'
      );
    }
  }, [lang]);

  // Check for Stripe return
  const urlParams = new URLSearchParams(window.location.search);
  const paymentResult = urlParams.get('payment'); // 'success' or 'cancelled'
  const [selectedService, setSelectedService] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [frequency, setFrequency] = useState('one_time');
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

  const discount = DISCOUNT_MAP[frequency] || 0;

  const handleSubmit = () => {
    createBooking.mutate({
      ...formData,
      service_type: selectedService,
      addons: selectedAddons,
      preferred_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      preferred_time: selectedTime,
      recurring_frequency: frequency,
      recurring_discount: discount,
      language: lang,
      status: 'pending',
    });
  };

  const stepLabels = {
    en: ['Service', 'Frequency', 'Date & Time', 'Details', 'Review'],
    ja: ['サービス', '頻度', '日時', '情報', '確認'],
  };
  const steps = stepLabels[lang] || stepLabels.en;

  const canProceed = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!frequency;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return !!formData.client_name && !!formData.client_email && !!formData.address;
    return true;
  };

  // Stripe payment success return
  if (paymentResult === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-heading text-3xl font-light text-foreground mb-3">
              {lang === 'ja' ? 'お支払い完了！' : 'Payment Confirmed! 🎉'}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8">
              {lang === 'ja'
                ? 'お支払いを確認しました。確認メールをご確認ください。当日スタッフがお伺いします！'
                : "Your payment was received and your booking is officially confirmed. Check your email for a confirmation — we'll see you soon!"}
            </p>
            <Link to="/">
              <Button className="rounded-full font-body bg-primary hover:bg-primary/90">
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

  // Stripe payment cancelled return
  if (paymentResult === 'cancelled') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="font-heading text-3xl font-light text-foreground mb-3">
              {lang === 'ja' ? 'お支払いがキャンセルされました' : 'Payment Not Completed'}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8">
              {lang === 'ja'
                ? 'お支払いはキャンセルされました。お見積もりメールのリンクからいつでもお支払いいただけます。'
                : "No worries — your booking request is still saved. Use the payment link in your quote email to complete payment whenever you're ready."}
            </p>
            <Link to="/">
              <Button variant="outline" className="rounded-full font-body">
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
            <h2 className="font-heading text-3xl font-light text-foreground mb-3">
              {t('booking.success')}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8">
              {lang === 'ja'
                ? '確認メールをお待ちください。お見積もりを送付後、お支払いのご案内をいたします。'
                : "We'll review your request and send you a custom quote with a payment link shortly."}
            </p>
            {discount > 0 && (
              <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="font-body text-sm text-green-800 font-medium">
                  {lang === 'ja' ? `${discount}%の定期割引が適用されます` : `${discount}% recurring discount will be applied to your quote`}
                </span>
              </div>
            )}
            <Link to="/">
              <Button variant="outline" className="rounded-full font-body mt-2">
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
          <div className="text-center mb-10">
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
          <div className="flex items-center justify-center gap-1.5 mb-10">
            {steps.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body transition-all ${
                    i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="hidden sm:block text-xs font-body text-muted-foreground">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 sm:w-10 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />
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
                <RecurringStep frequency={frequency} onSelect={setFrequency} />
              )}
              {step === 2 && (
                <DateTimeStep
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              )}
              {step === 3 && (
                <DetailsStep formData={formData} onChange={setFormData} />
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl font-light text-foreground">{t('booking.step4')}</h3>
                  <div className="space-y-0 font-body text-sm divide-y divide-border">
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">{lang === 'ja' ? 'サービス' : 'Service'}</span>
                      <span className="font-medium text-foreground">{serviceLabels[selectedService]}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">{lang === 'ja' ? '頻度' : 'Frequency'}</span>
                      <span className="font-medium text-foreground">{(frequencyLabels[lang] || frequencyLabels.en)[frequency]}</span>
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="flex justify-between py-3">
                        <span className="text-muted-foreground">{lang === 'ja' ? 'オプション' : 'Add-ons'}</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">{selectedAddons.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">{t('booking.step2')}</span>
                      <span className="font-medium text-foreground">
                        {selectedDate && format(selectedDate, 'MMM d, yyyy')} — {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">{t('booking.name')}</span>
                      <span className="font-medium text-foreground">{formData.client_name}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">{t('booking.email')}</span>
                      <span className="font-medium text-foreground">{formData.client_email}</span>
                    </div>
                    {formData.address && (
                      <div className="flex justify-between py-3">
                        <span className="text-muted-foreground">{t('booking.address')}</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">{formData.address}</span>
                      </div>
                    )}
                    {formData.client_phone && (
                      <div className="flex justify-between py-3">
                        <span className="text-muted-foreground">{t('booking.phone')}</span>
                        <span className="font-medium text-foreground">{formData.client_phone}</span>
                      </div>
                    )}
                    {formData.property_type && (
                      <div className="flex justify-between py-3">
                        <span className="text-muted-foreground">{t('booking.propertyType')}</span>
                        <span className="font-medium text-foreground capitalize">{formData.property_type.replace('_', ' ')}</span>
                      </div>
                    )}
                    {(formData.bedrooms || formData.bathrooms) && (
                      <div className="flex justify-between py-3">
                        <span className="text-muted-foreground">{lang === 'ja' ? '間取り' : 'Size'}</span>
                        <span className="font-medium text-foreground">
                          {formData.bedrooms ? `${formData.bedrooms} bed` : ''}{formData.bedrooms && formData.bathrooms ? ' / ' : ''}{formData.bathrooms ? `${formData.bathrooms} bath` : ''}
                        </span>
                      </div>
                    )}
                    {formData.notes && (
                      <div className="flex justify-between py-3">
                        <span className="text-muted-foreground">{t('booking.notes')}</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">{formData.notes}</span>
                      </div>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mt-4">
                      <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="font-body text-sm text-green-800 font-medium">
                        {lang === 'ja' ? `${discount}%の定期割引がお見積もりに適用されます` : `A ${discount}% recurring discount will be applied to your quote`}
                      </p>
                    </div>
                  )}
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

            {step < 4 ? (
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