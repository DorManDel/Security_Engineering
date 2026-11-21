# Network Security Atlas — Visual Storyboard & Animation Contract

> **Status:** Design specification / QA baseline, **not a claim that the scenes are already implemented.**  
> **Audience:** 10–15 minute classroom presentation + exam-review microsimulations.  
> **Language:** English in the presentation; Hebrew in the private presenter notes.  
> **Visual reference:** The *existing* Cipher Atlas site: dark navy, restrained liquid glass, refined typography and subtle pastel/gold accents. Avoid oversized glow, unnecessary frames, labels, or long scrolling.

## Core principle

**Show the protocol behaving before explaining how the same trust boundary can be abused.** Every scene has a functional visual state, not a decorative loop. The presenter can pause, step forward/back, replay and inspect the relevant packet.

| State | Meaning | Visual treatment |
|---|---|---|
| **Normal** | Legitimate path & expected reply | Clear subdued link color, precise packet direction |
| **Assumption** | Why the protocol accepts a message | Highlight the trust decision or address mapping |
| **Weakness** | What can be forged or altered | Localized muted warning, never flash full screen |
| **Attack** | Misuse in a contained simulation | Divergent path or changed packet field visibly marked |
| **Defense** | Why the failure is prevented/limited | Same network, corrected trust/validation mechanism |

These five states apply to future attack-focused slides. The opening slides introduce normal traffic and security goals first.

## 00 — Prologue: a network inside a cube

**Visual story:** (1) subdued glass cube; (2) multiple 3D nodes and links emerge **inside** it; (3) a small packet visibly traverses links; (4) introduction appears and *Enter the network* advances to the Journey.

**Interaction:** gentle auto-rotation; direct manipulation (pointer/touch); auto-rotation must **resume smoothly** after release. Interior nodes and moving packets stay spatially consistent with cube rotation. Disable auto motion for Reduced Motion users, retain all essential information.

**Current gaps:** cube freezes after a drag, no convincing internal network and no staged reveal. See GitHub issues #2 and #3.

## 01 — Journey: one request, many separate conversations

The **central visualization** is a reusable network topology. A compact browser address bar begins the story; a single main packet or exchange is highlighted at a time. Context/Inspector appear on demand.

| Beat | Protocol/mechanism | What physically moves in the visualization | What to inspect |
|---|---|---|---|
| 1 | WLAN | Device associates with access point | Wi-Fi link, distinct from IP config |
| 2 | DHCP | Discover broadcast → Offer → Request → ACK | DHCP messages; local IP, gateway, DNS options |
| 3 | ARP | Broadcast: “Who has gateway IP?” → local unicast reply | Target IPv4 vs returned MAC, ARP cache |
| 4 | DNS | Query from device *to resolver via gateway* → answer | QNAME, resolver IP and A/AAAA records |
| 5 | Routing + NAT/PAT | Web packet traverses gateway; private source address/port translated | Before/after IP:port tuple; next-hop MAC change |
| 6 | TCP | SYN → SYN-ACK → ACK drawn as arrows | Sequence/ACK numbers, client/server ports |
| 7 | TLS | Simplified ClientHello → authenticated server certificate → protected channel | Certificate trust, encrypted application data |
| 8 | HTTP | GET / or POST travels **within** chosen transport | HTTP readable over plain TCP, encrypted under TLS |

**Technical correctness gates:**
- DHCP only occurs in the new-network scenario. A connected/cached scenario may skip DHCP, ARP or DNS.
- DNS is **not** a mandatory forwarding hop between client and web server.
- ARP resolves an IPv4 next-hop MAC, not the website server's MAC across the Internet.
- NAT/PAT occurs at the gateway; not every network uses the same NAT configuration.
- Illustrative HTTP/1.1 or HTTP/2 over TCP + TLS; modern HTTP/3 uses QUIC over UDP and needs a separate scene later.
- An observer can see more than just a vague “sent or where” in HTTPS: packet timing, sizes, IPs and ports often remain observable. Name/DNS visibility depends on ECH and encrypted DNS configurations.
- All example addresses and packets are simulated and labeled accordingly.

