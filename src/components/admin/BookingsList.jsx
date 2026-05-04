import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, Play, Mail, Phone, DollarSign, Send, ExternalLink, CreditCard } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary', icon: Play },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const paymentConfig = {
  unpaid: { label: 'Unpaid', color: 'bg-gray-100 text-gray-600' },
  quote_sent: { label: 'Quote Sent', color: 'bg-purple-100 text-purple-700' },
  paid: { label: 'Paid ✓', color: 'bg-green-100 text-green-700' },
};

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection',
  care_services: 'Care Services',
};

function QuotePanel({ booking, onSent }) {
  const [amount, setAmount] = useState(booking.quote_amount || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await base44.functions.invoke('sendQuote', {
        booking_id: booking.id,
        quote_amount: Number(amount),
      });
      onSent();
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to send quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="font-body text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
        <DollarSign className="w-3 h-3 text-primary" />
        Send Price Quote to Customer
      </p>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-body text-sm">$</span>
          <Input
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7 w-32 h-9 rounded-lg font-body text-sm"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={loading}
          className="h-9 rounded-full font-body text-xs bg-primary hover:bg-primary/90 gap-1.5"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          {loading ? 'Sending…' : 'Send Quote & Email'}
        </Button>
      </div>
      {error && <p className="font-body text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function BookingsList() {
  const queryClient = useQueryClient();
  const [openQuoteId, setOpenQuoteId] = useState(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
    initialData: [],
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Booking.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-muted-foreground">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => {
        const status = statusConfig[booking.status] || statusConfig.pending;
        const StatusIcon = status.icon;
        const payment = paymentConfig[booking.payment_status] || paymentConfig.unpaid;
        const isQuoteOpen = openQuoteId === booking.id;

        return (
          <div key={booking.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-body text-base font-semibold text-foreground">{booking.client_name}</h3>
                  <Badge className={`${status.color} border-none font-body text-xs`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className="font-body text-xs">{serviceLabels[booking.service_type]}</Badge>
                  <Badge className={`${payment.color} border-none font-body text-xs`}>
                    <CreditCard className="w-3 h-3 mr-1" />
                    {payment.label}
                  </Badge>
                  {booking.quote_amount && (
                    <span className="font-body text-sm font-semibold text-primary">${Number(booking.quote_amount).toFixed(2)}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm font-body text-muted-foreground">
                  {booking.preferred_date && (
                    <span>{format(new Date(booking.preferred_date), 'MMM d, yyyy')}</span>
                  )}
                  {booking.preferred_time && <span>• {booking.preferred_time}</span>}
                  {booking.address && <span>• {booking.address}</span>}
                  {booking.bedrooms && <span>• {booking.bedrooms} bed</span>}
                  {booking.bathrooms && <span>• {booking.bathrooms} bath</span>}
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-body text-muted-foreground">
                  {booking.client_email && (
                    <a href={`mailto:${booking.client_email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="w-3 h-3" /> {booking.client_email}
                    </a>
                  )}
                  {booking.client_phone && (
                    <a href={`tel:${booking.client_phone}`} className="flex items-center gap-1 hover:text-primary">
                      <Phone className="w-3 h-3" /> {booking.client_phone}
                    </a>
                  )}
                </div>

                {booking.addons && booking.addons.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {booking.addons.map((addon, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-body">{addon}</Badge>
                    ))}
                  </div>
                )}

                {booking.notes && (
                  <p className="text-xs font-body text-muted-foreground italic mt-2">"{booking.notes}"</p>
                )}

                {/* Quote section */}
                {booking.payment_status === 'quote_sent' && booking.stripe_payment_link && (
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={booking.stripe_payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-body text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> View Payment Link
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenQuoteId(isQuoteOpen ? null : booking.id)}
                      className="h-7 text-xs font-body text-muted-foreground"
                    >
                      Resend / Update Quote
                    </Button>
                  </div>
                )}

                {/* Send quote button for new/pending bookings */}
                {(!booking.payment_status || booking.payment_status === 'unpaid') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenQuoteId(isQuoteOpen ? null : booking.id)}
                    className="mt-2 h-8 text-xs font-body rounded-full gap-1.5"
                  >
                    <DollarSign className="w-3 h-3" />
                    Set Price & Send Quote
                  </Button>
                )}

                {isQuoteOpen && (
                  <QuotePanel
                    booking={booking}
                    onSent={() => {
                      setOpenQuoteId(null);
                      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
                    }}
                  />
                )}
              </div>

              <Select
                value={booking.status}
                onValueChange={(status) => updateBooking.mutate({ id: booking.id, data: { status } })}
              >
                <SelectTrigger className="w-40 h-9 rounded-lg font-body text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}
    </div>
  );
}