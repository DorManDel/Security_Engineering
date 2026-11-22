/* Slide 02: compare HTTP and HTTPS simultaneously, with a causal CIA explanation. */
(function(){
"use strict";
const $=id=>document.getElementById(id),host=$("goals");if(!host)return;
const make=window.atlasV2.make,reduce=window.atlasV2.reduce;
const cases={
 confidentiality:{
 question:"Who can read the message?",
 desc:"An observer on the path can read HTTP application data. TLS encrypts the HTTP content; IP addresses, ports and traffic patterns may still be visible.",
 http:"GET /profile HTTP/1.1\nHost: example.test\nContent: readable to observer",
 https:"TLS Application Data\n[Encrypted HTTP content]",
 outcome:"HTTP content exposed   ·   HTTPS content protected"
 },
 integrity:{
 question:"Who can change the message?",
 desc:"An attacker who controls an unprotected path may change HTTP content. Authenticated TLS detects alterations to its protected application data.",
 http:"Original: Transfer 100\nOn-path edit: Transfer 900\nServer receives: 900",
 https:"Original: Transfer 100\nTampered TLS record\nRejected: integrity check fails",
 outcome:"HTTP may accept changes   ·   TLS rejects tampering"
 },
 availability:{
 question:"Who can stop the service?",
 desc:"A server or connection can become unavailable through overload or network disruption. Encrypting the request does not guarantee delivery.",
 http:"Browser sends HTTP request\nRoute disrupted\nTimeout: no reply",
 https:"Browser sends protected request\nServer unavailable\nTimeout: no reply",
 outcome:"Both can fail when connectivity or service fails"
 }
};
const scene=make("div","p2-shell p2-cia");
scene.innerHTML=[
'<div class="p2-cia-tabs" role="group" aria-label="Choose the security goal">',
'<button type="button" class="p2-cia-tab active" data-goal-v2="confidentiality"><strong>01 · Confidentiality</strong><small>Who can read?</small></button>',
'<button type="button" class="p2-cia-tab" data-goal-v2="integrity"><strong>02 · Integrity</strong><small>Who can modify?</small></button>',
'<button type="button" class="p2-cia-tab" data-goal-v2="availability"><strong>03 · Availability</strong><small>Who can stop it?</small></button>',
'</div>',
'<div class="p2-cia-question"><strong id="v2CiaTitle"></strong><button class="p2-secondary" id="v2ReplayCIA">Replay explanation ↻</button></div>',
'<div class="p2-cia-grid">',
'<article class="p2-compare-card"><div><div class="p2-protocol">HTTP</div><div class="p2-sub">No TLS protection</div></div><div class="p2-observer"><span>Browser</span><span class="p2-o-arrow"></span><span>Observer<small>On path</small></span><span class="p2-o-arrow"></span><span>Server</span></div><div class="p2-sees"><span class="p2-sees-label">Visible / result</span><div class="p2-data bad" id="v2HttpSample"></div><div class="p2-metadata"><span class="p2-meta">Dst IP: 203.0.113.42</span><span class="p2-meta">Port: 80</span><span class="p2-meta">TCP</span></div></div></article>',
'<article class="p2-compare-card"><div><div class="p2-protocol">HTTPS</div><div class="p2-sub">HTTP protected by TLS</div></div><div class="p2-observer"><span>Browser</span><span class="p2-o-arrow"></span><span>Observer<small>On path</small></span><span class="p2-o-arrow"></span><span>Server</span></div><div class="p2-sees"><span class="p2-sees-label">Visible / result</span><div class="p2-data good" id="v2HttpsSample"></div><div class="p2-metadata"><span class="p2-meta">Dst IP: 203.0.113.42</span><span class="p2-meta">Port: 443</span><span class="p2-meta">Sizes / timing</span></div></div></article>',
'</div>',
'<div class="p2-triad-footer"><span id="v2CiaDesc"></span><span class="p2-readable" id="v2CiaResult"></span></div>'
].join("");
host.append(scene);
let selected="confidentiality";
function draw(){
 const c=cases[selected];scene.dataset.currentGoal=selected;
 $("v2CiaTitle").textContent=c.question;
 $("v2CiaDesc").textContent=c.desc;
 $("v2CiaResult").textContent=c.outcome;
 $("v2HttpSample").textContent=c.http;
 $("v2HttpsSample").textContent=c.https;
 scene.querySelectorAll("[data-goal-v2]").forEach(b=>b.classList.toggle("active",b.dataset.goalV2===selected));
 // Synchronize the original teaching selection without showing its crowded old panel.
 goal=selected;updateGoal();
 scene.classList.remove("p2-animating");
 if(!reduce){void scene.offsetWidth;scene.classList.add("p2-animating");}
}
scene.querySelectorAll("[data-goal-v2]").forEach(b=>b.onclick=()=>{selected=b.dataset.goalV2;draw()});
$("v2ReplayCIA").onclick=()=>draw();
draw();
})();