/* A purely decorative two-way packet path next to Slide 01's existing title. */
(function(){
"use strict";
const title=document.querySelector("#journey .slide-head h2");
if(!title||title.querySelector(".v5-title-route"))return;
const rail=document.createElement("span");
rail.className="v5-title-route";
rail.setAttribute("aria-hidden","true");
rail.innerHTML='<span class="v5-title-lane out"></span><span class="v5-title-lane back"></span><span class="v5-title-packet featured"></span><span class="v5-title-packet follow"></span><span class="v5-title-packet return"></span>';
title.append(rail);
})();