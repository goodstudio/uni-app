"use strict";var t=require("fs"),e=require("path"),n=require("debug"),s=require("jsonc-parser"),i=require("licia/isRelative"),o=require("ws"),r=require("events"),a=require("licia/uuid"),c=require("licia/stringify"),p=require("licia/dateFormat"),l=require("licia/waitUntil"),u=require("licia/fs"),h=require("licia/isFn"),d=require("licia/trim"),m=require("licia/isStr"),g=require("licia/startWith"),y=require("licia/isNum"),v=require("licia/sleep"),f=require("licia/isUndef"),w=require("address"),P=require("default-gateway"),M=require("licia/getPort"),k=require("qrcode-terminal"),E=require("child_process"),I=require("licia/toStr");function b(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var C=b(t),T=b(e),N=b(n),D=b(i),A=b(o),S=b(a),j=b(c),R=b(p),U=b(l),_=b(u),x=b(h),q=b(d),O=b(m),$=b(g),F=b(y),L=b(v),H=b(f),B=b(w),J=b(P),X=b(M),W=b(k),V=b(I);class G extends r.EventEmitter{constructor(t){super(),this.ws=t,this.ws.addEventListener("message",(t=>{this.emit("message",t.data)})),this.ws.addEventListener("close",(()=>{this.emit("close")}))}send(t){this.ws.send(t)}close(){this.ws.close()}}const z="Connection closed";class Y extends r.EventEmitter{constructor(t,e,n){super(),this.puppet=e,this.namespace=n,this.callbacks=new Map,this.transport=t,this.debug=N.default("automator:protocol:"+this.namespace),this.onMessage=t=>{this.debug(`${R.default("yyyy-mm-dd HH:MM:ss:l")} ◀ RECV ${t}`);const{id:e,method:n,error:s,result:i,params:o}=JSON.parse(t);if(!e)return this.puppet.emit(n,o);const{callbacks:r}=this;if(e&&r.has(e)){const t=r.get(e);r.delete(e),s?t.reject(Error(s.message)):t.resolve(i)}},this.onClose=()=>{this.callbacks.forEach((t=>{t.reject(Error(z))}))},this.transport.on("message",this.onMessage),this.transport.on("close",this.onClose)}send(t,e={},n=!0){if(n&&this.puppet.adapter.has(t))return this.puppet.adapter.send(this,t,e);const s=S.default(),i=j.default({id:s,method:t,params:e});return this.debug(`${R.default("yyyy-mm-dd HH:MM:ss:l")} SEND ► ${i}`),new Promise(((t,e)=>{try{this.transport.send(i)}catch(t){e(Error(z))}this.callbacks.set(s,{resolve:t,reject:e})}))}dispose(){this.transport.close()}static createDevtoolConnection(t,e){return new Promise(((n,s)=>{const i=new A.default(t);i.addEventListener("open",(()=>{n(new Y(new G(i),e,"devtool"))})),i.addEventListener("error",s)}))}static createRuntimeConnection(t,e,n){return new Promise(((s,i)=>{N.default("automator:runtime")(`${R.default("yyyy-mm-dd HH:MM:ss:l")} port=${t}`);const o=new A.default.Server({port:t});U.default((async()=>{if(e.runtimeConnection)return!0}),n,1e3).catch((()=>{o.close(),i("Failed to connect to runtime, please make sure the project is running")})),o.on("connection",(function(t){N.default("automator:runtime")(`${R.default("yyyy-mm-dd HH:MM:ss:l")} connected`);const n=new Y(new G(t),e,"runtime");e.setRuntimeConnection(n),s(n)})),e.setRuntimeServer(o)}))}}async function K(t,e){const[n,s]=function(t){return O.default(t)?[!0,[t]]:[!1,t]}(e),i=await t(s);return n?i[0]:i}function Q(t){try{return require(t)}catch(e){return require(require.resolve(t,{paths:[process.cwd()]}))}}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function Z(t,e,n,s){var i,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,n):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,s);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(r=(o<3?i(r):o>3?i(e,n,r):i(e,n))||r);return o>3&&r&&Object.defineProperty(e,n,r),r}var tt;function et(t,e){const n=e.value;return e.value=async function(e){return(await(null==n?void 0:n.call(this,e)))(t)},e}function nt(t,e,n){return et(tt.RUNTIME,n)}function st(t,e,n){return et(tt.DEVTOOL,n)}/^win/.test(process.platform),function(t){t.RUNTIME="runtime",t.DEVTOOL="devtool"}(tt||(tt={}));class it{constructor(t){this.puppet=t}invoke(t,e){return async n=>this.puppet.devtoolConnection?(n===tt.DEVTOOL?this.puppet.devtoolConnection:this.puppet.runtimeConnection).send(t,e):this.puppet.runtimeConnection.send(t,e)}on(t,e){this.puppet.on(t,e)}}class ot extends it{constructor(t,e){super(t),this.id=e.elementId,this.pageId=e.pageId,this.nodeId=e.nodeId,this.videoId=e.videoId}async getData(t){return this.invokeMethod("Element.getData",t)}async setData(t){return this.invokeMethod("Element.setData",t)}async callMethod(t){return this.invokeMethod("Element.callMethod",t)}async getElement(t){return this.invokeMethod("Element.getElement",t)}async getElements(t){return this.invokeMethod("Element.getElements",t)}async getOffset(){return this.invokeMethod("Element.getOffset")}async getHTML(t){return this.invokeMethod("Element.getHTML",t)}async getAttributes(t){return this.invokeMethod("Element.getAttributes",t)}async getStyles(t){return this.invokeMethod("Element.getStyles",t)}async getDOMProperties(t){return this.invokeMethod("Element.getDOMProperties",t)}async getProperties(t){return this.invokeMethod("Element.getProperties",t)}async tap(){return this.invokeMethod("Element.tap")}async longpress(){return this.invokeMethod("Element.longpress")}async touchstart(t){return this.invokeMethod("Element.touchstart",t)}async touchmove(t){return this.invokeMethod("Element.touchmove",t)}async touchend(t){return this.invokeMethod("Element.touchend",t)}async triggerEvent(t){return this.invokeMethod("Element.triggerEvent",t)}async callFunction(t){return this.invokeMethod("Element.callFunction",t)}async callContextMethod(t){return this.invokeMethod("Element.callContextMethod",t)}invokeMethod(t,e={}){return e.elementId=this.id,e.pageId=this.pageId,this.nodeId&&(e.nodeId=this.nodeId),this.videoId&&(e.videoId=this.videoId),this.invoke(t,e)}}Z([nt],ot.prototype,"getData",null),Z([nt],ot.prototype,"setData",null),Z([nt],ot.prototype,"callMethod",null),Z([st],ot.prototype,"getElement",null),Z([st],ot.prototype,"getElements",null),Z([st],ot.prototype,"getOffset",null),Z([st],ot.prototype,"getHTML",null),Z([st],ot.prototype,"getAttributes",null),Z([st],ot.prototype,"getStyles",null),Z([st],ot.prototype,"getDOMProperties",null),Z([st],ot.prototype,"getProperties",null),Z([st],ot.prototype,"tap",null),Z([st],ot.prototype,"longpress",null),Z([st],ot.prototype,"touchstart",null),Z([st],ot.prototype,"touchmove",null),Z([st],ot.prototype,"touchend",null),Z([st],ot.prototype,"triggerEvent",null),Z([st],ot.prototype,"callFunction",null),Z([st],ot.prototype,"callContextMethod",null);const rt=require("util");class at{constructor(t,e,n){this.puppet=t,this.id=e.elementId,this.pageId=e.pageId,this.nodeId=e.nodeId||null,this.videoId=e.videoId||null,this.tagName=e.tagName,this.nvue=e.nvue,this.elementMap=n,"body"!==this.tagName&&"page-body"!==this.tagName||(this.tagName="page"),this.api=new ot(t,e)}toJSON(){return JSON.stringify({id:this.id,tagName:this.tagName,pageId:this.pageId,nodeId:this.nodeId,videoId:this.videoId})}toString(){return this.toJSON()}[rt.inspect.custom](){return this.toJSON()}async $(t){try{const e=await this.api.getElement({selector:t});return at.create(this.puppet,Object.assign({},e,{pageId:this.pageId}),this.elementMap)}catch(t){return null}}async $$(t){const{elements:e}=await this.api.getElements({selector:t});return e.map((t=>at.create(this.puppet,Object.assign({},t,{pageId:this.pageId}),this.elementMap)))}async size(){const[t,e]=await this.domProperty(["offsetWidth","offsetHeight"]);return{width:t,height:e}}async offset(){const{left:t,top:e}=await this.api.getOffset();return{left:t,top:e}}async text(){return this.domProperty("innerText")}async attribute(t){if(!O.default(t))throw Error("name must be a string");return(await this.api.getAttributes({names:[t]})).attributes[0]}async value(){return this.property("value")}async property(t){if(!O.default(t))throw Error("name must be a string");if(this.puppet.checkProperty){let e=this.publicProps;if(e||(this.publicProps=e=await this._property("__propPublic")),!e[t])throw Error(`${this.tagName}.${t} not exists`)}return this._property(t)}async html(){return(await this.api.getHTML({type:"inner"})).html}async outerHtml(){return(await this.api.getHTML({type:"outer"})).html}async style(t){if(!O.default(t))throw Error("name must be a string");return(await this.api.getStyles({names:[t]})).styles[0]}async tap(){return this.api.tap()}async longpress(){return this.nvue?this.api.longpress():(await this.touchstart(),await L.default(350),this.touchend())}async trigger(t,e){const n={type:t};return H.default(e)||(n.detail=e),this.api.triggerEvent(n)}async touchstart(t){return this.api.touchstart(t)}async touchmove(t){return this.api.touchmove(t)}async touchend(t){return this.api.touchend(t)}async domProperty(t){return K((async t=>(await this.api.getDOMProperties({names:t})).properties),t)}_property(t){return K((async t=>(await this.api.getProperties({names:t})).properties),t)}send(t,e){return e.elementId=this.id,e.pageId=this.pageId,this.nodeId&&(e.nodeId=this.nodeId),this.videoId&&(e.videoId=this.videoId),this.puppet.send(t,e)}async callFunction(t,...e){return(await this.api.callFunction({functionName:t,args:e})).result}static create(t,e,n){let s,i=n.get(e.elementId);if(i)return i;if(e.nodeId)s=ct;else switch(e.tagName){case"input":s=pt;break;case"textarea":s=lt;break;case"scroll-view":s=ut;break;case"swiper":s=ht;break;case"movable-view":s=dt;break;case"switch":s=mt;break;case"slider":s=gt;break;case"video":s=yt;break;default:s=at}return i=new s(t,e,n),n.set(e.elementId,i),i}}class ct extends at{async setData(t){return this.api.setData({data:t})}async data(t){const e={};return t&&(e.path=t),(await this.api.getData(e)).data}async callMethod(t,...e){return(await this.api.callMethod({method:t,args:e})).result}}class pt extends at{async input(t){return this.callFunction("input.input",t)}}class lt extends at{async input(t){return this.callFunction("textarea.input",t)}}class ut extends at{async scrollTo(t,e){return this.callFunction("scroll-view.scrollTo",t,e)}async property(t){return"scrollTop"===t?this.callFunction("scroll-view.scrollTop"):"scrollLeft"===t?this.callFunction("scroll-view.scrollLeft"):super.property(t)}async scrollWidth(){return this.callFunction("scroll-view.scrollWidth")}async scrollHeight(){return this.callFunction("scroll-view.scrollHeight")}}class ht extends at{async swipeTo(t){return this.callFunction("swiper.swipeTo",t)}}class dt extends at{async moveTo(t,e){return this.callFunction("movable-view.moveTo",t,e)}async property(t){return"x"===t?this._property("_translateX"):"y"===t?this._property("_translateY"):super.property(t)}}class mt extends at{async tap(){return this.callFunction("switch.tap")}}class gt extends at{async slideTo(t){return this.callFunction("slider.slideTo",t)}}class yt extends at{async callContextMethod(t,...e){return await this.api.callContextMethod({method:t,args:e})}}class vt extends it{constructor(t,e){super(t),this.id=e.id}async getData(t){return this.invokeMethod("Page.getData",t)}async setData(t){return this.invokeMethod("Page.setData",t)}async callMethod(t){return this.invokeMethod("Page.callMethod",t)}async getElement(t){return this.invokeMethod("Page.getElement",t)}async getElements(t){return this.invokeMethod("Page.getElements",t)}async getWindowProperties(t){return this.invokeMethod("Page.getWindowProperties",t)}invokeMethod(t,e={}){return e.pageId=this.id,this.invoke(t,e)}}Z([nt],vt.prototype,"getData",null),Z([nt],vt.prototype,"setData",null),Z([nt],vt.prototype,"callMethod",null),Z([st],vt.prototype,"getElement",null),Z([st],vt.prototype,"getElements",null),Z([st],vt.prototype,"getWindowProperties",null);const ft=require("util");class wt{constructor(t,e){this.puppet=t,this.id=e.id,this.path=e.path,this.query=e.query,this.elementMap=new Map,this.api=new vt(t,e)}toJSON(){return JSON.stringify({id:this.id,path:this.path,query:this.query})}toString(){return this.toJSON()}[ft.inspect.custom](){return this.toJSON()}async waitFor(t){return F.default(t)?await L.default(t):x.default(t)?U.default(t):O.default(t)?U.default((async()=>(await this.$$(t)).length>0)):void 0}async $(t){try{const e=await this.api.getElement({selector:t});return at.create(this.puppet,Object.assign({selector:t},e,{pageId:this.id}),this.elementMap)}catch(t){return null}}async $$(t){const{elements:e}=await this.api.getElements({selector:t});return e.map((e=>at.create(this.puppet,Object.assign({selector:t},e,{pageId:this.id}),this.elementMap)))}async data(t){const e={};return t&&(e.path=t),(await this.api.getData(e)).data}async setData(t){return this.api.setData({data:t})}async size(){const[t,e]=await this.windowProperty(["document.documentElement.scrollWidth","document.documentElement.scrollHeight"]);return{width:t,height:e}}async callMethod(t,...e){return(await this.api.callMethod({method:t,args:e})).result}async scrollTop(){return this.windowProperty("document.documentElement.scrollTop")}async windowProperty(t){const e=O.default(t);e&&(t=[t]);const{properties:n}=await this.api.getWindowProperties({names:t});return e?n[0]:n}static create(t,e,n){let s=n.get(e.id);return s?(s.query=e.query,s):(s=new wt(t,e),n.set(e.id,s),s)}}class Pt extends it{async getPageStack(){return this.invoke("App.getPageStack")}async callUniMethod(t){return this.invoke("App.callUniMethod",t)}async getCurrentPage(){return this.invoke("App.getCurrentPage")}async mockUniMethod(t){return this.invoke("App.mockUniMethod",t)}async captureScreenshotByRuntime(t){return this.invoke("App.captureScreenshot",t)}async callFunction(t){return this.invoke("App.callFunction",t)}async captureScreenshot(t){return this.invoke("App.captureScreenshot",t)}async exit(){return this.invoke("App.exit")}async addBinding(t){return this.invoke("App.addBinding",t)}async enableLog(){return this.invoke("App.enableLog")}onLogAdded(t){return this.on("App.logAdded",t)}onBindingCalled(t){return this.on("App.bindingCalled",t)}onExceptionThrown(t){return this.on("App.exceptionThrown",t)}}Z([nt],Pt.prototype,"getPageStack",null),Z([nt],Pt.prototype,"callUniMethod",null),Z([nt],Pt.prototype,"getCurrentPage",null),Z([nt],Pt.prototype,"mockUniMethod",null),Z([nt],Pt.prototype,"captureScreenshotByRuntime",null),Z([st],Pt.prototype,"callFunction",null),Z([st],Pt.prototype,"captureScreenshot",null),Z([st],Pt.prototype,"exit",null),Z([st],Pt.prototype,"addBinding",null),Z([st],Pt.prototype,"enableLog",null);class Mt extends it{async getInfo(){return this.invoke("Tool.getInfo")}async enableRemoteDebug(t){return this.invoke("Tool.enableRemoteDebug")}async close(){return this.invoke("Tool.close")}async getTestAccounts(){return this.invoke("Tool.getTestAccounts")}onRemoteDebugConnected(t){this.puppet.once("Tool.onRemoteDebugConnected",t),this.puppet.once("Tool.onPreviewConnected",t)}}function kt(t){return new Promise((e=>setTimeout(e,t)))}Z([st],Mt.prototype,"getInfo",null),Z([st],Mt.prototype,"enableRemoteDebug",null),Z([st],Mt.prototype,"close",null),Z([st],Mt.prototype,"getTestAccounts",null);class Et extends r.EventEmitter{constructor(t,e){super(),this.puppet=t,this.options=e,this.pageMap=new Map,this.appBindings=new Map,this.appApi=new Pt(t),this.toolApi=new Mt(t),this.appApi.onLogAdded((t=>{this.emit("console",t)})),this.appApi.onBindingCalled((({name:t,args:e})=>{try{const n=this.appBindings.get(t);n&&n(...e)}catch(t){}})),this.appApi.onExceptionThrown((t=>{this.emit("exception",t)}))}async pageStack(){return(await this.appApi.getPageStack()).pageStack.map((t=>wt.create(this.puppet,t,this.pageMap)))}async navigateTo(t){return this.changeRoute("navigateTo",t)}async redirectTo(t){return this.changeRoute("redirectTo",t)}async navigateBack(){return this.changeRoute("navigateBack")}async reLaunch(t){return this.changeRoute("reLaunch",t)}async switchTab(t){return this.changeRoute("switchTab",t)}async currentPage(){const{id:t,path:e,query:n}=await this.appApi.getCurrentPage();return wt.create(this.puppet,{id:t,path:e,query:n},this.pageMap)}async systemInfo(){return this.callUniMethod("getSystemInfoSync")}async callUniMethod(t,...e){return(await this.appApi.callUniMethod({method:t,args:e})).result}async mockUniMethod(t,e,...n){return x.default(e)||(s=e,O.default(s)&&(s=q.default(s),$.default(s,"function")||$.default(s,"() =>")))?this.appApi.mockUniMethod({method:t,functionDeclaration:e.toString(),args:n}):this.appApi.mockUniMethod({method:t,result:e});var s}async restoreUniMethod(t){return this.appApi.mockUniMethod({method:t})}async evaluate(t,...e){return(await this.appApi.callFunction({functionDeclaration:t.toString(),args:e})).result}async pageScrollTo(t){await this.callUniMethod("pageScrollTo",{scrollTop:t,duration:0})}async close(){try{await this.appApi.exit()}catch(t){}await kt(1e3),this.puppet.disposeRuntimeServer(),await this.toolApi.close(),this.disconnect()}async teardown(){return this["disconnect"===this.options.teardown?"disconnect":"close"]()}async remote(t){if(!this.puppet.devtools.remote)return console.warn(`Failed to enable remote, ${this.puppet.devtools.name} is unimplemented`);const{qrCode:e}=await this.toolApi.enableRemoteDebug({auto:t});var n;e&&await(n=e,new Promise((t=>{W.default.generate(n,{small:!0},(e=>{process.stdout.write(e),t(void 0)}))})));const s=new Promise((t=>{this.toolApi.onRemoteDebugConnected((async()=>{await kt(1e3),t(void 0)}))})),i=new Promise((t=>{this.puppet.setRemoteRuntimeConnectionCallback((()=>{t(void 0)}))}));return Promise.all([s,i])}disconnect(){this.puppet.dispose()}on(t,e){return"console"===t&&this.appApi.enableLog(),super.on(t,e),this}async exposeFunction(t,e){if(this.appBindings.has(t))throw Error(`Failed to expose function with name ${t}: already exists!`);this.appBindings.set(t,e),await this.appApi.addBinding({name:t})}async checkVersion(){}async screenshot(t){const e=this.puppet.isX?"captureScreenshotByRuntime":"captureScreenshot",{data:n}=await this.appApi[e]({fullPage:null==t?void 0:t.fullPage});if(!(null==t?void 0:t.path))return n;await _.default.writeFile(t.path,n,"base64")}async testAccounts(){return(await this.toolApi.getTestAccounts()).accounts}async changeRoute(t,e){return await this.callUniMethod(t,{url:e}),await kt(3e3),this.currentPage()}}class It{constructor(t){this.options=t}has(t){return!!this.options[t]}send(t,e,n){const s=this.options[e];if(!s)return Promise.reject(Error(`adapter for ${e} not found`));const i=s.reflect;return i?(s.params&&(n=s.params(n)),"function"==typeof i?i(t.send.bind(t),n):(e=i,t.send(e,n))):Promise.reject(Error(`${e}'s reflect is required`))}}const bt=N.default("automator:puppet"),Ct=".automator.json";function Tt(t){try{return require(t)}catch(t){}}function Nt(t,e,n,s){const i=function(t,e,n){let s,i;return process.env.UNI_OUTPUT_DIR?(i=T.default.join(process.env.UNI_OUTPUT_DIR,`../.automator/${e}`,Ct),s=Tt(i)):(i=T.default.join(t,`dist/${n}/.automator/${e}`,Ct),s=Tt(i),s||(i=T.default.join(t,`unpackage/dist/${n}/.automator/${e}`,Ct),s=Tt(i))),bt(`${i}=>${JSON.stringify(s)}`),s}(t,n,s);if(!i||!i.wsEndpoint)return!1;const o=require("../package.json").version;if(i.version!==o)return bt(`unmet=>${i.version}!==${o}`),!1;const r=function(t){let e;try{const t=J.default.v4.sync();e=B.default.ip(t&&t.interface),e&&(/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(e)||(e=void 0))}catch(t){}return"ws://"+(e||"localhost")+":"+t}(e);return bt(`wsEndpoint=>${r}`),i.wsEndpoint===r}class Dt extends r.EventEmitter{constructor(t,e){if(super(),this.isX=!1,"true"===process.env.UNI_APP_X&&(this.isX=!0),e)this.target=e;else{if(this.target=null,"h5"===t)try{this.target=Q("@dcloudio/uni-h5/lib/h5/uni.automator.js")}catch(t){}this.target||(this.target=Q(`@dcloudio/uni-${"app"===t?"app-plus":t}/lib/uni.automator.js`))}if(!this.target)throw Error("puppet is not provided");this.platform=t,this.adapter=new It(this.target.adapter||{})}setCompiler(t){this.compiler=t}setRuntimeServer(t){this.wss=t}setRemoteRuntimeConnectionCallback(t){this.remoteRuntimeConnectionCallback=t}setRuntimeConnection(t){this.runtimeConnection=t,this.remoteRuntimeConnectionCallback&&(this.remoteRuntimeConnectionCallback(),this.remoteRuntimeConnectionCallback=null)}setDevtoolConnection(t){this.devtoolConnection=t}disposeRuntimeServer(){this.wss&&this.wss.close()}disposeRuntime(){this.runtimeConnection.dispose()}disposeDevtool(){this.compiler&&this.compiler.stop(),this.devtoolConnection&&this.devtoolConnection.dispose()}dispose(){this.disposeRuntime(),this.disposeDevtool(),this.disposeRuntimeServer()}send(t,e){return this.runtimeConnection.send(t,e)}validateProject(t){const e=this.target.devtools.required;return!e||!e.find((e=>!C.default.existsSync(T.default.join(t,e))))}validateDevtools(t){const e=this.target.devtools.validate;return e?e(t,this):Promise.resolve(t)}createDevtools(t,e,n){const s=this.target.devtools.create;return s?(e.timeout=n,s(t,e,this)):Promise.resolve()}shouldCompile(t,e,n,s){this.compiled=!0;const i=this.target.shouldCompile;return i?this.compiled=i(n,s):!0===n.compile?this.compiled=!0:this.compiled=!Nt(t,e,this.platform,this.mode),this.compiled}get checkProperty(){return"mp-weixin"===this.platform}get devtools(){return this.target.devtools}get mode(){const t=this.target.mode;return t||("production"===process.env.NODE_ENV?"build":"dev")}}const At=N.default("automator:compiler"),St=/The\s+(.*)\s+directory is ready/;class jt{constructor(t){this.puppet=t,this.puppet.setCompiler(this)}compile(t){const e=this.puppet.mode,n=this.puppet.platform;let s=t.silent;const i=t.port,o=t.host,r=`${e}:${n}`,a=t.projectPath,[c,p]=this.getSpawnArgs(t,r);p.push("--auto-port"),p.push(V.default(i)),o&&(p.push("--auto-host"),p.push(o));const l={cwd:t.cliPath,env:Object.assign(Object.assign({},process.env),{NODE_ENV:"build"===e?"production":"development"})};return new Promise(((t,i)=>{const o=i=>{const o=i.toString().trim();if(!s&&console.log(o),o.includes("- Network")||o.includes("> Network")||o.includes("➜  Network")){const e=o.match(/Network:(.*)/)[1].trim();At(`url: ${e}`),t({path:e})}else if(o.includes("DONE  Build complete")){const i=o.match(St);let r="";i&&i.length>1?r=T.default.join(a,i[1]):(r=T.default.join(a,`dist/${e}/${n}`),C.default.existsSync(r)||(r=T.default.join(a,`unpackage/dist/${e}/${n}`))),s=!0,this.stop(),t({path:r})}};At(`${c} ${p.join(" ")} %o`,l),this.cliProcess=E.spawn(c,p,l),this.cliProcess.on("error",(t=>{i(t)})),this.cliProcess.stdout.on("data",o),this.cliProcess.stderr.on("data",o)}))}stop(){this.cliProcess&&this.cliProcess.kill("SIGTERM")}getSpawnArgs(t,e){let n;const s=t.cliPath;try{n=require(T.default.join(s,"package.json"))}catch(t){}let i=!1;if(n&&(n.devDependencies&&n.devDependencies["@dcloudio/vite-plugin-uni"]&&(i=!0),!i&&n.dependencies&&n.dependencies["@dcloudio/vite-plugin-uni"]&&(i=!0),n.scripts&&n.scripts[e]))return[process.env.UNI_NPM_PATH||(/^win/.test(process.platform)?"npm.cmd":"npm"),["run",e,"--"]];if(["android","ios"].includes(process.env.UNI_OS_NAME)&&(process.env.UNI_APP_PLATFORM=process.env.UNI_OS_NAME),process.env.UNI_INPUT_DIR=t.projectPath,process.env.UNI_OUTPUT_DIR=T.default.join(t.projectPath,`unpackage/dist/${this.puppet.mode}/${this.puppet.platform}`),process.env.UNI_HBUILDERX_PLUGINS||C.default.existsSync(T.default.resolve(s,"../about"))&&(process.env.UNI_HBUILDERX_PLUGINS=T.default.dirname(s)),i){const t="app-plus"===this.puppet.platform?"app":this.puppet.platform;return process.env.UNI_PLATFORM=t,[process.env.UNI_NODE_PATH||"node",[require.resolve("@dcloudio/vite-plugin-uni/bin/uni.js",{paths:[s]}),"-p",t]]}return[process.env.UNI_NODE_PATH||"node",[T.default.join(s,"bin/uniapp-cli.js")]]}}class Rt{async launch(t){const{port:e,cliPath:n,timeout:s,projectPath:i}=await this.validate(t);let o={};o="app"===t.platform||"app-plus"===t.platform?"true"===process.env.UNI_APP_X?t["uni-app-x"]:t.app||t["app-plus"]:t[t.platform],o||(o={}),o.projectPath=i,this.puppet=new Dt(t.platform,o.puppet),o=await this.puppet.validateDevtools(o);let r=this.puppet.shouldCompile(i,e,t,o),a=process.env.UNI_OUTPUT_DIR||i;if(r||this.puppet.validateProject(a)||(a=T.default.join(i,"dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(a)||(a=T.default.join(i,"unpackage/dist/"+this.puppet.mode+"/"+this.puppet.platform),this.puppet.validateProject(a)||(r=!0))),r){this.puppet.compiled=t.compile=!0,this.compiler=new jt(this.puppet);const s=await this.compiler.compile({host:t.host,port:e,cliPath:n,projectPath:i,silent:!!t.silent});s.path&&(a=s.path)}const c=[];return c.push(this.createRuntimeConnection(e,s)),c.push(this.puppet.createDevtools(a,o,s)),new Promise(((t,n)=>{Promise.all(c).then((([n,s])=>{n&&this.puppet.setRuntimeConnection(n),s&&this.puppet.setDevtoolConnection(s),N.default("automator:program")("ready");const i=o.teardown||"disconnect";t(new Et(this.puppet,{teardown:i,port:e}))})).catch((t=>n(t)))}))}resolveCliPath(t){if(!t)return t;try{const{dependencies:e,devDependencies:n}=require(T.default.join(t,"package.json"));if(Ut(n)||Ut(e))return t}catch(t){}}resolveProjectPath(t,e){return t||(t=process.env.UNI_INPUT_DIR||process.cwd()),D.default(t)&&(t=T.default.resolve(t)),C.default.existsSync(t)||function(t){throw Error(t)}(`Project path ${t} doesn't exist`),t}async validate(t){const e=this.resolveProjectPath(t.projectPath,t);let n=process.env.UNI_CLI_PATH||t.cliPath;if(n=this.resolveCliPath(n||""),!n&&(n=this.resolveCliPath(process.cwd())),!n&&(n=this.resolveCliPath(e)),!n)throw Error("cliPath is not provided");if("false"!==process.env.UNI_APP_X){const t=this.getManifestJson(e);"uni-app-x"in t&&(process.env.UNI_APP_X="true",t.appid&&(process.env.UNI_APP_ID=t.appid))}return{port:await async function(t,e){const n=await X.default(t||e);if(t&&n!==t)throw Error(`Port ${t} is in use, please specify another port`);return n}(t.port||9520),cliPath:n,timeout:t.timeout||6e5,projectPath:e}}getManifestJson(t){if(t){const e=T.default.join(t,"manifest.json");if(C.default.existsSync(e))return s.parse(C.default.readFileSync(e,"utf8"))}return{}}async createRuntimeConnection(t,e){return Y.createRuntimeConnection(t,this.puppet,e)}}function Ut(t){return!!t&&!(!t["@dcloudio/vue-cli-plugin-uni"]&&!t["@dcloudio/vite-plugin-uni"])}module.exports=class{constructor(){this.launcher=new Rt}async launch(t){return this.launcher.launch(t)}};
