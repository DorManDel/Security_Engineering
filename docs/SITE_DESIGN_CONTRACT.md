# Security Engineering — Site Design Contract

## Purpose
A course presentation library. **Security Engineering** is the product/site identity; individual presentation names are not global navigation. The homepage is a clean dashboard, never an assignment-specific landing page.

## Layout and design
- Navy / cyan palette, Georgia editorial headings, glass surfaces, subtle starfield.
- Header: clickable **Security Engineering** brand -> homepage, Assignments (homepage), Settings.
- Responsive grid, **data-driven for 8+ presentations**, simple search, no gigantic hero.
- Cards: restrained border shimmer, cursor spotlight, light elevation. Contain effects inside card bounds.
- Optional motion and background settings saved locally; respect reduced motion.
- No promotional narrative, selected-topic widgets, attack-case footers, Network Security section, or feedback blocks on homepage.

## Information architecture
- `/` — homepage
- `/presentations/01/` — security failures (PowerPoint / PDF viewer)
- `/presentations/02/` — cryptography and stream ciphers (PowerPoint / PDF viewer)
- `/presentations/03/` — original interactive Cipher Atlas
- `/assignments/network-security/` — existing interactive assignment 04
- Future presentations get catalog entries, not handwritten new homepage sections.

## Presentation Viewer contract
- Always show Home, deck title, Open PDF, Download PDF (when loaded), Fullscreen.
- Browser PDF viewer supports native slide navigation and zoom.
- Viewer automatically loads `slides.pdf` in each presentation folder **when present**, or lets visitor choose a PDF from their device.
- PPTX originals and media are not equivalent to PDF; PDF discards timing/transitions/videos.
- Keep PPTX archives and separate video/GIF media when publishing. Do not claim a PDF retains animation.
- External asset paths and missing PDFs must be tested before calling a deck published.
- Do not alter original interactive decks solely for homepage integration.

## Current assets to publish
- Assignment 01: `Presentation1.pptx`, 13 slides, GIF.
- Assignment 02: `הנדסת-אבטחה-מטלה-2.pptx`, 23 slides, two GIFs and an MP4.
- LibreOffice-generated PDFs have been prepared externally but **are not yet committed** to this GitHub branch. Commit them as `presentations/01/slides.pdf` and `presentations/02/slides.pdf` for automatic online viewing. Add PPTX originals as separate downloads if desired.
- Verify animation placement manually before claiming media support.

## Release checklist
1. Test root, each card and brand/home links.
2. Test 320px, 390px, 768px, 1440px, 1920px.
3. Test desktop pointer, touch, keyboard focus and reduced motion.
4. Verify each published PDF loads, download works, mobile PDF rendering.
5. Verify original Cipher Atlas full navigation and interactive code demos.
6. Merge from feature branch to main only after review.
