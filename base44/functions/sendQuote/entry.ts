import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { booking_id, quote_amount } = await req.json();

    if (!booking_id || !quote_amount || quote_amount <= 0) {
      return Response.json({ error: 'booking_id and a valid quote_amount are required' }, { status: 400 });
    }

    // Fetch the booking
    const booking = await base44.asServiceRole.entities.Booking.get(booking_id);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const serviceLabel = serviceLabels[booking.service_type] || booking.service_type;
    const amountCents = Math.round(quote_amount * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Pulumi Hawaii — ${serviceLabel}`,
              description: [
                booking.preferred_date ? `Date: ${booking.preferred_date}` : null,
                booking.preferred_time ? `Time: ${booking.preferred_time}` : null,
                booking.address ? `Address: ${booking.address}` : null,
                booking.addons?.length ? `Add-ons: ${booking.addons.join(', ')}` : null,
              ].filter(Boolean).join(' | '),
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: booking.client_email,
      success_url: `https://pulumihawaii.base44.app/booking?payment=success`,
      cancel_url: `https://pulumihawaii.base44.app/booking?payment=cancelled`,
      metadata: {
        booking_id: booking.id,
      },
    });

    // Update booking with quote info
    await base44.asServiceRole.entities.Booking.update(booking_id, {
      quote_amount,
      payment_status: 'quote_sent',
      stripe_payment_link: session.url,
      stripe_session_id: session.id,
      status: 'confirmed',
    });

    // Send email to customer
    const isJa = booking.language === 'ja';
    const emailBody = isJa
      ? `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
  <div style="background: #1e3a5f; padding: 32px; text-align: center;">
    <h1 style="color: white; font-size: 24px; margin: 0; letter-spacing: 2px;">PULUMI HAWAII</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">プレミアムクリーニング＆プロパティケア</p>
  </div>
  <div style="padding: 40px 32px;">
    <p style="font-size: 18px; color: #1e3a5f; font-weight: bold;">${booking.client_name} 様</p>
    <p style="line-height: 1.7; color: #444;">この度はPulumi Hawaiiをご利用いただきありがとうございます。サービスのお見積もりをお送りします。</p>
    <div style="background: #f7f5f2; border-left: 4px solid #1e3a5f; padding: 24px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">お見積もり金額</p>
      <p style="margin: 0; font-size: 36px; font-weight: bold; color: #1e3a5f;">$${quote_amount.toFixed(2)}</p>
      <p style="margin: 8px 0 0; color: #666; font-size: 14px;">${serviceLabel}${booking.preferred_date ? ` — ${booking.preferred_date}` : ''}</p>
    </div>
    <p style="line-height: 1.7; color: #444;">下記のボタンよりお支払いをお願いいたします。お支払い確認後、予約が正式に確定となります。</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${session.url}" style="background: #1e3a5f; color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-size: 16px; display: inline-block; letter-spacing: 1px;">今すぐお支払い</a>
    </div>
    <p style="color: #888; font-size: 13px; line-height: 1.6;">ご不明な点がございましたら、お気軽にお問い合わせください。<br>📧 pulumihawaii@gmail.com</p>
  </div>
  <div style="background: #1c1c1c; padding: 20px; text-align: center;">
    <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">© Pulumi Hawaii, LLC — 988 Halekauwila St, Honolulu, HI 96814</p>
  </div>
</div>`
      : `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1c1c;">
  <div style="background: #1e3a5f; padding: 32px; text-align: center;">
    <h1 style="color: white; font-size: 24px; margin: 0; letter-spacing: 2px;">PULUMI HAWAII</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">Premium Cleaning & Property Care</p>
  </div>
  <div style="padding: 40px 32px;">
    <p style="font-size: 18px; color: #1e3a5f; font-weight: bold;">Aloha, ${booking.client_name}! 🌺</p>
    <p style="line-height: 1.7; color: #444;">Thank you for choosing Pulumi Hawaii! We've reviewed your booking request and prepared a custom quote for you.</p>
    <div style="background: #f7f5f2; border-left: 4px solid #1e3a5f; padding: 24px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Quote</p>
      <p style="margin: 0; font-size: 36px; font-weight: bold; color: #1e3a5f;">$${quote_amount.toFixed(2)}</p>
      <p style="margin: 8px 0 0; color: #666; font-size: 14px;">${serviceLabel}${booking.preferred_date ? ` — ${booking.preferred_date}` : ''}${booking.addons?.length ? ` + ${booking.addons.join(', ')}` : ''}</p>
    </div>
    <p style="line-height: 1.7; color: #444;">Click the button below to confirm and pay securely. Your booking will be officially confirmed once payment is received.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${session.url}" style="background: #1e3a5f; color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-size: 16px; display: inline-block; letter-spacing: 1px;">Confirm & Pay Now</a>
    </div>
    <p style="color: #888; font-size: 13px; line-height: 1.6;">Questions? We're always happy to help!<br>📧 pulumihawaii@gmail.com</p>
  </div>
  <div style="background: #1c1c1c; padding: 20px; text-align: center;">
    <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">© Pulumi Hawaii, LLC — 988 Halekauwila St, Honolulu, HI 96814</p>
  </div>
</div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: booking.client_email,
      from_name: 'Pulumi Hawaii',
      subject: isJa ? `【Pulumi Hawaii】お見積もりのご案内 — $${quote_amount.toFixed(2)}` : `Your Pulumi Hawaii Quote — $${quote_amount.toFixed(2)}`,
      body: emailBody,
    });

    return Response.json({ success: true, payment_url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});