/* Bidirectional traffic and route highlights on the existing conceptual map. */
(function(){
"use strict";
const board=document.getElementById("v2MapCanvas"),svg=board?.querySelector("svg.p2-lines");if(!svg)return;
const ns="http://www.w3.org/2000/svg",reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const edges=[
 ["da","device","ap",100,270,280,270,"Device ↔ Wi-Fi · Local link"],
 ["ar","ap","router",280,270,460,270,"Wi-Fi ↔ Gateway · Local network"],
 ["ri","router","internet",460,270,660,270,"Gateway ↔ Internet · IP routing"],
 ["is","internet","server",660,270,860,270,"Internet ↔ Web server"],
 ["rd","router","dhcp",460,270,450,85,"DHCP · Local network configuration"],
 ["rn","router","dns",460,270,680,85,"DNS · Resolver service"],
 ["aa","ap","arp",280,270,280,425,"ARP · Local link mapping"],
 ["st","server","tcp",860,270,850,425,"TCP · Transport relationship"]
],paths={device:["da"],ap:["da"],router:["da","ar"],internet:["da","ar","ri"],server:["da","ar","ri","is"],dhcp:["da","ar","rd"],dns:["da","ar","rn"],arp:["da","aa"],tcp:["da","ar","ri","is","st"]};
function create(tag,attrs){const e=document.createElementNS(ns,tag);for(const [key,val] of Object.entries(attrs||{}))e.setAttribute(key,String(val));return e}
svg.replaceChildren();
const links=create("g"),motion=create("g"),targets=create("g");svg.append(links,motion,targets);
const all=[],note=board.querySelector(".p2-map-note"),originalLabel="Select a component or hover over a connection";
edges.forEach(([id,from,to,x1,y1,x2,y2,label],i)=>{
 const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,xx=-dy/len*4.5,yy=dx/len*4.5;
 const group={id,from,to,label,visual:[]};
 for(const [forward,sign] of [[true,1],[false,-1]]){
  const start=[x1+xx*sign,y1+yy*sign],end=[x2+xx*sign,y2+yy*sign];
  if(!forward){start.reverse();end.reverse();} // reverse in coordinates below instead
  let sx=forward?x1+xx*sign:x2+xx*sign,sy=forward?y1+yy*sign:y2+yy*sign;
  let ex=forward?x2+xx*sign:x1+xx*sign,ey=forward?y2+yy*sign:y1+yy*sign;
  const d="M"+sx+" "+sy+" L"+ex+" "+ey;
  const p=create("path",{d,"class":"net-flow-line"+(forward?" forward":" return")});links.append(p);group.visual.push(p);
  const dot=create("circle",{r:3.2,"class":"net-flow-dot"});
  if(reduced){dot.setAttribute("cx",sx);dot.setAttribute("cy",sy)}
  else dot.append(create("animateMotion",{path:d,dur:(forward?3.2:3.6)+"s",begin:(i*.13+(forward?0:1.1))+"s",repeatCount:"indefinite"}));
  motion.append(dot);group.visual.push(dot);
 }
 const hit=create("path",{d:"M"+x1+" "+y1+" L"+x2+" "+y2,"class":"net-flow-hit",role:"button",tabindex:"0","aria-label":label});
 const title=create("title");title.textContent=label;hit.append(title);targets.append(hit);group.hit=hit;all.push(group);
});
let selected="device",hovered=null;
function repaint(){
 const active=new Set(paths[hovered||selected]||[]);
 all.forEach(g=>{g.visual.forEach(e=>e.classList.toggle("selected",active.has(g.id)));g.hit.classList.toggle("selected",active.has(g.id))});
}
function select(name){selected=name;repaint()}
board.querySelectorAll("[data-component-v2]").forEach(button=>{
 button.addEventListener("click",()=>select(button.dataset.componentV2));
 button.addEventListener("mouseenter",()=>{hovered=button.dataset.componentV2;repaint()});
 button.addEventListener("mouseleave",()=>{hovered=null;repaint()});
 button.addEventListener("focus",()=>{hovered=button.dataset.componentV2;repaint()});
 button.addEventListener("blur",()=>{hovered=null;repaint()});
});
all.forEach(g=>{
 const over=()=>{hovered=g.to;if(note)note.textContent=g.label;repaint()};
 const out=()=>{hovered=null;if(note)note.textContent=originalLabel;repaint()};
 g.hit.addEventListener("mouseenter",over);g.hit.addEventListener("mouseleave",out);
 g.hit.addEventListener("focus",over);g.hit.addEventListener("blur",out);
 g.hit.addEventListener("click",()=>board.querySelector('[data-component-v2="'+g.to+'"]')?.click());
 g.hit.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();board.querySelector('[data-component-v2="'+g.to+'"]')?.click()}});
});
new MutationObserver(()=>{
 const b=board.querySelector(".p2-map-node.active");if(b?.dataset.componentV2&&b.dataset.componentV2!==selected)select(b.dataset.componentV2);
}).observe(board,{subtree:true,attributes:true,attributeFilter:["class"]});
if(note)note.textContent=originalLabel;
select(board.querySelector(".p2-map-node.active")?.dataset.componentV2||"device");
})();