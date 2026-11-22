/* Sprint 02: adapt the existing slide behavior without rewriting its protocol engine. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const journey=$("journey");
if(journey){
 const shell=journey.querySelector(".p2-journey");
 const network=shell?.querySelector(".p2-network");
 const exchange=shell?.querySelector(".p2-exchange");
 const analogy=$("v2Analogy");
 if(network&&exchange&&analogy){
  // Put the DORA/ARP/DNS message timeline IN the demonstration, not below it.
  network.insertBefore(exchange,analogy);
  const context=document.createElement("div");context.className="v3-network-context";
  context.setAttribute("aria-live","polite");
  const pic=document.createElement("img");pic.alt="";pic.setAttribute("aria-hidden","true");
  const caption=document.createElement("span");
  context.append(pic,caption);network.insertBefore(context,network.firstChild);
  const concepts={
   "Get your network settings":{icon:"network",text:"DHCP service · local network",max:2,span:"41%"},
   "Find your local gateway":{icon:"radio-tower",text:"ARP · find the gateway's MAC",max:2,span:"41%"},
   "Find the website's IP":{icon:"book-open",text:"DNS resolver · separate request",max:3,span:"62%"},
   "Leave your home network":{icon:"router",text:"Routing and address translation",max:3,span:"62%"},
   "Start the connection":{icon:"arrow-left-right",text:"TCP · three-way handshake",max:4,span:"82%"},
   "Secure the connection":{icon:"shield-check",text:"TLS · verify identity, protect data",max:4,span:"82%"},
   "Request the webpage":{icon:"server",text:"HTTP · request and response",max:4,span:"82%"},
   "Reuse remembered settings":{icon:"network",text:"Cached settings · fewer network exchanges",max:2,span:"41%"}
  };
  const route=$("v2Route");
  if(route&&!route.querySelector(".v4-wire")){
   const devices=Array.from(route.querySelectorAll(".p2-router"));
   devices.slice(1).forEach(node=>{
    const link=document.createElement("span");link.className="v4-wire";link.setAttribute("aria-hidden","true");
    route.insertBefore(link,node);
   });
  }
  const title=$("v2JourneyTitle");
  function presentStage(){
   const data=concepts[title?.textContent?.trim()]||concepts["Get your network settings"];
   context.dataset.current=data.icon;caption.textContent=data.text;pic.src="./icons/"+data.icon+".svg";
   if(!route)return;
   Array.from(route.querySelectorAll(".p2-router")).forEach((node,i)=>{
    const future=i>data.max;
    node.classList.toggle("is-future",future);
    node.setAttribute("aria-hidden",String(future));
   });
   // Inter-node connections are independent elements. They never cross the glyphs.
   Array.from(route.querySelectorAll(".v4-wire")).forEach((link,i)=>{link.hidden=i>=data.max});
  }
  if(title){new MutationObserver(presentStage).observe(title,{childList:true,characterData:true,subtree:true})}
  presentStage();
 }
}
const cia=$("goals");
if(cia){
 const icons={confidentiality:"eye",integrity:"shield-check",availability:"activity"};
 cia.querySelectorAll(".p2-cia-tab[data-goal-v2]").forEach(tab=>{
  const key=tab.dataset.goalV2;
  if(!icons[key])return;
  const image=document.createElement("img");
  image.className="v3-cia-icon";image.src="./icons/"+icons[key]+".svg";
  image.alt="";image.setAttribute("aria-hidden","true");
  tab.insertBefore(image,tab.firstChild);
 });
 // One packet travels all the way Browser → Observer → Server.
 // HTTP runs first, HTTPS follows. They never send simultaneous double dots.
 cia.querySelectorAll(".p2-cia .p2-observer").forEach(track=>{
  if(track.querySelector(".v3-wire-packet"))return;
  const packet=document.createElement("span");packet.className="v3-wire-packet";
  packet.setAttribute("aria-hidden","true");track.append(packet);
 });
}
})();
