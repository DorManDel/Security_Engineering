/* Presentation-first redesign, slides 00 and 01. All demos are offline/illustrative. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Existing outline icons from Lucide (vendored locally under icons/, ISC license).
const iconFiles={device:"monitor",ap:"wifi",router:"router",internet:"globe",server:"server",dhcp:"network",arp:"radio-tower",dns:"book-open",tcp:"arrow-left-right"};
const make=(tag,cls,content)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=content;return x};
const icon=name=>'<span class="p2-router-icon" aria-hidden="true"><img src="./icons/'+(iconFiles[name]||"monitor")+'.svg" alt="" width="32" height="32" draggable="false"></span>';
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
'<div class="p2-headbar"><div><span class="p2-counter" id="v2JourneyCount"></span><h3 class="p2-stage" id="v2JourneyTitle"></h3></div><div class="v4-header-controls"><div class="v4-mode" role="group" aria-label="Network state"><button type="button" id="v4Fresh" class="active" aria-pressed="true">New connection</button><button type="button" id="v4Warm" aria-pressed="false">Already connected</button></div><div class="p2-actions"><button class="p2-arrow" id="v2Prev" aria-label="Previous protocol">‹ <span>Previous</span></button><button class="p2-arrow" id="v2Next" aria-label="Next protocol"><span>Next</span> ›</button></div></div></div>',
'<p class="p2-caption" id="v2JourneyDesc"></p>',
'<div class="p2-frame">',
'<div class="p2-address"><label for="v2Url">Browser</label><input class="p2-url" id="v2Url" value="https://example.test/" aria-label="Example website address" spellcheck="false"><button class="p2-go" id="v2Go">Open site →</button></div>',
'<div class="p2-network"><div class="p2-route" id="v2Route"></div><div class="p2-services"><span id="v2Dhcp" class="p2-service">DHCP · network setup</span><span id="v2Arp" class="p2-service">ARP · local MAC</span><span id="v2Dns" class="p2-service">DNS · name lookup</span></div><p id="v2Analogy" class="p2-caption" style="text-align:center;max-width:none;font-size:12px;margin:5px 0"></p></div>',
'<div class="p2-exchange"><div class="p2-stage-status"><span class="p2-exchange-label">What happens on the wire</span><button class="p2-mini" id="v2Replay">Replay exchange ↻</button></div><div class="p2-msg-list" id="v2Msg" aria-live="polite"></div></div>',
'</div>',
'<div class="p2-journey-footer"><span class="p2-sideword" id="v4JourneyStatus" role="status" aria-live="polite">Next / Previous: one concept. Open site: complete walkthrough.</span></div>'
].join("");
host.append(section);
const route=$("v2Route");
nodes.forEach(([id,title,sub])=>{const div=make("div","p2-router");div.id="v2Node-"+id;div.innerHTML=icon(id);div.append(make("strong","",title),make("small","",sub));route.append(div)});
let position=0;const timers=[];
let tourTimer=null,touring=false,tourFinished=false;
function stopTour(){if(tourTimer)clearTimeout(tourTimer);tourTimer=null;touring=false;const go=$("v2Go");if(go)go.textContent=tourFinished?"Replay journey ↻":"Open site →";}
const cancel=()=>{while(timers.length)clearTimeout(timers.pop());route.querySelectorAll(".p2-packet").forEach(x=>x.remove())};
const ids=()=>steps.filter(s=>s.id!=="wifi").map(s=>s.id);
function packet(a,b){
 if(reduce)return;
 // Follow the actual centers of the visible Lucide icons, not hard-coded whole-page percentages.
 const all=Array.from(route.querySelectorAll(".p2-router"));
 const source=all[a]?.querySelector(".p2-router-icon"),dest=all[b]?.querySelector(".p2-router-icon");
 if(!source||!dest||!route.clientWidth)return;
 const bounds=route.getBoundingClientRect(),sr=source.getBoundingClientRect(),dr=dest.getBoundingClientRect();
 const x=rect=>((rect.left+rect.width/2-bounds.left)/bounds.width*100).toFixed(3)+"%";
 const y=((sr.top+sr.height/2-bounds.top)/bounds.height*100).toFixed(3)+"%";
 const p=make("span","p2-packet");p.style.setProperty("--route-from",x(sr));p.style.setProperty("--route-to",x(dr));p.style.setProperty("--route-y",y);
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
 const warm=$("networkState").value==="warm";
 for(const [id,checked] of [["v4Fresh",!warm],["v4Warm",warm]]){
  $(id).classList.toggle("active",checked);$(id).setAttribute("aria-pressed",String(checked));
 }
 ["Dhcp","Arp","Dns"].forEach(k=>{$("v2"+k).classList.toggle("on",current===k.toLowerCase())});
 nodes.forEach(([id],i)=>{$("v2Node-"+id).classList.toggle("active",cfg.path.includes(i))});
 replay();
}
function runFullJourney(){
 if(touring){stopTour();$("v4JourneyStatus").textContent="Walkthrough paused. Choose a stage or restart.";return}
 stopTour();tourFinished=false;
 const address=$("v2Url").value.trim();
 if(!/^https?:\/\//i.test(address)){ $("v4JourneyStatus").textContent="Start the demonstration URL with http:// or https://";return }
 $("address").value=address;resetEvents();position=0;touring=true;
 $("v2Go").textContent="Stop walkthrough ×";
 $("v4JourneyStatus").textContent="Playing the complete example journey · simulated packets";
 render();
 function advance(){
  if(!touring)return;
  const current=definitions[ids()[position]];
  const duration=reduce?420:Math.max(1800,180+850*(current.messages.length-1)+1150);
  tourTimer=setTimeout(()=>{
   if(!touring)return;
   if(position>=ids().length-1){
    tourFinished=true;touring=false;tourTimer=null;
    $("v2Go").textContent="Replay journey ↻";
    $("v4JourneyStatus").textContent="✓ Website response received (illustrative). All required route actors are visible.";
    return;
   }
   position++;render();advance();
  },duration);
 }
 advance();
}
$("v2Prev").onclick=()=>{stopTour();tourFinished=false;position--;render()};
$("v2Next").onclick=()=>{stopTour();tourFinished=false;position++;render()};
$("v2Replay").onclick=()=>{stopTour();tourFinished=false;replay()};
$("v2Go").onclick=runFullJourney;
function changeNetworkState(value){
 stopTour();tourFinished=false;
 const selector=$("networkState");selector.value=value;
 resetEvents();position=0;render();
 $("v4JourneyStatus").textContent=value==="warm"
  ?"Already connected: cached configuration may skip DHCP, ARP and DNS in this example."
  :"New connection: watch how the network settings are obtained.";
}
$("v4Fresh").onclick=()=>changeNetworkState("fresh");
$("v4Warm").onclick=()=>changeNetworkState("warm");
const previous=slideTo;
slideTo=function(i){if(i!==1){stopTour();cancel()}previous(i)};
render();
})();