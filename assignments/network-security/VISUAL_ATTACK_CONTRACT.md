# Protocol-Visual Learning Contract

**Approved direction:** each mechanism should teach *why an event happens*, not merely show a moving packet.

## Reusable demonstration model

| Mode | Purpose | Visual convention |
|---|---|---|
| Normal | Explain the real intended flow | Blue connections, one active gold message or tracked packet |
| Vulnerable / Attack | Point to a **specific violated trust assumption** | Preserve all actor positions; highlight only the malicious message or modified edge in red |
| Mitigation | Show how detection, authentication, validation or filtering changes the outcome | Preserve the same flow; mark validation/rejection in green and explain the condition |
| Inspector | Make technical data inspectable | Show protocol fields and an **illustrative** packet capture when relevant; real captures are explicitly labeled |

## Interaction contract

- The mechanism begins in **Normal** mode, with a three-/four-step meaningful sequence.
- The same component, actor positions and visual coordinate system must be reused in **Attack** and **Defense**, so the audience can compare without learning a different diagram.
- `Play/Pause` freezes the current stage and its animation. `Replay` restarts from stage 1; both controls remain independent.
- Each message has a visible source, destination and purpose. A single highlighted tracked packet makes routing demos easier to follow.
- Do not represent BGP advertisements as HTTP packets: distinguish control-plane route information from data-plane forwarding.
- `prefers-reduced-motion` must preserve the educational information without looping animations.
- Never portray a conceptual animation as captured Wireshark traffic.

## Next sprint — eight security topics

Start with **ARP Poisoning**, validate the whole cycle, then reuse it for the other seven subjects:
1. Intended ARP request/reply and valid gateway-MAC association.
2. Forged reply that changes the client's trust decision (red).
3. Consequence: next-hop traffic reaches an unintended party when the attack prerequisites hold.
4. Mitigation / validation and clearly stated limitations (green).

Do not implement eight different visual layouts. Reuse the topology, diagram components, scene definitions, protocol data and inspector controls. Keep the visual design consistent with Network Atlas.

## Present sprint baseline (November 22, 2026)

- Journey: completed exchange button displays **Play** instead of a redundant Replay.
- Present timer: **physical KeyR** resets even with Hebrew keyboard layout.
- DHCP: a four-message **Discover → Offer → Request → ACK** ladder.
- TCP: a three-message **SYN → SYN-ACK → ACK** ladder with direction and order.
- Internet: interconnected 10-AS conceptual graph, separate control-plane advertisements and routing choice, followed by one tracked data-plane packet.
- Safe baseline branch: `snapshot/atlas-before-ladder-routing-2026-11-22`.
- Public notGoogle demo remains a **separate task** for later polish, without changing its behavior in this sprint.

## QA checklist

- [ ] Play button appears after exchange completion and starts the selected exchange on click.
- [ ] Timer resets with physical R in Hebrew and English keyboard layouts; Space still toggles pause/resume.
- [ ] DHCP demonstrates 4 correct alternating-direction messages.
- [ ] TCP demonstrates 3 correct alternating-direction messages in a persistent diagram.
- [ ] Internet stage 1 illustrates BGP prefix reachability (control plane).
- [ ] Internet stage 2 highlights a route choice without a fabricated web packet.
- [ ] Internet stage 3 follows **one** selected route with **one** packet.
- [ ] Map Pause freezes CSS and SVG animations; Replay restarts.
- [ ] Desktop 16:9, iPad, portrait mobile and reduced-motion QA.
