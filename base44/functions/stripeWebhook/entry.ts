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

function confirmationEmail({ lang, clientName, serviceLabel, frequencyLabel, amount, date, address, discount, propertyType, bedrooms, bathrooms, addons, notes }) {
  const isJa = lang === 'ja';
  const isRecurring = discount > 0;

  const propertyTypeLabels = { condo: 'Condo', house: 'House', vacation_rental: 'Vacation Rental', other: 'Other' };
  const propertyTypeLabelsJa = { condo: 'コンドミニアム', house: '一戸建て', vacation_rental: 'バケーションレンタル', other: 'その他' };

  const propertyRow = propertyType ? `
    <tr style="border-bottom:1px solid #ede9e3;">
      <td style="padding:13px 20px; color:#888; font-size:13px; width:130px;">${isJa ? '物件タイプ' : 'Property'}</td>
      <td style="padding:13px 20px; color:#333; font-size:13px;">${isJa ? (propertyTypeLabelsJa[propertyType] || propertyType) : (propertyTypeLabels[propertyType] || propertyType)}${bedrooms ? ` &nbsp;·&nbsp; ${bedrooms} ${isJa ? '寝室' : 'bed'}` : ''}${bathrooms ? ` &nbsp;·&nbsp; ${bathrooms} ${isJa ? 'バス' : 'bath'}` : ''}</td>
    </tr>` : '';

  const addonsRow = addons && addons.length ? `
    <tr style="border-bottom:1px solid #ede9e3;">
      <td style="padding:13px 20px; color:#888; font-size:13px;">${isJa ? 'オプション' : 'Add-ons'}</td>
      <td style="padding:13px 20px; color:#333; font-size:13px;">${addons.join(' · ')}</td>
    </tr>` : '';

  const notesRow = notes ? `
    <tr style="border-bottom:1px solid #ede9e3;">
      <td style="padding:13px 20px; color:#888; font-size:13px; vertical-align:top;">${isJa ? 'ご要望' : 'Notes'}</td>
      <td style="padding:13px 20px; color:#555; font-size:13px; font-style:italic;">${notes}</td>
    </tr>` : '';

  const recurringBadge = isRecurring ? `
    <tr>
      <td colspan="2" style="padding:14px 20px; background:#e8f5e9; border-top:1px solid #c8e6c9;">
        <p style="margin:0; color:#2e7d32; font-size:13px;">
          🔄 ${isJa ? `${frequencyLabel}の定期プランが設定されました。次回以降の日程は追ってご連絡します。` : `Your ${frequencyLabel} is active. We'll be in touch to schedule your next visit.`}
        </p>
      </td>
    </tr>` : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5282 100%); padding:44px 32px; text-align:center;">
            <p style="margin:0 0 6px; color:rgba(255,255,255,0.55); font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family:Arial,sans-serif;">${isJa ? 'プレミアムクリーニング＆プロパティケア' : 'PREMIUM CLEANING & PROPERTY CARE'}</p>
            <h1 style="margin:0 0 20px; color:#ffffff; font-size:30px; font-weight:normal; letter-spacing:5px;">PULUMI HAWAII</h1>
            <div style="display:inline-block; width:60px; height:60px; background:rgba(255,255,255,0.18); border-radius:50%; font-size:30px; line-height:60px; text-align:center;">✓</div>
            <p style="margin:14px 0 0; color:rgba(255,255,255,0.85); font-size:15px; letter-spacing:0.5px; font-family:Arial,sans-serif;">${isJa ? 'ご予約確定のお知らせ' : 'Booking Confirmed'}</p>
          </td>
        </tr>

        <!-- Confirmed Banner -->
        <tr>
          <td style="background:#e8f5e9; padding:14px 32px; text-align:center; border-bottom:1px solid #c8e6c9;">
            <p style="margin:0; color:#2e7d32; font-size:15px; font-weight:bold; font-family:Arial,sans-serif;">
              ${isJa ? '✅ お支払いが確認されました — ご予約が正式に確定しました' : '✅ Payment received — your booking is officially confirmed!'}
            </p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 32px 8px;">
            <p style="margin:0; font-size:20px; color:#1e3a5f; font-weight:bold;">${isJa ? `${clientName} 様` : `Aloha, ${clientName}! 🌺`}</p>
            <p style="margin:12px 0 0; font-size:15px; color:#555; line-height:1.8; font-family:Arial,sans-serif;">
              ${isJa
                ? 'お支払いを確認いたしました。ご予約が正式に確定しましたことをお知らせします。当日スタッフがお伺いするのを楽しみにしております。'
                : "Thank you for choosing Pulumi Hawaii! Your payment has been received and your booking is all set. We look forward to caring for your home."}
            </p>
          </td>
        </tr>

        <!-- Booking Summary -->
        <tr>
          <td style="padding:24px 32px 8px;">
            <div style="background:#f8f6f3; border-radius:12px; overflow:hidden; border:1px solid #ede9e3;">
              <div style="background:#1e3a5f; padding:14px 20px;">
                <p style="margin:0; color:#ffffff; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; font-family:Arial,sans-serif;">${isJa ? 'ご予約内容' : 'Booking Summary'}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:13px 20px; color:#888; font-size:13px; width:130px; font-family:Arial,sans-serif;">${isJa ? 'サービス' : 'Service'}</td>
                  <td style="padding:13px 20px; color:#1e3a5f; font-size:14px; font-weight:bold; font-family:Arial,sans-serif;">${serviceLabel}</td>
                </tr>
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:13px 20px; color:#888; font-size:13px; font-family:Arial,sans-serif;">${isJa ? 'プラン' : 'Plan'}</td>
                  <td style="padding:13px 20px; color:#333; font-size:13px; font-family:Arial,sans-serif;">${frequencyLabel}</td>
                </tr>
                ${date ? `
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:13px 20px; color:#888; font-size:13px; font-family:Arial,sans-serif;">${isJa ? '日程' : 'Date & Time'}</td>
                  <td style="padding:13px 20px; color:#333; font-size:13px; font-family:Arial,sans-serif;">📅 ${date}</td>
                </tr>` : ''}
                ${address ? `
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:13px 20px; color:#888; font-size:13px; font-family:Arial,sans-serif;">${isJa ? '住所' : 'Address'}</td>
                  <td style="padding:13px 20px; color:#333; font-size:13px; font-family:Arial,sans-serif;">📍 ${address}</td>
                </tr>` : ''}
                ${propertyRow}
                ${addonsRow}
                ${notesRow}
                <tr style="border-bottom:1px solid #ede9e3;">
                  <td style="padding:15px 20px; color:#888; font-size:13px; font-family:Arial,sans-serif;">${isJa ? '支払い金額' : 'Amount Paid'}</td>
                  <td style="padding:15px 20px; color:#1e3a5f; font-size:18px; font-weight:bold; font-family:Arial,sans-serif;">${amount}</td>
                </tr>
                ${recurringBadge}
              </table>
            </div>
          </td>
        </tr>

        <!-- What to Expect -->
        <tr>
          <td style="padding:16px 32px 28px;">
            <div style="background:#fef9f0; border:1px solid #fde68a; border-radius:12px; padding:20px 24px;">
              <p style="margin:0 0 10px; color:#92400e; font-size:13px; font-weight:bold; font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:1px;">${isJa ? '🌟 ご来訪前のご確認' : '🌟 What to Expect'}</p>
              <ul style="margin:0; padding-left:20px; color:#78350f; font-size:13px; line-height:2; font-family:Arial,sans-serif;">
                ${isJa ? `
                <li>当日スタッフがご指定の時間にお伺いします</li>
                <li>ご不在の場合は事前に入室方法をお知らせください</li>
                <li>特別なご要望があればいつでもご連絡ください</li>
                <li>定期サービスの場合は次回の日程を追ってご連絡します</li>` : `
                <li>Our team will arrive promptly at your scheduled time</li>
                <li>If you won't be home, please send us your access instructions</li>
                <li>We'll follow up after service with a completion note</li>
                <li>For recurring plans, we'll confirm your next visit date soon</li>`}
              </ul>
            </div>
          </td>
        </tr>

        <!-- Contact Info -->
        <tr>
          <td style="padding:0 32px 32px;">
            <div style="background:#f0f4fa; border:1px solid #c7d8ef; border-radius:12px; padding:22px 24px;">
              <p style="margin:0 0 14px; color:#1e3a5f; font-size:13px; font-weight:bold; font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:1px;">${isJa ? '📞 お問い合わせ' : '📞 Contact Us'}</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 0; color:#1e3a5f; font-size:13px; font-family:Arial,sans-serif; width:24px;">📧</td>
                  <td style="padding:4px 0;"><a href="mailto:pulumihawaii@gmail.com" style="color:#1e3a5f; font-size:13px; font-family:Arial,sans-serif; text-decoration:none; font-weight:500;">pulumihawaii@gmail.com</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 0; color:#1e3a5f; font-size:13px; font-family:Arial,sans-serif;">📞</td>
                  <td style="padding:4px 0;"><a href="tel:+18082277729" style="color:#1e3a5f; font-size:13px; font-family:Arial,sans-serif; text-decoration:none; font-weight:500;">(808) 227-7729</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 0; color:#1e3a5f; font-size:13px; font-family:Arial,sans-serif;">📍</td>
                  <td style="padding:4px 0; color:#555; font-size:13px; font-family:Arial,sans-serif;">988 Halekauwila St, Honolulu, HI 96814</td>
                </tr>
              </table>
              <p style="margin:14px 0 0; color:#555; font-size:12px; font-family:Arial,sans-serif; line-height:1.7;">
                ${isJa
                  ? 'ご不明な点やご変更がある場合は、お気軽にご連絡ください。24時間以内にご返答いたします。'
                  : 'Have questions or need to make changes? Reach out anytime — we typically respond within a few hours.'}
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a1a; padding:22px 32px; text-align:center;">
            <p style="margin:0 0 4px; color:rgba(255,255,255,0.5); font-size:12px; font-family:Arial,sans-serif; letter-spacing:2px;">PULUMI HAWAII, LLC</p>
            <p style="margin:0; color:rgba(255,255,255,0.3); font-size:11px; font-family:Arial,sans-serif;">988 Halekauwila St, Honolulu, HI 96814 &nbsp;·&nbsp; © 2026 All Rights Reserved</p>
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
        // Mark booking as paid & confirmed
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
          const isRecurring = booking.recurring_frequency && booking.recurring_frequency !== 'one_time';

          // 1. Email the CLIENT — booking confirmed
          const clientEmailBody = confirmationEmail({
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
            propertyType: booking.property_type,
            bedrooms: booking.bedrooms,
            bathrooms: booking.bathrooms,
            addons: booking.addons,
            notes: booking.notes,
          });

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.client_email,
            from_name: 'Pulumi Hawaii',
            subject: isJa
              ? '【Pulumi Hawaii】お支払い確認・ご予約確定のお知らせ 🌺'
              : `Booking Confirmed — See You Soon, ${booking.client_name}! 🌺`,
            body: clientEmailBody,
          });

          // 2. Email the ADMIN — payment received alert
          const adminEmailBody = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e5f3a,#2d8252); padding:36px 32px; text-align:center;">
            <p style="margin:0 0 4px; color:rgba(255,255,255,0.6); font-size:11px; letter-spacing:3px; text-transform:uppercase;">PULUMI HAWAII</p>
            <h1 style="margin:0; color:#fff; font-size:22px; font-weight:normal; letter-spacing:2px;">💳 Payment Received!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0; font-size:18px; color:#1e5f3a; font-weight:bold;">${booking.client_name} just paid ${amount}</p>
            <p style="margin:8px 0 0; font-size:14px; color:#555;">
              <strong>${serviceLabel}</strong>${isRecurring ? ` — ${freqLabel}` : ''}
              ${booking.preferred_date ? ` on <strong>${booking.preferred_date}</strong>${booking.preferred_time ? ` at <strong>${booking.preferred_time}</strong>` : ''}` : ''}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f3; border-radius:12px; overflow:hidden;">
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px; width:130px;">Client</td>
                <td style="padding:12px 20px; color:#333; font-size:13px; font-weight:bold;">${booking.client_name}</td>
              </tr>
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Email</td>
                <td style="padding:12px 20px; font-size:13px;"><a href="mailto:${booking.client_email}" style="color:#1e3a5f;">${booking.client_email}</a></td>
              </tr>
              ${booking.client_phone ? `<tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Phone</td>
                <td style="padding:12px 20px; font-size:13px;"><a href="tel:${booking.client_phone}" style="color:#1e3a5f;">${booking.client_phone}</a></td>
              </tr>` : ''}
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Amount Paid</td>
                <td style="padding:12px 20px; color:#1e5f3a; font-size:16px; font-weight:bold;">${amount}</td>
              </tr>
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Service</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${serviceLabel}</td>
              </tr>
              <tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Frequency</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${freqLabel}${isRecurring ? ` <span style="color:#2e7d32;">🔄</span>` : ''}</td>
              </tr>
              ${booking.preferred_date ? `<tr style="border-bottom:1px solid #ede9e3;">
                <td style="padding:12px 20px; color:#888; font-size:13px;">Date & Time</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${booking.preferred_date}${booking.preferred_time ? ` at ${booking.preferred_time}` : ''}</td>
              </tr>` : ''}
              ${booking.address ? `<tr>
                <td style="padding:12px 20px; color:#888; font-size:13px;">Address</td>
                <td style="padding:12px 20px; color:#333; font-size:13px;">${booking.address}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 36px; text-align:center;">
            <a href="https://pulumihawaii.base44.app/admin" style="display:inline-block; background:linear-gradient(135deg,#1e3a5f,#2d5282); color:#fff; text-decoration:none; padding:16px 40px; border-radius:50px; font-size:15px; letter-spacing:1px; font-family:Arial,sans-serif; font-weight:bold;">
              View in Admin Panel →
            </a>
          </td>
        </tr>
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
            to: 'pulumihawaii@gmail.com',
            from_name: 'Pulumi Hawaii Payments',
            subject: `💳 Payment Received: ${booking.client_name} — ${amount}${isRecurring ? ` [${freqLabel}]` : ''}`,
            body: adminEmailBody,
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});