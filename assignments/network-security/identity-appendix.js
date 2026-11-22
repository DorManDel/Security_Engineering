/* Optional identity appendix after the four required lecture incident groups.
 * Standalone original classroom lab, with an intentional presenter reveal.
 */
(function(){
"use strict";
if(typeof slides==="undefined"||!document.querySelector(".section-nav"))return;
const tab=document.createElement("button");tab.className="tab";tab.type="button";
tab.textContent="06 · Identity Lab";tab.dataset.slide=String(slides.length);
const section=document.createElement("section");section.className="slide identity-slide";
section.id="identity";section.dataset.index=String(slides.length);
section.innerHTML=[
 '<div class="slide-head"><div class="eyebrow">06 / OPTIONAL APPENDIX</div><h2>Can you trust what you see?</h2><p>A familiar interface is not evidence of a familiar identity.</p></div>',
 '<div class="identity-stage"><div class="identity-demo"><div class="identity-topline">LIVE CLASSROOM DEMO · NO REAL CREDENTIALS</div>',
 '<h3>A search page you recognize.</h3><p>Look at the visual design. What would you check before typing a password?</p>',
 '<div class="identity-browser"><span class="identity-browser-icon">⌕</span><span>Visual similarity ≠ verified origin</span></div>',
 '<div class="identity-actions"><a href="./notgoogle/index.html" target="_blank" rel="noopener noreferrer" class="identity-open">Open classroom demo ↗</a><button id="identityReveal" type="button">Reveal the trust lesson</button></div>',
 '</div><div class="identity-explanation"><div class="identity-topline">THREE DISTINCT CHECKS</div>',
 '<div class="identity-point"><strong>01 · Visual appearance</strong><p>Logos, spacing and familiar buttons can be copied.</p></div>',
 '<div class="identity-point"><strong>02 · Domain name</strong><p>Check the actual website address, not just the text shown in a page.</p></div>',
 '<div class="identity-point"><strong>03 · HTTPS / TLS</strong><p>Encryption protects communication with the connected domain; it does not prove that the domain belongs to the brand you expected.</p></div>',
 '<p id="identityLesson" hidden class="identity-lesson">Reveal: the classroom example is <strong>notGoogle</strong>. It is an educational demonstration, not one of the historical attacks covered in the lecture.</p></div></div>',
 '<div class="identity-footer">Use fictional search and login data only. Return to the required incident review when finished.</div>'
].join("");
document.querySelector(".section-nav").append(tab);
document.querySelector("main.stage").append(section);
slides.push(section);
tab.onclick=()=>slideTo(Number(tab.dataset.slide));
document.getElementById("identityReveal").onclick=()=>{
 const p=document.getElementById("identityLesson");p.hidden=!p.hidden;
 document.getElementById("identityReveal").textContent=p.hidden?"Reveal the trust lesson":"Hide the reveal";
};
})();