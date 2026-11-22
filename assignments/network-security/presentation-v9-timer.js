/* A presenter-only stopwatch. Uses a monotonic clock, not a fake progress bar.
   Fullscreen entry starts a fresh timer; exit resets it; Space toggles pause; R resets. */
(function(){
"use strict";
const present=document.getElementById("fullscreenButton");
const footer=document.querySelector(".footer > span:last-child");
if(!present||!footer)return;
const originalFooter=footer.textContent.replace(/\s*·\s*N notes\s*$/,"");
footer.textContent=originalFooter;
const wrapper=document.createElement("div");wrapper.className="v9-presenter-wrapper";
present.parentNode.insertBefore(wrapper,present);wrapper.append(present);
const tools=document.createElement("div");tools.className="v9-presenter-clock";tools.hidden=true;
const time=document.createElement("output");time.id="v9Stopwatch";time.textContent="00:00";
time.setAttribute("aria-label","Elapsed presentation time");
const pause=document.createElement("button");pause.type="button";pause.className="v9-clock-button";pause.title="Pause timer (Space)";
const reset=document.createElement("button");reset.type="button";reset.className="v9-clock-button v9-clock-reset";reset.textContent="↻";reset.title="Reset timer (R)";reset.setAttribute("aria-label","Reset timer");
tools.append(time,pause,reset);wrapper.append(tools);
let totalBeforePause=0,startedAt=0,running=false,active=false,frame=null;
const pad=n=>String(n).padStart(2,"0");
function timeNow(){return totalBeforePause+(running?performance.now()-startedAt:0)}
function render(){
 const seconds=Math.floor(Math.max(0,timeNow())/1000);
 time.textContent=pad(Math.floor(seconds/60))+":"+pad(seconds%60);
 time.classList.toggle("v9-overrun",seconds>=15*60);
 time.classList.toggle("v9-warning",seconds>=13*60&&seconds<15*60);
 const img=document.createElement("img");img.src="./icons/"+(running?"pause":"play")+".svg";img.alt="";
 pause.replaceChildren(img);
 const message=running?"Pause timer (Space)":"Resume timer (Space)";
 pause.title=message;pause.setAttribute("aria-label",message);
}
function tick(){frame=null;if(!active)return;render();frame=requestAnimationFrame(tick)}
function start(){active=true;running=true;totalBeforePause=0;startedAt=performance.now();tools.hidden=false;footer.textContent="← → navigate · Space pause/resume · R reset";render();if(frame===null)frame=requestAnimationFrame(tick)}
function stop(){active=false;running=false;totalBeforePause=0;startedAt=0;tools.hidden=true;footer.textContent=originalFooter;if(frame!==null)cancelAnimationFrame(frame);frame=null;render()}
function toggle(){if(!active)return;
 if(running){totalBeforePause=timeNow();running=false}
 else{startedAt=performance.now();running=true}
 render();
}
function restart(){if(!active)return;totalBeforePause=0;startedAt=performance.now();render()}
pause.addEventListener("click",toggle);
reset.addEventListener("click",restart);
document.addEventListener("fullscreenchange",()=>{if(document.fullscreenElement)start();else stop()});
window.addEventListener("keydown",event=>{
 if(!active||event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
 const t=event.target;
 if(t?.closest?.("input,textarea,select,[contenteditable=true],[role=textbox],.arp-playback"))return;
 if(event.code==="Space"){event.preventDefault();toggle()}
 else if(event.code==="KeyR"||event.key?.toLowerCase()==="r"){event.preventDefault();restart()}
},true);
window.addEventListener("pagehide",()=>{if(active)stop()});
})();