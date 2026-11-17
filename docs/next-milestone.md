# Cipher Atlas | Next milestone: AES vs. Triple DES

**Status:** Proposed; do not implement or mark approved until the teaching flow is reviewed.

## Goal

Bridge the principles from slides 00–04 to two actual cipher architectures. Show that confusion and diffusion are design properties, not the names of specific instructions.

## Proposed flow

### Slide 05 | Same goals, different architecture

Lead with one question: "AES and Triple DES both aim to hide patterns. Why are they built differently?" Show an SPN (AES) and a Feistel network (DES) as two selectable, legible SVG diagrams. Keep the interface to one screen, with concise Hebrew presenter cues.

### Slide 06 | Inside AES

Reuse real operations from the approved AES learning trace; focus the walkthrough on the order of SubBytes, ShiftRows, MixColumns and AddRoundKey and distinguish the initial and final rounds. Expose the round state and input/output bytes on demand, not as default clutter.

### Slide 07 | Inside Triple DES

Use three DES operations in encrypt-decrypt-encrypt (EDE) order. Within each DES operation, illustrate a Feistel round with left/right halves, round function, S-box contribution and swapping. A simplified structural diagram must be labeled as such; do not claim it runs true 3DES without a verified cryptographic implementation and known test vectors.

### Slide 08 | Comparison / takeaway

Compare block size, architecture, keying, operations, security status and teaching takeaway. AES operates on 128-bit blocks. DES/3DES uses 64-bit blocks. Triple DES is historical: NIST withdrew SP 800-67 Rev. 2 on January 1, 2024, and disallows its use for applying new cryptographic protection, though legacy decryption/verification can still be permitted.

## Interaction acceptance criteria

- Two diagrams are visually comparable and keyboard/touch accessible.
- A stage change highlights what moved or changed, with a short step label.
- True algorithm traces use verified test vectors or are clearly labeled as conceptual.
- Each new slide gets an independent transition in Options and a few succinct Hebrew presenter cues.
- No additional UI border or decorative badge without purpose.
- The opening and existing slides remain unchanged in functionality.
- Works at desktop and narrow mobile widths without global scrolling.

## After this milestone

Block cipher modes (ECB, CBC, CFB, OFB, CTR, GCM); IV and nonce rules; padding and padding-oracle distinction; BEAST; timing attacks; Android implementation failures. Each topic stays scoped to the user's course assignment and receives a separate review before deployment.

## References

- NIST FIPS 197: https://csrc.nist.gov/pubs/fips/197/final
- NIST SP 800-67 Rev. 2 (withdrawn): https://csrc.nist.gov/pubs/sp/800/67/r2/final
- NIST SP 800-38A: https://csrc.nist.gov/pubs/sp/800/38/a/final