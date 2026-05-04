import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, Play, Mail, Phone, ChevronRight, CreditCard, DollarSign } from 'lucide-react';
import BookingDrawer from './BookingDrawer';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-700', icon: Play },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const paymentConfig = {
  unpaid: { label: 'Not Quoted', color: 'bg-gray-100 text-gray-500' },
  quote_sent: { label: 'Quote Sent', color: 'bg-purple-100 text-purple-700' },
  paid: { label: 'Paid ✓', color: 'bg-green-100 text-green-700' },
};

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection',
  care_services: 'Care Services',
};

export default function BookingsList() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-body text-muted-foreground text-lg">No bookings yet</p>
        <p className="font-body text-muted-foreground text-sm mt-1">New bookings will appear here</p>
      </div>
    );
  }

  // Sort: pending first, then by date
  const sorted = [...bookings].sort((a, b) => {
    const order = { pending: 0, confirmed: 1, in_progress: 2, completed: 3, cancelled: 4 };
    return (order[a.status] ?? 5) - (order[b.status] ?? 5);
  });

  return (
    <>
      <div className="space-y-3">
        {sorted.map(booking => {
          const status = statusConfig[booking.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          const payment = paymentConfig[booking.payment_status || 'unpaid'];
          const needsAttention = booking.payment_status === 'unpaid' || !booking.payment_status;

          return (
            <button
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className={`w-full text-left bg-card rounded-2xl border transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.99] p-5 ${
                needsAttention ? 'border-amber-200' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Top row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {needsAttention && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    )}
                    <h3 className="font-body text-base font-semibold text-foreground truncate">
                      {booking.client_name}
                    </h3>
                    <Badge className={`${status.color} border-none font-body text-xs flex-shrink-0`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Service + date */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-body text-muted-foreground">
                    <span className="font-medium text-foreground">{serviceLabels[booking.service_type]}</span>
                    {booking.preferred_date && (
                      <span>{format(new Date(booking.preferred_date), 'MMM d, yyyy')}</span>
                    )}
                    {booking.preferred_time && <span>{booking.preferred_time}</span>}
                  </div>

                  {/* Contact + payment row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {booking.client_email && (
                      <span className="flex items-center gap-1 text-xs font-body text-muted-foreground truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {booking.client_email}
                      </span>
                    )}
                    <Badge className={`${payment.color} border-none font-body text-xs flex-shrink-0`}>
                      <CreditCard className="w-3 h-3 mr-1" />
                      {payment.label}
                    </Badge>
                    {booking.quote_amount && (
                      <span className="flex items-center gap-0.5 text-xs font-body font-semibold text-primary">
                        <DollarSign className="w-3 h-3" />{Number(booking.quote_amount).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 self-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {needsAttention && (
                <div className="mt-3 pt-3 border-t border-amber-100">
                  <p className="font-body text-xs text-amber-700 font-medium">
                    👉 Tap to set price & send quote
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}