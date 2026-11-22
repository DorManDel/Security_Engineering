/* Presentation-first redesign, slides 00 and 01. All demos are offline/illustrative. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const svg={
 device:'<rect x="4" y="5" width="24" height="17" rx="2"/><path d="M2 26h28M13 26l1-4h4l1 4"/>',
 ap:'<path d="M4 11a20 20 0 0 1 24 0M9 16a12 12 0 0 1 14 0M14 21a5 5 0 0 1 4 0"/><circle cx="16" cy="26" r="2"/>',
 router:'<rect x="4" y="10" width="24" height="14" rx="3"/><path d="M9 17h14M9 6l4 4-4 4M23 28l-4-4 4-4"/><circle cx="10" cy="20" r="1"/>',
 internet:'<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c8 7 8 17 0 24M16 4c-8 7-8 17 0 24"/>',
 server:'<rect x="5" y="5" width="22" height="9" rx="2"/><rect x="5" y="18" width="22" height="9" rx="2"/><path d="M10 10h1M10 23h1M15 10h7M15 23h7"/>',
 dhcp:'<rect x="5" y="4" width="22" height="24" rx="3"/><path d="M11 10h11M11 16h11M11 22h8"/>',
 arp:'<circle cx="7" cy="9" r="3"/><circle cx="25" cy="9" r="3"/><circle cx="16" cy="25" r="3"/><path d="M10 10h12M9 12l5 10M23 12l-5 10"/>',
 dns:'<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c8 6 8 18 0 24M16 4c-8 6-8 18 0 24"/>',
 tcp:'<path d="M4 10h22l-5-5M26 22H6l5 5"/><path d="M26 10l-5 5M6 22l5-5"/>'
};
const make=(tag,cls,content)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=content;return x};
const icon=name=>'<span class="p2-router-icon" aria-hidden="true"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'+(svg[name]||svg.device)+'</svg></span>';
window.atlasV2={make,icon,reduce};

/* Opening: a single editorial action, no accidental blue text selection in the 3D scene. */
const enter=$("enterButton");if(enter)enter.innerHTML='Enter the network <span aria-hidden="true">→</span>';
const cube=$("cubeScene");if(cube){cube.addEventListener("selectstart",e=>e.preventDefault());cube.style.userSelect="none";}
const link=document.querySelector(".extras-link");
if(link){link.setAttribute("aria-label","Open the notGoogle classroom lab");link.innerHTML='<span class="not-prefix">not</span><span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span><span class="not-prefix">&nbsp;↗</span>';}
const foot=document.querySelector(".footer");if(foot&&foot.lastElementChild&&foot.lastElementChild.textContent.includes("notes"))foot.lastElementChild.textContent="← → navigate";

