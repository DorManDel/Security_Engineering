# Cipher Atlas

Interactive Security Engineering presentation and teaching lab for block ciphers.

**Checkpoint:** Approved Foundations v0.8 (2026-11-17)  
**Scope:** Five slides (00 through 04): Prologue, Why Confusion & Diffusion, Confusion Lab, Diffusion Lab, Putting It Together.

## Open

Open [`index.html`](./index.html) directly in a modern browser. No build, dependency install, or remote service is required. The project is suitable for GitHub Pages from `main` at the repository root once Pages is enabled in repository settings.

## Features

- Editable transition effect per slide, plus global and inner-operation overrides
- Auto-rotating, touch-draggable 3D cipher cube
- Spotlight rim lighting and PrismGlass-inspired range knobs
- Compact presenter-cue drawer and Lesson Flow drawer
- AES S-box with 256 real lookups and example inputs `AD`, `9A`, `3E`
- Two-state AES-128 teaching traces, with byte and bit differences across operations
- Isolated ShiftRows and MixColumns demonstrations
- On-screen controls and keyboard navigation; reduced-motion mode respected

## Approved theme

[`themes/cipher-atlas-v08.json`](./themes/cipher-atlas-v08.json) preserves the reviewed baseline. Its values are also embedded directly into `index.html`. Settings subsequently changed in the presentation are saved in the browser where storage is available. The JSON is a documented snapshot, not a separate runtime dependency.

## Content boundaries

The S-box demonstration is a byte lookup, not an entire AES encryption. The diffusion comparison shows internal states derived from two plaintext states differing by one bit, with the same round keys. The 3D cube is a visual metaphor.

Full Hebrew speaker-script text is maintained separately in a living Google Doc. This repository intentionally includes only concise presenter cues and does not publish the private working script.

## Next milestone

See [`docs/next-milestone.md`](./docs/next-milestone.md) for the AES vs. Triple DES teaching design, pending content approval.

## References

- [NIST FIPS 197: AES](https://csrc.nist.gov/pubs/fips/197/final)
- [NIST SP 800-67 Rev. 2: Triple DES, withdrawn 2024](https://csrc.nist.gov/pubs/sp/800/67/r2/final)
- [NIST SP 800-38A: Block cipher modes](https://csrc.nist.gov/pubs/sp/800/38/a/final)