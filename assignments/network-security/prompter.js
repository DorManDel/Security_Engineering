/* Work-in-progress Hebrew speaker notes. Stage directions are visually distinct and never spoken. */
(function(){
"use strict";
const SCRIPT={
0:[
["action","[ACTION: Slide 00 — Allow the cube and network to become visible. Make eye contact before starting.]"],
["spoken","שלום לכולם, אני דור, והיום נדבר על מתקפות סייבר ועל חולשות בפרוטוקולים שבהם אנחנו משתמשים בכל יום."],
["spoken","אבל לפני שנדבר על מתקפות, חשוב להבין איך התקשורת באינטרנט באמת עובדת. בכל פעם שאנחנו פותחים אתר, המידע שלנו עובר דרך רכיבים שונים, וכל אחד מהם צריך לקבל החלטה: לאן לשלוח את החבילה, על מי לסמוך ומה לעשות עם התשובה."],
["spoken","במצגת נתחיל ממסע פשוט של פתיחת אתר. נכיר את הרכיבים והפרוטוקולים בדרך, נבין היכן קיימות הנחות אמון, ואז נראה איך תוקפים יכולים לנצל אותן."],
["action","[ACTION: Drag the cube briefly to point at the connected nodes. Let it resume rotating. Click “Enter the network”.]"]
],
1:[
["action","[ACTION: Slide 01 — Point to the example browser. Choose “Joining a new network”, then click Connect.]"],
["spoken","נניח שהתחברתי עכשיו לרשת אלחוטית וכתבתי כתובת אתר בדפדפן. לפני שאני בכלל מדבר עם השרת המרוחק, המחשב צריך לדעת איך לתקשר ברשת המקומית."],
["spoken","במקרה של חיבור חדש, DHCP יכול לספק למחשב כתובת IP מקומית, מסכת רשת, כתובת של שער ברירת המחדל וכתובת של שרת DNS. בהדגמה נראה את ארבע הודעות התהליך: Discover, Offer, Request ו-ACK."],
["action","[ACTION: Select DHCP. Advance one message at a time: Discover → Offer → Request → ACK. Open Packet Inspector and point at the source/destination fields.]"],
["spoken","כדי לשלוח חבילת IPv4 אל מחוץ לרשת המקומית, המחשב צריך לדעת את כתובת ה-MAC של ה-next hop המקומי, בדרך כלל הנתב. כאן ARP נכנס לפעולה: הוא שואל מי מחזיק את כתובת ה-IP הזאת, ומקבל תשובה עם כתובת ה-MAC המתאימה."],
["action","[ACTION: Select ARP. Show the local broadcast request and the gateway's response. Explain that this is not the MAC address of the remote website.]"],
["spoken","עכשיו נוכל לשאול את שרת ה-DNS מה כתובת ה-IP של האתר. אם התשובה כבר שמורה במטמון, לא בהכרח צריך לשאול שוב. שרת ה-DNS הוא שירות שאנחנו פונים אליו; הוא לא תחנת מעבר שכל חבילת אתר חייבת לעבור דרכה."],
["action","[ACTION: Select DNS. Show the query and response. If useful, switch to the cached-network scenario and show which exchanges are skipped.]"],
["spoken","מרגע שידועה כתובת היעד, המחשב בוחר מסלול דרך שער ברירת המחדל. בנתב ביתי יכול להתבצע גם NAT, שמתרגם את כתובת המקור הפרטית ואת הפורט לכתובת ציבורית ולפורט מתאים."],
["action","[ACTION: Select Route / NAT. Compare the before and after source IP:port tuple.]"],
["spoken","בהדגמה הזאת נשתמש ב-TCP, שבונה חיבור באמצעות SYN, SYN-ACK ו-ACK. לאחר מכן, ב-HTTPS, יבוצע גם TLS כדי לאמת את השרת ולהגן על תוכן הבקשות והתשובות. HTTP/3 מודרני יכול להשתמש ב-QUIC מעל UDP, ולכן זה לא המסלול היחיד האפשרי."],
["action","[ACTION: Step through TCP and TLS. Then choose HTTP and show the request/response. Open “Where is the risk?” for one example of a trust boundary.]"],
["spoken","הרעיון החשוב הוא שלא מדובר בפעולה אחת של 'שליחת מידע'. יש כמה פרוטוקולים, כמה חילופי הודעות וכמה החלטות אבטחה. בהמשך נבחן מה קורה כשאחת ההחלטות האלה מתקבלת על בסיס מידע מזויף."]
],
2:[
["action","[ACTION: Slide 02 — Show the CIA cards. Begin with Confidentiality and switch the HTTP / HTTPS comparison.]"],
["spoken","לפני שנראה איך תוקפים מנצלים את הפרוטוקולים, נגדיר מה אנחנו רוצים להגן עליו. שלושת היעדים המרכזיים הם Confidentiality, Integrity ו-Availability."],
["spoken","Confidentiality היא סודיות המידע: רק מי שמורשה לקרוא אותו אמור להצליח לעשות זאת. בתקשורת HTTP לא מוצפנת, גורם שנמצא על המסלול יכול לעיתים לקרוא את תוכן ההודעה. ב-HTTPS התוכן מוגן באמצעות TLS, אבל מידע על עצם התקשורת, כמו כתובות IP, פורטים, גודל החבילות ותזמון, עשוי עדיין להיות גלוי."],
["action","[ACTION: Toggle HTTP → HTTPS. Point first to readable request content and then to encrypted application data versus visible metadata.]"],
["spoken","Integrity היא שלמות ואמינות התוכן. למשל, אם שלחתי בקשה להעביר סכום מסוים, אני רוצה לגלות אם מישהו שינה את ההודעה בדרך. TLS מאומת מסייע לזהות שינויים בתוכן המוגן."],
["action","[ACTION: Select Integrity. Show the conceptual altered-message example and then the failed TLS verification.]"],
["spoken","Availability היא זמינות: גם אם אף אחד לא קרא או שינה את ההודעה, המערכת לא מועילה אם אי אפשר להגיע לשירות. עומס יזום או פגיעה בתשתית יכולים לגרום לכך."],
["action","[ACTION: Select Availability. Play the conceptual overload and timeout. Conclude that encryption alone does not guarantee availability.]"],
["spoken","שלוש השאלות שניקח איתנו להמשך הן: מי יכול לקרוא? מי יכול לשנות? ומי יכול למנוע מהשירות לפעול?"]
],
3:[
["action","[ACTION: Slide 03 — Open the interactive Network Map. Keep the entire topology visible first.]"],
["spoken","כדי שלא נאבד את ההקשר, נשתמש באותה מפת רשת לאורך כל המצגת. כל רכיב ממלא תפקיד אחר: המחשב יוצר בקשות, נקודת הגישה מחברת אותנו לרשת המקומית, והנתב בוחר כיצד להעביר תעבורה לרשתות אחרות."],
["action","[ACTION: Click Router. Show the mini-lab and the difference between routing and NAT.]"],
["spoken","DHCP ו-DNS הם שירותים שעוזרים למחשב לדעת כיצד לתקשר ולאן להגיע. ARP, לעומתם, פועל בשכבת הקישור המקומית ומאפשר למצוא כתובת MAC מתאימה לכתובת IPv4 של שכן ברשת."],
["action","[ACTION: Click DHCP → ARP → DNS, one at a time. Do not run all three animations together.]"],
["spoken","בהמשך נחזור לרכיבים האלו דרך שמונת הנושאים שנבחרו, ונראה לא רק מה הם עושים אלא איך אפשר לנצל את התנהגותם בצורה זדונית."],
["action","[ACTION: Advance to Eight Topics only after the audience understands the normal path.]"]
]
};
const notesBody=document.getElementById("notesBody");
const notesModal=document.getElementById("notesModal");
if(!notesBody||!notesModal||typeof cueText==="undefined")return;
function dataFor(i){return SCRIPT[i]||((cueText[i]||[]).map(line=>({kind:line.trim().startsWith("[")?"action":"spoken",text:line}))).map(item=>[item.kind,item.text])}
function displayNotes(){
 const lines=dataFor(activeSlide);
 notesBody.replaceChildren();
 const intro=document.createElement("div");intro.className="prompter-hint";intro.textContent="WORKING DRAFT · White: speak aloud · Grey [ACTION]: do not read";
 notesBody.append(intro);
 lines.forEach(([kind,text])=>{
  const p=document.createElement("p");p.className=kind==="action"?"prompter-action":"prompter-spoken";p.textContent=text;notesBody.append(p)
 });
 const count=document.getElementById("prompterCount");
 if(count)count.textContent="Slide "+String(activeSlide).padStart(2,"0")+" · "+lines.filter(x=>x[0]==="spoken").length+" spoken paragraphs";
}
updateNotes=displayNotes;
const heading=notesModal.querySelector("#notesTitle");
if(heading)heading.textContent="Speaker script & stage cues";
const bar=document.createElement("div");bar.className="prompter-tools";
const counter=document.createElement("span");counter.className="micro";counter.id="prompterCount";
const copy=document.createElement("button");copy.type="button";copy.className="secondary";
copy.textContent="Copy spoken text";
copy.addEventListener("click",async()=>{
 const spoken=dataFor(activeSlide).filter(x=>x[0]==="spoken").map(x=>x[1]).join("\n\n");
 try{await navigator.clipboard.writeText(spoken);copy.textContent="✓ Copied";setTimeout(()=>copy.textContent="Copy spoken text",1200)}
 catch{copy.textContent="Copy unavailable";setTimeout(()=>copy.textContent="Copy spoken text",1400)}
});
bar.append(counter,copy);notesBody.before(bar);
const bottom=notesModal.querySelector(".dialog > p.small");
if(bottom)bottom.textContent="This is an unapproved speaking draft. Keep the approved master script private in Drive; slide actions are never spoken aloud.";
/* Listen to navigation while the notes drawer remains open, updating content without opening another dialog. */
const originalSlideTo=slideTo;
slideTo=function(i){originalSlideTo(i);if(!notesModal.hidden)displayNotes()};
})();
