// FancyZoom.js - v1.1 - http://www.fancyzoom.com
//
// Copyright (c) 2008 Cabel Sasser / Panic Inc
// All rights reserved.
// 
//     Requires: FancyZoomHTML.js
// Instructions: Include JS files in page, call setupZoom() in onLoad. That's it!
//               Any <a href> links to images will be updated to zoom inline.
//               Add rel="nozoom" to your <a href> to disable zooming for an image.
// 
// Redistribution and use of this effect in source form, with or without modification,
// are permitted provided that the following conditions are met:
// 
// * USE OF SOURCE ON COMMERCIAL (FOR-PROFIT) WEBSITE REQUIRES ONE-TIME LICENSE FEE PER DOMAIN.
//   Reasonably priced! Visit www.fancyzoom.com for licensing instructions. Thanks!
//
// * Non-commercial (personal) website use is permitted without license/payment!
//
// * Redistribution of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
//
// * Redistribution of source code and derived works cannot be sold without specific
//   written prior permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
function findElementPos(a){var b=0,c=0;do b+=a.offsetLeft,c+=a.offsetTop;while(a=a.offsetParent);return[b,c]}function getShift(a){var b=!1;!a&&window.event?b=window.event.shiftKey:a&&(b=a.shiftKey,b&&a.stopPropagation());return b}function getSize(){self.innerHeight?(myWidth=window.innerWidth,myHeight=window.innerHeight,myScroll=window.pageYOffset):document.documentElement&&document.documentElement.clientHeight?(myWidth=document.documentElement.clientWidth,myHeight=document.documentElement.clientHeight,myScroll=document.documentElement.scrollTop):document.body&&(myWidth=document.body.clientWidth,myHeight=document.body.clientHeight,myScroll=document.body.scrollTop),window.innerHeight&&window.scrollMaxY?(myScrollWidth=document.body.scrollWidth,myScrollHeight=window.innerHeight+window.scrollMaxY):document.body.scrollHeight>document.body.offsetHeight?(myScrollWidth=document.body.scrollWidth,myScrollHeight=document.body.scrollHeight):(myScrollWidth=document.body.offsetWidth,myScrollHeight=document.body.offsetHeight)}function bounceOut(a,b,c,d){return(a/=d)<1/2.75?c*7.5625*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b}function cubicInOut(a,b,c,d){if((a/=d/2)<1)return c/2*a*a*a+b;return c/2*((a-=2)*a*a+2)+b}function cubicOut(a,b,c,d){return c*((a=a/d-1)*a*a+1)+b}function cubicIn(a,b,c,d){return c*(a/=d)*a*a+b}function sineInOut(a,b,c,d){return-c/2*(Math.cos(Math.PI*a/d)-1)+b}function linear(a,b,c,d){return c*a/d+b}function setOpacity(a,b){var c=document.getElementById(b).style;navigator.userAgent.indexOf("Firefox")!=-1&&a==100&&(a=99.9999),c.filter="alpha(opacity="+a+")",c.opacity=a/100}function fadeElement(a,b,c,d){b==d?(clearInterval(fadeTimer[a]),fadeActive[a]=!1,fadeTimer[a]=!1,fadeClose[a]==!0&&(document.getElementById(a).style.visibility="hidden"),fadeQueue[a]&&fadeQueue[a]!=!1&&(fadeElementSetup(fadeQueue[a][0],fadeQueue[a][1],fadeQueue[a][2],fadeQueue[a][3]),fadeQueue[a]=!1)):(b++,fadeMode[a]=="shadow"?c<0?document.getElementById(a).style.webkitBoxShadow=shadowSettings+Math.abs(b*c)+")":document.getElementById(a).style.webkitBoxShadow=shadowSettings+(100-b*c)+")":c<0?setOpacity(Math.abs(b*c),a):setOpacity(100-b*c,a),clearInterval(fadeTimer[a]),fadeTimer[a]=setInterval("fadeElement('"+a+"', '"+b+"', '"+c+"', '"+d+"')",15))}function fadeElementSetup(a,b,c,d,e,f){fadeActive[a]==!0?fadeQueue[a]=[a,b,c,d]:(fadeSteps=d,fadeCurrent=0,fadeAmount=(b-c)/fadeSteps,fadeTimer[a]=setInterval("fadeElement('"+a+"', '"+fadeCurrent+"', '"+fadeAmount+"', '"+fadeSteps+"')",15),fadeActive[a]=!0,fadeMode[a]=f,e==1?fadeClose[a]=!0:fadeClose[a]=!1)}function fadeIn(a){a.id&&fadeElementSetup(a.id,0,100,10)}function fadeOut(a){a.id&&fadeElementSetup(a.id,100,0,10)}function getKey(a){a?theKey=a.keyCode:theKey=event.keyCode,theKey==27&&zoomOut(this,a)}function zoomElement(zoomdiv,theID,zoomCurrent,zoomStartW,zoomChangeW,zoomStartH,zoomChangeH,zoomStartX,zoomChangeX,zoomStartY,zoomChangeY,zoomSteps,includeFade,fadeAmount,execWhenDone){zoomCurrent==zoomSteps+1?(zoomActive[theID]=!1,clearInterval(zoomTimer[theID]),execWhenDone!=""&&eval(execWhenDone)):(includeFade==1&&(fadeAmount<0?setOpacity(Math.abs(zoomCurrent*fadeAmount),zoomdiv):setOpacity(100-zoomCurrent*fadeAmount,zoomdiv)),moveW=cubicInOut(zoomCurrent,zoomStartW,zoomChangeW,zoomSteps),moveH=cubicInOut(zoomCurrent,zoomStartH,zoomChangeH,zoomSteps),moveX=cubicInOut(zoomCurrent,zoomStartX,zoomChangeX,zoomSteps),moveY=cubicInOut(zoomCurrent,zoomStartY,zoomChangeY,zoomSteps),document.getElementById(zoomdiv).style.left=moveX+"px",document.getElementById(zoomdiv).style.top=moveY+"px",zoomimg.style.width=moveW+"px",zoomimg.style.height=moveH+"px",zoomCurrent++,clearInterval(zoomTimer[theID]),zoomTimer[theID]=setInterval("zoomElement('"+zoomdiv+"', '"+theID+"', "+zoomCurrent+", "+zoomStartW+", "+zoomChangeW+", "+zoomStartH+", "+zoomChangeH+", "+zoomStartX+", "+zoomChangeX+", "+zoomStartY+", "+zoomChangeY+", "+zoomSteps+", "+includeFade+", "+fadeAmount+", '"+execWhenDone+"')",zoomTime))}function zoomDone(a,b){zoomOpen=!1,zoomOrigH[b]="",zoomOrigW[b]="",document.getElementById(a).style.visibility="hidden",zoomActive[b]==!1,document.onkeypress=null}function zoomDoneIn(a,b){zoomOpen=!0,a=document.getElementById(a),document.getElementById("ShadowBox")?(setOpacity(0,"ShadowBox"),shadowdiv=document.getElementById("ShadowBox"),shadowLeft=parseInt(a.style.left)-13,shadowTop=parseInt(a.style.top)-8,shadowWidth=a.offsetWidth+26,shadowHeight=a.offsetHeight+26,shadowdiv.style.width=shadowWidth+"px",shadowdiv.style.height=shadowHeight+"px",shadowdiv.style.left=shadowLeft+"px",shadowdiv.style.top=shadowTop+"px",document.getElementById("ShadowBox").style.visibility="visible",fadeElementSetup("ShadowBox",0,100,5)):browserIsIE||fadeElementSetup("ZoomImage",0,.8,5,0,"shadow"),includeCaption&&document.getElementById(zoomCaption).innerHTML!=""&&(zoomcapd=document.getElementById(zoomCaptionDiv),zoomcapd.style.top=parseInt(a.style.top)+(a.offsetHeight+15)+"px",zoomcapd.style.left=myWidth/2-zoomcapd.offsetWidth/2+"px",zoomcapd.style.visibility="visible"),browserIsIE||setOpacity(0,"ZoomClose"),document.getElementById("ZoomClose").style.visibility="visible",browserIsIE||fadeElementSetup("ZoomClose",0,100,5),document.onkeypress=getKey}function zoomOut(a,b){getShift(b)?tempSteps=zoomSteps*7:tempSteps=zoomSteps,zoomActive[theID]!=!0&&(document.getElementById("ShadowBox")?document.getElementById("ShadowBox").style.visibility="hidden":browserIsIE||(fadeActive.ZoomImage&&(clearInterval(fadeTimer.ZoomImage),fadeActive.ZoomImage=!1,fadeTimer.ZoomImage=!1),document.getElementById("ZoomImage").style.webkitBoxShadow=shadowSettings+"0.0)"),document.getElementById("ZoomClose").style.visibility="hidden",includeCaption&&document.getElementById(zoomCaption).innerHTML!=""&&(document.getElementById(zoomCaptionDiv).style.visibility="hidden"),startX=parseInt(zoomdiv.style.left),startY=parseInt(zoomdiv.style.top),startW=zoomimg.width,startH=zoomimg.height,zoomChangeX=zoomOrigX[theID]-startX,zoomChangeY=zoomOrigY[theID]-startY,zoomChangeW=zoomOrigW[theID]-startW,zoomChangeH=zoomOrigH[theID]-startH,zoomCurrent=0,includeFade==1?(fadeCurrent=0,fadeAmount=100/tempSteps):fadeAmount=0,zoomTimer[theID]=setInterval("zoomElement('"+zoomID+"', '"+theID+"', "+zoomCurrent+", "+startW+", "+zoomChangeW+", "+startH+", "+zoomChangeH+", "+startX+", "+zoomChangeX+", "+startY+", "+zoomChangeY+", "+tempSteps+", "+includeFade+", "+fadeAmount+", 'zoomDone(zoomID, theID)')",zoomTime),zoomActive[theID]=!0)}function zoomIn(a,b){zoomimg.src=a.getAttribute("href"),a.childNodes[0].width?(startW=a.childNodes[0].width,startH=a.childNodes[0].height,startPos=findElementPos(a.childNodes[0])):(startW=50,startH=12,startPos=findElementPos(a)),hostX=startPos[0],hostY=startPos[1],document.getElementById("scroller")&&(hostX=hostX-document.getElementById("scroller").scrollLeft),endW=imgPreload.width,endH=imgPreload.height,zoomActive[theID]!=!0&&(document.getElementById("ShadowBox")?document.getElementById("ShadowBox").style.visibility="hidden":browserIsIE||(fadeActive.ZoomImage&&(clearInterval(fadeTimer.ZoomImage),fadeActive.ZoomImage=!1,fadeTimer.ZoomImage=!1),document.getElementById("ZoomImage").style.webkitBoxShadow=shadowSettings+"0.0)"),document.getElementById("ZoomClose").style.visibility="hidden",includeCaption&&(document.getElementById(zoomCaptionDiv).style.visibility="hidden",a.getAttribute("title")&&includeCaption?document.getElementById(zoomCaption).innerHTML=a.getAttribute("title"):document.getElementById(zoomCaption).innerHTML=""),zoomOrigW[theID]=startW,zoomOrigH[theID]=startH,zoomOrigX[theID]=hostX,zoomOrigY[theID]=hostY,zoomimg.style.width=startW+"px",zoomimg.style.height=startH+"px",zoomdiv.style.left=hostX+"px",zoomdiv.style.top=hostY+"px",includeFade==1&&setOpacity(0,zoomID),zoomdiv.style.visibility="visible",sizeRatio=endW/endH,endW>myWidth-minBorder&&(endW=myWidth-minBorder,endH=endW/sizeRatio),endH>myHeight-minBorder&&(endH=myHeight-minBorder,endW=endH*sizeRatio),zoomChangeX=myWidth/2-endW/2-hostX,zoomChangeY=myHeight/2-endH/2-hostY+myScroll,zoomChangeW=endW-startW,zoomChangeH=endH-startH,b?tempSteps=zoomSteps*7:tempSteps=zoomSteps,zoomCurrent=0,includeFade==1?(fadeCurrent=0,fadeAmount=-100/tempSteps):fadeAmount=0,zoomTimer[theID]=setInterval("zoomElement('"+zoomID+"', '"+theID+"', "+zoomCurrent+", "+startW+", "+zoomChangeW+", "+startH+", "+zoomChangeH+", "+hostX+", "+zoomChangeX+", "+hostY+", "+zoomChangeY+", "+tempSteps+", "+includeFade+", "+fadeAmount+", 'zoomDoneIn(zoomID)')",zoomTime),zoomActive[theID]=!0)}function zoomClick(a,b){var c=getShift(b);if(!b&&window.event&&(window.event.metaKey||window.event.altKey))return!0;if(b&&(b.metaKey||b.altKey))return!0;getSize(),preloadActive==!0?preloadAnimTimer==0&&(preloadFrom=a,preloadAnimStart()):zoomIn(a,c);return!1}function preloadAnim(a){preloadActive!=!1?(document.getElementById("SpinImage").src=zoomImagesURI+"zoom-spin-"+preloadFrame+".png",preloadFrame++,preloadFrame>12&&(preloadFrame=1)):(document.getElementById("ZoomSpin").style.visibility="hidden",clearInterval(preloadAnimTimer),preloadAnimTimer=0,zoomIn(preloadFrom))}function preloadAnimStart(){preloadTime=new Date,document.getElementById("ZoomSpin").style.left=myWidth/2+"px",document.getElementById("ZoomSpin").style.top=myHeight/2+myScroll+"px",document.getElementById("ZoomSpin").style.visibility="visible",preloadFrame=1,document.getElementById("SpinImage").src=zoomImagesURI+"zoom-spin-"+preloadFrame+".png",preloadAnimTimer=setInterval("preloadAnim()",100)}function zoomPreload(a){var b=a.getAttribute("href");imgPreload.src.indexOf(a.getAttribute("href").substr(a.getAttribute("href").lastIndexOf("/")))==-1&&(preloadActive=!0,imgPreload=new Image,imgPreload.onload=function(){preloadActive=!1},imgPreload.src=b)}function prepZooms(){if(!!document.getElementsByTagName){var a=document.getElementsByTagName("a");for(i=0;i<a.length;i++)a[i].getAttribute("href")&&a[i].getAttribute("href").search(/(.*)\.(jpg|jpeg|gif|png|bmp|tif|tiff)/gi)!=-1&&a[i].getAttribute("rel")!="nozoom"&&(a[i].onclick=function(a){return zoomClick(this,a)},a[i].onmouseover=function(){zoomPreload(this)})}}function setupZoom(){prepZooms(),insertZoomHTML(),zoomdiv=document.getElementById(zoomID),zoomimg=document.getElementById(theID)}var includeCaption=!1,zoomTime=5,zoomSteps=15,includeFade=1,minBorder=90,shadowSettings="0px 5px 25px rgba(0, 0, 0, ",zoomImagesURI="/images/zoom/",myWidth=0,myHeight=0,myScroll=0;myScrollWidth=0,myScrollHeight=0;var zoomOpen=!1,preloadFrame=1,preloadActive=!1,preloadTime=0,imgPreload=new Image,preloadAnimTimer=0,zoomActive=[],zoomTimer=[],zoomOrigW=[],zoomOrigH=[],zoomOrigX=[],zoomOrigY=[],zoomID="ZoomBox",theID="ZoomImage",zoomCaption="ZoomCaption",zoomCaptionDiv="ZoomCapDiv";if(navigator.userAgent.indexOf("MSIE")!=-1)var browserIsIE=!0;var fadeActive=[],fadeQueue=[],fadeTimer=[],fadeClose=[],fadeMode=[]