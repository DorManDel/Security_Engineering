# Cipher Atlas | Next milestone: Triple DES and AES comparison

**Status:** Proposed teaching plan, not implemented. Existing slides 00–04 remain approved as a baseline.

## Teaching goal

Now that the audience has watched Confusion and Diffusion in AES, show how another block cipher can pursue the same goals using a different construction. Avoid replaying the same AES demonstration.

## Slide 05 | Inside Triple DES

Start with the question: How can a cipher be built differently from AES?

**View A: one DES Feistel round.** Split a 64-bit state into 32-bit left and right halves. Highlight the round function (expansion, round-key XOR, DES S-boxes, permutation), the XOR with the opposite half, and the swap of roles. Add Previous/Next controls and a compact step caption. This is a structural demonstration unless supported by verified DES test vectors.

**View B: Triple DES EDE.** Animate Encrypt(K1), Decrypt(K2), Encrypt(K3), and show the output of each stage. Switch between outer EDE and the inside-DES zoom without leaving the single-slide layout. An illustrative EDE diagram must not claim to compute real 3DES values.

Presenter cues: two or three Hebrew spoken sentences, with short blue click instructions. No repeated theory preamble.

## Slide 06 | AES vs. Triple DES

Use an elegant side-by-side compare / draggable focus curtain:

- AES: substitution-permutation network, 128-bit block, 10/12/14 rounds depending on key length.
- Triple DES: three Feistel-based DES operations in EDE sequence, 64-bit block, 16 DES rounds per operation.
- Both pursue confusion and diffusion through different structures.
- Triple DES is a legacy historical choice. NIST withdrew SP 800-67 Rev. 2 on 2024-01-01 and disallows 3DES for new cryptographic protection, with certain legacy processing exceptions.

Conclude with a prompt that prepares for the next unit: A block cipher handles one fixed-size block. How do we safely handle a longer message?

## Following milestone | Modes of operation

Slides for ECB, CBC, CFB, OFB, CTR, and authenticated GCM; IV and nonce constraints, padding, BEAST and implementation vulnerabilities. Scope and details will be reviewed separately.

## UX and correctness checks

1. Keep one page without exterior scrolling on desktop and mobile.
2. Preserve the v0.8 theme, Spotlight, PrismGlass slider, animated cube, and per-slide transitions.
3. Only real computed values may be labeled as cryptographic results. Diagrams without computation are explicitly conceptual.
4. Show exactly what moves or changes; no distracting decorative animation that obscures the explanation.
5. Allow Next, Previous, Replay, and direct step selection without unintentionally changing slides.
6. Full speech belongs in the existing Google Doc. The website only shows concise cue notes.

## References

- NIST FIPS 197: https://csrc.nist.gov/pubs/fips/197/final
- Withdrawn NIST SP 800-67 Rev. 2: https://csrc.nist.gov/pubs/sp/800/67/r2/final
- NIST SP 800-38A: https://csrc.nist.gov/pubs/sp/800/38/a/final
