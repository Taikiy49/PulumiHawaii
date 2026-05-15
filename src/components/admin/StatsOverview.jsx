import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, CheckCircle2, Clock, Users, DollarSign } from 'lucide-react';

export default function StatsOverview() {
  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list(),
    initialData: [],
  });

  const totalRevenue = bookings
    .filter(b => b.payment_status === 'paid' && b.quote_amount)
    .reduce((sum, b) => sum + Number(b.quote_amount || 0), 0);

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: CalendarDays,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Pending',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Confirmed',
      value: bookings.filter(b => b.status === 'confirmed').length,
      icon: CheckCircle2,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border p-5">
          <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="font-body text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}