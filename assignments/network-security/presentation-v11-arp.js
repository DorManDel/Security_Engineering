/* Network Atlas: standalone ARP Poisoning visual, no network calls. */
(function(){
"use strict";
const root=document.getElementById("protocols");
const detail=root?.querySelector(".learning-detail"),cards=document.getElementById("topicGrid");
if(!root||!detail||!cards)return;
const ip="192.168.1.1",goodMac="02:00:00:00:00:11",badMac="02:00:00:00:00:CC";
const modes={
 normal:{
  title:"Normal ARP resolution",
  steps:[
   {title:"01 · Who has the gateway IP?",description:"Victim broadcasts an ARP Request. All devices on the local link can receive it.",tag:"ARP Request · Who has 192.168.1.1?",opcode:"Request (1)",senderIp:"192.168.1.24",senderMac:"02:00:00:00:00:24",cache:"unknown",paths:["broadcast"]},
   {title:"02 · The real gateway replies",description:"The gateway announces its own IP and MAC address in a legitimate ARP Reply.",tag:"ARP Reply · 192.168.1.1 is at ...11",opcode:"Reply (2)",senderIp:ip,senderMac:goodMac,cache:"pending",paths:["gateway-reply"]},
   {title:"03 · The correct MAC is stored",description:"The victim now sends frames for the gateway to its legitimate MAC address.",tag:"Frame → real gateway",opcode:"Reply (2)",senderIp:ip,senderMac:goodMac,cache:"correct",paths:["legitimate"]}
  ]
 },
 attack:{
  title:"ARP cache poisoning",
  steps:[
   {title:"01 · A forged reply arrives",description:"An attacker on the same local link claims the gateway IP belongs to the attacker's MAC.",tag:"FORGED ARP Reply · ...1.1 is at ...CC",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"correct",paths:["forged"]},
   {title:"02 · The victim trusts the claim",description:"If the victim accepts the false mapping, its ARP cache replaces the gateway MAC with the attacker's.",tag:"ARP cache overwritten: ...11 → ...CC",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"poisoned",paths:[]},
   {title:"03 · Frames take the wrong path",description:"Frames intended for the gateway can reach the attacker first. The attacker can relay or drop them; correctly validated TLS still protects encrypted application content.",tag:"Victim → Attacker → Gateway (optional relay)",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"poisoned",paths:["misdirected","relay"]}
  ]
 },
 mitigation:{
  title:"Inspect and reject a false binding",
  steps:[
   {title:"01 · The forged packet reaches a switch",description:"On a managed network, ARP traffic from an untrusted port may be checked using Dynamic ARP Inspection.",tag:"Untrusted ARP Reply → LAN switch",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"correct",paths:["to-switch"]},
   {title:"02 · Binding validation fails",description:"DAI checks trusted IP/MAC binding information (for example DHCP snooping data or configured ARP ACLs) and drops an invalid ARP message.",tag:"REJECT · Gateway IP / MAC mismatch",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"rejected",paths:[]},
   {title:"03 · The correct mapping remains",description:"The forged claim never reaches the victim; frames continue toward the legitimate gateway.",tag:"Victim → Gateway · trusted local mapping",opcode:"Reply (2)",senderIp:ip,senderMac:goodMac,cache:"correct",paths:["legitimate"]}
  ]
 }
};
const $=id=>document.getElementById(id);
const lab=document.createElement("section");lab.id="arpTopicLab";lab.className="arp-lab";lab.innerHTML="\n<div class=\"arp-intro\">\n <div><span class=\"arp-overline\">01 / 08 · LOCAL NETWORK SECURITY</span><h3>ARP Poisoning</h3>\n <p><strong>ARP</strong> (Address Resolution Protocol) maps a local IPv4 address to a MAC address.\n <strong>Poisoning</strong> means forging that mapping to redirect frames.</p></div>\n <span class=\"arp-illustrative\">Illustrative · No packets transmitted</span>\n</div>\n<div class=\"arp-topbar\">\n <div class=\"arp-modes\" role=\"tablist\" aria-label=\"ARP demonstration mode\">\n  <button type=\"button\" data-arp-mode=\"normal\" role=\"tab\">01 · Normal</button>\n  <button type=\"button\" data-arp-mode=\"attack\" role=\"tab\">02 · Attack</button>\n  <button type=\"button\" data-arp-mode=\"mitigation\" role=\"tab\">03 · Mitigation</button>\n </div>\n <div class=\"arp-playback\" role=\"group\" aria-label=\"ARP animation playback\">\n  <button type=\"button\" id=\"arpPrev\" title=\"Previous message\" aria-label=\"Previous message\">‹</button>\n  <button type=\"button\" id=\"arpPlay\" title=\"Play steps\" aria-label=\"Play steps\"><img src=\"./icons/play.svg\" alt=\"\"></button>\n  <button type=\"button\" id=\"arpReplay\" title=\"Replay mode\" aria-label=\"Replay mode\">↻</button>\n  <button type=\"button\" id=\"arpNext\" title=\"Next message\" aria-label=\"Next message\">›</button>\n </div>\n</div>\n<div class=\"arp-progress\"><span id=\"arpModeTitle\"></span><span id=\"arpStepCount\"></span></div>\n<div class=\"arp-network-scene\" id=\"arpNetworkScene\" role=\"group\" aria-label=\"Local network topology\">\n <svg class=\"arp-topology-svg\" viewBox=\"0 0 940 252\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\">\n  <path class=\"arp-link\" d=\"M132 91 L470 91 L808 91\"/>\n  <path class=\"arp-link\" d=\"M470 91 L470 213\"/>\n  <g id=\"arpLivePaths\"></g>\n </svg>\n <div class=\"arp-actor arp-victim\"><img src=\"./icons/monitor.svg\" alt=\"\"><strong>Victim</strong><small>192.168.1.24</small></div>\n <div class=\"arp-actor arp-switch\"><img src=\"./icons/network.svg\" alt=\"\"><strong>LAN switch</strong><small>Local link</small></div>\n <div class=\"arp-actor arp-gateway\"><img src=\"./icons/router.svg\" alt=\"\"><strong>Gateway</strong><small>192.168.1.1</small></div>\n <div class=\"arp-actor arp-attacker\"><img src=\"./icons/monitor.svg\" alt=\"\"><strong>Attacker</strong><small>192.168.1.66</small></div>\n <div id=\"arpSceneTag\" class=\"arp-packet-label\" aria-live=\"polite\"></div>\n</div>\n<div class=\"arp-description\"><strong id=\"arpStepTitle\"></strong><span id=\"arpStepExplanation\"></span></div>\n<div class=\"arp-inspector\">\n <div class=\"arp-inspector-head\"><span>ARP MESSAGE FIELDS</span><span>VICTIM'S ARP CACHE</span></div>\n <div class=\"arp-inspector-fields\">\n  <div><small>Opcode</small><code id=\"arpOpcode\"></code></div>\n  <div><small>Sender IP</small><code id=\"arpSenderIp\"></code></div>\n  <div><small>Sender MAC</small><code id=\"arpSenderMac\"></code></div>\n  <div class=\"arp-cache\"><small>192.168.1.1 →</small><code id=\"arpCachedMac\"></code></div>\n </div>\n <div class=\"arp-change-note\" id=\"arpChangeNote\"></div>\n</div>\n<div class=\"arp-five-questions\" role=\"group\" aria-label=\"Five questions for this topic\">\n <div><b>01 · Purpose</b><span>Local IPv4 → MAC</span></div>\n <div><b>02 · Normal</b><span>Request → Reply → Cache</span></div>\n <div><b>03 · Trust</b><span>Unauthenticated ARP claims</span></div>\n <div><b>04 · Attack & why</b><span>False reply changes mapping</span></div>\n <div><b>05 · Defense</b><span>Validate IP/MAC bindings</span></div>\n</div>\n<div class=\"arp-lab-footer\">\n <span class=\"arp-sources\">Sources: <a href=\"https://www.rfc-editor.org/rfc/rfc826.html\" target=\"_blank\" rel=\"noopener noreferrer\">RFC 826 ↗</a> · <a href=\"https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/sec-crypto/fhs-sisf/fhs-and-sisf-configuration-guide/dynamic-arp-inspection.html\" target=\"_blank\" rel=\"noopener noreferrer\">Cisco DAI ↗</a></span>\n <div><button type=\"button\" id=\"arpBackMap\">ARP in Network Map ↗</button><button type=\"button\" id=\"arpRelated\">Related case studies ↗</button></div>\n</div>";detail.append(lab);
const pathPresets={
 broadcast:[["M132 91 L470 91 L808 91","gold"],["M470 91 L470 213","gold"]],
 "gateway-reply":[["M808 91 L470 91 L132 91","gold"]],
 legitimate:[["M132 91 L470 91 L808 91","gold"]],
 forged:[["M470 213 L470 91 L132 91","red"]],
 misdirected:[["M132 91 L470 91 L470 213","red"]],
 relay:[["M470 213 L470 91 L808 91","gold"]],
 "to-switch":[["M470 213 L470 91","red"]]
};
const ns="http://www.w3.org/2000/svg";
const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false;
let mode="normal",step=0,timer=null,wasArp=false;
function stop(){if(timer!==null){clearInterval(timer);timer=null}}
function drawPaths(keys){
 const group=$("arpLivePaths");group.replaceChildren();
 for(const key of keys)for(const [d,color] of pathPresets[key]||[]){
  const line=document.createElementNS(ns,"path");line.setAttribute("d",d);line.setAttribute("class","arp-active-path "+color);group.append(line);
  if(reduce)continue;
  const dot=document.createElementNS(ns,"circle");dot.setAttribute("r","5");dot.setAttribute("class","arp-moving-dot "+color);
  const motion=document.createElementNS(ns,"animateMotion");motion.setAttribute("dur","2.3s");
  motion.setAttribute("repeatCount","indefinite");motion.setAttribute("path",d);
  dot.append(motion);group.append(dot);
 }
}
function paint(){
 const data=modes[mode],frame=data.steps[step];
 lab.dataset.mode=mode;lab.dataset.step=String(step);
 for(const button of lab.querySelectorAll("[data-arp-mode]")){
  const active=button.dataset.arpMode===mode;button.classList.toggle("active",active);
  button.setAttribute("aria-selected",String(active));button.tabIndex=active?0:-1;
 }
 $("arpModeTitle").textContent=data.title;$("arpStepCount").textContent=(step+1)+" / "+data.steps.length;
 $("arpStepTitle").textContent=frame.title;$("arpStepExplanation").textContent=frame.description;
 $("arpSceneTag").textContent=frame.tag;
 $("arpOpcode").textContent=frame.opcode;$("arpSenderIp").textContent=frame.senderIp;
 $("arpSenderMac").textContent=frame.senderMac;
 const status=frame.cache;
 $("arpCachedMac").textContent=status==="unknown"?"Not yet resolved":status==="pending"?"Reply received…":status==="poisoned"?badMac:goodMac;
 $("arpCachedMac").className=status==="poisoned"?"arp-bad-value":status==="rejected"?"arp-good-value":"";
 $("arpSenderMac").className=(mode!=="normal"&&frame.senderMac===badMac)?"arp-bad-value":"";
 $("arpChangeNote").textContent=status==="poisoned"?"Mapping changed: "+goodMac+" → "+badMac+" (attacker)":
  status==="rejected"?"Blocked at switch: the victim never receives the forged reply.":
  status==="correct"?"Legitimate gateway mapping: "+ip+" → "+goodMac:
  status==="pending"?"A valid reply has arrived.":"The gateway MAC is not known yet.";
 $("arpPrev").disabled=step===0;$("arpNext").disabled=step===data.steps.length-1;
 const play=$("arpPlay");play.querySelector("img").src="./icons/"+(timer===null?"play":"pause")+".svg";
 play.setAttribute("aria-label",timer===null?"Play steps":"Pause steps");play.title=timer===null?"Play steps":"Pause steps";
 lab.querySelector(".arp-attacker").classList.toggle("danger",mode==="attack");
 lab.querySelector(".arp-switch").classList.toggle("verified",mode==="mitigation");
 lab.querySelector(".arp-gateway").classList.toggle("verified",mode!=="attack");
 lab.classList.toggle("arp-blocked",mode==="mitigation"&&step===1);
 drawPaths(frame.paths);
}
function setMode(name){if(!modes[name])return;stop();mode=name;step=0;paint()}
function next(){if(step===modes[mode].steps.length-1){stop();paint();return}step++;paint()}
function togglePlay(){
 if(timer!==null){stop();paint();return}
 if(step===modes[mode].steps.length-1)step=0;
 timer=setInterval(()=>{if(step<modes[mode].steps.length-1){step++;paint()}else{stop();paint()}},2700);
 paint();
}
lab.querySelectorAll("[data-arp-mode]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.arpMode)));
$("arpPrev").addEventListener("click",()=>{stop();step=Math.max(0,step-1);paint()});
$("arpNext").addEventListener("click",()=>{stop();next()});
$("arpReplay").addEventListener("click",()=>{stop();step=0;togglePlay()});
$("arpPlay").addEventListener("click",togglePlay);
$("arpBackMap").addEventListener("click",()=>document.getElementById("topicMap")?.click());
$("arpRelated").addEventListener("click",()=>document.getElementById("topicCases")?.click());
function sync(){
 const isArp=cards.querySelector(".topic-option.active")?.dataset.topic==="0";
 root.classList.toggle("arp-mode",isArp);detail.classList.toggle("arp-focused",isArp);
 if(wasArp!==isArp){stop();mode="normal";step=0;paint()}
 wasArp=isArp;
 if(!root.classList.contains("active"))stop();
}
const observer=new MutationObserver(sync);
observer.observe(cards,{attributes:true,subtree:true,attributeFilter:["class"]});
observer.observe(root,{attributes:true,attributeFilter:["class"]});
paint();sync();
})();