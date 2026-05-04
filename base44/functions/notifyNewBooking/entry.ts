import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'pulumihawaii@gmail.com';

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (event?.type !== 'create') {
      return Response.json({ skipped: true });
    }

    const booking = data;
    if (!booking) {
      return Response.json({ error: 'No booking data' }, { status: 400 });
    }

    const serviceLabel = serviceLabels[booking.service_type] || booking.service_type;

    const emailBody = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
  <div style="background: #1e3a5f; padding: 32px; text-align: center;">
    <h1 style="color: white; font-size: 24px; margin: 0; letter-spacing: 2px;">PULUMI HAWAII</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">New Booking Request</p>
  </div>
  <div style="padding: 40px 32px;">
    <p style="font-size: 18px; color: #1e3a5f; font-weight: bold;">🆕 New Booking from ${booking.client_name}</p>
    <div style="background: #f7f5f2; border-left: 4px solid #1e3a5f; padding: 24px; margin: 24px 0; border-radius: 4px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #888; width: 140px;">Service</td><td style="color: #1e3a5f; font-weight: bold;">${serviceLabel}</td></tr>
        ${booking.preferred_date ? `<tr><td style="padding: 6px 0; color: #888;">Date</td><td style="color: #333;">${booking.preferred_date}${booking.preferred_time ? ` at ${booking.preferred_time}` : ''}</td></tr>` : ''}
        <tr><td style="padding: 6px 0; color: #888;">Name</td><td style="color: #333;">${booking.client_name}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="color: #333;">${booking.client_email}</td></tr>
        ${booking.client_phone ? `<tr><td style="padding: 6px 0; color: #888;">Phone</td><td style="color: #333;">${booking.client_phone}</td></tr>` : ''}
        ${booking.address ? `<tr><td style="padding: 6px 0; color: #888;">Address</td><td style="color: #333;">${booking.address}</td></tr>` : ''}
        ${booking.property_type ? `<tr><td style="padding: 6px 0; color: #888;">Property</td><td style="color: #333;">${booking.property_type}${booking.bedrooms ? `, ${booking.bedrooms}BR` : ''}${booking.bathrooms ? `/${booking.bathrooms}BA` : ''}</td></tr>` : ''}
        ${booking.addons?.length ? `<tr><td style="padding: 6px 0; color: #888;">Add-ons</td><td style="color: #333;">${booking.addons.join(', ')}</td></tr>` : ''}
        ${booking.notes ? `<tr><td style="padding: 6px 0; color: #888;">Notes</td><td style="color: #333;">${booking.notes}</td></tr>` : ''}
      </table>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://pulumihawaii.base44.app/admin" style="background: #1e3a5f; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-size: 15px; display: inline-block; letter-spacing: 1px;">
        Open Admin Panel →
      </a>
    </div>
  </div>
  <div style="background: #1c1c1c; padding: 20px; text-align: center;">
    <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">© Pulumi Hawaii, LLC</p>
  </div>
</div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ADMIN_EMAIL,
      from_name: 'Pulumi Hawaii Bookings',
      subject: `🆕 New Booking: ${booking.client_name} — ${serviceLabel}${booking.preferred_date ? ` on ${booking.preferred_date}` : ''}`,
      body: emailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});