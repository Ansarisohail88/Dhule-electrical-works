# Dhule Electrical Works - Official Website & PWA

Premium, modern, mobile-first website for **Dhule Electrical Works**, providing 24x7 electrician services in **Dhule, Maharashtra, India**.

---

## 🌟 Highlights & Key Features

- **Theme & Aesthetics**: Premium Electric Royal Blue (`#0F52BA`), Safety Yellow (`#FFD700`), Glassmorphism cards, and dark mode toggle.
- **Conversion-Optimized**: Instant "Call Now" buttons, direct WhatsApp chat links with pre-filled message templates, quick service booking popups, and emergency 24x7 call popups.
- **All 17 Electrical Services**:
  1. House Wiring
  2. Electrical Repair & Short Circuit
  3. Fan Installation
  4. Light Installation
  5. MCB Installation
  6. RCCB Shock Protection
  7. Distribution Board Fitting
  8. Inverter & Battery Wiring
  9. UPS System Setup
  10. Water Pump & Submersible Wiring
  11. Motor Starter Panel Fitting
  12. Chemical Earthing
  13. CCTV Camera Wiring
  14. Door Bell & Video Door Phone
  15. Switchboard Repair & Modular Fitting
  16. Outdoor & Garden Lighting
  17. Commercial & Industrial Wiring
- **Interactive Tools**:
  - Live Search Bar & Category Filter Tabs
  - Instant Cost Estimator / Pricing Calculator
  - Before/After Image Comparison Slider
  - Photo Gallery with Image Lightbox
  - Customer Review Carousel + Live Review Submission Form
  - FAQ Accordion with smooth height transitions
  - Service Booking Modal & 24x7 Emergency Call Modal
  - Dark Mode Toggle with persistence in `localStorage`
  - Scroll To Top Button & Mobile Quick Action Bar
- **SEO & PWA Optimized**:
  - Schema.org LocalBusiness JSON-LD structured data for Dhule, Maharashtra
  - `sitemap.xml` and `robots.txt`
  - `manifest.json` for Add to Home Screen PWA support
  - `service-worker.js` with offline caching strategy

---

## 📁 File Structure

```text
/
├── index.html         # Main web application entrypoint
├── style.css          # CSS3 custom styles, variables, theme, animations
├── script.js          # Modern ES6+ JavaScript for interactive features
├── manifest.json      # Progressive Web App manifest file
├── service-worker.js  # Service worker for offline caching
├── robots.txt         # Search engine crawling rules
├── sitemap.xml        # XML Sitemap for search engine indexing
├── README.md          # Project documentation
└── src/assets/images/ # Generated high-resolution images
```

---

## ⚙️ Customization Guide

1. **Changing Phone Number & WhatsApp**:
   - Search for `+919876543210` or `919876543210` across `index.html` and `script.js` and replace with your business phone number.
2. **Updating Location / Address**:
   - Search for `Deopur, Dhule, Maharashtra` in `index.html` and `script.js` to update shop address or service areas.
3. **Modifying Services or Pricing**:
   - Open `script.js` and modify the `SERVICES_DATA` array or `baseRates` object inside `initPricingCalculator()`.

---

## 🚀 Running locally

In this Vite development environment, start the server using:

```bash
npm run dev
```

Visit `http://localhost:3000` to preview the live app.
