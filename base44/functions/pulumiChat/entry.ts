import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// This is the single source of truth for services & addons.
// When you update lib/i18n.jsx, update this object too.
const SERVICES = {
  regular_cleaning: {
    title: "Regular Cleaning",
    desc: "Scheduled care that keeps your home consistently fresh and tidy. Customized routines for your space.",
    includes: ["Dusting & surface cleaning", "Vacuuming & mopping", "Kitchen & bathroom sanitizing", "Bed making & tidying", "Trash removal"],
  },
  deep_cleaning: {
    title: "Deep Cleaning",
    desc: "Move-in / move-out cleans with extra attention to high-impact areas. Thorough and transformative.",
    includes: ["All regular cleaning tasks", "Inside appliance cleaning", "Baseboards & light fixtures", "Window sill detailing", "Cabinet interior wipe-down"],
  },
  inspection: {
    title: "Inspection & Check-Ins",
    desc: "Simple property checks, light care services, and peace-of-mind updates for off-island owners.",
    includes: ["Property walkthrough", "Photo documentation", "Issue identification", "Light maintenance coordination", "Owner status report"],
  },
  care_services: {
    title: "Care Services",
    desc: "Flexible help tailored to your home's needs — ask and we'll coordinate.",
    includes: ["Lanai refresh", "Interior window polish", "Refrigerator deep clean", "Balcony care", "Custom requests welcome"],
  },
};

const ADDONS = [
  "Lanai Refresh",
  "Interior Window Polish",
  "Refrigerator Deep Clean",
  "Balcony Care",
  "Oven Cleaning",
  "Laundry Service",
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Fetch available dates for Shoko
    const availabilities = await base44.asServiceRole.entities.Availability.list();
    const availableDates = availabilities
      .filter(a => a.is_available && new Date(a.date) >= new Date())
      .map(a => ({ date: a.date, times: a.time_slots || [] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const availableDatesStr = availableDates.length > 0
      ? availableDates.slice(0, 10).map(a => `${a.date} (${a.times.join(', ')})`).join(', ')
      : 'Please contact us directly to arrange a custom date.';

    const SYSTEM_PROMPT = `You are Pulumi, a friendly and warm AI assistant for Pulumi Hawaii — a premium cleaning and property care service on Oʻahu, Hawaiʻi.

LANGUAGE: Detect the customer's language from their messages and always respond in the same language. If they write in Japanese, respond fully in Japanese. If they write in English, respond in English. Default to English if unclear.

You help customers:
1. Learn about available services and add-ons
2. Book a service by collecting all required info
3. Answer general questions about Pulumi Hawaii

SERVICES AVAILABLE:
${Object.entries(SERVICES).map(([key, s]) => `- ${s.title} (id: ${key}): ${s.desc}
  Includes: ${s.includes.join(', ')}`).join('\n')}

ADD-ONS AVAILABLE:
${ADDONS.map(a => `- ${a}`).join('\n')}

COMPANY INFO:
- Email: pulumihawaii@gmail.com
- Address: 988 Halekauwila St, Honolulu, HI 96814
- Free estimates available

SHOKO'S AVAILABLE DATES:
${availableDatesStr}

When discussing dates, always reference the available dates above. If the customer picks a date not in the list, suggest one of the available options instead.

BOOKING: To book, you need to collect:
1. Service type (one of: regular_cleaning, deep_cleaning, inspection, care_services)
2. Any add-ons (optional)
3. Preferred date (YYYY-MM-DD format — must be from the available dates list)
4. Preferred time (must be from the times available for that date)
5. Full name
6. Email address
7. Phone (optional)
8. Property address (optional)
9. Property type (condo, house, vacation_rental, other)
10. Number of bedrooms (optional)
11. Number of bathrooms (optional)
12. Special notes (optional)

When you have collected items 1, 3, 4, 5, and 6 (minimum required), confirm all details with the user and then respond with a JSON booking object at the end of your message in this exact format:
<BOOKING_DATA>{"service_type":"...","addons":[],"preferred_date":"...","preferred_time":"...","client_name":"...","client_email":"...","client_phone":"...","address":"...","property_type":"...","bedrooms":0,"bathrooms":0,"notes":"...","status":"pending"}</BOOKING_DATA>

Be warm, helpful, and concise. Use a friendly Hawaiian spirit. Keep responses short and conversational. Don't ask for all info at once — collect it naturally through conversation.`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation:\n${messages.map(m => `${m.role === 'user' ? 'Customer' : 'Pulumi AI'}: ${m.content}`).join('\n')}\n\nPulumi AI:`,
    });

    const content = typeof response === 'string' ? response : response?.result || response?.text || JSON.stringify(response);

    // Check if there's a booking to create
    const bookingMatch = content.match(/<BOOKING_DATA>([\s\S]*?)<\/BOOKING_DATA>/);
    let bookingCreated = false;
    let bookingId = null;

    if (bookingMatch) {
      const bookingData = JSON.parse(bookingMatch[1]);
      const booking = await base44.asServiceRole.entities.Booking.create(bookingData);
      bookingCreated = true;
      bookingId = booking.id;
    }

    // Clean the booking data tag from the message shown to user
    const cleanContent = content.replace(/<BOOKING_DATA>[\s\S]*?<\/BOOKING_DATA>/, '').trim();

    return Response.json({
      message: cleanContent,
      bookingCreated,
      bookingId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});