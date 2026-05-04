import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, Play, Mail, Phone } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-primary/10 text-primary', icon: Play },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection',
  care_services: 'Care Services',
};

export default function BookingsList() {
  const queryClient = useQueryClient();

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
                </div>

                <div className="flex flex-wrap gap-4 text-sm font-body text-muted-foreground">
                  {booking.preferred_date && (
                    <span>{format(new Date(booking.preferred_date), 'MMM d, yyyy')}</span>
                  )}
                  {booking.preferred_time && <span>• {booking.preferred_time}</span>}
                  {booking.address && <span>• {booking.address}</span>}
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