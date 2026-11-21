# Security Engineering — Assignment Library

This directory adds a **course-level learning hub** to the existing Cipher Atlas GitHub Pages repository without replacing the earlier presentation.

## Paths

- `/index.html` — existing Cipher Atlas; an **Assignments** tab links to the library.
- `/assignments/index.html` — assignment index, verified requirements, topic selection and local study status.
- `/assignments/network-security/index.html` — Network Security Atlas prototype.

All pages are static HTML/CSS/JS; there is no build step or remote dependency.

## Assignment 04 — lecture source

Source: **Network Security**, the lecturer's 69-page slide deck, especially page 69.

Page 69 lists **13 entries** (a mixture of protocols, attacks and techniques): ARP poisoning, MAC flooding, MAC spoofing, IP spoofing, SMURF attacks, NTP, DHCP, BGP, DNS, NAT, TCP scanning, SYN flooding and TCP hijacking. A handwritten instruction says to select **8**. The assignment also asks for an explanation of how the incidents discussed in the lecture were possible.

The hub does not silently label all entries as protocols. Previous assignments are deliberately left as **pending indexing** until their exact briefs and numbering are confirmed; this avoids fabricating requirements.

## Prototype contents

| Slide | Purpose | Interaction |
| --- | --- | --- |
| 00 | Network Security Atlas introduction | Subtle draggable CSS 3D network cube and Enter button |
| 01 | The journey of a packet | Browser mock, fresh vs cached network, play/pause/step/reset, packet inspector, safe look-alike search demonstration |
| 02 | Confidentiality, Integrity, Availability | Select CIA principle; compare HTTP and HTTPS payload visibility |
| 03 | Interactive Network Map | Click nodes/services; inspect DHCP/ARP/DNS/TCP; context on related lecture cases |

The demonstration uses fictional documentation addresses (e.g., `203.0.113.42`), does not access the network, and does not accept or collect credentials. The generic "Searchly" page demonstrates why a visual match is not evidence of site identity.

**Technical model**: DNS and DHCP are services rather than mandatory forwarding hops; ARP is local to IPv4 links; NAT/PAT can occur at the gateway; DNS/ARP may be cached; HTTP/3 uses QUIC/UDP (the main animation demonstrates HTTP over TCP and optionally TLS).

## Study state and privacy

Topic selection and review status are stored with browser `localStorage`. No telemetry, cloud sync, registration or network request is involved. Selections will not follow a student to another browser/device.

The speaker-notes drawer contains short Hebrew *presenter cues*. Keep the full private prompter draft in the course's existing private Google Drive folder rather than publishing it in the repository.

## Review checklist

- [x] No replacement of existing Cipher Atlas implementation.
- [x] Static relative links to the assignment library and new atlas.
- [x] Interactive controls for slides 00–03, with Reset/Step/Play.
- [x] Conceptual packet inspection with explicit simulated values.
- [x] Separate topic selection and study-review tracking.
- [x] Support `prefers-reduced-motion`; keyboard navigation and basic responsive layout.
- [ ] Browser visual regression on desktop/mobile, including a touch device.
- [ ] Confirm animations and copy with the presenter.
- [ ] Add eight approved protocol/attack deep dives and citations.
- [ ] Add Wireshark PCAP comparison, verified case references and final assignment write-up.

## Future assignment contract

For each new assignment, add an entry to the library with (a) the **source requirement** (not inferred), (b) an interactive learning module, (c) exam review topics/checklist, and (d) links to verified case studies. Keep working Hebrew scripts private.