**Presentation interactions:** Play, Pause, Step One, Previous, Replay, Reset, Cold/Warm scenario. Clicking a visible packet opens the Inspector synced to that **exact event**. On-screen annotation limited to one clear learning outcome at a time.

**Current gap:** timeline changes text and highlights nodes, but the exchange animations above are not implemented. Issue #5.

## 02 — CIA Triad & HTTP/HTTPS

**One underlying topology, three selectable security outcomes**:
1. **Confidentiality:** observer reads a visible HTTP request in one scenario; with HTTPS, HTTP content is covered by an encrypted record while network metadata remains. Use neutral sample text, not real credentials.
2. **Integrity:** attacker on path tries to change `Transfer: 100` → `Transfer: 900`. An unprotected HTTP demonstration accepts the changed bytes; a properly secured TLS channel fails verification (in a conceptual demo). No actual interception is performed.
3. **Availability:** animate limited server capacity / rising queue, then request timeout. Explicitly show that encryption alone is not an availability control.

**Transitions:** security-goal selection animates the *same topology* without regenerating the slide. A `HTTP / HTTPS` switch changes the packet content, observer capability, and explanation in sync.

**Current gap:** toggles mostly change strings; missing causal visual stories. Issue #9.

## 03 — Network Map / component micro-labs

- Click **Router**: zoom/spotlight the component; depict routing decision and NAT mapping with a reversible before/after packet view.
- Click **DHCP**: show DORA exchange around the gateway as a local service, with the proper request/response directions.
- Click **ARP**: show local IPv4 address resolution and cache mapping; later reuse the same scene to show forged answers.
- Click **DNS**: resolver exchange followed by host IP target selection, then optional link to Turkey 2014.
- Click **TCP**: animate three-way handshake, later reuse the scene for SYN flooding and session attacks.
- Click **Related Cases**: context is retained as it transitions to a verified historical incident; show **normal path → abuse point → consequence**. The reverse link returns to the origin component.

**Current gap:** static flow pills and explanatory text; micro-simulations missing. Issue #10.

## User's existing notGoogle demonstration

Use the user's **existing** `DorManDel/notGoogle` project rather than replacing it with a generic placeholder. The presentation controls an explicit Reveal of origin and explains why visual similarity is not authentication. Link it to DNS spoofing and route manipulation *without claiming that a cloned interface bypasses valid HTTPS*. Keep the demo confined to an educational environment with no collection of actual credentials.

Issue #7.

## Scene-engine behavior contract

Define a reusable scene state machine (conceptually `idle → playing → paused → finished`) with a deterministic ordered list of beats; every beat has:
- `id`, `title`, `visual action`, `duration`, `inspectable event`, `presenter cue`.
- `enter` and `leave` cleanup actions, so no background animation continues after navigation.
- A consistent `Reset` that restores values, packet positions and choices.
- A `Step One` that completes precisely **one** semantic action.
- Optional playback speed; **skip** and **pause** always available.
- A reduced-motion path that exposes identical states as static diagrams.

**Animation direction:** slide transition 200–400 ms, purposeful focus/zoom ~300–650 ms, network exchange ~700–1400 ms per meaningful action. These are starting design targets, not measured timing or fixed requirements. Avoid heavy CSS filter animation, high-frequency shadows, massive particle systems and full-screen flashes on iPad.

**Display QA:** iPad Safari landscape and portrait, desktop 16:9 and full-screen projector, mobile portrait. One slide should be readable within the stage without forced vertical scroll. Use progressive disclosure so the timeline and Packet Inspector do not compete with the central visualization.

## Tracking and acceptance

- Real **source of truth** is GitHub Issues #2–#11. Track whether work is **Open** or **Done** based on actual provider state, never local optimistic claims.
- QA feedback form: `/assignments/feedback/` autosaves locally, can export Markdown or open a prefilled GitHub Issue.
- A screenshot/video and a tested acceptance checklist should support closing each issue.
- No confirmed fix until implementation and browser verification. This file is a shared design plan; **the current prototype is not yet at this quality bar.**
