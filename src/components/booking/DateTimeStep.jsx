import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, startOfDay } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function DateTimeStep({ selectedDate, onDateSelect, selectedTime, onTimeSelect }) {
  const { t } = useLanguage();
  const today = startOfDay(new Date());

  const { data: availability } = useQuery({
    queryKey: ['availability'],
    queryFn: () => base44.entities.Availability.filter({ is_available: true }),
    initialData: [],
  });

  // Fetch existing bookings to filter out already-booked slots
  const { data: bookings } = useQuery({
    queryKey: ['bookings-booked-slots'],
    queryFn: () => base44.entities.Booking.list(),
    initialData: [],
  });

  // Build a set of available date strings (yyyy-MM-dd)
  const availableDates = new Set(availability.map(a => a.date));

  // Get time slots for the selected date, minus already-booked ones
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const rawSlots = selectedDateStr
    ? (availability.find(a => a.date === selectedDateStr)?.time_slots || [])
    : [];

  // Find booked times on selected date (any non-cancelled booking)
  const bookedTimes = new Set(
    bookings
      .filter(b => b.preferred_date === selectedDateStr && b.status !== 'cancelled')
      .map(b => b.preferred_time)
  );

  const availableSlots = rawSlots.filter(slot => !bookedTimes.has(slot));

  const isDateDisabled = (date) => {
    if (isBefore(date, today)) return true;
    const dateStr = format(date, 'yyyy-MM-dd');
    return !availableDates.has(dateStr);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading text-2xl font-light text-foreground mb-6">
          {t('booking.selectDate')}
        </h3>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateSelect(date);
              onTimeSelect(''); // reset time when date changes
            }}
            disabled={isDateDisabled}
            className="rounded-2xl border border-border p-4"
          />
        </div>
        {availability.length === 0 && (
          <p className="text-center font-body text-sm text-muted-foreground mt-4">
            No availability set yet. Please check back soon or call us at (808) 227-7729.
          </p>
        )}
      </div>

      {selectedDate && availableSlots.length > 0 && (
        <div>
          <h3 className="font-heading text-2xl font-light text-foreground mb-4">
            {t('booking.selectTime')}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {availableSlots.map(time => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`py-3 px-4 rounded-xl border text-sm font-body transition-all ${
                  selectedTime === time
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/30'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}