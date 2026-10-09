<div align="center">
  <h1>PulumiHawaii</h1>
  <p><strong>React and Base44 cleaning-service application with booking flows, availability management, quotes, and payment integrations.</strong></p>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-303840?style=flat-square" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-303840?style=flat-square" />
    <img alt="Base44" src="https://img.shields.io/badge/Base44-303840?style=flat-square" />
    <img alt="Stripe" src="https://img.shields.io/badge/Stripe-303840?style=flat-square" />
  </p>
  <p><a href="#overview">Overview</a> · <a href="#getting-started">Getting started</a> · <a href="#repository-map">Repository map</a></p>
</div>

---

## Overview

A cleaning-service application for Pulumi Hawaii, with a customer-facing service and booking experience plus administrative availability and booking tools. Its backend schema and functions are managed through Base44.

## What’s inside

- Service selection, scheduling details, and recurring-booking steps.
- Admin booking calendar, availability manager, and booking drawers.
- Server functions for quotes, booking notifications, payment notifications, and Stripe webhooks.

## Getting started

Install Node.js, then:

```sh
npm ci
```

Create an untracked `.env.local` with your own Base44 app configuration:

```dotenv
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-backend.example
```

Run `npm run dev`. Validate with `npm run lint`, `npm run typecheck`, and `npm run build`. The backend functions additionally require their own server-side provider configuration; browser environment variables cannot hold private payment or model secrets.

## Repository map

| Location | Purpose |
| --- | --- |
| [`src/components/booking/`](./src/components/booking/) | Customer booking steps |
| [`src/components/admin/`](./src/components/admin/) | Availability and booking management |
| [`src/components/landing/`](./src/components/landing/) | Customer-facing website sections |
| [`base44/entities/`](./base44/entities/) | Backend data schemas |
| [`base44/functions/`](./base44/functions/) | Notifications, quotes, chat, and payment webhooks |

## Project status

Base44-backed application. A local frontend does not reproduce the hosted backend or payment services. Review backend environment settings and the Base44 publish workflow before deployment. No relationship to the Pulumi infrastructure-as-code product is implied.
