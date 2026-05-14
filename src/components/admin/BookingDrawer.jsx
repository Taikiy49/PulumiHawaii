import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import {
  X, Mail, Phone, MapPin, Home, BedDouble, Bath, CalendarDays, Clock,
  DollarSign, Send, ExternalLink, CheckCircle2, StickyNote, Layers,
  CreditCard, Repeat, Tag
} from 'lucide-react';

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

const frequencyLabels = {
  one_time: 'One-Time',
  monthly: 'Monthly (−10%)',
  biweekly: 'Bi-Weekly (−15%)',
  weekly: 'Weekly (−20%)',
};

const propertyLabels = {
  condo: 'Condo',
  house: 'House',
  vacation_rental: 'Vacation Rental',
  other: 'Other',
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function BookingDrawer({ booking, onClose }) {
  const queryClient = useQueryClient();
  const [quoteAmount, setQuoteAmount] = useState(booking.quote_amount || '');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [status, setStatus] = useState(booking.status);
  const [savingStatus, setSavingStatus] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setSavingStatus(true);
    await base44.entities.Booking.update(booking.id, { status: newStatus });
    refresh();
    setSavingStatus(false);
  };

  const handleSendQuote = async () => {
    if (!quoteAmount || isNaN(quoteAmount) || Number(quoteAmount) <= 0) {
      setSendError('Please enter a valid dollar amount.');
      return;
    }
    setSendError('');
    setSending(true);
    try {
      await base44.functions.invoke('sendQuote', {
        booking_id: booking.id,
        quote_amount: Number(quoteAmount),
      });
      setSendSuccess(true);
      refresh();
    } catch (e) {
      setSendError(e?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const paymentStatus = booking.payment_status || 'unpaid';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer / Modal */}
      <div className="relative bg-card w-full max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <p className="font-body text-xs text-white/60 uppercase tracking-widest mb-1">Booking Details</p>
            <h2 className="font-heading text-2xl font-semibold text-white">{booking.client_name}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="font-body text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                {serviceLabels[booking.service_type]}
              </span>
              {booking.language === 'ja' && (
                <span className="font-body text-xs bg-white/20 text-white px-3 py-1 rounded-full">🇯🇵 Japanese</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Contact */}
          <section>
            <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Contact</p>
            <div className="space-y-2">
              <a href={`mailto:${booking.client_email}`} className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{booking.client_email}</span>
              </a>
              {booking.client_phone && (
                <a href={`tel:${booking.client_phone}`} className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-body text-sm text-foreground">{booking.client_phone}</span>
                </a>
              )}
            </div>
          </section>

          {/* Recurring Plan */}
          {booking.recurring_frequency && booking.recurring_frequency !== 'one_time' && (
            <section>
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Recurring Plan</p>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <Repeat className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-green-800">{frequencyLabels[booking.recurring_frequency]}</p>
                  {booking.recurring_discount > 0 && (
                    <p className="font-body text-xs text-green-700 flex items-center gap-1 mt-0.5">
                      <Tag className="w-3 h-3" />
                      Apply {booking.recurring_discount}% discount when quoting
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Appointment */}
          <section>
            <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Appointment</p>
            <div className="grid grid-cols-2 gap-2">
              {booking.preferred_date && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                  <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-body text-sm text-foreground">
                    {format(new Date(booking.preferred_date), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              {booking.preferred_time && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-body text-sm text-foreground">{booking.preferred_time}</span>
                </div>
              )}
            </div>
          </section>

          {/* Property */}
          {(booking.address || booking.property_type || booking.bedrooms || booking.bathrooms) && (
            <section>
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Property</p>
              <div className="space-y-2">
                {booking.address && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">{booking.address}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {booking.property_type && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                      <Home className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{propertyLabels[booking.property_type] || booking.property_type}</span>
                    </div>
                  )}
                  {booking.bedrooms && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                      <BedDouble className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{booking.bedrooms} bed</span>
                    </div>
                  )}
                  {booking.bathrooms && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                      <Bath className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-body text-sm text-foreground">{booking.bathrooms} bath</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Add-ons */}
          {booking.addons && booking.addons.length > 0 && (
            <section>
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Add-ons</p>
              <div className="flex flex-wrap gap-2">
                {booking.addons.map((addon, i) => (
                  <span key={i} className="font-body text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                    <Layers className="w-3 h-3 inline mr-1" />{addon}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {booking.notes && (
            <section>
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Notes</p>
              <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <StickyNote className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm text-amber-900 leading-relaxed">{booking.notes}</p>
              </div>
            </section>
          )}

          {/* Status */}
          <section>
            <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Booking Status</p>
            <Select value={status} onValueChange={handleStatusChange} disabled={savingStatus}>
              <SelectTrigger className="w-full h-12 rounded-xl font-body text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="confirmed">✅ Confirmed</SelectItem>
                <SelectItem value="in_progress">🔄 In Progress</SelectItem>
                <SelectItem value="completed">🎉 Completed</SelectItem>
                <SelectItem value="cancelled">❌ Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Quote / Payment */}
          <section>
            <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Payment</p>

            {/* Current payment status */}
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">Status:</span>
              {paymentStatus === 'unpaid' && <span className="font-body text-sm font-semibold text-gray-600">Not yet quoted</span>}
              {paymentStatus === 'quote_sent' && <span className="font-body text-sm font-semibold text-purple-700">Quote sent — awaiting payment</span>}
              {paymentStatus === 'paid' && <span className="font-body text-sm font-semibold text-green-700">✓ Paid — ${Number(booking.quote_amount).toFixed(2)}</span>}
            </div>

            {/* View payment link if already sent */}
            {booking.stripe_payment_link && paymentStatus !== 'paid' && (
              <a
                href={booking.stripe_payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-xl mb-4 hover:bg-purple-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-purple-600" />
                <span className="font-body text-sm text-purple-700 font-medium">View Stripe Payment Link</span>
              </a>
            )}

            {/* Send quote form — always show unless paid */}
            {paymentStatus !== 'paid' && !sendSuccess && (
              <div className="bg-muted rounded-2xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-foreground">
                  {paymentStatus === 'quote_sent' ? '✏️ Update Quote & Resend Email' : '💵 Set Price & Send Quote Email'}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  This will email the customer a Stripe payment link for the amount you set.
                </p>
                {booking.recurring_discount > 0 && quoteAmount && !isNaN(quoteAmount) && Number(quoteAmount) > 0 && (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
                    <Tag className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <p className="font-body text-xs text-green-800">
                      <span className="font-semibold">{booking.recurring_discount}% discount</span> will be noted in email.
                      Suggested discounted price: <span className="font-semibold">${(Number(quoteAmount) * (1 - booking.recurring_discount / 100)).toFixed(2)}</span>
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body text-lg font-semibold">$</span>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="e.g. 150.00"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      className="pl-8 h-12 rounded-xl font-body text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSendQuote}
                    disabled={sending || !quoteAmount}
                    className="h-12 rounded-xl font-body bg-primary hover:bg-primary/90 px-5 gap-2"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? 'Sending…' : 'Send'}
                  </Button>
                </div>
                {sendError && <p className="font-body text-xs text-destructive">{sendError}</p>}
              </div>
            )}

            {sendSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-green-800">Quote sent successfully! 🎉</p>
                  <p className="font-body text-xs text-green-700">{booking.client_name} will receive an email with the payment link.</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-card">
          <Button onClick={onClose} variant="outline" className="w-full h-11 rounded-full font-body">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}