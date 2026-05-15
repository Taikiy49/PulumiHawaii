import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = 'pulumihawaii@gmail.com';

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

const frequencyLabels = {
  one_time: 'One-Time',
  monthly: 'Monthly (−10%)',
  biweekly: 'Bi-Weekly (−15%)',
  weekly: 'Weekly (−20%)',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (event?.type !== 'update') {
      return Response.json({ skipped: true });
    }

    const booking = data;
    if (!booking || booking.payment_status !== 'paid') {
      return Response.json({ skipped: true });
    }

    const serviceLabel = serviceLabels[booking.service_type] || booking.service_type;
    const freqLabel = frequencyLabels[booking.recurring_frequency] || 'One-Time';
    const isRecurring = booking.recurring_frequency && booking.recurring_frequency !== 'one_time';

    const recurringBadge = isRecurring
      ? `<span style="display:inline-block; background:#e8f5e9; color:#2e7d32; font-size:12px; font-weight:bold; padding:4px 12px; border-radius:20px; margin-left:8px;">🔄 ${freqLabel}</span>`
      : '';

    const emailBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1b5e20,#2e7d32); padding:36px 32px; text-align:center;">
            <p style="margin:0 0 4px; color:rgba(255,255,255,0.6); font-size:11px; letter-spacing:3px; text-transform:uppercase;">PULUMI HAWAII</p>
            <h1 style="margin:0; color:#fff; font-size:22px; font-weight:normal; letter-spacing:2px;">✅ Payment Confirmed</h1>
          </td>
        </tr>

        <!-- Summary -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0; font-size:18px; color:#1b5e20; font-weight:bold;">
              ${booking.client_name} ${recurringBadge}
            </p>
            <p style="margin:8px 0 0; font-size:14px; color:#555;">
              Payment of <strong>$${booking.quote_amount?.toFixed(2) || 'TBD'}</strong> confirmed for <strong>${serviceLabel}</strong>${booking.preferred_date ? ` on <strong>${booking.preferred_date}</strong>${booking.preferred_time ? ` at <strong>${booking.preferred_time}</strong>` : ''}` : ''}.
            </p>
          </td>
        </tr>

        <!-- Details Table -->
        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f3; border-radius:12px; overflow:hidden;">
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px; width:130px;">Service</td>
                <td style="padding:12px 20px; color:#1b5e20; font-size:13px; font-weight:bold;">${serviceLabel}</td>
              </tr>
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Frequency</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${freqLabel}</td>
              </tr>
              ${booking.preferred_date ? `
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Scheduled</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${booking.preferred_date}${booking.preferred_time ? ` at ${booking.preferred_time}` : ''}</td>
              </tr>` : ''}
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Client</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${booking.client_name}</td>
              </tr>
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Email</td>
                <td style="padding:12px 20px; font-size:13px;"><a href="mailto:${booking.client_email}" style="color:#1b5e20;">${booking.client_email}</a></td>
              </tr>
              ${booking.quote_amount ? `
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Amount Paid</td>
                <td style="padding:12px 20px; color:#1b5e20; font-size:13px; font-weight:bold;">$${booking.quote_amount.toFixed(2)}</td>
              </tr>` : ''}
              ${booking.address ? `
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Address</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${booking.address}</td>
              </tr>` : ''}
              ${booking.property_type ? `
              <tr>
                <td style="padding:12px 20px; color:#888; font-size:13px;">Property</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${booking.property_type}${booking.bedrooms ? `, ${booking.bedrooms} bed` : ''}${booking.bathrooms ? `/${booking.bathrooms} bath` : ''}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- Status Badge -->
        <tr>
          <td style="padding:20px 32px;">
            <div style="background:#e8f5e9; border:1px solid #a5d6a7; border-radius:10px; padding:16px 20px; text-align:center;">
              <p style="margin:0; color:#1b5e20; font-size:14px; font-weight:bold;">
                ✅ Booking confirmed and ready for scheduling
              </p>
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 36px; text-align:center;">
            <a href="https://pulumihawaii.base44.app/admin" style="display:inline-block; background:linear-gradient(135deg,#1b5e20,#2e7d32); color:#fff; text-decoration:none; padding:16px 40px; border-radius:50px; font-size:15px; letter-spacing:1px; font-family:Arial,sans-serif; font-weight:bold;">
              View in Admin Panel →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a1a; padding:20px 32px; text-align:center;">
            <p style="margin:0; color:rgba(255,255,255,0.35); font-size:11px;">© Pulumi Hawaii, LLC</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ADMIN_EMAIL,
      from_name: 'Pulumi Hawaii Payments',
      subject: `✅ Payment Confirmed: ${booking.client_name} — $${booking.quote_amount?.toFixed(2) || 'TBD'} (${serviceLabel})`,
      body: emailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});