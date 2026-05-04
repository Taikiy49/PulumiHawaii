import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';

const allTimeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

export default function AvailabilityManager() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [teamMember, setTeamMember] = useState('Shoko Yamashita');

  const { data: availability, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: () => base44.entities.Availability.list('-date'),
    initialData: [],
  });

  const createAvailability = useMutation({
    mutationFn: (data) => base44.entities.Availability.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      setSelectedDate(null);
      setSelectedSlots([]);
    },
  });

  const deleteAvailability = useMutation({
    mutationFn: (id) => base44.entities.Availability.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
  });

  const toggleSlot = (slot) => {
    setSelectedSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    if (!selectedDate || selectedSlots.length === 0) return;
    createAvailability.mutate({
      team_member: teamMember,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time_slots: selectedSlots,
      is_available: true,
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left: Add availability */}
      <div className="space-y-6">
        <h3 className="font-body text-lg font-semibold text-foreground">Set Availability</h3>

        <div className="space-y-2">
          <Label className="font-body text-sm">Team Member</Label>
          <Input
            value={teamMember}
            onChange={(e) => setTeamMember(e.target.value)}
            className="h-11 rounded-xl font-body"
          />
        </div>

        <div>
          <Label className="font-body text-sm mb-2 block">Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}

            className="rounded-2xl border border-border"
          />
        </div>

        {selectedDate && (
          <div>
            <Label className="font-body text-sm mb-3 block">
              Available Times for {format(selectedDate, 'MMM d, yyyy')}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {allTimeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`py-2 px-3 rounded-lg border text-xs font-body transition-all ${
                    selectedSlots.includes(slot)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/30'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <Button
              onClick={handleSave}
              disabled={selectedSlots.length === 0 || createAvailability.isPending}
              className="mt-4 rounded-full font-body bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Save Availability
            </Button>
          </div>
        )}
      </div>

      {/* Right: Existing availability */}
      <div className="space-y-4">
        <h3 className="font-body text-lg font-semibold text-foreground">Scheduled Availability</h3>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {availability.length === 0 && !isLoading && (
          <p className="text-sm font-body text-muted-foreground py-4">No availability set yet.</p>
        )}

        {availability.map(avail => (
          <div key={avail.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between">
            <div>
              <p className="font-body text-sm font-semibold text-foreground">{avail.team_member}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {avail.date && format(new Date(avail.date), 'EEEE, MMM d, yyyy')}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {avail.time_slots?.map((slot, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-body">{slot}</Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteAvailability.mutate(avail.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}