# Network Atlas — Topics 01–04 visual unification

**Change scope:** first four topics receive a consistent three-mode animation lab, while all eight topics and Slide 05 share the same centered typography and desktop wrapper. This change does **not** overwrite the Hebrew speaker script in Drive.

## Topic presentation

One presentation stage with the eight-topic sidebar narrowed to about 218 CSS px on desktop. The selected topic occupies the remaining space. The same design language applies across Slide 04 and Slide 05: serif display titles, Inter-style body text, quiet glass panels, local SVG icons, consistent spacing.

A desktop viewport is designed to show the complete content without internal or page scrolling. A narrow device can scroll as an accessibility fallback until a separate compact/mobile layout is approved. Live device/browser fit is not yet verified.

### Four fully animated topics

- **ARP Poisoning:** ARP Request/Reply, real gateway MAC, forged sender MAC and ARP cache replacement, DAI inspection.
- **MAC Spoofing:** source-MAC presentation, cloned MAC under weak allowlist, 802.1X/NAC authentication.
- **IP Spoofing:** source/destination fields, forged IPv4 source, response to the spoofed victim, BCP 38 source filtering; not a forged TCP handshake.
- **DHCP:** full four-step DORA sequence, rogue offer with altered gateway/DNS options, DHCP snooping trusted/untrusted port filtering.

Each topic has **Normal**, **Attack**, **Mitigation**, 3/3/3 frames (DHCP normal has 4), the same left-center-right-bottom topology, field inspector that shows the changed value, matching five questions, two linked primary/educational references and direct navigation to network map/cases.

### Playback

- Left/right arrows move one semantic step, not the global slide.
- **Play / Pause** shows a caption as well as a local Lucide icon.
- **Replay** explicitly restarts the selected mode from step one.
- One small rectangular packet marker travels only on the relevant path while playing; red denotes spoofed/unauthorized flow, blue indicates the passive topology, gold shows intended network flow, green denotes validated network state.
- In normal ARP and DHCP, the attacker/rogue device is drawn as a passive member of the same broadcast domain. A broadcast can be overheard, but mere receipt is **not** a successful attack.

### Sources

RFC 826, IEEE 802.1X, Cisco MAC configuration and DHCP Snooping, BCP 38 / RFC 2827, RFC 791, RFC 2131. All links are displayed per selected topic.

## Scope saved for next four

BGP, DNS, SYN Flooding, TCP Hijacking. These still use the previous mechanism graphics until the user approves the first four's animation grammar. Their desktop typography/viewport is now consistent.

## Real cases and notGoogle

Slide 05 keeps the same four lecture-outline examples (Tunisia, Turkey, Kazakhstan, Belarus). **No causal link from ARP or DHCP to the cases has been invented.** The notGoogle identity appendix remains scheduled *after* the four historical cases, before closing, in the existing private prompter.

## Presenter drafts and approval

The four Hebrew presenter draft segments were shown in chat for review. Only the previously approved ARP section is already in Google Docs. MAC, IP, DHCP presenter scripts are **not added to Drive** until approved.

## QA and rollback

- Restore snapshot: `snapshot/topics-before-unified-v12-2026-11-23`.
- JavaScript parsing and HTML inline script parsing checked.
- All 12 mode definitions and 37 frame objects validated structurally (3×3, 3×3, 3×3, 4+3+3).
- CSS braces balanced; v12 stylesheet loaded after v11.
- [ ] Browser visual verification on 16:9 screen (fit and typography)
- [ ] iPad/phone interactions and reduced-motion check
- [ ] Confirm final animation correctness with screen recording
