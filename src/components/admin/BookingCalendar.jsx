import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addWeeks, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingDrawer from './BookingDrawer';

const SERVICE_COLORS = {
  regular_cleaning: 'bg-blue-100 text-blue-800 border-blue-200',
  deep_cleaning: 'bg-purple-100 text-purple-800 border-purple-200',
  inspection: 'bg-amber-100 text-amber-800 border-amber-200',
  care_services: 'bg-green-100 text-green-800 border-green-200',
};

const SERVICE_LABELS = {
  regular_cleaning: 'Regular',
  deep_cleaning: 'Deep',
  inspection: 'Inspection',
  care_services: 'Care',
};

export default function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings } = useQuery({
    queryKey: ['bookings-calendar'],
    queryFn: () => base44.entities.Booking.list('-preferred_date'),
    initialData: [],
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Expand recurring bookings into all their projected dates within visible range
  const expandedBookings = useMemo(() => {
    const result = [];
    bookings.forEach(b => {
      if (b.status === 'cancelled') return;
      result.push({ ...b, _expanded_date: b.preferred_date });

      if (!b.preferred_date || !b.recurring_frequency || b.recurring_frequency === 'one_time') return;

      const baseDate = new Date(b.preferred_date + 'T12:00:00');
      const limit = addMonths(new Date(), 6); // show up to 6 months ahead

      let next;
      for (let i = 1; i <= 52; i++) {
        if (b.recurring_frequency === 'weekly') next = addWeeks(baseDate, i);
        else if (b.recurring_frequency === 'biweekly') next = addWeeks(baseDate, i * 2);
        else if (b.recurring_frequency === 'monthly') next = addMonths(baseDate, i);
        else break;

        if (next > limit) break;
        result.push({ ...b, _expanded_date: format(next, 'yyyy-MM-dd'), _is_recurring: true });
      }
    });
    return result;
  }, [bookings]);

  const getBookingsForDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return expandedBookings.filter(b => b._expanded_date === dateStr);
  };

  const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  return (
    <>
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-light text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg h-8 w-8"
              onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg h-8 w-8"
              onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center font-body text-xs font-semibold text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
          {days.map(day => {
            const dayBookings = getBookingsForDay(day);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                className={`min-h-[72px] p-1.5 text-left transition-colors relative ${
                  isSelected
                    ? 'bg-primary/10'
                    : isCurrentMonth
                    ? 'bg-card hover:bg-muted/60'
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <span className={`font-body text-xs font-medium block mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday(day)
                    ? 'bg-primary text-primary-foreground'
                    : isCurrentMonth
                    ? 'text-foreground'
                    : 'text-muted-foreground/50'
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="space-y-0.5">
                   {dayBookings.slice(0, 2).map((b, i) => (
                     <button
                       key={i}
                       onClick={(e) => {
                         e.stopPropagation();
                         setSelectedBooking(b);
                       }}
                       className={`text-[9px] font-body font-medium px-1 py-0.5 rounded border truncate w-full text-left hover:opacity-80 transition-opacity ${SERVICE_COLORS[b.service_type] || 'bg-muted text-foreground border-border'}`}
                       title={`${b.client_name} — ${b.preferred_time || 'TBD'}`}
                     >
                       {b.preferred_time ? b.preferred_time.replace(' AM','a').replace(' PM','p') : '—'} {b.client_name?.split(' ')[0]}
                     </button>
                   ))}
                   {dayBookings.length > 2 && (
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setSelectedDay(selectedDay && isSameDay(new Date(selectedDay), new Date(selectedDay)) ? null : new Date(selectedDay));
                       }}
                       className="text-[9px] font-body text-muted-foreground pl-1 hover:text-foreground transition-colors"
                     >
                       +{dayBookings.length - 2} more
                     </button>
                   )}
                 </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {Object.entries(SERVICE_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${SERVICE_COLORS[key]}`} />
              <span className="font-body text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day detail panel */}
      <div className="bg-card rounded-2xl border border-border p-5">
        {selectedDay ? (
          <>
            <h3 className="font-heading text-lg font-light text-foreground mb-1">
              {format(selectedDay, 'EEEE')}
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-5">
              {format(selectedDay, 'MMMM d, yyyy')}
            </p>
            {selectedDayBookings.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No bookings this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedDayBookings
                  .sort((a, b) => (a.preferred_time || '').localeCompare(b.preferred_time || ''))
                  .map((b, i) => (
                  <div key={i} className="rounded-xl border border-border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-sm font-semibold text-foreground">{b.preferred_time || '—'}</p>
                      <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded-full border ${SERVICE_COLORS[b.service_type]}`}>
                        {SERVICE_LABELS[b.service_type]}
                      </span>
                    </div>
                    <p className="font-body text-sm text-foreground">{b.client_name}</p>
                    <p className="font-body text-xs text-muted-foreground">{b.client_email}</p>
                     {b.address && (
                       <p className="font-body text-xs text-muted-foreground">{b.address}</p>
                     )}
                     <div className="flex flex-wrap gap-2 items-center mt-2">
                       {b.quote_amount && (
                         <span className="font-body text-xs font-semibold text-primary">
                           💰 ${Number(b.quote_amount).toFixed(2)}
                         </span>
                       )}
                       {b._is_recurring && (
                         <span className="font-body text-[10px] text-primary/70 italic">↻ {b.recurring_frequency?.replace('_', ' ')}</span>
                       )}
                       <div className={`text-[10px] font-body px-2 py-0.5 rounded-full font-medium ${
                         b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                         b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                         b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                         'bg-muted text-muted-foreground'
                       }`}>
                         {b.status}
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">📅</span>
            </div>
            <p className="font-body text-sm text-muted-foreground">Click a day to see bookings</p>
          </div>
        )}
      </div>
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