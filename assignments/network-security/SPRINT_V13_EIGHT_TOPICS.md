# Network Atlas V13 — Eight Complete Protocol Attack Modules

## Shipped in this sprint
- **01 ARP Poisoning:** Normal ARP, forged MAC entry, DAI rejection. Mitigation explicitly shows the false attacker claim in red being blocked with an X, **while the victim continues on a separate valid path to the gateway**.
- **02 MAC Spoofing:** local source-MAC impersonation, weak allowlist, strong 802.1X/NAC verification.
- **03 IP Spoofing:** forged source IP, response-to-victim reflection scenario; BCP 38 source address filtering. Reminder: source IP spoofing alone does **not** establish a valid TCP session. Amplification requires an asymmetric response size or volume.
- **04 DHCP / Rogue DHCP:** Discover–Offer–Request–ACK, false DNS/router options, DHCP snooping.
- **05 BGP:** authorized prefix announcements, false prefix origin, RPKI origin validation; **not** full AS-path security.
- **06 DNS:** hostname lookup, accepted wrong A answer, DNSSEC validation and independent TLS hostname verification.
- **07 SYN Flooding:** normal three-way handshake, pending connection overload, SYN cookie/filtering tradeoffs.
- **08 TCP Hijacking:** TCP sequence/ack tracking, on-path injection assumption, TLS authenticated application records. TLS does not protect all TCP header fields.

Every module shares the same approved elegant Network Atlas layout, with 3 visually distinct **Normal / Attack / Mitigation** modes, five questions, per-mode explanatory stages, four field inspector cells, topic-specific info overlay and two references.

### Animation controls
- New topic or Normal/Attack/Mitigation selection → autoplay the selected scenario (5 loops × 1.45 seconds/stage, then stops).
- Play/Pause toggle **preserves an animated packet at its current location** while paused; Replay starts the scenario at stage 1.
- Previous/Next stop autoplay and select an explicit educational step.
- Topic playback buttons do not interfere with the Present stopwatch's Space shortcut.
- Reduced-motion system preference: static diagrams + manually navigable steps.
- SVG coordinates map exactly to the actor positions. A paused/stopped animation no longer leaves an off-map stray yellow marker.

### Speaker script
The existing private Google Doc now includes all eight **Hebrew** narration segments, each with simple explanations before describing the attack and individual gray `[ACTION: ...]` stage directions. The whole document uses consistent Arial typography; headings retain a clear hierarchy. No script content was committed to this public repository.

### Historical cases and closing identity demo
The four case outlines (Tunisia 2011–12, Turkey 2014, Kazakhstan 2019, Belarus 2020) remain unchanged. The existing notGoogle identity appendix remains after Real Cases, before closing. No undocumented association between a protocol attack and an historical event is claimed.

### Safety and fidelity
- No networking requests or real attack packets are emitted by the teaching simulations.
- Demonstration IP addresses and MAC addresses are illustrative examples.
- RPKI, DNSSEC, BCP 38, DHCP snooping, SYN cookies and TLS have stated prerequisites and limitations.
- References include RFC 826, 1035, 2131, 2827, 4035, 4271, 4987, 6811, 8446, 9293 and supporting Cisco/IEEE material.

### Verification checklist
- [x] Pre-change snapshot: `snapshot/atlas-before-eight-topics-v13-2026-11-23`
- [x] JavaScript syntax and CSS brace checks.
- [x] All eight topic profiles × 3 modes and per-step field / path-key checks.
- [x] Script reads back from Google Docs with eight sections and 26 formatted gray ACTION lines.
- [x] Source files committed and PR merged.
- [ ] Chrome screenshot/real-device no-scroll presentation check.
- [ ] Live testing of all 8 autoplay cycles, pause/resume, replay and slide exit on the user's display.
- [ ] iPad Safari and keyboard layout checks.

Do not claim browser visual QA is complete before it is actually tested.
