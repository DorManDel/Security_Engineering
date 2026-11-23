/* Historical case demonstrations: static, read-only educational reconstructions. */
(function(){
"use strict";
const root=document.getElementById("cases"),cards=document.getElementById("caseGrid");
if(!root||!cards)return;
const data=[
 {id:"tunisia",title:"An unchanged-looking page, modified in transit",year:"Tunisia · 2011–2012",
  sub:"On-path JavaScript injection into HTTP login responses",
  stages:[
   ["Normal page delivery","The site sends a legitimate login page. The browser displays the same content.","ORIGINAL = DELIVERED"],
   ["JavaScript injected","An on-path intermediary adds script to the HTTP response. The delivered page can look authentic while the extra script reads credentials.","ORIGINAL ≠ DELIVERED"],
   ["Authenticated HTTPS","Properly authenticated HTTPS detects changes to protected HTTP content, so a network intermediary cannot silently insert a script.","ALTERED TLS → REJECTED"]
  ],lesson:"The attacker changed the bytes delivered to the browser, not the visible website name.",
  sources:[["Slides 62–63",null],["CPJ 2011","https://cpj.org/2011/01/tunisia-invades-censors-facebook-other-accounts/"]]},
 {id:"turkey",title:"Intercepting a supposedly public DNS resolver",year:"Turkey · 2014",
  sub:"DNS blocking followed by traffic interception to a public resolver",
  stages:[
   ["Blocked name resolution","Users tried alternative public DNS servers, including Google's 8.8.8.8, when ISP resolvers blocked Twitter.","USER → 8.8.8.8"],
   ["A different network destination","The lecture diagrams traffic for 8.8.8.8 redirected toward 212.156.253.130 in AS9121.","8.8.8.8 → 212.156.253.130"],
   ["Check both routing and DNS","DNSSEC can authenticate signed DNS data, and encrypted DNS can protect exchanges if its resolver remains reachable. Neither by itself fixes a hijacked path.","CHECK RESOLVER + ROUTE"]
  ],lesson:"The lecture calls it BGP hijacking; published technical analysis also considers local routing rather than externally advertised BGP routes.",
  sources:[["Slides 64–65",null],["Google 2014","https://security.googleblog.com/2014/03/googles-public-dns-intercepted-in-turkey.html"],["Bortzmeyer","https://www.bortzmeyer.org/dns-routing-hijack-turkey.html"]]},
 {id:"kazakhstan",title:"Trust can be changed by a new root certificate",year:"Kazakhstan · 2019",
  sub:"Qaznet Trust Network root certificate installation requests",
  stages:[
   ["The trusted certificate chain","A browser verifies a site's TLS certificate against its configured trusted certificate authorities.","SITE → TRUSTED CA → BROWSER"],
   ["A new trust anchor","Users were asked to install a government root certificate. A trusted intermediary could then issue certificates the browser accepts.","NEW ROOT → INTERCEPTION RISK"],
   ["Browser distrust and verification","Browser vendors blocked known interception certificates. Avoid adding unverified roots and inspect who issued a site's certificate.","UNTRUSTED ROOT → WARNING"]
  ],lesson:"HTTPS depends on the device's certificate trust store, not merely the presence of a lock icon.",
  sources:[["Slide 66",null],["Mozilla 2019","https://blog.mozilla.org/security/2019/08/21/protecting-our-users-in-kazakhstan/"]]},
 {id:"belarus",title:"The network can fail before TLS even matters",year:"Belarus · 2020",
  sub:"Election-period disruptions and later censorship/filtering",
  stages:[
   ["Normal network reachability","A client can reach a service through working network links and available routes.","CLIENT → NETWORK → SERVER"],
   ["Interrupted and filtered traffic","Measurements reported significant outages around the election. The lecture also describes DPI filtering after connectivity returned.","DROPPED / FILTERED / TIMEOUT"],
   ["Availability monitoring","Independent network monitoring, resilience planning and alternate paths can help detect and sometimes mitigate disruptions.","MONITOR / REDUNDANCY"]
  ],lesson:"An encrypted connection cannot work if the service is unreachable. DDoS claims must not be treated as the proven root cause.",
  sources:[["Slides 67–68",null],["OONI","https://ooni.org/post/2020-belarus-internet-outages-website-censorship/"]]}
];
const mk=(tag,className,txt)=>{
 const n=document.createElement(tag);
 if(className)n.className=className;
 if(txt!==undefined)n.textContent=txt;
 return n;
};
const panel=mk("section","case-lab");
panel.id="caseLabV15";
panel.innerHTML=[
 '<div class="case-lab-header"><div>',
 '<div id="caseLabCount" class="case-overline"></div>',
 '<h3 id="caseLabTitle"></h3><p id="caseLabSubtitle"></p></div>',
 '<span class="case-lab-disclaimer">Illustrative reconstruction · No network requests</span></div>',
 '<div class="case-lab-menu"><div class="case-lab-modes" role="tablist" aria-label="Case demonstration stages">',
 '<button type="button" role="tab" data-story-mode="0">01 · Normal</button>',
 '<button type="button" role="tab" data-story-mode="1">02 · What changed</button>',
 '<button type="button" role="tab" data-story-mode="2">03 · Security lesson</button>',
 '</div><div class="case-lab-playback">',
 '<button type="button" id="caseLabPrev" aria-label="Previous scene">‹</button>',
 '<button type="button" id="caseLabPlay" aria-label="Play case sequence"><img src="./icons/play.svg" alt=""><span>Play</span></button>',
 '<button type="button" id="caseLabNext" aria-label="Next scene">›</button>',
 '</div></div>',
 '<div id="caseLabScene" class="case-lab-scene" aria-live="polite"></div>',
 '<div class="case-lab-explain"><div><b id="caseLabStageTitle"></b><p id="caseLabDesc"></p></div><strong id="caseLabStatus"></strong></div>',
 '<div class="case-lab-footer"><span id="caseLabLesson"></span><span id="caseLabSources"></span></div>',
 '<div class="case-lab-end"><span>See what was trusted · See what changed</span>',
 '<a href="./notgoogle/index.html" rel="noopener noreferrer" target="_blank">Final identity bonus: notGoogle ↗</a></div>'
].join("");
root.append(panel);
const $=id=>document.getElementById(id);
let current=0,stage=0,timer=null;
function stop(){if(timer!==null){clearInterval(timer);timer=null}}
function fictivePage(kind){
 const page=mk("div","case-faux-page");
 const top=mk("div","case-faux-top",kind==="original"?"ORIGINAL SERVER RESPONSE":"RECEIVED BY BROWSER");
 const content=mk("div","case-faux-content");
 content.append(mk("strong","case-faux-brand","Community Portal"));
 content.append(mk("small","","Illustrative page · No live login"));
 content.append(mk("div","case-faux-field","Account name"));
 content.append(mk("div","case-faux-field","● ● ● ● ● ● ● ●"));
 content.append(mk("div","case-faux-button","Sign in (illustration only)"));
 const valid=stage!==1||kind==="original";
 const label=stage===2&&kind==="delivered"?"✓ CONTENT INTEGRITY PROTECTED":valid?"✓ ORIGINAL PAGE":"✕ EXTRA SCRIPT IN DELIVERED HTML";
 const note=stage===1&&kind==="delivered"?"Additional script reads user-entered fields; no working code is used here.":stage===2&&kind==="delivered"?"Invalid TLS changes would be rejected.":"Page content matches the expected template.";
 const strip=mk("div","case-html-note "+(!valid?"bad":stage===2?"good":""),label);
 strip.append(mk("small","",note));
 content.append(strip);page.append(top,content);return page;
}
function renderTunisia(){
 const row=mk("div","case-two-pages");
 const l=mk("div","case-page-col"),r=mk("div","case-page-col");
 l.append(fictivePage("original"));r.append(fictivePage("delivered"));
 const split=mk("div","case-page-split",stage===1?"✕":stage===2?"✓":"↔");
 split.append(mk("small","",stage===1?"ALTERED":stage===2?"VERIFIED":"SAME"));
 row.append(l,split,r);return row;
}
const sceneSets=[
 null,
 [
  [["💻","User","DNS query"],["🌐","8.8.8.8","Public resolver"],["📗","Expected DNS","Name resolved"]],
  [["💻","User","Requested 8.8.8.8"],["⛔","AS9121","Route intercepted"],["⚠️","212.156.253.130","Unexpected responder"]],
  [["💻","User","DNS request"],["🛡️","Verify DNS","DNSSEC/secure DNS"],["✅","Check route","Resolver reachability"]]
 ],
 [
  [["🌐","Website","TLS certificate"],["📜","Known CA","Trusted issuer"],["🔒","Browser","Certificate valid"]],
  [["🌐","Website","TLS identity"],["⚠️","Qaznet root","Added to trust store"],["⚠️","Intermediary","May impersonate sites"]],
  [["🌐","Website","TLS identity"],["🛡️","Trust store","Reject unwanted root"],["✅","Browser","Show warning"]]
 ],
 [
  [["💻","Client","Requests service"],["🌐","ISP","Routes packets"],["🖥️","Server","Reachable"]],
  [["💻","Client","Request sent"],["⛔","Disruption","Filter or drop"],["⚠️","Server","Unreachable"]],
  [["📈","Monitor","Detect outage"],["🔀","Alternate path","If available"],["🖥️","Service","May be reachable"]]
 ]
];
function renderOther(){
 const nodes=sceneSets[current][stage],row=mk("div","case-process");
 nodes.forEach(([emoji,title,description],i)=>{
  if(i)row.append(mk("div","case-process-link "+(stage===1?"bad":""),"●  ━━━━━  ●"));
  const n=mk("div","case-process-node "+(stage===1&&i>=1?"risk":""));
  n.append(mk("span","case-process-icon",emoji),mk("strong","",title),mk("small","",description));row.append(n);
 });
 const footer=mk("div","case-process-note",stage===1?"Highlighted: the changed or disrupted trust decision.":"Illustration of the mechanism, not a packet capture.");
 const wrap=mk("div","case-process-wrap");wrap.append(row,footer);return wrap;
}
function paint(){
 const item=data[current],frame=item.stages[stage];
 panel.dataset.case=item.id;panel.dataset.stage=String(stage);
 $("caseLabCount").textContent=String(current+1).padStart(2,"0")+" / 04 · "+item.year;
 $("caseLabTitle").textContent=item.title;$("caseLabSubtitle").textContent=item.sub;
 $("caseLabStageTitle").textContent=frame[0];$("caseLabDesc").textContent=frame[1];$("caseLabStatus").textContent=frame[2];
 $("caseLabLesson").textContent=item.lesson;
 const links=$("caseLabSources");links.replaceChildren(document.createTextNode("Sources: "));
 item.sources.forEach(([label,url],i)=>{
  if(i)links.append(document.createTextNode(" · "));
  if(!url){links.append(document.createTextNode(label));return}
  const a=mk("a","",label+" ↗");a.href=url;a.target="_blank";a.rel="noopener noreferrer";links.append(a);
 });
 const scene=$("caseLabScene");scene.replaceChildren(current===0?renderTunisia():renderOther());
 panel.querySelectorAll("[data-story-mode]").forEach(b=>{const on=Number(b.dataset.storyMode)===stage;b.classList.toggle("active",on);b.setAttribute("aria-selected",String(on))});
 $("caseLabPrev").disabled=stage===0;$("caseLabNext").disabled=stage===2;
 $("caseLabPlay").querySelector("img").src="./icons/"+(timer===null?"play":"pause")+".svg";
 $("caseLabPlay").querySelector("span").textContent=timer===null?"Play":"Pause";
}
function select(i){if(i<0||i>=data.length)return;stop();current=i;stage=0;paint()}
function mode(i){stop();stage=Math.max(0,Math.min(i,2));paint()}
function play(){
 if(timer!==null){stop();paint();return}
 if(stage===2)stage=0;
 timer=setInterval(()=>{
  if(!root.classList.contains("active")){stop();paint();return}
  if(stage>=2){stop();paint();return}
  stage++;if(stage===2)stop();paint();
 },2500);
 paint();
}
panel.querySelectorAll("[data-story-mode]").forEach(b=>b.addEventListener("click",()=>mode(Number(b.dataset.storyMode))));
$("caseLabPrev").addEventListener("click",()=>mode(stage-1));
$("caseLabNext").addEventListener("click",()=>mode(stage+1));
$("caseLabPlay").addEventListener("click",play);
[...cards.querySelectorAll(".case-card")].forEach((b,i)=>b.addEventListener("click",()=>select(i)));
new MutationObserver(()=>{if(!root.classList.contains("active"))stop()}).observe(root,{attributes:true,attributeFilter:["class"]});
select(0);
})();