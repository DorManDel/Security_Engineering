/* Network Atlas: deterministic educational motion. Runs after the existing slide script. */
(function(){
"use strict";
const E=id=>document.getElementById(id);
const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 00: decouple auto-orbit from pointer-controlled orientation. */
const cubeEl=E("cube"),cubeScene=E("cubeScene");
if(cubeEl&&cubeScene){
 const orbit=document.createElement("div");orbit.className="cube-orbit";
 cubeEl.parentElement.insertBefore(orbit,cubeEl);orbit.append(cubeEl);
 cubeScene.addEventListener("pointerdown",()=>orbit.classList.add("touching"),true);
 function releaseCube(){cubeEl.classList.remove("dragging");orbit.classList.remove("touching")}
 ["pointerup","pointercancel","lostpointercapture"].forEach(name=>cubeScene.addEventListener(name,releaseCube,true));
 const graph=document.createElement("div");graph.className="cube-network";graph.setAttribute("aria-hidden","true");cubeEl.append(graph);
 const points=[[-.31,-.2,-.23],[-.08,-.3,.25],[.27,-.24,-.13],[.33,.18,.27],[.06,.33,-.28],[-.28,.25,.12],[0,0,0]];
 const edges=[[0,1],[0,5],[0,6],[1,2],[1,6],[2,3],[2,6],[3,4],[3,6],[4,5],[4,6],[5,6]];
 function buildGraph(){
  const d=cubeEl.clientWidth;if(d<10)return;graph.replaceChildren();
  edges.forEach(([i,j],idx)=>{
   const a=points[i],b=points[j],dx=(b[0]-a[0])*d,dy=(b[1]-a[1])*d,dz=(b[2]-a[2])*d;
   const distance=Math.hypot(dx,dy,dz),angle=Math.atan2(dy,dx)*180/Math.PI,pitch=-Math.asin(dz/distance)*180/Math.PI;
   const line=document.createElement("span");line.className="traffic-link";line.style.width=distance+"px";
   line.style.transform="translate3d("+(a[0]*d)+"px,"+(a[1]*d)+"px,"+(a[2]*d)+"px) rotateZ("+angle+"deg) rotateY("+pitch+"deg)";
   if(idx%3===0){const packet=document.createElement("span");packet.className="traffic-packet";
    packet.style.setProperty("--distance",Math.max(0,distance-8)+"px");
    packet.style.setProperty("--duration",(3+idx%4)+".5s");
    packet.style.setProperty("--delay",(-idx*.7)+"s");line.append(packet)}
   graph.append(line);
  });
  points.forEach((p,i)=>{const n=document.createElement("span");n.className="traffic-node"+(i===6?" core":"");
   n.style.transform="translate3d("+(p[0]*d)+"px,"+(p[1]*d)+"px,"+(p[2]*d)+"px)";graph.append(n)});
 }
 if(window.ResizeObserver)new ResizeObserver(buildGraph).observe(cubeEl);
 else window.addEventListener("resize",buildGraph);
 buildGraph();
}

/* 01: message-level choreography; the DNS service is never drawn as a forwarding hop. */
const exchanges={
 wifi:{name:"Local wireless link",actors:["Device","Access point"],notes:"Association establishes a link; it does not itself grant an IPv4 address.",messages:[
  ["Device","Access point","Association request","Device asks to join the WLAN"],
  ["Access point","Device","Association response","The access point accepts the association"]]},
 dhcp:{name:"DHCP DORA",actors:["Device","DHCP service"],notes:"A DHCP server, commonly on a home gateway, leases IP settings; this is not an Internet-wide broadcast.",messages:[
  ["Device","DHCP service","DISCOVER (broadcast)","Client finds available DHCP services"],
  ["DHCP service","Device","OFFER","Server proposes IP, router and DNS options"],
  ["Device","DHCP service","REQUEST","Client requests the offered configuration"],
  ["DHCP service","Device","ACK","Lease is acknowledged"]]},
 arp:{name:"Local address resolution",actors:["Device","Gateway"],notes:"This exchange stays on the local IPv4 link and discovers the next-hop MAC, not the remote website's MAC.",messages:[
  ["Device","LAN (broadcast)","Who has 192.168.1.1?","Broadcast ARP request for default gateway"],
  ["Gateway","Device","192.168.1.1 is at MAC…","Gateway returns its local MAC address"]]},
 dns:{name:"A separate resolver conversation",actors:["Device","DNS resolver"],notes:"DNS is a service contacted across the network. Subsequent website traffic does not pass through the resolver.",messages:[
  ["Device","DNS resolver","A example.test?","Query via configured path (e.g. 8.8.8.8)"],
  ["DNS resolver","Device","203.0.113.42","Illustrative address returned for the test hostname"]]},
 nat:{name:"Forwarding and source translation",actors:["Client / LAN","Gateway / WAN"],notes:"The gateway can rewrite the source IP and TCP port; the remote destination remains the same in this illustrative PAT case.",messages:[
  ["192.168.1.24:55000","Gateway","Outbound private tuple","The LAN packet reaches its default gateway"],
  ["Gateway","203.0.113.42:443","203.0.113.10:62001","NAT/PAT maps the client source address and port"]]},
 cache:{name:"Reuse previous state",actors:["Browser","Local cache"],notes:"A cache hit may skip new DHCP, ARP and DNS exchanges in a warm network state.",messages:[
  ["Browser","Cache","Check known hostname","Use stored configuration and resolved address"]]},
 tcp:{name:"TCP three-way handshake",actors:["Client","Web server"],notes:"This is the traditional HTTP/1.1 or HTTP/2-over-TCP route; HTTP/3 uses QUIC over UDP.",messages:[
  ["Client","Web server","SYN","Request a connection"],
  ["Web server","Client","SYN-ACK","Server acknowledges and responds"],
  ["Client","Web server","ACK","Client acknowledges; connection established"]]},
 tls:{name:"TLS handshake (simplified)",actors:["Browser","Web server"],notes:"The browser authenticates the server certificate. Application messages are encrypted after the handshake completes.",messages:[
  ["Browser","Web server","ClientHello","Client proposes cryptographic parameters"],
  ["Web server","Browser","ServerHello + Certificate","Server presents cryptographic parameters and identity"],
  ["Browser","Web server","Finished / encrypted channel","Validate identity and establish protected traffic"]]},
 http:{name:"Application request / response",actors:["Browser","Web server"],notes:"HTTP over TLS protects the HTTP application payload. Plain HTTP does not provide that transport protection.",messages:[
  ["Browser","Web server","GET /","Browser requests the document"],
  ["Web server","Browser","200 OK / HTML","The server returns a response"]]}
};
const riskByStep={
 wifi:"Risk: a rogue access point can position an attacker on the local path. Wi-Fi association alone does not prove the web server's identity; authenticated HTTPS still matters.",
 dhcp:"Risk: a rogue DHCP server may advertise a malicious gateway or DNS resolver. DHCP snooping and controlled network access can reduce this threat.",
 arp:"Risk: unauthenticated forged ARP replies can alter local IP-to-MAC cache mappings, redirecting or disrupting traffic on the same link.",
 dns:"Risk: a forged DNS answer may point to the wrong IP address. Proper HTTPS certificate validation can detect many endpoint impersonation attempts.",
 nat:"Risk: NAT translations and gateway configuration can be misused or misconfigured. NAT itself is not a substitute for application authentication or access control.",
 cache:"Risk: cached configuration or DNS answers can preserve incorrect values. An existing configuration is not automatically trustworthy.",
 tcp:"Risk: SYN floods can consume connection-handling resources. An attacker on path can also attempt session manipulation where protection is absent.",
 tls:"Risk: invalid certificates, compromised trust roots or unsafe user bypasses undermine authentication. Correct TLS prevents reading or changing HTTP application payloads on path.",
 http:"Risk: plain HTTP is readable and potentially modifiable on the network path. HTTPS encrypts and authenticates the HTTP application exchange, but not all network metadata."
};
let beat=0,visualTimer=null,isRiskVisible=false,exchangeBoard=null,exchangeTitle=null,exchangeSequence=null,exchangeTrack=null,exchangeCaption=null,exchangeIndex=null,riskBox=null;
const topology=E("diagram");
if(topology){
 const visual=document.createElement("div");visual.className="journey-visual";visual.setAttribute("aria-label","Animated protocol exchange");
 const head=document.createElement("div");head.className="visual-header";
 const left=document.createElement("span");left.className="micro";left.textContent="Message exchange";
 exchangeTitle=document.createElement("span");exchangeTitle.className="exchange-title";
 head.append(left,exchangeTitle);visual.append(head);
 exchangeSequence=document.createElement("div");exchangeSequence.className="inline-controls";exchangeSequence.style.gap="5px";visual.append(exchangeSequence);
 exchangeBoard=document.createElement("div");exchangeBoard.className="exchange-lanes";exchangeBoard.setAttribute("aria-live","polite");visual.append(exchangeBoard);
 const footer=document.createElement("div");footer.className="exchange-footer";
 exchangeCaption=document.createElement("span");exchangeCaption.className="exchange-caption";
 const buttons=document.createElement("div");buttons.className="inline-controls";
 const prev=document.createElement("button");prev.className="secondary";prev.textContent="← Message";prev.setAttribute("aria-label","Previous message in exchange");
 const next=document.createElement("button");next.className="secondary";next.textContent="Message →";next.setAttribute("aria-label","Next message in exchange");
 exchangeIndex=document.createElement("span");exchangeIndex.className="exchange-indicator";
 buttons.append(prev,exchangeIndex,next);footer.append(exchangeCaption,buttons);visual.append(footer);
 const outer=topology.parentElement;outer.insertBefore(visual,topology.nextSibling);
 prev.onclick=()=>{stopPlayback();if(beat>0){beat--;paintBeat()}};
 next.onclick=()=>{stopPlayback();const d=exchanges[steps[eventIndex]?.id];if(d&&beat<d.messages.length-1){beat++;paintBeat()}};
 prev.id="prevExchangeMessage";next.id="nextExchangeMessage";
 const eventCard=E("eventDesc").parentElement;
 const riskToggle=document.createElement("button");riskToggle.type="button";riskToggle.className="secondary";riskToggle.id="riskToggle";riskToggle.textContent="⚠ Where is the risk?";riskToggle.setAttribute("aria-expanded","false");
 const currentDemo=E("searchDemoButton");eventCard.insertBefore(riskToggle,currentDemo);
 riskBox=document.createElement("div");riskBox.className="journey-risk";riskBox.hidden=true;
 const strong=document.createElement("strong");strong.textContent="Threat boundary / when it becomes dangerous";
 const text=document.createElement("p");text.id="journeyRiskText";riskBox.append(strong,text);eventCard.insertBefore(riskBox,currentDemo);
 riskToggle.onclick=()=>{isRiskVisible=!isRiskVisible;showRisk()};
 const protocolLink=document.createElement("button");protocolLink.type="button";protocolLink.className="tiny-button";protocolLink.style.color="var(--accent)";protocolLink.textContent="Related topics →";protocolLink.onclick=()=>{if(window.atlasGoToTopic){const match={dhcp:3,arp:0,dns:5,tcp:6,tls:7,nat:4};window.atlasGoToTopic(match[steps[eventIndex]?.id]??0)}else slideTo(4)};
 eventCard.insertBefore(protocolLink,currentDemo);
 function showRisk(){
  riskBox.hidden=!isRiskVisible;riskToggle.setAttribute("aria-expanded",String(isRiskVisible));riskToggle.textContent=isRiskVisible?"Hide risk ↑":"⚠ Where is the risk?";
  text.textContent=riskByStep[steps[eventIndex]?.id]||"Inspect the assumptions and local trust boundaries before discussing attacks.";
 }
 function paintBeat(){
  const selected=steps[eventIndex],scene=exchanges[selected?.id];
  if(!scene){exchangeTitle.textContent="Start the journey";exchangeBoard.replaceChildren();exchangeSequence.replaceChildren();exchangeCaption.textContent="Press Connect, then inspect each message.";exchangeIndex.textContent="—";return}
  beat=Math.min(Math.max(0,beat),scene.messages.length-1);
  exchangeTitle.textContent=scene.name;
  exchangeSequence.replaceChildren();
  scene.messages.forEach((m,i)=>{
   const b=document.createElement("button");b.type="button";b.className="service"+(i===beat?" on":"");
   b.textContent=String(i+1).padStart(2,"0")+" "+m[2];b.style.fontSize="9px";
   b.onclick=()=>{stopPlayback();beat=i;paintBeat()};exchangeSequence.append(b)
  });
  const msg=scene.messages[beat],reverse=(selected.id!=="nat"&&(msg[0]===scene.actors[1]||msg[0]==="Web server"||msg[0]==="Gateway"||msg[0]==="DNS resolver"||msg[0]==="DHCP service"));
  exchangeBoard.replaceChildren();
  const row=document.createElement("div");row.className="exchange-row is-current"+(reverse?" reverse":"");
  const a=document.createElement("span");a.className="exchange-end";a.textContent=reverse?msg[1]:msg[0];
  const track=document.createElement("div");track.className="exchange-track";
  const label=document.createElement("span");label.className="exchange-label";label.textContent=msg[2];
  const dot=document.createElement("span");dot.className="packet-runner";track.append(dot,label);
  const b=document.createElement("span");b.className="exchange-end";b.textContent=reverse?msg[0]:msg[1];
  row.append(a,track,b);exchangeBoard.append(row);
  exchangeCaption.textContent=msg[3];exchangeIndex.textContent=(beat+1)+" / "+scene.messages.length;
  E("prevExchangeMessage").disabled=beat===0;E("nextExchangeMessage").disabled=beat===scene.messages.length-1;
  // The packet also moves across the relevant part of the physical network path.
  const oldDot=topology.querySelector(".route-particle");if(oldDot)oldDot.remove();
  const bounds={wifi:[10,33],dhcp:[10,54],arp:[10,54],dns:[10,78],nat:[53,78],cache:[10,22],tcp:[10,91],tls:[10,91],http:[10,91]};
  const range=bounds[selected.id]||[10,91],from=reverse?range[1]:range[0],to=reverse?range[0]:range[1];
  const packet=document.createElement("span");packet.className="route-particle";
  packet.style.setProperty("--from",from+"%");packet.style.setProperty("--to",to+"%");packet.setAttribute("aria-hidden","true");
  topology.append(packet);
  const low=Math.min(from,to),high=Math.max(from,to);
  Array.from(topology.querySelectorAll(".diagram-node")).forEach((n,i)=>{const pct=10+i*21;n.classList.toggle("in-path",pct>=low-2&&pct<=high+2)});
  showRisk();
 }
 function resetVisual(){beat=0;paintBeat()}
 const nativeBuildSteps=buildSteps;
 buildSteps=function(){
  nativeBuildSteps();
  const beforeTcp=steps.findIndex(s=>s.id==="tcp");
  const destinationPort=(E("address").value.trim().toLowerCase().startsWith("http://")?"80":"443");
  if(beforeTcp>=0)steps.splice(beforeTcp,0,{
   id:"nat",short:"Route / NAT",layer:"Network",node:"router",title:"Route through the gateway",
   desc:"The gateway forwards toward the target and may translate the private source IP and port. This is an illustrative home-network PAT mapping, not a mandatory Internet-wide step.",
   service:"serviceNat",fields:[["Private source","192.168.1.24:55000"],["Translated source","203.0.113.10:62001"],["Target","203.0.113.42:"+destinationPort]],sample:"LAN → gateway:\n192.168.1.24:55000\n\nWAN after NAT/PAT:\n203.0.113.10:62001"
  });
 };
 const nativePause=pauseEvents;
 pauseEvents=function(){if(visualTimer){clearInterval(visualTimer);visualTimer=null}nativePause();E("playEvents").textContent="▷ Play"};
 function stopPlayback(){pauseEvents()}
 const nativeEventTo=eventTo;
 eventTo=function(i){nativeEventTo(i);beat=0;paintBeat()};
 const nativeReset=resetEvents;
 resetEvents=function(){nativeReset();beat=0;paintBeat()};
 E("playEvents").onclick=()=>{
  if(visualTimer){stopPlayback();return}
  if(eventIndex===steps.length-1){eventTo(0)}
  else if(eventIndex<0){eventTo(0)}
  E("playEvents").textContent="Ⅱ Pause";
  visualTimer=setInterval(()=>{
   const scene=exchanges[steps[eventIndex]?.id];
   if(scene&&beat<scene.messages.length-1){beat++;paintBeat();return}
   if(eventIndex<steps.length-1){eventTo(eventIndex+1);return}
   stopPlayback();
  },1350);
 };
 // Ensure the new NAT step is inserted and can be inspected after the extension loads.
 resetEvents();
 // Keep essential packet fields visible without clipping the iPad presenter screen.
 if(window.innerHeight<900&&packetExpanded)E("showPacket").click();
}

/* 02: causal, visible consequences rather than just changing headings. */
const stream=document.querySelector("#goals .stream");
if(stream){
 const panel=stream.closest(".panel");
 const evidence=document.createElement("div");evidence.className="cia-simulation";evidence.id="ciaSimulation";
 panel.insertBefore(evidence,E("goalTitle"));
 const action=document.createElement("div");action.className="cia-action";
 const replay=document.createElement("button");replay.type="button";replay.className="secondary";replay.textContent="▷ Replay effect";
 action.append(replay);panel.insertBefore(action,E("goalDesc"));
 function displayCia(){
  evidence.replaceChildren();
  let parts=[];
  if(goal==="confidentiality"){
   parts=transport==="http"?[["GET /profile",""],["Observer reads content","attention"],["Message is exposed","attention"]]:[["HTTP request",""],["TLS encrypted record","protected"],["Observer sees metadata",""]];
  }else if(goal==="integrity"){
   parts=transport==="http"?[["Transfer: 100",""],["On-path edit: 900","attention"],["Receiver sees 900","attention"]]:[["Transfer: 100",""],["Tamper attempt","attention"],["TLS verification fails","protected"]];
  }else{
   parts=[["Client requests",""],["Service overloaded","attention"],["Timeout / failure","attention"]];
  }
  parts.forEach((item,i)=>{if(i){const a=document.createElement("span");a.className="state-arrow";a.textContent="→";evidence.append(a)}
   const box=document.createElement("span");box.className="state-pill cia-animation "+item[1];box.textContent=item[0];evidence.append(box)});
 }
 const baseGoal=updateGoal;updateGoal=function(){baseGoal();displayCia()};
 const baseTransport=updateTransport;updateTransport=function(){baseTransport();displayCia()};
 replay.onclick=()=>displayCia();displayCia();
}

/* 03: each component card now has a controlled conceptual animation. */
const mapInfo=document.querySelector(".map-info");
if(mapInfo){
 const lab=document.createElement("div");lab.className="component-lab";lab.setAttribute("aria-label","Component micro-simulation");
 const head=document.createElement("div");head.className="component-lab-header";
 const title=document.createElement("span");title.className="micro";title.textContent="How it works · mini-lab";
 const controls=document.createElement("div");controls.className="inline-controls";
 const prev=document.createElement("button");prev.className="secondary";prev.textContent="←";
 const next=document.createElement("button");next.className="secondary";next.textContent="→";
 const play=document.createElement("button");play.className="secondary";play.textContent="▷ Play";
 controls.append(prev,next,play);head.append(title,controls);lab.append(head);
 const flow=document.createElement("div");flow.className="component-lab-flow";lab.append(flow);
 const caption=document.createElement("p");caption.className="component-lab-annotation";lab.append(caption);
 const state=document.createElement("span");state.className="component-lab-state";lab.append(state);
 const caseLabel=Array.from(mapInfo.children).find(el=>el.querySelector&&el.querySelector("#relatedCase"));mapInfo.insertBefore(lab,caseLabel||null);
 let index=0,loop=null;
 const animationCopy={
  device:["The browser resolves a name or reuses a known IP.","The OS opens a socket toward the selected destination.","The interface sends a frame to the next hop."],
  ap:["The device discovers a Wi-Fi network.","It authenticates/associates with an access point.","Layer-2 connectivity is ready."],
  router:["Inspect the incoming IP destination.","Select a route and local outgoing interface.","Forward; NAT/PAT may translate the source tuple."],
  internet:["Routers learn IP prefix reachability.","A next hop is selected according to the routing table.","Independent networks forward toward the destination."],
  server:["A transport connection is accepted.","TLS authenticates and protects content when enabled.","The server returns the application response."],
  dhcp:["Discover: client requests configuration.","Offer: server proposes a lease.","Request: client selects an offer.","ACK: server confirms the lease."],
  arp:["Local client broadcasts a target IPv4 address.","Neighbor replies with its link-layer MAC address.","Client records the IP-to-MAC mapping."],
  dns:["Browser/OS checks the name cache.","Resolver is queried for the hostname.","The answer provides IP address records."],
  tcp:["Client sends SYN.","Server returns SYN-ACK.","Client returns ACK; connection established."]
 };
 function stop(){if(loop){clearInterval(loop);loop=null}play.textContent="▷ Play"}
 function paint(){
  const c=components[component],events=c.flow;index=Math.max(0,Math.min(index,events.length-1));
  flow.replaceChildren();events.forEach((event,i)=>{if(i){const arr=document.createElement("span");arr.className="component-lab-arrow";arr.textContent="→";flow.append(arr)}
   const chip=document.createElement("span");chip.className="component-lab-step"+(i===index?" current":"");chip.textContent=event;flow.append(chip)});
  caption.textContent=(animationCopy[component]||[])[index]||"Inspect the component's role in the network.";
  state.textContent="Beat "+(index+1)+" / "+events.length;prev.disabled=index===0;next.disabled=index===events.length-1;
 }
 const nativeRender=renderComponent;
 renderComponent=function(key){stop();nativeRender(key);index=0;paint()};
 prev.onclick=()=>{stop();index--;paint()};
 next.onclick=()=>{stop();index++;paint()};
 play.onclick=()=>{if(loop){stop();return}index=0;paint();play.textContent="Ⅱ Pause";
  loop=setInterval(()=>{if(index>=components[component].flow.length-1){stop();return}index++;paint()},1200)};
 // Stop all micro loops on slide departure.
 const nativeSlide=slideTo;
 slideTo=function(i){if(i!==3)stop();const stage=document.querySelector(".stage");stage.dataset.direction=i<activeSlide?"backward":"forward";nativeSlide(i)};
 renderComponent(component);
}
})();
