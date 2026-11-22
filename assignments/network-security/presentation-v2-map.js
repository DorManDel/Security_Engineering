/* Slide 03: interactive network topology is ONE canvas, not two disconnected windows. */
(function(){
"use strict";
const $=id=>document.getElementById(id),host=$("map");if(!host)return;
const {make,icon,reduce}=window.atlasV2;
const nodes=[
 ["device","Your device",10,54,"device"],["ap","Wi-Fi access point",28,54,"ap"],
 ["router","Gateway / router",46,54,"router"],["internet","Internet",66,54,"internet"],
 ["server","Web server",86,54,"server"],["dhcp","DHCP",45,17,"dhcp"],
 ["dns","DNS resolver",68,17,"dns"],["arp","ARP",28,85,"arp"],
 ["tcp","TCP",85,85,"tcp"]
];
const stories={
 device:{desc:"Your browser begins with a URL. The operating system handles the network connection and the next local hop.",steps:[["Enter a URL","Tell the browser which website to open."],["Find an IP","Use a valid cached answer or ask DNS for the destination address."],["Connect & send","The OS selects the route; the browser opens a connection and requests the page."]]},
 ap:{desc:"The Wi-Fi access point links your device to the local network. It forwards frames; it does not itself have to assign the IP address.",steps:[["Join Wi-Fi","Associate with the access point; authenticate when required."],["Establish the link","Your device can now exchange frames on the local network."],["Forward frames","The access point bridges traffic toward other local devices or the gateway."]]},
 router:{desc:"The router forwards IP packets between networks. A home gateway may also translate source addresses and ports with NAT/PAT.",steps:[["Read destination","Inspect the destination IP address in the packet."],["Choose next hop","Consult routing information to determine where to forward it."],["Forward","Send the packet onward; apply NAT/PAT where configured."]]},
 internet:{desc:"The Internet consists of interconnected networks. Routers use routing tables to forward packets; BGP distributes reachability between networks.",steps:[["Advertise reachability","Networks exchange route information, often through BGP."],["Choose the route","Routers use available routing information to select a next hop."],["Forward the packet","Each router sends the packet closer to its destination."]]},
 server:{desc:"The destination server processes the request. In this HTTPS-over-TCP example, TCP and TLS precede the protected HTTP exchange.",steps:[["Accept connection","Complete the TCP connection handshake."],["Establish TLS","Present a certificate and negotiate protected communication."],["Respond to HTTP","Process the request and return a response, such as 200 OK."]]},
 dhcp:{desc:"DHCP assigns local network settings automatically when a client needs a lease.",steps:[["Discover","The client asks which DHCP servers are available."],["Offer","A DHCP server offers an address and configuration."],["Request","The client requests the offered configuration."],["ACK","The server acknowledges the lease and settings."]]},
 dns:{desc:"DNS resolves names to resource records, including addresses. A DNS resolver is queried separately; it is not a required hop for every website packet.",steps:[["Ask the resolver","Request an address record for the domain."],["Find the answer","The resolver uses cached data or performs further lookups."],["Return the result","The resolver sends the answer back to the client."]]},
 arp:{desc:"ARP maps a local IPv4 neighbor's IP address to its MAC address, typically to reach the gateway when sending off-link traffic.",steps:[["Broadcast a question","Who has the gateway's local IPv4 address?"],["Receive the reply","The owner replies with its link-layer MAC address."],["Send the frame","The device can address the next frame to that MAC."]]},
 tcp:{desc:"In this example, TCP establishes a reliable connection with a three-way handshake.",steps:[["SYN","The client requests a connection."],["SYN-ACK","The server acknowledges and replies."],["ACK","The client acknowledges; the connection is established."]]}
};
const scene=make("div","p2-shell p2-map");
scene.innerHTML=[
'<div class="p2-map-board">',
'<div class="p2-topology" id="v2MapCanvas">',
'<div class="p2-map-note">Choose a component to see it in action</div>',
'<svg class="p2-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">',
'<path data-path="device-ap" d="M100 270 L280 270"/>',
'<path data-path="ap-router" d="M280 270 L460 270"/>',
'<path data-path="router-internet" d="M460 270 L660 270"/>',
'<path data-path="internet-server" d="M660 270 L860 270"/>',
'<path class="branch" data-path="router-dhcp" d="M460 270 Q460 190 450 85"/>',
'<path class="branch" data-path="router-dns" d="M460 270 Q580 120 680 85"/>',
'<path class="branch" data-path="ap-arp" d="M280 270 L280 425"/>',
'<path class="branch" data-path="server-tcp" d="M860 270 L850 425"/>',
'</svg></div>',
'<aside class="p2-map-focus" aria-live="polite">',
'<div class="v5-map-description"><div class="p2-counter" id="v2MapCounter"></div><h3 id="v2MapName"></h3><p id="v2MapDesc"></p></div>',

'<div class="v8-lab" id="v8Lab" aria-label="Illustrative protocol exchange"><div class="v8-lab-heading"><span>VISUAL EXCHANGE</span><span>Illustrative · not live traffic</span></div><div class="v8-lab-channel"><strong id="v8LabLeft"></strong><div class="v8-lab-track"><span class="v8-lab-packet" aria-hidden="true"></span></div><strong id="v8LabRight"></strong></div><div class="v8-lab-payload" id="v8LabPayload"></div><p id="v8LabInfo" class="v8-lab-info"></p></div>',
'<div class="v5-map-story"><div class="p2-counter">HOW IT WORKS</div><div class="p2-map-steps" id="v2MapSteps"></div><p class="p2-caption" id="v2MapBeat"></p></div>',
'<div class="v5-map-toolbar"><div class="v9-map-controls"><button class="p2-mini" id="v2MapReplay" type="button">↻ Replay</button><button class="v9-pause-map" id="v9MapPause" type="button" aria-label="Pause steps" title="Pause steps"></button></div><div class="p2-map-next"><button id="v2MapPrev" aria-label="Previous component">‹</button><span id="v2MapOrdinal"></span><button id="v2MapNext" aria-label="Next component">›</button></div></div>',
'</aside></div>',
'<div class="p2-legend"><span>Solid connections show the conceptual forwarding path. Branches indicate supporting services and protocols, not extra mandatory hops.</span></div>'
].join("");
host.append(scene);
const board=$("v2MapCanvas");
nodes.forEach(([id,name,x,y,art],i)=>{
 const b=make("button","p2-map-node");b.type="button";b.dataset.componentV2=id;b.style.left=x+"%";b.style.top=y+"%";b.innerHTML=icon(art);b.append(make("strong","",name));
 b.setAttribute("aria-label","Inspect "+name);b.onclick=()=>focus(i);board.append(b);
});
const routeFor={
 device:[],ap:["device-ap"],router:["device-ap","ap-router"],internet:["device-ap","ap-router","router-internet"],
 server:["device-ap","ap-router","router-internet","internet-server"],
 dhcp:["device-ap","ap-router","router-dhcp"],
 dns:["device-ap","ap-router","router-dns"],
 arp:["device-ap","ap-arp"],
 tcp:["device-ap","ap-router","router-internet","internet-server","server-tcp"]
};
const ns="http://www.w3.org/2000/svg";
const lineSvg=board.querySelector("svg.p2-lines");
let trafficLayer=document.createElementNS(ns,"g");trafficLayer.setAttribute("class","v6-traffic-layer");
lineSvg.append(trafficLayer);
let focusPathId="";
function addTraffic(path,delay=0){
 // Two independent packets travel in opposite directions, along the selected path.
 const d=path.getAttribute("d"),length=path.getTotalLength();
 for(const backward of [false,true]){
  const dot=document.createElementNS(ns,"rect");
  dot.setAttribute("width","8");dot.setAttribute("height","6");dot.setAttribute("rx","2");
  dot.setAttribute("x","-4");dot.setAttribute("y","-3");
  dot.setAttribute("class","v6-map-packet"+(backward?" returning":" outgoing"));
  const motion=document.createElementNS(ns,"animateMotion");
  motion.setAttribute("dur","3.6s");motion.setAttribute("repeatCount","indefinite");
  motion.setAttribute("keyTimes","0;1");motion.setAttribute("keyPoints",backward?"1;0":"0;1");
  motion.setAttribute("calcMode","linear");motion.setAttribute("path",d);
  motion.setAttribute("begin",(delay+(backward?1.2:0))+"s");
  dot.append(motion);trafficLayer.append(dot);
 }
}
function selectRoute(id){
 const active=new Set(routeFor[id]||[]);
 const paths=Array.from(lineSvg.querySelectorAll("path[data-path]"));
 trafficLayer.replaceChildren();
 paths.forEach((path,n)=>{
  const selected=active.has(path.dataset.path);
  path.classList.toggle("focus-route",selected);
  path.classList.toggle("v6-path-muted",!selected);
  if(selected)addTraffic(path,n*.16);
 });
}

// Small mechanism-specific teaching scenes. Each frame corresponds to one explanation step.
const labFrames={
 device:[
  ["Browser","Website name","https://example.test/","forward","A URL identifies a site by name, not an IP address."],
  ["Browser","DNS / cache","A? example.test","forward","A cached answer can avoid a new DNS query."],
  ["Device","Gateway","To 203.0.113.42","forward","The next-hop decision is made locally before sending frames."]
 ],
 ap:[
  ["Device","Wi-Fi AP","Associate / authenticate","forward","Wi-Fi link establishment occurs before ordinary frame forwarding."],
  ["Device","Wi-Fi AP","Link ready","forward","The local wireless link is ready to carry frames."],
  ["Wi-Fi AP","Local network","802.11 ↔ Ethernet frame","forward","The access point bridges local traffic; it does not necessarily run DHCP."]
 ],
 router:[
  ["Router","Route table","Dst: 203.0.113.42","forward","A destination-prefix lookup determines which route applies."],
  ["Route table","ISP next hop","Forward via WAN","forward","The selected next hop leads toward the destination network."],
  ["Private LAN","Public WAN","192.168.1.24:55000 → 203.0.113.10:62001","forward","Example source NAT/PAT mapping; IP routing and translation are different operations."]
 ],
 internet:[
  ["AS 64500","AS 64501","BGP: prefix reachable","forward","Autonomous systems exchange reachability advertisements."],
  ["Router","Route table","Best next hop selected","reverse","Routes are evaluated using local routing policy."],
  ["AS 64501","AS 64502","Forward destination IP","forward","Routers forward packets hop by hop across networks."]
 ],
 server:[
  ["Browser","Server","TCP connection","forward","Transport connection is established first in this example."],
  ["Browser","Server","TLS certificate","reverse","The server presents a certificate; the browser validates its identity."],
  ["Browser","Server","HTTP 200 OK","reverse","The server returns protected content over the established channel."]
 ],
 dhcp:[
  ["Client","DHCP service","Discover","forward","A client broadcasts to locate a DHCP server on the local network."],
  ["Client","DHCP service","Offer","reverse","A DHCP server offers configuration, usually including a lease."],
  ["Client","DHCP service","Request","forward","The client requests the offered configuration."],
  ["Client","DHCP service","ACK","reverse","The server confirms the lease and network options."]
 ],
 dns:[
  ["Browser","DNS resolver","A? example.test","forward","The client asks the configured resolver for an address record."],
  ["Resolver","DNS cache / authorities","Lookup record","forward","A cached record may be used, or the resolver may query other servers."],
  ["Browser","DNS resolver","203.0.113.42","reverse","The answer returns an example IPv4 address, not a path through the DNS server."]
 ],
 arp:[
  ["Device","Local IPv4 link","Who has 192.168.1.1?","forward","ARP Request is a broadcast within the local link."],
  ["Device","Gateway","MAC 02:00:00:00:00:01","reverse","A local IPv4 neighbor responds with a MAC address."],
  ["Device","Gateway","Frame to gateway MAC","forward","The next frame can be addressed to the local gateway's MAC."]
 ],
 tcp:[
  ["Client","Server","SYN","forward","The client requests a new TCP connection."],
  ["Client","Server","SYN-ACK","reverse","The server acknowledges the client's SYN and sends its own."],
  ["Client","Server","ACK","forward","The final acknowledgment completes the three-way handshake."]
 ]
};
function renderLab(id,step){
 const lab=$("v8Lab");if(!lab)return;
 lab.classList.toggle("v10-as-lab",id==="internet");
 lab.classList.toggle("v10-ladder-lab",id==="tcp"||id==="dhcp");
 const heading=make("div","v8-lab-heading");heading.append(make("span","","HOW IT REALLY WORKS"),make("span","","Illustrative · step "+(step+1)));
 lab.replaceChildren(heading,window.networkAtlasScenes.create(id,step,reduce));
}

let index=-1,beat=0,timer=null,paused=false,nextDue=0,remaining=0;
function stop(){if(timer)clearTimeout(timer);timer=null}
function schedule(delay){
 stop();remaining=delay;nextDue=performance.now()+delay;
 timer=setTimeout(()=>{
  timer=null;if(paused)return;
  const sequence=stories[nodes[index][0]].steps;
  if(beat>=sequence.length-1){paintPause();return}
  beat++;drawBeat();if(beat<sequence.length-1)schedule(2800);else paintPause();
 },delay);
}
function paintPause(){
 const btn=$("v9MapPause");if(!btn)return;
 const playing=!paused;
 const label=playing?"Pause steps":"Play steps";
 btn.setAttribute("aria-label",label);btn.title=label;btn.setAttribute("aria-pressed",String(paused));
 btn.replaceChildren();
 const img=document.createElement("img");img.src="./icons/"+(playing?"pause":"play")+".svg";img.alt="";
 btn.append(img);
}
function togglePause(){
 if(reduce)return;
 const last=stories[nodes[index][0]].steps.length-1;
 paused=!paused;
 if(paused){remaining=Math.max(1,nextDue-performance.now());stop()}
 else if(beat<last)schedule(Math.max(80,remaining));
 host.classList.toggle("v9-map-paused",paused);
 host.querySelectorAll("svg").forEach(svg=>{if(paused)svg.pauseAnimations?.();else svg.unpauseAnimations?.()});
 paintPause();
}
function drawBeat(){
 const s=stories[nodes[index][0]].steps,container=$("v2MapSteps");container.replaceChildren();
 s.forEach(([label,description],i)=>{
  const current=i===beat;
  const item=make("div","p2-map-step v5-map-step"+(current?" active":""));
  if(current)item.setAttribute("aria-current","step");
  item.append(make("span","v5-map-step-number",String(i+1).padStart(2,"0")));
  const copy=make("span","v5-map-step-copy");
  copy.append(make("strong","",label),make("small","",description));
  item.append(copy);container.append(item);
 });
 $("v2MapBeat").textContent="Step "+(beat+1)+" of "+s.length+" · "+s[beat][0];
 renderLab(nodes[index][0],beat);
}
const original=renderComponent;
function focus(i){
 stop();paused=false;host.classList.remove("v9-map-paused");host.querySelectorAll("svg").forEach(svg=>svg.unpauseAnimations?.());index=Math.max(0,Math.min(i,nodes.length-1));beat=0;
 const [id,label]=nodes[index],story=stories[id];
 board.querySelectorAll("[data-component-v2]").forEach(b=>b.classList.toggle("active",b.dataset.componentV2===id));
 $("v2MapCounter").textContent="Interactive explorer · "+id.toUpperCase();
 $("v2MapName").textContent=label;$("v2MapDesc").textContent=story.desc;
 $("v2MapOrdinal").textContent=(index+1)+" / "+nodes.length;
 $("v2MapPrev").disabled=index===0;$("v2MapNext").disabled=index===nodes.length-1;
 original(id);drawBeat();
 selectRoute(id);
 if(reduce){beat=story.steps.length-1;drawBeat();paintPause();return}
 if(story.steps.length>1)schedule(2800);
 paintPause();
}
$("v2MapPrev").onclick=()=>focus(index-1);
$("v2MapNext").onclick=()=>focus(index+1);
$("v2MapReplay").onclick=()=>focus(Math.max(0,index));
$("v9MapPause").onclick=togglePause;
renderComponent=function(id){
 const next=nodes.findIndex(n=>n[0]===id);
 if(next>=0&&next!==index)focus(next);else original(id);
};
const before=slideTo;
slideTo=function(i){if(i!==3){stop();host.classList.add("v9-map-paused");host.querySelectorAll("svg").forEach(svg=>svg.pauseAnimations?.())}else if(!paused){host.classList.remove("v9-map-paused");host.querySelectorAll("svg").forEach(svg=>svg.unpauseAnimations?.());if(index>=0&&beat<stories[nodes[index][0]].steps.length-1)schedule(Math.max(100,remaining||2800))}before(i)};
focus(0);
})();