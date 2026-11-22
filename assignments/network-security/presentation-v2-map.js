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
'<path d="M100 270 L280 270 L460 270 L660 270 L860 270"/>',
'<path class="branch" d="M460 270 Q460 190 450 85"/>',
'<path class="branch" d="M460 270 Q580 120 680 85"/>',
'<path class="branch" d="M280 270 L280 425"/><path class="branch" d="M860 270 L850 425"/>',
'</svg></div>',
'<aside class="p2-map-focus" aria-live="polite">',
'<div class="v5-map-description"><div class="p2-counter" id="v2MapCounter"></div><h3 id="v2MapName"></h3><p id="v2MapDesc"></p></div>',
'<div class="v5-map-story"><div class="p2-counter">HOW IT WORKS</div><div class="p2-map-steps" id="v2MapSteps"></div><p class="p2-caption" id="v2MapBeat"></p></div>',
'<div class="v5-map-toolbar"><button class="p2-mini" id="v2MapReplay" type="button">Replay steps ↻</button><div class="p2-map-next"><button id="v2MapPrev" aria-label="Previous component">‹</button><span id="v2MapOrdinal"></span><button id="v2MapNext" aria-label="Next component">›</button></div></div>',
'</aside></div>',
'<div class="p2-legend"><span>Solid connections show the conceptual forwarding path. Branches indicate supporting services and protocols, not extra mandatory hops.</span></div>'
].join("");
host.append(scene);
const board=$("v2MapCanvas");
nodes.forEach(([id,name,x,y,art],i)=>{
 const b=make("button","p2-map-node");b.type="button";b.dataset.componentV2=id;b.style.left=x+"%";b.style.top=y+"%";b.innerHTML=icon(art);b.append(make("strong","",name));
 b.setAttribute("aria-label","Inspect "+name);b.onclick=()=>focus(i);board.append(b);
});
let index=-1,beat=0,timer=null;
const stop=()=>{if(timer)clearInterval(timer);timer=null};
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
}
const original=renderComponent;
function focus(i){
 stop();index=Math.max(0,Math.min(i,nodes.length-1));beat=0;
 const [id,label]=nodes[index],story=stories[id];
 board.querySelectorAll("[data-component-v2]").forEach(b=>b.classList.toggle("active",b.dataset.componentV2===id));
 $("v2MapCounter").textContent="Interactive explorer · "+id.toUpperCase();
 $("v2MapName").textContent=label;$("v2MapDesc").textContent=story.desc;
 $("v2MapOrdinal").textContent=(index+1)+" / "+nodes.length;
 $("v2MapPrev").disabled=index===0;$("v2MapNext").disabled=index===nodes.length-1;
 original(id);drawBeat();
 const wires=board.querySelectorAll("svg.p2-lines path");wires.forEach((wire,n)=>wire.classList.toggle("focus-route",n===0||({dhcp:1,dns:2,arp:3,tcp:4}[id]===n)));
 if(reduce){beat=story.steps.length-1;drawBeat();return}
 timer=setInterval(()=>{if(beat>=story.steps.length-1){stop();return}beat++;drawBeat()},1750);
}
$("v2MapPrev").onclick=()=>focus(index-1);
$("v2MapNext").onclick=()=>focus(index+1);
$("v2MapReplay").onclick=()=>focus(Math.max(0,index));
renderComponent=function(id){
 const next=nodes.findIndex(n=>n[0]===id);
 if(next>=0&&next!==index)focus(next);else original(id);
};
const before=slideTo;
slideTo=function(i){if(i!==3)stop();before(i)};
focus(0);
})();