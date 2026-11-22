# Assignment 04 — Verified Requirements and Presentation Coverage

**Course:** Security Engineering (ד"ר ערן קאופמן)  
**Updated:** 2026-11-22  
**State:** Content-plan checkpoint; not submitted, not marked approved.

## Authoritative sources

### A. Lecturer email — 22 November 2026, 18:08 (Israel local time)
Subject: "תרגיל הבית" (Moodle forum notification)

> יש לבחור 8 מתוך ההתקפות / מושגים שעברנו עליהם בשיעור ולהסביר בפירוט על הפרוטקול מה מטרתו איך הוא עובד ואיך תוקפים אותו.

The lecturer also states that submission dates were extended **without specifying an exact date** in the email.

**Implication:** choose eight attacks/concepts and explain **in detail** their purpose, normal operation and attack mechanism. Do not rely solely on the older brief-explanation wording.

### B. Lecture slides — Network Security (sec_N1 2.pdf), page 69

- "Explain briefly the following protocols and their weaknesses."
- 13 named items: ARP poisoning, MAC flooding, MAC spoofing, IP spoofing, SMURF attacks, NTP, DHCP, BGP, DNS, NAT, TCP scanning, SYN flooding, TCP hijacking.
- Handwritten note: choose eight.
- "Go over recent attacks (explained in the lesson) and explain how they where made possible."

**Interpretation:** the latest email calls for **detailed** explanations. Its silence about historical cases does **not** explicitly cancel the slide-69 case-analysis request. Keep both parts unless the grader states otherwise.

### C. Lecture historical cases — pages 62–68

- Tunisia 2011–12: HTTP page delivery, on-path JavaScript injection.
- Turkey 2014: DNS-based access blocking, then **separate** routing manipulation affecting public DNS.
- Kazakhstan 2019: request to install a trust anchor/certificate.
- Belarus 2020: network disruption and DPI. The lecture discusses plans/claims regarding DDoS; **do not assert DDoS was proven to cause the disruption**.

### D. Earlier submission instructions

Lecturer email, 2 November: upload a compressed video to Moodle **or** provide a Google Drive / YouTube video link; **do not send submissions directly to Eran**. Guy Maimon is the assignment grader. In a 11 November email Guy gives an outage fallback: send him the assignment by email with full name and note the email submission in Moodle.

**Deadline warning:** the precise extended deadline is unverified. A prior reminder listed 25 Nov 2026 14:52, which may have been superseded.

## Compliance checklist

| ID | Requirement | Evidence | Status |
| --- | --- | --- | --- |
| R-01 | Select 8 lecture-listed attacks/concepts | Lecturer + slide 69 | ✅ Eight chosen |
| R-02 | Explain the purpose of each mechanism | 22 Nov mail | 🟡 Draft |
| R-03 | Explain normal operation **in detail** | 22 Nov mail | 🟡 Initial micro-labs |
| R-04 | Explain how each is attacked and **why it works** | 22 Nov mail | 🟡 Needs deeper scenarios |
| R-05 | Explain the lesson's historical attacks and why possible | Slide 69 + slides 62–68 | 🟡 Initial outlines |
| R-06 | Verify accuracy and visual explanations | Internal quality criterion | ⬜ Pending |
| R-07 | Prepare and submit a video/link | Earlier submission directions | ⬜ Not yet verified |
| R-08 | Confirm latest exact deadline in Moodle | Extension notice | ⬜ Unknown |

R-06 and R-08 are planning checks rather than independent lecturer tasks. Recheck R-07 on the Assignment 04 Moodle page.

## Selected eight

1. ARP Poisoning
2. MAC Spoofing
3. IP Spoofing
4. DHCP
5. BGP
6. DNS
7. SYN Flooding
8. TCP Hijacking

These are not all "protocols": the newer email explicitly allows attacks/concepts.

## Every topic should present

**Purpose → Normal behavior → Vulnerability / trust assumption → Attack → Why possible → Defense (optional) → Hebrew spoken script and grey [ACTION] cue.**

## Presentation structure

| Slide | Role | Assignment link |
| --- | --- | --- |
| 00 — Prologue | Welcome and concept | Our hook |
| 01 — Journey | Show network request and protocol exchange | Background for operation |
| 02 — Security Goals | CIA and HTTP/HTTPS | Background for consequences |
| 03 — Network Map | Explore device, gateway, DHCP, ARP, DNS etc. | Background for selected eight |
| 04 — Eight Topics | Full detail about selected mechanisms/attacks | R-01–R-04 |
| 05 — Historical Cases | Four lesson incidents, before → intervention → result | R-05 |
| Optional extras | Independent researched examples | Educational bonus; not mandatory |

Slides 00–03 are introductory; **they cannot replace the actual detailed eight-topic explanations or incident analyses**.

## Presenter convention

Stage directions are in grey square brackets, e.g. [ACTION: Press Connect], and are **not read aloud**. Hebrew spoken lines are white, right-to-left. The Notes drawer holds unapproved drafts until reviewed. Copy approved speaking text into the private Drive document only after approval.

## Two optional independently researched cases (not yet approved for main deck)

**MyEtherWallet / Amazon Route 53 (April 2018):** BGP route hijack redirected authoritative DNS queries and provided malicious answers, taking users to an impersonating wallet page. Strong demonstration of BGP + DNS + server identity and a conceptual link to notGoogle. **Historical, not recent to 2026.**
Sources:
- https://blog.cloudflare.com/bgp-leaks-and-crypto-currencies/
- https://www.internetsociety.org/blog/2018/04/amazons-route-53-bgp-hijack/

**HTTP/2 Rapid Reset DDoS (2023):** many HTTP/2 request streams were immediately canceled, creating server/proxy work and high request rates. Good Availability example, **not equivalent to TCP SYN Flood**.
Sources:
- https://cloud.google.com/blog/products/identity-security/how-it-works-the-novel-http2-rapid-reset-ddos-attack
- https://blog.cloudflare.com/zero-day-rapid-reset-http2-record-breaking-ddos-attack/
