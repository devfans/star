"use strict";let page=document.getElementById("buttonDiv");const kButtonColors=["#3aa757","#e8453c","#f9bb2d","#4688f1"];function constructOptions(t){for(let o of t){let t=document.createElement("button");t.style.backgroundColor=o,t.addEventListener("click",function(){chrome.storage.sync.set({color:o},function(){console.log("color is "+o)})}),page.appendChild(t)}}constructOptions(kButtonColors);