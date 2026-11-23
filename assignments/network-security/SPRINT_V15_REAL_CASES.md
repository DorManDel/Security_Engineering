# Network Security Atlas V15 — Real Cases / Visible SYN Cookies

## What changed
- **SYN Flooding → Mitigation:** large, explicitly labeled SYN Cookies icon on the teaching network scene. It remains visible throughout the mitigation scenario and changes visual state when a valid ACK is checked. This replaces the ineffective tiny corner icon.
- **Real Cases:** four consistent one-screen historical case labs. Each uses **Normal → What changed → Security lesson**, Play/Pause, arrows, relevant explanatory text and sources.
- **Tunisia (2011–12):** side-by-side **original HTTP response** and **delivered page**. In the manipulation state only the delivered page gains a conspicuous *injected script* indicator. No usable JavaScript injection, fake credential form or data exfiltration is implemented.
- **Turkey (2014):** DNS blocking, public DNS 8.8.8.8 and lecture example of redirected traffic to 212.156.253.130. Clear distinction between the lecture's “BGP hijacking” label and outside analyses discussing details of routing.
- **Kazakhstan (2019):** trusted CA chain versus a newly installed Qaznet root, and browser distrust of the interception root.
- **Belarus (2020):** normal connectivity, election-period outages and subsequent network filtering, availability checks.

## Prompter / Drive
- Existing private Google Doc updated directly with **seven new everyday examples** for ARP, MAC, IP, BGP, DNS, SYN Flooding and TCP Hijacking. The DHCP hotel analogy was already present and remains.
- Four Hebrew historical-case narrations inserted, fifteen new gray `[ACTION: ...]` cues, source notes and a bridge into the closing notGoogle identity bonus.
- Source document: lecture slides 62–68; added context from CPJ, Google, Mozilla and OONI, with attribution in narration.
- No private script text was committed to public GitHub.

## Source fidelity and caveats
- The original slides call the Turkey example BGP hijacking; technical descriptions of the exact path interception mechanism vary. Do not claim certainty about route advertisement when lecture examples only show observed diversion.
- Belarus: neither TLS nor SYN cookies remedies a national network outage. Claims blaming DDoS are not treated as verified causes.
- Kazakhstan: root installation can alter the TLS trust decision; a padlock alone is not proof of official site ownership.
- Tunisia: we display a **read-only conceptual reconstruction** of delivered content, not the real Facebook login page.

## Navigation and rollback
- The eight teaching topics stay unchanged.
- Case selector retains the four existing countries; a new focused panel is opened within Slide 05.
- notGoogle remains a link and is the concluding bonus after the case summary.
- Snapshot: `snapshot/before-real-cases-and-cookie-fix-2026-11-23`.

## Validation
- [x] JS parsing: ARP and case lab
- [x] CSS balanced, SVG icon exists
- [x] Three case modes for all four cases
- [x] Main HTML includes new files after earlier presentation scripts
- [x] No executable injected credential collector or real credential inputs in historical reconstruction
- [x] Google Doc readback includes new analogies and gray Action text
- [ ] Live Chrome and iPad no-scroll / presentation mode check
- [ ] Timing rehearsal: 15-minute overall target
