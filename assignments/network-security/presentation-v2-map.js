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
 device:{desc:"Your browser requests the page, while your operating system selects a network interface and a next hop.",steps:["Type URL","Find IP","Send"]},
 ap:{desc:"The access point connects your already-authenticated Wi-Fi device to the local network. It does not by itself assign your IP address.",steps:["Associate","Link ready","Forward"]},
 router:{desc:"The router checks the destination IP address and chooses a next hop. A home router can also perform NAT/PAT.",steps:["Read IP","Choose route","Forward"]},
 internet:{desc:"Many interconnected networks forward traffic toward its destination. BGP exchanges reachability between autonomous systems.",steps:["Learn routes","Select next hop","Forward"]},
 server:{desc:"The server accepts a connection, establishes TLS when appropriate, and returns the requested web content.",steps:["Connection","TLS","HTTP reply"]},
 dhcp:{desc:"DHCP automatically provides the client's local network settings. The four common messages form DORA.",steps:["Discover","Offer","Request","ACK"]},
 dns:{desc:"DNS resolves a domain to an IP address. It is a service queried separately, not a stop every website packet passes through.",steps:["Ask domain","Resolve IP","Return"]},
 arp:{desc:"ARP asks neighbors on the local IPv4 link for a specific IP address's MAC address, usually the gateway's.",steps:["Broadcast","Reply MAC","Cache"]},
 tcp:{desc:"TCP uses a three-way handshake to establish the connection in this example.",steps:["SYN","SYN-ACK","ACK"]}
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
'<div class="p2-map-focus" aria-live="polite">',
'<div><div class="p2-counter" id="v2MapCounter"></div><h3 id="v2MapName"></h3><p id="v2MapDesc"></p></div>',
'<div><div class="p2-map-steps" id="v2MapSteps"></div><p class="p2-caption" id="v2MapBeat" style="font-size:11px;text-align:center;margin:6px 0 0"></p></div>',
'<div class="p2-map-next"><button id="v2MapPrev" aria-label="Previous component">‹</button><span id="v2MapOrdinal"></span><button id="v2MapNext" aria-label="Next component">›</button></div>',
'</div></div>',
'<div class="p2-legend"><span>Solid connections: the forwarding path. Branches: services or protocols—not extra hops.</span><button class="p2-mini" id="v2MapReplay">Replay this component ↻</button></div>'
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
 s.forEach((text,i)=>{
  container.append(make("span","p2-map-step"+(i===beat?" active":""),text));
  if(i<s.length-1)container.append(make("span","", "→"));
 });
 $("v2MapBeat").textContent="Step "+(beat+1)+" / "+s.length+" · "+s[beat];
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
 timer=setInterval(()=>{if(beat>=story.steps.length-1){stop();return}beat++;drawBeat()},950);
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