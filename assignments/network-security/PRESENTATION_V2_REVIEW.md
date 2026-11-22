# Presentation-first review | Slides 00–03
Date: 2026-11-22. Based on user screenshots and private Drive speaker script.

## Changes implemented
- Slide 00: borderless single Enter CTA; hide hero links; subtly soften cube; prevent text selection; color notGoogle header text (yellow not, multicolor Google).
- Slide 01: one forward/back action per complete protocol, with automatic sub-message animation (DHCP DORA, ARP, DNS, NAT, TCP, TLS, HTTP). Show one route, compact explanation, teaching analogy and directional packet travel.
- Slide 02: HTTP and HTTPS visible simultaneously. Three CIA selections share two readable comparison rows, metadata field chips and minimal packet motion. No needless HTTP/HTTPS toggle.
- Slide 03: one integrated topology map, proper SVG pictograms, a focused explanation tray, automatic mini-demo, and previous/next component controls.
- Private Google Doc: Hebrew wording and grey [ACTION] cues revised to match the new interactions. No prompter script placed in the public website.

## Accuracy checks
- DHCP Discover → Offer → Request → ACK; client lease not universal across all connections.
- ARP obtains local next-hop MAC, not the remote site's MAC.
- DNS resolver query is a separate request; DNS need not occur on a cached path.
- 8.8.8.8 is a public resolver, not the website itself.
- NAT = Network Address Translation. PAT = Port Address Translation.
- TCP handshake: SYN → SYN-ACK → ACK, using an explicitly TCP-based scenario.
- HTTPS hides HTTP application contents but some traffic metadata may remain observable.
- All packet addresses are documentation-only simulated values.

## QA remaining (do not call these fixed until verified live)
- [ ] Slide 00 single CTA and soft cube tested on Chrome and Safari; drag no blue selections.
- [ ] Slide 01 arrow advances entire concept; messages run automatically in correct order.
- [ ] Slide 01 warm/cached scenario and URL changes behave clearly.
- [ ] Slide 02 two-row comparison stays visible at 16:9 and iPad and shows correct distinctions.
- [ ] Slide 03 nodes and lines align, explanation tray is legible, interactions intuitive.
- [ ] Keyboard navigation, fullscreen, portrait, reduced-motion QA.
- [ ] Presenter approves narrative and visual direction.

Existing slides 04 and 05 remain untouched. Old hidden markup remains temporarily for compatibility, to be cleaned after sign-off.