import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CalendarDays, ClipboardList, Clock, Lock } from 'lucide-react';
import StatsOverview from '@/components/admin/StatsOverview';
import BookingsList from '@/components/admin/BookingsList';
import AvailabilityManager from '@/components/admin/AvailabilityManager';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-5 px-6 max-w-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">Admin Access</h2>
            <p className="font-body text-sm text-muted-foreground mt-2">Please sign in to access the admin portal.</p>
          </div>
          <Button
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="w-full h-12 rounded-full bg-primary font-body"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4 px-6 max-w-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">Access Denied</h2>
            <p className="font-body text-sm text-muted-foreground mt-2">This page is only accessible to admins.</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-full font-body">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-heading text-2xl font-semibold text-foreground">Pulumi Admin</h1>
                <p className="font-body text-sm text-muted-foreground">Manage bookings & availability</p>
              </div>
            </div>
            <span className="font-heading text-lg tracking-wide text-muted-foreground">PULUMI HAWAII</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <StatsOverview />

        <Tabs defaultValue="bookings" className="mt-8">
          <TabsList className="bg-card border border-border rounded-xl h-12">
            <TabsTrigger value="bookings" className="rounded-lg font-body text-sm gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="w-4 h-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="availability" className="rounded-lg font-body text-sm gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4" />
              Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <BookingsList />
          </TabsContent>

          <TabsContent value="availability" className="mt-6">
            <AvailabilityManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}