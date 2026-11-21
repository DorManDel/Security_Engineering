# Network Atlas — Worklog and next review

## Sprint 01: Visual behavior and course skeleton

**Branch:** `feature/atlas-traffic-animation-protocols`  
**Source:** existing restrained Cipher Atlas design, user iPad landscape feedback, Animation Storyboard / Issues #2–#11.

### Implemented in code (browser QA still required)

| Area | Work added | What to test |
| --- | --- | --- |
| Intro cube | Auto rotation moved to an outer orbit so drag orientation and autonomous motion do not overwrite each other; a 3D set of interior nodes/links and moving packet markers. | Drag and release on iPad Safari / Windows; confirm smooth continuous orbit, legibility and depth. |
| Journey | Message-level exchange animations: WLAN, DHCP DORA, ARP request/reply, DNS query/answer, routing/NAT, TCP handshake, TLS and HTTP. A gold packet also moves along the conceptual main route. | Sender/recipient direction, broadcast vs unicast labels, visibility on landscape iPad and Chrome. |
| Packet inspection | Existing packet-field panel remains synchronized to the main protocol event; message-level controls supplement the event-level inspector. | Confirm no stale fields after switching cold/warm network or HTTP/HTTPS. |
| Threat teaching | `Where is the risk?` expandable explanation per journey stage. | Technical accuracy and compact layout. |
| CIA | Contextual visual sequences for reading plaintext/encrypted traffic, unauthorized edits and service disruption. | Select each CIA goal and compare both HTTP and HTTPS. |
| Network Map | Beat-by-beat component mini-labs reuse existing card structure. | Router/DHCP/ARP/DNS/TCP, touch controls, link to cases. |
| Selected eight | A dedicated presentation section covers ARP poisoning, MAC spoofing, IP spoofing, DHCP, BGP, DNS, SYN flooding and TCP hijacking with a four-stage conceptual strip and defense points. | Review the selected topic list with the lecturer brief before final submission. |
| Case studies | Separate slide outlines Tunisia (2011–12), Turkey (2014), Kazakhstan (2019), Belarus (2020) in `normal → intervention → consequence` format. | Verify actual incident facts and references; these are initial lecture-grounded outlines. |
| notGoogle | Original `DorManDel/notGoogle` HTML copied verbatim as a standalone classroom page; visible links from presentation header, intro, cases and course index. | Open in a new tab on iPad; check reveal flow and return navigation. |
| Transitions | Direction-aware subtler slide reveals and stage focus, using approved palette and reduced-motion support. | Confirm actual visual and performance behavior. |

### Not yet complete

- **Full classroom visual QA** on iPad Safari, desktop and portrait phone. No issue should be closed until verification.
- **True 3D packet graph/physics:** the cube has DOM/CSS 3D nodes and animated links, but it is not a packet-routing engine or neural network.
- **Deep attack simulations** for each of the eight topics; current section is a structured, interactive learning skeleton.
- **PCAP/Wireshark data** and full protocol-by-protocol forensic packet views.
- **Case fact checking and references** for the final written assignment.
- **Advanced transitions** (zoom from a node into a full micro-lab, inverse return, full timeline scrubbing).
- **Private Hebrew prompter** full text remains in the Drive workflow; short notes are embedded in the site.

### Design contracts

- Presentation UI and labels in **English**; working Hebrew notes not publicly exported.
- Each animation is **causal**: it shows a message direction, a trust assumption, a change and its consequence.
- The notGoogle copy has the same locally stored demo code as the user's source at the time of copying; it will not auto-sync from the separate repository.
- Site uses no package build/dependency, and honors Reduced Motion.
- Example `203.0.113.x` addresses are documentation-only simulations.

### Testing checklist

- [ ] Slide 00: auto-orbit persists after touch/drag/release.
- [ ] Slide 00: inner network depth and moving packets visible.
- [ ] Slide 01: DHCP DORA directional sequence and step buttons.
- [ ] Slide 01: ARP broadcast and reply direction.
- [ ] Slide 01: DNS resolver not shown as forwarding hop.
- [ ] Slide 01: NAT port 80/443 matches URL scheme.
- [ ] Slide 01: warm cache path skips fresh DHCP/ARP/DNS.
- [ ] Slide 01: step/auto-play, pause/resume and reset work.
- [ ] Slide 02: HTTP readable vs HTTPS protected content and metadata.
- [ ] Slide 03: mini-labs cycle and stop when leaving map.
- [ ] Slide 04: all eight topics and four-stage strips work.
- [ ] Slide 05: all four real cases accessible; notGoogle link opens.
- [ ] No clipping or long forced scroll on iPad landscape.
- [ ] All keyboard and reduced-motion paths are usable.

**GitHub Issues #2–#11 remain open until reviewed on actual devices.**
