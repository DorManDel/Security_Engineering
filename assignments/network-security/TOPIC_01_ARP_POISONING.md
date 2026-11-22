# Topic 01/08 — ARP Poisoning

## Purpose and presenter contract

One fully worked ARP Poisoning demonstration is the reference template for the remaining seven selected topics. The English site stays within one desktop presentation viewport, with the existing eight-topic index on the left and a compact ARP learning stage on the right.

## Three demonstration modes

- **Normal:** Victim broadcasts an ARP Request for gateway `192.168.1.1`; legitimate gateway sends a reply; victim ARP cache stores `02:00:00:00:00:11`.
- **Attack:** Same-LAN attacker sends a *forged reply* mapping `192.168.1.1` to `02:00:00:00:00:CC`; victim may accept this unverified mapping; frames intended for the gateway reach the attacker first. An on-path actor may drop or relay them. Correctly validated TLS still protects application data.
- **Mitigation:** On a properly configured managed switch, Dynamic ARP Inspection validates incoming ARP information from untrusted ports against trusted bindings or ARP ACLs and drops invalid packets; victim retains the legitimate mapping. DAI requires appropriate configuration and does not universally protect every network.

**Crucial teaching moment:** the gateway IP remains constant; the *sender MAC field* and the victim's *IP→MAC cache entry* change.

## Five-question reusable contract

Purpose · Normal behavior · Trust assumption · Attack & why it works · Defense / mitigation

For the remaining seven topics, build the same Normal/Attack/Mitigation scaffold with meaningful field-level changes, not an animation that only moves packets.

## Verified references

1. David C. Plummer, [RFC 826 — An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826.html). Specifies ARP message format and address resolution.
2. Cisco, [Dynamic ARP Inspection](https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/sec-crypto/fhs-sisf/fhs-and-sisf-configuration-guide/dynamic-arp-inspection.html). Explains packet filtering, trusted and untrusted interfaces, binding validation, and ARP poisoning.

## Related cases and closing demo

Retain the separate **05 Real Cases** section: Tunisia 2011–2012, Turkey 2014, Kazakhstan 2019 and Belarus 2020, explicitly marked as lecture case outlines awaiting source-specific validation. ARP Poisoning is a protocol attack example and is **not attributed** to those incidents without evidence. The private Drive prompter retains the **notGoogle identity lab after historical cases, before closing**.

## Verification checklist

- [x] Pre-change branch created: `snapshot/arp-topic-before-first-lab-2026-11-23`
- [x] JavaScript parse/HTML script parse, CSS brace balance and reference paths checked
- [x] Hebrew prompter content written to existing private Google Doc; seven short gray `[ACTION]` cues added
- [ ] Desktop 16:9 live browser visual acceptance with no vertical scrollbar
- [ ] Replay / next / previous / mode changes in Chrome and iPad Safari
- [ ] Video review: attack path red, cache red, defense reject red and correct mapping visible
- [ ] Accessibility / reduced-motion behavior on target devices

**Status:** Ready for user visual review; do not call on-screen QA complete until verified on a live browser.
