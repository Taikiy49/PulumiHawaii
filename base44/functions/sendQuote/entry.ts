import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const serviceLabels = {
  regular_cleaning: 'Regular Cleaning',
  deep_cleaning: 'Deep Cleaning',
  inspection: 'Inspection & Check-Ins',
  care_services: 'Care Services',
};

const frequencyLabels = {
  one_time: 'One-Time Service',
  monthly: 'Monthly Plan (10% recurring discount)',
  biweekly: 'Bi-Weekly Plan (15% recurring discount)',
  weekly: 'Weekly Plan (20% recurring discount)',
};

const frequencyLabelsJa = {
  one_time: '1回のみ',
  monthly: '月1回プラン（10%定期割引）',
  biweekly: '隔週プラン（15%定期割引）',
  weekly: '毎週プラン（20%定期割引）',
};

function emailTemplate({ lang, clientName, serviceLabel, frequencyLabel, quoteAmount, originalAmount, discount, date, addons, paymentUrl }) {
  const isJa = lang === 'ja';
  const hasDiscount = discount > 0 && originalAmount && originalAmount > quoteAmount;

  const discountBlock = hasDiscount ? `
    <tr>
      <td colspan="2" style="padding: 12px 24px 0;">
        <div style="background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">🏷️</span>
          <div>
            <p style="margin: 0; font-size: 13px; color: #2e7d32; font-weight: bold;">
              ${isJa ? `${discount}%の定期割引が適用されました` : `${discount}% recurring discount applied`}
            </p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #388e3c;">
              ${isJa
                ? `通常価格 $${originalAmount.toFixed(2)} → 割引後 $${quoteAmount.toFixed(2)}（$${(originalAmount - quoteAmount).toFixed(2)} お得）`
                : `Regular price $${originalAmount.toFixed(2)} → Your price $${quoteAmount.toFixed(2)} (save $${(originalAmount - quoteAmount).toFixed(2)})`
              }
            </p>
          </div>
        </div>
      </td>
    </tr>` : '';

  const addonsRow = addons?.length ? `
    <tr>
      <td style="padding: 8px 24px; color: #888; font-size: 13px; width: 130px; vertical-align: top;">${isJa ? 'オプション' : 'Add-ons'}</td>
      <td style="padding: 8px 24px; color: #444; font-size: 13px;">${addons.join(', ')}</td>
    </tr>` : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f1ee; font-family: Georgia, 'Times New Roman', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f1ee; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5282 100%); padding: 40px 32px; text-align: center;">
            <p style="margin: 0 0 4px; color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">${isJa ? 'プレミアムクリーニング＆プロパティケア' : 'PREMIUM CLEANING & PROPERTY CARE'}</p>
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: normal; letter-spacing: 4px;">PULUMI HAWAII</h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 13px;">${isJa ? 'お見積もりのご案内' : 'Your Custom Quote'}</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding: 36px 32px 0;">
            <p style="margin: 0; font-size: 18px; color: #1e3a5f; font-weight: bold;">${isJa ? `${clientName} 様` : `Aloha, ${clientName}! 🌺`}</p>
            <p style="margin: 12px 0 0; font-size: 15px; color: #555; line-height: 1.7;">
              ${isJa
                ? 'この度はPulumi Hawaiiをご利用いただき、誠にありがとうございます。サービスのお見積もりをご用意いたしました。'
                : "Thank you for choosing Pulumi Hawaii! We've reviewed your request and prepared a custom quote for you."}
            </p>
          </td>
        </tr>

        <!-- Quote Box -->
        <tr>
          <td style="padding: 24px 32px;">
            <div style="background: #f8f6f3; border-left: 5px solid #1e3a5f; border-radius: 0 12px 12px 0; padding: 28px;">
              <p style="margin: 0 0 6px; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">${isJa ? 'お見積もり金額' : 'Your Quote'}</p>
              <p style="margin: 0; font-size: 48px; font-weight: bold; color: #1e3a5f; line-height: 1;">$${quoteAmount.toFixed(2)}</p>
              <p style="margin: 10px 0 0; color: #666; font-size: 14px;">${serviceLabel}</p>
              <p style="margin: 4px 0 0; color: #888; font-size: 13px;">${frequencyLabel}</p>
              ${date ? `<p style="margin: 4px 0 0; color: #888; font-size: 13px;">📅 ${date}</p>` : ''}
            </div>
          </td>
        </tr>

        <!-- Discount Banner (if applicable) -->
        ${discountBlock ? `<tr><td style="padding: 0 32px;">${discountBlock.replace('<tr>', '').replace('</tr>', '').replace(/<td colspan="2" style=".*?">/, '<div>').replace('</td>', '</div>')}</td></tr>` : ''}

        <!-- Details Table -->
        <tr>
          <td style="padding: 0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f6f3; border-radius: 12px; overflow: hidden; margin-top: 16px;">
              ${addons?.length ? `
              <tr>
                <td style="padding: 14px 20px; color: #888; font-size: 13px; width: 120px; border-bottom: 1px solid #ede9e3;">${isJa ? 'オプション' : 'Add-ons'}</td>
                <td style="padding: 14px 20px; color: #444; font-size: 13px; border-bottom: 1px solid #ede9e3;">${addons.join(', ')}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 14px 20px; color: #888; font-size: 13px;">${isJa ? '有効期限' : 'Quote valid'}</td>
                <td style="padding: 14px 20px; color: #444; font-size: 13px;">${isJa ? '7日間' : '7 days'}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding: 8px 32px 36px; text-align: center;">
            <p style="color: #555; font-size: 14px; margin: 0 0 20px; line-height: 1.7;">
              ${isJa
                ? '下記のボタンよりセキュアにお支払いください。お支払い確認後、予約が正式に確定となります。'
                : 'Click below to securely confirm and pay. Your booking is officially locked in once payment is received.'}
            </p>
            <a href="${paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2d5282); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-size: 16px; letter-spacing: 1px; font-family: Arial, sans-serif; font-weight: bold;">
              ${isJa ? '今すぐお支払い →' : 'Confirm & Pay Now →'}
            </a>
          </td>
        </tr>

        <!-- Help -->
        <tr>
          <td style="padding: 20px 32px; border-top: 1px solid #ede9e3; background: #faf8f6;">
            <p style="margin: 0; color: #888; font-size: 13px; text-align: center; line-height: 1.7;">
              ${isJa
                ? 'ご不明な点がございましたら、お気軽にお問い合わせください。<br>📧 pulumihawaii@gmail.com &nbsp;|&nbsp; 📞 (808) 227-7729'
                : 'Questions? We\'re always happy to help!<br>📧 pulumihawaii@gmail.com &nbsp;|&nbsp; 📞 (808) 227-7729'}
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #1a1a1a; padding: 20px 32px; text-align: center;">
            <p style="margin: 0; color: rgba(255,255,255,0.35); font-size: 11px;">© Pulumi Hawaii, LLC &nbsp;·&nbsp; 988 Halekauwila St, Honolulu, HI 96814</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { booking_id, quote_amount: rawAmount } = await req.json();
    const quote_amount = Number(rawAmount);

    if (!booking_id || !quote_amount || quote_amount <= 0 || isNaN(quote_amount)) {
      return Response.json({ error: 'booking_id and a valid quote_amount are required' }, { status: 400 });
    }

    const booking = await base44.asServiceRole.entities.Booking.get(booking_id);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const serviceLabel = serviceLabels[booking.service_type] || booking.service_type;
    const discount = booking.recurring_discount || 0;
    const originalAmount = discount > 0 ? Math.round(quote_amount / (1 - discount / 100) * 100) / 100 : null;
    const amountCents = Math.round(quote_amount * 100);
    const frequencyLabel = frequencyLabels[booking.recurring_frequency] || frequencyLabels.one_time;
    const frequencyLabelJa = frequencyLabelsJa[booking.recurring_frequency] || frequencyLabelsJa.one_time;

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
                frequencyLabel !== 'One-Time Service' ? frequencyLabel : null,
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
      metadata: { booking_id: booking.id },
    });

    // Update booking
    await base44.asServiceRole.entities.Booking.update(booking_id, {
      quote_amount,
      quote_amount_before_discount: originalAmount || quote_amount,
      payment_status: 'quote_sent',
      stripe_payment_link: session.url,
      stripe_session_id: session.id,
      status: 'confirmed',
    });

    // Send email
    const isJa = booking.language === 'ja';
    const emailBody = emailTemplate({
      lang: booking.language || 'en',
      clientName: booking.client_name,
      serviceLabel,
      frequencyLabel: isJa ? frequencyLabelJa : frequencyLabel,
      quoteAmount: quote_amount,
      originalAmount,
      discount,
      date: booking.preferred_date ? `${booking.preferred_date}${booking.preferred_time ? ` at ${booking.preferred_time}` : ''}` : null,
      addons: booking.addons,
      paymentUrl: session.url,
    });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: booking.client_email,
      from_name: 'Pulumi Hawaii',
      subject: isJa
        ? `【Pulumi Hawaii】お見積もりのご案内 — $${quote_amount.toFixed(2)}`
        : `Your Pulumi Hawaii Quote — $${quote_amount.toFixed(2)} 🌺`,
      body: emailBody,
    });

    return Response.json({ success: true, payment_url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});