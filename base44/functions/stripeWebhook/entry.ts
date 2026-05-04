import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    let event;
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;

      if (bookingId) {
        // Mark booking as paid
        await base44.asServiceRole.entities.Booking.update(bookingId, {
          payment_status: 'paid',
          status: 'confirmed',
        });

        // Fetch booking for confirmation email
        const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
        if (booking?.client_email) {
          const isJa = booking.language === 'ja';
          const serviceLabels = {
            regular_cleaning: 'Regular Cleaning',
            deep_cleaning: 'Deep Cleaning',
            inspection: 'Inspection & Check-Ins',
            care_services: 'Care Services',
          };
          const serviceLabel = serviceLabels[booking.service_type] || booking.service_type;
          const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : '';

          const emailBody = isJa ? `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
  <div style="background: #1e3a5f; padding: 32px; text-align: center;">
    <h1 style="color: white; font-size: 24px; margin: 0; letter-spacing: 2px;">PULUMI HAWAII</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">プレミアムクリーニング＆プロパティケア</p>
  </div>
  <div style="padding: 40px 32px;">
    <p style="font-size: 18px; color: #1e3a5f; font-weight: bold;">${booking.client_name} 様</p>
    <p style="line-height: 1.7; color: #444;">お支払いが確認されました。ご予約が正式に確定いたしました。</p>
    <div style="background: #f7f5f2; border-left: 4px solid #1e3a5f; padding: 24px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">ご予約内容</p>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #1e3a5f;">${serviceLabel}</p>
      ${booking.preferred_date ? `<p style="margin: 8px 0 0; color: #666; font-size: 14px;">日程: ${booking.preferred_date}${booking.preferred_time ? ` ${booking.preferred_time}` : ''}</p>` : ''}
      ${amount ? `<p style="margin: 4px 0 0; color: #666; font-size: 14px;">お支払い金額: ${amount}</p>` : ''}
    </div>
    <p style="line-height: 1.7; color: #444;">当日お伺いするのを楽しみにしております。ご質問がございましたら、お気軽にご連絡ください。</p>
    <p style="color: #888; font-size: 13px; line-height: 1.6; margin-top: 24px;">📧 pulumihawaii@gmail.com</p>
  </div>
  <div style="background: #1c1c1c; padding: 20px; text-align: center;">
    <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">© Pulumi Hawaii, LLC — 988 Halekauwila St, Honolulu, HI 96814</p>
  </div>
</div>` : `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
  <div style="background: #1e3a5f; padding: 32px; text-align: center;">
    <h1 style="color: white; font-size: 24px; margin: 0; letter-spacing: 2px;">PULUMI HAWAII</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">Premium Cleaning & Property Care</p>
  </div>
  <div style="padding: 40px 32px;">
    <p style="font-size: 18px; color: #1e3a5f; font-weight: bold;">Aloha, ${booking.client_name}! 🌺</p>
    <p style="line-height: 1.7; color: #444;">Great news — your payment has been received and your booking is officially confirmed!</p>
    <div style="background: #f7f5f2; border-left: 4px solid #1e3a5f; padding: 24px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Booking Confirmed</p>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #1e3a5f;">${serviceLabel}</p>
      ${booking.preferred_date ? `<p style="margin: 8px 0 0; color: #666; font-size: 14px;">Date: ${booking.preferred_date}${booking.preferred_time ? ` at ${booking.preferred_time}` : ''}</p>` : ''}
      ${amount ? `<p style="margin: 4px 0 0; color: #666; font-size: 14px;">Amount paid: ${amount}</p>` : ''}
      ${booking.address ? `<p style="margin: 4px 0 0; color: #666; font-size: 14px;">Address: ${booking.address}</p>` : ''}
    </div>
    <p style="line-height: 1.7; color: #444;">We look forward to taking care of your home. See you soon!</p>
    <p style="color: #888; font-size: 13px; line-height: 1.6; margin-top: 24px;">Questions? We're always happy to help!<br>📧 pulumihawaii@gmail.com</p>
  </div>
  <div style="background: #1c1c1c; padding: 20px; text-align: center;">
    <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">© Pulumi Hawaii, LLC — 988 Halekauwila St, Honolulu, HI 96814</p>
  </div>
</div>`;

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.client_email,
            from_name: 'Pulumi Hawaii',
            subject: isJa ? '【Pulumi Hawaii】お支払い確認・ご予約確定のお知らせ' : 'Payment Confirmed — Your Pulumi Hawaii Booking is Set! 🌺',
            body: emailBody,
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});