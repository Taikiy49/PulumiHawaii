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
  monthly: 'Monthly Plan',
  biweekly: 'Bi-Weekly Plan',
  weekly: 'Weekly Plan',
};

const frequencyLabelsJa = {
  one_time: '1回のみ',
  monthly: '月1回プラン',
  biweekly: '隔週プラン',
  weekly: '毎週プラン',
};

function confirmationEmail({ lang, clientName, serviceLabel, frequencyLabel, amount, date, address, discount }) {
  const isJa = lang === 'ja';
  const isRecurring = discount > 0;

  const nextVisitNote = isRecurring
    ? `<p style="margin:8px 0 0; color:#388e3c; font-size:13px;">
        ${isJa ? `✓ ${frequencyLabel}の定期プランが設定されました。` : `✓ Your ${frequencyLabel} is set up. We'll be in touch to confirm future visits.`}
       </p>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#2d5282); padding:40px 32px; text-align:center;">
            <p style="margin:0 0 4px; color:rgba(255,255,255,0.6); font-size:11px; letter-spacing:3px; text-transform:uppercase;">${isJa ? 'プレミアムクリーニング＆プロパティケア' : 'PREMIUM CLEANING & PROPERTY CARE'}</p>
            <h1 style="margin:0; color:#fff; font-size:28px; font-weight:normal; letter-spacing:4px;">PULUMI HAWAII</h1>
            <div style="margin:16px auto 0; width:56px; height:56px; background:rgba(255,255,255,0.15); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; line-height:56px; text-align:center;">✓</div>
          </td>
        </tr>

        <!-- Confirmed Banner -->
        <tr>
          <td style="background:#e8f5e9; padding:16px 32px; text-align:center; border-bottom:1px solid #c8e6c9;">
            <p style="margin:0; color:#2e7d32; font-size:16px; font-weight:bold; letter-spacing:0.5px;">
              ${isJa ? '✅ お支払いが確認されました — ご予約確定' : '✅ Payment Received — Booking Confirmed!'}
            </p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 32px 0;">
            <p style="margin:0; font-size:18px; color:#1e3a5f; font-weight:bold;">${isJa ? `${clientName} 様` : `Aloha, ${clientName}! 🌺`}</p>
            <p style="margin:12px 0 0; font-size:15px; color:#555; line-height:1.7;">
              ${isJa
                ? 'お支払いを確認いたしました。ご予約が正式に確定いたしましたことをお知らせします。当日お伺いするのを楽しみにしております。'
                : "Great news — your payment has been received and your booking is officially confirmed. We can't wait to take care of your home!"}
            </p>
          </td>
        </tr>

        <!-- Booking Details Box -->
        <tr>
          <td style="padding:24px 32px;">
            <div style="background:#f8f6f3; border-radius:12px; overflow:hidden;">
              <div style="background:#1e3a5f; padding:14px 20px;">
                <p style="margin:0; color:#fff; font-size:12px; letter-spacing:2px; text-transform:uppercase;">${isJa ? 'ご予約内容' : 'Booking Summary'}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:14px 20px; color:#888; font-size:13px; width:120px;">${isJa ? 'サービス' : 'Service'}</td>
                  <td style="padding:14px 20px; color:#1e3a5f; font-size:14px; font-weight:bold;">${serviceLabel}</td>
                </tr>
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:14px 20px; color:#888; font-size:13px;">${isJa ? 'プラン' : 'Plan'}</td>
                  <td style="padding:14px 20px; color:#333; font-size:13px;">${frequencyLabel}</td>
                </tr>
                ${date ? `
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:14px 20px; color:#888; font-size:13px;">${isJa ? '日程' : 'Date'}</td>
                  <td style="padding:14px 20px; color:#333; font-size:13px;">📅 ${date}</td>
                </tr>` : ''}
                ${address ? `
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:14px 20px; color:#888; font-size:13px;">${isJa ? '住所' : 'Address'}</td>
                  <td style="padding:14px 20px; color:#333; font-size:13px;">📍 ${address}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:14px 20px; color:#888; font-size:13px;">${isJa ? '支払い金額' : 'Amount Paid'}</td>
                  <td style="padding:14px 20px; color:#1e3a5f; font-size:16px; font-weight:bold;">${amount}</td>
                </tr>
              </table>
              ${nextVisitNote ? `<div style="padding:14px 20px; border-top:1px solid #ede9e3;">${nextVisitNote}</div>` : ''}
            </div>
          </td>
        </tr>

        <!-- What to Expect -->
        <tr>
          <td style="padding:0 32px 32px;">
            <div style="background:#fef9f0; border:1px solid #fde68a; border-radius:12px; padding:20px;">
              <p style="margin:0 0 8px; color:#92400e; font-size:13px; font-weight:bold;">${isJa ? 'ご来訪前のご確認' : 'What to Expect'}</p>
              <ul style="margin:0; padding-left:18px; color:#78350f; font-size:13px; line-height:1.8;">
                ${isJa ? `
                <li>当日スタッフがご指定の時間にお伺いします</li>
                <li>ご不在の場合はご入室方法をご連絡ください</li>
                <li>ご質問があればいつでもご連絡ください</li>` : `
                <li>Our team will arrive at your scheduled time</li>
                <li>If you won't be home, please share access instructions</li>
                <li>Feel free to reach out if you have any special requests</li>`}
              </ul>
            </div>
          </td>
        </tr>

        <!-- Help -->
        <tr>
          <td style="padding:20px 32px; border-top:1px solid #ede9e3; background:#faf8f6;">
            <p style="margin:0; color:#888; font-size:13px; text-align:center; line-height:1.8;">
              ${isJa
                ? 'ご不明な点はお気軽にご連絡ください<br>📧 pulumihawaii@gmail.com &nbsp;|&nbsp; 📞 (808) 227-7729'
                : 'Questions? We\'re here for you!<br>📧 pulumihawaii@gmail.com &nbsp;|&nbsp; 📞 (808) 227-7729'}
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a1a; padding:20px 32px; text-align:center;">
            <p style="margin:0; color:rgba(255,255,255,0.35); font-size:11px;">© Pulumi Hawaii, LLC &nbsp;·&nbsp; 988 Halekauwila St, Honolulu, HI 96814</p>
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
        await base44.asServiceRole.entities.Booking.update(bookingId, {
          payment_status: 'paid',
          status: 'confirmed',
        });

        const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
        if (booking?.client_email) {
          const isJa = booking.language === 'ja';
          const serviceLabel = serviceLabels[booking.service_type] || booking.service_type;
          const freqLabel = isJa
            ? (frequencyLabelsJa[booking.recurring_frequency] || frequencyLabelsJa.one_time)
            : (frequencyLabels[booking.recurring_frequency] || frequencyLabels.one_time);
          const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : '';
          const discount = booking.recurring_discount || 0;

          const emailBody = confirmationEmail({
            lang: booking.language || 'en',
            clientName: booking.client_name,
            serviceLabel,
            frequencyLabel: freqLabel,
            amount,
            date: booking.preferred_date
              ? `${booking.preferred_date}${booking.preferred_time ? ` at ${booking.preferred_time}` : ''}`
              : null,
            address: booking.address,
            discount,
          });

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.client_email,
            from_name: 'Pulumi Hawaii',
            subject: isJa
              ? '【Pulumi Hawaii】お支払い確認・ご予約確定のお知らせ 🌺'
              : `Booking Confirmed — See You Soon, ${booking.client_name}! 🌺`,
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