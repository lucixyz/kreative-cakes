# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Web storefront and admin (Vite + React) and a customer mobile app (Expo, React Native). Mobile web stays `web`.

## Users

- **Customers** in the Philippines ordering celebration cakes for birthdays, weddings, anniversaries and corporate events. They browse ready-made cakes, or design a custom cake with an AI designer and a 3D builder, then pay and collect or receive delivery. They are often ordering for a date with a guest count, on a phone.
- **Bakery staff** running the shop in an admin dashboard: reviewing designs, quoting, verifying payments, planning production, managing the catalog and inventory.

## Product Purpose

An online cake shop where a customer can order a ready-made cake in minutes, or describe a celebration and get a cake design the bakers review and quote before any payment. Success: customers reach a confident, correctly priced order; the bakery gets designs it can actually produce.

## Positioning

AI-assisted custom cake design with mandatory bakery approval. The AI proposes; the bakers decide. Final design, price and availability always come from the bakery quotation.

## Operating Context

- Money is Philippine pesos, integer centavos. The server never trusts client prices.
- Custom cakes: design, event details, bakery review, quotation, deposit (50%), production, balance before handover.
- Payments through PayMongo (GCash, Maya, cards, online banking) or bank transfer with proof.
- Pickup or zoned delivery. Lead times and daily custom-cake capacity limit availability.
- Allergen information and a cancellation policy are part of the experience.

## Capabilities and Constraints

- Monorepo: `apps/web`, `apps/admin`, `apps/customer`, `apps/api`, shared packages. Mock auth and mock AI until real providers are connected.
- Staff and customers are separate portals. There is no public admin signup.
- Admin has about 17 sections (dashboard, orders, design review, quotations, payments, calendar, catalog, inventory, promotions, customers, messages, reviews, reports, settings).
- No real product photography exists yet. Generated illustrations stand in and must be labeled as such.

## Brand Commitments

- Name: Kreative Cakes.
- The rose accent (#9B5568 family) is the confirmed starting point and stays.
- Copy voice is warm and plain. Policy and legal wording is draft until reviewed by a lawyer.
- Prototype data must be labeled honestly; no invented testimonials, stats or claims.

## Evidence on Hand

- Claude Design canvas with about 110 screens (website, admin, mobile) and the earlier Design.pdf.
- Architecture docs in `docs/`.
- Generated cake illustrations in `apps/web/public/images/`.
