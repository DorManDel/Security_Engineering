/* Eight-topic visual explanation, attached to existing curriculum state without replacing it. */
(function(){
"use strict";
const $=id=>document.getElementById(id),root=$("protocols");
const topics=window.atlasSelectedTopics;
if(!root||!Array.isArray(topics))return;
const icons={arp:"network",mac:"wifi",ip:"globe",dhcp:"network",bgp:"globe",dns:"book-open",syn:"activity",hijack:"shield-check"};
const scenes={
 arp:{actors:["Your device","Gateway / Attacker"],icon:["monitor","router"],purpose:"Resolve a neighbor's IPv4 address to a local MAC.",beats:["Device broadcasts: Who has the gateway IP?","Attacker injects a false ARP reply.","Device associates gateway IP with attacker MAC.","Data may be forwarded through the attacker."]},
 mac:{actors:["Network device","Access point"],icon:["monitor","wifi"],purpose:"Link-layer MAC addresses identify interfaces for local frame delivery; some networks also misuse them as an authorization signal.",beats:["A device presents its source MAC.","An attacker changes the source MAC it presents.","A weak MAC-based allowlist may mistake it for an allowed device.","Proper 802.1X authentication is not bypassed by changing a MAC alone."]},
 ip:{actors:["Sender","Receiver / Victim"],icon:["monitor","server"],purpose:"IP source and destination addresses identify endpoints used in packet forwarding.",beats:["A normal packet carries its sender's IP.","Attacker sends a packet with a forged source IP.","Replies may be directed to the spoofed victim.","Source filtering can reject illegitimate source addresses."]},
 dhcp:{actors:["Device","DHCP / Rogue server"],icon:["monitor","network"],purpose:"Automatically provide client IP leases and settings such as gateway and DNS resolver.",beats:["Client broadcasts DHCP Discover.","A legitimate server or rogue server may answer.","Client requests offered configuration.","Attacker-controlled DNS or gateway settings can redirect future traffic."]},
 bgp:{actors:["Autonomous system","Neighboring AS"],icon:["globe","network"],purpose:"Exchange IP-prefix reachability between autonomous systems.",beats:["An AS announces a reachable IP prefix.","An invalid or unauthorized announcement is propagated.","Other networks may select the wrong route.","Traffic can be diverted or blackholed; validation limits risk."]},
 dns:{actors:["Browser / Resolver","DNS answer"],icon:["monitor","book-open"],purpose:"Translate a domain name into DNS records, including A and AAAA addresses.",beats:["Client asks resolver for a domain.","A manipulated answer can contain the wrong IP.","Browser connects to the returned address.","Valid TLS certificate and hostname checks help detect impersonation."]},
 syn:{actors:["Clients / Attacker","TCP server"],icon:["monitor","server"],purpose:"TCP uses connection establishment to create state before carrying reliable data.",beats:["Normal client sends SYN.","Server sends SYN-ACK and may reserve handshake state.","Many incomplete attempts consume pending-connection capacity.","SYN cookies and DDoS filtering help preserve availability."]},
 hijack:{actors:["Client","Server / On-path actor"],icon:["monitor","server"],purpose:"TCP manages ordered, reliable transport using sequence and acknowledgment numbers.",beats:["Client and server establish a TCP session.","On-path actor observes or influences traffic.","Unprotected session data may be modified or injected.","Authenticated TLS helps reject altered application data."]}
};
function elt(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node}
const layout=root.querySelector(".learning-layout"),detail=layout?.querySelector(".learning-detail");
if(!detail)return;
// Add identifiable questions; this makes the lecturer's request visible in the actual slide.
const questions=[
 ["Purpose","What is it for?"],["Normal behavior","How does it work?"],["Trust assumption","What is trusted?"],["Attack & why","How can it fail?"],["Defense","How is it mitigated?"]
];
const controls=elt("div","v6-questions");
questions.forEach(([name,tip],index)=>{const b=elt("button","v6-question",String(index+1).padStart(2,"0")+" · "+name);b.type="button";b.title=tip;b.dataset.question=String(index);b.onclick=()=>selectQuestion(index);controls.append(b)});
const heading=$("topicHeading");heading.after(controls);
const scene=elt("div","v6-teaching-scene");scene.setAttribute("aria-label","Animated example of the selected networking mechanism");
scene.innerHTML='<div class="v6-actor" id="v6ActorA"></div><div class="v6-flow-track" role="img" aria-label="Illustrative message moving between participants"></div><div class="v6-actor" id="v6ActorB"></div><div class="v6-stage-caption" id="v6StageCaption"></div>';
controls.after(scene);
const purpose=elt("div","definition-row");
purpose.innerHTML='<b>01 · Purpose</b><p id="v6Purpose"></p>';
const first=detail.querySelector(".definition-row");first.before(purpose);
const rows=[purpose,...Array.from(detail.querySelectorAll(".definition-row")).filter(x=>x!==purpose)];
const labels=["02 · Normal operation","03 · Trust assumption","04 · Attack & why possible","05 · Defense / mitigation"];
for(let i=1;i<rows.length;i++){const b=rows[i].querySelector("b");if(b&&labels[i-1])b.textContent=labels[i-1]}
let question=0;
function selectQuestion(i){
 question=i;
 Array.from(controls.children).forEach((button,j)=>{button.classList.toggle("selected",j===i);button.setAttribute("aria-pressed",String(j===i))});
 rows.forEach((row,j)=>{row.style.opacity=j===i?"1":".72";row.style.borderLeft=j===i?"2px solid #e9cf8a":"2px solid transparent";row.style.paddingLeft="8px"});
}
const cards=$("topicGrid");
if(cards){Array.from(cards.children).forEach((b,i)=>{const item=topics[i];const icon=document.createElement("img");icon.className="v6-topic-icon";icon.src="./icons/"+(icons[item.id]||"monitor")+".svg";icon.alt="";icon.setAttribute("aria-hidden","true");b.append(icon)})}
function refresh(){
 const index=Array.from(cards.children).findIndex(b=>b.classList.contains("active"));
 if(index<0)return;const topic=topics[index],def=scenes[topic.id];if(!def)return;
 $("v6Purpose").textContent=def.purpose;
 for(const [id,label,art] of [["v6ActorA",def.actors[0],def.icon[0]],["v6ActorB",def.actors[1],def.icon[1]]]){
  const node=$(id);node.replaceChildren();
  const pic=document.createElement("img");pic.src="./icons/"+art+".svg";pic.className="v6-actor-icon";pic.alt="";node.append(pic,elt("span","",label));
 }
 const raw=Number($("topicStageNumber").textContent.split("/")[0])-1,beat=Math.max(0,Math.min(def.beats.length-1,raw));
 $("v6StageCaption").textContent=(beat+1)+" / "+def.beats.length+" · "+def.beats[beat];
 selectQuestion(question);
}
let prevTopic="";
const observer=new MutationObserver(()=>{
 const active=Array.from(cards.children).find(x=>x.classList.contains("active"))?.dataset.topic;
 if(active!==prevTopic){prevTopic=active;question=0}
 refresh();
});
observer.observe(cards,{attributes:true,subtree:true,attributeFilter:["class"]});
observer.observe($("topicStageNumber"),{childList:true,characterData:true,subtree:true});
refresh();
})();