/* One click = one WHOLE protocol. Sub-messages play automatically without demanding more clicks. */
const definitions={
 dhcp:{title:"Get your network settings",text:"Before opening a site, your device needs a local IP address and a gateway. DHCP provides those settings automatically.",analogy:"Think of DHCP as a front desk: your computer asks who can assign it a room (an IP address).",service:"dhcp",path:[0,2],messages:[["Discover","Device","LAN","Who can assign settings?"],["Offer","DHCP","Device","Here is an available address"],["Request","Device","DHCP","May I use that address?"],["ACK","DHCP","Device","The lease is confirmed"]]},
 arp:{title:"Find your local gateway",text:"The gateway has an IP address. Your device uses ARP to learn its local MAC address before sending a frame.",analogy:"ARP asks the local network: “Who has the gateway IP?” The gateway answers with its MAC.",service:"arp",path:[0,2],messages:[["Broadcast","Device","Local LAN","Who has 192.168.1.1?"],["Reply","Gateway","Device","Use my MAC address"]]},
 dns:{title:"Find the website's IP",text:"A domain is a human-friendly name. DNS resolves the domain to an IP address that the browser can reach.",analogy:"For example, 8.8.8.8 is a Google Public DNS resolver. It is not the website itself.",service:"dns",path:[0,3],messages:[["Question","Device","Resolver","A record for example.test?"],["Answer","Resolver","Device","203.0.113.42 (illustrative)"]]},
 nat:{title:"Leave your home network",text:"The gateway selects a route. Home-network NAT/PAT can translate your private source IP address and port to a public pair.",analogy:"NAT = Network Address Translation. PAT = Port Address Translation.",service:"router",path:[0,4],messages:[["Local","Device","Gateway","192.168.1.24:55000"],["Translated","Gateway","Internet","203.0.113.10:62001 → server"]]},
 tcp:{title:"Start the connection",text:"TCP establishes a connection using the three-way handshake: SYN, SYN-ACK, ACK.",analogy:"A three-part greeting confirms both sides are prepared to exchange data.",service:"",path:[0,4],messages:[["SYN","Browser","Server","May we connect?"],["SYN-ACK","Server","Browser","I hear you; ready"],["ACK","Browser","Server","Connection established"]]},
 tls:{title:"Secure the connection",text:"For HTTPS over TCP, TLS validates the server’s certificate and sets up encryption and integrity protection.",analogy:"The browser checks who it is talking to before trusting the protected channel.",service:"",path:[0,4],messages:[["ClientHello","Browser","Server","Offer parameters"],["Certificate","Server","Browser","Prove server identity"],["Encrypted","Browser","Server","Protected data channel"]]},
 http:{title:"Request the webpage",text:"The browser requests a page and receives its response. In HTTPS, this HTTP exchange travels inside TLS.",analogy:"HTTP describes requests and responses. HTTPS protects them with TLS.",service:"",path:[0,4],messages:[["Request","Browser","Server","GET /"],["Response","Server","Browser","200 OK · HTML"]]},
 cache:{title:"Reuse remembered settings",text:"The device is already connected. Cached settings or DNS answers can avoid repeating earlier exchanges.",analogy:"A cache is remembered information, used again while it remains valid.",service:"",path:[0,1],messages:[["Lookup","Browser","Cache","Search known settings"],["Ready","Cache","Browser","Continue"]]}
};
const nodes=[["device","Your device","Browser"],["ap","Wi-Fi","Access point"],["router","Gateway","Router"],["internet","Internet","Routing"],["server","Website","Server"]];
const host=$("journey");if(!host)return;
const section=make("div","p2-shell p2-journey");section.innerHTML=[
'<div class="p2-headbar"><div><span class="p2-counter" id="v2JourneyCount"></span><h3 class="p2-stage" id="v2JourneyTitle"></h3></div><div class="p2-actions"><button class="p2-arrow" id="v2Prev" aria-label="Previous protocol">‹</button><button class="p2-arrow" id="v2Next" aria-label="Next protocol">›</button></div></div>',
'<p class="p2-caption" id="v2JourneyDesc"></p>',
'<div class="p2-frame">',
'<div class="p2-address"><label for="v2Url">Browser</label><input class="p2-url" id="v2Url" value="https://example.test/" aria-label="Example website address" spellcheck="false"><button class="p2-go" id="v2Go">Open site →</button></div>',
'<div class="p2-network"><div class="p2-route" id="v2Route"></div><div class="p2-services"><span id="v2Dhcp" class="p2-service">DHCP · network setup</span><span id="v2Arp" class="p2-service">ARP · local MAC</span><span id="v2Dns" class="p2-service">DNS · name lookup</span></div><p id="v2Analogy" class="p2-caption" style="text-align:center;max-width:none;font-size:12px;margin:5px 0"></p></div>',
'<div class="p2-exchange"><div class="p2-stage-status"><span class="p2-exchange-label">What happens on the wire</span><button class="p2-mini" id="v2Replay">Replay exchange ↻</button></div><div class="p2-msg-list" id="v2Msg" aria-live="polite"></div></div>',
'</div>',
'<div class="p2-journey-footer"><span class="p2-sideword">One arrow advances one complete concept.</span><button class="p2-secondary" id="v2CacheMode">Already connected? Explore cached mode ↗</button></div>'
].join("");
host.append(section);
const route=$("v2Route");
nodes.forEach(([id,title,sub])=>{const div=make("div","p2-router");div.id="v2Node-"+id;div.innerHTML=icon(id);div.append(make("strong","",title),make("small","",sub));route.append(div)});
let position=0;const timers=[];
const cancel=()=>{while(timers.length)clearTimeout(timers.pop());route.querySelectorAll(".p2-packet").forEach(x=>x.remove())};
const ids=()=>steps.filter(s=>s.id!=="wifi").map(s=>s.id);
function packet(a,b){
 if(reduce)return;
 const p=make("span","p2-packet");p.style.setProperty("--route-from",(10+a*20)+"%");p.style.setProperty("--route-to",(10+b*20)+"%");
 route.append(p);timers.push(setTimeout(()=>p.remove(),1000));
}
function replay(){
 cancel();const cfg=definitions[ids()[position]];if(!cfg)return;
 const list=$("v2Msg");list.replaceChildren();list.style.setProperty("--msg-count",cfg.messages.length);
 cfg.messages.forEach(([label,source,dest,note],index)=>{
  const el=make("div","p2-msg");el.append(make("strong","",label),make("span","p2-direction",source+" → "+dest),make("small","",note));list.append(el);
  const animate=()=>{
   Array.from(list.children).forEach((v,i)=>{v.classList.toggle("active",i===index);v.classList.toggle("finished",i<index)});
   let [a,b]=cfg.path;if(["Server","Gateway","DHCP","Resolver","Cache"].includes(source))[a,b]=[b,a];
   if(source==="Device"&&dest==="Local LAN")b=1;
   packet(a,b);
  };
  if(reduce)animate();else timers.push(setTimeout(animate,180+850*index));
 });
}
function render(){
 cancel();const order=ids();position=Math.max(0,Math.min(position,order.length-1));
 const current=order[position],cfg=definitions[current]||definitions.dns;
 const index=steps.findIndex(s=>s.id===current);
 if(index>=0)eventTo(index);
 $("v2JourneyCount").textContent=String(position+1).padStart(2,"0")+" / "+String(order.length).padStart(2,"0");
 $("v2JourneyTitle").textContent=cfg.title;$("v2JourneyDesc").textContent=cfg.text;$("v2Analogy").textContent=cfg.analogy;
 $("v2Prev").disabled=position===0;$("v2Next").disabled=position===order.length-1;
 ["Dhcp","Arp","Dns"].forEach(k=>{$("v2"+k).classList.toggle("on",current===k.toLowerCase())});
 nodes.forEach(([id],i)=>{$("v2Node-"+id).classList.toggle("active",cfg.path.includes(i))});
 replay();
}
$("v2Prev").onclick=()=>{position--;render()};
$("v2Next").onclick=()=>{position++;render()};
$("v2Replay").onclick=()=>replay();
$("v2Go").onclick=()=>{let url=$("v2Url").value.trim();$("address").value=url;$("networkState").value="fresh";resetEvents();position=0;render()};
$("v2CacheMode").onclick=()=>{const selector=$("networkState");selector.value=selector.value==="fresh"?"warm":"fresh";resetEvents();position=0;$("v2CacheMode").textContent=selector.value==="warm"?"Start a new network setup ↗":"Already connected? Explore cached mode ↗";render()};
const previous=slideTo;
slideTo=function(i){if(i!==1)cancel();previous(i)};
render();
})();