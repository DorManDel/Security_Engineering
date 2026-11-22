/* Eight topic teaching stage: concise navigation, 5 lecturer questions,
 * and a distinct illustrated normal/attack/defense scenario for each topic.
 */
(function(){
"use strict";
const slide=document.getElementById("protocols"),topics=window.atlasSelectedTopics;
if(!slide||!Array.isArray(topics)||topics.length!==8)return;
const iconDir="./icons/";
const specs={
 arp:{purpose:"Translate a local IPv4 next-hop address to a MAC address.",roles:["Your device","Real gateway","Local attacker"],icons:["monitor","router","radio-tower"],normal:"The real gateway answers the local ARP question with its own MAC.",attack:"A forged ARP reply points the device at the attacker's MAC instead.",defend:"Switch inspection or trusted ARP bindings reject suspicious changes.",cause:"ARP does not authenticate replies by itself.",short:"Wrong MAC learned → traffic may follow the wrong local device."},
 mac:{purpose:"Demonstrate why a MAC address alone is not strong device identity.",roles:["Allowed device","Access point","Impersonator"],icons:["monitor","wifi","radio-tower"],normal:"Access control sees a known device's MAC on the local link.",attack:"A second device presents the same software-configurable MAC.",defend:"Port or network access authentication verifies more than a MAC label.",cause:"Local interface MAC addresses can be changed in software.",short:"Same MAC label ≠ same authenticated device."},
 ip:{purpose:"Show why a source IP address is not proof of sender identity.",roles:["Recipient","Network filter","Spoofed source"],icons:["server","router","globe"],normal:"A packet arrives with a routable source IP address.",attack:"A packet carries a forged source address; replies may go elsewhere.",defend:"Ingress/egress validation rejects implausible source addresses.",cause:"IP source fields are not intrinsically authenticated.",short:"Claimed source IP can differ from the true sender."},
 dhcp:{purpose:"Provide an IP lease and local network settings automatically.",roles:["Joining client","Legitimate DHCP","Rogue DHCP"],icons:["monitor","network","radio-tower"],normal:"Discover → Offer → Request → ACK from an authorized DHCP service.",attack:"A competing DHCP service advertises malicious gateway or DNS options.",defend:"DHCP snooping and controlled trusted ports restrict rogue replies.",cause:"A client may accept configuration from an untrusted DHCP responder.",short:"Malicious network configuration redirects later traffic."},
 bgp:{purpose:"Exchange destination-prefix reachability between autonomous systems.",roles:["User network","Expected route","Unauthorized AS"],icons:["monitor","router","globe"],normal:"A legitimate network advertises the prefix it is authorized to originate.",attack:"An unauthorized origin announces the prefix and attracts traffic.",defend:"RPKI route-origin validation and prefix filters reduce bad announcements.",cause:"Routing announcements can be incorrect or unauthorized.",short:"Traffic follows an unintended advertised route."},
 dns:{purpose:"Resolve domain names into resource records such as IP addresses.",roles:["Browser","Trusted resolver","Fake answer"],icons:["monitor","book-open","radio-tower"],normal:"The resolver returns the expected address for the requested domain.",attack:"A forged or compromised answer points the browser to a different host.",defend:"Validated DNSSEC when supported and HTTPS certificate checks help.",cause:"Answers or resolver settings can be manipulated without validation.",short:"Familiar domain → unexpected destination IP."},
 syn:{purpose:"Explain how TCP reserves work while establishing a connection.",roles:["Real client","Web server","SYN flood"],icons:["monitor","server","activity"],normal:"One SYN → SYN-ACK → ACK completes a TCP handshake.",attack:"Large numbers of incomplete handshakes pressure pending connection state.",defend:"SYN cookies, filtering and upstream DDoS defenses absorb load.",cause:"Servers can allocate finite resources before handshake completion.",short:"Too many pending handshakes can degrade availability."},
 hijack:{purpose:"Explain the risk of unprotected TCP session data on an attacked path.",roles:["TCP client","TCP server","On-path actor"],icons:["monitor","server","radio-tower"],normal:"A valid TCP sequence reaches the endpoint unchanged.",attack:"An on-path attacker attempts to inject or change session segments.",defend:"Authenticated TLS detects altered protected application traffic.",cause:"TCP sequence tracking alone does not authenticate application data.",short:"Transport delivery is not the same as end-to-end integrity."}
};
const questions=[
 ["Purpose","What problem does the mechanism solve?","purpose"],
 ["Normal operation","What should happen on the network?","normal"],
 ["Trust assumption","What does it trust?","assumption"],
 ["Attack & why","How can the weakness be exploited?","failure"],
 ["Defense","How can we mitigate it?","defense"]
];
function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
const stage=make("div","topic-v2");
stage.innerHTML='<div class="topic-v2-layout"><nav class="topic-v2-nav" aria-label="Choose one of the eight course topics"><div class="topic-v2-mini">8 SELECTED / 13 LECTURE ENTRIES</div><div class="topic-v2-grid" id="topicV2Grid"></div></nav><main class="topic-v2-main"><header class="topic-v2-header"><div><span class="topic-v2-kind" id="topicV2Kind"></span><h3 id="topicV2Title"></h3></div><button type="button" id="topicV2MapLink" class="topic-v2-maplink">Find on network map ↗</button></header><div class="topic-v2-questionbar" role="group" aria-label="Five questions for every topic" id="topicV2Questions"></div><div class="topic-v2-answer"><strong id="topicV2AnswerHead"></strong><p id="topicV2Answer"></p></div><div class="topic-v2-demo" id="topicV2Demo"><div class="topic-v2-trace" id="topicV2Trace"></div><div class="topic-v2-actors" id="topicV2Actors"></div><div class="topic-v2-traffic"><span class="topic-v2-flow"></span><span class="topic-v2-packet"></span></div><p id="topicV2Lesson"></p></div><div class="topic-v2-footer"><span>Conceptual animation · no real network requests</span><div class="topic-v2-actions"><button type="button" id="topicV2Replay">Replay movement ↻</button><button type="button" id="topicV2Previous">‹ Previous</button><button type="button" id="topicV2Next">Next ›</button></div></div></main></div>';
slide.append(stage);
const cards=document.getElementById("topicV2Grid"),qbar=document.getElementById("topicV2Questions");
const iconById={arp:"radio-tower",mac:"wifi",ip:"globe",dhcp:"network",bgp:"router",dns:"book-open",syn:"activity",hijack:"arrow-left-right"};
topics.forEach((topic,i)=>{
 const b=make("button","topic-v2-tile");b.type="button";b.dataset.topic=String(i);
 const image=make("img");image.src=iconDir+iconById[topic.id]+".svg";image.alt="";image.draggable=false;
 b.append(make("small","",String(i+1).padStart(2,"0")),image,make("strong","",topic.title));
 b.onclick=()=>selectTopic(i);cards.append(b);
});
questions.forEach(([title],i)=>{
 const b=make("button","topic-v2-question");b.type="button";b.dataset.question=String(i);
 b.textContent=String(i+1).padStart(2,"0")+" · "+title;b.onclick=()=>selectQuestion(i);qbar.append(b);
});
let selected=0,question=1;
const displayQuestions=["purpose","normal","assumption","failure","defense"];
function mode(){return question>=4?"defend":question>=2?"attack":"normal"}
function animate(){
 const demo=document.getElementById("topicV2Demo");
 demo.classList.remove("topic-v2-motion");void demo.offsetWidth;demo.classList.add("topic-v2-motion");
}
function draw(){
 const x=topics[selected],v=specs[x.id];
 document.querySelectorAll(".topic-v2-tile").forEach((b,i)=>{b.classList.toggle("active",i===selected);b.setAttribute("aria-pressed",String(i===selected))});
 document.querySelectorAll(".topic-v2-question").forEach((b,i)=>{b.classList.toggle("active",i===question);b.setAttribute("aria-pressed",String(i===question))});
 document.getElementById("topicV2Title").textContent=x.title;
 document.getElementById("topicV2Kind").textContent=x.kind;
 document.getElementById("topicV2AnswerHead").textContent=questions[question][1];
 const answer=question===0?v.purpose:question===2?x.assumption:question===3?x.failure+" "+v.cause:x[displayQuestions[question]];
 document.getElementById("topicV2Answer").textContent=answer;
 const present=mode(),demo=document.getElementById("topicV2Demo");
 demo.dataset.mode=present;
 document.getElementById("topicV2Trace").textContent=present==="normal"?"NORMAL PATH":present==="attack"?"UNDER ATTACK":"DEFENDED PATH";
 const actors=document.getElementById("topicV2Actors");actors.replaceChildren();
 v.roles.forEach((name,i)=>{
  const b=make("div","topic-v2-actor"+(i===2&&present==="attack"?" danger":i===1&&present==="defend"?" protected":""));
  const img=make("img");img.src=iconDir+v.icons[i]+".svg";img.alt="";img.draggable=false;
  b.append(img,make("span","",name));actors.append(b);
 });
 document.getElementById("topicV2Lesson").textContent=present==="normal"?v.normal:present==="attack"?v.attack:v.defend;
 document.getElementById("topicV2Previous").disabled=selected===0;
 document.getElementById("topicV2Next").disabled=selected===topics.length-1;
 animate();
}
function selectTopic(i){
 selected=Math.max(0,Math.min(topics.length-1,i));question=1;
 document.querySelector(".topic-option[data-topic='"+selected+"']")?.click();draw();
}
function selectQuestion(i){question=i;draw()}
document.getElementById("topicV2Previous").onclick=()=>selectTopic(selected-1);
document.getElementById("topicV2Next").onclick=()=>selectTopic(selected+1);
document.getElementById("topicV2Replay").onclick=animate;
document.getElementById("topicV2MapLink").onclick=()=>{slideTo(3);renderComponent(topics[selected].map)};
window.atlasGoToTopic=function(i){selectTopic(i);slideTo(4)};
selectTopic(0);
})();