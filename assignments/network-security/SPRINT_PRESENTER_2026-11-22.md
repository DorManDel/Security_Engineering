# Presenter timer and mechanism-specific network scenes

**Status:** Code complete, visual QA pending · 2026-11-22  
**Safe rollback snapshot:** [snapshot/atlas-before-presenter-animation-2026-11-22](https://github.com/DorManDel/Security_Engineering/tree/snapshot/atlas-before-presenter-animation-2026-11-22)

## Presenter stopwatch

- Enter **Present** (fullscreen) → starts a fresh `00:00` stopwatch directly below the Present/Exit control
- **Space** toggles stopwatch pause/resume while not typing in an input
- **R** resets elapsed time to zero while preserving running/paused state
- Adjacent small play/pause and reset buttons offer mouse control
- Exit fullscreen → stop, reset to `00:00`, hide stopwatch
- Timer uses `performance.now()` to avoid drift; 13 minutes caution and 15 minutes overrun tint
- In Present, footer shows the keyboard shortcuts

## Network Map

The map retains existing actors, routes, and narration; the inspector uses locally rendered DOM/CSS micro-scenes rather than repeated generic packet-line animation.

- Device: URL typing; cache versus DNS lookup; local routing-table decision
- Wi-Fi access point: association; optional authentication; link-frame bridging
- Router: destination-prefix lookup; next-hop selection; NAT/PAT transformation
- Internet: BGP reachability advertisement; routing-policy selection; AS path forwarding
- Web server: TCP connection; TLS identity/certificate; HTTP response
- DHCP: Discover, Offer, Request, ACK (four separate directional scenes)
- DNS: query, cache-or-authority lookup, response
- ARP: local broadcast, neighbor MAC reply, destination-MAC frame
- TCP: SYN, SYN-ACK, ACK

**Play/Pause** now freezes the selected component's step timer, CSS scene animations, and SVG packet motion. **Replay** restarts from the first step. Locally vendored Lucide play/pause SVGs are under the existing ISC license.

## Speaker notes

The private Hebrew Google Doc was edited in place: Slide 01 is broken into shorter paragraphs and compact gray `[ACTION]` cues. No speaker script has been embedded in the public website.

Future linked task: [Private presenter-view notes synchronization](https://github.com/DorManDel/Security_Engineering/issues/27). This is **not** implemented in this sprint.

## User acceptance checklist

- [ ] Chrome desktop: stopwatch starts when entering Present and resets on Exit
- [ ] Stopwatch: Space pauses/resumes and R resets; text inputs remain usable
- [ ] Presenter footer shows Space and R only when Present is active
- [ ] Network Map: Device shows typing, DNS/cache decision and routing table as three visibly different stages
- [ ] Network Map: Wi-Fi, Router, DHCP, DNS, ARP and TCP show correct cause-and-effect visuals
- [ ] Network Map: Pause and Replay freeze/restart local step, animated content and highlighted route
- [ ] iPad Safari: no clipping or scrolling during presentation
- [ ] Reduced-motion preference: no unwanted perpetual motion
- [ ] Preserve approved Intro/Journey/CIA and eight-topic layout

**Verification performed:** JavaScript syntax checks, required script order, CSS bracket balance, 28 micro-scene DOM creation checks, mock stopwatch event/keyboard smoke test, private Drive readback. Actual rendering on user devices remains pending.
