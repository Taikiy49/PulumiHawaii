import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

export default function DateTimeStep({ selectedDate, onDateSelect, selectedTime, onTimeSelect }) {
  const { t } = useLanguage();
  const today = startOfDay(new Date());

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
            onSelect={onDateSelect}
            disabled={(date) => isBefore(date, today)}
            className="rounded-2xl border border-border p-4"
          />
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="font-heading text-2xl font-light text-foreground mb-4">
            {t('booking.selectTime')}
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {timeSlots.map(time => (
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