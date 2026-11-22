/* Network Atlas: each inspector step gets a distinct instructional visual.
   Local DOM + CSS, no embedded external GIFs or runtime requests. */
(function(){
"use strict";
const scenes={
 device:[
  {mode:"typing",title:"Type a website address",payload:"https://example.test/",note:"The browser receives a name, not an IP address."},
  {mode:"lookup",title:"Find its destination",from:"Browser",to:"DNS / cache",payload:"example.test → 203.0.113.42",note:"A valid cached answer can avoid a new DNS query."},
  {mode:"route",title:"Choose the local next hop",payload:"203.0.113.42",note:"Default route 0.0.0.0/0 → Gateway 192.168.1.1"}
 ],
 ap:[
  {mode:"wifi",title:"Associate with Wi-Fi",from:"Device",to:"Access Point",payload:"Association request",note:"Join a selected access point."},
  {mode:"auth",title:"Establish the protected link",from:"Device",to:"Access Point",payload:"Authentication / key setup",note:"Wireless authentication and link protection depend on the network mode."},
  {mode:"frame",title:"Forward the local frame",from:"802.11",to:"802.3",payload:"Wireless frame → Ethernet frame",note:"The access point bridges between local link types."}
 ],
 router:[
  {mode:"route",title:"Look up the destination",payload:"203.0.113.42",note:"Longest matching prefix: 0.0.0.0/0 → WAN"},
  {mode:"fork",title:"Choose a next hop",from:"Local LAN",to:"ISP gateway",payload:"Forward via WAN",note:"Other routes remain available but are not selected for this destination."},
  {mode:"nat",title:"Translate the source if configured",from:"192.168.1.24:55000",to:"203.0.113.10:62001",payload:"NAT / PAT",note:"Private source → public source (illustrative example)."}
 ],
 internet:[
  {mode:"handshake",title:"Exchange reachability",from:"AS 64500",to:"AS 64501",payload:"BGP: advertise prefix",note:"Networks advertise prefixes, not individual web requests."},
  {mode:"route",title:"Pick a route",payload:"203.0.113.42",note:"The router applies local policy to choose the next hop."},
  {mode:"path",title:"Forward across networks",from:"AS 64500",to:"AS 64502",payload:"AS 64500 → AS 64501 → AS 64502",note:"Forwarding occurs hop by hop; this is a conceptual example."}
 ],
 server:[
  {mode:"handshake",title:"Accept a connection",from:"Browser",to:"Web server",payload:"TCP SYN → SYN-ACK → ACK",note:"A transport connection is established in this HTTPS/TCP example."},
  {mode:"cert",title:"Validate the TLS identity",from:"Browser",to:"Web server",payload:"SAN: example.test",note:"Browser checks the server certificate for the requested hostname."},
  {mode:"response",title:"Return the webpage",from:"GET / HTTP/1.1",to:"HTTP/1.1 200 OK",payload:"HTTP response",note:"Protected by TLS when HTTPS is used."}
 ],
 dhcp:[
  {mode:"handshake",title:"Discover",from:"Client",to:"DHCP Server",payload:"DISCOVER →",note:"Broadcast: who can assign local network settings?"},
  {mode:"handshake",title:"Offer",from:"Client",to:"DHCP Server",payload:"← OFFER 192.168.1.24",reverse:true,note:"A server offers an address and lease settings."},
  {mode:"handshake",title:"Request",from:"Client",to:"DHCP Server",payload:"REQUEST →",note:"Client requests the offered configuration."},
  {mode:"handshake",title:"Acknowledge",from:"Client",to:"DHCP Server",payload:"← ACK",reverse:true,note:"The server confirms the lease and options."}
 ],
 dns:[
  {mode:"lookup",title:"Ask the resolver",from:"Browser",to:"DNS Resolver",payload:"A? example.test",note:"The client sends a DNS query."},
  {mode:"lookup",title:"Check records",from:"Resolver",to:"Cache / authorities",payload:"Cache hit or further DNS queries",note:"Resolvers can consult their cache or other DNS servers."},
  {mode:"handshake",title:"Return the answer",from:"Browser",to:"Resolver",payload:"← 203.0.113.42",reverse:true,note:"The answer is a DNS record, not a permanent forwarding hop."}
 ],
 arp:[
  {mode:"broadcast",title:"Ask local neighbors",from:"Device",to:"Local link",payload:"Who has 192.168.1.1?",note:"The ARP request is a broadcast on the local IPv4 link."},
  {mode:"handshake",title:"Receive the gateway MAC",from:"Device",to:"Gateway",payload:"← 02:00:00:00:00:01",reverse:true,note:"The gateway replies with its MAC address."},
  {mode:"frame",title:"Address the frame",from:"Device",to:"Gateway",payload:"Ethernet destination: 02:00:00:00:00:01",note:"The outgoing local frame now has a destination MAC."}
 ],
 tcp:[
  {mode:"handshake",title:"SYN",from:"Client",to:"Server",payload:"SYN →",note:"Client requests a TCP connection."},
  {mode:"handshake",title:"SYN-ACK",from:"Client",to:"Server",payload:"← SYN-ACK",reverse:true,note:"Server replies, acknowledging the client's request."},
  {mode:"handshake",title:"ACK",from:"Client",to:"Server",payload:"ACK →",note:"The connection reaches ESTABLISHED."}
 ]
};
function make(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function visual(spec,step,reduce){
 const root=make("div","v9-visual v9-"+spec.mode+(spec.reverse?" v9-reverse":"")+(reduce?" v9-reduced":""));
 root.setAttribute("role","img");root.setAttribute("aria-label",spec.title+": "+spec.payload+". "+spec.note);
 root.append(make("span","v9-visual-heading",spec.title));
 const center=make("div","v9-animation");
 if(spec.mode==="typing"){
  const browser=make("div","v9-browser");
  browser.append(make("span","v9-browser-caption","Browser / address bar"));
  const typed=make("div","v9-typed",spec.payload),caret=make("span","v9-caret","");
  browser.append(typed,caret);center.append(browser);
 }else if(spec.mode==="lookup"){
  const lookup=make("div","v9-lookup");
  lookup.append(make("span","v9-lookup-actor",spec.from||"Client"));
  const middle=make("div","v9-lookup-center");
  middle.append(make("span","v9-scan",spec.payload));
  const branch=make("div","v9-lookup-options");
  branch.append(make("span","v9-lookup-cache","Check cache"),make("span","v9-lookup-dns","Query DNS if needed"));
  middle.append(branch);
  lookup.append(middle,make("span","v9-lookup-actor",spec.to||"Resolver"));center.append(lookup);
 }else if(spec.mode==="route"){
  const table=make("div","v9-routing-table");
  table.append(make("div","v9-routing-header","Destination: "+spec.payload));
  [["192.168.1.0/24","On-link"],["0.0.0.0/0","Gateway 192.168.1.1 ✓"]].forEach((row,i)=>{
   const line=make("div","v9-routing-row"+(i===1?" selected":""));
   line.append(make("span","",row[0]),make("span","",row[1]));table.append(line);
  });center.append(table);
 }else if(spec.mode==="nat"||spec.mode==="frame"){
  const transform=make("div","v9-transform");
  transform.append(make("div","v9-transform-before",spec.from),make("span","v9-transform-arrow","→"),make("div","v9-transform-after",spec.to));center.append(transform);
 }else if(spec.mode==="fork"){
  const fork=make("div","v9-fork");
  fork.append(make("span","v9-fork-source","Router"));
  const options=make("div","v9-fork-options");
  options.append(make("span","v9-fork-dim",spec.from),make("span","v9-fork-chosen",spec.to+" ✓"));
  fork.append(options);center.append(fork);
 }else if(spec.mode==="path"){
  const path=make("div","v9-three-as");
  ["AS 64500","AS 64501","AS 64502"].forEach((as,i)=>{
   path.append(make("span","v9-as-node",as));if(i<2)path.append(make("i","v9-as-link",""));
  });center.append(path);
 }else if(spec.mode==="cert"){
  const cert=make("div","v9-certificate");
  const icon=make("img","v9-cert-icon");icon.src="./icons/shield-check.svg";icon.alt="";
  cert.append(icon,make("strong","","Certificate verified"),make("span","",spec.payload));
  center.append(cert);
 }else if(spec.mode==="broadcast"){
  const broadcast=make("div","v9-broadcast");
  broadcast.append(make("div","v9-broadcast-title",spec.payload));
  const chain=make("div","v9-broadcast-neighbors");
  ["Device","Gateway","Other neighbor"].forEach((name,i)=>chain.append(make("span","v9-broadcast-neighbor"+(i===0?" sender":""),name)));
  broadcast.append(chain);center.append(broadcast);
 }else if(spec.mode==="wifi"||spec.mode==="auth"){
  const wifi=make("div","v9-wifi");
  const a=make("div","v9-endpoint");const imgA=make("img","");imgA.src="./icons/monitor.svg";imgA.alt="";a.append(imgA,make("span","",spec.from));
  const b=make("div","v9-endpoint");const imgB=make("img","");imgB.src="./icons/wifi.svg";imgB.alt="";b.append(imgB,make("span","",spec.to));
  const waves=make("div",spec.mode==="auth"?"v9-link-auth":"v9-radio");
  waves.append(make("span","",spec.mode==="auth"?"✓ Protected link":"(( )))"));
  wifi.append(a,waves,b);center.append(wifi);
 }else if(spec.mode==="response"){
  const response=make("div","v9-response");
  response.append(make("code","",spec.from),make("span","v9-response-arrow","⇄"),make("code","",spec.to));
  center.append(response);
 }else{
  const exchange=make("div","v9-exchange");
  exchange.append(make("span","v9-end-label",spec.from||"Client"));
  const wire=make("div","v9-exchange-wire");
  wire.append(make("span","v9-exchange-message",spec.payload));
  wire.append(make("span","v9-exchange-packet",""));
  exchange.append(wire,make("span","v9-end-label",spec.to||"Server"));
  center.append(exchange);
 }
 root.append(center,make("p","v9-scene-description",spec.note));
 return root;
}
window.networkAtlasScenes={create:(id,step,reduce)=>{
 const items=scenes[id]||scenes.device;
 const spec=items[Math.min(Math.max(0,step),items.length-1)];
 return visual(spec,step,reduce);
}};
})();