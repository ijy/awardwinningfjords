// script.aculo.us effects.js v1.8.3, Thu Oct 08 11:23:33 +0200 2009
// Copyright (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// Contributors:
//  Justin Palmer (http://encytemedia.com/)
//  Mark Pilgrim (http://diveintomark.org/)
//  Martin Bialasinki
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/
// converts rgb() and #xxx to #xxxxxx format,
// returns self (or first argument) if not convertable
String.prototype.parseColor=function(){var a="#";if(this.slice(0,4)=="rgb("){var b=this.slice(4,this.length-1).split(","),c=0;do a+=parseInt(b[c]).toColorPart();while(++c<3)}else if(this.slice(0,1)=="#"){if(this.length==4)for(var c=1;c<4;c++)a+=(this.charAt(c)+this.charAt(c)).toLowerCase();this.length==7&&(a=this.toLowerCase())}return a.length==7?a:arguments[0]||this},Element.collectTextNodes=function(a){return $A($(a).childNodes).collect(function(a){return a.nodeType==3?a.nodeValue:a.hasChildNodes()?Element.collectTextNodes(a):""}).flatten().join("")},Element.collectTextNodesIgnoreClass=function(a,b){return $A($(a).childNodes).collect(function(a){return a.nodeType==3?a.nodeValue:a.hasChildNodes()&&!Element.hasClassName(a,b)?Element.collectTextNodesIgnoreClass(a,b):""}).flatten().join("")},Element.setContentZoom=function(a,b){a=$(a),a.setStyle({fontSize:b/100+"em"}),Prototype.Browser.WebKit&&window.scrollBy(0,0);return a},Element.getInlineOpacity=function(a){return $(a).style.opacity||""},Element.forceRerendering=function(a){try{a=$(a);var b=document.createTextNode(" ");a.appendChild(b),a.removeChild(b)}catch(c){}};var Effect={_elementDoesNotExistError:{name:"ElementDoesNotExistError",message:"The specified DOM element does not exist, but is required for this effect to operate"},Transitions:{linear:Prototype.K,sinoidal:function(a){return-Math.cos(a*Math.PI)/2+.5},reverse:function(a){return 1-a},flicker:function(a){var a=-Math.cos(a*Math.PI)/4+.75+Math.random()/4;return a>1?1:a},wobble:function(a){return-Math.cos(a*Math.PI*9*a)/2+.5},pulse:function(a,b){return-Math.cos(a*((b||5)-.5)*2*Math.PI)/2+.5},spring:function(a){return 1-Math.cos(a*4.5*Math.PI)*Math.exp(-a*6)},none:function(a){return 0},full:function(a){return 1}},DefaultOptions:{duration:1,fps:100,sync:!1,from:0,to:1,delay:0,queue:"parallel"},tagifyText:function(a){var b="position:relative";Prototype.Browser.IE&&(b+=";zoom:1"),a=$(a),$A(a.childNodes).each(function(c){c.nodeType==3&&(c.nodeValue.toArray().each(function(d){a.insertBefore((new Element("span",{style:b})).update(d==" "?String.fromCharCode(160):d),c)}),Element.remove(c))})},multiple:function(a,b){var c;(typeof a=="object"||Object.isFunction(a))&&a.length?c=a:c=$(a).childNodes;var d=Object.extend({speed:.1,delay:0},arguments[2]||{}),e=d.delay;$A(c).each(function(a,c){new b(a,Object.extend(d,{delay:c*d.speed+e}))})},PAIRS:{slide:["SlideDown","SlideUp"],blind:["BlindDown","BlindUp"],appear:["Appear","Fade"]},toggle:function(a,b,c){a=$(a),b=(b||"appear").toLowerCase();return Effect[Effect.PAIRS[b][a.visible()?1:0]](a,Object.extend({queue:{position:"end",scope:a.id||"global",limit:1}},c||{}))}};Effect.DefaultOptions.transition=Effect.Transitions.sinoidal,Effect.ScopedQueue=Class.create(Enumerable,{initialize:function(){this.effects=[],this.interval=null},_each:function(a){this.effects._each(a)},add:function(a){var b=(new Date).getTime(),c=Object.isString(a.options.queue)?a.options.queue:a.options.queue.position;switch(c){case"front":this.effects.findAll(function(a){return a.state=="idle"}).each(function(b){b.startOn+=a.finishOn,b.finishOn+=a.finishOn});break;case"with-last":b=this.effects.pluck("startOn").max()||b;break;case"end":b=this.effects.pluck("finishOn").max()||b}a.startOn+=b,a.finishOn+=b,(!a.options.queue.limit||this.effects.length<a.options.queue.limit)&&this.effects.push(a),this.interval||(this.interval=setInterval(this.loop.bind(this),15))},remove:function(a){this.effects=this.effects.reject(function(b){return b==a}),this.effects.length==0&&(clearInterval(this.interval),this.interval=null)},loop:function(){var a=(new Date).getTime();for(var b=0,c=this.effects.length;b<c;b++)this.effects[b]&&this.effects[b].loop(a)}}),Effect.Queues={instances:$H(),get:function(a){if(!Object.isString(a))return a;return this.instances.get(a)||this.instances.set(a,new Effect.ScopedQueue)}},Effect.Queue=Effect.Queues.get("global"),Effect.Base=Class.create({position:null,start:function(a){a&&a.transition===!1&&(a.transition=Effect.Transitions.linear),this.options=Object.extend(Object.extend({},Effect.DefaultOptions),a||{}),this.currentFrame=0,this.state="idle",this.startOn=this.options.delay*1e3,this.finishOn=this.startOn+this.options.duration*1e3,this.fromToDelta=this.options.to-this.options.from,this.totalTime=this.finishOn-this.startOn,this.totalFrames=this.options.fps*this.options.duration,this.render=function(){function a(a,b){a.options[b+"Internal"]&&a.options[b+"Internal"](a),a.options[b]&&a.options[b](a)}return function(b){this.state==="idle"&&(this.state="running",a(this,"beforeSetup"),this.setup&&this.setup(),a(this,"afterSetup")),this.state==="running"&&(b=this.options.transition(b)*this.fromToDelta+this.options.from,this.position=b,a(this,"beforeUpdate"),this.update&&this.update(b),a(this,"afterUpdate"))}}(),this.event("beforeStart"),this.options.sync||Effect.Queues.get(Object.isString(this.options.queue)?"global":this.options.queue.scope).add(this)},loop:function(a){if(a>=this.startOn){if(a>=this.finishOn){this.render(1),this.cancel(),this.event("beforeFinish"),this.finish&&this.finish(),this.event("afterFinish");return}var b=(a-this.startOn)/this.totalTime,c=(b*this.totalFrames).round();c>this.currentFrame&&(this.render(b),this.currentFrame=c)}},cancel:function(){this.options.sync||Effect.Queues.get(Object.isString(this.options.queue)?"global":this.options.queue.scope).remove(this),this.state="finished"},event:function(a){this.options[a+"Internal"]&&this.options[a+"Internal"](this),this.options[a]&&this.options[a](this)},inspect:function(){var a=$H();for(property in this)Object.isFunction(this[property])||a.set(property,this[property]);return"#<Effect:"+a.inspect()+",options:"+$H(this.options).inspect()+">"}}),Effect.Parallel=Class.create(Effect.Base,{initialize:function(a){this.effects=a||[],this.start(arguments[1])},update:function(a){this.effects.invoke("render",a)},finish:function(a){this.effects.each(function(b){b.render(1),b.cancel(),b.event("beforeFinish"),b.finish&&b.finish(a),b.event("afterFinish")})}}),Effect.Tween=Class.create(Effect.Base,{initialize:function(a,b,c){a=Object.isString(a)?$(a):a;var d=$A(arguments),e=d.last(),f=d.length==5?d[3]:null;this.method=Object.isFunction(e)?e.bind(a):Object.isFunction(a[e])?a[e].bind(a):function(b){a[e]=b},this.start(Object.extend({from:b,to:c},f||{}))},update:function(a){this.method(a)}}),Effect.Event=Class.create(Effect.Base,{initialize:function(){this.start(Object.extend({duration:0},arguments[0]||{}))},update:Prototype.emptyFunction}),Effect.Opacity=Class.create(Effect.Base,{initialize:function(a){this.element=$(a);if(!this.element)throw Effect._elementDoesNotExistError;Prototype.Browser.IE&&!this.element.currentStyle.hasLayout&&this.element.setStyle({zoom:1});var b=Object.extend({from:this.element.getOpacity()||0,to:1},arguments[1]||{});this.start(b)},update:function(a){this.element.setOpacity(a)}}),Effect.Move=Class.create(Effect.Base,{initialize:function(a){this.element=$(a);if(!this.element)throw Effect._elementDoesNotExistError;var b=Object.extend({x:0,y:0,mode:"relative"},arguments[1]||{});this.start(b)},setup:function(){this.element.makePositioned(),this.originalLeft=parseFloat(this.element.getStyle("left")||"0"),this.originalTop=parseFloat(this.element.getStyle("top")||"0"),this.options.mode=="absolute"&&(this.options.x=this.options.x-this.originalLeft,this.options.y=this.options.y-this.originalTop)},update:function(a){this.element.setStyle({left:(this.options.x*a+this.originalLeft).round()+"px",top:(this.options.y*a+this.originalTop).round()+"px"})}}),Effect.MoveBy=function(a,b,c){return new Effect.Move(a,Object.extend({x:c,y:b},arguments[3]||{}))},Effect.Scale=Class.create(Effect.Base,{initialize:function(a,b){this.element=$(a);if(!this.element)throw Effect._elementDoesNotExistError;var c=Object.extend({scaleX:!0,scaleY:!0,scaleContent:!0,scaleFromCenter:!1,scaleMode:"box",scaleFrom:100,scaleTo:b},arguments[2]||{});this.start(c)},setup:function(){this.restoreAfterFinish=this.options.restoreAfterFinish||!1,this.elementPositioning=this.element.getStyle("position"),this.originalStyle={},["top","left","width","height","fontSize"].each(function(a){this.originalStyle[a]=this.element.style[a]}.bind(this)),this.originalTop=this.element.offsetTop,this.originalLeft=this.element.offsetLeft;var a=this.element.getStyle("font-size")||"100%";["em","px","%","pt"].each(function(b){a.indexOf(b)>0&&(this.fontSize=parseFloat(a),this.fontSizeType=b)}.bind(this)),this.factor=(this.options.scaleTo-this.options.scaleFrom)/100,this.dims=null,this.options.scaleMode=="box"&&(this.dims=[this.element.offsetHeight,this.element.offsetWidth]),/^content/.test(this.options.scaleMode)&&(this.dims=[this.element.scrollHeight,this.element.scrollWidth]),this.dims||(this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth])},update:function(a){var b=this.options.scaleFrom/100+this.factor*a;this.options.scaleContent&&this.fontSize&&this.element.setStyle({fontSize:this.fontSize*b+this.fontSizeType}),this.setDimensions(this.dims[0]*b,this.dims[1]*b)},finish:function(a){this.restoreAfterFinish&&this.element.setStyle(this.originalStyle)},setDimensions:function(a,b){var c={};this.options.scaleX&&(c.width=b.round()+"px"),this.options.scaleY&&(c.height=a.round()+"px");if(this.options.scaleFromCenter){var d=(a-this.dims[0])/2,e=(b-this.dims[1])/2;this.elementPositioning=="absolute"?(this.options.scaleY&&(c.top=this.originalTop-d+"px"),this.options.scaleX&&(c.left=this.originalLeft-e+"px")):(this.options.scaleY&&(c.top=-d+"px"),this.options.scaleX&&(c.left=-e+"px"))}this.element.setStyle(c)}}),Effect.Highlight=Class.create(Effect.Base,{initialize:function(a){this.element=$(a);if(!this.element)throw Effect._elementDoesNotExistError;var b=Object.extend({startcolor:"#ffff99"},arguments[1]||{});this.start(b)},setup:function(){this.element.getStyle("display")=="none"?this.cancel():(this.oldStyle={},this.options.keepBackgroundImage||(this.oldStyle.backgroundImage=this.element.getStyle("background-image"),this.element.setStyle({backgroundImage:"none"})),this.options.endcolor||(this.options.endcolor=this.element.getStyle("background-color").parseColor("#ffffff")),this.options.restorecolor||(this.options.restorecolor=this.element.getStyle("background-color")),this._base=$R(0,2).map(function(a){return parseInt(this.options.startcolor.slice(a*2+1,a*2+3),16)}.bind(this)),this._delta=$R(0,2).map(function(a){return parseInt(this.options.endcolor.slice(a*2+1,a*2+3),16)-this._base[a]}.bind(this)))},update:function(a){this.element.setStyle({backgroundColor:$R(0,2).inject("#",function(b,c,d){return b+(this._base[d]+this._delta[d]*a).round().toColorPart()}.bind(this))})},finish:function(){this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}))}}),Effect.ScrollTo=function(a){var b=arguments[1]||{},c=document.viewport.getScrollOffsets(),d=$(a).cumulativeOffset();b.offset&&(d[1]+=b.offset);return new Effect.Tween(null,c.top,d[1],b,function(a){scrollTo(c.left,a.round())})},Effect.Fade=function(a){a=$(a);var b=a.getInlineOpacity(),c=Object.extend({from:a.getOpacity()||1,to:0,afterFinishInternal:function(a){a.options.to==0&&a.element.hide().setStyle({opacity:b})}},arguments[1]||{});return new Effect.Opacity(a,c)},Effect.Appear=function(a){a=$(a);var b=Object.extend({from:a.getStyle("display")=="none"?0:a.getOpacity()||0,to:1,afterFinishInternal:function(a){a.element.forceRerendering()},beforeSetup:function(a){a.element.setOpacity(a.options.from).show()}},arguments[1]||{});return new Effect.Opacity(a,b)},Effect.Puff=function(a){a=$(a);var b={opacity:a.getInlineOpacity(),position:a.getStyle("position"),top:a.style.top,left:a.style.left,width:a.style.width,height:a.style.height};return new Effect.Parallel([new Effect.Scale(a,200,{sync:!0,scaleFromCenter:!0,scaleContent:!0,restoreAfterFinish:!0}),new Effect.Opacity(a,{sync:!0,to:0})],Object.extend({duration:1,beforeSetupInternal:function(a){Position.absolutize(a.effects[0].element)},afterFinishInternal:function(a){a.effects[0].element.hide().setStyle(b)}},arguments[1]||{}))},Effect.BlindUp=function(a){a=$(a),a.makeClipping();return new Effect.Scale(a,0,Object.extend({scaleContent:!1,scaleX:!1,restoreAfterFinish:!0,afterFinishInternal:function(a){a.element.hide().undoClipping()}},arguments[1]||{}))},Effect.BlindDown=function(a){a=$(a);var b=a.getDimensions();return new Effect.Scale(a,100,Object.extend({scaleContent:!1,scaleX:!1,scaleFrom:0,scaleMode:{originalHeight:b.height,originalWidth:b.width},restoreAfterFinish:!0,afterSetup:function(a){a.element.makeClipping().setStyle({height:"0px"}).show()},afterFinishInternal:function(a){a.element.undoClipping()}},arguments[1]||{}))},Effect.SwitchOff=function(a){a=$(a);var b=a.getInlineOpacity();return new Effect.Appear(a,Object.extend({duration:.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(a){new Effect.Scale(a.element,1,{duration:.3,scaleFromCenter:!0,scaleX:!1,scaleContent:!1,restoreAfterFinish:!0,beforeSetup:function(a){a.element.makePositioned().makeClipping()},afterFinishInternal:function(a){a.element.hide().undoClipping().undoPositioned().setStyle({opacity:b})}})}},arguments[1]||{}))},Effect.DropOut=function(a){a=$(a);var b={top:a.getStyle("top"),left:a.getStyle("left"),opacity:a.getInlineOpacity()};return new Effect.Parallel([new Effect.Move(a,{x:0,y:100,sync:!0}),new Effect.Opacity(a,{sync:!0,to:0})],Object.extend({duration:.5,beforeSetup:function(a){a.effects[0].element.makePositioned()},afterFinishInternal:function(a){a.effects[0].element.hide().undoPositioned().setStyle(b)}},arguments[1]||{}))},Effect.Shake=function(a){a=$(a);var b=Object.extend({distance:20,duration:.5},arguments[1]||{}),c=parseFloat(b.distance),d=parseFloat(b.duration)/10,e={top:a.getStyle("top"),left:a.getStyle("left")};return new Effect.Move(a,{x:c,y:0,duration:d,afterFinishInternal:function(a){new Effect.Move(a.element,{x:-c*2,y:0,duration:d*2,afterFinishInternal:function(a){new Effect.Move(a.element,{x:c*2,y:0,duration:d*2,afterFinishInternal:function(a){new Effect.Move(a.element,{x:-c*2,y:0,duration:d*2,afterFinishInternal:function(a){new Effect.Move(a.element,{x:c*2,y:0,duration:d*2,afterFinishInternal:function(a){new Effect.Move(a.element,{x:-c,y:0,duration:d,afterFinishInternal:function(a){a.element.undoPositioned().setStyle(e)}})}})}})}})}})}})},Effect.SlideDown=function(a){a=$(a).cleanWhitespace();var b=a.down().getStyle("bottom"),c=a.getDimensions();return new Effect.Scale(a,100,Object.extend({scaleContent:!1,scaleX:!1,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:c.height,originalWidth:c.width},restoreAfterFinish:!0,afterSetup:function(a){a.element.makePositioned(),a.element.down().makePositioned(),window.opera&&a.element.setStyle({top:""}),a.element.makeClipping().setStyle({height:"0px"}).show()},afterUpdateInternal:function(a){a.element.down().setStyle({bottom:a.dims[0]-a.element.clientHeight+"px"})},afterFinishInternal:function(a){a.element.undoClipping().undoPositioned(),a.element.down().undoPositioned().setStyle({bottom:b})}},arguments[1]||{}))},Effect.SlideUp=function(a){a=$(a).cleanWhitespace();var b=a.down().getStyle("bottom"),c=a.getDimensions();return new Effect.Scale(a,window.opera?0:1,Object.extend({scaleContent:!1,scaleX:!1,scaleMode:"box",scaleFrom:100,scaleMode:{originalHeight:c.height,originalWidth:c.width},restoreAfterFinish:!0,afterSetup:function(a){a.element.makePositioned(),a.element.down().makePositioned(),window.opera&&a.element.setStyle({top:""}),a.element.makeClipping().show()},afterUpdateInternal:function(a){a.element.down().setStyle({bottom:a.dims[0]-a.element.clientHeight+"px"})},afterFinishInternal:function(a){a.element.hide().undoClipping().undoPositioned(),a.element.down().undoPositioned().setStyle({bottom:b})}},arguments[1]||{}))},Effect.Squish=function(a){return new Effect.Scale(a,window.opera?1:0,{restoreAfterFinish:!0,beforeSetup:function(a){a.element.makeClipping()},afterFinishInternal:function(a){a.element.hide().undoClipping()}})},Effect.Grow=function(a){a=$(a);var b=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{}),c={top:a.style.top,left:a.style.left,height:a.style.height,width:a.style.width,opacity:a.getInlineOpacity()},d=a.getDimensions(),e,f,g,h;switch(b.direction){case"top-left":e=f=g=h=0;break;case"top-right":e=d.width,f=h=0,g=-d.width;break;case"bottom-left":e=g=0,f=d.height,h=-d.height;break;case"bottom-right":e=d.width,f=d.height,g=-d.width,h=-d.height;break;case"center":e=d.width/2,f=d.height/2,g=-d.width/2,h=-d.height/2}return new Effect.Move(a,{x:e,y:f,duration:.01,beforeSetup:function(a){a.element.hide().makeClipping().makePositioned()},afterFinishInternal:function(a){new Effect.Parallel([new Effect.Opacity(a.element,{sync:!0,to:1,from:0,transition:b.opacityTransition}),new Effect.Move(a.element,{x:g,y:h,sync:!0,transition:b.moveTransition}),new Effect.Scale(a.element,100,{scaleMode:{originalHeight:d.height,originalWidth:d.width},sync:!0,scaleFrom:window.opera?1:0,transition:b.scaleTransition,restoreAfterFinish:!0})],Object.extend({beforeSetup:function(a){a.effects[0].element.setStyle({height:"0px"}).show()},afterFinishInternal:function(a){a.effects[0].element.undoClipping().undoPositioned().setStyle(c)}},b))}})},Effect.Shrink=function(a){a=$(a);var b=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{}),c={top:a.style.top,left:a.style.left,height:a.style.height,width:a.style.width,opacity:a.getInlineOpacity()},d=a.getDimensions(),e,f;switch(b.direction){case"top-left":e=f=0;break;case"top-right":e=d.width,f=0;break;case"bottom-left":e=0,f=d.height;break;case"bottom-right":e=d.width,f=d.height;break;case"center":e=d.width/2,f=d.height/2}return new Effect.Parallel([new Effect.Opacity(a,{sync:!0,to:0,from:1,transition:b.opacityTransition}),new Effect.Scale(a,window.opera?1:0,{sync:!0,transition:b.scaleTransition,restoreAfterFinish:!0}),new Effect.Move(a,{x:e,y:f,sync:!0,transition:b.moveTransition})],Object.extend({beforeStartInternal:function(a){a.effects[0].element.makePositioned().makeClipping()},afterFinishInternal:function(a){a.effects[0].element.hide().undoClipping().undoPositioned().setStyle(c)}},b))},Effect.Pulsate=function(a){a=$(a);var b=arguments[1]||{},c=a.getInlineOpacity(),d=b.transition||Effect.Transitions.linear,e=function(a){return 1-d(-Math.cos(a*(b.pulses||5)*2*Math.PI)/2+.5)};return new Effect.Opacity(a,Object.extend(Object.extend({duration:2,from:0,afterFinishInternal:function(a){a.element.setStyle({opacity:c})}},b),{transition:e}))},Effect.Fold=function(a){a=$(a);var b={top:a.style.top,left:a.style.left,width:a.style.width,height:a.style.height};a.makeClipping();return new Effect.Scale(a,5,Object.extend({scaleContent:!1,scaleX:!1,afterFinishInternal:function(c){new Effect.Scale(a,1,{scaleContent:!1,scaleY:!1,afterFinishInternal:function(a){a.element.hide().undoClipping().setStyle(b)}})}},arguments[1]||{}))},Effect.Morph=Class.create(Effect.Base,{initialize:function(a){this.element=$(a);if(!this.element)throw Effect._elementDoesNotExistError;var b=Object.extend({style:{}},arguments[1]||{});if(!Object.isString(b.style))this.style=$H(b.style);else if(b.style.include(":"))this.style=b.style.parseStyle();else{this.element.addClassName(b.style),this.style=$H(this.element.getStyles()),this.element.removeClassName(b.style);var c=this.element.getStyles();this.style=this.style.reject(function(a){return a.value==c[a.key]}),b.afterFinishInternal=function(a){a.element.addClassName(a.options.style),a.transforms.each(function(b){a.element.style[b.style]=""})}}this.start(b)},setup:function(){function a(a){if(!a||["rgba(0, 0, 0, 0)","transparent"].include(a))a="#ffffff";a=a.parseColor();return $R(0,2).map(function(b){return parseInt(a.slice(b*2+1,b*2+3),16)})}this.transforms=this.style.map(function(b){var c=b[0],d=b[1],e=null;if(d.parseColor("#zzzzzz")!="#zzzzzz")d=d.parseColor(),e="color";else if(c=="opacity")d=parseFloat(d),Prototype.Browser.IE&&!this.element.currentStyle.hasLayout&&this.element.setStyle({zoom:1});else if(Element.CSS_LENGTH.test(d)){var f=d.match(/^([\+\-]?[0-9\.]+)(.*)$/);d=parseFloat(f[1]),e=f.length==3?f[2]:null}var g=this.element.getStyle(c);return{style:c.camelize(),originalValue:e=="color"?a(g):parseFloat(g||0),targetValue:e=="color"?a(d):d,unit:e}}.bind(this)).reject(function(a){return a.originalValue==a.targetValue||a.unit!="color"&&(isNaN(a.originalValue)||isNaN(a.targetValue))})},update:function(a){var b={},c,d=this.transforms.length;while(d--)b[(c=this.transforms[d]).style]=c.unit=="color"?"#"+Math.round(c.originalValue[0]+(c.targetValue[0]-c.originalValue[0])*a).toColorPart()+Math.round(c.originalValue[1]+(c.targetValue[1]-c.originalValue[1])*a).toColorPart()+Math.round(c.originalValue[2]+(c.targetValue[2]-c.originalValue[2])*a).toColorPart():(c.originalValue+(c.targetValue-c.originalValue)*a).toFixed(3)+(c.unit===null?"":c.unit);this.element.setStyle(b,!0)}}),Effect.Transform=Class.create({initialize:function(a){this.tracks=[],this.options=arguments[1]||{},this.addTracks(a)},addTracks:function(a){a.each(function(a){a=$H(a);var b=a.values().first();this.tracks.push($H({ids:a.keys().first(),effect:Effect.Morph,options:{style:b}}))}.bind(this));return this},play:function(){return new Effect.Parallel(this.tracks.map(function(a){var b=a.get("ids"),c=a.get("effect"),d=a.get("options"),e=[$(b)||$$(b)].flatten();return e.map(function(a){return new c(a,Object.extend({sync:!0},d))})}).flatten(),this.options)}}),Element.CSS_PROPERTIES=$w("backgroundColor backgroundPosition borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderSpacing borderTopColor borderTopStyle borderTopWidth bottom clip color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop markerOffset maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex"),Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/,String.__parseStyleElement=document.createElement("div"),String.prototype.parseStyle=function(){var a,b=$H();Prototype.Browser.WebKit?a=(new Element("div",{style:this})).style:(String.__parseStyleElement.innerHTML='<div style="'+this+'"></div>',a=String.__parseStyleElement.childNodes[0].style),Element.CSS_PROPERTIES.each(function(c){a[c]&&b.set(c,a[c])}),Prototype.Browser.IE&&this.include("opacity")&&b.set("opacity",this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);return b},document.defaultView&&document.defaultView.getComputedStyle?Element.getStyles=function(a){var b=document.defaultView.getComputedStyle($(a),null);return Element.CSS_PROPERTIES.inject({},function(a,c){a[c]=b[c];return a})}:Element.getStyles=function(a){a=$(a);var b=a.currentStyle,c;c=Element.CSS_PROPERTIES.inject({},function(a,c){a[c]=b[c];return a}),c.opacity||(c.opacity=a.getOpacity());return c},Effect.Methods={morph:function(a,b){a=$(a),new Effect.Morph(a,Object.extend({style:b},arguments[2]||{}));return a},visualEffect:function(a,b,c){a=$(a);var d=b.dasherize().camelize(),e=d.charAt(0).toUpperCase()+d.substring(1);new Effect[e](a,c);return a},highlight:function(a,b){a=$(a),new Effect.Highlight(a,b);return a}},$w("fade appear grow shrink fold blindUp blindDown slideUp slideDown pulsate shake puff squish switchOff dropOut").each(function(a){Effect.Methods[a]=function(b,c){b=$(b),Effect[a.charAt(0).toUpperCase()+a.substring(1)](b,c);return b}}),$w("getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles").each(function(a){Effect.Methods[a]=Element[a]}),Element.addMethods(Effect.Methods)