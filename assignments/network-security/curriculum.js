/* Network Atlas: eight selected topics, lecture cases, and the original notGoogle lab. */
(function(){
"use strict";
const el=id=>document.getElementById(id),stage=document.querySelector("main.stage"),nav=document.querySelector(".section-nav");
if(!stage||!nav)return;
const topics=[
 {id:"arp",title:"ARP Poisoning",kind:"Local link / Attack",normal:"ARP maps a local IPv4 address to a link-layer MAC address. A device learns the next hop before sending frames.",assumption:"ARP replies are accepted without built-in origin authentication.",failure:"An attacker on the same local network forges an IP-to-MAC reply, potentially redirecting frames.",defense:"Dynamic ARP Inspection on supported switches, secure access controls and end-to-end TLS limit exposure.",flow:["ARP request","Forged reply","Wrong MAC","Inspect / validate"],map:"arp",case:"ARP poisoning is a lecture mechanism, not a claim about the four country incidents."},
 {id:"mac",title:"MAC Spoofing",kind:"Link / Technique",normal:"Ethernet and Wi-Fi frames use interface MAC addresses on the local link.",assumption:"A MAC address is sometimes mistaken for a strong identity check.",failure:"Software-configurable source MAC addresses can impersonate a permitted address in some environments.",defense:"802.1X, network access control and device authentication rather than MAC allowlists alone.",flow:["Authorized MAC","Imitated MAC","Access decision","Verify identity"],map:"ap",case:"Technique overview. A cloned MAC does not automatically bypass Wi-Fi authentication."},
 {id:"ip",title:"IP Spoofing",kind:"Network / Technique",normal:"IP packets carry source and destination addresses for routing.",assumption:"Some systems trust an apparent source IP without verifying the sender's path.",failure:"A sender forges an IP source, often to conceal origin or trigger a reply to a victim; this does not by itself establish a TCP session.",defense:"Ingress/egress source-address filtering (BCP 38), authentication and stateful validation.",flow:["Source IP","Forged IP","Reply direction","Filter sources"],map:"internet",case:"Concept: spoofed source addresses can also enable reflection and amplification."},
 {id:"dhcp",title:"DHCP",kind:"Network service / Protocol",normal:"DHCP leases an IP address and distributes network options, commonly gateway and DNS resolver addresses.",assumption:"Clients need to distinguish legitimate configuration service responses.",failure:"A rogue DHCP server may advertise an attacker-controlled DNS resolver or default gateway.",defense:"DHCP snooping, controlled access ports, trusted network configuration and authenticated upper-layer services.",flow:["Discover","Offer / Request","ACK","Check options"],map:"dhcp",case:"DNS-related redirection resembles the impact of malicious DHCP options; it is not evidence that DHCP caused Turkey 2014."},
 {id:"bgp",title:"BGP",kind:"Inter-domain routing / Protocol",normal:"Autonomous systems announce IP-prefix reachability to neighboring networks.",assumption:"Routing decisions depend on the quality and authorization of received route announcements.",failure:"Incorrect or unauthorized prefix announcements can attract traffic, blackhole routes or divert packets.",defense:"Prefix filtering, RPKI route-origin validation and operational monitoring; origin validation is not full path security.",flow:["Prefix announced","Route accepted","Traffic diverted","Validate origin"],map:"internet",case:"Turkey 2014, as discussed in the lecture: rerouting related to public DNS access."},
 {id:"dns",title:"DNS",kind:"Name resolution / Protocol",normal:"Resolvers translate hostnames into address records such as A and AAAA.",assumption:"Clients rely on resolver configuration and the correctness of answers.",failure:"Forged replies, compromised resolvers or manipulated configuration can lead clients to the wrong IP.",defense:"DNSSEC when deployed and validated, secure resolver configuration and HTTPS hostname/certificate validation.",flow:["Query hostname","Answer IP","Choose destination","Validate TLS"],map:"dns",case:"Turkey 2014: DNS blocking and attempts to bypass it with public resolvers."},
 {id:"syn",title:"SYN Flooding",kind:"Transport / Attack",normal:"TCP uses SYN, SYN-ACK and ACK to establish a reliable connection.",assumption:"The server allocates resources while handshakes are pending.",failure:"A flood of incomplete connection attempts may exhaust pending-connection capacity.",defense:"SYN cookies, tuned backlog limits, filtering, rate limiting and upstream DDoS protection.",flow:["SYN requests","Half-open queue","Resource pressure","SYN defense"],map:"tcp",case:"Availability example. Do not attribute the Belarus incident to SYN flooding without evidence."},
 {id:"hijack",title:"TCP Hijacking",kind:"Transport / Attack",normal:"TCP identifies flows with addresses/ports and tracks sequence numbers.",assumption:"Endpoints depend on transport state and may be exposed to forged traffic without end-to-end authentication.",failure:"An on-path attacker may attempt to inject or alter session traffic when a higher-layer integrity mechanism is absent.",defense:"Proper authenticated TLS, authenticated application sessions and network-path protections.",flow:["Established TCP","On-path interference","Injected segment","Authenticated TLS"],map:"tcp",case:"Conceptual example: interception does not mean an attacker can read a properly protected HTTPS session."}
];
const cases=[
 {id:"tunisia",label:"Tunisia",year:"2011–2012",title:"HTTP traffic injection",summary:"Lecture example: injected JavaScript in unprotected HTTP responses demonstrated how network-path control could compromise user-facing pages.",normal:"The browser retrieves a web page over HTTP.",attack:"An on-path intermediary modifies the response by injecting script into unprotected content.",outcome:"Client-side code can act in the context of the modified page. The user may not see that the content changed.",lesson:"End-to-end authenticated HTTPS limits undetected in-transit page modification. Check the actual origin and the whole page-delivery path.",map:"server",source:"Lecture case outline; additional primary-source validation pending."},
 {id:"turkey",label:"Turkey",year:"2014",title:"DNS blocking and route redirection",summary:"Lecture example: DNS-based blocking and routing controls affected access to online services and public resolvers.",normal:"A user queries a configured resolver for a service hostname.",attack:"Name-resolution restrictions and subsequent manipulation of routes to a public resolver disrupt the expected path.",outcome:"Using an alternative DNS IP may fail when the network can redirect or block traffic to that resolver.",lesson:"Resolver choice and network routing are separate trust and control layers; understanding both matters.",map:"dns",source:"Lecture case outline; distinguish DNS policy from BGP/routing behavior."},
 {id:"kazakhstan",label:"Kazakhstan",year:"2019",title:"HTTPS trust-anchor interception",summary:"Lecture example: pressure to trust a new national root certificate created the potential for interception of HTTPS sessions.",normal:"The browser validates a server certificate using its trusted root store.",attack:"A device is asked to add another trusted root, potentially allowing an intermediary to issue certificates the browser accepts.",outcome:"TLS confidentiality depends on the trust store and certificate validation, not just on the lock icon.",lesson:"Trust-store integrity and transparent certificate verification are fundamental.",map:"server",source:"Lecture case outline; verify implementation details when writing the final report."},
 {id:"belarus",label:"Belarus",year:"2020",title:"Network disruption and DPI",summary:"Lecture example: nationwide disruptions and traffic filtering reduced connectivity and access.",normal:"Packets reach destinations through available routes and permitted network links.",attack:"Connectivity interruptions and deep-packet-inspection policies alter what traffic can pass.",outcome:"Services become degraded or unreachable despite correctly functioning application encryption.",lesson:"Availability depends on routing and network policy as well as application design.",map:"internet",source:"Lecture case outline; specific mechanisms require independent confirmation."}
];
window.atlasSelectedTopics=topics;
function addSlide(id,tabText,heading,subtitle,layoutHTML){
 const tab=document.createElement("button");tab.className="tab";tab.textContent=tabText;tab.type="button";
 const sec=document.createElement("section");sec.className="slide";sec.id=id;sec.setAttribute("aria-labelledby",id+"Title");
 const head=document.createElement("div");head.className="slide-head";
 const brow=document.createElement("div");brow.className="eyebrow";brow.textContent=String(slides.length).padStart(2,"0")+" / Learning module";
 const h=document.createElement("h2");h.id=id+"Title";h.textContent=heading;
 const p=document.createElement("p");p.textContent=subtitle;head.append(brow,h,p);sec.append(head);
 const layout=document.createElement("div");layout.innerHTML=layoutHTML;while(layout.firstChild)sec.append(layout.firstChild);
 const n=slides.length;tab.dataset.slide=String(n);sec.dataset.index=String(n);
 nav.append(tab);stage.append(sec);slides.push(sec);
 tab.onclick=()=>slideTo(n);
 return sec;
}
addSlide("protocols","04 · Eight Topics","Eight selected topics.","Explore the normal mechanism, its trust assumption, how it can fail and what helps defend it.",
 "<div class='learning-layout'>"+
 "<div class='panel'><div class='micro'>Eight selected from thirteen lecture entries</div><div id='topicGrid' class='topic-grid' style='margin-top:13px'></div><p class='small muted' style='margin:12px 0 0'>Protocols, attack techniques and attacks are labeled separately. Topic selection is an initial proposed set; adjust in the course library.</p></div>"+
 "<aside class='panel learning-detail'><div id='topicCategory' class='micro'></div><h3 id='topicHeading'></h3><div class='phase-strip' id='topicPhases' aria-label='Conceptual stages of topic'></div><div class='inline-controls'><button class='secondary' id='topicPrev'>← Stage</button><span id='topicStageNumber' class='small muted'></span><button class='secondary' id='topicNext'>Stage →</button><button class='secondary' id='topicReplay'>▷ Play stages</button></div>"+
 "<div class='definition-row'><b>Normal behavior</b><p id='topicNormal'></p></div><div class='definition-row'><b>Trust assumption</b><p id='topicAssumption'></p></div><div class='definition-row risk-text'><b>When it becomes dangerous</b><p id='topicFailure'></p></div><div class='definition-row'><b>Protection / mitigation</b><p id='topicDefense'></p></div><p class='small muted' id='topicRelated'></p><div class='detail-actions'><button class='secondary' id='topicMap'>Explore on network map →</button><button class='secondary' id='topicCases'>Related case studies →</button></div></aside></div>"
);
addSlide("cases","05 · Real Cases","From protocols to incidents.","Four historical examples from the lecture, plus the authentic notGoogle educational lab.",
 "<div class='case-grid' id='caseGrid'></div>"+
 "<div class='case-focus'><div class='panel' style='display:flex;flex-direction:column;gap:12px'><div id='caseCategory' class='micro'>Historical incident</div><h3 id='caseHeading'></h3><p id='caseSummary'></p><div class='external-demo'><button class='secondary' id='caseMap'>Find the component →</button><a href='./notgoogle/index.html' target='_blank' rel='noopener noreferrer'>Open notGoogle site ↗</a><a href='https://github.com/DorManDel/notGoogle' target='_blank' rel='noopener noreferrer'>Original repository ↗</a></div><p class='case-source' id='caseSource'></p></div>"+
 "<div class='panel case-steps'><div class='micro'>Before → manipulation → consequence</div><div class='case-step' id='caseNormal'><b>Normal operation</b><p></p></div><div class='case-step weak' id='caseAttack'><b>What changed</b><p></p></div><div class='case-step' id='caseResult'><b>Consequence</b><p></p></div><div class='small muted' id='caseLesson'></div><div class='inline-controls'><button class='secondary' id='caseStep'>▷ Play story</button><button class='secondary' id='caseReset'>Reset</button></div></div></div>"
);
const oldSlideTo=slideTo;
slideTo=function(i){oldSlideTo(i);if(i>=0&&i<slides.length)el("pageNumber").textContent=String(i+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0")};

/* 04: ordered sub-stages per selected topic. */
let selectedTopic=0,topicStage=0,topicLoop=null;
const cards=el("topicGrid");
topics.forEach((x,i)=>{
 const b=document.createElement("button");b.type="button";b.className="topic-option";b.dataset.topic=String(i);
 const n=document.createElement("span");n.className="topic-n";n.textContent=String(i+1).padStart(2,"0")+" / 08";
 const strong=document.createElement("strong");strong.textContent=x.title;
 const small=document.createElement("small");small.textContent=x.kind;
 b.append(n,strong,small);b.onclick=()=>selectTopic(i);cards.append(b)
});
function topicStop(){if(topicLoop){clearInterval(topicLoop);topicLoop=null}el("topicReplay").textContent="▷ Play stages"}
function showTopicStage(){
 const x=topics[selectedTopic];topicStage=Math.max(0,Math.min(x.flow.length-1,topicStage));
 el("topicPhases").replaceChildren();
 x.flow.forEach((name,i)=>{
  if(i){const arrow=document.createElement("span");arrow.className="phase-arrow";arrow.textContent="→";el("topicPhases").append(arrow)}
  const box=document.createElement("span");box.className="phase-node"+((i===topicStage&&topicStage>=1)?" weak":"");box.textContent=name;
  box.style.opacity=i===topicStage?"1":".42";el("topicPhases").append(box);
 });
 el("topicStageNumber").textContent=(topicStage+1)+" / "+x.flow.length;
 el("topicPrev").disabled=topicStage===0;el("topicNext").disabled=topicStage===x.flow.length-1;
}
function selectTopic(i){
 topicStop();selectedTopic=i;topicStage=0;const x=topics[i];
 document.querySelectorAll("[data-topic]").forEach(b=>b.classList.toggle("active",Number(b.dataset.topic)===i));
 el("topicCategory").textContent=x.kind;el("topicHeading").textContent=x.title;
 el("topicNormal").textContent=x.normal;el("topicAssumption").textContent=x.assumption;
 el("topicFailure").textContent=x.failure;el("topicDefense").textContent=x.defense;
 el("topicRelated").textContent=x.case;showTopicStage();
}
el("topicPrev").onclick=()=>{topicStop();topicStage--;showTopicStage()};
el("topicNext").onclick=()=>{topicStop();topicStage++;showTopicStage()};
el("topicReplay").onclick=()=>{if(topicLoop){topicStop();return}topicStage=0;showTopicStage();el("topicReplay").textContent="Ⅱ Pause";topicLoop=setInterval(()=>{
 if(topicStage>=topics[selectedTopic].flow.length-1){topicStop();return}topicStage++;showTopicStage()},1100)};
el("topicMap").onclick=()=>{slideTo(3);renderComponent(topics[selectedTopic].map)};
el("topicCases").onclick=()=>slideTo(5);
window.atlasGoToTopic=function(i){selectTopic(Math.max(0,Math.min(topics.length-1,i)));slideTo(4)};
selectTopic(0);

/* 05: incident explanation uses three progressive states. */
let currentCase=0,caseStepIndex=0,caseTimer=null;
const caseCards=el("caseGrid");
cases.forEach((x,i)=>{
 const b=document.createElement("button");b.type="button";b.className="case-card";
 const eyebrow=document.createElement("span");eyebrow.className="micro";eyebrow.textContent=x.year;
 const strong=document.createElement("strong");strong.textContent=x.label;
 const small=document.createElement("small");small.textContent=x.title;b.append(eyebrow,strong,small);
 b.onclick=()=>selectCase(i);caseCards.append(b)
});
function caseStop(){if(caseTimer){clearInterval(caseTimer);caseTimer=null}el("caseStep").textContent="▷ Play story"}
function paintCase(){
 ["caseNormal","caseAttack","caseResult"].forEach((id,i)=>{const node=el(id);node.style.opacity=i<=caseStepIndex?"1":".38";node.style.borderColor=i===caseStepIndex?"#a9d4e8a8":""});
 el("caseStep").disabled=caseStepIndex===2;
}
function selectCase(i){
 caseStop();currentCase=i;caseStepIndex=0;const x=cases[i];
 Array.from(caseCards.children).forEach((node,n)=>node.classList.toggle("active",n===i));
 el("caseCategory").textContent=x.label+" · "+x.year;el("caseHeading").textContent=x.title;
 el("caseSummary").textContent=x.summary;el("caseSource").textContent=x.source;
 el("caseNormal").querySelector("p").textContent=x.normal;el("caseAttack").querySelector("p").textContent=x.attack;
 el("caseResult").querySelector("p").textContent=x.outcome;el("caseLesson").textContent="Lesson: "+x.lesson;paintCase();
}
el("caseMap").onclick=()=>{slideTo(3);renderComponent(cases[currentCase].map)};
el("caseReset").onclick=()=>{caseStop();caseStepIndex=0;paintCase()};
el("caseStep").onclick=()=>{caseStop();caseStepIndex=0;paintCase();el("caseStep").textContent="Ⅱ Playing";
 caseTimer=setInterval(()=>{if(caseStepIndex>=2){caseStop();return}caseStepIndex++;paintCase()},1100)};
selectCase(0);

/* A prominent one-click link opens the user's ACTUAL notGoogle page, not the placeholder. */
const tools=document.querySelector(".tools"),link=document.createElement("a");
link.href="./notgoogle/index.html";link.target="_blank";link.rel="noopener noreferrer";link.className="extras-link";
link.textContent="notGoogle ↗";link.title="Open original educational notGoogle lab in a separate tab";
tools.insertBefore(link,tools.firstChild);

/* The old made-up Searchly thumbnail is replaced with a direct source-derived entry. */
const oldDemo=el("demoModal");
if(oldDemo){
 const fake=oldDemo.querySelector(".search-demo");if(fake)fake.remove();
 const address=el("demoAddress");if(address)address.textContent="Security_Engineering / assignments / network-security / notgoogle /";
 const reveal=el("revealButton");if(reveal)reveal.remove();
 const obsolete=el("demoReveal");if(obsolete){obsolete.hidden=true;obsolete.textContent="The original notGoogle educational demo is available at a local assignment path and in its source repository. It uses an explicit reveal mechanism and demo-only data."; }
 const h=el("demoTitle");if(h)h.textContent="Explore the original notGoogle lab.";
 const intro=oldDemo.querySelector(".dialog > p");if(intro)intro.textContent="A standalone copy of the user's notGoogle demonstration is now included in this assignment. Open it in a new tab, try the familiar search UI and use its built-in reveal. No credential collection is needed for this lesson.";
 const bar=oldDemo.querySelector(".inline-controls");
 if(bar){
  const open=document.createElement("a");open.href="./notgoogle/index.html";open.target="_blank";open.rel="noopener noreferrer";open.className="primary";open.textContent="Open notGoogle demo ↗";
  const original=document.createElement("a");original.href="https://github.com/DorManDel/notGoogle";original.target="_blank";original.rel="noopener noreferrer";original.className="secondary";original.textContent="Source repository ↗";
  bar.prepend(open,original);
 }
}
const introControls=el("enterButton")?.parentElement;if(introControls){
 const open=document.createElement("a");open.href="./notgoogle/index.html";open.target="_blank";open.rel="noopener noreferrer";
 open.className="secondary";open.textContent="notGoogle demo ↗";introControls.append(open)
}
const initial=(location.hash||"").slice(1),initialIndex=slides.findIndex(s=>s.id===initial);
if(initialIndex>=4)slideTo(initialIndex);
else el("pageNumber").textContent=String(activeSlide+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
})();
