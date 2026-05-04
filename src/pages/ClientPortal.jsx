import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Camera, CheckCircle2, Calendar, ClipboardCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection',
  care_services: 'Care Services',
};

export default function ClientPortal() {
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['property-logs', email],
    queryFn: () => base44.entities.PropertyLog.filter({ client_email: email }),
    enabled: searched && !!email,
    initialData: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">Client Portal</h1>
              <p className="font-body text-sm text-muted-foreground">View your property care logs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to view logs..."
              className="h-12 rounded-xl font-body"
            />
            <Button type="submit" className="h-12 rounded-xl bg-primary hover:bg-primary/90 font-body px-6">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Results */}
        {searched && !isLoading && logs.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No property logs found for this email.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <div className="space-y-6">
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-body text-base font-semibold text-foreground">{log.property_address}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="font-body text-xs text-muted-foreground">
                      {log.service_date && format(new Date(log.service_date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="font-body text-xs">{serviceLabels[log.service_type]}</Badge>
                  {log.team_member && (
                    <Badge variant="secondary" className="font-body text-xs">{log.team_member}</Badge>
                  )}
                </div>
              </div>

              {log.notes && (
                <p className="font-body text-sm text-muted-foreground mb-4">{log.notes}</p>
              )}

              {/* Checklist */}
              {log.checklist && log.checklist.length > 0 && (
                <div className="mb-4">
                  <p className="font-body text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Checklist</p>
                  <div className="grid grid-cols-2 gap-1">
                    {log.checklist.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm font-body">
                        <CheckCircle2 className={`w-4 h-4 ${item.completed ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              {log.photo_urls && log.photo_urls.length > 0 && (
                <div>
                  <p className="font-body text-xs font-semibold text-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Photos
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {log.photo_urls.map((url, j) => (
                      <a key={j} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt={`Service photo ${j + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}