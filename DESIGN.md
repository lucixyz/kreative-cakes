---
name: Kreative Cakes
description: A neighborhood panaderya's glass display case, online. Cakes on shelves, a clipped price card on each.
colors:
  rose: "#9B5568"
  rose-deep: "#7F4256"
  rose-tint: "#F4E3E7"
  awning-pink: "#F0CDD6"
  glass: "#F4F3F1"
  card-stock: "#FFFDF8"
  card-stock-line: "#E6DFD0"
  steel: "#B9C1C5"
  ink: "#231A1D"
  muted: "#66595D"
  line: "#E2DDDB"
  tape-today-bg: "#CFE6C8"
  tape-today-text: "#1D4519"
  tape-preorder-bg: "#F8DFA8"
  tape-preorder-text: "#5A3D00"
  tape-sold-bg: "#DCDAD8"
  tape-sold-text: "#3B3536"
  admin-side: "#3A2229"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.4vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  price:
    fontFamily: "Caveat, cursive"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  tape: "2px"
  card: "8px"
  control: "10px"
  case: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
    height: "46px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.rose-deep}"
  price-card:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.ink}"
    rounded: "4px"
    padding: "16px 14px 14px"
  tape-today:
    backgroundColor: "{colors.tape-today-bg}"
    textColor: "{colors.tape-today-text}"
    rounded: "{rounded.tape}"
    padding: "3px 10px"
---

# Design System: Kreative Cakes

## Overview

The shop is a neighborhood panaderya's glass display case. Cakes sit on shelves and each carries a clipped price card that states what it costs, whether it is there today, and how many days ahead to order. The room is glass-white; rose is committed at page scale (awning, case back wall, primary actions). The same world carries the website, the mobile app and the admin, in three registers: Persuade (home), task screens (shop, cart, checkout, orders), Operate (admin).

Refused on purpose: a cream ground with a high-contrast serif and a centered hero over a row of equal cards.

## Colors

- **Rose (#9B5568)** and **Rose Deep (#7F4256)**: awning, header bar, case back wall, every primary action. White text on rose is 5.0:1.
- **Glass (#F4F3F1)** is the page ground; **Card Stock (#FFFDF8)** is used only for price cards, order slips, dialogs and records, so paper reads as paper.
- **Steel (#B9C1C5)** is the shelf, the clip on a price card and the case frame.
- **Tape colours** carry availability: green "Here today", amber "Order N days ahead", grey "Sold out today". Colour never works alone; the words are on the tape.
- Admin uses **Admin Side (#3A2229)** for the sidebar and the same tape tones for statuses.

## Typography

- **Bricolage Grotesque** (variable) for signs, headings and the wordmark, set tight (-0.02em).
- **Hanken Grotesk** (variable) for all UI text.
- **Caveat** only for prices and step numerals, because shop prices are handwritten. Never for sentences or labels.
- Fonts are self-hosted through Fontsource. The mobile app uses the platform sans (bold headings) until the fonts are bundled with expo-font.

## Layout

Page width 1180px, 16px gutters. Home is a sign (headline, two actions) over a full-width glass case of two shelves of four cakes (two across on phones). Inner pages keep the awning and flow into task layouts: filters left, shelf grid right; options and totals as order slips. Admin keeps a fixed 248px sidebar and 8px-radius record panels.

## Elevation & Depth

One declared depth device: the price card hangs below the cake with a soft downward shadow, and the shelf edge carries a soft shadow. Everything else is flat with a 1px card-stock line. No glass blur, no gradients except the awning artwork.

## Shapes

8px for surfaces and images, 10px for controls (buttons, inputs, tabs), 4px for price cards, 2px for tape, 12px for the case frame and dialogs. Pills are not used for controls.

## Components

- **Price card**: category, name, "From" with a handwritten price, availability tape, steel clip on top, overlapping the cake by 22px.
- **Tape**: availability and status, square-cornered, text always present.
- **Primary button**: rose, 46px, white text. Secondary: outlined ink. Both 10px.
- **Awning**: 80px SVG scallop pattern, rose and awning pink, hung from the header.
- **Order slip**: card-stock panel with a 1px line, used for cart lines, summaries, plans and records.

## Do's and Don'ts

- Do keep prices in peso, whole pesos, with lead times written out in words.
- Do label illustrations "Illustration" until real photography replaces them (`apps/web/public/images/`).
- Do keep the bakery's approval step visible wherever a custom design is quoted.
- Don't use handwriting for anything but prices and numerals.
- Don't add gradients, blur, or a second corner radius.
