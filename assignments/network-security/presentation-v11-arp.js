/* Network Atlas: standalone ARP Poisoning visual, no network calls. */
(function(){
"use strict";
const root=document.getElementById("protocols");
const detail=root?.querySelector(".learning-detail"),cards=document.getElementById("topicGrid");
if(!root||!detail||!cards)return;
const ip="192.168.1.1",goodMac="02:00:00:00:00:11",badMac="02:00:00:00:00:CC";
const arpModes={
 normal:{
  title:"Normal ARP resolution",
  steps:[
   {title:"01 · Who has the gateway IP?",description:"Victim broadcasts an ARP Request. All devices on the local link can receive it.",tag:"ARP Request · Who has 192.168.1.1?",opcode:"Request (1)",senderIp:"192.168.1.24",senderMac:"02:00:00:00:00:24",cache:"unknown",paths:["broadcast"]},
   {title:"02 · The real gateway replies",description:"The gateway announces its own IP and MAC address in a legitimate ARP Reply.",tag:"ARP Reply · 192.168.1.1 is at ...11",opcode:"Reply (2)",senderIp:ip,senderMac:goodMac,cache:"pending",paths:["gateway-reply"]},
   {title:"03 · The correct MAC is stored",description:"The victim now sends frames for the gateway to its legitimate MAC address.",tag:"Frame → real gateway",opcode:"Reply (2)",senderIp:ip,senderMac:goodMac,cache:"correct",paths:["legitimate"]}
  ]
 },
 attack:{
  title:"ARP cache poisoning",
  steps:[
   {title:"01 · A forged reply arrives",description:"An attacker on the same local link claims the gateway IP belongs to the attacker's MAC.",tag:"FORGED ARP Reply · ...1.1 is at ...CC",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"correct",paths:["forged"]},
   {title:"02 · The victim trusts the claim",description:"If the victim accepts the false mapping, its ARP cache replaces the gateway MAC with the attacker's.",tag:"ARP cache overwritten: ...11 → ...CC",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"poisoned",paths:[]},
   {title:"03 · Frames take the wrong path",description:"Frames intended for the gateway can reach the attacker first. The attacker can relay or drop them; correctly validated TLS still protects encrypted application content.",tag:"Victim → Attacker → Gateway (optional relay)",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"poisoned",paths:["misdirected","relay"]}
  ]
 },
 mitigation:{
  title:"Inspect and reject a false binding",
  steps:[
   {title:"01 · The forged packet reaches a switch",description:"On a managed network, ARP traffic from an untrusted port may be checked using Dynamic ARP Inspection.",tag:"Untrusted ARP Reply → LAN switch",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"correct",paths:["to-switch"]},
   {title:"02 · Binding validation fails",description:"DAI checks trusted IP/MAC binding information (for example DHCP snooping data or configured ARP ACLs) and drops an invalid ARP message.",tag:"REJECT · Gateway IP / MAC mismatch",opcode:"Reply (2)",senderIp:ip,senderMac:badMac,cache:"rejected",paths:[]},
   {title:"03 · The correct mapping remains",description:"The forged claim never reaches the victim; frames continue toward the legitimate gateway.",tag:"Victim → Gateway · trusted local mapping",opcode:"Reply (2)",senderIp:ip,senderMac:goodMac,cache:"correct",paths:["legitimate"]}
  ]
 }
};
const topicProfiles={
 "arp": {
  "term": "Address Resolution Protocol (ARP)",
  "intro": "Maps a local IPv4 address to a link-layer MAC address. Poisoning tricks a host into learning a false gateway mapping.",
  "actors": [
   [
    "Victim",
    "192.168.1.24"
   ],
   [
    "LAN switch",
    "Local link"
   ],
   [
    "Gateway",
    "192.168.1.1"
   ],
   [
    "Attacker",
    "192.168.1.66"
   ]
  ],
  "labels": [
   "Opcode",
   "Sender IP",
   "Sender MAC",
   "192.168.1.1 →"
  ],
  "inspector": "ARP MESSAGE FIELDS",
  "result": "VICTIM'S ARP CACHE",
  "questions": [
   "IPv4 → local MAC",
   "Request, reply, cache",
   "ARP reply origin not authenticated",
   "False reply redirects frames",
   "DAI validates IP/MAC"
  ],
  "sources": [
   [
    "RFC 826",
    "https://www.rfc-editor.org/rfc/rfc826.html"
   ],
   [
    "Cisco DAI",
    "https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/sec-crypto/fhs-sisf/fhs-and-sisf-configuration-guide/dynamic-arp-inspection.html"
   ]
  ]
 },
 "mac": {
  "term": "Media Access Control (MAC)",
  "intro": "A MAC address identifies a local link interface. MAC spoofing changes the source MAC a device presents; this can fool weak address-only allowlists, not proper 802.1X authentication.",
  "actors": [
   [
    "Allowed device",
    "02:00:00:00:00:24"
   ],
   [
    "Access switch",
    "MAC allowlist"
   ],
   [
    "Protected LAN",
    "Authorized network"
   ],
   [
    "Impersonator",
    "02:00:00:00:00:66"
   ]
  ],
  "labels": [
   "Frame type",
   "Source MAC",
   "Allowlisted MAC",
   "Access decision"
  ],
  "inspector": "LINK FRAME / IDENTITY",
  "result": "NETWORK ACCESS RESULT",
  "questions": [
   "Address local interfaces",
   "Source MAC in frame",
   "MAC mistaken for identity",
   "Clone allowed MAC",
   "802.1X + NAC"
  ],
  "sources": [
   [
    "IEEE 802.1X overview",
    "https://www.ieee802.org/1/pages/802.1x.html"
   ],
   [
    "Cisco Port Security",
    "https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/lyr2-fwd/cdp-lldp-mac-udld/cdp-lldp-mac-udld-configuration-guide/c-configure-mac.html"
   ]
  ],
  "modes": {
   "normal": {
    "title": "Normal link-layer identification",
    "steps": [
     {
      "title": "01 · Device presents its address",
      "description": "A local device sends a frame using its real interface MAC; the switch sees a legitimate source MAC.",
      "tag": "ETHERNET · Source MAC 02:00:00:00:00:24",
      "paths": [
       "legitimate"
      ],
      "fields": [
       "Ethernet",
       "02:00:00:00:00:24",
       "02:00:00:00:00:24",
       "Recognized"
      ],
      "highlight": [],
      "note": "The source MAC identifies the interface on this link."
     },
     {
      "title": "02 · A weak allowlist checks the MAC",
      "description": "An address-based policy sees the allowed value and permits traffic. This is not a strong identity proof.",
      "tag": "MAC allowlist · match",
      "paths": [
       "gateway-reply"
      ],
      "fields": [
       "Policy check",
       "02:00:00:00:00:24",
       "02:00:00:00:00:24",
       "Allow"
      ],
      "highlight": [],
      "note": "MAC-only access controls may be convenient but are not authenticators."
     },
     {
      "title": "03 · Local access is granted",
      "description": "The switch forwards the device's frame into the authorized LAN.",
      "tag": "Forward frame → protected LAN",
      "paths": [
       "legitimate"
      ],
      "fields": [
       "Frame forwarded",
       "02:00:00:00:00:24",
       "02:00:00:00:00:24",
       "Allowed"
      ],
      "highlight": [],
      "note": "This is an example of a weak access policy."
     }
    ]
   },
   "attack": {
    "title": "Impersonate an allowed MAC",
    "steps": [
     {
      "title": "01 · Attacker changes the source MAC",
      "description": "The impersonator configures its local interface to present another device's MAC.",
      "tag": "SPOOFED SOURCE MAC · ...66 → ...24",
      "paths": [
       "to-switch"
      ],
      "fields": [
       "Ethernet",
       "02:00:00:00:00:24",
       "02:00:00:00:00:24",
       "Not checked yet"
      ],
      "highlight": [
       1
      ],
      "note": "The presented source does not prove the real device identity."
     },
     {
      "title": "02 · MAC-only policy accepts the clone",
      "description": "A simplistic allowlist sees a familiar MAC. The attacker may pass that check; conflicts with the real device can still occur.",
      "tag": "ALLOWLIST MATCH · identity unverified",
      "paths": [
       "forged"
      ],
      "fields": [
       "Allowlist",
       "02:00:00:00:00:24",
       "02:00:00:00:00:24",
       "False allow"
      ],
      "highlight": [
       3
      ],
      "note": "Weak assumption: allowed MAC = authorized device."
     },
     {
      "title": "03 · Unauthorized local access",
      "description": "If there is no stronger authentication, the cloned source address may gain access to the protected segment.",
      "tag": "Impersonator → Protected LAN",
      "paths": [
       "unauthorized"
      ],
      "fields": [
       "Forwarded frame",
       "02:00:00:00:00:24",
       "02:00:00:00:00:24",
       "Unauthorized"
      ],
      "highlight": [
       3
      ],
      "note": "Spoofing a MAC alone does not bypass 802.1X credentials."
     }
    ]
   },
   "mitigation": {
    "title": "Authenticate the device, not the address",
    "steps": [
     {
      "title": "01 · Cloned MAC reaches access switch",
      "description": "The switch receives a frame with an allowed MAC but does not consider that enough proof of identity.",
      "tag": "MAC allowlisted ≠ authenticated",
      "paths": [
       "to-switch"
      ],
      "fields": [
       "Source MAC",
       "02:00:00:00:00:24",
       "Allowlist match",
       "Auth required"
      ],
      "highlight": [
       3
      ],
      "note": "Network admission is separate from the MAC field."
     },
     {
      "title": "02 · Strong authentication fails",
      "description": "An 802.1X/NAC policy demands valid device or user credentials and blocks unauthorized access.",
      "tag": "802.1X · credentials missing → deny",
      "paths": [],
      "fields": [
       "802.1X",
       "Claimed ...24",
       "Credentials absent",
       "Rejected"
      ],
      "highlight": [
       3
      ],
      "note": "Blocking depends on the actual network access policy."
     },
     {
      "title": "03 · Only authenticated access remains",
      "description": "The legitimate device can authenticate and use the link; a copied MAC is insufficient.",
      "tag": "Authenticated device → LAN",
      "paths": [
       "legitimate"
      ],
      "fields": [
       "Authorization",
       "Real device",
       "Valid credential",
       "Allowed"
      ],
      "highlight": [],
      "note": "Port security can supplement, but not replace, strong identity checks."
     }
    ]
   }
  }
 },
 "ip": {
  "term": "Internet Protocol (IP)",
  "intro": "IP packets carry source and destination IP addresses. IP spoofing forges the source field; the resulting reply is usually sent to the apparent source, not necessarily the real sender.",
  "actors": [
   [
    "Client / victim",
    "192.0.2.24"
   ],
   [
    "Edge router",
    "Source check"
   ],
   [
    "Remote server",
    "203.0.113.10"
   ],
   [
    "Source forger",
    "198.51.100.66"
   ]
  ],
  "labels": [
   "Packet type",
   "Source IP",
   "Destination IP",
   "Return destination"
  ],
  "inspector": "IP HEADER FIELDS",
  "result": "SOURCE / REPLY CHECK",
  "questions": [
   "Route source/destination",
   "Route on destination IP",
   "Source may be unverified",
   "Forge source IP",
   "BCP 38 source filtering"
  ],
  "sources": [
   [
    "BCP 38 / RFC 2827",
    "https://www.rfc-editor.org/rfc/rfc2827.html"
   ],
   [
    "RFC 791 IP",
    "https://www.rfc-editor.org/rfc/rfc791.html"
   ]
  ],
  "modes": {
   "normal": {
    "title": "Normal IP packet delivery",
    "steps": [
     {
      "title": "01 · Client sends an IP datagram",
      "description": "The client sends a datagram with its own source address and the intended destination address.",
      "tag": "SRC 192.0.2.24 → DST 203.0.113.10",
      "paths": [
       "legitimate"
      ],
      "fields": [
       "IPv4 datagram",
       "192.0.2.24",
       "203.0.113.10",
       "192.0.2.24"
      ],
      "highlight": [],
      "note": "The destination is used for forwarding."
     },
     {
      "title": "02 · Router forwards by destination",
      "description": "The next-hop decision depends on the destination prefix and routing table, not on trusting the source as identity.",
      "tag": "Routing table → next hop",
      "paths": [
       "legitimate"
      ],
      "fields": [
       "IPv4",
       "192.0.2.24",
       "203.0.113.10",
       "192.0.2.24"
      ],
      "highlight": [],
      "note": "A router may also enforce source validation."
     },
     {
      "title": "03 · Response returns to sender",
      "description": "If the application replies, it addresses that reply to the original source IP.",
      "tag": "Reply → 192.0.2.24",
      "paths": [
       "gateway-reply"
      ],
      "fields": [
       "Response",
       "203.0.113.10",
       "192.0.2.24",
       "192.0.2.24"
      ],
      "highlight": [],
      "note": "The example illustrates connectionless traffic, not a completed TCP handshake."
     }
    ]
   },
   "attack": {
    "title": "Source-IP spoofing",
    "steps": [
     {
      "title": "01 · Sender forges its source address",
      "description": "The forger constructs a datagram using the victim's IP in the source field instead of its own.",
      "tag": "FAKE SOURCE 192.0.2.24 · real sender ...66",
      "paths": [
       "to-switch"
      ],
      "fields": [
       "IPv4 datagram",
       "192.0.2.24 (forged)",
       "203.0.113.10",
       "192.0.2.24"
      ],
      "highlight": [
       1
      ],
      "note": "Source IP is a claim inside the packet, not proof of origin."
     },
     {
      "title": "02 · If unchecked, the forged packet travels",
      "description": "Without source-address filtering, an edge network may forward the datagram toward the server.",
      "tag": "Forged source passes edge router",
      "paths": [
       "spoofedOut"
      ],
      "fields": [
       "Forwarded",
       "192.0.2.24 (forged)",
       "203.0.113.10",
       "192.0.2.24"
      ],
      "highlight": [
       1
      ],
      "note": "A forged IP alone does not establish a full TCP session."
     },
     {
      "title": "03 · The reply reaches the victim",
      "description": "A server response can be sent to the forged source IP. This mechanism may contribute to reflection/amplification attacks.",
      "tag": "Server → spoofed victim IP",
      "paths": [
       "gateway-reply"
      ],
      "fields": [
       "Response",
       "203.0.113.10",
       "192.0.2.24",
       "Victim, not forger"
      ],
      "highlight": [
       3
      ],
      "note": "This is a conceptual UDP-style exchange."
     }
    ]
   },
   "mitigation": {
    "title": "Reject impossible source addresses",
    "steps": [
     {
      "title": "01 · Source check at the network edge",
      "description": "The forger's outbound datagram claims a source IP outside its legitimate customer/source range.",
      "tag": "Check source against allowed prefixes",
      "paths": [
       "to-switch"
      ],
      "fields": [
       "Ingress/egress check",
       "192.0.2.24 (forged)",
       "203.0.113.10",
       "Invalid source"
      ],
      "highlight": [
       1
      ],
      "note": "Source validation must be deployed at relevant network boundaries."
     },
     {
      "title": "02 · BCP 38 filter blocks the packet",
      "description": "Ingress/egress source filtering can drop packets with source addresses that should not originate on that interface.",
      "tag": "DROP · source IP violates policy",
      "paths": [],
      "fields": [
       "BCP 38",
       "192.0.2.24 (forged)",
       "203.0.113.10",
       "Dropped"
      ],
      "highlight": [
       3
      ],
      "note": "This reduces spoofing; it is not a universal sender-identity guarantee."
     },
     {
      "title": "03 · Legitimate traffic can pass",
      "description": "Datagrams with permitted source addresses continue through the router; higher-layer authentication remains necessary.",
      "tag": "Validated source range → route",
      "paths": [
       "legitimate"
      ],
      "fields": [
       "IPv4 datagram",
       "192.0.2.24",
       "203.0.113.10",
       "Valid origin range"
      ],
      "highlight": [],
      "note": "BCP 38 complements, rather than replaces, end-to-end authentication."
     }
    ]
   }
  }
 },
 "dhcp": {
  "term": "Dynamic Host Configuration Protocol (DHCP)",
  "intro": "Automatically provides an IPv4 lease and network options such as default gateway and DNS resolver. A rogue DHCP server can offer misleading configuration.",
  "actors": [
   [
    "DHCP client",
    "Not yet assigned"
   ],
   [
    "LAN switch",
    "DHCP snooping"
   ],
   [
    "DHCP server",
    "192.168.1.1"
   ],
   [
    "Rogue server",
    "192.168.1.66"
   ]
  ],
  "labels": [
   "DHCP message",
   "Offered client IP",
   "Router option (3)",
   "DNS option (6)"
  ],
  "inspector": "DHCP CONFIGURATION",
  "result": "CLIENT NETWORK SETTINGS",
  "questions": [
   "Assign IP/configuration",
   "DORA exchange",
   "Rogue offers may be accepted",
   "False DNS/router options",
   "DHCP snooping"
  ],
  "sources": [
   [
    "RFC 2131",
    "https://www.rfc-editor.org/rfc/rfc2131.html"
   ],
   [
    "Cisco DHCP snooping",
    "https://www.cisco.com/c/en/us/support/docs/ip/dynamic-host-configuration-protocol-dhcp-dhcpv6/217055-operate-and-troubleshoot-dhcp-snooping.html"
   ]
  ],
  "modes": {
   "normal": {
    "title": "A legitimate DHCP exchange",
    "steps": [
     {
      "title": "01 · Discover",
      "description": "A new client broadcasts DHCPDISCOVER to find available DHCP servers.",
      "tag": "DHCPDISCOVER · Client → LAN",
      "paths": [
       "broadcast"
      ],
      "fields": [
       "Discover",
       "Not yet assigned",
       "Not yet assigned",
       "Not yet assigned"
      ],
      "highlight": [],
      "note": "The discover message is broadcast; any DHCP server on the link may hear it."
     },
     {
      "title": "02 · Offer",
      "description": "A trusted DHCP server offers an address lease and network settings.",
      "tag": "DHCPOFFER · server offers 192.168.1.24",
      "paths": [
       "gateway-reply"
      ],
      "fields": [
       "Offer",
       "192.168.1.24",
       "192.168.1.1",
       "192.168.1.1"
      ],
      "highlight": [],
      "note": "Offer proposes the address and configuration."
     },
     {
      "title": "03 · Request",
      "description": "The client requests a chosen offer and identifies the selected server.",
      "tag": "DHCPREQUEST · client selects server",
      "paths": [
       "broadcast"
      ],
      "fields": [
       "Request",
       "192.168.1.24",
       "192.168.1.1",
       "192.168.1.1"
      ],
      "highlight": [],
      "note": "Request is distinct from Offer."
     },
     {
      "title": "04 · ACK",
      "description": "The server confirms the lease. The client can configure its IP, gateway and DNS settings.",
      "tag": "DHCPACK · lease committed",
      "paths": [
       "gateway-reply"
      ],
      "fields": [
       "ACK",
       "192.168.1.24",
       "192.168.1.1",
       "192.168.1.1"
      ],
      "highlight": [],
      "note": "DORA: Discover, Offer, Request, Acknowledge."
     }
    ]
   },
   "attack": {
    "title": "Rogue DHCP configuration",
    "steps": [
     {
      "title": "01 · New client requests settings",
      "description": "The device has not yet received reliable network configuration and sends a DHCP Discover.",
      "tag": "DISCOVER · who can configure me?",
      "paths": [
       "broadcast"
      ],
      "fields": [
       "Discover",
       "—",
       "—",
       "—"
      ],
      "highlight": [],
      "note": "A rogue server on the same link may respond."
     },
     {
      "title": "02 · A rogue server advertises bad options",
      "description": "The rogue DHCP server sends a competing offer with a malicious DNS resolver and/or gateway address.",
      "tag": "ROGUE OFFER · DNS 192.168.1.66",
      "paths": [
       "forged"
      ],
      "fields": [
       "Offer",
       "192.168.1.24",
       "192.168.1.66",
       "192.168.1.66"
      ],
      "highlight": [
       2,
       3
      ],
      "note": "The weak trust point is accepting untrusted network configuration."
     },
     {
      "title": "03 · Incorrect settings are accepted",
      "description": "If selected and confirmed, those options can direct name resolution or traffic via infrastructure controlled by an attacker.",
      "tag": "CLIENT CONFIG → router/DNS 192.168.1.66",
      "paths": [
       "misdirected"
      ],
      "fields": [
       "ACK (rogue)",
       "192.168.1.24",
       "192.168.1.66",
       "192.168.1.66"
      ],
      "highlight": [
       2,
       3
      ],
      "note": "The outcome depends on which DHCP offer the client accepts."
     }
    ]
   },
   "mitigation": {
    "title": "Block unauthorized DHCP servers",
    "steps": [
     {
      "title": "01 · Rogue DHCP offer enters a switch",
      "description": "A managed switch sees a DHCP server response arriving on an untrusted access port.",
      "tag": "OFFER from untrusted port",
      "paths": [
       "to-switch"
      ],
      "fields": [
       "Offer",
       "192.168.1.24",
       "192.168.1.66",
       "192.168.1.66"
      ],
      "highlight": [
       2,
       3
      ],
      "note": "Trusted server ports must be identified correctly."
     },
     {
      "title": "02 · DHCP snooping rejects the offer",
      "description": "DHCP snooping can drop server messages from untrusted ports and protect the client from an unauthorized offer.",
      "tag": "DROP · untrusted DHCP server reply",
      "paths": [],
      "fields": [
       "Rejected offer",
       "—",
       "Blocked",
       "Blocked"
      ],
      "highlight": [
       2,
       3
      ],
      "note": "DHCP snooping needs correct switch configuration."
     },
     {
      "title": "03 · Legitimate DHCP completes normally",
      "description": "The approved DHCP server provides the lease and authorized router/DNS options.",
      "tag": "Trusted server → valid lease",
      "paths": [
       "gateway-reply"
      ],
      "fields": [
       "ACK",
       "192.168.1.24",
       "192.168.1.1",
       "192.168.1.1"
      ],
      "highlight": [],
      "note": "Authenticated upper-layer protocols remain important."
     }
    ]
   }
  }
 }
};
Object.assign(topicProfiles,{"bgp":{"term":"Border Gateway Protocol (BGP)","intro":"BGP shares which networks can reach IP prefixes. A false route announcement may attract or discard traffic.","actors":[["Origin network","AS 64510"],["Transit network","AS 64520"],["Destination","203.0.113.0/24"],["Rogue network","AS 64566"]],"labels":["Update / decision","Prefix","Origin AS","Route selected"],"inspector":"BGP CONTROL PLANE","result":"ROUTE CHOICE","questions":["Advertise reachability","Receive / select route","Trust route announcements","Rogue origin / hijack","RPKI origin validation"],"sources":[["RFC 4271","https://www.rfc-editor.org/rfc/rfc4271.html"],["RFC 6811","https://www.rfc-editor.org/rfc/rfc6811.html"]],"modes":{"normal":{"title":"Normal BGP prefix announcement","steps":[{"title":"01 · Origin announces reachability","description":"An authorized autonomous system advertises that it can reach the destination prefix.","tag":"BGP UPDATE · AS 64510 → prefix 203.0.113.0/24","paths":["legitimate"],"fields":["UPDATE","203.0.113.0/24","AS 64510","Candidate"],"highlight":[],"note":"Routing updates are control-plane messages, not web packets."},{"title":"02 · Neighbor evaluates the route","description":"A neighboring network applies import policy and may select a route to this prefix.","tag":"Import policy → authorized origin","paths":["gateway-reply"],"fields":["UPDATE","203.0.113.0/24","AS 64510","Accepted"],"highlight":[],"note":"Route selection is affected by several attributes and policy."},{"title":"03 · Data follows the chosen path","description":"After the route is selected, normal IP traffic can be forwarded along that path.","tag":"Data plane · via AS 64520 → destination","paths":["legitimate"],"fields":["IP forwarding","203.0.113.0/24","AS 64510","Authorized path"],"highlight":[],"note":"Control-plane announcements and data-plane packets are different."}]},"attack":{"title":"Unauthorized BGP route advertisement","steps":[{"title":"01 · A rogue AS announces a prefix","description":"A malicious or misconfigured AS advertises a prefix that it is not authorized to originate.","tag":"FALSE UPDATE · prefix 203.0.113.0/24","paths":["to-switch"],"fields":["UPDATE","203.0.113.0/24","AS 64566","Unverified"],"highlight":[2],"note":"The prefix may be falsely originated or more-specific."},{"title":"02 · Neighbor accepts the bad route","description":"If filtering and origin policy do not reject it, the new route may be preferred.","tag":"Wrong next hop selected","paths":["forged"],"fields":["UPDATE","203.0.113.0/24","AS 64566","Wrong path"],"highlight":[2,3],"note":"An accepted advertisement can redirect traffic; not every BGP update is accepted."},{"title":"03 · Traffic follows the wrong route","description":"Some traffic may be diverted, inspected where possible, or dropped on the unauthorized path.","tag":"Affected route · traffic diverted","paths":["misdirected"],"fields":["IP forwarding","203.0.113.0/24","AS 64566","Diverted / lost"],"highlight":[3],"note":"IP routing failures do not automatically decrypt HTTPS."}]},"mitigation":{"title":"Validate origin and filter announcements","steps":[{"title":"01 · Announced origin is checked","description":"Routers evaluate the prefix and origin AS against RPKI data and routing policy.","tag":"Prefix → origin validation","paths":["to-switch"],"fields":["UPDATE","203.0.113.0/24","AS 64566","Checking"],"highlight":[2],"note":"Route origin validation does not verify the entire AS path."},{"title":"02 · Invalid origin is rejected","description":"Under a configured reject-invalid policy, an RPKI-invalid route is not selected.","tag":"INVALID origin → reject","paths":["blocked"],"fields":["RPKI state","203.0.113.0/24","AS 64566","Rejected"],"highlight":[3],"note":"NotFound is not necessarily invalid and policies vary."},{"title":"03 · Valid route remains selected","description":"Packets continue via the allowed path when an authorized route is available.","tag":"Authorized route remains active","paths":["legitimate"],"fields":["Forwarding","203.0.113.0/24","AS 64510","Validated origin"],"highlight":[],"note":"RPKI origin validation does not guarantee full path security."}]}}},"dns":{"term":"Domain Name System (DNS)","intro":"DNS translates hostnames into IP address records. An attacker-controlled or forged answer can direct a browser to the wrong IP.","actors":[["Client / browser","example.test"],["DNS resolver","Configured DNS"],["Real website","203.0.113.42"],["False responder","198.51.100.66"]],"labels":["DNS message","Question","Answer (A record)","Destination chosen"],"inspector":"DNS QUESTION / ANSWER","result":"RESOLVED IP ADDRESS","questions":["Resolve names","Question → answer","Trust returned answer","Wrong A record","DNSSEC + TLS"],"sources":[["RFC 1035","https://www.rfc-editor.org/rfc/rfc1035.html"],["RFC 4035 DNSSEC","https://www.rfc-editor.org/rfc/rfc4035.html"]],"modes":{"normal":{"title":"Normal DNS lookup","steps":[{"title":"01 · Client requests an address","description":"The browser asks its configured resolver for an address record.","tag":"DNS query · A? example.test","paths":["legitimate"],"fields":["Query","A example.test","Pending","Not selected"],"highlight":[],"note":"A valid cache entry may avoid an upstream query."},{"title":"02 · Resolver returns the correct IP","description":"A trusted resolver returns the expected answer for the example domain.","tag":"DNS answer · 203.0.113.42","paths":["gateway-reply"],"fields":["Response","A example.test","203.0.113.42","203.0.113.42"],"highlight":[],"note":"The response is data; the resolver is not in the web packet's path."},{"title":"03 · Browser connects to the returned address","description":"The browser uses the result to contact the website and validates TLS for the requested hostname.","tag":"Browser → 203.0.113.42","paths":["legitimate"],"fields":["HTTP over TLS","example.test","203.0.113.42","Real website"],"highlight":[],"note":"DNS alone does not prove website identity."}]},"attack":{"title":"Forged DNS answer or compromised resolver","steps":[{"title":"01 · Client asks for a domain","description":"The client makes the same address lookup as before.","tag":"A? example.test","paths":["legitimate"],"fields":["Query","A example.test","Pending","Unknown"],"highlight":[],"note":"The query itself looks ordinary."},{"title":"02 · False responder supplies a wrong IP","description":"A forged answer, manipulated resolver, or malicious configuration may supply an attacker-controlled IP.","tag":"SPOOFED A record · 198.51.100.66","paths":["forged"],"fields":["Response","A example.test","198.51.100.66","False server"],"highlight":[2,3],"note":"This requires the false answer to be accepted."},{"title":"03 · Browser targets the wrong server","description":"The client may connect to the attacker-controlled address. Correct TLS hostname checks can expose an invalid certificate.","tag":"Wrong DNS → wrong destination","paths":["misdirected"],"fields":["A record","example.test","198.51.100.66","Misdirected"],"highlight":[2,3],"note":"A valid HTTPS certificate for the target hostname is not trivial to forge."}]},"mitigation":{"title":"Validate DNS data and website identity","steps":[{"title":"01 · A suspicious DNS response arrives","description":"A DNSSEC-validating resolver checks signed DNS information when the domain supports it.","tag":"Answer verification","paths":["to-switch"],"fields":["DNSSEC check","A example.test","198.51.100.66","Checking"],"highlight":[2],"note":"DNSSEC availability depends on signed zones and validating resolvers."},{"title":"02 · Invalid signed answer fails validation","description":"When cryptographic validation fails, the resolver rejects the invalid answer rather than using it.","tag":"DNSSEC BOGUS → reject","paths":["blocked"],"fields":["DNSSEC","A example.test","Invalid signature","Rejected"],"highlight":[2,3],"note":"DNSSEC does not encrypt the query and does not replace TLS."},{"title":"03 · Authentic answer and TLS checks remain","description":"A valid resolution and hostname-verified TLS help connect to the intended service.","tag":"Validated answer → real website","paths":["legitimate"],"fields":["A record","example.test","203.0.113.42","Real website"],"highlight":[],"note":"TLS certificate checking is a separate layer."}]}}},"syn":{"term":"TCP SYN — connection opening","intro":"TCP starts a connection using SYN, SYN-ACK, ACK. SYN flooding overloads resources reserved for incomplete connections.","actors":[["Legitimate client","192.0.2.24"],["Edge network","Traffic controls"],["TCP server","203.0.113.10"],["Flood sender","Repeated SYN"]],"labels":["TCP message","Handshake state","Pending queue","Result"],"inspector":"TCP HANDSHAKE","result":"PENDING CONNECTIONS","questions":["Establish a connection","SYN / SYN-ACK / ACK","Finite pending state","Many incomplete SYNs","SYN cookies / DDoS"],"sources":[["RFC 4987","https://www.rfc-editor.org/rfc/rfc4987.html"],["RFC 9293","https://www.rfc-editor.org/rfc/rfc9293.html"]],"modes":{"normal":{"title":"Normal TCP three-way handshake","steps":[{"title":"01 · Client initiates a connection","description":"The client sends SYN with an initial sequence number.","tag":"SYN → server","paths":["legitimate"],"fields":["SYN","SYN-SENT","1 / 4 slots","Await reply"],"highlight":[],"note":"The queue size is illustrative, not a fixed TCP parameter."},{"title":"02 · Server acknowledges","description":"The server returns SYN-ACK and awaits the final ACK.","tag":"SYN-ACK ← server","paths":["gateway-reply"],"fields":["SYN-ACK","SYN-RECEIVED","1 / 4 slots","Await ACK"],"highlight":[],"note":"Pending connection state exists temporarily."},{"title":"03 · Client completes handshake","description":"The final ACK reaches the server; the connection is established.","tag":"ACK → established","paths":["legitimate"],"fields":["ACK","ESTABLISHED","0 / 4 slots","Connected"],"highlight":[],"note":"Established connections are not half-open entries."}]},"attack":{"title":"SYN flooding leaves handshakes incomplete","steps":[{"title":"01 · Many SYNs arrive","description":"An attacker sends a high rate of initial connection requests.","tag":"SYN SYN SYN → server","paths":["to-switch"],"fields":["SYN × many","SYN-RECEIVED","2 / 4 slots","Under pressure"],"highlight":[2],"note":"The queue is a visual metaphor for finite resources."},{"title":"02 · Final ACKs do not arrive","description":"Numerous incomplete handshakes retain state and consume pending-connection resources.","tag":"SYN backlog · near capacity","paths":["spoofedOut"],"fields":["Pending SYN","No final ACK","4 / 4 slots","Queue full"],"highlight":[2,3],"note":"A SYN flood targets availability, not confidentiality."},{"title":"03 · Legitimate clients may be delayed","description":"With insufficient defenses, new legitimate handshakes can fail or be delayed.","tag":"Connection backlog exhausted","paths":["misdirected"],"fields":["Legitimate SYN","Rejected / delayed","4 / 4 slots","Unavailable"],"highlight":[2,3],"note":"Actual service impact depends on defenses and capacity."}]},"mitigation":{"title":"SYN cookies and filtering","steps":[{"title":"01 · Connection requests hit protection","description":"The network and server can rate-limit, filter or apply SYN cookies under overload.","tag":"SYN flood → mitigation layer","paths":["to-switch"],"fields":["SYN","Validation","High load","Protection active"],"highlight":[2],"note":"SYN cookies encode connection state in the sequence number."},{"title":"02 · Server avoids excessive pending state","description":"When SYN cookies are appropriate, the server can defer some state allocation until a valid ACK returns.","tag":"SYN-ACK cookie → verify ACK","paths":["blocked"],"fields":["SYN cookie","State deferred","Protected","Mitigated"],"highlight":[2,3],"note":"SYN cookies do not guarantee complete immunity to all DDoS."},{"title":"03 · Valid clients may still connect","description":"The server can complete properly validated handshakes despite a class of incomplete requests.","tag":"Valid SYN → SYN-ACK → ACK","paths":["legitimate"],"fields":["ACK verified","ESTABLISHED","Available","Connected"],"highlight":[],"note":"Upstream volumetric protection can still be required."}]}}},"hijack":{"term":"Transmission Control Protocol (TCP)","intro":"TCP sessions track ports, sequence and acknowledgment numbers. An on-path attacker may inject a segment if transport state is accepted and application integrity is absent.","actors":[["Client","192.0.2.24:55000"],["Network path","TCP flow"],["Server","203.0.113.10:443"],["On-path attacker","Forged segment"]],"labels":["Segment","Sequence number","ACK / state","Application result"],"inspector":"TCP SEGMENT STATE","result":"INTEGRITY OUTCOME","questions":["Reliable ordered stream","Track seq / ack numbers","Transport state is guessable/visible","Inject valid-looking segment","Authenticated TLS"],"sources":[["RFC 9293","https://www.rfc-editor.org/rfc/rfc9293.html"],["RFC 8446 TLS 1.3","https://www.rfc-editor.org/rfc/rfc8446.html"]],"modes":{"normal":{"title":"Normal TCP exchange","steps":[{"title":"01 · Client opens a connection","description":"Endpoints complete TCP handshaking and establish synchronized sequence numbers.","tag":"TCP session established","paths":["legitimate"],"fields":["SYN/ACK","SEQ 1000","ACK 5000","Established"],"highlight":[],"note":"Sequence numbers protect ordering, not end-to-end identity."},{"title":"02 · Client sends ordered data","description":"The server accepts a correctly sequenced segment from the expected flow.","tag":"TCP segment · SEQ 1001","paths":["legitimate"],"fields":["PSH/ACK","SEQ 1001","ACK 5001","Accepted"],"highlight":[],"note":"Application encryption is a separate protection."},{"title":"03 · Server acknowledges valid data","description":"The server's ACK advances the receive state of that TCP connection.","tag":"ACK → continuing connection","paths":["gateway-reply"],"fields":["ACK","SEQ 5001","ACK 1101","Normal flow"],"highlight":[],"note":"TCP does not by itself authenticate the application content."}]},"attack":{"title":"On-path TCP segment injection","steps":[{"title":"01 · Attacker observes TCP state","description":"A capable on-path attacker can learn addresses, ports and current transport sequence state.","tag":"Flow tuple + sequence observed","paths":["to-switch"],"fields":["Flow observed","SEQ 1001","ACK 5001","On-path view"],"highlight":[],"note":"Being on path is a key assumption, not a trivial off-path ability."},{"title":"02 · Injected segment looks valid to TCP","description":"The attacker tries to insert a segment with acceptable TCP sequence values.","tag":"FORGED SEGMENT · SEQ 1001","paths":["forged"],"fields":["PSH/ACK","SEQ 1001 (injected)","ACK 5001","Candidate"],"highlight":[1,3],"note":"TCP checks sequence windows; unsynchronized segments are dropped."},{"title":"03 · Unprotected application data may change","description":"If transport checks accept the injected segment and no upper-layer integrity protection exists, application content could be affected.","tag":"Unprotected stream → altered","paths":["misdirected"],"fields":["TCP data","SEQ accepted","Application check absent","Integrity risk"],"highlight":[3],"note":"Correctly authenticated TLS prevents undetected app-data alteration."}]},"mitigation":{"title":"TLS prevents undetected application injection","steps":[{"title":"01 · A segment reaches a TLS-protected flow","description":"Even if a TCP segment is delivered, application records still require authentication.","tag":"TCP accepted ≠ TLS authenticated","paths":["to-switch"],"fields":["TCP segment","SEQ candidate","TLS record","Unverified"],"highlight":[3],"note":"TLS operates above TCP and authenticates record content."},{"title":"02 · Tampered TLS record is rejected","description":"An invalid TLS record authentication tag causes the content to be rejected; the connection may terminate.","tag":"TLS authentication FAIL → reject","paths":["blocked"],"fields":["TLS record","Tampered content","Invalid tag","Rejected"],"highlight":[2,3],"note":"TLS does not authenticate all TCP header fields."},{"title":"03 · Valid authenticated data is processed","description":"The endpoint accepts protected application data only when its TLS integrity checks pass.","tag":"Verified TLS record → application","paths":["legitimate"],"fields":["TLS record","Authorized sender","Valid tag","Accepted"],"highlight":[],"note":"Use current, authenticated TLS and proper certificate validation."}]}}}});
let modes=arpModes,selectedTopicKey='arp';
const $=id=>document.getElementById(id);
const lab=document.createElement("section");lab.id="arpTopicLab";lab.className="arp-lab";lab.innerHTML="\n<div class=\"arp-intro\">\n <div><span class=\"arp-overline\">01 / 08 · LOCAL NETWORK SECURITY</span><h3>ARP Poisoning</h3>\n <p><strong>ARP</strong> (Address Resolution Protocol) maps a local IPv4 address to a MAC address.\n <strong>Poisoning</strong> means forging that mapping to redirect frames.</p></div>\n <span class=\"arp-illustrative\">Illustrative · No packets transmitted</span>\n</div>\n<div class=\"arp-topbar\">\n <div class=\"arp-modes\" role=\"tablist\" aria-label=\"ARP demonstration mode\">\n  <button type=\"button\" data-arp-mode=\"normal\" role=\"tab\">01 · Normal</button>\n  <button type=\"button\" data-arp-mode=\"attack\" role=\"tab\">02 · Attack</button>\n  <button type=\"button\" data-arp-mode=\"mitigation\" role=\"tab\">03 · Mitigation</button>\n </div>\n <div class=\"arp-playback\" role=\"group\" aria-label=\"ARP animation playback\">\n  <button type=\"button\" id=\"arpPrev\" title=\"Previous message\" aria-label=\"Previous message\">‹</button>\n  <button type=\"button\" id=\"arpPlay\" title=\"Play steps\" aria-label=\"Play steps\"><img src=\"./icons/play.svg\" alt=\"\"><span>Play</span></button>\n  <button type=\"button\" id=\"arpReplay\" title=\"Replay mode\" aria-label=\"Replay mode\">↻ <span>Replay</span></button>\n  <button type=\"button\" id=\"arpNext\" title=\"Next message\" aria-label=\"Next message\">›</button>\n </div>\n</div>\n<div class=\"arp-progress\"><span id=\"arpModeTitle\"></span><span id=\"arpStepCount\"></span></div>\n<div class=\"arp-network-scene\" id=\"arpNetworkScene\" role=\"group\" aria-label=\"Local network topology\">\n <svg class=\"arp-topology-svg\" viewBox=\"0 0 940 252\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n  <path class=\"arp-link\" d=\"M132 91 L470 91 L808 91\"/>\n  <path class=\"arp-link\" d=\"M470 91 L470 213\"/>\n  <g id=\"arpLivePaths\"></g>\n </svg>\n <div class=\"arp-actor arp-victim\"><img src=\"./icons/monitor.svg\" alt=\"\"><strong>Victim</strong><small>192.168.1.24</small></div>\n <div class=\"arp-actor arp-switch\"><img src=\"./icons/network.svg\" alt=\"\"><strong>LAN switch</strong><small>Local link</small></div>\n <div class=\"arp-actor arp-gateway\"><img src=\"./icons/router.svg\" alt=\"\"><strong>Gateway</strong><small>192.168.1.1</small></div>\n <div class=\"arp-actor arp-attacker\"><img src=\"./icons/monitor.svg\" alt=\"\"><strong>Attacker</strong><small>192.168.1.66</small></div>\n <div id=\"arpMechanismBadge\" class=\"arp-mechanism-badge\" aria-hidden=\"true\"></div>\n <div id=\"arpBlockedSymbol\" class=\"arp-reject-cross\" hidden aria-hidden=\"true\">✕ <small>BLOCKED</small></div>\n <div id=\"arpSceneTag\" class=\"arp-packet-label\" aria-live=\"polite\"></div>\n</div>\n<div class=\"arp-description\"><strong id=\"arpStepTitle\"></strong><span id=\"arpStepExplanation\"></span></div>\n<div class=\"arp-inspector\">\n <div class=\"arp-inspector-head\"><span>ARP MESSAGE FIELDS</span><span>VICTIM'S ARP CACHE</span></div>\n <div class=\"arp-inspector-fields\">\n  <div><small>Opcode</small><code id=\"arpOpcode\"></code></div>\n  <div><small>Sender IP</small><code id=\"arpSenderIp\"></code></div>\n  <div><small>Sender MAC</small><code id=\"arpSenderMac\"></code></div>\n  <div class=\"arp-cache\"><small>192.168.1.1 →</small><code id=\"arpCachedMac\"></code></div>\n </div>\n <div class=\"arp-change-note\" id=\"arpChangeNote\"></div>\n</div>\n<div class=\"arp-five-questions\" role=\"group\" aria-label=\"Five questions for this topic\">\n <div><b>01 · Purpose</b><span>Local IPv4 → MAC</span></div>\n <div><b>02 · Normal</b><span>Request → Reply → Cache</span></div>\n <div><b>03 · Trust</b><span>Unauthenticated ARP claims</span></div>\n <div><b>04 · Attack & why</b><span>False reply changes mapping</span></div>\n <div><b>05 · Defense</b><span>Validate IP/MAC bindings</span></div>\n</div>\n<div class=\"arp-lab-footer\">\n <span class=\"arp-sources\">Sources: <a href=\"https://www.rfc-editor.org/rfc/rfc826.html\" target=\"_blank\" rel=\"noopener noreferrer\">RFC 826 ↗</a> · <a href=\"https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/sec-crypto/fhs-sisf/fhs-and-sisf-configuration-guide/dynamic-arp-inspection.html\" target=\"_blank\" rel=\"noopener noreferrer\">Cisco DAI ↗</a></span>\n <div><button type=\"button\" id=\"arpBackMap\">ARP in Network Map ↗</button><button type=\"button\" id=\"arpRelated\">Related case studies ↗</button></div>\n</div>";detail.append(lab);
const pathPresets={
 broadcast:[["M132 91 L470 91 L808 91","gold"]],
 "gateway-reply":[["M808 91 L470 91 L132 91","gold"]],
 legitimate:[["M132 91 L470 91 L808 91","gold"]],
 forged:[["M470 213 L470 91 L132 91","red"]],
 misdirected:[["M132 91 L470 91 L470 213","red"]],
 relay:[["M470 213 L470 91 L808 91","gold"]],
 unauthorized:[["M470 213 L470 91 L808 91","red"]],
 spoofedOut:[["M470 213 L470 91 L808 91","red"]],
 "to-switch":[["M470 213 L470 91","red"]],
 "blocked":[["M470 213 L470 91","red"]],
 "protected":[["M470 213 L470 127","red"],["M132 91 L470 91 L808 91","gold"]]
};
const ns="http://www.w3.org/2000/svg";
const actorPositions={victim:[132,91],switch:[470,91],gateway:[808,91],attacker:[470,213]};
const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??false;
let mode="normal",step=0,timer=null,cycles=0,frozen=false,wasArp=false,activeTopic=null;
const MAX_LOOPS=5,STEP_INTERVAL_MS=1450;
function stop(keepFrame=false){if(timer!==null){clearInterval(timer);timer=null}if(!keepFrame)frozen=false}
function drawPaths(keys){
 const group=$("arpLivePaths");group.replaceChildren();
 for(const key of keys)for(const [d,color] of pathPresets[key]||[]){
  const line=document.createElementNS(ns,"path");line.setAttribute("d",d);line.setAttribute("class","arp-active-path "+color);group.append(line);
  if(reduce||timer===null)continue;
  const dot=document.createElementNS(ns,"rect");dot.setAttribute("width","12");dot.setAttribute("height","8");dot.setAttribute("rx","2");dot.setAttribute("x","-6");dot.setAttribute("y","-4");dot.setAttribute("class","arp-moving-dot "+color);
  const motion=document.createElementNS(ns,"animateMotion");motion.setAttribute("dur","2.3s");
  motion.setAttribute("repeatCount","indefinite");motion.setAttribute("path",d);
  dot.append(motion);group.append(dot);
 }
}
function paint(){
 const profile=topicProfiles[selectedTopicKey],data=modes[mode],frame=data.steps[step];
 lab.dataset.mode=mode;lab.dataset.step=String(step);lab.dataset.topic=selectedTopicKey;
 for(const button of lab.querySelectorAll("[data-arp-mode]")){
  const active=button.dataset.arpMode===mode;button.classList.toggle("active",active);
  button.setAttribute("aria-selected",String(active));button.tabIndex=active?0:-1;
 }
 $("arpModeTitle").textContent=data.title;
 $("arpStepCount").textContent=(step+1)+" / "+data.steps.length+(timer!==null?" · loop "+(cycles+1)+"/"+MAX_LOOPS:"");
 $("arpStepTitle").textContent=frame.title;
 $("arpStepExplanation").textContent=frame.description;
 $("arpSceneTag").textContent=frame.tag;
 const fields=selectedTopicKey==="arp"?[frame.opcode,frame.senderIp,frame.senderMac,
  frame.cache==="unknown"?"Not resolved":frame.cache==="pending"?"Reply received…":frame.cache==="poisoned"?"02:00:00:00:00:CC":"02:00:00:00:00:11"]:frame.fields;
 const ids=["arpOpcode","arpSenderIp","arpSenderMac","arpCachedMac"];
 ids.forEach((id,i)=>{$(id).textContent=fields[i];
  const alert=selectedTopicKey==="arp"?(id==="arpSenderMac"&&mode!=="normal"&&frame.senderMac==="02:00:00:00:00:CC"||id==="arpCachedMac"&&frame.cache==="poisoned"):frame.highlight?.includes(i);
  $(id).className=alert?"arp-bad-value":(mode==="mitigation"&&i===3?"arp-good-value":"");
 });
 $("arpChangeNote").textContent=selectedTopicKey==="arp"?
  (frame.cache==="poisoned"?"Changed: 02:00:00:00:00:11 → 02:00:00:00:00:CC (attacker MAC)":
  frame.cache==="rejected"?"Rejected at switch: forged claim never reaches the victim.":
  frame.cache==="correct"?"Gateway address maps to legitimate MAC.":"Gateway MAC is being resolved."):
  frame.note;
 $("arpPrev").disabled=step===0;$("arpNext").disabled=step===data.steps.length-1;
 const play=$("arpPlay");play.querySelector("img").src="./icons/"+(timer===null?"play":"pause")+".svg";
 play.querySelector("span").textContent=timer===null?"Play":"Pause";
 play.setAttribute("aria-label",timer===null?"Play selected animation":"Pause selected animation");
 play.title=timer===null?"Play selected animation":"Pause selected animation";
 lab.querySelector(".arp-attacker").classList.toggle("danger",mode==="attack");
 lab.querySelector(".arp-switch").classList.toggle("verified",mode==="mitigation");
 lab.querySelector(".arp-gateway").classList.toggle("verified",mode!=="attack");
 lab.classList.toggle("arp-blocked",mode==="mitigation"&&step>=1);
 const blocked=mode==="mitigation"&&(selectedTopicKey==="arp"?step>=1:step===1);
 const paths=blocked&&selectedTopicKey==="arp"?["protected"]:frame.paths;
 const badge=lab.querySelector("#arpMechanismBadge");
 if(badge){
  const f0=selectedTopicKey==="arp"?[frame.opcode,frame.senderIp,frame.senderMac,
   frame.cache==="poisoned"?badMac:goodMac]:frame.fields;
  const topicSummary={
   arp:["ARP cache update","192.168.1.1 → "+(mode==="attack"&&step>=1?badMac:goodMac)],
   mac:["MAC identity claim","Source "+f0[1]+" ≠ credential"],
   ip:["IPv4 header","SOURCE "+f0[1]+" · DEST "+f0[2]],
   dhcp:["DHCP options","Router "+f0[2]+" · DNS "+f0[3]],
   bgp:["Route advertisement","Prefix "+f0[1]+" · Origin "+f0[2]],
   dns:["DNS record","Query "+f0[1]+" · Answer "+f0[2]],
   syn:["Half-open state","Pending queue: "+f0[2]],
   hijack:["TCP sequence state","SEQ "+f0[1]+" · ACK "+f0[2]]
  };
  badge.replaceChildren();
  const title=document.createElement("small");title.textContent=topicSummary[selectedTopicKey][0];
  const line=document.createElement("strong");line.textContent=topicSummary[selectedTopicKey][1];
  badge.append(title,line);
  if(selectedTopicKey==="ip"&&mode==="mitigation"){
   const policy=document.createElement("div");policy.className="arp-source-policy";
   const label=document.createElement("span");label.textContent="Allowed source: 198.51.100.0/24";
   const result=document.createElement("span");result.textContent="Claimed 192.0.2.24 → "+(step===1?"DROP":"CHECK");
   policy.append(label,result);badge.append(policy);
  }

  if(selectedTopicKey==="syn"&&mode==="mitigation"){
   const cookie=document.createElement("img");cookie.className="arp-syn-cookie";cookie.src="./icons/cookie.svg";cookie.alt="";cookie.setAttribute("aria-hidden","true");
   cookie.title="SYN cookie — encoded connection verification, not a browser cookie";badge.append(cookie);
  }
  badge.className="arp-mechanism-badge "+(mode==="attack"?"danger":mode==="mitigation"?"protected":"");
 }
 const symbol=lab.querySelector("#arpBlockedSymbol");
 if(symbol)symbol.hidden=!blocked;
 lab.classList.toggle("arp-block-and-safe",blocked);
 drawPaths(paths);
 const svg=lab.querySelector(".arp-topology-svg");
 if(timer===null)svg?.pauseAnimations?.();else svg?.unpauseAnimations?.();
}
function applyProfile(key){
 const profile=topicProfiles[key];if(!profile)return;
 selectedTopicKey=key;modes=profile.modes||arpModes;
 lab.querySelector(".arp-overline").textContent=String(["arp","mac","ip","dhcp","bgp","dns","syn","hijack"].indexOf(key)+1).padStart(2,"0")+" / 08 · NETWORK SECURITY";
 lab.querySelector(".arp-intro h3").textContent=({arp:"ARP Poisoning",mac:"MAC Spoofing",ip:"IP Spoofing",dhcp:"DHCP",bgp:"BGP",dns:"DNS",syn:"SYN Flooding",hijack:"TCP Hijacking"})[key];
 lab.querySelector(".arp-intro p").textContent=profile.term+" — "+profile.intro;
 const actors=lab.querySelectorAll(".arp-actor");
 profile.actors.forEach(([title,sub],i)=>{
  actors[i].querySelector("strong").textContent=title;
  actors[i].querySelector("small").textContent=sub;
 });
 lab.querySelectorAll(".arp-inspector-head span")[0].textContent=profile.inspector;
 lab.querySelectorAll(".arp-inspector-head span")[1].textContent=profile.result;
 lab.querySelectorAll(".arp-inspector-fields small").forEach((x,i)=>x.textContent=profile.labels[i]);
 lab.querySelectorAll(".arp-five-questions span").forEach((x,i)=>x.textContent=profile.questions[i]);
 const src=lab.querySelector(".arp-sources");src.replaceChildren(document.createTextNode("Sources: "));
 profile.sources.forEach(([label,url],i)=>{
  if(i)src.append(document.createTextNode(" · "));
  const link=document.createElement("a");link.href=url;link.target="_blank";link.rel="noopener noreferrer";
  link.textContent=label+" ↗";src.append(link);
 });
}

function setMode(name){if(!modes[name])return;stop();mode=name;step=0;cycles=0;startAutoplay()}
function next(){if(step===modes[mode].steps.length-1){stop();paint();return}step++;paint()}
function scheduleLoop(){
 timer=setInterval(()=>{
  if(!root.classList.contains("active")){stop();paint();return}
  if(step<modes[mode].steps.length-1){step++}
  else if(cycles<MAX_LOOPS-1){cycles++;step=0}
  else{stop();paint();return}
  if(cycles===MAX_LOOPS-1&&step===modes[mode].steps.length-1)stop();
  paint();
 },STEP_INTERVAL_MS);
}
function updatePlaybackButton(running){
 const play=$("arpPlay");
 play.querySelector("img").src="./icons/"+(running?"pause":"play")+".svg";
 play.querySelector("span").textContent=running?"Pause":"Play";
 play.setAttribute("aria-label",running?"Pause selected animation":"Play selected animation");
 play.title=running?"Pause selected animation":"Play selected animation";
}
function startAutoplay(){
 stop();cycles=0;frozen=false;
 if(reduce){paint();return}
 scheduleLoop();
 paint();
}
function togglePlay(){
 if(timer!==null){
  // Freeze the current SVG motion in place, rather than redrawing a stray packet.
  stop(true);frozen=true;
  lab.querySelector(".arp-topology-svg")?.pauseAnimations?.();
  updatePlaybackButton(false);
  $("arpStepCount").textContent=(step+1)+" / "+modes[mode].steps.length+" · paused";
  return;
 }
 if(frozen){
  frozen=false;
  if(!reduce){scheduleLoop();lab.querySelector(".arp-topology-svg")?.unpauseAnimations?.()}
  updatePlaybackButton(!reduce);
  $("arpStepCount").textContent=(step+1)+" / "+modes[mode].steps.length+" · loop "+(cycles+1)+"/"+MAX_LOOPS;
  return;
 }
 if(step===modes[mode].steps.length-1)step=0;
 startAutoplay();
}

lab.querySelectorAll("[data-arp-mode]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.arpMode)));
$("arpPrev").addEventListener("click",()=>{stop();step=Math.max(0,step-1);paint()});
$("arpNext").addEventListener("click",()=>{stop();next()});
$("arpReplay").addEventListener("click",()=>{stop();step=0;startAutoplay()});
$("arpPlay").addEventListener("click",togglePlay);
// Prevent Space focused on local playback controls from affecting global presenter timer.
lab.querySelector(".arp-playback").addEventListener("keydown",event=>{
 if(event.code==="Space"||event.code==="Enter"){event.stopPropagation()}
});
$("arpBackMap").addEventListener("click",()=>document.getElementById("topicMap")?.click());
$("arpRelated").addEventListener("click",()=>document.getElementById("topicCases")?.click());
function sync(){
 const chosen=cards.querySelector(".topic-option.active")?.dataset.topic;
 const next=["arp","mac","ip","dhcp","bgp","dns","syn","hijack"][Number(chosen)];
 const enabled=next!==undefined&&chosen!==undefined;
 if(root.classList.contains("arp-mode")!==enabled)root.classList.toggle("arp-mode",enabled);
 if(detail.classList.contains("arp-focused")!==enabled)detail.classList.toggle("arp-focused",enabled);
 if(enabled&&(selectedTopicKey!==next||activeTopic!==next)){
  stop();mode="normal";step=0;cycles=0;applyProfile(next);
  activeTopic=next;
  if(root.classList.contains("active"))startAutoplay();else paint();
 }
 if(!root.classList.contains("active")){
  stop();activeTopic=null;
  lab.querySelector(".arp-topology-svg")?.pauseAnimations?.();
 }
}

const observer=new MutationObserver(sync);
observer.observe(cards,{attributes:true,subtree:true,attributeFilter:["class"]});
observer.observe(root,{attributes:true,attributeFilter:["class"]});
applyProfile("arp");paint();sync();
})();