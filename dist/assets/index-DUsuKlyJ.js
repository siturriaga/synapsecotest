function YE(i,e){for(var t=0;t<e.length;t++){const s=e[t];if(typeof s!="string"&&!Array.isArray(s)){for(const o in s)if(o!=="default"&&!(o in i)){const u=Object.getOwnPropertyDescriptor(s,o);u&&Object.defineProperty(i,o,u.get?u:{enumerable:!0,get:()=>s[o]})}}}return Object.freeze(Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const u of o)if(u.type==="childList")for(const h of u.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const u={};return o.integrity&&(u.integrity=o.integrity),o.referrerPolicy&&(u.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?u.credentials="include":o.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(o){if(o.ep)return;o.ep=!0;const u=t(o);fetch(o.href,u)}})();function ZE(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Wh={exports:{}},Ta={},qh={exports:{}},Ae={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dm;function ew(){if(Dm)return Ae;Dm=1;var i=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),h=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),v=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),S=Symbol.iterator;function P(V){return V===null||typeof V!="object"?null:(V=S&&V[S]||V["@@iterator"],typeof V=="function"?V:null)}var j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},K=Object.assign,B={};function z(V,H,ae){this.props=V,this.context=H,this.refs=B,this.updater=ae||j}z.prototype.isReactComponent={},z.prototype.setState=function(V,H){if(typeof V!="object"&&typeof V!="function"&&V!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,V,H,"setState")},z.prototype.forceUpdate=function(V){this.updater.enqueueForceUpdate(this,V,"forceUpdate")};function ue(){}ue.prototype=z.prototype;function ce(V,H,ae){this.props=V,this.context=H,this.refs=B,this.updater=ae||j}var me=ce.prototype=new ue;me.constructor=ce,K(me,z.prototype),me.isPureReactComponent=!0;var we=Array.isArray,Ge=Object.prototype.hasOwnProperty,Re={current:null},D={key:!0,ref:!0,__self:!0,__source:!0};function I(V,H,ae){var Te,Se={},Ne=null,Me=null;if(H!=null)for(Te in H.ref!==void 0&&(Me=H.ref),H.key!==void 0&&(Ne=""+H.key),H)Ge.call(H,Te)&&!D.hasOwnProperty(Te)&&(Se[Te]=H[Te]);var be=arguments.length-2;if(be===1)Se.children=ae;else if(1<be){for(var Be=Array(be),yt=0;yt<be;yt++)Be[yt]=arguments[yt+2];Se.children=Be}if(V&&V.defaultProps)for(Te in be=V.defaultProps,be)Se[Te]===void 0&&(Se[Te]=be[Te]);return{$$typeof:i,type:V,key:Ne,ref:Me,props:Se,_owner:Re.current}}function R(V,H){return{$$typeof:i,type:V.type,key:H,ref:V.ref,props:V.props,_owner:V._owner}}function k(V){return typeof V=="object"&&V!==null&&V.$$typeof===i}function x(V){var H={"=":"=0",":":"=2"};return"$"+V.replace(/[=:]/g,function(ae){return H[ae]})}var O=/\/+/g;function A(V,H){return typeof V=="object"&&V!==null&&V.key!=null?x(""+V.key):H.toString(36)}function nt(V,H,ae,Te,Se){var Ne=typeof V;(Ne==="undefined"||Ne==="boolean")&&(V=null);var Me=!1;if(V===null)Me=!0;else switch(Ne){case"string":case"number":Me=!0;break;case"object":switch(V.$$typeof){case i:case e:Me=!0}}if(Me)return Me=V,Se=Se(Me),V=Te===""?"."+A(Me,0):Te,we(Se)?(ae="",V!=null&&(ae=V.replace(O,"$&/")+"/"),nt(Se,H,ae,"",function(yt){return yt})):Se!=null&&(k(Se)&&(Se=R(Se,ae+(!Se.key||Me&&Me.key===Se.key?"":(""+Se.key).replace(O,"$&/")+"/")+V)),H.push(Se)),1;if(Me=0,Te=Te===""?".":Te+":",we(V))for(var be=0;be<V.length;be++){Ne=V[be];var Be=Te+A(Ne,be);Me+=nt(Ne,H,ae,Be,Se)}else if(Be=P(V),typeof Be=="function")for(V=Be.call(V),be=0;!(Ne=V.next()).done;)Ne=Ne.value,Be=Te+A(Ne,be++),Me+=nt(Ne,H,ae,Be,Se);else if(Ne==="object")throw H=String(V),Error("Objects are not valid as a React child (found: "+(H==="[object Object]"?"object with keys {"+Object.keys(V).join(", ")+"}":H)+"). If you meant to render a collection of children, use an array instead.");return Me}function Dt(V,H,ae){if(V==null)return V;var Te=[],Se=0;return nt(V,Te,"","",function(Ne){return H.call(ae,Ne,Se++)}),Te}function xt(V){if(V._status===-1){var H=V._result;H=H(),H.then(function(ae){(V._status===0||V._status===-1)&&(V._status=1,V._result=ae)},function(ae){(V._status===0||V._status===-1)&&(V._status=2,V._result=ae)}),V._status===-1&&(V._status=0,V._result=H)}if(V._status===1)return V._result.default;throw V._result}var je={current:null},Z={transition:null},he={ReactCurrentDispatcher:je,ReactCurrentBatchConfig:Z,ReactCurrentOwner:Re};function ne(){throw Error("act(...) is not supported in production builds of React.")}return Ae.Children={map:Dt,forEach:function(V,H,ae){Dt(V,function(){H.apply(this,arguments)},ae)},count:function(V){var H=0;return Dt(V,function(){H++}),H},toArray:function(V){return Dt(V,function(H){return H})||[]},only:function(V){if(!k(V))throw Error("React.Children.only expected to receive a single React element child.");return V}},Ae.Component=z,Ae.Fragment=t,Ae.Profiler=o,Ae.PureComponent=ce,Ae.StrictMode=s,Ae.Suspense=g,Ae.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=he,Ae.act=ne,Ae.cloneElement=function(V,H,ae){if(V==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+V+".");var Te=K({},V.props),Se=V.key,Ne=V.ref,Me=V._owner;if(H!=null){if(H.ref!==void 0&&(Ne=H.ref,Me=Re.current),H.key!==void 0&&(Se=""+H.key),V.type&&V.type.defaultProps)var be=V.type.defaultProps;for(Be in H)Ge.call(H,Be)&&!D.hasOwnProperty(Be)&&(Te[Be]=H[Be]===void 0&&be!==void 0?be[Be]:H[Be])}var Be=arguments.length-2;if(Be===1)Te.children=ae;else if(1<Be){be=Array(Be);for(var yt=0;yt<Be;yt++)be[yt]=arguments[yt+2];Te.children=be}return{$$typeof:i,type:V.type,key:Se,ref:Ne,props:Te,_owner:Me}},Ae.createContext=function(V){return V={$$typeof:h,_currentValue:V,_currentValue2:V,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},V.Provider={$$typeof:u,_context:V},V.Consumer=V},Ae.createElement=I,Ae.createFactory=function(V){var H=I.bind(null,V);return H.type=V,H},Ae.createRef=function(){return{current:null}},Ae.forwardRef=function(V){return{$$typeof:m,render:V}},Ae.isValidElement=k,Ae.lazy=function(V){return{$$typeof:w,_payload:{_status:-1,_result:V},_init:xt}},Ae.memo=function(V,H){return{$$typeof:v,type:V,compare:H===void 0?null:H}},Ae.startTransition=function(V){var H=Z.transition;Z.transition={};try{V()}finally{Z.transition=H}},Ae.unstable_act=ne,Ae.useCallback=function(V,H){return je.current.useCallback(V,H)},Ae.useContext=function(V){return je.current.useContext(V)},Ae.useDebugValue=function(){},Ae.useDeferredValue=function(V){return je.current.useDeferredValue(V)},Ae.useEffect=function(V,H){return je.current.useEffect(V,H)},Ae.useId=function(){return je.current.useId()},Ae.useImperativeHandle=function(V,H,ae){return je.current.useImperativeHandle(V,H,ae)},Ae.useInsertionEffect=function(V,H){return je.current.useInsertionEffect(V,H)},Ae.useLayoutEffect=function(V,H){return je.current.useLayoutEffect(V,H)},Ae.useMemo=function(V,H){return je.current.useMemo(V,H)},Ae.useReducer=function(V,H,ae){return je.current.useReducer(V,H,ae)},Ae.useRef=function(V){return je.current.useRef(V)},Ae.useState=function(V){return je.current.useState(V)},Ae.useSyncExternalStore=function(V,H,ae){return je.current.useSyncExternalStore(V,H,ae)},Ae.useTransition=function(){return je.current.useTransition()},Ae.version="18.3.1",Ae}var xm;function ec(){return xm||(xm=1,qh.exports=ew()),qh.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vm;function tw(){if(Vm)return Ta;Vm=1;var i=ec(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function h(m,g,v){var w,S={},P=null,j=null;v!==void 0&&(P=""+v),g.key!==void 0&&(P=""+g.key),g.ref!==void 0&&(j=g.ref);for(w in g)s.call(g,w)&&!u.hasOwnProperty(w)&&(S[w]=g[w]);if(m&&m.defaultProps)for(w in g=m.defaultProps,g)S[w]===void 0&&(S[w]=g[w]);return{$$typeof:e,type:m,key:P,ref:j,props:S,_owner:o.current}}return Ta.Fragment=t,Ta.jsx=h,Ta.jsxs=h,Ta}var Om;function nw(){return Om||(Om=1,Wh.exports=tw()),Wh.exports}var J=nw(),Oe=ec();const vy=ZE(Oe),rw=YE({__proto__:null,default:vy},[Oe]);var mu={},Kh={exports:{}},Yt={},Gh={exports:{}},Qh={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Lm;function iw(){return Lm||(Lm=1,(function(i){function e(Z,he){var ne=Z.length;Z.push(he);e:for(;0<ne;){var V=ne-1>>>1,H=Z[V];if(0<o(H,he))Z[V]=he,Z[ne]=H,ne=V;else break e}}function t(Z){return Z.length===0?null:Z[0]}function s(Z){if(Z.length===0)return null;var he=Z[0],ne=Z.pop();if(ne!==he){Z[0]=ne;e:for(var V=0,H=Z.length,ae=H>>>1;V<ae;){var Te=2*(V+1)-1,Se=Z[Te],Ne=Te+1,Me=Z[Ne];if(0>o(Se,ne))Ne<H&&0>o(Me,Se)?(Z[V]=Me,Z[Ne]=ne,V=Ne):(Z[V]=Se,Z[Te]=ne,V=Te);else if(Ne<H&&0>o(Me,ne))Z[V]=Me,Z[Ne]=ne,V=Ne;else break e}}return he}function o(Z,he){var ne=Z.sortIndex-he.sortIndex;return ne!==0?ne:Z.id-he.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;i.unstable_now=function(){return u.now()}}else{var h=Date,m=h.now();i.unstable_now=function(){return h.now()-m}}var g=[],v=[],w=1,S=null,P=3,j=!1,K=!1,B=!1,z=typeof setTimeout=="function"?setTimeout:null,ue=typeof clearTimeout=="function"?clearTimeout:null,ce=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function me(Z){for(var he=t(v);he!==null;){if(he.callback===null)s(v);else if(he.startTime<=Z)s(v),he.sortIndex=he.expirationTime,e(g,he);else break;he=t(v)}}function we(Z){if(B=!1,me(Z),!K)if(t(g)!==null)K=!0,xt(Ge);else{var he=t(v);he!==null&&je(we,he.startTime-Z)}}function Ge(Z,he){K=!1,B&&(B=!1,ue(I),I=-1),j=!0;var ne=P;try{for(me(he),S=t(g);S!==null&&(!(S.expirationTime>he)||Z&&!x());){var V=S.callback;if(typeof V=="function"){S.callback=null,P=S.priorityLevel;var H=V(S.expirationTime<=he);he=i.unstable_now(),typeof H=="function"?S.callback=H:S===t(g)&&s(g),me(he)}else s(g);S=t(g)}if(S!==null)var ae=!0;else{var Te=t(v);Te!==null&&je(we,Te.startTime-he),ae=!1}return ae}finally{S=null,P=ne,j=!1}}var Re=!1,D=null,I=-1,R=5,k=-1;function x(){return!(i.unstable_now()-k<R)}function O(){if(D!==null){var Z=i.unstable_now();k=Z;var he=!0;try{he=D(!0,Z)}finally{he?A():(Re=!1,D=null)}}else Re=!1}var A;if(typeof ce=="function")A=function(){ce(O)};else if(typeof MessageChannel<"u"){var nt=new MessageChannel,Dt=nt.port2;nt.port1.onmessage=O,A=function(){Dt.postMessage(null)}}else A=function(){z(O,0)};function xt(Z){D=Z,Re||(Re=!0,A())}function je(Z,he){I=z(function(){Z(i.unstable_now())},he)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(Z){Z.callback=null},i.unstable_continueExecution=function(){K||j||(K=!0,xt(Ge))},i.unstable_forceFrameRate=function(Z){0>Z||125<Z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<Z?Math.floor(1e3/Z):5},i.unstable_getCurrentPriorityLevel=function(){return P},i.unstable_getFirstCallbackNode=function(){return t(g)},i.unstable_next=function(Z){switch(P){case 1:case 2:case 3:var he=3;break;default:he=P}var ne=P;P=he;try{return Z()}finally{P=ne}},i.unstable_pauseExecution=function(){},i.unstable_requestPaint=function(){},i.unstable_runWithPriority=function(Z,he){switch(Z){case 1:case 2:case 3:case 4:case 5:break;default:Z=3}var ne=P;P=Z;try{return he()}finally{P=ne}},i.unstable_scheduleCallback=function(Z,he,ne){var V=i.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?V+ne:V):ne=V,Z){case 1:var H=-1;break;case 2:H=250;break;case 5:H=1073741823;break;case 4:H=1e4;break;default:H=5e3}return H=ne+H,Z={id:w++,callback:he,priorityLevel:Z,startTime:ne,expirationTime:H,sortIndex:-1},ne>V?(Z.sortIndex=ne,e(v,Z),t(g)===null&&Z===t(v)&&(B?(ue(I),I=-1):B=!0,je(we,ne-V))):(Z.sortIndex=H,e(g,Z),K||j||(K=!0,xt(Ge))),Z},i.unstable_shouldYield=x,i.unstable_wrapCallback=function(Z){var he=P;return function(){var ne=P;P=he;try{return Z.apply(this,arguments)}finally{P=ne}}}})(Qh)),Qh}var Mm;function sw(){return Mm||(Mm=1,Gh.exports=iw()),Gh.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bm;function ow(){if(bm)return Yt;bm=1;var i=ec(),e=sw();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)r+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function u(n,r){h(n,r),h(n+"Capture",r)}function h(n,r){for(o[n]=r,n=0;n<r.length;n++)s.add(r[n])}var m=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,v=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},S={};function P(n){return g.call(S,n)?!0:g.call(w,n)?!1:v.test(n)?S[n]=!0:(w[n]=!0,!1)}function j(n,r,a,c){if(a!==null&&a.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function K(n,r,a,c){if(r===null||typeof r>"u"||j(n,r,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function B(n,r,a,c,d,p,_){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=r,this.sanitizeURL=p,this.removeEmptyString=_}var z={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){z[n]=new B(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];z[r]=new B(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){z[n]=new B(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){z[n]=new B(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){z[n]=new B(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){z[n]=new B(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){z[n]=new B(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){z[n]=new B(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){z[n]=new B(n,5,!1,n.toLowerCase(),null,!1,!1)});var ue=/[\-:]([a-z])/g;function ce(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(ue,ce);z[r]=new B(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(ue,ce);z[r]=new B(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(ue,ce);z[r]=new B(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){z[n]=new B(n,1,!1,n.toLowerCase(),null,!1,!1)}),z.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){z[n]=new B(n,1,!1,n.toLowerCase(),null,!0,!0)});function me(n,r,a,c){var d=z.hasOwnProperty(r)?z[r]:null;(d!==null?d.type!==0:c||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(K(r,a,d,c)&&(a=null),c||d===null?P(r)&&(a===null?n.removeAttribute(r):n.setAttribute(r,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(r=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(r):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,r,a):n.setAttribute(r,a))))}var we=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ge=Symbol.for("react.element"),Re=Symbol.for("react.portal"),D=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),k=Symbol.for("react.provider"),x=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),A=Symbol.for("react.suspense"),nt=Symbol.for("react.suspense_list"),Dt=Symbol.for("react.memo"),xt=Symbol.for("react.lazy"),je=Symbol.for("react.offscreen"),Z=Symbol.iterator;function he(n){return n===null||typeof n!="object"?null:(n=Z&&n[Z]||n["@@iterator"],typeof n=="function"?n:null)}var ne=Object.assign,V;function H(n){if(V===void 0)try{throw Error()}catch(a){var r=a.stack.trim().match(/\n( *(at )?)/);V=r&&r[1]||""}return`
`+V+n}var ae=!1;function Te(n,r){if(!n||ae)return"";ae=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(F){var c=F}Reflect.construct(n,[],r)}else{try{r.call()}catch(F){c=F}n.call(r.prototype)}else{try{throw Error()}catch(F){c=F}n()}}catch(F){if(F&&c&&typeof F.stack=="string"){for(var d=F.stack.split(`
`),p=c.stack.split(`
`),_=d.length-1,T=p.length-1;1<=_&&0<=T&&d[_]!==p[T];)T--;for(;1<=_&&0<=T;_--,T--)if(d[_]!==p[T]){if(_!==1||T!==1)do if(_--,T--,0>T||d[_]!==p[T]){var C=`
`+d[_].replace(" at new "," at ");return n.displayName&&C.includes("<anonymous>")&&(C=C.replace("<anonymous>",n.displayName)),C}while(1<=_&&0<=T);break}}}finally{ae=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?H(n):""}function Se(n){switch(n.tag){case 5:return H(n.type);case 16:return H("Lazy");case 13:return H("Suspense");case 19:return H("SuspenseList");case 0:case 2:case 15:return n=Te(n.type,!1),n;case 11:return n=Te(n.type.render,!1),n;case 1:return n=Te(n.type,!0),n;default:return""}}function Ne(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case D:return"Fragment";case Re:return"Portal";case R:return"Profiler";case I:return"StrictMode";case A:return"Suspense";case nt:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case x:return(n.displayName||"Context")+".Consumer";case k:return(n._context.displayName||"Context")+".Provider";case O:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Dt:return r=n.displayName||null,r!==null?r:Ne(n.type)||"Memo";case xt:r=n._payload,n=n._init;try{return Ne(n(r))}catch{}}return null}function Me(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ne(r);case 8:return r===I?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function be(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Be(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function yt(n){var r=Be(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),c=""+n[r];if(!n.hasOwnProperty(r)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,p=a.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return d.call(this)},set:function(_){c=""+_,p.call(this,_)}}),Object.defineProperty(n,r,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(_){c=""+_},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function or(n){n._valueTracker||(n._valueTracker=yt(n))}function us(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var a=r.getValue(),c="";return n&&(c=Be(n)?n.checked?"true":"false":n.value),n=c,n!==a?(r.setValue(n),!0):!1}function Vr(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Ei(n,r){var a=r.checked;return ne({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function cs(n,r){var a=r.defaultValue==null?"":r.defaultValue,c=r.checked!=null?r.checked:r.defaultChecked;a=be(r.value!=null?r.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function Po(n,r){r=r.checked,r!=null&&me(n,"checked",r,!1)}function ko(n,r){Po(n,r);var a=be(r.value),c=r.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?hs(n,r.type,a):r.hasOwnProperty("defaultValue")&&hs(n,r.type,be(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function el(n,r,a){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var c=r.type;if(!(c!=="submit"&&c!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,a||r===n.value||(n.value=r),n.defaultValue=r}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function hs(n,r,a){(r!=="number"||Vr(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var ar=Array.isArray;function lr(n,r,a,c){if(n=n.options,r){r={};for(var d=0;d<a.length;d++)r["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=r.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+be(a),r=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}r!==null||n[d].disabled||(r=n[d])}r!==null&&(r.selected=!0)}}function No(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return ne({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function ds(n,r){var a=r.value;if(a==null){if(a=r.children,r=r.defaultValue,a!=null){if(r!=null)throw Error(t(92));if(ar(a)){if(1<a.length)throw Error(t(93));a=a[0]}r=a}r==null&&(r=""),a=r}n._wrapperState={initialValue:be(a)}}function fs(n,r){var a=be(r.value),c=be(r.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),r.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Do(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function ct(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ht(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?ct(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var ur,xo=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(r,a,c,d)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(ur=ur||document.createElement("div"),ur.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=ur.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function Or(n,r){if(r){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=r;return}}n.textContent=r}var wi={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ti=["Webkit","ms","Moz","O"];Object.keys(wi).forEach(function(n){Ti.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),wi[r]=wi[n]})});function Vo(n,r,a){return r==null||typeof r=="boolean"||r===""?"":a||typeof r!="number"||r===0||wi.hasOwnProperty(n)&&wi[n]?(""+r).trim():r+"px"}function Oo(n,r){n=n.style;for(var a in r)if(r.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=Vo(a,r[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Lo=ne({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Mo(n,r){if(r){if(Lo[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function bo(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ii=null;function ps(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var ms=null,un=null,jn=null;function gs(n){if(n=aa(n)){if(typeof ms!="function")throw Error(t(280));var r=n.stateNode;r&&(r=Nl(r),ms(n.stateNode,n.type,r))}}function zn(n){un?jn?jn.push(n):jn=[n]:un=n}function Fo(){if(un){var n=un,r=jn;if(jn=un=null,gs(n),r)for(n=0;n<r.length;n++)gs(r[n])}}function Si(n,r){return n(r)}function Uo(){}var cr=!1;function jo(n,r,a){if(cr)return n(r,a);cr=!0;try{return Si(n,r,a)}finally{cr=!1,(un!==null||jn!==null)&&(Uo(),Fo())}}function rt(n,r){var a=n.stateNode;if(a===null)return null;var c=Nl(a);if(c===null)return null;a=c[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,r,typeof a));return a}var ys=!1;if(m)try{var wn={};Object.defineProperty(wn,"passive",{get:function(){ys=!0}}),window.addEventListener("test",wn,wn),window.removeEventListener("test",wn,wn)}catch{ys=!1}function Ai(n,r,a,c,d,p,_,T,C){var F=Array.prototype.slice.call(arguments,3);try{r.apply(a,F)}catch(q){this.onError(q)}}var Ri=!1,_s=null,Tn=!1,zo=null,vc={onError:function(n){Ri=!0,_s=n}};function vs(n,r,a,c,d,p,_,T,C){Ri=!1,_s=null,Ai.apply(vc,arguments)}function tl(n,r,a,c,d,p,_,T,C){if(vs.apply(this,arguments),Ri){if(Ri){var F=_s;Ri=!1,_s=null}else throw Error(t(198));Tn||(Tn=!0,zo=F)}}function In(n){var r=n,a=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(a=r.return),n=r.return;while(n)}return r.tag===3?a:null}function Ci(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function Sn(n){if(In(n)!==n)throw Error(t(188))}function nl(n){var r=n.alternate;if(!r){if(r=In(n),r===null)throw Error(t(188));return r!==n?null:n}for(var a=n,c=r;;){var d=a.return;if(d===null)break;var p=d.alternate;if(p===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===p.child){for(p=d.child;p;){if(p===a)return Sn(d),n;if(p===c)return Sn(d),r;p=p.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=p;else{for(var _=!1,T=d.child;T;){if(T===a){_=!0,a=d,c=p;break}if(T===c){_=!0,c=d,a=p;break}T=T.sibling}if(!_){for(T=p.child;T;){if(T===a){_=!0,a=p,c=d;break}if(T===c){_=!0,c=p,a=d;break}T=T.sibling}if(!_)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:r}function Bo(n){return n=nl(n),n!==null?Es(n):null}function Es(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=Es(n);if(r!==null)return r;n=n.sibling}return null}var ws=e.unstable_scheduleCallback,$o=e.unstable_cancelCallback,rl=e.unstable_shouldYield,Ec=e.unstable_requestPaint,$e=e.unstable_now,il=e.unstable_getCurrentPriorityLevel,Pi=e.unstable_ImmediatePriority,Lr=e.unstable_UserBlockingPriority,cn=e.unstable_NormalPriority,Ho=e.unstable_LowPriority,sl=e.unstable_IdlePriority,ki=null,en=null;function ol(n){if(en&&typeof en.onCommitFiberRoot=="function")try{en.onCommitFiberRoot(ki,n,void 0,(n.current.flags&128)===128)}catch{}}var zt=Math.clz32?Math.clz32:ll,Wo=Math.log,al=Math.LN2;function ll(n){return n>>>=0,n===0?32:31-(Wo(n)/al|0)|0}var Ts=64,Is=4194304;function Mr(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Ni(n,r){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,p=n.pingedLanes,_=a&268435455;if(_!==0){var T=_&~d;T!==0?c=Mr(T):(p&=_,p!==0&&(c=Mr(p)))}else _=a&~d,_!==0?c=Mr(_):p!==0&&(c=Mr(p));if(c===0)return 0;if(r!==0&&r!==c&&(r&d)===0&&(d=c&-c,p=r&-r,d>=p||d===16&&(p&4194240)!==0))return r;if((c&4)!==0&&(c|=a&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=c;0<r;)a=31-zt(r),d=1<<a,c|=n[a],r&=~d;return c}function wc(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function hr(n,r){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,p=n.pendingLanes;0<p;){var _=31-zt(p),T=1<<_,C=d[_];C===-1?((T&a)===0||(T&c)!==0)&&(d[_]=wc(T,r)):C<=r&&(n.expiredLanes|=T),p&=~T}}function tn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Di(){var n=Ts;return Ts<<=1,(Ts&4194240)===0&&(Ts=64),n}function br(n){for(var r=[],a=0;31>a;a++)r.push(n);return r}function Fr(n,r,a){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-zt(r),n[r]=a}function ze(n,r){var a=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-zt(a),p=1<<d;r[d]=0,c[d]=-1,n[d]=-1,a&=~p}}function Ur(n,r){var a=n.entangledLanes|=r;for(n=n.entanglements;a;){var c=31-zt(a),d=1<<c;d&r|n[c]&r&&(n[c]|=r),a&=~d}}var ke=0;function jr(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var ul,Ss,cl,hl,dl,qo=!1,Bn=[],St=null,An=null,Rn=null,zr=new Map,hn=new Map,$n=[],Tc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function fl(n,r){switch(n){case"focusin":case"focusout":St=null;break;case"dragenter":case"dragleave":An=null;break;case"mouseover":case"mouseout":Rn=null;break;case"pointerover":case"pointerout":zr.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":hn.delete(r.pointerId)}}function Wt(n,r,a,c,d,p){return n===null||n.nativeEvent!==p?(n={blockedOn:r,domEventName:a,eventSystemFlags:c,nativeEvent:p,targetContainers:[d]},r!==null&&(r=aa(r),r!==null&&Ss(r)),n):(n.eventSystemFlags|=c,r=n.targetContainers,d!==null&&r.indexOf(d)===-1&&r.push(d),n)}function Ic(n,r,a,c,d){switch(r){case"focusin":return St=Wt(St,n,r,a,c,d),!0;case"dragenter":return An=Wt(An,n,r,a,c,d),!0;case"mouseover":return Rn=Wt(Rn,n,r,a,c,d),!0;case"pointerover":var p=d.pointerId;return zr.set(p,Wt(zr.get(p)||null,n,r,a,c,d)),!0;case"gotpointercapture":return p=d.pointerId,hn.set(p,Wt(hn.get(p)||null,n,r,a,c,d)),!0}return!1}function pl(n){var r=Mi(n.target);if(r!==null){var a=In(r);if(a!==null){if(r=a.tag,r===13){if(r=Ci(a),r!==null){n.blockedOn=r,dl(n.priority,function(){cl(a)});return}}else if(r===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function dr(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var a=As(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Ii=c,a.target.dispatchEvent(c),Ii=null}else return r=aa(a),r!==null&&Ss(r),n.blockedOn=a,!1;r.shift()}return!0}function xi(n,r,a){dr(n)&&a.delete(r)}function ml(){qo=!1,St!==null&&dr(St)&&(St=null),An!==null&&dr(An)&&(An=null),Rn!==null&&dr(Rn)&&(Rn=null),zr.forEach(xi),hn.forEach(xi)}function Cn(n,r){n.blockedOn===r&&(n.blockedOn=null,qo||(qo=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,ml)))}function Pn(n){function r(d){return Cn(d,n)}if(0<Bn.length){Cn(Bn[0],n);for(var a=1;a<Bn.length;a++){var c=Bn[a];c.blockedOn===n&&(c.blockedOn=null)}}for(St!==null&&Cn(St,n),An!==null&&Cn(An,n),Rn!==null&&Cn(Rn,n),zr.forEach(r),hn.forEach(r),a=0;a<$n.length;a++)c=$n[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<$n.length&&(a=$n[0],a.blockedOn===null);)pl(a),a.blockedOn===null&&$n.shift()}var fr=we.ReactCurrentBatchConfig,Br=!0;function Qe(n,r,a,c){var d=ke,p=fr.transition;fr.transition=null;try{ke=1,Ko(n,r,a,c)}finally{ke=d,fr.transition=p}}function Sc(n,r,a,c){var d=ke,p=fr.transition;fr.transition=null;try{ke=4,Ko(n,r,a,c)}finally{ke=d,fr.transition=p}}function Ko(n,r,a,c){if(Br){var d=As(n,r,a,c);if(d===null)Lc(n,r,c,Vi,a),fl(n,c);else if(Ic(d,n,r,a,c))c.stopPropagation();else if(fl(n,c),r&4&&-1<Tc.indexOf(n)){for(;d!==null;){var p=aa(d);if(p!==null&&ul(p),p=As(n,r,a,c),p===null&&Lc(n,r,c,Vi,a),p===d)break;d=p}d!==null&&c.stopPropagation()}else Lc(n,r,c,null,a)}}var Vi=null;function As(n,r,a,c){if(Vi=null,n=ps(c),n=Mi(n),n!==null)if(r=In(n),r===null)n=null;else if(a=r.tag,a===13){if(n=Ci(r),n!==null)return n;n=null}else if(a===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return Vi=n,null}function Go(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(il()){case Pi:return 1;case Lr:return 4;case cn:case Ho:return 16;case sl:return 536870912;default:return 16}default:return 16}}var nn=null,Rs=null,qt=null;function Qo(){if(qt)return qt;var n,r=Rs,a=r.length,c,d="value"in nn?nn.value:nn.textContent,p=d.length;for(n=0;n<a&&r[n]===d[n];n++);var _=a-n;for(c=1;c<=_&&r[a-c]===d[p-c];c++);return qt=d.slice(n,1<c?1-c:void 0)}function Cs(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function Hn(){return!0}function Xo(){return!1}function At(n){function r(a,c,d,p,_){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=p,this.target=_,this.currentTarget=null;for(var T in n)n.hasOwnProperty(T)&&(a=n[T],this[T]=a?a(p):p[T]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?Hn:Xo,this.isPropagationStopped=Xo,this}return ne(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Hn)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Hn)},persist:function(){},isPersistent:Hn}),r}var kn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ps=At(kn),Wn=ne({},kn,{view:0,detail:0}),Ac=At(Wn),ks,pr,$r,Oi=ne({},Wn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:qn,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==$r&&($r&&n.type==="mousemove"?(ks=n.screenX-$r.screenX,pr=n.screenY-$r.screenY):pr=ks=0,$r=n),ks)},movementY:function(n){return"movementY"in n?n.movementY:pr}}),Ns=At(Oi),Jo=ne({},Oi,{dataTransfer:0}),gl=At(Jo),Ds=ne({},Wn,{relatedTarget:0}),xs=At(Ds),yl=ne({},kn,{animationName:0,elapsedTime:0,pseudoElement:0}),mr=At(yl),_l=ne({},kn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),vl=At(_l),El=ne({},kn,{data:0}),Yo=At(El),Vs={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Bt={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},wl={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Tl(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=wl[n])?!!r[n]:!1}function qn(){return Tl}var l=ne({},Wn,{key:function(n){if(n.key){var r=Vs[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=Cs(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Bt[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:qn,charCode:function(n){return n.type==="keypress"?Cs(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Cs(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),f=At(l),y=ne({},Oi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),E=At(y),L=ne({},Wn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:qn}),U=At(L),Y=ne({},kn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ue=At(Y),dt=ne({},Oi,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),De=At(dt),_t=[9,13,27,32],ot=m&&"CompositionEvent"in window,dn=null;m&&"documentMode"in document&&(dn=document.documentMode);var rn=m&&"TextEvent"in window&&!dn,Li=m&&(!ot||dn&&8<dn&&11>=dn),Os=" ",Af=!1;function Rf(n,r){switch(n){case"keyup":return _t.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Cf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var Ls=!1;function Qv(n,r){switch(n){case"compositionend":return Cf(r);case"keypress":return r.which!==32?null:(Af=!0,Os);case"textInput":return n=r.data,n===Os&&Af?null:n;default:return null}}function Xv(n,r){if(Ls)return n==="compositionend"||!ot&&Rf(n,r)?(n=Qo(),qt=Rs=nn=null,Ls=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return Li&&r.locale!=="ko"?null:r.data;default:return null}}var Jv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Pf(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!Jv[n.type]:r==="textarea"}function kf(n,r,a,c){zn(c),r=Cl(r,"onChange"),0<r.length&&(a=new Ps("onChange","change",null,a,c),n.push({event:a,listeners:r}))}var Zo=null,ea=null;function Yv(n){Kf(n,0)}function Il(n){var r=js(n);if(us(r))return n}function Zv(n,r){if(n==="change")return r}var Nf=!1;if(m){var Rc;if(m){var Cc="oninput"in document;if(!Cc){var Df=document.createElement("div");Df.setAttribute("oninput","return;"),Cc=typeof Df.oninput=="function"}Rc=Cc}else Rc=!1;Nf=Rc&&(!document.documentMode||9<document.documentMode)}function xf(){Zo&&(Zo.detachEvent("onpropertychange",Vf),ea=Zo=null)}function Vf(n){if(n.propertyName==="value"&&Il(ea)){var r=[];kf(r,ea,n,ps(n)),jo(Yv,r)}}function eE(n,r,a){n==="focusin"?(xf(),Zo=r,ea=a,Zo.attachEvent("onpropertychange",Vf)):n==="focusout"&&xf()}function tE(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Il(ea)}function nE(n,r){if(n==="click")return Il(r)}function rE(n,r){if(n==="input"||n==="change")return Il(r)}function iE(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var Nn=typeof Object.is=="function"?Object.is:iE;function ta(n,r){if(Nn(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var a=Object.keys(n),c=Object.keys(r);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(r,d)||!Nn(n[d],r[d]))return!1}return!0}function Of(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Lf(n,r){var a=Of(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=r&&c>=r)return{node:a,offset:r-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Of(a)}}function Mf(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Mf(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function bf(){for(var n=window,r=Vr();r instanceof n.HTMLIFrameElement;){try{var a=typeof r.contentWindow.location.href=="string"}catch{a=!1}if(a)n=r.contentWindow;else break;r=Vr(n.document)}return r}function Pc(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function sE(n){var r=bf(),a=n.focusedElem,c=n.selectionRange;if(r!==a&&a&&a.ownerDocument&&Mf(a.ownerDocument.documentElement,a)){if(c!==null&&Pc(a)){if(r=c.start,n=c.end,n===void 0&&(n=r),"selectionStart"in a)a.selectionStart=r,a.selectionEnd=Math.min(n,a.value.length);else if(n=(r=a.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,p=Math.min(c.start,d);c=c.end===void 0?p:Math.min(c.end,d),!n.extend&&p>c&&(d=c,c=p,p=d),d=Lf(a,p);var _=Lf(a,c);d&&_&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==_.node||n.focusOffset!==_.offset)&&(r=r.createRange(),r.setStart(d.node,d.offset),n.removeAllRanges(),p>c?(n.addRange(r),n.extend(_.node,_.offset)):(r.setEnd(_.node,_.offset),n.addRange(r)))}}for(r=[],n=a;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<r.length;a++)n=r[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var oE=m&&"documentMode"in document&&11>=document.documentMode,Ms=null,kc=null,na=null,Nc=!1;function Ff(n,r,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Nc||Ms==null||Ms!==Vr(c)||(c=Ms,"selectionStart"in c&&Pc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),na&&ta(na,c)||(na=c,c=Cl(kc,"onSelect"),0<c.length&&(r=new Ps("onSelect","select",null,r,a),n.push({event:r,listeners:c}),r.target=Ms)))}function Sl(n,r){var a={};return a[n.toLowerCase()]=r.toLowerCase(),a["Webkit"+n]="webkit"+r,a["Moz"+n]="moz"+r,a}var bs={animationend:Sl("Animation","AnimationEnd"),animationiteration:Sl("Animation","AnimationIteration"),animationstart:Sl("Animation","AnimationStart"),transitionend:Sl("Transition","TransitionEnd")},Dc={},Uf={};m&&(Uf=document.createElement("div").style,"AnimationEvent"in window||(delete bs.animationend.animation,delete bs.animationiteration.animation,delete bs.animationstart.animation),"TransitionEvent"in window||delete bs.transitionend.transition);function Al(n){if(Dc[n])return Dc[n];if(!bs[n])return n;var r=bs[n],a;for(a in r)if(r.hasOwnProperty(a)&&a in Uf)return Dc[n]=r[a];return n}var jf=Al("animationend"),zf=Al("animationiteration"),Bf=Al("animationstart"),$f=Al("transitionend"),Hf=new Map,Wf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Hr(n,r){Hf.set(n,r),u(r,[n])}for(var xc=0;xc<Wf.length;xc++){var Vc=Wf[xc],aE=Vc.toLowerCase(),lE=Vc[0].toUpperCase()+Vc.slice(1);Hr(aE,"on"+lE)}Hr(jf,"onAnimationEnd"),Hr(zf,"onAnimationIteration"),Hr(Bf,"onAnimationStart"),Hr("dblclick","onDoubleClick"),Hr("focusin","onFocus"),Hr("focusout","onBlur"),Hr($f,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ra="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),uE=new Set("cancel close invalid load scroll toggle".split(" ").concat(ra));function qf(n,r,a){var c=n.type||"unknown-event";n.currentTarget=a,tl(c,r,void 0,n),n.currentTarget=null}function Kf(n,r){r=(r&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var p=void 0;if(r)for(var _=c.length-1;0<=_;_--){var T=c[_],C=T.instance,F=T.currentTarget;if(T=T.listener,C!==p&&d.isPropagationStopped())break e;qf(d,T,F),p=C}else for(_=0;_<c.length;_++){if(T=c[_],C=T.instance,F=T.currentTarget,T=T.listener,C!==p&&d.isPropagationStopped())break e;qf(d,T,F),p=C}}}if(Tn)throw n=zo,Tn=!1,zo=null,n}function We(n,r){var a=r[zc];a===void 0&&(a=r[zc]=new Set);var c=n+"__bubble";a.has(c)||(Gf(r,n,2,!1),a.add(c))}function Oc(n,r,a){var c=0;r&&(c|=4),Gf(a,n,c,r)}var Rl="_reactListening"+Math.random().toString(36).slice(2);function ia(n){if(!n[Rl]){n[Rl]=!0,s.forEach(function(a){a!=="selectionchange"&&(uE.has(a)||Oc(a,!1,n),Oc(a,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[Rl]||(r[Rl]=!0,Oc("selectionchange",!1,r))}}function Gf(n,r,a,c){switch(Go(r)){case 1:var d=Qe;break;case 4:d=Sc;break;default:d=Ko}a=d.bind(null,r,a,n),d=void 0,!ys||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(r,a,{capture:!0,passive:d}):n.addEventListener(r,a,!0):d!==void 0?n.addEventListener(r,a,{passive:d}):n.addEventListener(r,a,!1)}function Lc(n,r,a,c,d){var p=c;if((r&1)===0&&(r&2)===0&&c!==null)e:for(;;){if(c===null)return;var _=c.tag;if(_===3||_===4){var T=c.stateNode.containerInfo;if(T===d||T.nodeType===8&&T.parentNode===d)break;if(_===4)for(_=c.return;_!==null;){var C=_.tag;if((C===3||C===4)&&(C=_.stateNode.containerInfo,C===d||C.nodeType===8&&C.parentNode===d))return;_=_.return}for(;T!==null;){if(_=Mi(T),_===null)return;if(C=_.tag,C===5||C===6){c=p=_;continue e}T=T.parentNode}}c=c.return}jo(function(){var F=p,q=ps(a),Q=[];e:{var W=Hf.get(n);if(W!==void 0){var ee=Ps,ie=n;switch(n){case"keypress":if(Cs(a)===0)break e;case"keydown":case"keyup":ee=f;break;case"focusin":ie="focus",ee=xs;break;case"focusout":ie="blur",ee=xs;break;case"beforeblur":case"afterblur":ee=xs;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ee=Ns;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ee=gl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ee=U;break;case jf:case zf:case Bf:ee=mr;break;case $f:ee=Ue;break;case"scroll":ee=Ac;break;case"wheel":ee=De;break;case"copy":case"cut":case"paste":ee=vl;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ee=E}var se=(r&4)!==0,it=!se&&n==="scroll",M=se?W!==null?W+"Capture":null:W;se=[];for(var N=F,b;N!==null;){b=N;var X=b.stateNode;if(b.tag===5&&X!==null&&(b=X,M!==null&&(X=rt(N,M),X!=null&&se.push(sa(N,X,b)))),it)break;N=N.return}0<se.length&&(W=new ee(W,ie,null,a,q),Q.push({event:W,listeners:se}))}}if((r&7)===0){e:{if(W=n==="mouseover"||n==="pointerover",ee=n==="mouseout"||n==="pointerout",W&&a!==Ii&&(ie=a.relatedTarget||a.fromElement)&&(Mi(ie)||ie[gr]))break e;if((ee||W)&&(W=q.window===q?q:(W=q.ownerDocument)?W.defaultView||W.parentWindow:window,ee?(ie=a.relatedTarget||a.toElement,ee=F,ie=ie?Mi(ie):null,ie!==null&&(it=In(ie),ie!==it||ie.tag!==5&&ie.tag!==6)&&(ie=null)):(ee=null,ie=F),ee!==ie)){if(se=Ns,X="onMouseLeave",M="onMouseEnter",N="mouse",(n==="pointerout"||n==="pointerover")&&(se=E,X="onPointerLeave",M="onPointerEnter",N="pointer"),it=ee==null?W:js(ee),b=ie==null?W:js(ie),W=new se(X,N+"leave",ee,a,q),W.target=it,W.relatedTarget=b,X=null,Mi(q)===F&&(se=new se(M,N+"enter",ie,a,q),se.target=b,se.relatedTarget=it,X=se),it=X,ee&&ie)t:{for(se=ee,M=ie,N=0,b=se;b;b=Fs(b))N++;for(b=0,X=M;X;X=Fs(X))b++;for(;0<N-b;)se=Fs(se),N--;for(;0<b-N;)M=Fs(M),b--;for(;N--;){if(se===M||M!==null&&se===M.alternate)break t;se=Fs(se),M=Fs(M)}se=null}else se=null;ee!==null&&Qf(Q,W,ee,se,!1),ie!==null&&it!==null&&Qf(Q,it,ie,se,!0)}}e:{if(W=F?js(F):window,ee=W.nodeName&&W.nodeName.toLowerCase(),ee==="select"||ee==="input"&&W.type==="file")var oe=Zv;else if(Pf(W))if(Nf)oe=rE;else{oe=tE;var de=eE}else(ee=W.nodeName)&&ee.toLowerCase()==="input"&&(W.type==="checkbox"||W.type==="radio")&&(oe=nE);if(oe&&(oe=oe(n,F))){kf(Q,oe,a,q);break e}de&&de(n,W,F),n==="focusout"&&(de=W._wrapperState)&&de.controlled&&W.type==="number"&&hs(W,"number",W.value)}switch(de=F?js(F):window,n){case"focusin":(Pf(de)||de.contentEditable==="true")&&(Ms=de,kc=F,na=null);break;case"focusout":na=kc=Ms=null;break;case"mousedown":Nc=!0;break;case"contextmenu":case"mouseup":case"dragend":Nc=!1,Ff(Q,a,q);break;case"selectionchange":if(oE)break;case"keydown":case"keyup":Ff(Q,a,q)}var fe;if(ot)e:{switch(n){case"compositionstart":var ye="onCompositionStart";break e;case"compositionend":ye="onCompositionEnd";break e;case"compositionupdate":ye="onCompositionUpdate";break e}ye=void 0}else Ls?Rf(n,a)&&(ye="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(ye="onCompositionStart");ye&&(Li&&a.locale!=="ko"&&(Ls||ye!=="onCompositionStart"?ye==="onCompositionEnd"&&Ls&&(fe=Qo()):(nn=q,Rs="value"in nn?nn.value:nn.textContent,Ls=!0)),de=Cl(F,ye),0<de.length&&(ye=new Yo(ye,n,null,a,q),Q.push({event:ye,listeners:de}),fe?ye.data=fe:(fe=Cf(a),fe!==null&&(ye.data=fe)))),(fe=rn?Qv(n,a):Xv(n,a))&&(F=Cl(F,"onBeforeInput"),0<F.length&&(q=new Yo("onBeforeInput","beforeinput",null,a,q),Q.push({event:q,listeners:F}),q.data=fe))}Kf(Q,r)})}function sa(n,r,a){return{instance:n,listener:r,currentTarget:a}}function Cl(n,r){for(var a=r+"Capture",c=[];n!==null;){var d=n,p=d.stateNode;d.tag===5&&p!==null&&(d=p,p=rt(n,a),p!=null&&c.unshift(sa(n,p,d)),p=rt(n,r),p!=null&&c.push(sa(n,p,d))),n=n.return}return c}function Fs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Qf(n,r,a,c,d){for(var p=r._reactName,_=[];a!==null&&a!==c;){var T=a,C=T.alternate,F=T.stateNode;if(C!==null&&C===c)break;T.tag===5&&F!==null&&(T=F,d?(C=rt(a,p),C!=null&&_.unshift(sa(a,C,T))):d||(C=rt(a,p),C!=null&&_.push(sa(a,C,T)))),a=a.return}_.length!==0&&n.push({event:r,listeners:_})}var cE=/\r\n?/g,hE=/\u0000|\uFFFD/g;function Xf(n){return(typeof n=="string"?n:""+n).replace(cE,`
`).replace(hE,"")}function Pl(n,r,a){if(r=Xf(r),Xf(n)!==r&&a)throw Error(t(425))}function kl(){}var Mc=null,bc=null;function Fc(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var Uc=typeof setTimeout=="function"?setTimeout:void 0,dE=typeof clearTimeout=="function"?clearTimeout:void 0,Jf=typeof Promise=="function"?Promise:void 0,fE=typeof queueMicrotask=="function"?queueMicrotask:typeof Jf<"u"?function(n){return Jf.resolve(null).then(n).catch(pE)}:Uc;function pE(n){setTimeout(function(){throw n})}function jc(n,r){var a=r,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),Pn(r);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);Pn(r)}function Wr(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function Yf(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(r===0)return n;r--}else a==="/$"&&r++}n=n.previousSibling}return null}var Us=Math.random().toString(36).slice(2),Kn="__reactFiber$"+Us,oa="__reactProps$"+Us,gr="__reactContainer$"+Us,zc="__reactEvents$"+Us,mE="__reactListeners$"+Us,gE="__reactHandles$"+Us;function Mi(n){var r=n[Kn];if(r)return r;for(var a=n.parentNode;a;){if(r=a[gr]||a[Kn]){if(a=r.alternate,r.child!==null||a!==null&&a.child!==null)for(n=Yf(n);n!==null;){if(a=n[Kn])return a;n=Yf(n)}return r}n=a,a=n.parentNode}return null}function aa(n){return n=n[Kn]||n[gr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function js(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Nl(n){return n[oa]||null}var Bc=[],zs=-1;function qr(n){return{current:n}}function qe(n){0>zs||(n.current=Bc[zs],Bc[zs]=null,zs--)}function He(n,r){zs++,Bc[zs]=n.current,n.current=r}var Kr={},Vt=qr(Kr),Kt=qr(!1),bi=Kr;function Bs(n,r){var a=n.type.contextTypes;if(!a)return Kr;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===r)return c.__reactInternalMemoizedMaskedChildContext;var d={},p;for(p in a)d[p]=r[p];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=d),d}function Gt(n){return n=n.childContextTypes,n!=null}function Dl(){qe(Kt),qe(Vt)}function Zf(n,r,a){if(Vt.current!==Kr)throw Error(t(168));He(Vt,r),He(Kt,a)}function ep(n,r,a){var c=n.stateNode;if(r=r.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in r))throw Error(t(108,Me(n)||"Unknown",d));return ne({},a,c)}function xl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Kr,bi=Vt.current,He(Vt,n),He(Kt,Kt.current),!0}function tp(n,r,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=ep(n,r,bi),c.__reactInternalMemoizedMergedChildContext=n,qe(Kt),qe(Vt),He(Vt,n)):qe(Kt),He(Kt,a)}var yr=null,Vl=!1,$c=!1;function np(n){yr===null?yr=[n]:yr.push(n)}function yE(n){Vl=!0,np(n)}function Gr(){if(!$c&&yr!==null){$c=!0;var n=0,r=ke;try{var a=yr;for(ke=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}yr=null,Vl=!1}catch(d){throw yr!==null&&(yr=yr.slice(n+1)),ws(Pi,Gr),d}finally{ke=r,$c=!1}}return null}var $s=[],Hs=0,Ol=null,Ll=0,fn=[],pn=0,Fi=null,_r=1,vr="";function Ui(n,r){$s[Hs++]=Ll,$s[Hs++]=Ol,Ol=n,Ll=r}function rp(n,r,a){fn[pn++]=_r,fn[pn++]=vr,fn[pn++]=Fi,Fi=n;var c=_r;n=vr;var d=32-zt(c)-1;c&=~(1<<d),a+=1;var p=32-zt(r)+d;if(30<p){var _=d-d%5;p=(c&(1<<_)-1).toString(32),c>>=_,d-=_,_r=1<<32-zt(r)+d|a<<d|c,vr=p+n}else _r=1<<p|a<<d|c,vr=n}function Hc(n){n.return!==null&&(Ui(n,1),rp(n,1,0))}function Wc(n){for(;n===Ol;)Ol=$s[--Hs],$s[Hs]=null,Ll=$s[--Hs],$s[Hs]=null;for(;n===Fi;)Fi=fn[--pn],fn[pn]=null,vr=fn[--pn],fn[pn]=null,_r=fn[--pn],fn[pn]=null}var sn=null,on=null,Xe=!1,Dn=null;function ip(n,r){var a=_n(5,null,null,0);a.elementType="DELETED",a.stateNode=r,a.return=n,r=n.deletions,r===null?(n.deletions=[a],n.flags|=16):r.push(a)}function sp(n,r){switch(n.tag){case 5:var a=n.type;return r=r.nodeType!==1||a.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,sn=n,on=Wr(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,sn=n,on=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(a=Fi!==null?{id:_r,overflow:vr}:null,n.memoizedState={dehydrated:r,treeContext:a,retryLane:1073741824},a=_n(18,null,null,0),a.stateNode=r,a.return=n,n.child=a,sn=n,on=null,!0):!1;default:return!1}}function qc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Kc(n){if(Xe){var r=on;if(r){var a=r;if(!sp(n,r)){if(qc(n))throw Error(t(418));r=Wr(a.nextSibling);var c=sn;r&&sp(n,r)?ip(c,a):(n.flags=n.flags&-4097|2,Xe=!1,sn=n)}}else{if(qc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Xe=!1,sn=n}}}function op(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;sn=n}function Ml(n){if(n!==sn)return!1;if(!Xe)return op(n),Xe=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!Fc(n.type,n.memoizedProps)),r&&(r=on)){if(qc(n))throw ap(),Error(t(418));for(;r;)ip(n,r),r=Wr(r.nextSibling)}if(op(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(r===0){on=Wr(n.nextSibling);break e}r--}else a!=="$"&&a!=="$!"&&a!=="$?"||r++}n=n.nextSibling}on=null}}else on=sn?Wr(n.stateNode.nextSibling):null;return!0}function ap(){for(var n=on;n;)n=Wr(n.nextSibling)}function Ws(){on=sn=null,Xe=!1}function Gc(n){Dn===null?Dn=[n]:Dn.push(n)}var _E=we.ReactCurrentBatchConfig;function la(n,r,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,p=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===p?r.ref:(r=function(_){var T=d.refs;_===null?delete T[p]:T[p]=_},r._stringRef=p,r)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function bl(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function lp(n){var r=n._init;return r(n._payload)}function up(n){function r(M,N){if(n){var b=M.deletions;b===null?(M.deletions=[N],M.flags|=16):b.push(N)}}function a(M,N){if(!n)return null;for(;N!==null;)r(M,N),N=N.sibling;return null}function c(M,N){for(M=new Map;N!==null;)N.key!==null?M.set(N.key,N):M.set(N.index,N),N=N.sibling;return M}function d(M,N){return M=ni(M,N),M.index=0,M.sibling=null,M}function p(M,N,b){return M.index=b,n?(b=M.alternate,b!==null?(b=b.index,b<N?(M.flags|=2,N):b):(M.flags|=2,N)):(M.flags|=1048576,N)}function _(M){return n&&M.alternate===null&&(M.flags|=2),M}function T(M,N,b,X){return N===null||N.tag!==6?(N=Uh(b,M.mode,X),N.return=M,N):(N=d(N,b),N.return=M,N)}function C(M,N,b,X){var oe=b.type;return oe===D?q(M,N,b.props.children,X,b.key):N!==null&&(N.elementType===oe||typeof oe=="object"&&oe!==null&&oe.$$typeof===xt&&lp(oe)===N.type)?(X=d(N,b.props),X.ref=la(M,N,b),X.return=M,X):(X=au(b.type,b.key,b.props,null,M.mode,X),X.ref=la(M,N,b),X.return=M,X)}function F(M,N,b,X){return N===null||N.tag!==4||N.stateNode.containerInfo!==b.containerInfo||N.stateNode.implementation!==b.implementation?(N=jh(b,M.mode,X),N.return=M,N):(N=d(N,b.children||[]),N.return=M,N)}function q(M,N,b,X,oe){return N===null||N.tag!==7?(N=Ki(b,M.mode,X,oe),N.return=M,N):(N=d(N,b),N.return=M,N)}function Q(M,N,b){if(typeof N=="string"&&N!==""||typeof N=="number")return N=Uh(""+N,M.mode,b),N.return=M,N;if(typeof N=="object"&&N!==null){switch(N.$$typeof){case Ge:return b=au(N.type,N.key,N.props,null,M.mode,b),b.ref=la(M,null,N),b.return=M,b;case Re:return N=jh(N,M.mode,b),N.return=M,N;case xt:var X=N._init;return Q(M,X(N._payload),b)}if(ar(N)||he(N))return N=Ki(N,M.mode,b,null),N.return=M,N;bl(M,N)}return null}function W(M,N,b,X){var oe=N!==null?N.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return oe!==null?null:T(M,N,""+b,X);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Ge:return b.key===oe?C(M,N,b,X):null;case Re:return b.key===oe?F(M,N,b,X):null;case xt:return oe=b._init,W(M,N,oe(b._payload),X)}if(ar(b)||he(b))return oe!==null?null:q(M,N,b,X,null);bl(M,b)}return null}function ee(M,N,b,X,oe){if(typeof X=="string"&&X!==""||typeof X=="number")return M=M.get(b)||null,T(N,M,""+X,oe);if(typeof X=="object"&&X!==null){switch(X.$$typeof){case Ge:return M=M.get(X.key===null?b:X.key)||null,C(N,M,X,oe);case Re:return M=M.get(X.key===null?b:X.key)||null,F(N,M,X,oe);case xt:var de=X._init;return ee(M,N,b,de(X._payload),oe)}if(ar(X)||he(X))return M=M.get(b)||null,q(N,M,X,oe,null);bl(N,X)}return null}function ie(M,N,b,X){for(var oe=null,de=null,fe=N,ye=N=0,wt=null;fe!==null&&ye<b.length;ye++){fe.index>ye?(wt=fe,fe=null):wt=fe.sibling;var Le=W(M,fe,b[ye],X);if(Le===null){fe===null&&(fe=wt);break}n&&fe&&Le.alternate===null&&r(M,fe),N=p(Le,N,ye),de===null?oe=Le:de.sibling=Le,de=Le,fe=wt}if(ye===b.length)return a(M,fe),Xe&&Ui(M,ye),oe;if(fe===null){for(;ye<b.length;ye++)fe=Q(M,b[ye],X),fe!==null&&(N=p(fe,N,ye),de===null?oe=fe:de.sibling=fe,de=fe);return Xe&&Ui(M,ye),oe}for(fe=c(M,fe);ye<b.length;ye++)wt=ee(fe,M,ye,b[ye],X),wt!==null&&(n&&wt.alternate!==null&&fe.delete(wt.key===null?ye:wt.key),N=p(wt,N,ye),de===null?oe=wt:de.sibling=wt,de=wt);return n&&fe.forEach(function(ri){return r(M,ri)}),Xe&&Ui(M,ye),oe}function se(M,N,b,X){var oe=he(b);if(typeof oe!="function")throw Error(t(150));if(b=oe.call(b),b==null)throw Error(t(151));for(var de=oe=null,fe=N,ye=N=0,wt=null,Le=b.next();fe!==null&&!Le.done;ye++,Le=b.next()){fe.index>ye?(wt=fe,fe=null):wt=fe.sibling;var ri=W(M,fe,Le.value,X);if(ri===null){fe===null&&(fe=wt);break}n&&fe&&ri.alternate===null&&r(M,fe),N=p(ri,N,ye),de===null?oe=ri:de.sibling=ri,de=ri,fe=wt}if(Le.done)return a(M,fe),Xe&&Ui(M,ye),oe;if(fe===null){for(;!Le.done;ye++,Le=b.next())Le=Q(M,Le.value,X),Le!==null&&(N=p(Le,N,ye),de===null?oe=Le:de.sibling=Le,de=Le);return Xe&&Ui(M,ye),oe}for(fe=c(M,fe);!Le.done;ye++,Le=b.next())Le=ee(fe,M,ye,Le.value,X),Le!==null&&(n&&Le.alternate!==null&&fe.delete(Le.key===null?ye:Le.key),N=p(Le,N,ye),de===null?oe=Le:de.sibling=Le,de=Le);return n&&fe.forEach(function(JE){return r(M,JE)}),Xe&&Ui(M,ye),oe}function it(M,N,b,X){if(typeof b=="object"&&b!==null&&b.type===D&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case Ge:e:{for(var oe=b.key,de=N;de!==null;){if(de.key===oe){if(oe=b.type,oe===D){if(de.tag===7){a(M,de.sibling),N=d(de,b.props.children),N.return=M,M=N;break e}}else if(de.elementType===oe||typeof oe=="object"&&oe!==null&&oe.$$typeof===xt&&lp(oe)===de.type){a(M,de.sibling),N=d(de,b.props),N.ref=la(M,de,b),N.return=M,M=N;break e}a(M,de);break}else r(M,de);de=de.sibling}b.type===D?(N=Ki(b.props.children,M.mode,X,b.key),N.return=M,M=N):(X=au(b.type,b.key,b.props,null,M.mode,X),X.ref=la(M,N,b),X.return=M,M=X)}return _(M);case Re:e:{for(de=b.key;N!==null;){if(N.key===de)if(N.tag===4&&N.stateNode.containerInfo===b.containerInfo&&N.stateNode.implementation===b.implementation){a(M,N.sibling),N=d(N,b.children||[]),N.return=M,M=N;break e}else{a(M,N);break}else r(M,N);N=N.sibling}N=jh(b,M.mode,X),N.return=M,M=N}return _(M);case xt:return de=b._init,it(M,N,de(b._payload),X)}if(ar(b))return ie(M,N,b,X);if(he(b))return se(M,N,b,X);bl(M,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,N!==null&&N.tag===6?(a(M,N.sibling),N=d(N,b),N.return=M,M=N):(a(M,N),N=Uh(b,M.mode,X),N.return=M,M=N),_(M)):a(M,N)}return it}var qs=up(!0),cp=up(!1),Fl=qr(null),Ul=null,Ks=null,Qc=null;function Xc(){Qc=Ks=Ul=null}function Jc(n){var r=Fl.current;qe(Fl),n._currentValue=r}function Yc(n,r,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,c!==null&&(c.childLanes|=r)):c!==null&&(c.childLanes&r)!==r&&(c.childLanes|=r),n===a)break;n=n.return}}function Gs(n,r){Ul=n,Qc=Ks=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Qt=!0),n.firstContext=null)}function mn(n){var r=n._currentValue;if(Qc!==n)if(n={context:n,memoizedValue:r,next:null},Ks===null){if(Ul===null)throw Error(t(308));Ks=n,Ul.dependencies={lanes:0,firstContext:n}}else Ks=Ks.next=n;return r}var ji=null;function Zc(n){ji===null?ji=[n]:ji.push(n)}function hp(n,r,a,c){var d=r.interleaved;return d===null?(a.next=a,Zc(r)):(a.next=d.next,d.next=a),r.interleaved=a,Er(n,c)}function Er(n,r){n.lanes|=r;var a=n.alternate;for(a!==null&&(a.lanes|=r),a=n,n=n.return;n!==null;)n.childLanes|=r,a=n.alternate,a!==null&&(a.childLanes|=r),a=n,n=n.return;return a.tag===3?a.stateNode:null}var Qr=!1;function eh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function dp(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function wr(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function Xr(n,r,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Ve&2)!==0){var d=c.pending;return d===null?r.next=r:(r.next=d.next,d.next=r),c.pending=r,Er(n,a)}return d=c.interleaved,d===null?(r.next=r,Zc(c)):(r.next=d.next,d.next=r),c.interleaved=r,Er(n,a)}function jl(n,r,a){if(r=r.updateQueue,r!==null&&(r=r.shared,(a&4194240)!==0)){var c=r.lanes;c&=n.pendingLanes,a|=c,r.lanes=a,Ur(n,a)}}function fp(n,r){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,p=null;if(a=a.firstBaseUpdate,a!==null){do{var _={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};p===null?d=p=_:p=p.next=_,a=a.next}while(a!==null);p===null?d=p=r:p=p.next=r}else d=p=r;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:p,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=r:n.next=r,a.lastBaseUpdate=r}function zl(n,r,a,c){var d=n.updateQueue;Qr=!1;var p=d.firstBaseUpdate,_=d.lastBaseUpdate,T=d.shared.pending;if(T!==null){d.shared.pending=null;var C=T,F=C.next;C.next=null,_===null?p=F:_.next=F,_=C;var q=n.alternate;q!==null&&(q=q.updateQueue,T=q.lastBaseUpdate,T!==_&&(T===null?q.firstBaseUpdate=F:T.next=F,q.lastBaseUpdate=C))}if(p!==null){var Q=d.baseState;_=0,q=F=C=null,T=p;do{var W=T.lane,ee=T.eventTime;if((c&W)===W){q!==null&&(q=q.next={eventTime:ee,lane:0,tag:T.tag,payload:T.payload,callback:T.callback,next:null});e:{var ie=n,se=T;switch(W=r,ee=a,se.tag){case 1:if(ie=se.payload,typeof ie=="function"){Q=ie.call(ee,Q,W);break e}Q=ie;break e;case 3:ie.flags=ie.flags&-65537|128;case 0:if(ie=se.payload,W=typeof ie=="function"?ie.call(ee,Q,W):ie,W==null)break e;Q=ne({},Q,W);break e;case 2:Qr=!0}}T.callback!==null&&T.lane!==0&&(n.flags|=64,W=d.effects,W===null?d.effects=[T]:W.push(T))}else ee={eventTime:ee,lane:W,tag:T.tag,payload:T.payload,callback:T.callback,next:null},q===null?(F=q=ee,C=Q):q=q.next=ee,_|=W;if(T=T.next,T===null){if(T=d.shared.pending,T===null)break;W=T,T=W.next,W.next=null,d.lastBaseUpdate=W,d.shared.pending=null}}while(!0);if(q===null&&(C=Q),d.baseState=C,d.firstBaseUpdate=F,d.lastBaseUpdate=q,r=d.shared.interleaved,r!==null){d=r;do _|=d.lane,d=d.next;while(d!==r)}else p===null&&(d.shared.lanes=0);$i|=_,n.lanes=_,n.memoizedState=Q}}function pp(n,r,a){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var c=n[r],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var ua={},Gn=qr(ua),ca=qr(ua),ha=qr(ua);function zi(n){if(n===ua)throw Error(t(174));return n}function th(n,r){switch(He(ha,r),He(ca,n),He(Gn,ua),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:ht(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=ht(r,n)}qe(Gn),He(Gn,r)}function Qs(){qe(Gn),qe(ca),qe(ha)}function mp(n){zi(ha.current);var r=zi(Gn.current),a=ht(r,n.type);r!==a&&(He(ca,n),He(Gn,a))}function nh(n){ca.current===n&&(qe(Gn),qe(ca))}var Je=qr(0);function Bl(n){for(var r=n;r!==null;){if(r.tag===13){var a=r.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var rh=[];function ih(){for(var n=0;n<rh.length;n++)rh[n]._workInProgressVersionPrimary=null;rh.length=0}var $l=we.ReactCurrentDispatcher,sh=we.ReactCurrentBatchConfig,Bi=0,Ye=null,ft=null,vt=null,Hl=!1,da=!1,fa=0,vE=0;function Ot(){throw Error(t(321))}function oh(n,r){if(r===null)return!1;for(var a=0;a<r.length&&a<n.length;a++)if(!Nn(n[a],r[a]))return!1;return!0}function ah(n,r,a,c,d,p){if(Bi=p,Ye=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,$l.current=n===null||n.memoizedState===null?IE:SE,n=a(c,d),da){p=0;do{if(da=!1,fa=0,25<=p)throw Error(t(301));p+=1,vt=ft=null,r.updateQueue=null,$l.current=AE,n=a(c,d)}while(da)}if($l.current=Kl,r=ft!==null&&ft.next!==null,Bi=0,vt=ft=Ye=null,Hl=!1,r)throw Error(t(300));return n}function lh(){var n=fa!==0;return fa=0,n}function Qn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return vt===null?Ye.memoizedState=vt=n:vt=vt.next=n,vt}function gn(){if(ft===null){var n=Ye.alternate;n=n!==null?n.memoizedState:null}else n=ft.next;var r=vt===null?Ye.memoizedState:vt.next;if(r!==null)vt=r,ft=n;else{if(n===null)throw Error(t(310));ft=n,n={memoizedState:ft.memoizedState,baseState:ft.baseState,baseQueue:ft.baseQueue,queue:ft.queue,next:null},vt===null?Ye.memoizedState=vt=n:vt=vt.next=n}return vt}function pa(n,r){return typeof r=="function"?r(n):r}function uh(n){var r=gn(),a=r.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=ft,d=c.baseQueue,p=a.pending;if(p!==null){if(d!==null){var _=d.next;d.next=p.next,p.next=_}c.baseQueue=d=p,a.pending=null}if(d!==null){p=d.next,c=c.baseState;var T=_=null,C=null,F=p;do{var q=F.lane;if((Bi&q)===q)C!==null&&(C=C.next={lane:0,action:F.action,hasEagerState:F.hasEagerState,eagerState:F.eagerState,next:null}),c=F.hasEagerState?F.eagerState:n(c,F.action);else{var Q={lane:q,action:F.action,hasEagerState:F.hasEagerState,eagerState:F.eagerState,next:null};C===null?(T=C=Q,_=c):C=C.next=Q,Ye.lanes|=q,$i|=q}F=F.next}while(F!==null&&F!==p);C===null?_=c:C.next=T,Nn(c,r.memoizedState)||(Qt=!0),r.memoizedState=c,r.baseState=_,r.baseQueue=C,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do p=d.lane,Ye.lanes|=p,$i|=p,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[r.memoizedState,a.dispatch]}function ch(n){var r=gn(),a=r.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,p=r.memoizedState;if(d!==null){a.pending=null;var _=d=d.next;do p=n(p,_.action),_=_.next;while(_!==d);Nn(p,r.memoizedState)||(Qt=!0),r.memoizedState=p,r.baseQueue===null&&(r.baseState=p),a.lastRenderedState=p}return[p,c]}function gp(){}function yp(n,r){var a=Ye,c=gn(),d=r(),p=!Nn(c.memoizedState,d);if(p&&(c.memoizedState=d,Qt=!0),c=c.queue,hh(Ep.bind(null,a,c,n),[n]),c.getSnapshot!==r||p||vt!==null&&vt.memoizedState.tag&1){if(a.flags|=2048,ma(9,vp.bind(null,a,c,d,r),void 0,null),Et===null)throw Error(t(349));(Bi&30)!==0||_p(a,r,d)}return d}function _p(n,r,a){n.flags|=16384,n={getSnapshot:r,value:a},r=Ye.updateQueue,r===null?(r={lastEffect:null,stores:null},Ye.updateQueue=r,r.stores=[n]):(a=r.stores,a===null?r.stores=[n]:a.push(n))}function vp(n,r,a,c){r.value=a,r.getSnapshot=c,wp(r)&&Tp(n)}function Ep(n,r,a){return a(function(){wp(r)&&Tp(n)})}function wp(n){var r=n.getSnapshot;n=n.value;try{var a=r();return!Nn(n,a)}catch{return!0}}function Tp(n){var r=Er(n,1);r!==null&&Ln(r,n,1,-1)}function Ip(n){var r=Qn();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:pa,lastRenderedState:n},r.queue=n,n=n.dispatch=TE.bind(null,Ye,n),[r.memoizedState,n]}function ma(n,r,a,c){return n={tag:n,create:r,destroy:a,deps:c,next:null},r=Ye.updateQueue,r===null?(r={lastEffect:null,stores:null},Ye.updateQueue=r,r.lastEffect=n.next=n):(a=r.lastEffect,a===null?r.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,r.lastEffect=n)),n}function Sp(){return gn().memoizedState}function Wl(n,r,a,c){var d=Qn();Ye.flags|=n,d.memoizedState=ma(1|r,a,void 0,c===void 0?null:c)}function ql(n,r,a,c){var d=gn();c=c===void 0?null:c;var p=void 0;if(ft!==null){var _=ft.memoizedState;if(p=_.destroy,c!==null&&oh(c,_.deps)){d.memoizedState=ma(r,a,p,c);return}}Ye.flags|=n,d.memoizedState=ma(1|r,a,p,c)}function Ap(n,r){return Wl(8390656,8,n,r)}function hh(n,r){return ql(2048,8,n,r)}function Rp(n,r){return ql(4,2,n,r)}function Cp(n,r){return ql(4,4,n,r)}function Pp(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function kp(n,r,a){return a=a!=null?a.concat([n]):null,ql(4,4,Pp.bind(null,r,n),a)}function dh(){}function Np(n,r){var a=gn();r=r===void 0?null:r;var c=a.memoizedState;return c!==null&&r!==null&&oh(r,c[1])?c[0]:(a.memoizedState=[n,r],n)}function Dp(n,r){var a=gn();r=r===void 0?null:r;var c=a.memoizedState;return c!==null&&r!==null&&oh(r,c[1])?c[0]:(n=n(),a.memoizedState=[n,r],n)}function xp(n,r,a){return(Bi&21)===0?(n.baseState&&(n.baseState=!1,Qt=!0),n.memoizedState=a):(Nn(a,r)||(a=Di(),Ye.lanes|=a,$i|=a,n.baseState=!0),r)}function EE(n,r){var a=ke;ke=a!==0&&4>a?a:4,n(!0);var c=sh.transition;sh.transition={};try{n(!1),r()}finally{ke=a,sh.transition=c}}function Vp(){return gn().memoizedState}function wE(n,r,a){var c=ei(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},Op(n))Lp(r,a);else if(a=hp(n,r,a,c),a!==null){var d=Ht();Ln(a,n,c,d),Mp(a,r,c)}}function TE(n,r,a){var c=ei(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(Op(n))Lp(r,d);else{var p=n.alternate;if(n.lanes===0&&(p===null||p.lanes===0)&&(p=r.lastRenderedReducer,p!==null))try{var _=r.lastRenderedState,T=p(_,a);if(d.hasEagerState=!0,d.eagerState=T,Nn(T,_)){var C=r.interleaved;C===null?(d.next=d,Zc(r)):(d.next=C.next,C.next=d),r.interleaved=d;return}}catch{}finally{}a=hp(n,r,d,c),a!==null&&(d=Ht(),Ln(a,n,c,d),Mp(a,r,c))}}function Op(n){var r=n.alternate;return n===Ye||r!==null&&r===Ye}function Lp(n,r){da=Hl=!0;var a=n.pending;a===null?r.next=r:(r.next=a.next,a.next=r),n.pending=r}function Mp(n,r,a){if((a&4194240)!==0){var c=r.lanes;c&=n.pendingLanes,a|=c,r.lanes=a,Ur(n,a)}}var Kl={readContext:mn,useCallback:Ot,useContext:Ot,useEffect:Ot,useImperativeHandle:Ot,useInsertionEffect:Ot,useLayoutEffect:Ot,useMemo:Ot,useReducer:Ot,useRef:Ot,useState:Ot,useDebugValue:Ot,useDeferredValue:Ot,useTransition:Ot,useMutableSource:Ot,useSyncExternalStore:Ot,useId:Ot,unstable_isNewReconciler:!1},IE={readContext:mn,useCallback:function(n,r){return Qn().memoizedState=[n,r===void 0?null:r],n},useContext:mn,useEffect:Ap,useImperativeHandle:function(n,r,a){return a=a!=null?a.concat([n]):null,Wl(4194308,4,Pp.bind(null,r,n),a)},useLayoutEffect:function(n,r){return Wl(4194308,4,n,r)},useInsertionEffect:function(n,r){return Wl(4,2,n,r)},useMemo:function(n,r){var a=Qn();return r=r===void 0?null:r,n=n(),a.memoizedState=[n,r],n},useReducer:function(n,r,a){var c=Qn();return r=a!==void 0?a(r):r,c.memoizedState=c.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},c.queue=n,n=n.dispatch=wE.bind(null,Ye,n),[c.memoizedState,n]},useRef:function(n){var r=Qn();return n={current:n},r.memoizedState=n},useState:Ip,useDebugValue:dh,useDeferredValue:function(n){return Qn().memoizedState=n},useTransition:function(){var n=Ip(!1),r=n[0];return n=EE.bind(null,n[1]),Qn().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,a){var c=Ye,d=Qn();if(Xe){if(a===void 0)throw Error(t(407));a=a()}else{if(a=r(),Et===null)throw Error(t(349));(Bi&30)!==0||_p(c,r,a)}d.memoizedState=a;var p={value:a,getSnapshot:r};return d.queue=p,Ap(Ep.bind(null,c,p,n),[n]),c.flags|=2048,ma(9,vp.bind(null,c,p,a,r),void 0,null),a},useId:function(){var n=Qn(),r=Et.identifierPrefix;if(Xe){var a=vr,c=_r;a=(c&~(1<<32-zt(c)-1)).toString(32)+a,r=":"+r+"R"+a,a=fa++,0<a&&(r+="H"+a.toString(32)),r+=":"}else a=vE++,r=":"+r+"r"+a.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},SE={readContext:mn,useCallback:Np,useContext:mn,useEffect:hh,useImperativeHandle:kp,useInsertionEffect:Rp,useLayoutEffect:Cp,useMemo:Dp,useReducer:uh,useRef:Sp,useState:function(){return uh(pa)},useDebugValue:dh,useDeferredValue:function(n){var r=gn();return xp(r,ft.memoizedState,n)},useTransition:function(){var n=uh(pa)[0],r=gn().memoizedState;return[n,r]},useMutableSource:gp,useSyncExternalStore:yp,useId:Vp,unstable_isNewReconciler:!1},AE={readContext:mn,useCallback:Np,useContext:mn,useEffect:hh,useImperativeHandle:kp,useInsertionEffect:Rp,useLayoutEffect:Cp,useMemo:Dp,useReducer:ch,useRef:Sp,useState:function(){return ch(pa)},useDebugValue:dh,useDeferredValue:function(n){var r=gn();return ft===null?r.memoizedState=n:xp(r,ft.memoizedState,n)},useTransition:function(){var n=ch(pa)[0],r=gn().memoizedState;return[n,r]},useMutableSource:gp,useSyncExternalStore:yp,useId:Vp,unstable_isNewReconciler:!1};function xn(n,r){if(n&&n.defaultProps){r=ne({},r),n=n.defaultProps;for(var a in n)r[a]===void 0&&(r[a]=n[a]);return r}return r}function fh(n,r,a,c){r=n.memoizedState,a=a(c,r),a=a==null?r:ne({},r,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Gl={isMounted:function(n){return(n=n._reactInternals)?In(n)===n:!1},enqueueSetState:function(n,r,a){n=n._reactInternals;var c=Ht(),d=ei(n),p=wr(c,d);p.payload=r,a!=null&&(p.callback=a),r=Xr(n,p,d),r!==null&&(Ln(r,n,d,c),jl(r,n,d))},enqueueReplaceState:function(n,r,a){n=n._reactInternals;var c=Ht(),d=ei(n),p=wr(c,d);p.tag=1,p.payload=r,a!=null&&(p.callback=a),r=Xr(n,p,d),r!==null&&(Ln(r,n,d,c),jl(r,n,d))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var a=Ht(),c=ei(n),d=wr(a,c);d.tag=2,r!=null&&(d.callback=r),r=Xr(n,d,c),r!==null&&(Ln(r,n,c,a),jl(r,n,c))}};function bp(n,r,a,c,d,p,_){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,p,_):r.prototype&&r.prototype.isPureReactComponent?!ta(a,c)||!ta(d,p):!0}function Fp(n,r,a){var c=!1,d=Kr,p=r.contextType;return typeof p=="object"&&p!==null?p=mn(p):(d=Gt(r)?bi:Vt.current,c=r.contextTypes,p=(c=c!=null)?Bs(n,d):Kr),r=new r(a,p),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=Gl,n.stateNode=r,r._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=p),r}function Up(n,r,a,c){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(a,c),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(a,c),r.state!==n&&Gl.enqueueReplaceState(r,r.state,null)}function ph(n,r,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},eh(n);var p=r.contextType;typeof p=="object"&&p!==null?d.context=mn(p):(p=Gt(r)?bi:Vt.current,d.context=Bs(n,p)),d.state=n.memoizedState,p=r.getDerivedStateFromProps,typeof p=="function"&&(fh(n,r,p,a),d.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(r=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),r!==d.state&&Gl.enqueueReplaceState(d,d.state,null),zl(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function Xs(n,r){try{var a="",c=r;do a+=Se(c),c=c.return;while(c);var d=a}catch(p){d=`
Error generating stack: `+p.message+`
`+p.stack}return{value:n,source:r,stack:d,digest:null}}function mh(n,r,a){return{value:n,source:null,stack:a??null,digest:r??null}}function gh(n,r){try{console.error(r.value)}catch(a){setTimeout(function(){throw a})}}var RE=typeof WeakMap=="function"?WeakMap:Map;function jp(n,r,a){a=wr(-1,a),a.tag=3,a.payload={element:null};var c=r.value;return a.callback=function(){tu||(tu=!0,Dh=c),gh(n,r)},a}function zp(n,r,a){a=wr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=r.value;a.payload=function(){return c(d)},a.callback=function(){gh(n,r)}}var p=n.stateNode;return p!==null&&typeof p.componentDidCatch=="function"&&(a.callback=function(){gh(n,r),typeof c!="function"&&(Yr===null?Yr=new Set([this]):Yr.add(this));var _=r.stack;this.componentDidCatch(r.value,{componentStack:_!==null?_:""})}),a}function Bp(n,r,a){var c=n.pingCache;if(c===null){c=n.pingCache=new RE;var d=new Set;c.set(r,d)}else d=c.get(r),d===void 0&&(d=new Set,c.set(r,d));d.has(a)||(d.add(a),n=jE.bind(null,n,r,a),r.then(n,n))}function $p(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function Hp(n,r,a,c,d){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(r=wr(-1,1),r.tag=2,Xr(a,r,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var CE=we.ReactCurrentOwner,Qt=!1;function $t(n,r,a,c){r.child=n===null?cp(r,null,a,c):qs(r,n.child,a,c)}function Wp(n,r,a,c,d){a=a.render;var p=r.ref;return Gs(r,d),c=ah(n,r,a,c,p,d),a=lh(),n!==null&&!Qt?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~d,Tr(n,r,d)):(Xe&&a&&Hc(r),r.flags|=1,$t(n,r,c,d),r.child)}function qp(n,r,a,c,d){if(n===null){var p=a.type;return typeof p=="function"&&!Fh(p)&&p.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(r.tag=15,r.type=p,Kp(n,r,p,c,d)):(n=au(a.type,null,c,r,r.mode,d),n.ref=r.ref,n.return=r,r.child=n)}if(p=n.child,(n.lanes&d)===0){var _=p.memoizedProps;if(a=a.compare,a=a!==null?a:ta,a(_,c)&&n.ref===r.ref)return Tr(n,r,d)}return r.flags|=1,n=ni(p,c),n.ref=r.ref,n.return=r,r.child=n}function Kp(n,r,a,c,d){if(n!==null){var p=n.memoizedProps;if(ta(p,c)&&n.ref===r.ref)if(Qt=!1,r.pendingProps=c=p,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Qt=!0);else return r.lanes=n.lanes,Tr(n,r,d)}return yh(n,r,a,c,d)}function Gp(n,r,a){var c=r.pendingProps,d=c.children,p=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},He(Ys,an),an|=a;else{if((a&1073741824)===0)return n=p!==null?p.baseLanes|a:a,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,He(Ys,an),an|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=p!==null?p.baseLanes:a,He(Ys,an),an|=c}else p!==null?(c=p.baseLanes|a,r.memoizedState=null):c=a,He(Ys,an),an|=c;return $t(n,r,d,a),r.child}function Qp(n,r){var a=r.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(r.flags|=512,r.flags|=2097152)}function yh(n,r,a,c,d){var p=Gt(a)?bi:Vt.current;return p=Bs(r,p),Gs(r,d),a=ah(n,r,a,c,p,d),c=lh(),n!==null&&!Qt?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~d,Tr(n,r,d)):(Xe&&c&&Hc(r),r.flags|=1,$t(n,r,a,d),r.child)}function Xp(n,r,a,c,d){if(Gt(a)){var p=!0;xl(r)}else p=!1;if(Gs(r,d),r.stateNode===null)Xl(n,r),Fp(r,a,c),ph(r,a,c,d),c=!0;else if(n===null){var _=r.stateNode,T=r.memoizedProps;_.props=T;var C=_.context,F=a.contextType;typeof F=="object"&&F!==null?F=mn(F):(F=Gt(a)?bi:Vt.current,F=Bs(r,F));var q=a.getDerivedStateFromProps,Q=typeof q=="function"||typeof _.getSnapshotBeforeUpdate=="function";Q||typeof _.UNSAFE_componentWillReceiveProps!="function"&&typeof _.componentWillReceiveProps!="function"||(T!==c||C!==F)&&Up(r,_,c,F),Qr=!1;var W=r.memoizedState;_.state=W,zl(r,c,_,d),C=r.memoizedState,T!==c||W!==C||Kt.current||Qr?(typeof q=="function"&&(fh(r,a,q,c),C=r.memoizedState),(T=Qr||bp(r,a,T,c,W,C,F))?(Q||typeof _.UNSAFE_componentWillMount!="function"&&typeof _.componentWillMount!="function"||(typeof _.componentWillMount=="function"&&_.componentWillMount(),typeof _.UNSAFE_componentWillMount=="function"&&_.UNSAFE_componentWillMount()),typeof _.componentDidMount=="function"&&(r.flags|=4194308)):(typeof _.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=c,r.memoizedState=C),_.props=c,_.state=C,_.context=F,c=T):(typeof _.componentDidMount=="function"&&(r.flags|=4194308),c=!1)}else{_=r.stateNode,dp(n,r),T=r.memoizedProps,F=r.type===r.elementType?T:xn(r.type,T),_.props=F,Q=r.pendingProps,W=_.context,C=a.contextType,typeof C=="object"&&C!==null?C=mn(C):(C=Gt(a)?bi:Vt.current,C=Bs(r,C));var ee=a.getDerivedStateFromProps;(q=typeof ee=="function"||typeof _.getSnapshotBeforeUpdate=="function")||typeof _.UNSAFE_componentWillReceiveProps!="function"&&typeof _.componentWillReceiveProps!="function"||(T!==Q||W!==C)&&Up(r,_,c,C),Qr=!1,W=r.memoizedState,_.state=W,zl(r,c,_,d);var ie=r.memoizedState;T!==Q||W!==ie||Kt.current||Qr?(typeof ee=="function"&&(fh(r,a,ee,c),ie=r.memoizedState),(F=Qr||bp(r,a,F,c,W,ie,C)||!1)?(q||typeof _.UNSAFE_componentWillUpdate!="function"&&typeof _.componentWillUpdate!="function"||(typeof _.componentWillUpdate=="function"&&_.componentWillUpdate(c,ie,C),typeof _.UNSAFE_componentWillUpdate=="function"&&_.UNSAFE_componentWillUpdate(c,ie,C)),typeof _.componentDidUpdate=="function"&&(r.flags|=4),typeof _.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof _.componentDidUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(r.flags|=4),typeof _.getSnapshotBeforeUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(r.flags|=1024),r.memoizedProps=c,r.memoizedState=ie),_.props=c,_.state=ie,_.context=C,c=F):(typeof _.componentDidUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(r.flags|=4),typeof _.getSnapshotBeforeUpdate!="function"||T===n.memoizedProps&&W===n.memoizedState||(r.flags|=1024),c=!1)}return _h(n,r,a,c,p,d)}function _h(n,r,a,c,d,p){Qp(n,r);var _=(r.flags&128)!==0;if(!c&&!_)return d&&tp(r,a,!1),Tr(n,r,p);c=r.stateNode,CE.current=r;var T=_&&typeof a.getDerivedStateFromError!="function"?null:c.render();return r.flags|=1,n!==null&&_?(r.child=qs(r,n.child,null,p),r.child=qs(r,null,T,p)):$t(n,r,T,p),r.memoizedState=c.state,d&&tp(r,a,!0),r.child}function Jp(n){var r=n.stateNode;r.pendingContext?Zf(n,r.pendingContext,r.pendingContext!==r.context):r.context&&Zf(n,r.context,!1),th(n,r.containerInfo)}function Yp(n,r,a,c,d){return Ws(),Gc(d),r.flags|=256,$t(n,r,a,c),r.child}var vh={dehydrated:null,treeContext:null,retryLane:0};function Eh(n){return{baseLanes:n,cachePool:null,transitions:null}}function Zp(n,r,a){var c=r.pendingProps,d=Je.current,p=!1,_=(r.flags&128)!==0,T;if((T=_)||(T=n!==null&&n.memoizedState===null?!1:(d&2)!==0),T?(p=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),He(Je,d&1),n===null)return Kc(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(_=c.children,n=c.fallback,p?(c=r.mode,p=r.child,_={mode:"hidden",children:_},(c&1)===0&&p!==null?(p.childLanes=0,p.pendingProps=_):p=lu(_,c,0,null),n=Ki(n,c,a,null),p.return=r,n.return=r,p.sibling=n,r.child=p,r.child.memoizedState=Eh(a),r.memoizedState=vh,n):wh(r,_));if(d=n.memoizedState,d!==null&&(T=d.dehydrated,T!==null))return PE(n,r,_,c,T,d,a);if(p){p=c.fallback,_=r.mode,d=n.child,T=d.sibling;var C={mode:"hidden",children:c.children};return(_&1)===0&&r.child!==d?(c=r.child,c.childLanes=0,c.pendingProps=C,r.deletions=null):(c=ni(d,C),c.subtreeFlags=d.subtreeFlags&14680064),T!==null?p=ni(T,p):(p=Ki(p,_,a,null),p.flags|=2),p.return=r,c.return=r,c.sibling=p,r.child=c,c=p,p=r.child,_=n.child.memoizedState,_=_===null?Eh(a):{baseLanes:_.baseLanes|a,cachePool:null,transitions:_.transitions},p.memoizedState=_,p.childLanes=n.childLanes&~a,r.memoizedState=vh,c}return p=n.child,n=p.sibling,c=ni(p,{mode:"visible",children:c.children}),(r.mode&1)===0&&(c.lanes=a),c.return=r,c.sibling=null,n!==null&&(a=r.deletions,a===null?(r.deletions=[n],r.flags|=16):a.push(n)),r.child=c,r.memoizedState=null,c}function wh(n,r){return r=lu({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function Ql(n,r,a,c){return c!==null&&Gc(c),qs(r,n.child,null,a),n=wh(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function PE(n,r,a,c,d,p,_){if(a)return r.flags&256?(r.flags&=-257,c=mh(Error(t(422))),Ql(n,r,_,c)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(p=c.fallback,d=r.mode,c=lu({mode:"visible",children:c.children},d,0,null),p=Ki(p,d,_,null),p.flags|=2,c.return=r,p.return=r,c.sibling=p,r.child=c,(r.mode&1)!==0&&qs(r,n.child,null,_),r.child.memoizedState=Eh(_),r.memoizedState=vh,p);if((r.mode&1)===0)return Ql(n,r,_,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var T=c.dgst;return c=T,p=Error(t(419)),c=mh(p,c,void 0),Ql(n,r,_,c)}if(T=(_&n.childLanes)!==0,Qt||T){if(c=Et,c!==null){switch(_&-_){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|_))!==0?0:d,d!==0&&d!==p.retryLane&&(p.retryLane=d,Er(n,d),Ln(c,n,d,-1))}return bh(),c=mh(Error(t(421))),Ql(n,r,_,c)}return d.data==="$?"?(r.flags|=128,r.child=n.child,r=zE.bind(null,n),d._reactRetry=r,null):(n=p.treeContext,on=Wr(d.nextSibling),sn=r,Xe=!0,Dn=null,n!==null&&(fn[pn++]=_r,fn[pn++]=vr,fn[pn++]=Fi,_r=n.id,vr=n.overflow,Fi=r),r=wh(r,c.children),r.flags|=4096,r)}function em(n,r,a){n.lanes|=r;var c=n.alternate;c!==null&&(c.lanes|=r),Yc(n.return,r,a)}function Th(n,r,a,c,d){var p=n.memoizedState;p===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(p.isBackwards=r,p.rendering=null,p.renderingStartTime=0,p.last=c,p.tail=a,p.tailMode=d)}function tm(n,r,a){var c=r.pendingProps,d=c.revealOrder,p=c.tail;if($t(n,r,c.children,a),c=Je.current,(c&2)!==0)c=c&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&em(n,a,r);else if(n.tag===19)em(n,a,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(He(Je,c),(r.mode&1)===0)r.memoizedState=null;else switch(d){case"forwards":for(a=r.child,d=null;a!==null;)n=a.alternate,n!==null&&Bl(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=r.child,r.child=null):(d=a.sibling,a.sibling=null),Th(r,!1,d,a,p);break;case"backwards":for(a=null,d=r.child,r.child=null;d!==null;){if(n=d.alternate,n!==null&&Bl(n)===null){r.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}Th(r,!0,a,null,p);break;case"together":Th(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function Xl(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function Tr(n,r,a){if(n!==null&&(r.dependencies=n.dependencies),$i|=r.lanes,(a&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,a=ni(n,n.pendingProps),r.child=a,a.return=r;n.sibling!==null;)n=n.sibling,a=a.sibling=ni(n,n.pendingProps),a.return=r;a.sibling=null}return r.child}function kE(n,r,a){switch(r.tag){case 3:Jp(r),Ws();break;case 5:mp(r);break;case 1:Gt(r.type)&&xl(r);break;case 4:th(r,r.stateNode.containerInfo);break;case 10:var c=r.type._context,d=r.memoizedProps.value;He(Fl,c._currentValue),c._currentValue=d;break;case 13:if(c=r.memoizedState,c!==null)return c.dehydrated!==null?(He(Je,Je.current&1),r.flags|=128,null):(a&r.child.childLanes)!==0?Zp(n,r,a):(He(Je,Je.current&1),n=Tr(n,r,a),n!==null?n.sibling:null);He(Je,Je.current&1);break;case 19:if(c=(a&r.childLanes)!==0,(n.flags&128)!==0){if(c)return tm(n,r,a);r.flags|=128}if(d=r.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),He(Je,Je.current),c)break;return null;case 22:case 23:return r.lanes=0,Gp(n,r,a)}return Tr(n,r,a)}var nm,Ih,rm,im;nm=function(n,r){for(var a=r.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===r)break;for(;a.sibling===null;){if(a.return===null||a.return===r)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},Ih=function(){},rm=function(n,r,a,c){var d=n.memoizedProps;if(d!==c){n=r.stateNode,zi(Gn.current);var p=null;switch(a){case"input":d=Ei(n,d),c=Ei(n,c),p=[];break;case"select":d=ne({},d,{value:void 0}),c=ne({},c,{value:void 0}),p=[];break;case"textarea":d=No(n,d),c=No(n,c),p=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=kl)}Mo(a,c);var _;a=null;for(F in d)if(!c.hasOwnProperty(F)&&d.hasOwnProperty(F)&&d[F]!=null)if(F==="style"){var T=d[F];for(_ in T)T.hasOwnProperty(_)&&(a||(a={}),a[_]="")}else F!=="dangerouslySetInnerHTML"&&F!=="children"&&F!=="suppressContentEditableWarning"&&F!=="suppressHydrationWarning"&&F!=="autoFocus"&&(o.hasOwnProperty(F)?p||(p=[]):(p=p||[]).push(F,null));for(F in c){var C=c[F];if(T=d?.[F],c.hasOwnProperty(F)&&C!==T&&(C!=null||T!=null))if(F==="style")if(T){for(_ in T)!T.hasOwnProperty(_)||C&&C.hasOwnProperty(_)||(a||(a={}),a[_]="");for(_ in C)C.hasOwnProperty(_)&&T[_]!==C[_]&&(a||(a={}),a[_]=C[_])}else a||(p||(p=[]),p.push(F,a)),a=C;else F==="dangerouslySetInnerHTML"?(C=C?C.__html:void 0,T=T?T.__html:void 0,C!=null&&T!==C&&(p=p||[]).push(F,C)):F==="children"?typeof C!="string"&&typeof C!="number"||(p=p||[]).push(F,""+C):F!=="suppressContentEditableWarning"&&F!=="suppressHydrationWarning"&&(o.hasOwnProperty(F)?(C!=null&&F==="onScroll"&&We("scroll",n),p||T===C||(p=[])):(p=p||[]).push(F,C))}a&&(p=p||[]).push("style",a);var F=p;(r.updateQueue=F)&&(r.flags|=4)}},im=function(n,r,a,c){a!==c&&(r.flags|=4)};function ga(n,r){if(!Xe)switch(n.tailMode){case"hidden":r=n.tail;for(var a=null;r!==null;)r.alternate!==null&&(a=r),r=r.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Lt(n){var r=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(r)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,r}function NE(n,r,a){var c=r.pendingProps;switch(Wc(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Lt(r),null;case 1:return Gt(r.type)&&Dl(),Lt(r),null;case 3:return c=r.stateNode,Qs(),qe(Kt),qe(Vt),ih(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Ml(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,Dn!==null&&(Oh(Dn),Dn=null))),Ih(n,r),Lt(r),null;case 5:nh(r);var d=zi(ha.current);if(a=r.type,n!==null&&r.stateNode!=null)rm(n,r,a,c,d),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!c){if(r.stateNode===null)throw Error(t(166));return Lt(r),null}if(n=zi(Gn.current),Ml(r)){c=r.stateNode,a=r.type;var p=r.memoizedProps;switch(c[Kn]=r,c[oa]=p,n=(r.mode&1)!==0,a){case"dialog":We("cancel",c),We("close",c);break;case"iframe":case"object":case"embed":We("load",c);break;case"video":case"audio":for(d=0;d<ra.length;d++)We(ra[d],c);break;case"source":We("error",c);break;case"img":case"image":case"link":We("error",c),We("load",c);break;case"details":We("toggle",c);break;case"input":cs(c,p),We("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!p.multiple},We("invalid",c);break;case"textarea":ds(c,p),We("invalid",c)}Mo(a,p),d=null;for(var _ in p)if(p.hasOwnProperty(_)){var T=p[_];_==="children"?typeof T=="string"?c.textContent!==T&&(p.suppressHydrationWarning!==!0&&Pl(c.textContent,T,n),d=["children",T]):typeof T=="number"&&c.textContent!==""+T&&(p.suppressHydrationWarning!==!0&&Pl(c.textContent,T,n),d=["children",""+T]):o.hasOwnProperty(_)&&T!=null&&_==="onScroll"&&We("scroll",c)}switch(a){case"input":or(c),el(c,p,!0);break;case"textarea":or(c),Do(c);break;case"select":case"option":break;default:typeof p.onClick=="function"&&(c.onclick=kl)}c=d,r.updateQueue=c,c!==null&&(r.flags|=4)}else{_=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=ct(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=_.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=_.createElement(a,{is:c.is}):(n=_.createElement(a),a==="select"&&(_=n,c.multiple?_.multiple=!0:c.size&&(_.size=c.size))):n=_.createElementNS(n,a),n[Kn]=r,n[oa]=c,nm(n,r,!1,!1),r.stateNode=n;e:{switch(_=bo(a,c),a){case"dialog":We("cancel",n),We("close",n),d=c;break;case"iframe":case"object":case"embed":We("load",n),d=c;break;case"video":case"audio":for(d=0;d<ra.length;d++)We(ra[d],n);d=c;break;case"source":We("error",n),d=c;break;case"img":case"image":case"link":We("error",n),We("load",n),d=c;break;case"details":We("toggle",n),d=c;break;case"input":cs(n,c),d=Ei(n,c),We("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=ne({},c,{value:void 0}),We("invalid",n);break;case"textarea":ds(n,c),d=No(n,c),We("invalid",n);break;default:d=c}Mo(a,d),T=d;for(p in T)if(T.hasOwnProperty(p)){var C=T[p];p==="style"?Oo(n,C):p==="dangerouslySetInnerHTML"?(C=C?C.__html:void 0,C!=null&&xo(n,C)):p==="children"?typeof C=="string"?(a!=="textarea"||C!=="")&&Or(n,C):typeof C=="number"&&Or(n,""+C):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(o.hasOwnProperty(p)?C!=null&&p==="onScroll"&&We("scroll",n):C!=null&&me(n,p,C,_))}switch(a){case"input":or(n),el(n,c,!1);break;case"textarea":or(n),Do(n);break;case"option":c.value!=null&&n.setAttribute("value",""+be(c.value));break;case"select":n.multiple=!!c.multiple,p=c.value,p!=null?lr(n,!!c.multiple,p,!1):c.defaultValue!=null&&lr(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=kl)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return Lt(r),null;case 6:if(n&&r.stateNode!=null)im(n,r,n.memoizedProps,c);else{if(typeof c!="string"&&r.stateNode===null)throw Error(t(166));if(a=zi(ha.current),zi(Gn.current),Ml(r)){if(c=r.stateNode,a=r.memoizedProps,c[Kn]=r,(p=c.nodeValue!==a)&&(n=sn,n!==null))switch(n.tag){case 3:Pl(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Pl(c.nodeValue,a,(n.mode&1)!==0)}p&&(r.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[Kn]=r,r.stateNode=c}return Lt(r),null;case 13:if(qe(Je),c=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Xe&&on!==null&&(r.mode&1)!==0&&(r.flags&128)===0)ap(),Ws(),r.flags|=98560,p=!1;else if(p=Ml(r),c!==null&&c.dehydrated!==null){if(n===null){if(!p)throw Error(t(318));if(p=r.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(t(317));p[Kn]=r}else Ws(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;Lt(r),p=!1}else Dn!==null&&(Oh(Dn),Dn=null),p=!0;if(!p)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=a,r):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(Je.current&1)!==0?pt===0&&(pt=3):bh())),r.updateQueue!==null&&(r.flags|=4),Lt(r),null);case 4:return Qs(),Ih(n,r),n===null&&ia(r.stateNode.containerInfo),Lt(r),null;case 10:return Jc(r.type._context),Lt(r),null;case 17:return Gt(r.type)&&Dl(),Lt(r),null;case 19:if(qe(Je),p=r.memoizedState,p===null)return Lt(r),null;if(c=(r.flags&128)!==0,_=p.rendering,_===null)if(c)ga(p,!1);else{if(pt!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(_=Bl(n),_!==null){for(r.flags|=128,ga(p,!1),c=_.updateQueue,c!==null&&(r.updateQueue=c,r.flags|=4),r.subtreeFlags=0,c=a,a=r.child;a!==null;)p=a,n=c,p.flags&=14680066,_=p.alternate,_===null?(p.childLanes=0,p.lanes=n,p.child=null,p.subtreeFlags=0,p.memoizedProps=null,p.memoizedState=null,p.updateQueue=null,p.dependencies=null,p.stateNode=null):(p.childLanes=_.childLanes,p.lanes=_.lanes,p.child=_.child,p.subtreeFlags=0,p.deletions=null,p.memoizedProps=_.memoizedProps,p.memoizedState=_.memoizedState,p.updateQueue=_.updateQueue,p.type=_.type,n=_.dependencies,p.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return He(Je,Je.current&1|2),r.child}n=n.sibling}p.tail!==null&&$e()>Zs&&(r.flags|=128,c=!0,ga(p,!1),r.lanes=4194304)}else{if(!c)if(n=Bl(_),n!==null){if(r.flags|=128,c=!0,a=n.updateQueue,a!==null&&(r.updateQueue=a,r.flags|=4),ga(p,!0),p.tail===null&&p.tailMode==="hidden"&&!_.alternate&&!Xe)return Lt(r),null}else 2*$e()-p.renderingStartTime>Zs&&a!==1073741824&&(r.flags|=128,c=!0,ga(p,!1),r.lanes=4194304);p.isBackwards?(_.sibling=r.child,r.child=_):(a=p.last,a!==null?a.sibling=_:r.child=_,p.last=_)}return p.tail!==null?(r=p.tail,p.rendering=r,p.tail=r.sibling,p.renderingStartTime=$e(),r.sibling=null,a=Je.current,He(Je,c?a&1|2:a&1),r):(Lt(r),null);case 22:case 23:return Mh(),c=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(r.flags|=8192),c&&(r.mode&1)!==0?(an&1073741824)!==0&&(Lt(r),r.subtreeFlags&6&&(r.flags|=8192)):Lt(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function DE(n,r){switch(Wc(r),r.tag){case 1:return Gt(r.type)&&Dl(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return Qs(),qe(Kt),qe(Vt),ih(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return nh(r),null;case 13:if(qe(Je),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));Ws()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return qe(Je),null;case 4:return Qs(),null;case 10:return Jc(r.type._context),null;case 22:case 23:return Mh(),null;case 24:return null;default:return null}}var Jl=!1,Mt=!1,xE=typeof WeakSet=="function"?WeakSet:Set,re=null;function Js(n,r){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){tt(n,r,c)}else a.current=null}function Sh(n,r,a){try{a()}catch(c){tt(n,r,c)}}var sm=!1;function VE(n,r){if(Mc=Br,n=bf(),Pc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,p=c.focusNode;c=c.focusOffset;try{a.nodeType,p.nodeType}catch{a=null;break e}var _=0,T=-1,C=-1,F=0,q=0,Q=n,W=null;t:for(;;){for(var ee;Q!==a||d!==0&&Q.nodeType!==3||(T=_+d),Q!==p||c!==0&&Q.nodeType!==3||(C=_+c),Q.nodeType===3&&(_+=Q.nodeValue.length),(ee=Q.firstChild)!==null;)W=Q,Q=ee;for(;;){if(Q===n)break t;if(W===a&&++F===d&&(T=_),W===p&&++q===c&&(C=_),(ee=Q.nextSibling)!==null)break;Q=W,W=Q.parentNode}Q=ee}a=T===-1||C===-1?null:{start:T,end:C}}else a=null}a=a||{start:0,end:0}}else a=null;for(bc={focusedElem:n,selectionRange:a},Br=!1,re=r;re!==null;)if(r=re,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,re=n;else for(;re!==null;){r=re;try{var ie=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(ie!==null){var se=ie.memoizedProps,it=ie.memoizedState,M=r.stateNode,N=M.getSnapshotBeforeUpdate(r.elementType===r.type?se:xn(r.type,se),it);M.__reactInternalSnapshotBeforeUpdate=N}break;case 3:var b=r.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(X){tt(r,r.return,X)}if(n=r.sibling,n!==null){n.return=r.return,re=n;break}re=r.return}return ie=sm,sm=!1,ie}function ya(n,r,a){var c=r.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var p=d.destroy;d.destroy=void 0,p!==void 0&&Sh(r,a,p)}d=d.next}while(d!==c)}}function Yl(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var a=r=r.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==r)}}function Ah(n){var r=n.ref;if(r!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof r=="function"?r(n):r.current=n}}function om(n){var r=n.alternate;r!==null&&(n.alternate=null,om(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Kn],delete r[oa],delete r[zc],delete r[mE],delete r[gE])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function am(n){return n.tag===5||n.tag===3||n.tag===4}function lm(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||am(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Rh(n,r,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,r?a.nodeType===8?a.parentNode.insertBefore(n,r):a.insertBefore(n,r):(a.nodeType===8?(r=a.parentNode,r.insertBefore(n,a)):(r=a,r.appendChild(n)),a=a._reactRootContainer,a!=null||r.onclick!==null||(r.onclick=kl));else if(c!==4&&(n=n.child,n!==null))for(Rh(n,r,a),n=n.sibling;n!==null;)Rh(n,r,a),n=n.sibling}function Ch(n,r,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,r?a.insertBefore(n,r):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Ch(n,r,a),n=n.sibling;n!==null;)Ch(n,r,a),n=n.sibling}var Rt=null,Vn=!1;function Jr(n,r,a){for(a=a.child;a!==null;)um(n,r,a),a=a.sibling}function um(n,r,a){if(en&&typeof en.onCommitFiberUnmount=="function")try{en.onCommitFiberUnmount(ki,a)}catch{}switch(a.tag){case 5:Mt||Js(a,r);case 6:var c=Rt,d=Vn;Rt=null,Jr(n,r,a),Rt=c,Vn=d,Rt!==null&&(Vn?(n=Rt,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Rt.removeChild(a.stateNode));break;case 18:Rt!==null&&(Vn?(n=Rt,a=a.stateNode,n.nodeType===8?jc(n.parentNode,a):n.nodeType===1&&jc(n,a),Pn(n)):jc(Rt,a.stateNode));break;case 4:c=Rt,d=Vn,Rt=a.stateNode.containerInfo,Vn=!0,Jr(n,r,a),Rt=c,Vn=d;break;case 0:case 11:case 14:case 15:if(!Mt&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var p=d,_=p.destroy;p=p.tag,_!==void 0&&((p&2)!==0||(p&4)!==0)&&Sh(a,r,_),d=d.next}while(d!==c)}Jr(n,r,a);break;case 1:if(!Mt&&(Js(a,r),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(T){tt(a,r,T)}Jr(n,r,a);break;case 21:Jr(n,r,a);break;case 22:a.mode&1?(Mt=(c=Mt)||a.memoizedState!==null,Jr(n,r,a),Mt=c):Jr(n,r,a);break;default:Jr(n,r,a)}}function cm(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new xE),r.forEach(function(c){var d=BE.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function On(n,r){var a=r.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var p=n,_=r,T=_;e:for(;T!==null;){switch(T.tag){case 5:Rt=T.stateNode,Vn=!1;break e;case 3:Rt=T.stateNode.containerInfo,Vn=!0;break e;case 4:Rt=T.stateNode.containerInfo,Vn=!0;break e}T=T.return}if(Rt===null)throw Error(t(160));um(p,_,d),Rt=null,Vn=!1;var C=d.alternate;C!==null&&(C.return=null),d.return=null}catch(F){tt(d,r,F)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)hm(r,n),r=r.sibling}function hm(n,r){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(On(r,n),Xn(n),c&4){try{ya(3,n,n.return),Yl(3,n)}catch(se){tt(n,n.return,se)}try{ya(5,n,n.return)}catch(se){tt(n,n.return,se)}}break;case 1:On(r,n),Xn(n),c&512&&a!==null&&Js(a,a.return);break;case 5:if(On(r,n),Xn(n),c&512&&a!==null&&Js(a,a.return),n.flags&32){var d=n.stateNode;try{Or(d,"")}catch(se){tt(n,n.return,se)}}if(c&4&&(d=n.stateNode,d!=null)){var p=n.memoizedProps,_=a!==null?a.memoizedProps:p,T=n.type,C=n.updateQueue;if(n.updateQueue=null,C!==null)try{T==="input"&&p.type==="radio"&&p.name!=null&&Po(d,p),bo(T,_);var F=bo(T,p);for(_=0;_<C.length;_+=2){var q=C[_],Q=C[_+1];q==="style"?Oo(d,Q):q==="dangerouslySetInnerHTML"?xo(d,Q):q==="children"?Or(d,Q):me(d,q,Q,F)}switch(T){case"input":ko(d,p);break;case"textarea":fs(d,p);break;case"select":var W=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!p.multiple;var ee=p.value;ee!=null?lr(d,!!p.multiple,ee,!1):W!==!!p.multiple&&(p.defaultValue!=null?lr(d,!!p.multiple,p.defaultValue,!0):lr(d,!!p.multiple,p.multiple?[]:"",!1))}d[oa]=p}catch(se){tt(n,n.return,se)}}break;case 6:if(On(r,n),Xn(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,p=n.memoizedProps;try{d.nodeValue=p}catch(se){tt(n,n.return,se)}}break;case 3:if(On(r,n),Xn(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{Pn(r.containerInfo)}catch(se){tt(n,n.return,se)}break;case 4:On(r,n),Xn(n);break;case 13:On(r,n),Xn(n),d=n.child,d.flags&8192&&(p=d.memoizedState!==null,d.stateNode.isHidden=p,!p||d.alternate!==null&&d.alternate.memoizedState!==null||(Nh=$e())),c&4&&cm(n);break;case 22:if(q=a!==null&&a.memoizedState!==null,n.mode&1?(Mt=(F=Mt)||q,On(r,n),Mt=F):On(r,n),Xn(n),c&8192){if(F=n.memoizedState!==null,(n.stateNode.isHidden=F)&&!q&&(n.mode&1)!==0)for(re=n,q=n.child;q!==null;){for(Q=re=q;re!==null;){switch(W=re,ee=W.child,W.tag){case 0:case 11:case 14:case 15:ya(4,W,W.return);break;case 1:Js(W,W.return);var ie=W.stateNode;if(typeof ie.componentWillUnmount=="function"){c=W,a=W.return;try{r=c,ie.props=r.memoizedProps,ie.state=r.memoizedState,ie.componentWillUnmount()}catch(se){tt(c,a,se)}}break;case 5:Js(W,W.return);break;case 22:if(W.memoizedState!==null){pm(Q);continue}}ee!==null?(ee.return=W,re=ee):pm(Q)}q=q.sibling}e:for(q=null,Q=n;;){if(Q.tag===5){if(q===null){q=Q;try{d=Q.stateNode,F?(p=d.style,typeof p.setProperty=="function"?p.setProperty("display","none","important"):p.display="none"):(T=Q.stateNode,C=Q.memoizedProps.style,_=C!=null&&C.hasOwnProperty("display")?C.display:null,T.style.display=Vo("display",_))}catch(se){tt(n,n.return,se)}}}else if(Q.tag===6){if(q===null)try{Q.stateNode.nodeValue=F?"":Q.memoizedProps}catch(se){tt(n,n.return,se)}}else if((Q.tag!==22&&Q.tag!==23||Q.memoizedState===null||Q===n)&&Q.child!==null){Q.child.return=Q,Q=Q.child;continue}if(Q===n)break e;for(;Q.sibling===null;){if(Q.return===null||Q.return===n)break e;q===Q&&(q=null),Q=Q.return}q===Q&&(q=null),Q.sibling.return=Q.return,Q=Q.sibling}}break;case 19:On(r,n),Xn(n),c&4&&cm(n);break;case 21:break;default:On(r,n),Xn(n)}}function Xn(n){var r=n.flags;if(r&2){try{e:{for(var a=n.return;a!==null;){if(am(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Or(d,""),c.flags&=-33);var p=lm(n);Ch(n,p,d);break;case 3:case 4:var _=c.stateNode.containerInfo,T=lm(n);Rh(n,T,_);break;default:throw Error(t(161))}}catch(C){tt(n,n.return,C)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function OE(n,r,a){re=n,dm(n)}function dm(n,r,a){for(var c=(n.mode&1)!==0;re!==null;){var d=re,p=d.child;if(d.tag===22&&c){var _=d.memoizedState!==null||Jl;if(!_){var T=d.alternate,C=T!==null&&T.memoizedState!==null||Mt;T=Jl;var F=Mt;if(Jl=_,(Mt=C)&&!F)for(re=d;re!==null;)_=re,C=_.child,_.tag===22&&_.memoizedState!==null?mm(d):C!==null?(C.return=_,re=C):mm(d);for(;p!==null;)re=p,dm(p),p=p.sibling;re=d,Jl=T,Mt=F}fm(n)}else(d.subtreeFlags&8772)!==0&&p!==null?(p.return=d,re=p):fm(n)}}function fm(n){for(;re!==null;){var r=re;if((r.flags&8772)!==0){var a=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:Mt||Yl(5,r);break;case 1:var c=r.stateNode;if(r.flags&4&&!Mt)if(a===null)c.componentDidMount();else{var d=r.elementType===r.type?a.memoizedProps:xn(r.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var p=r.updateQueue;p!==null&&pp(r,p,c);break;case 3:var _=r.updateQueue;if(_!==null){if(a=null,r.child!==null)switch(r.child.tag){case 5:a=r.child.stateNode;break;case 1:a=r.child.stateNode}pp(r,_,a)}break;case 5:var T=r.stateNode;if(a===null&&r.flags&4){a=T;var C=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":C.autoFocus&&a.focus();break;case"img":C.src&&(a.src=C.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var F=r.alternate;if(F!==null){var q=F.memoizedState;if(q!==null){var Q=q.dehydrated;Q!==null&&Pn(Q)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Mt||r.flags&512&&Ah(r)}catch(W){tt(r,r.return,W)}}if(r===n){re=null;break}if(a=r.sibling,a!==null){a.return=r.return,re=a;break}re=r.return}}function pm(n){for(;re!==null;){var r=re;if(r===n){re=null;break}var a=r.sibling;if(a!==null){a.return=r.return,re=a;break}re=r.return}}function mm(n){for(;re!==null;){var r=re;try{switch(r.tag){case 0:case 11:case 15:var a=r.return;try{Yl(4,r)}catch(C){tt(r,a,C)}break;case 1:var c=r.stateNode;if(typeof c.componentDidMount=="function"){var d=r.return;try{c.componentDidMount()}catch(C){tt(r,d,C)}}var p=r.return;try{Ah(r)}catch(C){tt(r,p,C)}break;case 5:var _=r.return;try{Ah(r)}catch(C){tt(r,_,C)}}}catch(C){tt(r,r.return,C)}if(r===n){re=null;break}var T=r.sibling;if(T!==null){T.return=r.return,re=T;break}re=r.return}}var LE=Math.ceil,Zl=we.ReactCurrentDispatcher,Ph=we.ReactCurrentOwner,yn=we.ReactCurrentBatchConfig,Ve=0,Et=null,at=null,Ct=0,an=0,Ys=qr(0),pt=0,_a=null,$i=0,eu=0,kh=0,va=null,Xt=null,Nh=0,Zs=1/0,Ir=null,tu=!1,Dh=null,Yr=null,nu=!1,Zr=null,ru=0,Ea=0,xh=null,iu=-1,su=0;function Ht(){return(Ve&6)!==0?$e():iu!==-1?iu:iu=$e()}function ei(n){return(n.mode&1)===0?1:(Ve&2)!==0&&Ct!==0?Ct&-Ct:_E.transition!==null?(su===0&&(su=Di()),su):(n=ke,n!==0||(n=window.event,n=n===void 0?16:Go(n.type)),n)}function Ln(n,r,a,c){if(50<Ea)throw Ea=0,xh=null,Error(t(185));Fr(n,a,c),((Ve&2)===0||n!==Et)&&(n===Et&&((Ve&2)===0&&(eu|=a),pt===4&&ti(n,Ct)),Jt(n,c),a===1&&Ve===0&&(r.mode&1)===0&&(Zs=$e()+500,Vl&&Gr()))}function Jt(n,r){var a=n.callbackNode;hr(n,r);var c=Ni(n,n===Et?Ct:0);if(c===0)a!==null&&$o(a),n.callbackNode=null,n.callbackPriority=0;else if(r=c&-c,n.callbackPriority!==r){if(a!=null&&$o(a),r===1)n.tag===0?yE(ym.bind(null,n)):np(ym.bind(null,n)),fE(function(){(Ve&6)===0&&Gr()}),a=null;else{switch(jr(c)){case 1:a=Pi;break;case 4:a=Lr;break;case 16:a=cn;break;case 536870912:a=sl;break;default:a=cn}a=Am(a,gm.bind(null,n))}n.callbackPriority=r,n.callbackNode=a}}function gm(n,r){if(iu=-1,su=0,(Ve&6)!==0)throw Error(t(327));var a=n.callbackNode;if(eo()&&n.callbackNode!==a)return null;var c=Ni(n,n===Et?Ct:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||r)r=ou(n,c);else{r=c;var d=Ve;Ve|=2;var p=vm();(Et!==n||Ct!==r)&&(Ir=null,Zs=$e()+500,Wi(n,r));do try{FE();break}catch(T){_m(n,T)}while(!0);Xc(),Zl.current=p,Ve=d,at!==null?r=0:(Et=null,Ct=0,r=pt)}if(r!==0){if(r===2&&(d=tn(n),d!==0&&(c=d,r=Vh(n,d))),r===1)throw a=_a,Wi(n,0),ti(n,c),Jt(n,$e()),a;if(r===6)ti(n,c);else{if(d=n.current.alternate,(c&30)===0&&!ME(d)&&(r=ou(n,c),r===2&&(p=tn(n),p!==0&&(c=p,r=Vh(n,p))),r===1))throw a=_a,Wi(n,0),ti(n,c),Jt(n,$e()),a;switch(n.finishedWork=d,n.finishedLanes=c,r){case 0:case 1:throw Error(t(345));case 2:qi(n,Xt,Ir);break;case 3:if(ti(n,c),(c&130023424)===c&&(r=Nh+500-$e(),10<r)){if(Ni(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Ht(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=Uc(qi.bind(null,n,Xt,Ir),r);break}qi(n,Xt,Ir);break;case 4:if(ti(n,c),(c&4194240)===c)break;for(r=n.eventTimes,d=-1;0<c;){var _=31-zt(c);p=1<<_,_=r[_],_>d&&(d=_),c&=~p}if(c=d,c=$e()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*LE(c/1960))-c,10<c){n.timeoutHandle=Uc(qi.bind(null,n,Xt,Ir),c);break}qi(n,Xt,Ir);break;case 5:qi(n,Xt,Ir);break;default:throw Error(t(329))}}}return Jt(n,$e()),n.callbackNode===a?gm.bind(null,n):null}function Vh(n,r){var a=va;return n.current.memoizedState.isDehydrated&&(Wi(n,r).flags|=256),n=ou(n,r),n!==2&&(r=Xt,Xt=a,r!==null&&Oh(r)),n}function Oh(n){Xt===null?Xt=n:Xt.push.apply(Xt,n)}function ME(n){for(var r=n;;){if(r.flags&16384){var a=r.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],p=d.getSnapshot;d=d.value;try{if(!Nn(p(),d))return!1}catch{return!1}}}if(a=r.child,r.subtreeFlags&16384&&a!==null)a.return=r,r=a;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function ti(n,r){for(r&=~kh,r&=~eu,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var a=31-zt(r),c=1<<a;n[a]=-1,r&=~c}}function ym(n){if((Ve&6)!==0)throw Error(t(327));eo();var r=Ni(n,0);if((r&1)===0)return Jt(n,$e()),null;var a=ou(n,r);if(n.tag!==0&&a===2){var c=tn(n);c!==0&&(r=c,a=Vh(n,c))}if(a===1)throw a=_a,Wi(n,0),ti(n,r),Jt(n,$e()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,qi(n,Xt,Ir),Jt(n,$e()),null}function Lh(n,r){var a=Ve;Ve|=1;try{return n(r)}finally{Ve=a,Ve===0&&(Zs=$e()+500,Vl&&Gr())}}function Hi(n){Zr!==null&&Zr.tag===0&&(Ve&6)===0&&eo();var r=Ve;Ve|=1;var a=yn.transition,c=ke;try{if(yn.transition=null,ke=1,n)return n()}finally{ke=c,yn.transition=a,Ve=r,(Ve&6)===0&&Gr()}}function Mh(){an=Ys.current,qe(Ys)}function Wi(n,r){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,dE(a)),at!==null)for(a=at.return;a!==null;){var c=a;switch(Wc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&Dl();break;case 3:Qs(),qe(Kt),qe(Vt),ih();break;case 5:nh(c);break;case 4:Qs();break;case 13:qe(Je);break;case 19:qe(Je);break;case 10:Jc(c.type._context);break;case 22:case 23:Mh()}a=a.return}if(Et=n,at=n=ni(n.current,null),Ct=an=r,pt=0,_a=null,kh=eu=$i=0,Xt=va=null,ji!==null){for(r=0;r<ji.length;r++)if(a=ji[r],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,p=a.pending;if(p!==null){var _=p.next;p.next=d,c.next=_}a.pending=c}ji=null}return n}function _m(n,r){do{var a=at;try{if(Xc(),$l.current=Kl,Hl){for(var c=Ye.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}Hl=!1}if(Bi=0,vt=ft=Ye=null,da=!1,fa=0,Ph.current=null,a===null||a.return===null){pt=1,_a=r,at=null;break}e:{var p=n,_=a.return,T=a,C=r;if(r=Ct,T.flags|=32768,C!==null&&typeof C=="object"&&typeof C.then=="function"){var F=C,q=T,Q=q.tag;if((q.mode&1)===0&&(Q===0||Q===11||Q===15)){var W=q.alternate;W?(q.updateQueue=W.updateQueue,q.memoizedState=W.memoizedState,q.lanes=W.lanes):(q.updateQueue=null,q.memoizedState=null)}var ee=$p(_);if(ee!==null){ee.flags&=-257,Hp(ee,_,T,p,r),ee.mode&1&&Bp(p,F,r),r=ee,C=F;var ie=r.updateQueue;if(ie===null){var se=new Set;se.add(C),r.updateQueue=se}else ie.add(C);break e}else{if((r&1)===0){Bp(p,F,r),bh();break e}C=Error(t(426))}}else if(Xe&&T.mode&1){var it=$p(_);if(it!==null){(it.flags&65536)===0&&(it.flags|=256),Hp(it,_,T,p,r),Gc(Xs(C,T));break e}}p=C=Xs(C,T),pt!==4&&(pt=2),va===null?va=[p]:va.push(p),p=_;do{switch(p.tag){case 3:p.flags|=65536,r&=-r,p.lanes|=r;var M=jp(p,C,r);fp(p,M);break e;case 1:T=C;var N=p.type,b=p.stateNode;if((p.flags&128)===0&&(typeof N.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(Yr===null||!Yr.has(b)))){p.flags|=65536,r&=-r,p.lanes|=r;var X=zp(p,T,r);fp(p,X);break e}}p=p.return}while(p!==null)}wm(a)}catch(oe){r=oe,at===a&&a!==null&&(at=a=a.return);continue}break}while(!0)}function vm(){var n=Zl.current;return Zl.current=Kl,n===null?Kl:n}function bh(){(pt===0||pt===3||pt===2)&&(pt=4),Et===null||($i&268435455)===0&&(eu&268435455)===0||ti(Et,Ct)}function ou(n,r){var a=Ve;Ve|=2;var c=vm();(Et!==n||Ct!==r)&&(Ir=null,Wi(n,r));do try{bE();break}catch(d){_m(n,d)}while(!0);if(Xc(),Ve=a,Zl.current=c,at!==null)throw Error(t(261));return Et=null,Ct=0,pt}function bE(){for(;at!==null;)Em(at)}function FE(){for(;at!==null&&!rl();)Em(at)}function Em(n){var r=Sm(n.alternate,n,an);n.memoizedProps=n.pendingProps,r===null?wm(n):at=r,Ph.current=null}function wm(n){var r=n;do{var a=r.alternate;if(n=r.return,(r.flags&32768)===0){if(a=NE(a,r,an),a!==null){at=a;return}}else{if(a=DE(a,r),a!==null){a.flags&=32767,at=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{pt=6,at=null;return}}if(r=r.sibling,r!==null){at=r;return}at=r=n}while(r!==null);pt===0&&(pt=5)}function qi(n,r,a){var c=ke,d=yn.transition;try{yn.transition=null,ke=1,UE(n,r,a,c)}finally{yn.transition=d,ke=c}return null}function UE(n,r,a,c){do eo();while(Zr!==null);if((Ve&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var p=a.lanes|a.childLanes;if(ze(n,p),n===Et&&(at=Et=null,Ct=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||nu||(nu=!0,Am(cn,function(){return eo(),null})),p=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||p){p=yn.transition,yn.transition=null;var _=ke;ke=1;var T=Ve;Ve|=4,Ph.current=null,VE(n,a),hm(a,n),sE(bc),Br=!!Mc,bc=Mc=null,n.current=a,OE(a),Ec(),Ve=T,ke=_,yn.transition=p}else n.current=a;if(nu&&(nu=!1,Zr=n,ru=d),p=n.pendingLanes,p===0&&(Yr=null),ol(a.stateNode),Jt(n,$e()),r!==null)for(c=n.onRecoverableError,a=0;a<r.length;a++)d=r[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(tu)throw tu=!1,n=Dh,Dh=null,n;return(ru&1)!==0&&n.tag!==0&&eo(),p=n.pendingLanes,(p&1)!==0?n===xh?Ea++:(Ea=0,xh=n):Ea=0,Gr(),null}function eo(){if(Zr!==null){var n=jr(ru),r=yn.transition,a=ke;try{if(yn.transition=null,ke=16>n?16:n,Zr===null)var c=!1;else{if(n=Zr,Zr=null,ru=0,(Ve&6)!==0)throw Error(t(331));var d=Ve;for(Ve|=4,re=n.current;re!==null;){var p=re,_=p.child;if((re.flags&16)!==0){var T=p.deletions;if(T!==null){for(var C=0;C<T.length;C++){var F=T[C];for(re=F;re!==null;){var q=re;switch(q.tag){case 0:case 11:case 15:ya(8,q,p)}var Q=q.child;if(Q!==null)Q.return=q,re=Q;else for(;re!==null;){q=re;var W=q.sibling,ee=q.return;if(om(q),q===F){re=null;break}if(W!==null){W.return=ee,re=W;break}re=ee}}}var ie=p.alternate;if(ie!==null){var se=ie.child;if(se!==null){ie.child=null;do{var it=se.sibling;se.sibling=null,se=it}while(se!==null)}}re=p}}if((p.subtreeFlags&2064)!==0&&_!==null)_.return=p,re=_;else e:for(;re!==null;){if(p=re,(p.flags&2048)!==0)switch(p.tag){case 0:case 11:case 15:ya(9,p,p.return)}var M=p.sibling;if(M!==null){M.return=p.return,re=M;break e}re=p.return}}var N=n.current;for(re=N;re!==null;){_=re;var b=_.child;if((_.subtreeFlags&2064)!==0&&b!==null)b.return=_,re=b;else e:for(_=N;re!==null;){if(T=re,(T.flags&2048)!==0)try{switch(T.tag){case 0:case 11:case 15:Yl(9,T)}}catch(oe){tt(T,T.return,oe)}if(T===_){re=null;break e}var X=T.sibling;if(X!==null){X.return=T.return,re=X;break e}re=T.return}}if(Ve=d,Gr(),en&&typeof en.onPostCommitFiberRoot=="function")try{en.onPostCommitFiberRoot(ki,n)}catch{}c=!0}return c}finally{ke=a,yn.transition=r}}return!1}function Tm(n,r,a){r=Xs(a,r),r=jp(n,r,1),n=Xr(n,r,1),r=Ht(),n!==null&&(Fr(n,1,r),Jt(n,r))}function tt(n,r,a){if(n.tag===3)Tm(n,n,a);else for(;r!==null;){if(r.tag===3){Tm(r,n,a);break}else if(r.tag===1){var c=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(Yr===null||!Yr.has(c))){n=Xs(a,n),n=zp(r,n,1),r=Xr(r,n,1),n=Ht(),r!==null&&(Fr(r,1,n),Jt(r,n));break}}r=r.return}}function jE(n,r,a){var c=n.pingCache;c!==null&&c.delete(r),r=Ht(),n.pingedLanes|=n.suspendedLanes&a,Et===n&&(Ct&a)===a&&(pt===4||pt===3&&(Ct&130023424)===Ct&&500>$e()-Nh?Wi(n,0):kh|=a),Jt(n,r)}function Im(n,r){r===0&&((n.mode&1)===0?r=1:(r=Is,Is<<=1,(Is&130023424)===0&&(Is=4194304)));var a=Ht();n=Er(n,r),n!==null&&(Fr(n,r,a),Jt(n,a))}function zE(n){var r=n.memoizedState,a=0;r!==null&&(a=r.retryLane),Im(n,a)}function BE(n,r){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(r),Im(n,a)}var Sm;Sm=function(n,r,a){if(n!==null)if(n.memoizedProps!==r.pendingProps||Kt.current)Qt=!0;else{if((n.lanes&a)===0&&(r.flags&128)===0)return Qt=!1,kE(n,r,a);Qt=(n.flags&131072)!==0}else Qt=!1,Xe&&(r.flags&1048576)!==0&&rp(r,Ll,r.index);switch(r.lanes=0,r.tag){case 2:var c=r.type;Xl(n,r),n=r.pendingProps;var d=Bs(r,Vt.current);Gs(r,a),d=ah(null,r,c,n,d,a);var p=lh();return r.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,Gt(c)?(p=!0,xl(r)):p=!1,r.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,eh(r),d.updater=Gl,r.stateNode=d,d._reactInternals=r,ph(r,c,n,a),r=_h(null,r,c,!0,p,a)):(r.tag=0,Xe&&p&&Hc(r),$t(null,r,d,a),r=r.child),r;case 16:c=r.elementType;e:{switch(Xl(n,r),n=r.pendingProps,d=c._init,c=d(c._payload),r.type=c,d=r.tag=HE(c),n=xn(c,n),d){case 0:r=yh(null,r,c,n,a);break e;case 1:r=Xp(null,r,c,n,a);break e;case 11:r=Wp(null,r,c,n,a);break e;case 14:r=qp(null,r,c,xn(c.type,n),a);break e}throw Error(t(306,c,""))}return r;case 0:return c=r.type,d=r.pendingProps,d=r.elementType===c?d:xn(c,d),yh(n,r,c,d,a);case 1:return c=r.type,d=r.pendingProps,d=r.elementType===c?d:xn(c,d),Xp(n,r,c,d,a);case 3:e:{if(Jp(r),n===null)throw Error(t(387));c=r.pendingProps,p=r.memoizedState,d=p.element,dp(n,r),zl(r,c,null,a);var _=r.memoizedState;if(c=_.element,p.isDehydrated)if(p={element:c,isDehydrated:!1,cache:_.cache,pendingSuspenseBoundaries:_.pendingSuspenseBoundaries,transitions:_.transitions},r.updateQueue.baseState=p,r.memoizedState=p,r.flags&256){d=Xs(Error(t(423)),r),r=Yp(n,r,c,a,d);break e}else if(c!==d){d=Xs(Error(t(424)),r),r=Yp(n,r,c,a,d);break e}else for(on=Wr(r.stateNode.containerInfo.firstChild),sn=r,Xe=!0,Dn=null,a=cp(r,null,c,a),r.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Ws(),c===d){r=Tr(n,r,a);break e}$t(n,r,c,a)}r=r.child}return r;case 5:return mp(r),n===null&&Kc(r),c=r.type,d=r.pendingProps,p=n!==null?n.memoizedProps:null,_=d.children,Fc(c,d)?_=null:p!==null&&Fc(c,p)&&(r.flags|=32),Qp(n,r),$t(n,r,_,a),r.child;case 6:return n===null&&Kc(r),null;case 13:return Zp(n,r,a);case 4:return th(r,r.stateNode.containerInfo),c=r.pendingProps,n===null?r.child=qs(r,null,c,a):$t(n,r,c,a),r.child;case 11:return c=r.type,d=r.pendingProps,d=r.elementType===c?d:xn(c,d),Wp(n,r,c,d,a);case 7:return $t(n,r,r.pendingProps,a),r.child;case 8:return $t(n,r,r.pendingProps.children,a),r.child;case 12:return $t(n,r,r.pendingProps.children,a),r.child;case 10:e:{if(c=r.type._context,d=r.pendingProps,p=r.memoizedProps,_=d.value,He(Fl,c._currentValue),c._currentValue=_,p!==null)if(Nn(p.value,_)){if(p.children===d.children&&!Kt.current){r=Tr(n,r,a);break e}}else for(p=r.child,p!==null&&(p.return=r);p!==null;){var T=p.dependencies;if(T!==null){_=p.child;for(var C=T.firstContext;C!==null;){if(C.context===c){if(p.tag===1){C=wr(-1,a&-a),C.tag=2;var F=p.updateQueue;if(F!==null){F=F.shared;var q=F.pending;q===null?C.next=C:(C.next=q.next,q.next=C),F.pending=C}}p.lanes|=a,C=p.alternate,C!==null&&(C.lanes|=a),Yc(p.return,a,r),T.lanes|=a;break}C=C.next}}else if(p.tag===10)_=p.type===r.type?null:p.child;else if(p.tag===18){if(_=p.return,_===null)throw Error(t(341));_.lanes|=a,T=_.alternate,T!==null&&(T.lanes|=a),Yc(_,a,r),_=p.sibling}else _=p.child;if(_!==null)_.return=p;else for(_=p;_!==null;){if(_===r){_=null;break}if(p=_.sibling,p!==null){p.return=_.return,_=p;break}_=_.return}p=_}$t(n,r,d.children,a),r=r.child}return r;case 9:return d=r.type,c=r.pendingProps.children,Gs(r,a),d=mn(d),c=c(d),r.flags|=1,$t(n,r,c,a),r.child;case 14:return c=r.type,d=xn(c,r.pendingProps),d=xn(c.type,d),qp(n,r,c,d,a);case 15:return Kp(n,r,r.type,r.pendingProps,a);case 17:return c=r.type,d=r.pendingProps,d=r.elementType===c?d:xn(c,d),Xl(n,r),r.tag=1,Gt(c)?(n=!0,xl(r)):n=!1,Gs(r,a),Fp(r,c,d),ph(r,c,d,a),_h(null,r,c,!0,n,a);case 19:return tm(n,r,a);case 22:return Gp(n,r,a)}throw Error(t(156,r.tag))};function Am(n,r){return ws(n,r)}function $E(n,r,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _n(n,r,a,c){return new $E(n,r,a,c)}function Fh(n){return n=n.prototype,!(!n||!n.isReactComponent)}function HE(n){if(typeof n=="function")return Fh(n)?1:0;if(n!=null){if(n=n.$$typeof,n===O)return 11;if(n===Dt)return 14}return 2}function ni(n,r){var a=n.alternate;return a===null?(a=_n(n.tag,r,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=r,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,r=n.dependencies,a.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function au(n,r,a,c,d,p){var _=2;if(c=n,typeof n=="function")Fh(n)&&(_=1);else if(typeof n=="string")_=5;else e:switch(n){case D:return Ki(a.children,d,p,r);case I:_=8,d|=8;break;case R:return n=_n(12,a,r,d|2),n.elementType=R,n.lanes=p,n;case A:return n=_n(13,a,r,d),n.elementType=A,n.lanes=p,n;case nt:return n=_n(19,a,r,d),n.elementType=nt,n.lanes=p,n;case je:return lu(a,d,p,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case k:_=10;break e;case x:_=9;break e;case O:_=11;break e;case Dt:_=14;break e;case xt:_=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=_n(_,a,r,d),r.elementType=n,r.type=c,r.lanes=p,r}function Ki(n,r,a,c){return n=_n(7,n,c,r),n.lanes=a,n}function lu(n,r,a,c){return n=_n(22,n,c,r),n.elementType=je,n.lanes=a,n.stateNode={isHidden:!1},n}function Uh(n,r,a){return n=_n(6,n,null,r),n.lanes=a,n}function jh(n,r,a){return r=_n(4,n.children!==null?n.children:[],n.key,r),r.lanes=a,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function WE(n,r,a,c,d){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=br(0),this.expirationTimes=br(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=br(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function zh(n,r,a,c,d,p,_,T,C){return n=new WE(n,r,a,T,C),r===1?(r=1,p===!0&&(r|=8)):r=0,p=_n(3,null,null,r),n.current=p,p.stateNode=n,p.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},eh(p),n}function qE(n,r,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Re,key:c==null?null:""+c,children:n,containerInfo:r,implementation:a}}function Rm(n){if(!n)return Kr;n=n._reactInternals;e:{if(In(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(Gt(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Gt(a))return ep(n,a,r)}return r}function Cm(n,r,a,c,d,p,_,T,C){return n=zh(a,c,!0,n,d,p,_,T,C),n.context=Rm(null),a=n.current,c=Ht(),d=ei(a),p=wr(c,d),p.callback=r??null,Xr(a,p,d),n.current.lanes=d,Fr(n,d,c),Jt(n,c),n}function uu(n,r,a,c){var d=r.current,p=Ht(),_=ei(d);return a=Rm(a),r.context===null?r.context=a:r.pendingContext=a,r=wr(p,_),r.payload={element:n},c=c===void 0?null:c,c!==null&&(r.callback=c),n=Xr(d,r,_),n!==null&&(Ln(n,d,_,p),jl(n,d,_)),_}function cu(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Pm(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<r?a:r}}function Bh(n,r){Pm(n,r),(n=n.alternate)&&Pm(n,r)}function KE(){return null}var km=typeof reportError=="function"?reportError:function(n){console.error(n)};function $h(n){this._internalRoot=n}hu.prototype.render=$h.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));uu(n,r,null,null)},hu.prototype.unmount=$h.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;Hi(function(){uu(null,n,null,null)}),r[gr]=null}};function hu(n){this._internalRoot=n}hu.prototype.unstable_scheduleHydration=function(n){if(n){var r=hl();n={blockedOn:null,target:n,priority:r};for(var a=0;a<$n.length&&r!==0&&r<$n[a].priority;a++);$n.splice(a,0,n),a===0&&pl(n)}};function Hh(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function du(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Nm(){}function GE(n,r,a,c,d){if(d){if(typeof c=="function"){var p=c;c=function(){var F=cu(_);p.call(F)}}var _=Cm(r,c,n,0,null,!1,!1,"",Nm);return n._reactRootContainer=_,n[gr]=_.current,ia(n.nodeType===8?n.parentNode:n),Hi(),_}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var T=c;c=function(){var F=cu(C);T.call(F)}}var C=zh(n,0,!1,null,null,!1,!1,"",Nm);return n._reactRootContainer=C,n[gr]=C.current,ia(n.nodeType===8?n.parentNode:n),Hi(function(){uu(r,C,a,c)}),C}function fu(n,r,a,c,d){var p=a._reactRootContainer;if(p){var _=p;if(typeof d=="function"){var T=d;d=function(){var C=cu(_);T.call(C)}}uu(r,_,n,d)}else _=GE(a,r,n,d,c);return cu(_)}ul=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var a=Mr(r.pendingLanes);a!==0&&(Ur(r,a|1),Jt(r,$e()),(Ve&6)===0&&(Zs=$e()+500,Gr()))}break;case 13:Hi(function(){var c=Er(n,1);if(c!==null){var d=Ht();Ln(c,n,1,d)}}),Bh(n,1)}},Ss=function(n){if(n.tag===13){var r=Er(n,134217728);if(r!==null){var a=Ht();Ln(r,n,134217728,a)}Bh(n,134217728)}},cl=function(n){if(n.tag===13){var r=ei(n),a=Er(n,r);if(a!==null){var c=Ht();Ln(a,n,r,c)}Bh(n,r)}},hl=function(){return ke},dl=function(n,r){var a=ke;try{return ke=n,r()}finally{ke=a}},ms=function(n,r,a){switch(r){case"input":if(ko(n,a),r=a.name,a.type==="radio"&&r!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<a.length;r++){var c=a[r];if(c!==n&&c.form===n.form){var d=Nl(c);if(!d)throw Error(t(90));us(c),ko(c,d)}}}break;case"textarea":fs(n,a);break;case"select":r=a.value,r!=null&&lr(n,!!a.multiple,r,!1)}},Si=Lh,Uo=Hi;var QE={usingClientEntryPoint:!1,Events:[aa,js,Nl,zn,Fo,Lh]},wa={findFiberByHostInstance:Mi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},XE={bundleType:wa.bundleType,version:wa.version,rendererPackageName:wa.rendererPackageName,rendererConfig:wa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:we.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Bo(n),n===null?null:n.stateNode},findFiberByHostInstance:wa.findFiberByHostInstance||KE,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var pu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!pu.isDisabled&&pu.supportsFiber)try{ki=pu.inject(XE),en=pu}catch{}}return Yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=QE,Yt.createPortal=function(n,r){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Hh(r))throw Error(t(200));return qE(n,r,null,a)},Yt.createRoot=function(n,r){if(!Hh(n))throw Error(t(299));var a=!1,c="",d=km;return r!=null&&(r.unstable_strictMode===!0&&(a=!0),r.identifierPrefix!==void 0&&(c=r.identifierPrefix),r.onRecoverableError!==void 0&&(d=r.onRecoverableError)),r=zh(n,1,!1,null,null,a,!1,c,d),n[gr]=r.current,ia(n.nodeType===8?n.parentNode:n),new $h(r)},Yt.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=Bo(r),n=n===null?null:n.stateNode,n},Yt.flushSync=function(n){return Hi(n)},Yt.hydrate=function(n,r,a){if(!du(r))throw Error(t(200));return fu(null,n,r,!0,a)},Yt.hydrateRoot=function(n,r,a){if(!Hh(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,p="",_=km;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(p=a.identifierPrefix),a.onRecoverableError!==void 0&&(_=a.onRecoverableError)),r=Cm(r,null,n,1,a??null,d,!1,p,_),n[gr]=r.current,ia(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[a,d]:r.mutableSourceEagerHydrationData.push(a,d);return new hu(r)},Yt.render=function(n,r,a){if(!du(r))throw Error(t(200));return fu(null,n,r,!1,a)},Yt.unmountComponentAtNode=function(n){if(!du(n))throw Error(t(40));return n._reactRootContainer?(Hi(function(){fu(null,null,n,!1,function(){n._reactRootContainer=null,n[gr]=null})}),!0):!1},Yt.unstable_batchedUpdates=Lh,Yt.unstable_renderSubtreeIntoContainer=function(n,r,a,c){if(!du(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return fu(n,r,a,!1,c)},Yt.version="18.3.1-next-f1338f8080-20240426",Yt}var Fm;function aw(){if(Fm)return Kh.exports;Fm=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(e){console.error(e)}}return i(),Kh.exports=ow(),Kh.exports}var Um;function lw(){if(Um)return mu;Um=1;var i=aw();return mu.createRoot=i.createRoot,mu.hydrateRoot=i.hydrateRoot,mu}var uw=lw();function cw(i,e){if(i instanceof RegExp)return{keys:!1,pattern:i};var t,s,o,u,h=[],m="",g=i.split("/");for(g[0]||g.shift();o=g.shift();)t=o[0],t==="*"?(h.push(t),m+=o[1]==="?"?"(?:/(.*))?":"/(.*)"):t===":"?(s=o.indexOf("?",1),u=o.indexOf(".",1),h.push(o.substring(1,~s?s:~u?u:o.length)),m+=~s&&!~u?"(?:/([^/]+?))?":"/([^/]+?)",~u&&(m+=(~s?"?":"")+"\\"+o.substring(u))):m+="/"+o;return{keys:h,pattern:new RegExp("^"+m+(e?"(?=$|/)":"/?$"),"i")}}var Xh={exports:{}},Jh={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jm;function hw(){if(jm)return Jh;jm=1;var i=ec();function e(S,P){return S===P&&(S!==0||1/S===1/P)||S!==S&&P!==P}var t=typeof Object.is=="function"?Object.is:e,s=i.useState,o=i.useEffect,u=i.useLayoutEffect,h=i.useDebugValue;function m(S,P){var j=P(),K=s({inst:{value:j,getSnapshot:P}}),B=K[0].inst,z=K[1];return u(function(){B.value=j,B.getSnapshot=P,g(B)&&z({inst:B})},[S,j,P]),o(function(){return g(B)&&z({inst:B}),S(function(){g(B)&&z({inst:B})})},[S]),h(j),j}function g(S){var P=S.getSnapshot;S=S.value;try{var j=P();return!t(S,j)}catch{return!0}}function v(S,P){return P()}var w=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?v:m;return Jh.useSyncExternalStore=i.useSyncExternalStore!==void 0?i.useSyncExternalStore:w,Jh}var zm;function dw(){return zm||(zm=1,Xh.exports=hw()),Xh.exports}var fw=dw();const pw=rw.useInsertionEffect,mw=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",gw=mw?Oe.useLayoutEffect:Oe.useEffect,yw=pw||gw,Ey=i=>{const e=Oe.useRef([i,(...t)=>e[0](...t)]).current;return yw(()=>{e[0]=i}),e[1]},_w="popstate",Vd="pushState",Od="replaceState",vw="hashchange",Bm=[_w,Vd,Od,vw],Ew=i=>{for(const e of Bm)addEventListener(e,i);return()=>{for(const e of Bm)removeEventListener(e,i)}},wy=(i,e)=>fw.useSyncExternalStore(Ew,i,e),ww=()=>location.search,Tw=({ssrSearch:i=""}={})=>wy(ww,()=>i),$m=()=>location.pathname,Iw=({ssrPath:i}={})=>wy($m,i?()=>i:$m),Sw=(i,{replace:e=!1,state:t=null}={})=>history[e?Od:Vd](t,"",i),Aw=(i={})=>[Iw(i),Sw],Hm=Symbol.for("wouter_v3");if(typeof history<"u"&&typeof window[Hm]>"u"){for(const i of[Vd,Od]){const e=history[i];history[i]=function(){const t=e.apply(this,arguments),s=new Event(i);return s.arguments=arguments,dispatchEvent(s),t}}Object.defineProperty(window,Hm,{value:!0})}const Rw=(i,e)=>e.toLowerCase().indexOf(i.toLowerCase())?"~"+e:e.slice(i.length)||"/",Ty=(i="")=>i==="/"?"":i,Cw=(i,e)=>i[0]==="~"?i.slice(1):Ty(e)+i,Pw=(i="",e)=>Rw(Wm(Ty(i)),Wm(e)),Wm=i=>{try{return decodeURI(i)}catch{return i}},Iy={hook:Aw,searchHook:Tw,parser:cw,base:"",ssrPath:void 0,ssrSearch:void 0,ssrContext:void 0,hrefs:i=>i},Sy=Oe.createContext(Iy),$a=()=>Oe.useContext(Sy),Ay={},Ry=Oe.createContext(Ay),kw=()=>Oe.useContext(Ry),tc=i=>{const[e,t]=i.hook(i);return[Pw(i.base,e),Ey((s,o)=>t(Cw(s,i.base),o))]},Nw=()=>tc($a()),Cy=(i,e,t,s)=>{const{pattern:o,keys:u}=e instanceof RegExp?{keys:!1,pattern:e}:i(e||"*",s),h=o.exec(t)||[],[m,...g]=h;return m!==void 0?[!0,(()=>{const v=u!==!1?Object.fromEntries(u.map((S,P)=>[S,g[P]])):h.groups;let w={...g};return v&&Object.assign(w,v),w})(),...s?[m]:[]]:[!1,null]},Dw=({children:i,...e})=>{const t=$a(),s=e.hook?Iy:t;let o=s;const[u,h]=e.ssrPath?.split("?")??[];h&&(e.ssrSearch=h,e.ssrPath=u),e.hrefs=e.hrefs??e.hook?.hrefs;let m=Oe.useRef({}),g=m.current,v=g;for(let w in s){const S=w==="base"?s[w]+(e[w]||""):e[w]||s[w];g===v&&S!==v[w]&&(m.current=v={...v}),v[w]=S,(S!==s[w]||S!==o[w])&&(o=v)}return Oe.createElement(Sy.Provider,{value:o,children:i})},qm=({children:i,component:e},t)=>e?Oe.createElement(e,{params:t}):typeof i=="function"?i(t):i,xw=i=>{let e=Oe.useRef(Ay);const t=e.current;return e.current=Object.keys(i).length!==Object.keys(t).length||Object.entries(i).some(([s,o])=>o!==t[s])?i:t},to=({path:i,nest:e,match:t,...s})=>{const o=$a(),[u]=tc(o),[h,m,g]=t??Cy(o.parser,i,u,e),v=xw({...kw(),...m});if(!h)return null;const w=g?Oe.createElement(Dw,{base:g},qm(s,v)):qm(s,v);return Oe.createElement(Ry.Provider,{value:v,children:w})},Ia=Oe.forwardRef((i,e)=>{const t=$a(),[s,o]=tc(t),{to:u="",href:h=u,onClick:m,asChild:g,children:v,className:w,replace:S,state:P,...j}=i,K=Ey(z=>{z.ctrlKey||z.metaKey||z.altKey||z.shiftKey||z.button!==0||(m?.(z),z.defaultPrevented||(z.preventDefault(),o(h,i)))}),B=t.hrefs(h[0]==="~"?h.slice(1):t.base+h,t);return g&&Oe.isValidElement(v)?Oe.cloneElement(v,{onClick:K,href:B}):Oe.createElement("a",{...j,onClick:K,href:B,className:w?.call?w(s===h):w,children:v,ref:e})}),Py=i=>Array.isArray(i)?i.flatMap(e=>Py(e&&e.type===Oe.Fragment?e.props.children:e)):[i],Vw=({children:i,location:e})=>{const t=$a(),[s]=tc(t);for(const o of Py(i)){let u=0;if(Oe.isValidElement(o)&&(u=Cy(t.parser,o.props.path,e||s,o.props.nest))[0])return Oe.cloneElement(o,{match:u})}return null},Ow=()=>{};var Km={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ky=function(i){const e=[];let t=0;for(let s=0;s<i.length;s++){let o=i.charCodeAt(s);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&s+1<i.length&&(i.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++s)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},Lw=function(i){const e=[];let t=0,s=0;for(;t<i.length;){const o=i[t++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const u=i[t++];e[s++]=String.fromCharCode((o&31)<<6|u&63)}else if(o>239&&o<365){const u=i[t++],h=i[t++],m=i[t++],g=((o&7)<<18|(u&63)<<12|(h&63)<<6|m&63)-65536;e[s++]=String.fromCharCode(55296+(g>>10)),e[s++]=String.fromCharCode(56320+(g&1023))}else{const u=i[t++],h=i[t++];e[s++]=String.fromCharCode((o&15)<<12|(u&63)<<6|h&63)}}return e.join("")},Ny={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<i.length;o+=3){const u=i[o],h=o+1<i.length,m=h?i[o+1]:0,g=o+2<i.length,v=g?i[o+2]:0,w=u>>2,S=(u&3)<<4|m>>4;let P=(m&15)<<2|v>>6,j=v&63;g||(j=64,h||(P=64)),s.push(t[w],t[S],t[P],t[j])}return s.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(ky(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):Lw(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<i.length;){const u=t[i.charAt(o++)],m=o<i.length?t[i.charAt(o)]:0;++o;const v=o<i.length?t[i.charAt(o)]:64;++o;const S=o<i.length?t[i.charAt(o)]:64;if(++o,u==null||m==null||v==null||S==null)throw new Mw;const P=u<<2|m>>4;if(s.push(P),v!==64){const j=m<<4&240|v>>2;if(s.push(j),S!==64){const K=v<<6&192|S;s.push(K)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class Mw extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const bw=function(i){const e=ky(i);return Ny.encodeByteArray(e,!0)},Vu=function(i){return bw(i).replace(/\./g,"")},Dy=function(i){try{return Ny.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fw(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uw=()=>Fw().__FIREBASE_DEFAULTS__,jw=()=>{if(typeof process>"u"||typeof Km>"u")return;const i=Km.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},zw=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&Dy(i[1]);return e&&JSON.parse(e)},nc=()=>{try{return Ow()||Uw()||jw()||zw()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},xy=i=>{var e,t;return(t=(e=nc())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[i]},Bw=i=>{const e=xy(i);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Vy=()=>{var i;return(i=nc())===null||i===void 0?void 0:i.config},Oy=i=>{var e;return(e=nc())===null||e===void 0?void 0:e[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $w{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ly(i){return(await fetch(i,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hw(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",o=i.iat||0,u=i.sub||i.user_id;if(!u)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:u,user_id:u,firebase:{sign_in_provider:"custom",identities:{}}},i);return[Vu(JSON.stringify(t)),Vu(JSON.stringify(h)),""].join(".")}const Pa={};function Ww(){const i={prod:[],emulator:[]};for(const e of Object.keys(Pa))Pa[e]?i.emulator.push(e):i.prod.push(e);return i}function qw(i){let e=document.getElementById(i),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",i),t=!0),{created:t,element:e}}let Gm=!1;function My(i,e){if(typeof window>"u"||typeof document>"u"||!wo(window.location.host)||Pa[i]===e||Pa[i]||Gm)return;Pa[i]=e;function t(P){return`__firebase__banner__${P}`}const s="__firebase__banner",u=Ww().prod.length>0;function h(){const P=document.getElementById(s);P&&P.remove()}function m(P){P.style.display="flex",P.style.background="#7faaf0",P.style.position="fixed",P.style.bottom="5px",P.style.left="5px",P.style.padding=".5em",P.style.borderRadius="5px",P.style.alignItems="center"}function g(P,j){P.setAttribute("width","24"),P.setAttribute("id",j),P.setAttribute("height","24"),P.setAttribute("viewBox","0 0 24 24"),P.setAttribute("fill","none"),P.style.marginLeft="-6px"}function v(){const P=document.createElement("span");return P.style.cursor="pointer",P.style.marginLeft="16px",P.style.fontSize="24px",P.innerHTML=" &times;",P.onclick=()=>{Gm=!0,h()},P}function w(P,j){P.setAttribute("id",j),P.innerText="Learn more",P.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",P.setAttribute("target","__blank"),P.style.paddingLeft="5px",P.style.textDecoration="underline"}function S(){const P=qw(s),j=t("text"),K=document.getElementById(j)||document.createElement("span"),B=t("learnmore"),z=document.getElementById(B)||document.createElement("a"),ue=t("preprendIcon"),ce=document.getElementById(ue)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(P.created){const me=P.element;m(me),w(z,B);const we=v();g(ce,ue),me.append(ce,K,z,we),document.body.appendChild(me)}u?(K.innerText="Preview backend disconnected.",ce.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ce.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,K.innerText="Preview backend running in this workspace."),K.setAttribute("id",j)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",S):S()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kw(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(jt())}function Gw(){var i;const e=(i=nc())===null||i===void 0?void 0:i.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Qw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Xw(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Jw(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Yw(){const i=jt();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Zw(){return!Gw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function e0(){try{return typeof indexedDB=="object"}catch{return!1}}function t0(){return new Promise((i,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(s),i(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var u;e(((u=o.error)===null||u===void 0?void 0:u.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n0="FirebaseError";class xr extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=n0,Object.setPrototypeOf(this,xr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ha.prototype.create)}}class Ha{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},o=`${this.service}/${e}`,u=this.errors[e],h=u?r0(u,s):"Error",m=`${this.serviceName}: ${h} (${o}).`;return new xr(o,m,s)}}function r0(i,e){return i.replace(i0,(t,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const i0=/\{\$([^}]+)}/g;function s0(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function es(i,e){if(i===e)return!0;const t=Object.keys(i),s=Object.keys(e);for(const o of t){if(!s.includes(o))return!1;const u=i[o],h=e[o];if(Qm(u)&&Qm(h)){if(!es(u,h))return!1}else if(u!==h)return!1}for(const o of s)if(!t.includes(o))return!1;return!0}function Qm(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wa(i){const e=[];for(const[t,s]of Object.entries(i))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function o0(i,e){const t=new a0(i,e);return t.subscribe.bind(t)}class a0{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let o;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");l0(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:s},o.next===void 0&&(o.next=Yh),o.error===void 0&&(o.error=Yh),o.complete===void 0&&(o.complete=Yh);const u=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),u}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function l0(i,e){if(typeof i!="object"||i===null)return!1;for(const t of e)if(t in i&&typeof i[t]=="function")return!0;return!1}function Yh(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ln(i){return i&&i._delegate?i._delegate:i}class ts{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gi="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u0{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new $w;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e?.identifier),o=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(u){if(o)return null;throw u}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(h0(e))try{this.getOrInitializeService({instanceIdentifier:Gi})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const u=this.getOrInitializeService({instanceIdentifier:o});s.resolve(u)}catch{}}}}clearInstance(e=Gi){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Gi){return this.instances.has(e)}getOptions(e=Gi){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[u,h]of this.instancesDeferred.entries()){const m=this.normalizeInstanceIdentifier(u);s===m&&h.resolve(o)}return o}onInit(e,t){var s;const o=this.normalizeInstanceIdentifier(t),u=(s=this.onInitCallbacks.get(o))!==null&&s!==void 0?s:new Set;u.add(e),this.onInitCallbacks.set(o,u);const h=this.instances.get(o);return h&&e(h,o),()=>{u.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const o of s)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:c0(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Gi){return this.component?this.component.multipleInstances?e:Gi:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function c0(i){return i===Gi?void 0:i}function h0(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d0{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new u0(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ce;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(Ce||(Ce={}));const f0={debug:Ce.DEBUG,verbose:Ce.VERBOSE,info:Ce.INFO,warn:Ce.WARN,error:Ce.ERROR,silent:Ce.SILENT},p0=Ce.INFO,m0={[Ce.DEBUG]:"log",[Ce.VERBOSE]:"log",[Ce.INFO]:"info",[Ce.WARN]:"warn",[Ce.ERROR]:"error"},g0=(i,e,...t)=>{if(e<i.logLevel)return;const s=new Date().toISOString(),o=m0[e];if(o)console[o](`[${s}]  ${i.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ld{constructor(e){this.name=e,this._logLevel=p0,this._logHandler=g0,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Ce))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?f0[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Ce.DEBUG,...e),this._logHandler(this,Ce.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Ce.VERBOSE,...e),this._logHandler(this,Ce.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Ce.INFO,...e),this._logHandler(this,Ce.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Ce.WARN,...e),this._logHandler(this,Ce.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Ce.ERROR,...e),this._logHandler(this,Ce.ERROR,...e)}}const y0=(i,e)=>e.some(t=>i instanceof t);let Xm,Jm;function _0(){return Xm||(Xm=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function v0(){return Jm||(Jm=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const by=new WeakMap,ud=new WeakMap,Fy=new WeakMap,Zh=new WeakMap,Md=new WeakMap;function E0(i){const e=new Promise((t,s)=>{const o=()=>{i.removeEventListener("success",u),i.removeEventListener("error",h)},u=()=>{t(ui(i.result)),o()},h=()=>{s(i.error),o()};i.addEventListener("success",u),i.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&by.set(t,i)}).catch(()=>{}),Md.set(e,i),e}function w0(i){if(ud.has(i))return;const e=new Promise((t,s)=>{const o=()=>{i.removeEventListener("complete",u),i.removeEventListener("error",h),i.removeEventListener("abort",h)},u=()=>{t(),o()},h=()=>{s(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",u),i.addEventListener("error",h),i.addEventListener("abort",h)});ud.set(i,e)}let cd={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return ud.get(i);if(e==="objectStoreNames")return i.objectStoreNames||Fy.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return ui(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function T0(i){cd=i(cd)}function I0(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=i.call(ed(this),e,...t);return Fy.set(s,e.sort?e.sort():[e]),ui(s)}:v0().includes(i)?function(...e){return i.apply(ed(this),e),ui(by.get(this))}:function(...e){return ui(i.apply(ed(this),e))}}function S0(i){return typeof i=="function"?I0(i):(i instanceof IDBTransaction&&w0(i),y0(i,_0())?new Proxy(i,cd):i)}function ui(i){if(i instanceof IDBRequest)return E0(i);if(Zh.has(i))return Zh.get(i);const e=S0(i);return e!==i&&(Zh.set(i,e),Md.set(e,i)),e}const ed=i=>Md.get(i);function A0(i,e,{blocked:t,upgrade:s,blocking:o,terminated:u}={}){const h=indexedDB.open(i,e),m=ui(h);return s&&h.addEventListener("upgradeneeded",g=>{s(ui(h.result),g.oldVersion,g.newVersion,ui(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),m.then(g=>{u&&g.addEventListener("close",()=>u()),o&&g.addEventListener("versionchange",v=>o(v.oldVersion,v.newVersion,v))}).catch(()=>{}),m}const R0=["get","getKey","getAll","getAllKeys","count"],C0=["put","add","delete","clear"],td=new Map;function Ym(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(td.get(e))return td.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,o=C0.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(o||R0.includes(t)))return;const u=async function(h,...m){const g=this.transaction(h,o?"readwrite":"readonly");let v=g.store;return s&&(v=v.index(m.shift())),(await Promise.all([v[t](...m),o&&g.done]))[0]};return td.set(e,u),u}T0(i=>({...i,get:(e,t,s)=>Ym(e,t)||i.get(e,t,s),has:(e,t)=>!!Ym(e,t)||i.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P0{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(k0(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function k0(i){const e=i.getComponent();return e?.type==="VERSION"}const hd="@firebase/app",Zm="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pr=new Ld("@firebase/app"),N0="@firebase/app-compat",D0="@firebase/analytics-compat",x0="@firebase/analytics",V0="@firebase/app-check-compat",O0="@firebase/app-check",L0="@firebase/auth",M0="@firebase/auth-compat",b0="@firebase/database",F0="@firebase/data-connect",U0="@firebase/database-compat",j0="@firebase/functions",z0="@firebase/functions-compat",B0="@firebase/installations",$0="@firebase/installations-compat",H0="@firebase/messaging",W0="@firebase/messaging-compat",q0="@firebase/performance",K0="@firebase/performance-compat",G0="@firebase/remote-config",Q0="@firebase/remote-config-compat",X0="@firebase/storage",J0="@firebase/storage-compat",Y0="@firebase/firestore",Z0="@firebase/ai",eT="@firebase/firestore-compat",tT="firebase",nT="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dd="[DEFAULT]",rT={[hd]:"fire-core",[N0]:"fire-core-compat",[x0]:"fire-analytics",[D0]:"fire-analytics-compat",[O0]:"fire-app-check",[V0]:"fire-app-check-compat",[L0]:"fire-auth",[M0]:"fire-auth-compat",[b0]:"fire-rtdb",[F0]:"fire-data-connect",[U0]:"fire-rtdb-compat",[j0]:"fire-fn",[z0]:"fire-fn-compat",[B0]:"fire-iid",[$0]:"fire-iid-compat",[H0]:"fire-fcm",[W0]:"fire-fcm-compat",[q0]:"fire-perf",[K0]:"fire-perf-compat",[G0]:"fire-rc",[Q0]:"fire-rc-compat",[X0]:"fire-gcs",[J0]:"fire-gcs-compat",[Y0]:"fire-fst",[eT]:"fire-fst-compat",[Z0]:"fire-vertex","fire-js":"fire-js",[tT]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou=new Map,iT=new Map,fd=new Map;function eg(i,e){try{i.container.addComponent(e)}catch(t){Pr.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,t)}}function po(i){const e=i.name;if(fd.has(e))return Pr.debug(`There were multiple attempts to register component ${e}.`),!1;fd.set(e,i);for(const t of Ou.values())eg(t,i);for(const t of iT.values())eg(t,i);return!0}function bd(i,e){const t=i.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),i.container.getProvider(e)}function Mn(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ci=new Ha("app","Firebase",sT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oT{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ts("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ci.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To=nT;function Uy(i,e={}){let t=i;typeof e!="object"&&(e={name:e});const s=Object.assign({name:dd,automaticDataCollectionEnabled:!0},e),o=s.name;if(typeof o!="string"||!o)throw ci.create("bad-app-name",{appName:String(o)});if(t||(t=Vy()),!t)throw ci.create("no-options");const u=Ou.get(o);if(u){if(es(t,u.options)&&es(s,u.config))return u;throw ci.create("duplicate-app",{appName:o})}const h=new d0(o);for(const g of fd.values())h.addComponent(g);const m=new oT(t,s,h);return Ou.set(o,m),m}function jy(i=dd){const e=Ou.get(i);if(!e&&i===dd&&Vy())return Uy();if(!e)throw ci.create("no-app",{appName:i});return e}function hi(i,e,t){var s;let o=(s=rT[i])!==null&&s!==void 0?s:i;t&&(o+=`-${t}`);const u=o.match(/\s|\//),h=e.match(/\s|\//);if(u||h){const m=[`Unable to register library "${o}" with version "${e}":`];u&&m.push(`library name "${o}" contains illegal characters (whitespace or "/")`),u&&h&&m.push("and"),h&&m.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Pr.warn(m.join(" "));return}po(new ts(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aT="firebase-heartbeat-database",lT=1,Oa="firebase-heartbeat-store";let nd=null;function zy(){return nd||(nd=A0(aT,lT,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(Oa)}catch(t){console.warn(t)}}}}).catch(i=>{throw ci.create("idb-open",{originalErrorMessage:i.message})})),nd}async function uT(i){try{const t=(await zy()).transaction(Oa),s=await t.objectStore(Oa).get(By(i));return await t.done,s}catch(e){if(e instanceof xr)Pr.warn(e.message);else{const t=ci.create("idb-get",{originalErrorMessage:e?.message});Pr.warn(t.message)}}}async function tg(i,e){try{const s=(await zy()).transaction(Oa,"readwrite");await s.objectStore(Oa).put(e,By(i)),await s.done}catch(t){if(t instanceof xr)Pr.warn(t.message);else{const s=ci.create("idb-set",{originalErrorMessage:t?.message});Pr.warn(s.message)}}}function By(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cT=1024,hT=30;class dT{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new pT(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),u=ng();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===u||this._heartbeatsCache.heartbeats.some(h=>h.date===u))return;if(this._heartbeatsCache.heartbeats.push({date:u,agent:o}),this._heartbeatsCache.heartbeats.length>hT){const h=mT(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){Pr.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ng(),{heartbeatsToSend:s,unsentEntries:o}=fT(this._heartbeatsCache.heartbeats),u=Vu(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),u}catch(t){return Pr.warn(t),""}}}function ng(){return new Date().toISOString().substring(0,10)}function fT(i,e=cT){const t=[];let s=i.slice();for(const o of i){const u=t.find(h=>h.agent===o.agent);if(u){if(u.dates.push(o.date),rg(t)>e){u.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),rg(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class pT{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return e0()?t0().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await uT(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return tg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return tg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function rg(i){return Vu(JSON.stringify({version:2,heartbeats:i})).length}function mT(i){if(i.length===0)return-1;let e=0,t=i[0].date;for(let s=1;s<i.length;s++)i[s].date<t&&(t=i[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gT(i){po(new ts("platform-logger",e=>new P0(e),"PRIVATE")),po(new ts("heartbeat",e=>new dT(e),"PRIVATE")),hi(hd,Zm,i),hi(hd,Zm,"esm2017"),hi("fire-js","")}gT("");var yT="firebase",_T="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */hi(yT,_T,"app");function Fd(i,e){var t={};for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&e.indexOf(s)<0&&(t[s]=i[s]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(i);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(i,s[o])&&(t[s[o]]=i[s[o]]);return t}function $y(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const vT=$y,Hy=new Ha("auth","Firebase",$y());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lu=new Ld("@firebase/auth");function ET(i,...e){Lu.logLevel<=Ce.WARN&&Lu.warn(`Auth (${To}): ${i}`,...e)}function Iu(i,...e){Lu.logLevel<=Ce.ERROR&&Lu.error(`Auth (${To}): ${i}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(i,...e){throw jd(i,...e)}function Un(i,...e){return jd(i,...e)}function Ud(i,e,t){const s=Object.assign(Object.assign({},vT()),{[e]:t});return new Ha("auth","Firebase",s).create(e,{appName:i.name})}function Ji(i){return Ud(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function wT(i,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&rr(i,"argument-error"),Ud(i,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function jd(i,...e){if(typeof i!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=i.name),i._errorFactory.create(t,...s)}return Hy.create(i,...e)}function _e(i,e,...t){if(!i)throw jd(e,...t)}function Ar(i){const e="INTERNAL ASSERTION FAILED: "+i;throw Iu(e),new Error(e)}function kr(i,e){i||Ar(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pd(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.href)||""}function TT(){return ig()==="http:"||ig()==="https:"}function ig(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(TT()||Xw()||"connection"in navigator)?navigator.onLine:!0}function ST(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{constructor(e,t){this.shortDelay=e,this.longDelay=t,kr(t>e,"Short delay should be less than long delay!"),this.isMobile=Kw()||Jw()}get(){return IT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zd(i,e){kr(i.emulator,"Emulator should always be set here");const{url:t}=i.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ar("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ar("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ar("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],CT=new qa(3e4,6e4);function Bd(i,e){return i.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:i.tenantId}):e}async function Io(i,e,t,s,o={}){return qy(i,o,async()=>{let u={},h={};s&&(e==="GET"?h=s:u={body:JSON.stringify(s)});const m=Wa(Object.assign({key:i.config.apiKey},h)).slice(1),g=await i._getAdditionalHeaders();g["Content-Type"]="application/json",i.languageCode&&(g["X-Firebase-Locale"]=i.languageCode);const v=Object.assign({method:e,headers:g},u);return Qw()||(v.referrerPolicy="no-referrer"),i.emulatorConfig&&wo(i.emulatorConfig.host)&&(v.credentials="include"),Wy.fetch()(await Ky(i,i.config.apiHost,t,m),v)})}async function qy(i,e,t){i._canInitEmulator=!1;const s=Object.assign(Object.assign({},AT),e);try{const o=new kT(i),u=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await u.json();if("needConfirmation"in h)throw gu(i,"account-exists-with-different-credential",h);if(u.ok&&!("errorMessage"in h))return h;{const m=u.ok?h.errorMessage:h.error.message,[g,v]=m.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw gu(i,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw gu(i,"email-already-in-use",h);if(g==="USER_DISABLED")throw gu(i,"user-disabled",h);const w=s[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(v)throw Ud(i,w,v);rr(i,w)}}catch(o){if(o instanceof xr)throw o;rr(i,"network-request-failed",{message:String(o)})}}async function PT(i,e,t,s,o={}){const u=await Io(i,e,t,s,o);return"mfaPendingCredential"in u&&rr(i,"multi-factor-auth-required",{_serverResponse:u}),u}async function Ky(i,e,t,s){const o=`${e}${t}?${s}`,u=i,h=u.config.emulator?zd(i.config,o):`${i.config.apiScheme}://${o}`;return RT.includes(t)&&(await u._persistenceManagerAvailable,u._getPersistenceType()==="COOKIE")?u._getPersistence()._getFinalTarget(h).toString():h}class kT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Un(this.auth,"network-request-failed")),CT.get())})}}function gu(i,e,t){const s={appName:i.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const o=Un(i,e,s);return o.customData._tokenResponse=t,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NT(i,e){return Io(i,"POST","/v1/accounts:delete",e)}async function Mu(i,e){return Io(i,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ka(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function DT(i,e=!1){const t=ln(i),s=await t.getIdToken(e),o=$d(s);_e(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const u=typeof o.firebase=="object"?o.firebase:void 0,h=u?.sign_in_provider;return{claims:o,token:s,authTime:ka(rd(o.auth_time)),issuedAtTime:ka(rd(o.iat)),expirationTime:ka(rd(o.exp)),signInProvider:h||null,signInSecondFactor:u?.sign_in_second_factor||null}}function rd(i){return Number(i)*1e3}function $d(i){const[e,t,s]=i.split(".");if(e===void 0||t===void 0||s===void 0)return Iu("JWT malformed, contained fewer than 3 sections"),null;try{const o=Dy(t);return o?JSON.parse(o):(Iu("Failed to decode base64 JWT payload"),null)}catch(o){return Iu("Caught error parsing JWT payload as JSON",o?.toString()),null}}function sg(i){const e=$d(i);return _e(e,"internal-error"),_e(typeof e.exp<"u","internal-error"),_e(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function La(i,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof xr&&xT(s)&&i.auth.currentUser===i&&await i.auth.signOut(),s}}function xT({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VT{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const o=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=ka(this.lastLoginAt),this.creationTime=ka(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bu(i){var e;const t=i.auth,s=await i.getIdToken(),o=await La(i,Mu(t,{idToken:s}));_e(o?.users.length,t,"internal-error");const u=o.users[0];i._notifyReloadListener(u);const h=!((e=u.providerUserInfo)===null||e===void 0)&&e.length?Gy(u.providerUserInfo):[],m=LT(i.providerData,h),g=i.isAnonymous,v=!(i.email&&u.passwordHash)&&!m?.length,w=g?v:!1,S={uid:u.localId,displayName:u.displayName||null,photoURL:u.photoUrl||null,email:u.email||null,emailVerified:u.emailVerified||!1,phoneNumber:u.phoneNumber||null,tenantId:u.tenantId||null,providerData:m,metadata:new md(u.createdAt,u.lastLoginAt),isAnonymous:w};Object.assign(i,S)}async function OT(i){const e=ln(i);await bu(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function LT(i,e){return[...i.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function Gy(i){return i.map(e=>{var{providerId:t}=e,s=Fd(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function MT(i,e){const t=await qy(i,{},async()=>{const s=Wa({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:u}=i.config,h=await Ky(i,o,"/v1/token",`key=${u}`),m=await i._getAdditionalHeaders();m["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:m,body:s};return i.emulatorConfig&&wo(i.emulatorConfig.host)&&(g.credentials="include"),Wy.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function bT(i,e){return Io(i,"POST","/v2/accounts:revokeToken",Bd(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_e(e.idToken,"internal-error"),_e(typeof e.idToken<"u","internal-error"),_e(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):sg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){_e(e.length!==0,"internal-error");const t=sg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(_e(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:o,expiresIn:u}=await MT(e,t);this.updateTokensAndExpiration(s,o,Number(u))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:o,expirationTime:u}=t,h=new oo;return s&&(_e(typeof s=="string","internal-error",{appName:e}),h.refreshToken=s),o&&(_e(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),u&&(_e(typeof u=="number","internal-error",{appName:e}),h.expirationTime=u),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new oo,this.toJSON())}_performRefresh(){return Ar("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ii(i,e){_e(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class bn{constructor(e){var{uid:t,auth:s,stsTokenManager:o}=e,u=Fd(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new VT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=u.displayName||null,this.email=u.email||null,this.emailVerified=u.emailVerified||!1,this.phoneNumber=u.phoneNumber||null,this.photoURL=u.photoURL||null,this.isAnonymous=u.isAnonymous||!1,this.tenantId=u.tenantId||null,this.providerData=u.providerData?[...u.providerData]:[],this.metadata=new md(u.createdAt||void 0,u.lastLoginAt||void 0)}async getIdToken(e){const t=await La(this,this.stsTokenManager.getToken(this.auth,e));return _e(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return DT(this,e)}reload(){return OT(this)}_assign(e){this!==e&&(_e(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new bn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_e(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await bu(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Mn(this.auth.app))return Promise.reject(Ji(this.auth));const e=await this.getIdToken();return await La(this,NT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,o,u,h,m,g,v,w;const S=(s=t.displayName)!==null&&s!==void 0?s:void 0,P=(o=t.email)!==null&&o!==void 0?o:void 0,j=(u=t.phoneNumber)!==null&&u!==void 0?u:void 0,K=(h=t.photoURL)!==null&&h!==void 0?h:void 0,B=(m=t.tenantId)!==null&&m!==void 0?m:void 0,z=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,ue=(v=t.createdAt)!==null&&v!==void 0?v:void 0,ce=(w=t.lastLoginAt)!==null&&w!==void 0?w:void 0,{uid:me,emailVerified:we,isAnonymous:Ge,providerData:Re,stsTokenManager:D}=t;_e(me&&D,e,"internal-error");const I=oo.fromJSON(this.name,D);_e(typeof me=="string",e,"internal-error"),ii(S,e.name),ii(P,e.name),_e(typeof we=="boolean",e,"internal-error"),_e(typeof Ge=="boolean",e,"internal-error"),ii(j,e.name),ii(K,e.name),ii(B,e.name),ii(z,e.name),ii(ue,e.name),ii(ce,e.name);const R=new bn({uid:me,auth:e,email:P,emailVerified:we,displayName:S,isAnonymous:Ge,photoURL:K,phoneNumber:j,tenantId:B,stsTokenManager:I,createdAt:ue,lastLoginAt:ce});return Re&&Array.isArray(Re)&&(R.providerData=Re.map(k=>Object.assign({},k))),z&&(R._redirectEventId=z),R}static async _fromIdTokenResponse(e,t,s=!1){const o=new oo;o.updateFromServerResponse(t);const u=new bn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await bu(u),u}static async _fromGetAccountInfoResponse(e,t,s){const o=t.users[0];_e(o.localId!==void 0,"internal-error");const u=o.providerUserInfo!==void 0?Gy(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!u?.length,m=new oo;m.updateFromIdToken(s);const g=new bn({uid:o.localId,auth:e,stsTokenManager:m,isAnonymous:h}),v={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:u,metadata:new md(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!u?.length};return Object.assign(g,v),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const og=new Map;function Rr(i){kr(i instanceof Function,"Expected a class definition");let e=og.get(i);return e?(kr(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,og.set(i,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Qy.type="NONE";const ag=Qy;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Su(i,e,t){return`firebase:${i}:${e}:${t}`}class ao{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:o,name:u}=this.auth;this.fullUserKey=Su(this.userKey,o.apiKey,u),this.fullPersistenceKey=Su("persistence",o.apiKey,u),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Mu(this.auth,{idToken:e}).catch(()=>{});return t?bn._fromGetAccountInfoResponse(this.auth,t,e):null}return bn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new ao(Rr(ag),e,s);const o=(await Promise.all(t.map(async v=>{if(await v._isAvailable())return v}))).filter(v=>v);let u=o[0]||Rr(ag);const h=Su(s,e.config.apiKey,e.name);let m=null;for(const v of t)try{const w=await v._get(h);if(w){let S;if(typeof w=="string"){const P=await Mu(e,{idToken:w}).catch(()=>{});if(!P)break;S=await bn._fromGetAccountInfoResponse(e,P,w)}else S=bn._fromJSON(e,w);v!==u&&(m=S),u=v;break}}catch{}const g=o.filter(v=>v._shouldAllowMigration);return!u._shouldAllowMigration||!g.length?new ao(u,e,s):(u=g[0],m&&await u._set(h,m.toJSON()),await Promise.all(t.map(async v=>{if(v!==u)try{await v._remove(h)}catch{}})),new ao(u,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lg(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Zy(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Xy(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(t_(e))return"Blackberry";if(n_(e))return"Webos";if(Jy(e))return"Safari";if((e.includes("chrome/")||Yy(e))&&!e.includes("edge/"))return"Chrome";if(e_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=i.match(t);if(s?.length===2)return s[1]}return"Other"}function Xy(i=jt()){return/firefox\//i.test(i)}function Jy(i=jt()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Yy(i=jt()){return/crios\//i.test(i)}function Zy(i=jt()){return/iemobile/i.test(i)}function e_(i=jt()){return/android/i.test(i)}function t_(i=jt()){return/blackberry/i.test(i)}function n_(i=jt()){return/webos/i.test(i)}function Hd(i=jt()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function FT(i=jt()){var e;return Hd(i)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function UT(){return Yw()&&document.documentMode===10}function r_(i=jt()){return Hd(i)||e_(i)||n_(i)||t_(i)||/windows phone/i.test(i)||Zy(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i_(i,e=[]){let t;switch(i){case"Browser":t=lg(jt());break;case"Worker":t=`${lg(jt())}-${i}`;break;default:t=i}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${To}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=u=>new Promise((h,m)=>{try{const g=e(u);h(g)}catch(g){m(g)}});s.onAbort=t,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zT(i,e={}){return Io(i,"GET","/v2/passwordPolicy",Bd(i,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BT=6;class $T{constructor(e){var t,s,o,u;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=h.minPasswordLength)!==null&&t!==void 0?t:BT,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(u=e.forceUpgradeOnSignin)!==null&&u!==void 0?u:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,o,u,h,m;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(s=g.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(u=g.containsUppercaseLetter)!==null&&u!==void 0?u:!0),g.isValid&&(g.isValid=(h=g.containsNumericCharacter)!==null&&h!==void 0?h:!0),g.isValid&&(g.isValid=(m=g.containsNonAlphanumericCharacter)!==null&&m!==void 0?m:!0),g}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,o,u){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HT{constructor(e,t,s,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ug(this),this.idTokenSubscription=new ug(this),this.beforeStateQueue=new jT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Hy,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(u=>this._resolvePersistenceManagerAvailable=u)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Rr(t)),this._initializationPromise=this.queue(async()=>{var s,o,u;if(!this._deleted&&(this.persistenceManager=await ao.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((u=this.currentUser)===null||u===void 0?void 0:u.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Mu(this,{idToken:e}),s=await bn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Mn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(m=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(m,m))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let o=s,u=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,m=o?._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===m)&&g?.user&&(o=g.user,u=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(u)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return _e(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await bu(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ST()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Mn(this.app))return Promise.reject(Ji(this));const t=e?ln(e):null;return t&&_e(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_e(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Mn(this.app)?Promise.reject(Ji(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Mn(this.app)?Promise.reject(Ji(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Rr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await zT(this),t=new $T(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Ha("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await bT(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Rr(e)||this._popupRedirectResolver;_e(t,this,"argument-error"),this.redirectPersistenceManager=await ao.create(this,[Rr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,o){if(this._deleted)return()=>{};const u=typeof t=="function"?t:t.next.bind(t);let h=!1;const m=this._isInitialized?Promise.resolve():this._initializationPromise;if(_e(m,this,"internal-error"),m.then(()=>{h||u(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,s,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _e(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=i_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(Mn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&ET(`Error while retrieving App Check token: ${t.error}`),t?.token}}function rc(i){return ln(i)}class ug{constructor(e){this.auth=e,this.observer=null,this.addObserver=o0(t=>this.observer=t)}get next(){return _e(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wd={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function WT(i){Wd=i}function qT(i){return Wd.loadJS(i)}function KT(){return Wd.gapiScript}function GT(i){return`__${i}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QT(i,e){const t=bd(i,"auth");if(t.isInitialized()){const o=t.getImmediate(),u=t.getOptions();if(es(u,e??{}))return o;rr(o,"already-initialized")}return t.initialize({options:e})}function XT(i,e){const t=e?.persistence||[],s=(Array.isArray(t)?t:[t]).map(Rr);e?.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(s,e?.popupRedirectResolver)}function JT(i,e,t){const s=rc(i);_e(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,u=s_(e),{host:h,port:m}=YT(e),g=m===null?"":`:${m}`,v={url:`${u}//${h}${g}/`},w=Object.freeze({host:h,port:m,protocol:u.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){_e(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),_e(es(v,s.config.emulator)&&es(w,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=v,s.emulatorConfig=w,s.settings.appVerificationDisabledForTesting=!0,wo(h)?(Ly(`${u}//${h}${g}`),My("Auth",!0)):ZT()}function s_(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function YT(i){const e=s_(i),t=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const u=o[1];return{host:u,port:cg(s.substr(u.length+1))}}else{const[u,h]=s.split(":");return{host:u,port:cg(h)}}}function cg(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function ZT(){function i(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ar("not implemented")}_getIdTokenResponse(e){return Ar("not implemented")}_linkToIdToken(e,t){return Ar("not implemented")}_getReauthenticationResolver(e){return Ar("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lo(i,e){return PT(i,"POST","/v1/accounts:signInWithIdp",Bd(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eI="http://localhost";class ns extends o_{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ns(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):rr("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o}=t,u=Fd(t,["providerId","signInMethod"]);if(!s||!o)return null;const h=new ns(s,o);return h.idToken=u.idToken||void 0,h.accessToken=u.accessToken||void 0,h.secret=u.secret,h.nonce=u.nonce,h.pendingToken=u.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return lo(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,lo(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,lo(e,t)}buildRequest(){const e={requestUri:eI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Wa(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka extends qd{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si extends Ka{constructor(){super("facebook.com")}static credential(e){return ns._fromParams({providerId:si.PROVIDER_ID,signInMethod:si.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return si.credentialFromTaggedObject(e)}static credentialFromError(e){return si.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return si.credential(e.oauthAccessToken)}catch{return null}}}si.FACEBOOK_SIGN_IN_METHOD="facebook.com";si.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr extends Ka{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ns._fromParams({providerId:Sr.PROVIDER_ID,signInMethod:Sr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Sr.credentialFromTaggedObject(e)}static credentialFromError(e){return Sr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Sr.credential(t,s)}catch{return null}}}Sr.GOOGLE_SIGN_IN_METHOD="google.com";Sr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oi extends Ka{constructor(){super("github.com")}static credential(e){return ns._fromParams({providerId:oi.PROVIDER_ID,signInMethod:oi.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return oi.credentialFromTaggedObject(e)}static credentialFromError(e){return oi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return oi.credential(e.oauthAccessToken)}catch{return null}}}oi.GITHUB_SIGN_IN_METHOD="github.com";oi.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ai extends Ka{constructor(){super("twitter.com")}static credential(e,t){return ns._fromParams({providerId:ai.PROVIDER_ID,signInMethod:ai.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ai.credentialFromTaggedObject(e)}static credentialFromError(e){return ai.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return ai.credential(t,s)}catch{return null}}}ai.TWITTER_SIGN_IN_METHOD="twitter.com";ai.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,o=!1){const u=await bn._fromIdTokenResponse(e,s,o),h=hg(s);return new mo({user:u,providerId:h,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const o=hg(s);return new mo({user:e,providerId:o,_tokenResponse:s,operationType:t})}}function hg(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu extends xr{constructor(e,t,s,o){var u;super(t.code,t.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,Fu.prototype),this.customData={appName:e.name,tenantId:(u=e.tenantId)!==null&&u!==void 0?u:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,o){return new Fu(e,t,s,o)}}function a_(i,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(i):t._getIdTokenResponse(i)).catch(u=>{throw u.code==="auth/multi-factor-auth-required"?Fu._fromErrorAndOperation(i,u,e,s):u})}async function tI(i,e,t=!1){const s=await La(i,e._linkToIdToken(i.auth,await i.getIdToken()),t);return mo._forOperation(i,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nI(i,e,t=!1){const{auth:s}=i;if(Mn(s.app))return Promise.reject(Ji(s));const o="reauthenticate";try{const u=await La(i,a_(s,o,e,i),t);_e(u.idToken,s,"internal-error");const h=$d(u.idToken);_e(h,s,"internal-error");const{sub:m}=h;return _e(i.uid===m,s,"user-mismatch"),mo._forOperation(i,o,u)}catch(u){throw u?.code==="auth/user-not-found"&&rr(s,"user-mismatch"),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rI(i,e,t=!1){if(Mn(i.app))return Promise.reject(Ji(i));const s="signIn",o=await a_(i,s,e),u=await mo._fromIdTokenResponse(i,s,o);return t||await i._updateCurrentUser(u.user),u}function iI(i,e,t,s){return ln(i).onIdTokenChanged(e,t,s)}function sI(i,e,t){return ln(i).beforeAuthStateChanged(e,t)}function oI(i,e,t,s){return ln(i).onAuthStateChanged(e,t,s)}function aI(i){return ln(i).signOut()}const Uu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l_{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Uu,"1"),this.storage.removeItem(Uu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lI=1e3,uI=10;class u_ extends l_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=r_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),o=this.localCache[t];s!==o&&e(t,o,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,m,g)=>{this.notifyListeners(h,g)});return}const s=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(s);!t&&this.localCache[s]===h||this.notifyListeners(s,h)},u=this.storage.getItem(s);UT()&&u!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,uI):o()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},lI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}u_.type="LOCAL";const cI=u_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c_ extends l_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}c_.type="SESSION";const h_=c_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hI(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const s=new ic(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:o,data:u}=t.data,h=this.handlersMap[o];if(!h?.size)return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const m=Array.from(h).map(async v=>v(t.origin,u)),g=await hI(m);t.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ic.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kd(i="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return i+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let u,h;return new Promise((m,g)=>{const v=Kd("",20);o.port1.start();const w=setTimeout(()=>{g(new Error("unsupported_event"))},s);h={messageChannel:o,onMessage(S){const P=S;if(P.data.eventId===v)switch(P.data.status){case"ack":clearTimeout(w),u=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(u),m(P.data.response);break;default:clearTimeout(w),clearTimeout(u),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:v,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yn(){return window}function fI(i){Yn().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function d_(){return typeof Yn().WorkerGlobalScope<"u"&&typeof Yn().importScripts=="function"}async function pI(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function mI(){var i;return((i=navigator?.serviceWorker)===null||i===void 0?void 0:i.controller)||null}function gI(){return d_()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_="firebaseLocalStorageDb",yI=1,ju="firebaseLocalStorage",p_="fbase_key";class Ga{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function sc(i,e){return i.transaction([ju],e?"readwrite":"readonly").objectStore(ju)}function _I(){const i=indexedDB.deleteDatabase(f_);return new Ga(i).toPromise()}function gd(){const i=indexedDB.open(f_,yI);return new Promise((e,t)=>{i.addEventListener("error",()=>{t(i.error)}),i.addEventListener("upgradeneeded",()=>{const s=i.result;try{s.createObjectStore(ju,{keyPath:p_})}catch(o){t(o)}}),i.addEventListener("success",async()=>{const s=i.result;s.objectStoreNames.contains(ju)?e(s):(s.close(),await _I(),e(await gd()))})})}async function dg(i,e,t){const s=sc(i,!0).put({[p_]:e,value:t});return new Ga(s).toPromise()}async function vI(i,e){const t=sc(i,!1).get(e),s=await new Ga(t).toPromise();return s===void 0?null:s.value}function fg(i,e){const t=sc(i,!0).delete(e);return new Ga(t).toPromise()}const EI=800,wI=3;class m_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await gd(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>wI)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return d_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ic._getInstance(gI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await pI(),!this.activeServiceWorker)return;this.sender=new dI(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||mI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await gd();return await dg(e,Uu,"1"),await fg(e,Uu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>dg(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>vI(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>fg(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const u=sc(o,!1).getAll();return new Ga(u).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:u}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(u)&&(this.notifyListeners(o,u),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),EI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}m_.type="LOCAL";const TI=m_;new qa(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g_(i,e){return e?Rr(e):(_e(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd extends o_{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return lo(e,this._buildIdpRequest())}_linkToIdToken(e,t){return lo(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return lo(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function II(i){return rI(i.auth,new Gd(i),i.bypassAuthState)}function SI(i){const{auth:e,user:t}=i;return _e(t,e,"internal-error"),nI(t,new Gd(i),i.bypassAuthState)}async function AI(i){const{auth:e,user:t}=i;return _e(t,e,"internal-error"),tI(t,new Gd(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(e,t,s,o,u=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=u,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:o,tenantId:u,error:h,type:m}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:s,tenantId:u||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(m)(g))}catch(v){this.reject(v)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return II;case"linkViaPopup":case"linkViaRedirect":return AI;case"reauthViaPopup":case"reauthViaRedirect":return SI;default:rr(this.auth,"internal-error")}}resolve(e){kr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){kr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RI=new qa(2e3,1e4);async function CI(i,e,t){if(Mn(i.app))return Promise.reject(Un(i,"operation-not-supported-in-this-environment"));const s=rc(i);wT(i,e,qd);const o=g_(s,t);return new Qi(s,"signInViaPopup",e,o).executeNotNull()}class Qi extends y_{constructor(e,t,s,o,u){super(e,t,o,u),this.provider=s,this.authWindow=null,this.pollId=null,Qi.currentPopupAction&&Qi.currentPopupAction.cancel(),Qi.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return _e(e,this.auth,"internal-error"),e}async onExecution(){kr(this.filter.length===1,"Popup operations only handle one event");const e=Kd();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Un(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Un(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Qi.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Un(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,RI.get())};e()}}Qi.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PI="pendingRedirect",Au=new Map;class kI extends y_{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Au.get(this.auth._key());if(!e){try{const s=await NI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Au.set(this.auth._key(),e)}return this.bypassAuthState||Au.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function NI(i,e){const t=VI(e),s=xI(i);if(!await s._isAvailable())return!1;const o=await s._get(t)==="true";return await s._remove(t),o}function DI(i,e){Au.set(i._key(),e)}function xI(i){return Rr(i._redirectPersistence)}function VI(i){return Su(PI,i.config.apiKey,i.name)}async function OI(i,e,t=!1){if(Mn(i.app))return Promise.reject(Ji(i));const s=rc(i),o=g_(s,e),h=await new kI(s,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await s._persistUserIfCurrent(h.user),await s._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LI=600*1e3;class MI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!bI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!__(e)){const o=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(Un(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=LI&&this.cachedEventUids.clear(),this.cachedEventUids.has(pg(e))}saveEventToCache(e){this.cachedEventUids.add(pg(e)),this.lastProcessedEventTime=Date.now()}}function pg(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function __({type:i,error:e}){return i==="unknown"&&e?.code==="auth/no-auth-event"}function bI(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return __(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function FI(i,e={}){return Io(i,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UI=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,jI=/^https?/;async function zI(i){if(i.config.emulator)return;const{authorizedDomains:e}=await FI(i);for(const t of e)try{if(BI(t))return}catch{}rr(i,"unauthorized-domain")}function BI(i){const e=pd(),{protocol:t,hostname:s}=new URL(e);if(i.startsWith("chrome-extension://")){const h=new URL(i);return h.hostname===""&&s===""?t==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===s}if(!jI.test(t))return!1;if(UI.test(i))return s===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $I=new qa(3e4,6e4);function mg(){const i=Yn().___jsl;if(i?.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let t=0;t<i.CP.length;t++)i.CP[t]=null}}function HI(i){return new Promise((e,t)=>{var s,o,u;function h(){mg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{mg(),t(Un(i,"network-request-failed"))},timeout:$I.get()})}if(!((o=(s=Yn().gapi)===null||s===void 0?void 0:s.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((u=Yn().gapi)===null||u===void 0)&&u.load)h();else{const m=GT("iframefcb");return Yn()[m]=()=>{gapi.load?h():t(Un(i,"network-request-failed"))},qT(`${KT()}?onload=${m}`).catch(g=>t(g))}}).catch(e=>{throw Ru=null,e})}let Ru=null;function WI(i){return Ru=Ru||HI(i),Ru}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qI=new qa(5e3,15e3),KI="__/auth/iframe",GI="emulator/auth/iframe",QI={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},XI=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function JI(i){const e=i.config;_e(e.authDomain,i,"auth-domain-config-required");const t=e.emulator?zd(e,GI):`https://${i.config.authDomain}/${KI}`,s={apiKey:e.apiKey,appName:i.name,v:To},o=XI.get(i.config.apiHost);o&&(s.eid=o);const u=i._getFrameworks();return u.length&&(s.fw=u.join(",")),`${t}?${Wa(s).slice(1)}`}async function YI(i){const e=await WI(i),t=Yn().gapi;return _e(t,i,"internal-error"),e.open({where:document.body,url:JI(i),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:QI,dontclear:!0},s=>new Promise(async(o,u)=>{await s.restyle({setHideOnLeave:!1});const h=Un(i,"network-request-failed"),m=Yn().setTimeout(()=>{u(h)},qI.get());function g(){Yn().clearTimeout(m),o(s)}s.ping(g).then(g,()=>{u(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZI={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},eS=500,tS=600,nS="_blank",rS="http://localhost";class gg{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function iS(i,e,t,s=eS,o=tS){const u=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-s)/2,0).toString();let m="";const g=Object.assign(Object.assign({},ZI),{width:s.toString(),height:o.toString(),top:u,left:h}),v=jt().toLowerCase();t&&(m=Yy(v)?nS:t),Xy(v)&&(e=e||rS,g.scrollbars="yes");const w=Object.entries(g).reduce((P,[j,K])=>`${P}${j}=${K},`,"");if(FT(v)&&m!=="_self")return sS(e||"",m),new gg(null);const S=window.open(e||"",m,w);_e(S,i,"popup-blocked");try{S.focus()}catch{}return new gg(S)}function sS(i,e){const t=document.createElement("a");t.href=i,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oS="__/auth/handler",aS="emulator/auth/handler",lS=encodeURIComponent("fac");async function yg(i,e,t,s,o,u){_e(i.config.authDomain,i,"auth-domain-config-required"),_e(i.config.apiKey,i,"invalid-api-key");const h={apiKey:i.config.apiKey,appName:i.name,authType:t,redirectUrl:s,v:To,eventId:o};if(e instanceof qd){e.setDefaultLanguage(i.languageCode),h.providerId=e.providerId||"",s0(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[w,S]of Object.entries({}))h[w]=S}if(e instanceof Ka){const w=e.getScopes().filter(S=>S!=="");w.length>0&&(h.scopes=w.join(","))}i.tenantId&&(h.tid=i.tenantId);const m=h;for(const w of Object.keys(m))m[w]===void 0&&delete m[w];const g=await i._getAppCheckToken(),v=g?`#${lS}=${encodeURIComponent(g)}`:"";return`${uS(i)}?${Wa(m).slice(1)}${v}`}function uS({config:i}){return i.emulator?zd(i,aS):`https://${i.authDomain}/${oS}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const id="webStorageSupport";class cS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=h_,this._completeRedirectFn=OI,this._overrideRedirectResult=DI}async _openPopup(e,t,s,o){var u;kr((u=this.eventManagers[e._key()])===null||u===void 0?void 0:u.manager,"_initialize() not called before _openPopup()");const h=await yg(e,t,s,pd(),o);return iS(e,h,Kd())}async _openRedirect(e,t,s,o){await this._originValidation(e);const u=await yg(e,t,s,pd(),o);return fI(u),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:u}=this.eventManagers[t];return o?Promise.resolve(o):(kr(u,"If manager is not set, promise should be"),u)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await YI(e),s=new MI(e);return t.register("authEvent",o=>(_e(o?.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(id,{type:id},o=>{var u;const h=(u=o?.[0])===null||u===void 0?void 0:u[id];h!==void 0&&t(!!h),rr(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=zI(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return r_()||Jy()||Hd()}}const hS=cS;var _g="@firebase/auth",vg="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e(s?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_e(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fS(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function pS(i){po(new ts("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),u=e.getProvider("app-check-internal"),{apiKey:h,authDomain:m}=s.options;_e(h&&!h.includes(":"),"invalid-api-key",{appName:s.name});const g={apiKey:h,authDomain:m,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:i_(i)},v=new HT(s,o,u,g);return XT(v,t),v},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),po(new ts("auth-internal",e=>{const t=rc(e.getProvider("auth").getImmediate());return(s=>new dS(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),hi(_g,vg,fS(i)),hi(_g,vg,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mS=300,gS=Oy("authIdTokenMaxAge")||mS;let Eg=null;const yS=i=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>gS)return;const o=t?.token;Eg!==o&&(Eg=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function _S(i=jy()){const e=bd(i,"auth");if(e.isInitialized())return e.getImmediate();const t=QT(i,{popupRedirectResolver:hS,persistence:[TI,cI,h_]}),s=Oy("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const u=new URL(s,location.origin);if(location.origin===u.origin){const h=yS(u.toString());sI(t,h,()=>h(t.currentUser)),iI(t,m=>h(m))}}const o=xy("auth");return o&&JT(t,`http://${o}`),t}function vS(){var i,e;return(e=(i=document.getElementsByTagName("head"))===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:document}WT({loadJS(i){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",i),s.onload=e,s.onerror=o=>{const u=Un("internal-error");u.customData=o,t(u)},s.type="text/javascript",s.charset="UTF-8",vS().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});pS("Browser");var wg=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var di,v_;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(D,I){function R(){}R.prototype=I.prototype,D.D=I.prototype,D.prototype=new R,D.prototype.constructor=D,D.C=function(k,x,O){for(var A=Array(arguments.length-2),nt=2;nt<arguments.length;nt++)A[nt-2]=arguments[nt];return I.prototype[x].apply(k,A)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(D,I,R){R||(R=0);var k=Array(16);if(typeof I=="string")for(var x=0;16>x;++x)k[x]=I.charCodeAt(R++)|I.charCodeAt(R++)<<8|I.charCodeAt(R++)<<16|I.charCodeAt(R++)<<24;else for(x=0;16>x;++x)k[x]=I[R++]|I[R++]<<8|I[R++]<<16|I[R++]<<24;I=D.g[0],R=D.g[1],x=D.g[2];var O=D.g[3],A=I+(O^R&(x^O))+k[0]+3614090360&4294967295;I=R+(A<<7&4294967295|A>>>25),A=O+(x^I&(R^x))+k[1]+3905402710&4294967295,O=I+(A<<12&4294967295|A>>>20),A=x+(R^O&(I^R))+k[2]+606105819&4294967295,x=O+(A<<17&4294967295|A>>>15),A=R+(I^x&(O^I))+k[3]+3250441966&4294967295,R=x+(A<<22&4294967295|A>>>10),A=I+(O^R&(x^O))+k[4]+4118548399&4294967295,I=R+(A<<7&4294967295|A>>>25),A=O+(x^I&(R^x))+k[5]+1200080426&4294967295,O=I+(A<<12&4294967295|A>>>20),A=x+(R^O&(I^R))+k[6]+2821735955&4294967295,x=O+(A<<17&4294967295|A>>>15),A=R+(I^x&(O^I))+k[7]+4249261313&4294967295,R=x+(A<<22&4294967295|A>>>10),A=I+(O^R&(x^O))+k[8]+1770035416&4294967295,I=R+(A<<7&4294967295|A>>>25),A=O+(x^I&(R^x))+k[9]+2336552879&4294967295,O=I+(A<<12&4294967295|A>>>20),A=x+(R^O&(I^R))+k[10]+4294925233&4294967295,x=O+(A<<17&4294967295|A>>>15),A=R+(I^x&(O^I))+k[11]+2304563134&4294967295,R=x+(A<<22&4294967295|A>>>10),A=I+(O^R&(x^O))+k[12]+1804603682&4294967295,I=R+(A<<7&4294967295|A>>>25),A=O+(x^I&(R^x))+k[13]+4254626195&4294967295,O=I+(A<<12&4294967295|A>>>20),A=x+(R^O&(I^R))+k[14]+2792965006&4294967295,x=O+(A<<17&4294967295|A>>>15),A=R+(I^x&(O^I))+k[15]+1236535329&4294967295,R=x+(A<<22&4294967295|A>>>10),A=I+(x^O&(R^x))+k[1]+4129170786&4294967295,I=R+(A<<5&4294967295|A>>>27),A=O+(R^x&(I^R))+k[6]+3225465664&4294967295,O=I+(A<<9&4294967295|A>>>23),A=x+(I^R&(O^I))+k[11]+643717713&4294967295,x=O+(A<<14&4294967295|A>>>18),A=R+(O^I&(x^O))+k[0]+3921069994&4294967295,R=x+(A<<20&4294967295|A>>>12),A=I+(x^O&(R^x))+k[5]+3593408605&4294967295,I=R+(A<<5&4294967295|A>>>27),A=O+(R^x&(I^R))+k[10]+38016083&4294967295,O=I+(A<<9&4294967295|A>>>23),A=x+(I^R&(O^I))+k[15]+3634488961&4294967295,x=O+(A<<14&4294967295|A>>>18),A=R+(O^I&(x^O))+k[4]+3889429448&4294967295,R=x+(A<<20&4294967295|A>>>12),A=I+(x^O&(R^x))+k[9]+568446438&4294967295,I=R+(A<<5&4294967295|A>>>27),A=O+(R^x&(I^R))+k[14]+3275163606&4294967295,O=I+(A<<9&4294967295|A>>>23),A=x+(I^R&(O^I))+k[3]+4107603335&4294967295,x=O+(A<<14&4294967295|A>>>18),A=R+(O^I&(x^O))+k[8]+1163531501&4294967295,R=x+(A<<20&4294967295|A>>>12),A=I+(x^O&(R^x))+k[13]+2850285829&4294967295,I=R+(A<<5&4294967295|A>>>27),A=O+(R^x&(I^R))+k[2]+4243563512&4294967295,O=I+(A<<9&4294967295|A>>>23),A=x+(I^R&(O^I))+k[7]+1735328473&4294967295,x=O+(A<<14&4294967295|A>>>18),A=R+(O^I&(x^O))+k[12]+2368359562&4294967295,R=x+(A<<20&4294967295|A>>>12),A=I+(R^x^O)+k[5]+4294588738&4294967295,I=R+(A<<4&4294967295|A>>>28),A=O+(I^R^x)+k[8]+2272392833&4294967295,O=I+(A<<11&4294967295|A>>>21),A=x+(O^I^R)+k[11]+1839030562&4294967295,x=O+(A<<16&4294967295|A>>>16),A=R+(x^O^I)+k[14]+4259657740&4294967295,R=x+(A<<23&4294967295|A>>>9),A=I+(R^x^O)+k[1]+2763975236&4294967295,I=R+(A<<4&4294967295|A>>>28),A=O+(I^R^x)+k[4]+1272893353&4294967295,O=I+(A<<11&4294967295|A>>>21),A=x+(O^I^R)+k[7]+4139469664&4294967295,x=O+(A<<16&4294967295|A>>>16),A=R+(x^O^I)+k[10]+3200236656&4294967295,R=x+(A<<23&4294967295|A>>>9),A=I+(R^x^O)+k[13]+681279174&4294967295,I=R+(A<<4&4294967295|A>>>28),A=O+(I^R^x)+k[0]+3936430074&4294967295,O=I+(A<<11&4294967295|A>>>21),A=x+(O^I^R)+k[3]+3572445317&4294967295,x=O+(A<<16&4294967295|A>>>16),A=R+(x^O^I)+k[6]+76029189&4294967295,R=x+(A<<23&4294967295|A>>>9),A=I+(R^x^O)+k[9]+3654602809&4294967295,I=R+(A<<4&4294967295|A>>>28),A=O+(I^R^x)+k[12]+3873151461&4294967295,O=I+(A<<11&4294967295|A>>>21),A=x+(O^I^R)+k[15]+530742520&4294967295,x=O+(A<<16&4294967295|A>>>16),A=R+(x^O^I)+k[2]+3299628645&4294967295,R=x+(A<<23&4294967295|A>>>9),A=I+(x^(R|~O))+k[0]+4096336452&4294967295,I=R+(A<<6&4294967295|A>>>26),A=O+(R^(I|~x))+k[7]+1126891415&4294967295,O=I+(A<<10&4294967295|A>>>22),A=x+(I^(O|~R))+k[14]+2878612391&4294967295,x=O+(A<<15&4294967295|A>>>17),A=R+(O^(x|~I))+k[5]+4237533241&4294967295,R=x+(A<<21&4294967295|A>>>11),A=I+(x^(R|~O))+k[12]+1700485571&4294967295,I=R+(A<<6&4294967295|A>>>26),A=O+(R^(I|~x))+k[3]+2399980690&4294967295,O=I+(A<<10&4294967295|A>>>22),A=x+(I^(O|~R))+k[10]+4293915773&4294967295,x=O+(A<<15&4294967295|A>>>17),A=R+(O^(x|~I))+k[1]+2240044497&4294967295,R=x+(A<<21&4294967295|A>>>11),A=I+(x^(R|~O))+k[8]+1873313359&4294967295,I=R+(A<<6&4294967295|A>>>26),A=O+(R^(I|~x))+k[15]+4264355552&4294967295,O=I+(A<<10&4294967295|A>>>22),A=x+(I^(O|~R))+k[6]+2734768916&4294967295,x=O+(A<<15&4294967295|A>>>17),A=R+(O^(x|~I))+k[13]+1309151649&4294967295,R=x+(A<<21&4294967295|A>>>11),A=I+(x^(R|~O))+k[4]+4149444226&4294967295,I=R+(A<<6&4294967295|A>>>26),A=O+(R^(I|~x))+k[11]+3174756917&4294967295,O=I+(A<<10&4294967295|A>>>22),A=x+(I^(O|~R))+k[2]+718787259&4294967295,x=O+(A<<15&4294967295|A>>>17),A=R+(O^(x|~I))+k[9]+3951481745&4294967295,D.g[0]=D.g[0]+I&4294967295,D.g[1]=D.g[1]+(x+(A<<21&4294967295|A>>>11))&4294967295,D.g[2]=D.g[2]+x&4294967295,D.g[3]=D.g[3]+O&4294967295}s.prototype.u=function(D,I){I===void 0&&(I=D.length);for(var R=I-this.blockSize,k=this.B,x=this.h,O=0;O<I;){if(x==0)for(;O<=R;)o(this,D,O),O+=this.blockSize;if(typeof D=="string"){for(;O<I;)if(k[x++]=D.charCodeAt(O++),x==this.blockSize){o(this,k),x=0;break}}else for(;O<I;)if(k[x++]=D[O++],x==this.blockSize){o(this,k),x=0;break}}this.h=x,this.o+=I},s.prototype.v=function(){var D=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);D[0]=128;for(var I=1;I<D.length-8;++I)D[I]=0;var R=8*this.o;for(I=D.length-8;I<D.length;++I)D[I]=R&255,R/=256;for(this.u(D),D=Array(16),I=R=0;4>I;++I)for(var k=0;32>k;k+=8)D[R++]=this.g[I]>>>k&255;return D};function u(D,I){var R=m;return Object.prototype.hasOwnProperty.call(R,D)?R[D]:R[D]=I(D)}function h(D,I){this.h=I;for(var R=[],k=!0,x=D.length-1;0<=x;x--){var O=D[x]|0;k&&O==I||(R[x]=O,k=!1)}this.g=R}var m={};function g(D){return-128<=D&&128>D?u(D,function(I){return new h([I|0],0>I?-1:0)}):new h([D|0],0>D?-1:0)}function v(D){if(isNaN(D)||!isFinite(D))return S;if(0>D)return z(v(-D));for(var I=[],R=1,k=0;D>=R;k++)I[k]=D/R|0,R*=4294967296;return new h(I,0)}function w(D,I){if(D.length==0)throw Error("number format error: empty string");if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(D.charAt(0)=="-")return z(w(D.substring(1),I));if(0<=D.indexOf("-"))throw Error('number format error: interior "-" character');for(var R=v(Math.pow(I,8)),k=S,x=0;x<D.length;x+=8){var O=Math.min(8,D.length-x),A=parseInt(D.substring(x,x+O),I);8>O?(O=v(Math.pow(I,O)),k=k.j(O).add(v(A))):(k=k.j(R),k=k.add(v(A)))}return k}var S=g(0),P=g(1),j=g(16777216);i=h.prototype,i.m=function(){if(B(this))return-z(this).m();for(var D=0,I=1,R=0;R<this.g.length;R++){var k=this.i(R);D+=(0<=k?k:4294967296+k)*I,I*=4294967296}return D},i.toString=function(D){if(D=D||10,2>D||36<D)throw Error("radix out of range: "+D);if(K(this))return"0";if(B(this))return"-"+z(this).toString(D);for(var I=v(Math.pow(D,6)),R=this,k="";;){var x=we(R,I).g;R=ue(R,x.j(I));var O=((0<R.g.length?R.g[0]:R.h)>>>0).toString(D);if(R=x,K(R))return O+k;for(;6>O.length;)O="0"+O;k=O+k}},i.i=function(D){return 0>D?0:D<this.g.length?this.g[D]:this.h};function K(D){if(D.h!=0)return!1;for(var I=0;I<D.g.length;I++)if(D.g[I]!=0)return!1;return!0}function B(D){return D.h==-1}i.l=function(D){return D=ue(this,D),B(D)?-1:K(D)?0:1};function z(D){for(var I=D.g.length,R=[],k=0;k<I;k++)R[k]=~D.g[k];return new h(R,~D.h).add(P)}i.abs=function(){return B(this)?z(this):this},i.add=function(D){for(var I=Math.max(this.g.length,D.g.length),R=[],k=0,x=0;x<=I;x++){var O=k+(this.i(x)&65535)+(D.i(x)&65535),A=(O>>>16)+(this.i(x)>>>16)+(D.i(x)>>>16);k=A>>>16,O&=65535,A&=65535,R[x]=A<<16|O}return new h(R,R[R.length-1]&-2147483648?-1:0)};function ue(D,I){return D.add(z(I))}i.j=function(D){if(K(this)||K(D))return S;if(B(this))return B(D)?z(this).j(z(D)):z(z(this).j(D));if(B(D))return z(this.j(z(D)));if(0>this.l(j)&&0>D.l(j))return v(this.m()*D.m());for(var I=this.g.length+D.g.length,R=[],k=0;k<2*I;k++)R[k]=0;for(k=0;k<this.g.length;k++)for(var x=0;x<D.g.length;x++){var O=this.i(k)>>>16,A=this.i(k)&65535,nt=D.i(x)>>>16,Dt=D.i(x)&65535;R[2*k+2*x]+=A*Dt,ce(R,2*k+2*x),R[2*k+2*x+1]+=O*Dt,ce(R,2*k+2*x+1),R[2*k+2*x+1]+=A*nt,ce(R,2*k+2*x+1),R[2*k+2*x+2]+=O*nt,ce(R,2*k+2*x+2)}for(k=0;k<I;k++)R[k]=R[2*k+1]<<16|R[2*k];for(k=I;k<2*I;k++)R[k]=0;return new h(R,0)};function ce(D,I){for(;(D[I]&65535)!=D[I];)D[I+1]+=D[I]>>>16,D[I]&=65535,I++}function me(D,I){this.g=D,this.h=I}function we(D,I){if(K(I))throw Error("division by zero");if(K(D))return new me(S,S);if(B(D))return I=we(z(D),I),new me(z(I.g),z(I.h));if(B(I))return I=we(D,z(I)),new me(z(I.g),I.h);if(30<D.g.length){if(B(D)||B(I))throw Error("slowDivide_ only works with positive integers.");for(var R=P,k=I;0>=k.l(D);)R=Ge(R),k=Ge(k);var x=Re(R,1),O=Re(k,1);for(k=Re(k,2),R=Re(R,2);!K(k);){var A=O.add(k);0>=A.l(D)&&(x=x.add(R),O=A),k=Re(k,1),R=Re(R,1)}return I=ue(D,x.j(I)),new me(x,I)}for(x=S;0<=D.l(I);){for(R=Math.max(1,Math.floor(D.m()/I.m())),k=Math.ceil(Math.log(R)/Math.LN2),k=48>=k?1:Math.pow(2,k-48),O=v(R),A=O.j(I);B(A)||0<A.l(D);)R-=k,O=v(R),A=O.j(I);K(O)&&(O=P),x=x.add(O),D=ue(D,A)}return new me(x,D)}i.A=function(D){return we(this,D).h},i.and=function(D){for(var I=Math.max(this.g.length,D.g.length),R=[],k=0;k<I;k++)R[k]=this.i(k)&D.i(k);return new h(R,this.h&D.h)},i.or=function(D){for(var I=Math.max(this.g.length,D.g.length),R=[],k=0;k<I;k++)R[k]=this.i(k)|D.i(k);return new h(R,this.h|D.h)},i.xor=function(D){for(var I=Math.max(this.g.length,D.g.length),R=[],k=0;k<I;k++)R[k]=this.i(k)^D.i(k);return new h(R,this.h^D.h)};function Ge(D){for(var I=D.g.length+1,R=[],k=0;k<I;k++)R[k]=D.i(k)<<1|D.i(k-1)>>>31;return new h(R,D.h)}function Re(D,I){var R=I>>5;I%=32;for(var k=D.g.length-R,x=[],O=0;O<k;O++)x[O]=0<I?D.i(O+R)>>>I|D.i(O+R+1)<<32-I:D.i(O+R);return new h(x,D.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,v_=s,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=v,h.fromString=w,di=h}).apply(typeof wg<"u"?wg:typeof self<"u"?self:typeof window<"u"?window:{});var yu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var E_,Sa,w_,Cu,yd,T_,I_,S_;(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(l,f,y){return l==Array.prototype||l==Object.prototype||(l[f]=y.value),l};function t(l){l=[typeof globalThis=="object"&&globalThis,l,typeof window=="object"&&window,typeof self=="object"&&self,typeof yu=="object"&&yu];for(var f=0;f<l.length;++f){var y=l[f];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var s=t(this);function o(l,f){if(f)e:{var y=s;l=l.split(".");for(var E=0;E<l.length-1;E++){var L=l[E];if(!(L in y))break e;y=y[L]}l=l[l.length-1],E=y[l],f=f(E),f!=E&&f!=null&&e(y,l,{configurable:!0,writable:!0,value:f})}}function u(l,f){l instanceof String&&(l+="");var y=0,E=!1,L={next:function(){if(!E&&y<l.length){var U=y++;return{value:f(U,l[U]),done:!1}}return E=!0,{done:!0,value:void 0}}};return L[Symbol.iterator]=function(){return L},L}o("Array.prototype.values",function(l){return l||function(){return u(this,function(f,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},m=this||self;function g(l){var f=typeof l;return f=f!="object"?f:l?Array.isArray(l)?"array":f:"null",f=="array"||f=="object"&&typeof l.length=="number"}function v(l){var f=typeof l;return f=="object"&&l!=null||f=="function"}function w(l,f,y){return l.call.apply(l.bind,arguments)}function S(l,f,y){if(!l)throw Error();if(2<arguments.length){var E=Array.prototype.slice.call(arguments,2);return function(){var L=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(L,E),l.apply(f,L)}}return function(){return l.apply(f,arguments)}}function P(l,f,y){return P=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?w:S,P.apply(null,arguments)}function j(l,f){var y=Array.prototype.slice.call(arguments,1);return function(){var E=y.slice();return E.push.apply(E,arguments),l.apply(this,E)}}function K(l,f){function y(){}y.prototype=f.prototype,l.aa=f.prototype,l.prototype=new y,l.prototype.constructor=l,l.Qb=function(E,L,U){for(var Y=Array(arguments.length-2),Ue=2;Ue<arguments.length;Ue++)Y[Ue-2]=arguments[Ue];return f.prototype[L].apply(E,Y)}}function B(l){const f=l.length;if(0<f){const y=Array(f);for(let E=0;E<f;E++)y[E]=l[E];return y}return[]}function z(l,f){for(let y=1;y<arguments.length;y++){const E=arguments[y];if(g(E)){const L=l.length||0,U=E.length||0;l.length=L+U;for(let Y=0;Y<U;Y++)l[L+Y]=E[Y]}else l.push(E)}}class ue{constructor(f,y){this.i=f,this.j=y,this.h=0,this.g=null}get(){let f;return 0<this.h?(this.h--,f=this.g,this.g=f.next,f.next=null):f=this.i(),f}}function ce(l){return/^[\s\xa0]*$/.test(l)}function me(){var l=m.navigator;return l&&(l=l.userAgent)?l:""}function we(l){return we[" "](l),l}we[" "]=function(){};var Ge=me().indexOf("Gecko")!=-1&&!(me().toLowerCase().indexOf("webkit")!=-1&&me().indexOf("Edge")==-1)&&!(me().indexOf("Trident")!=-1||me().indexOf("MSIE")!=-1)&&me().indexOf("Edge")==-1;function Re(l,f,y){for(const E in l)f.call(y,l[E],E,l)}function D(l,f){for(const y in l)f.call(void 0,l[y],y,l)}function I(l){const f={};for(const y in l)f[y]=l[y];return f}const R="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function k(l,f){let y,E;for(let L=1;L<arguments.length;L++){E=arguments[L];for(y in E)l[y]=E[y];for(let U=0;U<R.length;U++)y=R[U],Object.prototype.hasOwnProperty.call(E,y)&&(l[y]=E[y])}}function x(l){var f=1;l=l.split(":");const y=[];for(;0<f&&l.length;)y.push(l.shift()),f--;return l.length&&y.push(l.join(":")),y}function O(l){m.setTimeout(()=>{throw l},0)}function A(){var l=he;let f=null;return l.g&&(f=l.g,l.g=l.g.next,l.g||(l.h=null),f.next=null),f}class nt{constructor(){this.h=this.g=null}add(f,y){const E=Dt.get();E.set(f,y),this.h?this.h.next=E:this.g=E,this.h=E}}var Dt=new ue(()=>new xt,l=>l.reset());class xt{constructor(){this.next=this.g=this.h=null}set(f,y){this.h=f,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let je,Z=!1,he=new nt,ne=()=>{const l=m.Promise.resolve(void 0);je=()=>{l.then(V)}};var V=()=>{for(var l;l=A();){try{l.h.call(l.g)}catch(y){O(y)}var f=Dt;f.j(l),100>f.h&&(f.h++,l.next=f.g,f.g=l)}Z=!1};function H(){this.s=this.s,this.C=this.C}H.prototype.s=!1,H.prototype.ma=function(){this.s||(this.s=!0,this.N())},H.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ae(l,f){this.type=l,this.g=this.target=f,this.defaultPrevented=!1}ae.prototype.h=function(){this.defaultPrevented=!0};var Te=(function(){if(!m.addEventListener||!Object.defineProperty)return!1;var l=!1,f=Object.defineProperty({},"passive",{get:function(){l=!0}});try{const y=()=>{};m.addEventListener("test",y,f),m.removeEventListener("test",y,f)}catch{}return l})();function Se(l,f){if(ae.call(this,l?l.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,l){var y=this.type=l.type,E=l.changedTouches&&l.changedTouches.length?l.changedTouches[0]:null;if(this.target=l.target||l.srcElement,this.g=f,f=l.relatedTarget){if(Ge){e:{try{we(f.nodeName);var L=!0;break e}catch{}L=!1}L||(f=null)}}else y=="mouseover"?f=l.fromElement:y=="mouseout"&&(f=l.toElement);this.relatedTarget=f,E?(this.clientX=E.clientX!==void 0?E.clientX:E.pageX,this.clientY=E.clientY!==void 0?E.clientY:E.pageY,this.screenX=E.screenX||0,this.screenY=E.screenY||0):(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0),this.button=l.button,this.key=l.key||"",this.ctrlKey=l.ctrlKey,this.altKey=l.altKey,this.shiftKey=l.shiftKey,this.metaKey=l.metaKey,this.pointerId=l.pointerId||0,this.pointerType=typeof l.pointerType=="string"?l.pointerType:Ne[l.pointerType]||"",this.state=l.state,this.i=l,l.defaultPrevented&&Se.aa.h.call(this)}}K(Se,ae);var Ne={2:"touch",3:"pen",4:"mouse"};Se.prototype.h=function(){Se.aa.h.call(this);var l=this.i;l.preventDefault?l.preventDefault():l.returnValue=!1};var Me="closure_listenable_"+(1e6*Math.random()|0),be=0;function Be(l,f,y,E,L){this.listener=l,this.proxy=null,this.src=f,this.type=y,this.capture=!!E,this.ha=L,this.key=++be,this.da=this.fa=!1}function yt(l){l.da=!0,l.listener=null,l.proxy=null,l.src=null,l.ha=null}function or(l){this.src=l,this.g={},this.h=0}or.prototype.add=function(l,f,y,E,L){var U=l.toString();l=this.g[U],l||(l=this.g[U]=[],this.h++);var Y=Vr(l,f,E,L);return-1<Y?(f=l[Y],y||(f.fa=!1)):(f=new Be(f,this.src,U,!!E,L),f.fa=y,l.push(f)),f};function us(l,f){var y=f.type;if(y in l.g){var E=l.g[y],L=Array.prototype.indexOf.call(E,f,void 0),U;(U=0<=L)&&Array.prototype.splice.call(E,L,1),U&&(yt(f),l.g[y].length==0&&(delete l.g[y],l.h--))}}function Vr(l,f,y,E){for(var L=0;L<l.length;++L){var U=l[L];if(!U.da&&U.listener==f&&U.capture==!!y&&U.ha==E)return L}return-1}var Ei="closure_lm_"+(1e6*Math.random()|0),cs={};function Po(l,f,y,E,L){if(Array.isArray(f)){for(var U=0;U<f.length;U++)Po(l,f[U],y,E,L);return null}return y=Do(y),l&&l[Me]?l.K(f,y,v(E)?!!E.capture:!1,L):ko(l,f,y,!1,E,L)}function ko(l,f,y,E,L,U){if(!f)throw Error("Invalid event type");var Y=v(L)?!!L.capture:!!L,Ue=ds(l);if(Ue||(l[Ei]=Ue=new or(l)),y=Ue.add(f,y,E,Y,U),y.proxy)return y;if(E=el(),y.proxy=E,E.src=l,E.listener=y,l.addEventListener)Te||(L=Y),L===void 0&&(L=!1),l.addEventListener(f.toString(),E,L);else if(l.attachEvent)l.attachEvent(lr(f.toString()),E);else if(l.addListener&&l.removeListener)l.addListener(E);else throw Error("addEventListener and attachEvent are unavailable.");return y}function el(){function l(y){return f.call(l.src,l.listener,y)}const f=No;return l}function hs(l,f,y,E,L){if(Array.isArray(f))for(var U=0;U<f.length;U++)hs(l,f[U],y,E,L);else E=v(E)?!!E.capture:!!E,y=Do(y),l&&l[Me]?(l=l.i,f=String(f).toString(),f in l.g&&(U=l.g[f],y=Vr(U,y,E,L),-1<y&&(yt(U[y]),Array.prototype.splice.call(U,y,1),U.length==0&&(delete l.g[f],l.h--)))):l&&(l=ds(l))&&(f=l.g[f.toString()],l=-1,f&&(l=Vr(f,y,E,L)),(y=-1<l?f[l]:null)&&ar(y))}function ar(l){if(typeof l!="number"&&l&&!l.da){var f=l.src;if(f&&f[Me])us(f.i,l);else{var y=l.type,E=l.proxy;f.removeEventListener?f.removeEventListener(y,E,l.capture):f.detachEvent?f.detachEvent(lr(y),E):f.addListener&&f.removeListener&&f.removeListener(E),(y=ds(f))?(us(y,l),y.h==0&&(y.src=null,f[Ei]=null)):yt(l)}}}function lr(l){return l in cs?cs[l]:cs[l]="on"+l}function No(l,f){if(l.da)l=!0;else{f=new Se(f,this);var y=l.listener,E=l.ha||l.src;l.fa&&ar(l),l=y.call(E,f)}return l}function ds(l){return l=l[Ei],l instanceof or?l:null}var fs="__closure_events_fn_"+(1e9*Math.random()>>>0);function Do(l){return typeof l=="function"?l:(l[fs]||(l[fs]=function(f){return l.handleEvent(f)}),l[fs])}function ct(){H.call(this),this.i=new or(this),this.M=this,this.F=null}K(ct,H),ct.prototype[Me]=!0,ct.prototype.removeEventListener=function(l,f,y,E){hs(this,l,f,y,E)};function ht(l,f){var y,E=l.F;if(E)for(y=[];E;E=E.F)y.push(E);if(l=l.M,E=f.type||f,typeof f=="string")f=new ae(f,l);else if(f instanceof ae)f.target=f.target||l;else{var L=f;f=new ae(E,l),k(f,L)}if(L=!0,y)for(var U=y.length-1;0<=U;U--){var Y=f.g=y[U];L=ur(Y,E,!0,f)&&L}if(Y=f.g=l,L=ur(Y,E,!0,f)&&L,L=ur(Y,E,!1,f)&&L,y)for(U=0;U<y.length;U++)Y=f.g=y[U],L=ur(Y,E,!1,f)&&L}ct.prototype.N=function(){if(ct.aa.N.call(this),this.i){var l=this.i,f;for(f in l.g){for(var y=l.g[f],E=0;E<y.length;E++)yt(y[E]);delete l.g[f],l.h--}}this.F=null},ct.prototype.K=function(l,f,y,E){return this.i.add(String(l),f,!1,y,E)},ct.prototype.L=function(l,f,y,E){return this.i.add(String(l),f,!0,y,E)};function ur(l,f,y,E){if(f=l.i.g[String(f)],!f)return!0;f=f.concat();for(var L=!0,U=0;U<f.length;++U){var Y=f[U];if(Y&&!Y.da&&Y.capture==y){var Ue=Y.listener,dt=Y.ha||Y.src;Y.fa&&us(l.i,Y),L=Ue.call(dt,E)!==!1&&L}}return L&&!E.defaultPrevented}function xo(l,f,y){if(typeof l=="function")y&&(l=P(l,y));else if(l&&typeof l.handleEvent=="function")l=P(l.handleEvent,l);else throw Error("Invalid listener argument");return 2147483647<Number(f)?-1:m.setTimeout(l,f||0)}function Or(l){l.g=xo(()=>{l.g=null,l.i&&(l.i=!1,Or(l))},l.l);const f=l.h;l.h=null,l.m.apply(null,f)}class wi extends H{constructor(f,y){super(),this.m=f,this.l=y,this.h=null,this.i=!1,this.g=null}j(f){this.h=arguments,this.g?this.i=!0:Or(this)}N(){super.N(),this.g&&(m.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ti(l){H.call(this),this.h=l,this.g={}}K(Ti,H);var Vo=[];function Oo(l){Re(l.g,function(f,y){this.g.hasOwnProperty(y)&&ar(f)},l),l.g={}}Ti.prototype.N=function(){Ti.aa.N.call(this),Oo(this)},Ti.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Lo=m.JSON.stringify,Mo=m.JSON.parse,bo=class{stringify(l){return m.JSON.stringify(l,void 0)}parse(l){return m.JSON.parse(l,void 0)}};function Ii(){}Ii.prototype.h=null;function ps(l){return l.h||(l.h=l.i())}function ms(){}var un={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function jn(){ae.call(this,"d")}K(jn,ae);function gs(){ae.call(this,"c")}K(gs,ae);var zn={},Fo=null;function Si(){return Fo=Fo||new ct}zn.La="serverreachability";function Uo(l){ae.call(this,zn.La,l)}K(Uo,ae);function cr(l){const f=Si();ht(f,new Uo(f))}zn.STAT_EVENT="statevent";function jo(l,f){ae.call(this,zn.STAT_EVENT,l),this.stat=f}K(jo,ae);function rt(l){const f=Si();ht(f,new jo(f,l))}zn.Ma="timingevent";function ys(l,f){ae.call(this,zn.Ma,l),this.size=f}K(ys,ae);function wn(l,f){if(typeof l!="function")throw Error("Fn must not be null and must be a function");return m.setTimeout(function(){l()},f)}function Ai(){this.g=!0}Ai.prototype.xa=function(){this.g=!1};function Ri(l,f,y,E,L,U){l.info(function(){if(l.g)if(U)for(var Y="",Ue=U.split("&"),dt=0;dt<Ue.length;dt++){var De=Ue[dt].split("=");if(1<De.length){var _t=De[0];De=De[1];var ot=_t.split("_");Y=2<=ot.length&&ot[1]=="type"?Y+(_t+"="+De+"&"):Y+(_t+"=redacted&")}}else Y=null;else Y=U;return"XMLHTTP REQ ("+E+") [attempt "+L+"]: "+f+`
`+y+`
`+Y})}function _s(l,f,y,E,L,U,Y){l.info(function(){return"XMLHTTP RESP ("+E+") [ attempt "+L+"]: "+f+`
`+y+`
`+U+" "+Y})}function Tn(l,f,y,E){l.info(function(){return"XMLHTTP TEXT ("+f+"): "+vc(l,y)+(E?" "+E:"")})}function zo(l,f){l.info(function(){return"TIMEOUT: "+f})}Ai.prototype.info=function(){};function vc(l,f){if(!l.g)return f;if(!f)return null;try{var y=JSON.parse(f);if(y){for(l=0;l<y.length;l++)if(Array.isArray(y[l])){var E=y[l];if(!(2>E.length)){var L=E[1];if(Array.isArray(L)&&!(1>L.length)){var U=L[0];if(U!="noop"&&U!="stop"&&U!="close")for(var Y=1;Y<L.length;Y++)L[Y]=""}}}}return Lo(y)}catch{return f}}var vs={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},tl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},In;function Ci(){}K(Ci,Ii),Ci.prototype.g=function(){return new XMLHttpRequest},Ci.prototype.i=function(){return{}},In=new Ci;function Sn(l,f,y,E){this.j=l,this.i=f,this.l=y,this.R=E||1,this.U=new Ti(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new nl}function nl(){this.i=null,this.g="",this.h=!1}var Bo={},Es={};function ws(l,f,y){l.L=1,l.v=Ur(tn(f)),l.m=y,l.P=!0,$o(l,null)}function $o(l,f){l.F=Date.now(),$e(l),l.A=tn(l.v);var y=l.A,E=l.R;Array.isArray(E)||(E=[String(E)]),zr(y.i,"t",E),l.C=0,y=l.j.J,l.h=new nl,l.g=El(l.j,y?f:null,!l.m),0<l.O&&(l.M=new wi(P(l.Y,l,l.g),l.O)),f=l.U,y=l.g,E=l.ca;var L="readystatechange";Array.isArray(L)||(L&&(Vo[0]=L.toString()),L=Vo);for(var U=0;U<L.length;U++){var Y=Po(y,L[U],E||f.handleEvent,!1,f.h||f);if(!Y)break;f.g[Y.key]=Y}f=l.H?I(l.H):{},l.m?(l.u||(l.u="POST"),f["Content-Type"]="application/x-www-form-urlencoded",l.g.ea(l.A,l.u,l.m,f)):(l.u="GET",l.g.ea(l.A,l.u,null,f)),cr(),Ri(l.i,l.u,l.A,l.l,l.R,l.m)}Sn.prototype.ca=function(l){l=l.target;const f=this.M;f&&qt(l)==3?f.j():this.Y(l)},Sn.prototype.Y=function(l){try{if(l==this.g)e:{const ot=qt(this.g);var f=this.g.Ba();const dn=this.g.Z();if(!(3>ot)&&(ot!=3||this.g&&(this.h.h||this.g.oa()||Qo(this.g)))){this.J||ot!=4||f==7||(f==8||0>=dn?cr(3):cr(2)),Pi(this);var y=this.g.Z();this.X=y;t:if(rl(this)){var E=Qo(this.g);l="";var L=E.length,U=qt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){cn(this),Lr(this);var Y="";break t}this.h.i=new m.TextDecoder}for(f=0;f<L;f++)this.h.h=!0,l+=this.h.i.decode(E[f],{stream:!(U&&f==L-1)});E.length=0,this.h.g+=l,this.C=0,Y=this.h.g}else Y=this.g.oa();if(this.o=y==200,_s(this.i,this.u,this.A,this.l,this.R,ot,y),this.o){if(this.T&&!this.K){t:{if(this.g){var Ue,dt=this.g;if((Ue=dt.g?dt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!ce(Ue)){var De=Ue;break t}}De=null}if(y=De)Tn(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ho(this,y);else{this.o=!1,this.s=3,rt(12),cn(this),Lr(this);break e}}if(this.P){y=!0;let rn;for(;!this.J&&this.C<Y.length;)if(rn=Ec(this,Y),rn==Es){ot==4&&(this.s=4,rt(14),y=!1),Tn(this.i,this.l,null,"[Incomplete Response]");break}else if(rn==Bo){this.s=4,rt(15),Tn(this.i,this.l,Y,"[Invalid Chunk]"),y=!1;break}else Tn(this.i,this.l,rn,null),Ho(this,rn);if(rl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ot!=4||Y.length!=0||this.h.h||(this.s=1,rt(16),y=!1),this.o=this.o&&y,!y)Tn(this.i,this.l,Y,"[Invalid Chunked Response]"),cn(this),Lr(this);else if(0<Y.length&&!this.W){this.W=!0;var _t=this.j;_t.g==this&&_t.ba&&!_t.M&&(_t.j.info("Great, no buffering proxy detected. Bytes received: "+Y.length),Jo(_t),_t.M=!0,rt(11))}}else Tn(this.i,this.l,Y,null),Ho(this,Y);ot==4&&cn(this),this.o&&!this.J&&(ot==4?xs(this.j,this):(this.o=!1,$e(this)))}else Cs(this.g),y==400&&0<Y.indexOf("Unknown SID")?(this.s=3,rt(12)):(this.s=0,rt(13)),cn(this),Lr(this)}}}catch{}finally{}};function rl(l){return l.g?l.u=="GET"&&l.L!=2&&l.j.Ca:!1}function Ec(l,f){var y=l.C,E=f.indexOf(`
`,y);return E==-1?Es:(y=Number(f.substring(y,E)),isNaN(y)?Bo:(E+=1,E+y>f.length?Es:(f=f.slice(E,E+y),l.C=E+y,f)))}Sn.prototype.cancel=function(){this.J=!0,cn(this)};function $e(l){l.S=Date.now()+l.I,il(l,l.I)}function il(l,f){if(l.B!=null)throw Error("WatchDog timer not null");l.B=wn(P(l.ba,l),f)}function Pi(l){l.B&&(m.clearTimeout(l.B),l.B=null)}Sn.prototype.ba=function(){this.B=null;const l=Date.now();0<=l-this.S?(zo(this.i,this.A),this.L!=2&&(cr(),rt(17)),cn(this),this.s=2,Lr(this)):il(this,this.S-l)};function Lr(l){l.j.G==0||l.J||xs(l.j,l)}function cn(l){Pi(l);var f=l.M;f&&typeof f.ma=="function"&&f.ma(),l.M=null,Oo(l.U),l.g&&(f=l.g,l.g=null,f.abort(),f.ma())}function Ho(l,f){try{var y=l.j;if(y.G!=0&&(y.g==l||zt(y.h,l))){if(!l.K&&zt(y.h,l)&&y.G==3){try{var E=y.Da.g.parse(f)}catch{E=null}if(Array.isArray(E)&&E.length==3){var L=E;if(L[0]==0){e:if(!y.u){if(y.g)if(y.g.F+3e3<l.F)Ds(y),kn(y);else break e;Ns(y),rt(18)}}else y.za=L[1],0<y.za-y.T&&37500>L[2]&&y.F&&y.v==0&&!y.C&&(y.C=wn(P(y.Za,y),6e3));if(1>=ol(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else mr(y,11)}else if((l.K||y.g==l)&&Ds(y),!ce(f))for(L=y.Da.g.parse(f),f=0;f<L.length;f++){let De=L[f];if(y.T=De[0],De=De[1],y.G==2)if(De[0]=="c"){y.K=De[1],y.ia=De[2];const _t=De[3];_t!=null&&(y.la=_t,y.j.info("VER="+y.la));const ot=De[4];ot!=null&&(y.Aa=ot,y.j.info("SVER="+y.Aa));const dn=De[5];dn!=null&&typeof dn=="number"&&0<dn&&(E=1.5*dn,y.L=E,y.j.info("backChannelRequestTimeoutMs_="+E)),E=y;const rn=l.g;if(rn){const Li=rn.g?rn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Li){var U=E.h;U.g||Li.indexOf("spdy")==-1&&Li.indexOf("quic")==-1&&Li.indexOf("h2")==-1||(U.j=U.l,U.g=new Set,U.h&&(Wo(U,U.h),U.h=null))}if(E.D){const Os=rn.g?rn.g.getResponseHeader("X-HTTP-Session-Id"):null;Os&&(E.ya=Os,ze(E.I,E.D,Os))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-l.F,y.j.info("Handshake RTT: "+y.R+"ms")),E=y;var Y=l;if(E.qa=vl(E,E.J?E.ia:null,E.W),Y.K){al(E.h,Y);var Ue=Y,dt=E.L;dt&&(Ue.I=dt),Ue.B&&(Pi(Ue),$e(Ue)),E.g=Y}else Oi(E);0<y.i.length&&Wn(y)}else De[0]!="stop"&&De[0]!="close"||mr(y,7);else y.G==3&&(De[0]=="stop"||De[0]=="close"?De[0]=="stop"?mr(y,7):At(y):De[0]!="noop"&&y.l&&y.l.ta(De),y.v=0)}}cr(4)}catch{}}var sl=class{constructor(l,f){this.g=l,this.map=f}};function ki(l){this.l=l||10,m.PerformanceNavigationTiming?(l=m.performance.getEntriesByType("navigation"),l=0<l.length&&(l[0].nextHopProtocol=="hq"||l[0].nextHopProtocol=="h2")):l=!!(m.chrome&&m.chrome.loadTimes&&m.chrome.loadTimes()&&m.chrome.loadTimes().wasFetchedViaSpdy),this.j=l?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function en(l){return l.h?!0:l.g?l.g.size>=l.j:!1}function ol(l){return l.h?1:l.g?l.g.size:0}function zt(l,f){return l.h?l.h==f:l.g?l.g.has(f):!1}function Wo(l,f){l.g?l.g.add(f):l.h=f}function al(l,f){l.h&&l.h==f?l.h=null:l.g&&l.g.has(f)&&l.g.delete(f)}ki.prototype.cancel=function(){if(this.i=ll(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const l of this.g.values())l.cancel();this.g.clear()}};function ll(l){if(l.h!=null)return l.i.concat(l.h.D);if(l.g!=null&&l.g.size!==0){let f=l.i;for(const y of l.g.values())f=f.concat(y.D);return f}return B(l.i)}function Ts(l){if(l.V&&typeof l.V=="function")return l.V();if(typeof Map<"u"&&l instanceof Map||typeof Set<"u"&&l instanceof Set)return Array.from(l.values());if(typeof l=="string")return l.split("");if(g(l)){for(var f=[],y=l.length,E=0;E<y;E++)f.push(l[E]);return f}f=[],y=0;for(E in l)f[y++]=l[E];return f}function Is(l){if(l.na&&typeof l.na=="function")return l.na();if(!l.V||typeof l.V!="function"){if(typeof Map<"u"&&l instanceof Map)return Array.from(l.keys());if(!(typeof Set<"u"&&l instanceof Set)){if(g(l)||typeof l=="string"){var f=[];l=l.length;for(var y=0;y<l;y++)f.push(y);return f}f=[],y=0;for(const E in l)f[y++]=E;return f}}}function Mr(l,f){if(l.forEach&&typeof l.forEach=="function")l.forEach(f,void 0);else if(g(l)||typeof l=="string")Array.prototype.forEach.call(l,f,void 0);else for(var y=Is(l),E=Ts(l),L=E.length,U=0;U<L;U++)f.call(void 0,E[U],y&&y[U],l)}var Ni=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function wc(l,f){if(l){l=l.split("&");for(var y=0;y<l.length;y++){var E=l[y].indexOf("="),L=null;if(0<=E){var U=l[y].substring(0,E);L=l[y].substring(E+1)}else U=l[y];f(U,L?decodeURIComponent(L.replace(/\+/g," ")):"")}}}function hr(l){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,l instanceof hr){this.h=l.h,Di(this,l.j),this.o=l.o,this.g=l.g,br(this,l.s),this.l=l.l;var f=l.i,y=new Bn;y.i=f.i,f.g&&(y.g=new Map(f.g),y.h=f.h),Fr(this,y),this.m=l.m}else l&&(f=String(l).match(Ni))?(this.h=!1,Di(this,f[1]||"",!0),this.o=ke(f[2]||""),this.g=ke(f[3]||"",!0),br(this,f[4]),this.l=ke(f[5]||"",!0),Fr(this,f[6]||"",!0),this.m=ke(f[7]||"")):(this.h=!1,this.i=new Bn(null,this.h))}hr.prototype.toString=function(){var l=[],f=this.j;f&&l.push(jr(f,Ss,!0),":");var y=this.g;return(y||f=="file")&&(l.push("//"),(f=this.o)&&l.push(jr(f,Ss,!0),"@"),l.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&l.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&l.push("/"),l.push(jr(y,y.charAt(0)=="/"?hl:cl,!0))),(y=this.i.toString())&&l.push("?",y),(y=this.m)&&l.push("#",jr(y,qo)),l.join("")};function tn(l){return new hr(l)}function Di(l,f,y){l.j=y?ke(f,!0):f,l.j&&(l.j=l.j.replace(/:$/,""))}function br(l,f){if(f){if(f=Number(f),isNaN(f)||0>f)throw Error("Bad port number "+f);l.s=f}else l.s=null}function Fr(l,f,y){f instanceof Bn?(l.i=f,$n(l.i,l.h)):(y||(f=jr(f,dl)),l.i=new Bn(f,l.h))}function ze(l,f,y){l.i.set(f,y)}function Ur(l){return ze(l,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),l}function ke(l,f){return l?f?decodeURI(l.replace(/%25/g,"%2525")):decodeURIComponent(l):""}function jr(l,f,y){return typeof l=="string"?(l=encodeURI(l).replace(f,ul),y&&(l=l.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l):null}function ul(l){return l=l.charCodeAt(0),"%"+(l>>4&15).toString(16)+(l&15).toString(16)}var Ss=/[#\/\?@]/g,cl=/[#\?:]/g,hl=/[#\?]/g,dl=/[#\?@]/g,qo=/#/g;function Bn(l,f){this.h=this.g=null,this.i=l||null,this.j=!!f}function St(l){l.g||(l.g=new Map,l.h=0,l.i&&wc(l.i,function(f,y){l.add(decodeURIComponent(f.replace(/\+/g," ")),y)}))}i=Bn.prototype,i.add=function(l,f){St(this),this.i=null,l=hn(this,l);var y=this.g.get(l);return y||this.g.set(l,y=[]),y.push(f),this.h+=1,this};function An(l,f){St(l),f=hn(l,f),l.g.has(f)&&(l.i=null,l.h-=l.g.get(f).length,l.g.delete(f))}function Rn(l,f){return St(l),f=hn(l,f),l.g.has(f)}i.forEach=function(l,f){St(this),this.g.forEach(function(y,E){y.forEach(function(L){l.call(f,L,E,this)},this)},this)},i.na=function(){St(this);const l=Array.from(this.g.values()),f=Array.from(this.g.keys()),y=[];for(let E=0;E<f.length;E++){const L=l[E];for(let U=0;U<L.length;U++)y.push(f[E])}return y},i.V=function(l){St(this);let f=[];if(typeof l=="string")Rn(this,l)&&(f=f.concat(this.g.get(hn(this,l))));else{l=Array.from(this.g.values());for(let y=0;y<l.length;y++)f=f.concat(l[y])}return f},i.set=function(l,f){return St(this),this.i=null,l=hn(this,l),Rn(this,l)&&(this.h-=this.g.get(l).length),this.g.set(l,[f]),this.h+=1,this},i.get=function(l,f){return l?(l=this.V(l),0<l.length?String(l[0]):f):f};function zr(l,f,y){An(l,f),0<y.length&&(l.i=null,l.g.set(hn(l,f),B(y)),l.h+=y.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const l=[],f=Array.from(this.g.keys());for(var y=0;y<f.length;y++){var E=f[y];const U=encodeURIComponent(String(E)),Y=this.V(E);for(E=0;E<Y.length;E++){var L=U;Y[E]!==""&&(L+="="+encodeURIComponent(String(Y[E]))),l.push(L)}}return this.i=l.join("&")};function hn(l,f){return f=String(f),l.j&&(f=f.toLowerCase()),f}function $n(l,f){f&&!l.j&&(St(l),l.i=null,l.g.forEach(function(y,E){var L=E.toLowerCase();E!=L&&(An(this,E),zr(this,L,y))},l)),l.j=f}function Tc(l,f){const y=new Ai;if(m.Image){const E=new Image;E.onload=j(Wt,y,"TestLoadImage: loaded",!0,f,E),E.onerror=j(Wt,y,"TestLoadImage: error",!1,f,E),E.onabort=j(Wt,y,"TestLoadImage: abort",!1,f,E),E.ontimeout=j(Wt,y,"TestLoadImage: timeout",!1,f,E),m.setTimeout(function(){E.ontimeout&&E.ontimeout()},1e4),E.src=l}else f(!1)}function fl(l,f){const y=new Ai,E=new AbortController,L=setTimeout(()=>{E.abort(),Wt(y,"TestPingServer: timeout",!1,f)},1e4);fetch(l,{signal:E.signal}).then(U=>{clearTimeout(L),U.ok?Wt(y,"TestPingServer: ok",!0,f):Wt(y,"TestPingServer: server error",!1,f)}).catch(()=>{clearTimeout(L),Wt(y,"TestPingServer: error",!1,f)})}function Wt(l,f,y,E,L){try{L&&(L.onload=null,L.onerror=null,L.onabort=null,L.ontimeout=null),E(y)}catch{}}function Ic(){this.g=new bo}function pl(l,f,y){const E=y||"";try{Mr(l,function(L,U){let Y=L;v(L)&&(Y=Lo(L)),f.push(E+U+"="+encodeURIComponent(Y))})}catch(L){throw f.push(E+"type="+encodeURIComponent("_badmap")),L}}function dr(l){this.l=l.Ub||null,this.j=l.eb||!1}K(dr,Ii),dr.prototype.g=function(){return new xi(this.l,this.j)},dr.prototype.i=(function(l){return function(){return l}})({});function xi(l,f){ct.call(this),this.D=l,this.o=f,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}K(xi,ct),i=xi.prototype,i.open=function(l,f){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=l,this.A=f,this.readyState=1,Pn(this)},i.send=function(l){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const f={headers:this.u,method:this.B,credentials:this.m,cache:void 0};l&&(f.body=l),(this.D||m).fetch(new Request(this.A,f)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Cn(this)),this.readyState=0},i.Sa=function(l){if(this.g&&(this.l=l,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=l.headers,this.readyState=2,Pn(this)),this.g&&(this.readyState=3,Pn(this),this.g)))if(this.responseType==="arraybuffer")l.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof m.ReadableStream<"u"&&"body"in l){if(this.j=l.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ml(this)}else l.text().then(this.Ra.bind(this),this.ga.bind(this))};function ml(l){l.j.read().then(l.Pa.bind(l)).catch(l.ga.bind(l))}i.Pa=function(l){if(this.g){if(this.o&&l.value)this.response.push(l.value);else if(!this.o){var f=l.value?l.value:new Uint8Array(0);(f=this.v.decode(f,{stream:!l.done}))&&(this.response=this.responseText+=f)}l.done?Cn(this):Pn(this),this.readyState==3&&ml(this)}},i.Ra=function(l){this.g&&(this.response=this.responseText=l,Cn(this))},i.Qa=function(l){this.g&&(this.response=l,Cn(this))},i.ga=function(){this.g&&Cn(this)};function Cn(l){l.readyState=4,l.l=null,l.j=null,l.v=null,Pn(l)}i.setRequestHeader=function(l,f){this.u.append(l,f)},i.getResponseHeader=function(l){return this.h&&this.h.get(l.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const l=[],f=this.h.entries();for(var y=f.next();!y.done;)y=y.value,l.push(y[0]+": "+y[1]),y=f.next();return l.join(`\r
`)};function Pn(l){l.onreadystatechange&&l.onreadystatechange.call(l)}Object.defineProperty(xi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(l){this.m=l?"include":"same-origin"}});function fr(l){let f="";return Re(l,function(y,E){f+=E,f+=":",f+=y,f+=`\r
`}),f}function Br(l,f,y){e:{for(E in y){var E=!1;break e}E=!0}E||(y=fr(y),typeof l=="string"?y!=null&&encodeURIComponent(String(y)):ze(l,f,y))}function Qe(l){ct.call(this),this.headers=new Map,this.o=l||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}K(Qe,ct);var Sc=/^https?$/i,Ko=["POST","PUT"];i=Qe.prototype,i.Ha=function(l){this.J=l},i.ea=function(l,f,y,E){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+l);f=f?f.toUpperCase():"GET",this.D=l,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():In.g(),this.v=this.o?ps(this.o):ps(In),this.g.onreadystatechange=P(this.Ea,this);try{this.B=!0,this.g.open(f,String(l),!0),this.B=!1}catch(U){Vi(this,U);return}if(l=y||"",y=new Map(this.headers),E)if(Object.getPrototypeOf(E)===Object.prototype)for(var L in E)y.set(L,E[L]);else if(typeof E.keys=="function"&&typeof E.get=="function")for(const U of E.keys())y.set(U,E.get(U));else throw Error("Unknown input type for opt_headers: "+String(E));E=Array.from(y.keys()).find(U=>U.toLowerCase()=="content-type"),L=m.FormData&&l instanceof m.FormData,!(0<=Array.prototype.indexOf.call(Ko,f,void 0))||E||L||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[U,Y]of y)this.g.setRequestHeader(U,Y);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Rs(this),this.u=!0,this.g.send(l),this.u=!1}catch(U){Vi(this,U)}};function Vi(l,f){l.h=!1,l.g&&(l.j=!0,l.g.abort(),l.j=!1),l.l=f,l.m=5,As(l),nn(l)}function As(l){l.A||(l.A=!0,ht(l,"complete"),ht(l,"error"))}i.abort=function(l){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=l||7,ht(this,"complete"),ht(this,"abort"),nn(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),nn(this,!0)),Qe.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?Go(this):this.bb())},i.bb=function(){Go(this)};function Go(l){if(l.h&&typeof h<"u"&&(!l.v[1]||qt(l)!=4||l.Z()!=2)){if(l.u&&qt(l)==4)xo(l.Ea,0,l);else if(ht(l,"readystatechange"),qt(l)==4){l.h=!1;try{const Y=l.Z();e:switch(Y){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var f=!0;break e;default:f=!1}var y;if(!(y=f)){var E;if(E=Y===0){var L=String(l.D).match(Ni)[1]||null;!L&&m.self&&m.self.location&&(L=m.self.location.protocol.slice(0,-1)),E=!Sc.test(L?L.toLowerCase():"")}y=E}if(y)ht(l,"complete"),ht(l,"success");else{l.m=6;try{var U=2<qt(l)?l.g.statusText:""}catch{U=""}l.l=U+" ["+l.Z()+"]",As(l)}}finally{nn(l)}}}}function nn(l,f){if(l.g){Rs(l);const y=l.g,E=l.v[0]?()=>{}:null;l.g=null,l.v=null,f||ht(l,"ready");try{y.onreadystatechange=E}catch{}}}function Rs(l){l.I&&(m.clearTimeout(l.I),l.I=null)}i.isActive=function(){return!!this.g};function qt(l){return l.g?l.g.readyState:0}i.Z=function(){try{return 2<qt(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(l){if(this.g){var f=this.g.responseText;return l&&f.indexOf(l)==0&&(f=f.substring(l.length)),Mo(f)}};function Qo(l){try{if(!l.g)return null;if("response"in l.g)return l.g.response;switch(l.H){case"":case"text":return l.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in l.g)return l.g.mozResponseArrayBuffer}return null}catch{return null}}function Cs(l){const f={};l=(l.g&&2<=qt(l)&&l.g.getAllResponseHeaders()||"").split(`\r
`);for(let E=0;E<l.length;E++){if(ce(l[E]))continue;var y=x(l[E]);const L=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const U=f[L]||[];f[L]=U,U.push(y)}D(f,function(E){return E.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Hn(l,f,y){return y&&y.internalChannelParams&&y.internalChannelParams[l]||f}function Xo(l){this.Aa=0,this.i=[],this.j=new Ai,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Hn("failFast",!1,l),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Hn("baseRetryDelayMs",5e3,l),this.cb=Hn("retryDelaySeedMs",1e4,l),this.Wa=Hn("forwardChannelMaxRetries",2,l),this.wa=Hn("forwardChannelRequestTimeoutMs",2e4,l),this.pa=l&&l.xmlHttpFactory||void 0,this.Xa=l&&l.Tb||void 0,this.Ca=l&&l.useFetchStreams||!1,this.L=void 0,this.J=l&&l.supportsCrossDomainXhr||!1,this.K="",this.h=new ki(l&&l.concurrentRequestLimit),this.Da=new Ic,this.P=l&&l.fastHandshake||!1,this.O=l&&l.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=l&&l.Rb||!1,l&&l.xa&&this.j.xa(),l&&l.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&l&&l.detectBufferingProxy||!1,this.ja=void 0,l&&l.longPollingTimeout&&0<l.longPollingTimeout&&(this.ja=l.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Xo.prototype,i.la=8,i.G=1,i.connect=function(l,f,y,E){rt(0),this.W=l,this.H=f||{},y&&E!==void 0&&(this.H.OSID=y,this.H.OAID=E),this.F=this.X,this.I=vl(this,null,this.W),Wn(this)};function At(l){if(Ps(l),l.G==3){var f=l.U++,y=tn(l.I);if(ze(y,"SID",l.K),ze(y,"RID",f),ze(y,"TYPE","terminate"),pr(l,y),f=new Sn(l,l.j,f),f.L=2,f.v=Ur(tn(y)),y=!1,m.navigator&&m.navigator.sendBeacon)try{y=m.navigator.sendBeacon(f.v.toString(),"")}catch{}!y&&m.Image&&(new Image().src=f.v,y=!0),y||(f.g=El(f.j,null),f.g.ea(f.v)),f.F=Date.now(),$e(f)}_l(l)}function kn(l){l.g&&(Jo(l),l.g.cancel(),l.g=null)}function Ps(l){kn(l),l.u&&(m.clearTimeout(l.u),l.u=null),Ds(l),l.h.cancel(),l.s&&(typeof l.s=="number"&&m.clearTimeout(l.s),l.s=null)}function Wn(l){if(!en(l.h)&&!l.s){l.s=!0;var f=l.Ga;je||ne(),Z||(je(),Z=!0),he.add(f,l),l.B=0}}function Ac(l,f){return ol(l.h)>=l.h.j-(l.s?1:0)?!1:l.s?(l.i=f.D.concat(l.i),!0):l.G==1||l.G==2||l.B>=(l.Va?0:l.Wa)?!1:(l.s=wn(P(l.Ga,l,f),yl(l,l.B)),l.B++,!0)}i.Ga=function(l){if(this.s)if(this.s=null,this.G==1){if(!l){this.U=Math.floor(1e5*Math.random()),l=this.U++;const L=new Sn(this,this.j,l);let U=this.o;if(this.S&&(U?(U=I(U),k(U,this.S)):U=this.S),this.m!==null||this.O||(L.H=U,U=null),this.P)e:{for(var f=0,y=0;y<this.i.length;y++){t:{var E=this.i[y];if("__data__"in E.map&&(E=E.map.__data__,typeof E=="string")){E=E.length;break t}E=void 0}if(E===void 0)break;if(f+=E,4096<f){f=y;break e}if(f===4096||y===this.i.length-1){f=y+1;break e}}f=1e3}else f=1e3;f=$r(this,L,f),y=tn(this.I),ze(y,"RID",l),ze(y,"CVER",22),this.D&&ze(y,"X-HTTP-Session-Id",this.D),pr(this,y),U&&(this.O?f="headers="+encodeURIComponent(String(fr(U)))+"&"+f:this.m&&Br(y,this.m,U)),Wo(this.h,L),this.Ua&&ze(y,"TYPE","init"),this.P?(ze(y,"$req",f),ze(y,"SID","null"),L.T=!0,ws(L,y,null)):ws(L,y,f),this.G=2}}else this.G==3&&(l?ks(this,l):this.i.length==0||en(this.h)||ks(this))};function ks(l,f){var y;f?y=f.l:y=l.U++;const E=tn(l.I);ze(E,"SID",l.K),ze(E,"RID",y),ze(E,"AID",l.T),pr(l,E),l.m&&l.o&&Br(E,l.m,l.o),y=new Sn(l,l.j,y,l.B+1),l.m===null&&(y.H=l.o),f&&(l.i=f.D.concat(l.i)),f=$r(l,y,1e3),y.I=Math.round(.5*l.wa)+Math.round(.5*l.wa*Math.random()),Wo(l.h,y),ws(y,E,f)}function pr(l,f){l.H&&Re(l.H,function(y,E){ze(f,E,y)}),l.l&&Mr({},function(y,E){ze(f,E,y)})}function $r(l,f,y){y=Math.min(l.i.length,y);var E=l.l?P(l.l.Na,l.l,l):null;e:{var L=l.i;let U=-1;for(;;){const Y=["count="+y];U==-1?0<y?(U=L[0].g,Y.push("ofs="+U)):U=0:Y.push("ofs="+U);let Ue=!0;for(let dt=0;dt<y;dt++){let De=L[dt].g;const _t=L[dt].map;if(De-=U,0>De)U=Math.max(0,L[dt].g-100),Ue=!1;else try{pl(_t,Y,"req"+De+"_")}catch{E&&E(_t)}}if(Ue){E=Y.join("&");break e}}}return l=l.i.splice(0,y),f.D=l,E}function Oi(l){if(!l.g&&!l.u){l.Y=1;var f=l.Fa;je||ne(),Z||(je(),Z=!0),he.add(f,l),l.v=0}}function Ns(l){return l.g||l.u||3<=l.v?!1:(l.Y++,l.u=wn(P(l.Fa,l),yl(l,l.v)),l.v++,!0)}i.Fa=function(){if(this.u=null,gl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var l=2*this.R;this.j.info("BP detection timer enabled: "+l),this.A=wn(P(this.ab,this),l)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,rt(10),kn(this),gl(this))};function Jo(l){l.A!=null&&(m.clearTimeout(l.A),l.A=null)}function gl(l){l.g=new Sn(l,l.j,"rpc",l.Y),l.m===null&&(l.g.H=l.o),l.g.O=0;var f=tn(l.qa);ze(f,"RID","rpc"),ze(f,"SID",l.K),ze(f,"AID",l.T),ze(f,"CI",l.F?"0":"1"),!l.F&&l.ja&&ze(f,"TO",l.ja),ze(f,"TYPE","xmlhttp"),pr(l,f),l.m&&l.o&&Br(f,l.m,l.o),l.L&&(l.g.I=l.L);var y=l.g;l=l.ia,y.L=1,y.v=Ur(tn(f)),y.m=null,y.P=!0,$o(y,l)}i.Za=function(){this.C!=null&&(this.C=null,kn(this),Ns(this),rt(19))};function Ds(l){l.C!=null&&(m.clearTimeout(l.C),l.C=null)}function xs(l,f){var y=null;if(l.g==f){Ds(l),Jo(l),l.g=null;var E=2}else if(zt(l.h,f))y=f.D,al(l.h,f),E=1;else return;if(l.G!=0){if(f.o)if(E==1){y=f.m?f.m.length:0,f=Date.now()-f.F;var L=l.B;E=Si(),ht(E,new ys(E,y)),Wn(l)}else Oi(l);else if(L=f.s,L==3||L==0&&0<f.X||!(E==1&&Ac(l,f)||E==2&&Ns(l)))switch(y&&0<y.length&&(f=l.h,f.i=f.i.concat(y)),L){case 1:mr(l,5);break;case 4:mr(l,10);break;case 3:mr(l,6);break;default:mr(l,2)}}}function yl(l,f){let y=l.Ta+Math.floor(Math.random()*l.cb);return l.isActive()||(y*=2),y*f}function mr(l,f){if(l.j.info("Error code "+f),f==2){var y=P(l.fb,l),E=l.Xa;const L=!E;E=new hr(E||"//www.google.com/images/cleardot.gif"),m.location&&m.location.protocol=="http"||Di(E,"https"),Ur(E),L?Tc(E.toString(),y):fl(E.toString(),y)}else rt(2);l.G=0,l.l&&l.l.sa(f),_l(l),Ps(l)}i.fb=function(l){l?(this.j.info("Successfully pinged google.com"),rt(2)):(this.j.info("Failed to ping google.com"),rt(1))};function _l(l){if(l.G=0,l.ka=[],l.l){const f=ll(l.h);(f.length!=0||l.i.length!=0)&&(z(l.ka,f),z(l.ka,l.i),l.h.i.length=0,B(l.i),l.i.length=0),l.l.ra()}}function vl(l,f,y){var E=y instanceof hr?tn(y):new hr(y);if(E.g!="")f&&(E.g=f+"."+E.g),br(E,E.s);else{var L=m.location;E=L.protocol,f=f?f+"."+L.hostname:L.hostname,L=+L.port;var U=new hr(null);E&&Di(U,E),f&&(U.g=f),L&&br(U,L),y&&(U.l=y),E=U}return y=l.D,f=l.ya,y&&f&&ze(E,y,f),ze(E,"VER",l.la),pr(l,E),E}function El(l,f,y){if(f&&!l.J)throw Error("Can't create secondary domain capable XhrIo object.");return f=l.Ca&&!l.pa?new Qe(new dr({eb:y})):new Qe(l.pa),f.Ha(l.J),f}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function Yo(){}i=Yo.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function Vs(){}Vs.prototype.g=function(l,f){return new Bt(l,f)};function Bt(l,f){ct.call(this),this.g=new Xo(f),this.l=l,this.h=f&&f.messageUrlParams||null,l=f&&f.messageHeaders||null,f&&f.clientProtocolHeaderRequired&&(l?l["X-Client-Protocol"]="webchannel":l={"X-Client-Protocol":"webchannel"}),this.g.o=l,l=f&&f.initMessageHeaders||null,f&&f.messageContentType&&(l?l["X-WebChannel-Content-Type"]=f.messageContentType:l={"X-WebChannel-Content-Type":f.messageContentType}),f&&f.va&&(l?l["X-WebChannel-Client-Profile"]=f.va:l={"X-WebChannel-Client-Profile":f.va}),this.g.S=l,(l=f&&f.Sb)&&!ce(l)&&(this.g.m=l),this.v=f&&f.supportsCrossDomainXhr||!1,this.u=f&&f.sendRawJson||!1,(f=f&&f.httpSessionIdParam)&&!ce(f)&&(this.g.D=f,l=this.h,l!==null&&f in l&&(l=this.h,f in l&&delete l[f])),this.j=new qn(this)}K(Bt,ct),Bt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Bt.prototype.close=function(){At(this.g)},Bt.prototype.o=function(l){var f=this.g;if(typeof l=="string"){var y={};y.__data__=l,l=y}else this.u&&(y={},y.__data__=Lo(l),l=y);f.i.push(new sl(f.Ya++,l)),f.G==3&&Wn(f)},Bt.prototype.N=function(){this.g.l=null,delete this.j,At(this.g),delete this.g,Bt.aa.N.call(this)};function wl(l){jn.call(this),l.__headers__&&(this.headers=l.__headers__,this.statusCode=l.__status__,delete l.__headers__,delete l.__status__);var f=l.__sm__;if(f){e:{for(const y in f){l=y;break e}l=void 0}(this.i=l)&&(l=this.i,f=f!==null&&l in f?f[l]:void 0),this.data=f}else this.data=l}K(wl,jn);function Tl(){gs.call(this),this.status=1}K(Tl,gs);function qn(l){this.g=l}K(qn,Yo),qn.prototype.ua=function(){ht(this.g,"a")},qn.prototype.ta=function(l){ht(this.g,new wl(l))},qn.prototype.sa=function(l){ht(this.g,new Tl)},qn.prototype.ra=function(){ht(this.g,"b")},Vs.prototype.createWebChannel=Vs.prototype.g,Bt.prototype.send=Bt.prototype.o,Bt.prototype.open=Bt.prototype.m,Bt.prototype.close=Bt.prototype.close,S_=function(){return new Vs},I_=function(){return Si()},T_=zn,yd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},vs.NO_ERROR=0,vs.TIMEOUT=8,vs.HTTP_ERROR=6,Cu=vs,tl.COMPLETE="complete",w_=tl,ms.EventType=un,un.OPEN="a",un.CLOSE="b",un.ERROR="c",un.MESSAGE="d",ct.prototype.listen=ct.prototype.K,Sa=ms,Qe.prototype.listenOnce=Qe.prototype.L,Qe.prototype.getLastError=Qe.prototype.Ka,Qe.prototype.getLastErrorCode=Qe.prototype.Ba,Qe.prototype.getStatus=Qe.prototype.Z,Qe.prototype.getResponseJson=Qe.prototype.Oa,Qe.prototype.getResponseText=Qe.prototype.oa,Qe.prototype.send=Qe.prototype.ea,Qe.prototype.setWithCredentials=Qe.prototype.Ha,E_=Qe}).apply(typeof yu<"u"?yu:typeof self<"u"?self:typeof window<"u"?window:{});const Tg="@firebase/firestore",Ig="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ft.UNAUTHENTICATED=new Ft(null),Ft.GOOGLE_CREDENTIALS=new Ft("google-credentials-uid"),Ft.FIRST_PARTY=new Ft("first-party-uid"),Ft.MOCK_USER=new Ft("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let So="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rs=new Ld("@firebase/firestore");function no(){return rs.logLevel}function te(i,...e){if(rs.logLevel<=Ce.DEBUG){const t=e.map(Qd);rs.debug(`Firestore (${So}): ${i}`,...t)}}function Nr(i,...e){if(rs.logLevel<=Ce.ERROR){const t=e.map(Qd);rs.error(`Firestore (${So}): ${i}`,...t)}}function fi(i,...e){if(rs.logLevel<=Ce.WARN){const t=e.map(Qd);rs.warn(`Firestore (${So}): ${i}`,...t)}}function Qd(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(i,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,A_(i,s,t)}function A_(i,e,t){let s=`FIRESTORE (${So}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw Nr(s),new Error(s)}function Fe(i,e,t,s){let o="Unexpected state";typeof t=="string"?o=t:s=t,i||A_(e,o,s)}function Ee(i,e){return i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class le extends xr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R_{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ES{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ft.UNAUTHENTICATED)))}shutdown(){}}class wS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class TS{constructor(e){this.t=e,this.currentUser=Ft.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Fe(this.o===void 0,42304);let s=this.i;const o=g=>this.i!==s?(s=this.i,t(g)):Promise.resolve();let u=new Yi;this.o=()=>{this.i++,this.currentUser=this.u(),u.resolve(),u=new Yi,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=u;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},m=g=>{te("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>m(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?m(g):(te("FirebaseAuthCredentialsProvider","Auth not yet detected"),u.resolve(),u=new Yi)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(te("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Fe(typeof s.accessToken=="string",31837,{l:s}),new R_(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Fe(e===null||typeof e=="string",2055,{h:e}),new Ft(e)}}class IS{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Ft.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class SS{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new IS(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Ft.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Sg{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class AS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Mn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Fe(this.o===void 0,3512);const s=u=>{u.error!=null&&te("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${u.error.message}`);const h=u.token!==this.m;return this.m=u.token,te("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(u.token):Promise.resolve()};this.o=u=>{e.enqueueRetryable((()=>s(u)))};const o=u=>{te("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=u,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((u=>o(u))),setTimeout((()=>{if(!this.appCheck){const u=this.V.getImmediate({optional:!0});u?o(u):te("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Sg(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Fe(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Sg(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RS(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<i;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C_(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=RS(40);for(let u=0;u<o.length;++u)s.length<20&&o[u]<t&&(s+=e.charAt(o[u]%62))}return s}}function Ie(i,e){return i<e?-1:i>e?1:0}function _d(i,e){let t=0;for(;t<i.length&&t<e.length;){const s=i.codePointAt(t),o=e.codePointAt(t);if(s!==o){if(s<128&&o<128)return Ie(s,o);{const u=C_(),h=CS(u.encode(Ag(i,t)),u.encode(Ag(e,t)));return h!==0?h:Ie(s,o)}}t+=s>65535?2:1}return Ie(i.length,e.length)}function Ag(i,e){return i.codePointAt(e)>65535?i.substring(e,e+2):i.substring(e,e+1)}function CS(i,e){for(let t=0;t<i.length&&t<e.length;++t)if(i[t]!==e[t])return Ie(i[t],e[t]);return Ie(i.length,e.length)}function go(i,e,t){return i.length===e.length&&i.every(((s,o)=>t(s,e[o])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rg="__name__";class Jn{constructor(e,t,s){t===void 0?t=0:t>e.length&&ge(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&ge(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Jn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Jn?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let o=0;o<s;o++){const u=Jn.compareSegments(e.get(o),t.get(o));if(u!==0)return u}return Ie(e.length,t.length)}static compareSegments(e,t){const s=Jn.isNumericId(e),o=Jn.isNumericId(t);return s&&!o?-1:!s&&o?1:s&&o?Jn.extractNumericId(e).compare(Jn.extractNumericId(t)):_d(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return di.fromString(e.substring(4,e.length-2))}}class Ze extends Jn{construct(e,t,s){return new Ze(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new le(G.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((o=>o.length>0)))}return new Ze(t)}static emptyPath(){return new Ze([])}}const PS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class kt extends Jn{construct(e,t,s){return new kt(e,t,s)}static isValidIdentifier(e){return PS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),kt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Rg}static keyField(){return new kt([Rg])}static fromServerFormat(e){const t=[];let s="",o=0;const u=()=>{if(s.length===0)throw new le(G.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let h=!1;for(;o<e.length;){const m=e[o];if(m==="\\"){if(o+1===e.length)throw new le(G.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new le(G.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=g,o+=2}else m==="`"?(h=!h,o++):m!=="."||h?(s+=m,o++):(u(),o++)}if(u(),h)throw new le(G.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new kt(t)}static emptyPath(){return new kt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this.path=e}static fromPath(e){return new pe(Ze.fromString(e))}static fromName(e){return new pe(Ze.fromString(e).popFirst(5))}static empty(){return new pe(Ze.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ze.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ze.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new pe(new Ze(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kS(i,e,t){if(!t)throw new le(G.INVALID_ARGUMENT,`Function ${i}() cannot be called with an empty ${e}.`)}function NS(i,e,t,s){if(e===!0&&s===!0)throw new le(G.INVALID_ARGUMENT,`${i} and ${t} cannot be used together.`)}function Cg(i){if(!pe.isDocumentKey(i))throw new le(G.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${i} has ${i.length}.`)}function P_(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function Jd(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":ge(12329,{type:typeof i})}function uo(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new le(G.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Jd(i);throw new le(G.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(i,e){const t={typeString:i};return e&&(t.value=e),t}function Qa(i,e){if(!P_(i))throw new le(G.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const o=e[s].typeString,u="value"in e[s]?{value:e[s].value}:void 0;if(!(s in i)){t=`JSON missing required field: '${s}'`;break}const h=i[s];if(o&&typeof h!==o){t=`JSON field '${s}' must be a ${o}.`;break}if(u!==void 0&&h!==u.value){t=`Expected '${s}' field to equal '${u.value}'`;break}}if(t)throw new le(G.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pg=-62135596800,kg=1e6;class Ke{static now(){return Ke.fromMillis(Date.now())}static fromDate(e){return Ke.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*kg);return new Ke(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new le(G.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new le(G.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Pg)throw new le(G.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new le(G.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/kg}_compareTo(e){return this.seconds===e.seconds?Ie(this.nanoseconds,e.nanoseconds):Ie(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ke._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Qa(e,Ke._jsonSchema))return new Ke(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Pg;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ke._jsonSchemaVersion="firestore/timestamp/1.0",Ke._jsonSchema={type:ut("string",Ke._jsonSchemaVersion),seconds:ut("number"),nanoseconds:ut("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{static fromTimestamp(e){return new ve(e)}static min(){return new ve(new Ke(0,0))}static max(){return new ve(new Ke(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ma=-1;function DS(i,e){const t=i.toTimestamp().seconds,s=i.toTimestamp().nanoseconds+1,o=ve.fromTimestamp(s===1e9?new Ke(t+1,0):new Ke(t,s));return new pi(o,pe.empty(),e)}function xS(i){return new pi(i.readTime,i.key,Ma)}class pi{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new pi(ve.min(),pe.empty(),Ma)}static max(){return new pi(ve.max(),pe.empty(),Ma)}}function VS(i,e){let t=i.readTime.compareTo(e.readTime);return t!==0?t:(t=pe.comparator(i.documentKey,e.documentKey),t!==0?t:Ie(i.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class LS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ao(i){if(i.code!==G.FAILED_PRECONDITION||i.message!==OS)throw i;te("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ge(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new $(((s,o)=>{this.nextCallback=u=>{this.wrapSuccess(e,u).next(s,o)},this.catchCallback=u=>{this.wrapFailure(t,u).next(s,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof $?t:$.resolve(t)}catch(t){return $.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):$.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):$.reject(t)}static resolve(e){return new $(((t,s)=>{t(e)}))}static reject(e){return new $(((t,s)=>{s(e)}))}static waitFor(e){return new $(((t,s)=>{let o=0,u=0,h=!1;e.forEach((m=>{++o,m.next((()=>{++u,h&&u===o&&t()}),(g=>s(g)))})),h=!0,u===o&&t()}))}static or(e){let t=$.resolve(!1);for(const s of e)t=t.next((o=>o?$.resolve(o):s()));return t}static forEach(e,t){const s=[];return e.forEach(((o,u)=>{s.push(t.call(this,o,u))})),this.waitFor(s)}static mapArray(e,t){return new $(((s,o)=>{const u=e.length,h=new Array(u);let m=0;for(let g=0;g<u;g++){const v=g;t(e[v]).next((w=>{h[v]=w,++m,m===u&&s(h)}),(w=>o(w)))}}))}static doWhile(e,t){return new $(((s,o)=>{const u=()=>{e()===!0?t().next((()=>{u()}),o):s()};u()}))}}function MS(i){const e=i.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Ro(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}oc.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd=-1;function ac(i){return i==null}function zu(i){return i===0&&1/i==-1/0}function bS(i){return typeof i=="number"&&Number.isInteger(i)&&!zu(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k_="";function FS(i){let e="";for(let t=0;t<i.length;t++)e.length>0&&(e=Ng(e)),e=US(i.get(t),e);return Ng(e)}function US(i,e){let t=e;const s=i.length;for(let o=0;o<s;o++){const u=i.charAt(o);switch(u){case"\0":t+="";break;case k_:t+="";break;default:t+=u}}return t}function Ng(i){return i+k_+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dg(i){let e=0;for(const t in i)Object.prototype.hasOwnProperty.call(i,t)&&e++;return e}function ss(i,e){for(const t in i)Object.prototype.hasOwnProperty.call(i,t)&&e(t,i[t])}function N_(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,t){this.comparator=e,this.root=t||Pt.EMPTY}insert(e,t){return new et(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Pt.BLACK,null,null))}remove(e){return new et(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Pt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(e,s.key);if(o===0)return t+s.left.size;o<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new _u(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new _u(this.root,e,this.comparator,!1)}getReverseIterator(){return new _u(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new _u(this.root,e,this.comparator,!0)}}class _u{constructor(e,t,s,o){this.isReverse=o,this.nodeStack=[];let u=1;for(;!e.isEmpty();)if(u=t?s(e.key,t):1,t&&o&&(u*=-1),u<0)e=this.isReverse?e.left:e.right;else{if(u===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Pt{constructor(e,t,s,o,u){this.key=e,this.value=t,this.color=s??Pt.RED,this.left=o??Pt.EMPTY,this.right=u??Pt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,o,u){return new Pt(e??this.key,t??this.value,s??this.color,o??this.left,u??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let o=this;const u=s(e,o.key);return o=u<0?o.copy(null,null,null,o.left.insert(e,t,s),null):u===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Pt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Pt.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Pt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Pt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ge(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ge(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ge(27949);return e+(this.isRed()?0:1)}}Pt.EMPTY=null,Pt.RED=!0,Pt.BLACK=!1;Pt.EMPTY=new class{constructor(){this.size=0}get key(){throw ge(57766)}get value(){throw ge(16141)}get color(){throw ge(16727)}get left(){throw ge(29726)}get right(){throw ge(36894)}copy(e,t,s,o,u){return this}insert(e,t,s){return new Pt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.comparator=e,this.data=new et(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new xg(this.data.getIterator())}getIteratorFrom(e){return new xg(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof gt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,u=s.getNext().key;if(this.comparator(o,u)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new gt(this.comparator);return t.data=e,t}}class xg{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this.fields=e,e.sort(kt.comparator)}static empty(){return new Fn([])}unionWith(e){let t=new gt(kt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Fn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return go(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_ extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(u){throw typeof DOMException<"u"&&u instanceof DOMException?new D_("Invalid base64 string: "+u):u}})(e);return new Nt(t)}static fromUint8Array(e){const t=(function(o){let u="";for(let h=0;h<o.length;++h)u+=String.fromCharCode(o[h]);return u})(e);return new Nt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let o=0;o<t.length;o++)s[o]=t.charCodeAt(o);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ie(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Nt.EMPTY_BYTE_STRING=new Nt("");const jS=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function mi(i){if(Fe(!!i,39018),typeof i=="string"){let e=0;const t=jS.exec(i);if(Fe(!!t,46558,{timestamp:i}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const s=new Date(i);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:st(i.seconds),nanos:st(i.nanos)}}function st(i){return typeof i=="number"?i:typeof i=="string"?Number(i):0}function gi(i){return typeof i=="string"?Nt.fromBase64String(i):Nt.fromUint8Array(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x_="server_timestamp",V_="__type__",O_="__previous_value__",L_="__local_write_time__";function Zd(i){var e,t;return((t=(((e=i?.mapValue)===null||e===void 0?void 0:e.fields)||{})[V_])===null||t===void 0?void 0:t.stringValue)===x_}function lc(i){const e=i.mapValue.fields[O_];return Zd(e)?lc(e):e}function ba(i){const e=mi(i.mapValue.fields[L_].timestampValue);return new Ke(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zS{constructor(e,t,s,o,u,h,m,g,v,w){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=o,this.ssl=u,this.forceLongPolling=h,this.autoDetectLongPolling=m,this.longPollingOptions=g,this.useFetchStreams=v,this.isUsingEmulator=w}}const Bu="(default)";class Fa{constructor(e,t){this.projectId=e,this.database=t||Bu}static empty(){return new Fa("","")}get isDefaultDatabase(){return this.database===Bu}isEqual(e){return e instanceof Fa&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M_="__type__",BS="__max__",vu={mapValue:{}},b_="__vector__",$u="value";function yi(i){return"nullValue"in i?0:"booleanValue"in i?1:"integerValue"in i||"doubleValue"in i?2:"timestampValue"in i?3:"stringValue"in i?5:"bytesValue"in i?6:"referenceValue"in i?7:"geoPointValue"in i?8:"arrayValue"in i?9:"mapValue"in i?Zd(i)?4:HS(i)?9007199254740991:$S(i)?10:11:ge(28295,{value:i})}function ir(i,e){if(i===e)return!0;const t=yi(i);if(t!==yi(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return i.booleanValue===e.booleanValue;case 4:return ba(i).isEqual(ba(e));case 3:return(function(o,u){if(typeof o.timestampValue=="string"&&typeof u.timestampValue=="string"&&o.timestampValue.length===u.timestampValue.length)return o.timestampValue===u.timestampValue;const h=mi(o.timestampValue),m=mi(u.timestampValue);return h.seconds===m.seconds&&h.nanos===m.nanos})(i,e);case 5:return i.stringValue===e.stringValue;case 6:return(function(o,u){return gi(o.bytesValue).isEqual(gi(u.bytesValue))})(i,e);case 7:return i.referenceValue===e.referenceValue;case 8:return(function(o,u){return st(o.geoPointValue.latitude)===st(u.geoPointValue.latitude)&&st(o.geoPointValue.longitude)===st(u.geoPointValue.longitude)})(i,e);case 2:return(function(o,u){if("integerValue"in o&&"integerValue"in u)return st(o.integerValue)===st(u.integerValue);if("doubleValue"in o&&"doubleValue"in u){const h=st(o.doubleValue),m=st(u.doubleValue);return h===m?zu(h)===zu(m):isNaN(h)&&isNaN(m)}return!1})(i,e);case 9:return go(i.arrayValue.values||[],e.arrayValue.values||[],ir);case 10:case 11:return(function(o,u){const h=o.mapValue.fields||{},m=u.mapValue.fields||{};if(Dg(h)!==Dg(m))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(m[g]===void 0||!ir(h[g],m[g])))return!1;return!0})(i,e);default:return ge(52216,{left:i})}}function Ua(i,e){return(i.values||[]).find((t=>ir(t,e)))!==void 0}function yo(i,e){if(i===e)return 0;const t=yi(i),s=yi(e);if(t!==s)return Ie(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return Ie(i.booleanValue,e.booleanValue);case 2:return(function(u,h){const m=st(u.integerValue||u.doubleValue),g=st(h.integerValue||h.doubleValue);return m<g?-1:m>g?1:m===g?0:isNaN(m)?isNaN(g)?0:-1:1})(i,e);case 3:return Vg(i.timestampValue,e.timestampValue);case 4:return Vg(ba(i),ba(e));case 5:return _d(i.stringValue,e.stringValue);case 6:return(function(u,h){const m=gi(u),g=gi(h);return m.compareTo(g)})(i.bytesValue,e.bytesValue);case 7:return(function(u,h){const m=u.split("/"),g=h.split("/");for(let v=0;v<m.length&&v<g.length;v++){const w=Ie(m[v],g[v]);if(w!==0)return w}return Ie(m.length,g.length)})(i.referenceValue,e.referenceValue);case 8:return(function(u,h){const m=Ie(st(u.latitude),st(h.latitude));return m!==0?m:Ie(st(u.longitude),st(h.longitude))})(i.geoPointValue,e.geoPointValue);case 9:return Og(i.arrayValue,e.arrayValue);case 10:return(function(u,h){var m,g,v,w;const S=u.fields||{},P=h.fields||{},j=(m=S[$u])===null||m===void 0?void 0:m.arrayValue,K=(g=P[$u])===null||g===void 0?void 0:g.arrayValue,B=Ie(((v=j?.values)===null||v===void 0?void 0:v.length)||0,((w=K?.values)===null||w===void 0?void 0:w.length)||0);return B!==0?B:Og(j,K)})(i.mapValue,e.mapValue);case 11:return(function(u,h){if(u===vu.mapValue&&h===vu.mapValue)return 0;if(u===vu.mapValue)return 1;if(h===vu.mapValue)return-1;const m=u.fields||{},g=Object.keys(m),v=h.fields||{},w=Object.keys(v);g.sort(),w.sort();for(let S=0;S<g.length&&S<w.length;++S){const P=_d(g[S],w[S]);if(P!==0)return P;const j=yo(m[g[S]],v[w[S]]);if(j!==0)return j}return Ie(g.length,w.length)})(i.mapValue,e.mapValue);default:throw ge(23264,{le:t})}}function Vg(i,e){if(typeof i=="string"&&typeof e=="string"&&i.length===e.length)return Ie(i,e);const t=mi(i),s=mi(e),o=Ie(t.seconds,s.seconds);return o!==0?o:Ie(t.nanos,s.nanos)}function Og(i,e){const t=i.values||[],s=e.values||[];for(let o=0;o<t.length&&o<s.length;++o){const u=yo(t[o],s[o]);if(u)return u}return Ie(t.length,s.length)}function _o(i){return vd(i)}function vd(i){return"nullValue"in i?"null":"booleanValue"in i?""+i.booleanValue:"integerValue"in i?""+i.integerValue:"doubleValue"in i?""+i.doubleValue:"timestampValue"in i?(function(t){const s=mi(t);return`time(${s.seconds},${s.nanos})`})(i.timestampValue):"stringValue"in i?i.stringValue:"bytesValue"in i?(function(t){return gi(t).toBase64()})(i.bytesValue):"referenceValue"in i?(function(t){return pe.fromName(t).toString()})(i.referenceValue):"geoPointValue"in i?(function(t){return`geo(${t.latitude},${t.longitude})`})(i.geoPointValue):"arrayValue"in i?(function(t){let s="[",o=!0;for(const u of t.values||[])o?o=!1:s+=",",s+=vd(u);return s+"]"})(i.arrayValue):"mapValue"in i?(function(t){const s=Object.keys(t.fields||{}).sort();let o="{",u=!0;for(const h of s)u?u=!1:o+=",",o+=`${h}:${vd(t.fields[h])}`;return o+"}"})(i.mapValue):ge(61005,{value:i})}function Pu(i){switch(yi(i)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=lc(i);return e?16+Pu(e):16;case 5:return 2*i.stringValue.length;case 6:return gi(i.bytesValue).approximateByteSize();case 7:return i.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((o,u)=>o+Pu(u)),0)})(i.arrayValue);case 10:case 11:return(function(s){let o=0;return ss(s.fields,((u,h)=>{o+=u.length+Pu(h)})),o})(i.mapValue);default:throw ge(13486,{value:i})}}function Ed(i){return!!i&&"integerValue"in i}function ef(i){return!!i&&"arrayValue"in i}function Lg(i){return!!i&&"nullValue"in i}function Mg(i){return!!i&&"doubleValue"in i&&isNaN(Number(i.doubleValue))}function ku(i){return!!i&&"mapValue"in i}function $S(i){var e,t;return((t=(((e=i?.mapValue)===null||e===void 0?void 0:e.fields)||{})[M_])===null||t===void 0?void 0:t.stringValue)===b_}function Na(i){if(i.geoPointValue)return{geoPointValue:Object.assign({},i.geoPointValue)};if(i.timestampValue&&typeof i.timestampValue=="object")return{timestampValue:Object.assign({},i.timestampValue)};if(i.mapValue){const e={mapValue:{fields:{}}};return ss(i.mapValue.fields,((t,s)=>e.mapValue.fields[t]=Na(s))),e}if(i.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(i.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Na(i.arrayValue.values[t]);return e}return Object.assign({},i)}function HS(i){return(((i.mapValue||{}).fields||{}).__type__||{}).stringValue===BS}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e){this.value=e}static empty(){return new vn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!ku(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Na(t)}setAll(e){let t=kt.emptyPath(),s={},o=[];e.forEach(((h,m)=>{if(!t.isImmediateParentOf(m)){const g=this.getFieldsMap(t);this.applyChanges(g,s,o),s={},o=[],t=m.popLast()}h?s[m.lastSegment()]=Na(h):o.push(m.lastSegment())}));const u=this.getFieldsMap(t);this.applyChanges(u,s,o)}delete(e){const t=this.field(e.popLast());ku(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ir(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let o=t.mapValue.fields[e.get(s)];ku(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,s){ss(t,((o,u)=>e[o]=u));for(const o of s)delete e[o]}clone(){return new vn(Na(this.value))}}function F_(i){const e=[];return ss(i.fields,((t,s)=>{const o=new kt([t]);if(ku(s)){const u=F_(s.mapValue).fields;if(u.length===0)e.push(o);else for(const h of u)e.push(o.child(h))}else e.push(o)})),new Fn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(e,t,s,o,u,h,m){this.key=e,this.documentType=t,this.version=s,this.readTime=o,this.createTime=u,this.data=h,this.documentState=m}static newInvalidDocument(e){return new Ut(e,0,ve.min(),ve.min(),ve.min(),vn.empty(),0)}static newFoundDocument(e,t,s,o){return new Ut(e,1,t,ve.min(),s,o,0)}static newNoDocument(e,t){return new Ut(e,2,t,ve.min(),ve.min(),vn.empty(),0)}static newUnknownDocument(e,t){return new Ut(e,3,t,ve.min(),ve.min(),vn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ve.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=vn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=vn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ve.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ut&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ut(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{constructor(e,t){this.position=e,this.inclusive=t}}function bg(i,e,t){let s=0;for(let o=0;o<i.position.length;o++){const u=e[o],h=i.position[o];if(u.field.isKeyField()?s=pe.comparator(pe.fromName(h.referenceValue),t.key):s=yo(h,t.data.field(u.field)),u.dir==="desc"&&(s*=-1),s!==0)break}return s}function Fg(i,e){if(i===null)return e===null;if(e===null||i.inclusive!==e.inclusive||i.position.length!==e.position.length)return!1;for(let t=0;t<i.position.length;t++)if(!ir(i.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wu{constructor(e,t="asc"){this.field=e,this.dir=t}}function WS(i,e){return i.dir===e.dir&&i.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{}class mt extends U_{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new KS(e,t,s):t==="array-contains"?new XS(e,s):t==="in"?new JS(e,s):t==="not-in"?new YS(e,s):t==="array-contains-any"?new ZS(e,s):new mt(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new GS(e,s):new QS(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(yo(t,this.value)):t!==null&&yi(this.value)===yi(t)&&this.matchesComparison(yo(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ge(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class sr extends U_{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new sr(e,t)}matches(e){return j_(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function j_(i){return i.op==="and"}function z_(i){return qS(i)&&j_(i)}function qS(i){for(const e of i.filters)if(e instanceof sr)return!1;return!0}function wd(i){if(i instanceof mt)return i.field.canonicalString()+i.op.toString()+_o(i.value);if(z_(i))return i.filters.map((e=>wd(e))).join(",");{const e=i.filters.map((t=>wd(t))).join(",");return`${i.op}(${e})`}}function B_(i,e){return i instanceof mt?(function(s,o){return o instanceof mt&&s.op===o.op&&s.field.isEqual(o.field)&&ir(s.value,o.value)})(i,e):i instanceof sr?(function(s,o){return o instanceof sr&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce(((u,h,m)=>u&&B_(h,o.filters[m])),!0):!1})(i,e):void ge(19439)}function $_(i){return i instanceof mt?(function(t){return`${t.field.canonicalString()} ${t.op} ${_o(t.value)}`})(i):i instanceof sr?(function(t){return t.op.toString()+" {"+t.getFilters().map($_).join(" ,")+"}"})(i):"Filter"}class KS extends mt{constructor(e,t,s){super(e,t,s),this.key=pe.fromName(s.referenceValue)}matches(e){const t=pe.comparator(e.key,this.key);return this.matchesComparison(t)}}class GS extends mt{constructor(e,t){super(e,"in",t),this.keys=H_("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class QS extends mt{constructor(e,t){super(e,"not-in",t),this.keys=H_("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function H_(i,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>pe.fromName(s.referenceValue)))}class XS extends mt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ef(t)&&Ua(t.arrayValue,this.value)}}class JS extends mt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ua(this.value.arrayValue,t)}}class YS extends mt{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ua(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Ua(this.value.arrayValue,t)}}class ZS extends mt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ef(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>Ua(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e1{constructor(e,t=null,s=[],o=[],u=null,h=null,m=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=o,this.limit=u,this.startAt=h,this.endAt=m,this.Pe=null}}function Ug(i,e=null,t=[],s=[],o=null,u=null,h=null){return new e1(i,e,t,s,o,u,h)}function tf(i){const e=Ee(i);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>wd(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(u){return u.field.canonicalString()+u.dir})(s))).join(","),ac(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>_o(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>_o(s))).join(",")),e.Pe=t}return e.Pe}function nf(i,e){if(i.limit!==e.limit||i.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<i.orderBy.length;t++)if(!WS(i.orderBy[t],e.orderBy[t]))return!1;if(i.filters.length!==e.filters.length)return!1;for(let t=0;t<i.filters.length;t++)if(!B_(i.filters[t],e.filters[t]))return!1;return i.collectionGroup===e.collectionGroup&&!!i.path.isEqual(e.path)&&!!Fg(i.startAt,e.startAt)&&Fg(i.endAt,e.endAt)}function Td(i){return pe.isDocumentKey(i.path)&&i.collectionGroup===null&&i.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t=null,s=[],o=[],u=null,h="F",m=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=o,this.limit=u,this.limitType=h,this.startAt=m,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function t1(i,e,t,s,o,u,h,m){return new uc(i,e,t,s,o,u,h,m)}function rf(i){return new uc(i)}function jg(i){return i.filters.length===0&&i.limit===null&&i.startAt==null&&i.endAt==null&&(i.explicitOrderBy.length===0||i.explicitOrderBy.length===1&&i.explicitOrderBy[0].field.isKeyField())}function n1(i){return i.collectionGroup!==null}function Da(i){const e=Ee(i);if(e.Te===null){e.Te=[];const t=new Set;for(const u of e.explicitOrderBy)e.Te.push(u),t.add(u.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let m=new gt(kt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((v=>{v.isInequality()&&(m=m.add(v.field))}))})),m})(e).forEach((u=>{t.has(u.canonicalString())||u.isKeyField()||e.Te.push(new Wu(u,s))})),t.has(kt.keyField().canonicalString())||e.Te.push(new Wu(kt.keyField(),s))}return e.Te}function Zn(i){const e=Ee(i);return e.Ie||(e.Ie=r1(e,Da(i))),e.Ie}function r1(i,e){if(i.limitType==="F")return Ug(i.path,i.collectionGroup,e,i.filters,i.limit,i.startAt,i.endAt);{e=e.map((o=>{const u=o.dir==="desc"?"asc":"desc";return new Wu(o.field,u)}));const t=i.endAt?new Hu(i.endAt.position,i.endAt.inclusive):null,s=i.startAt?new Hu(i.startAt.position,i.startAt.inclusive):null;return Ug(i.path,i.collectionGroup,e,i.filters,i.limit,t,s)}}function Id(i,e,t){return new uc(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),e,t,i.startAt,i.endAt)}function cc(i,e){return nf(Zn(i),Zn(e))&&i.limitType===e.limitType}function W_(i){return`${tf(Zn(i))}|lt:${i.limitType}`}function ro(i){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((o=>$_(o))).join(", ")}]`),ac(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((o=>_o(o))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((o=>_o(o))).join(",")),`Target(${s})`})(Zn(i))}; limitType=${i.limitType})`}function hc(i,e){return e.isFoundDocument()&&(function(s,o){const u=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(u):pe.isDocumentKey(s.path)?s.path.isEqual(u):s.path.isImmediateParentOf(u)})(i,e)&&(function(s,o){for(const u of Da(s))if(!u.field.isKeyField()&&o.data.field(u.field)===null)return!1;return!0})(i,e)&&(function(s,o){for(const u of s.filters)if(!u.matches(o))return!1;return!0})(i,e)&&(function(s,o){return!(s.startAt&&!(function(h,m,g){const v=bg(h,m,g);return h.inclusive?v<=0:v<0})(s.startAt,Da(s),o)||s.endAt&&!(function(h,m,g){const v=bg(h,m,g);return h.inclusive?v>=0:v>0})(s.endAt,Da(s),o))})(i,e)}function i1(i){return i.collectionGroup||(i.path.length%2==1?i.path.lastSegment():i.path.get(i.path.length-2))}function q_(i){return(e,t)=>{let s=!1;for(const o of Da(i)){const u=s1(o,e,t);if(u!==0)return u;s=s||o.field.isKeyField()}return 0}}function s1(i,e,t){const s=i.field.isKeyField()?pe.comparator(e.key,t.key):(function(u,h,m){const g=h.data.field(u),v=m.data.field(u);return g!==null&&v!==null?yo(g,v):ge(42886)})(i.field,e,t);switch(i.dir){case"asc":return s;case"desc":return-1*s;default:return ge(19790,{direction:i.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[o,u]of s)if(this.equalsFn(o,e))return u}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),o=this.inner[s];if(o===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let u=0;u<o.length;u++)if(this.equalsFn(o[u][0],e))return void(o[u]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return s.length===1?delete this.inner[t]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(e){ss(this.inner,((t,s)=>{for(const[o,u]of s)e(o,u)}))}isEmpty(){return N_(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o1=new et(pe.comparator);function Dr(){return o1}const K_=new et(pe.comparator);function Aa(...i){let e=K_;for(const t of i)e=e.insert(t.key,t);return e}function G_(i){let e=K_;return i.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function Xi(){return xa()}function Q_(){return xa()}function xa(){return new os((i=>i.toString()),((i,e)=>i.isEqual(e)))}const a1=new et(pe.comparator),l1=new gt(pe.comparator);function Pe(...i){let e=l1;for(const t of i)e=e.add(t);return e}const u1=new gt(Ie);function c1(){return u1}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sf(i,e){if(i.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:zu(e)?"-0":e}}function X_(i){return{integerValue:""+i}}function h1(i,e){return bS(e)?X_(e):sf(i,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dc{constructor(){this._=void 0}}function d1(i,e,t){return i instanceof qu?(function(o,u){const h={fields:{[V_]:{stringValue:x_},[L_]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return u&&Zd(u)&&(u=lc(u)),u&&(h.fields[O_]=u),{mapValue:h}})(t,e):i instanceof ja?Y_(i,e):i instanceof za?Z_(i,e):(function(o,u){const h=J_(o,u),m=zg(h)+zg(o.Ee);return Ed(h)&&Ed(o.Ee)?X_(m):sf(o.serializer,m)})(i,e)}function f1(i,e,t){return i instanceof ja?Y_(i,e):i instanceof za?Z_(i,e):t}function J_(i,e){return i instanceof Ku?(function(s){return Ed(s)||(function(u){return!!u&&"doubleValue"in u})(s)})(e)?e:{integerValue:0}:null}class qu extends dc{}class ja extends dc{constructor(e){super(),this.elements=e}}function Y_(i,e){const t=ev(e);for(const s of i.elements)t.some((o=>ir(o,s)))||t.push(s);return{arrayValue:{values:t}}}class za extends dc{constructor(e){super(),this.elements=e}}function Z_(i,e){let t=ev(e);for(const s of i.elements)t=t.filter((o=>!ir(o,s)));return{arrayValue:{values:t}}}class Ku extends dc{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function zg(i){return st(i.integerValue||i.doubleValue)}function ev(i){return ef(i)&&i.arrayValue.values?i.arrayValue.values.slice():[]}function p1(i,e){return i.field.isEqual(e.field)&&(function(s,o){return s instanceof ja&&o instanceof ja||s instanceof za&&o instanceof za?go(s.elements,o.elements,ir):s instanceof Ku&&o instanceof Ku?ir(s.Ee,o.Ee):s instanceof qu&&o instanceof qu})(i.transform,e.transform)}class m1{constructor(e,t){this.version=e,this.transformResults=t}}class Cr{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Cr}static exists(e){return new Cr(void 0,e)}static updateTime(e){return new Cr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Nu(i,e){return i.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(i.updateTime):i.exists===void 0||i.exists===e.isFoundDocument()}class fc{}function tv(i,e){if(!i.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return i.isNoDocument()?new rv(i.key,Cr.none()):new Xa(i.key,i.data,Cr.none());{const t=i.data,s=vn.empty();let o=new gt(kt.comparator);for(let u of e.fields)if(!o.has(u)){let h=t.field(u);h===null&&u.length>1&&(u=u.popLast(),h=t.field(u)),h===null?s.delete(u):s.set(u,h),o=o.add(u)}return new as(i.key,s,new Fn(o.toArray()),Cr.none())}}function g1(i,e,t){i instanceof Xa?(function(o,u,h){const m=o.value.clone(),g=$g(o.fieldTransforms,u,h.transformResults);m.setAll(g),u.convertToFoundDocument(h.version,m).setHasCommittedMutations()})(i,e,t):i instanceof as?(function(o,u,h){if(!Nu(o.precondition,u))return void u.convertToUnknownDocument(h.version);const m=$g(o.fieldTransforms,u,h.transformResults),g=u.data;g.setAll(nv(o)),g.setAll(m),u.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(i,e,t):(function(o,u,h){u.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function Va(i,e,t,s){return i instanceof Xa?(function(u,h,m,g){if(!Nu(u.precondition,h))return m;const v=u.value.clone(),w=Hg(u.fieldTransforms,g,h);return v.setAll(w),h.convertToFoundDocument(h.version,v).setHasLocalMutations(),null})(i,e,t,s):i instanceof as?(function(u,h,m,g){if(!Nu(u.precondition,h))return m;const v=Hg(u.fieldTransforms,g,h),w=h.data;return w.setAll(nv(u)),w.setAll(v),h.convertToFoundDocument(h.version,w).setHasLocalMutations(),m===null?null:m.unionWith(u.fieldMask.fields).unionWith(u.fieldTransforms.map((S=>S.field)))})(i,e,t,s):(function(u,h,m){return Nu(u.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):m})(i,e,t)}function y1(i,e){let t=null;for(const s of i.fieldTransforms){const o=e.data.field(s.field),u=J_(s.transform,o||null);u!=null&&(t===null&&(t=vn.empty()),t.set(s.field,u))}return t||null}function Bg(i,e){return i.type===e.type&&!!i.key.isEqual(e.key)&&!!i.precondition.isEqual(e.precondition)&&!!(function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&go(s,o,((u,h)=>p1(u,h)))})(i.fieldTransforms,e.fieldTransforms)&&(i.type===0?i.value.isEqual(e.value):i.type!==1||i.data.isEqual(e.data)&&i.fieldMask.isEqual(e.fieldMask))}class Xa extends fc{constructor(e,t,s,o=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class as extends fc{constructor(e,t,s,o,u=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=o,this.fieldTransforms=u,this.type=1}getFieldMask(){return this.fieldMask}}function nv(i){const e=new Map;return i.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=i.data.field(t);e.set(t,s)}})),e}function $g(i,e,t){const s=new Map;Fe(i.length===t.length,32656,{Ae:t.length,Re:i.length});for(let o=0;o<t.length;o++){const u=i[o],h=u.transform,m=e.data.field(u.field);s.set(u.field,f1(h,m,t[o]))}return s}function Hg(i,e,t){const s=new Map;for(const o of i){const u=o.transform,h=t.data.field(o.field);s.set(o.field,d1(u,h,e))}return s}class rv extends fc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class _1 extends fc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v1{constructor(e,t,s,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const u=this.mutations[o];u.key.isEqual(e.key)&&g1(u,e,s[o])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Va(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Va(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Q_();return this.mutations.forEach((o=>{const u=e.get(o.key),h=u.overlayedDocument;let m=this.applyToLocalView(h,u.mutatedFields);m=t.has(o.key)?null:m;const g=tv(h,m);g!==null&&s.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(ve.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Pe())}isEqual(e){return this.batchId===e.batchId&&go(this.mutations,e.mutations,((t,s)=>Bg(t,s)))&&go(this.baseMutations,e.baseMutations,((t,s)=>Bg(t,s)))}}class of{constructor(e,t,s,o){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=o}static from(e,t,s){Fe(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let o=(function(){return a1})();const u=e.mutations;for(let h=0;h<u.length;h++)o=o.insert(u[h].key,s[h].version);return new of(e,t,s,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E1{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w1{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var lt,xe;function T1(i){switch(i){case G.OK:return ge(64938);case G.CANCELLED:case G.UNKNOWN:case G.DEADLINE_EXCEEDED:case G.RESOURCE_EXHAUSTED:case G.INTERNAL:case G.UNAVAILABLE:case G.UNAUTHENTICATED:return!1;case G.INVALID_ARGUMENT:case G.NOT_FOUND:case G.ALREADY_EXISTS:case G.PERMISSION_DENIED:case G.FAILED_PRECONDITION:case G.ABORTED:case G.OUT_OF_RANGE:case G.UNIMPLEMENTED:case G.DATA_LOSS:return!0;default:return ge(15467,{code:i})}}function iv(i){if(i===void 0)return Nr("GRPC error has no .code"),G.UNKNOWN;switch(i){case lt.OK:return G.OK;case lt.CANCELLED:return G.CANCELLED;case lt.UNKNOWN:return G.UNKNOWN;case lt.DEADLINE_EXCEEDED:return G.DEADLINE_EXCEEDED;case lt.RESOURCE_EXHAUSTED:return G.RESOURCE_EXHAUSTED;case lt.INTERNAL:return G.INTERNAL;case lt.UNAVAILABLE:return G.UNAVAILABLE;case lt.UNAUTHENTICATED:return G.UNAUTHENTICATED;case lt.INVALID_ARGUMENT:return G.INVALID_ARGUMENT;case lt.NOT_FOUND:return G.NOT_FOUND;case lt.ALREADY_EXISTS:return G.ALREADY_EXISTS;case lt.PERMISSION_DENIED:return G.PERMISSION_DENIED;case lt.FAILED_PRECONDITION:return G.FAILED_PRECONDITION;case lt.ABORTED:return G.ABORTED;case lt.OUT_OF_RANGE:return G.OUT_OF_RANGE;case lt.UNIMPLEMENTED:return G.UNIMPLEMENTED;case lt.DATA_LOSS:return G.DATA_LOSS;default:return ge(39323,{code:i})}}(xe=lt||(lt={}))[xe.OK=0]="OK",xe[xe.CANCELLED=1]="CANCELLED",xe[xe.UNKNOWN=2]="UNKNOWN",xe[xe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",xe[xe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",xe[xe.NOT_FOUND=5]="NOT_FOUND",xe[xe.ALREADY_EXISTS=6]="ALREADY_EXISTS",xe[xe.PERMISSION_DENIED=7]="PERMISSION_DENIED",xe[xe.UNAUTHENTICATED=16]="UNAUTHENTICATED",xe[xe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",xe[xe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",xe[xe.ABORTED=10]="ABORTED",xe[xe.OUT_OF_RANGE=11]="OUT_OF_RANGE",xe[xe.UNIMPLEMENTED=12]="UNIMPLEMENTED",xe[xe.INTERNAL=13]="INTERNAL",xe[xe.UNAVAILABLE=14]="UNAVAILABLE",xe[xe.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I1=new di([4294967295,4294967295],0);function Wg(i){const e=C_().encode(i),t=new v_;return t.update(e),new Uint8Array(t.digest())}function qg(i){const e=new DataView(i.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),o=e.getUint32(8,!0),u=e.getUint32(12,!0);return[new di([t,s],0),new di([o,u],0)]}class af{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Ra(`Invalid padding: ${t}`);if(s<0)throw new Ra(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Ra(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Ra(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=di.fromNumber(this.fe)}pe(e,t,s){let o=e.add(t.multiply(di.fromNumber(s)));return o.compare(I1)===1&&(o=new di([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=Wg(e),[s,o]=qg(t);for(let u=0;u<this.hashCount;u++){const h=this.pe(s,o,u);if(!this.ye(h))return!1}return!0}static create(e,t,s){const o=e%8==0?0:8-e%8,u=new Uint8Array(Math.ceil(e/8)),h=new af(u,o,t);return s.forEach((m=>h.insert(m))),h}insert(e){if(this.fe===0)return;const t=Wg(e),[s,o]=qg(t);for(let u=0;u<this.hashCount;u++){const h=this.pe(s,o,u);this.we(h)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Ra extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc{constructor(e,t,s,o,u){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=u}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const o=new Map;return o.set(e,Ja.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new pc(ve.min(),o,new et(Ie),Dr(),Pe())}}class Ja{constructor(e,t,s,o,u){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=u}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new Ja(s,t,Pe(),Pe(),Pe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Du{constructor(e,t,s,o){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=o}}class sv{constructor(e,t){this.targetId=e,this.De=t}}class ov{constructor(e,t,s=Nt.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=o}}class Kg{constructor(){this.ve=0,this.Ce=Gg(),this.Fe=Nt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Pe(),t=Pe(),s=Pe();return this.Ce.forEach(((o,u)=>{switch(u){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:s=s.add(o);break;default:ge(38017,{changeType:u})}})),new Ja(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=Gg()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Fe(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class S1{constructor(e){this.We=e,this.Ge=new Map,this.ze=Dr(),this.je=Eu(),this.Je=Eu(),this.He=new et(Ie)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:ge(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,s=e.De.count,o=this.st(t);if(o){const u=o.target;if(Td(u))if(s===0){const h=new pe(u.path);this.Xe(t,h,Ut.newNoDocument(h,ve.min()))}else Fe(s===1,20013,{expectedCount:s});else{const h=this.ot(t);if(h!==s){const m=this._t(e),g=m?this.ut(m,e,h):1;if(g!==0){this.rt(t);const v=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,v)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:u=0}=t;let h,m;try{h=gi(s).toUint8Array()}catch(g){if(g instanceof D_)return fi("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{m=new af(h,o,u)}catch(g){return fi(g instanceof Ra?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return m.fe===0?null:m}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let o=0;return s.forEach((u=>{const h=this.We.lt(),m=`projects/${h.projectId}/databases/${h.database}/documents/${u.path.canonicalString()}`;e.mightContain(m)||(this.Xe(t,u,null),o++)})),o}Pt(e){const t=new Map;this.Ge.forEach(((u,h)=>{const m=this.st(h);if(m){if(u.current&&Td(m.target)){const g=new pe(m.target.path);this.Tt(g).has(h)||this.It(h,g)||this.Xe(h,g,Ut.newNoDocument(g,e))}u.Ne&&(t.set(h,u.Le()),u.ke())}}));let s=Pe();this.Je.forEach(((u,h)=>{let m=!0;h.forEachWhile((g=>{const v=this.st(g);return!v||v.purpose==="TargetPurposeLimboResolution"||(m=!1,!1)})),m&&(s=s.add(u))})),this.ze.forEach(((u,h)=>h.setReadTime(e)));const o=new pc(e,t,this.He,this.ze,s);return this.ze=Dr(),this.je=Eu(),this.Je=Eu(),this.He=new et(Ie),o}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const o=this.tt(e);this.It(e,t)?o.qe(t,1):o.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new Kg,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new gt(Ie),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new gt(Ie),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||te("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new Kg),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Eu(){return new et(pe.comparator)}function Gg(){return new et(pe.comparator)}const A1={asc:"ASCENDING",desc:"DESCENDING"},R1={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},C1={and:"AND",or:"OR"};class P1{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Sd(i,e){return i.useProto3Json||ac(e)?e:{value:e}}function Gu(i,e){return i.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function av(i,e){return i.useProto3Json?e.toBase64():e.toUint8Array()}function k1(i,e){return Gu(i,e.toTimestamp())}function er(i){return Fe(!!i,49232),ve.fromTimestamp((function(t){const s=mi(t);return new Ke(s.seconds,s.nanos)})(i))}function lf(i,e){return Ad(i,e).canonicalString()}function Ad(i,e){const t=(function(o){return new Ze(["projects",o.projectId,"databases",o.database])})(i).child("documents");return e===void 0?t:t.child(e)}function lv(i){const e=Ze.fromString(i);return Fe(fv(e),10190,{key:e.toString()}),e}function Rd(i,e){return lf(i.databaseId,e.path)}function sd(i,e){const t=lv(e);if(t.get(1)!==i.databaseId.projectId)throw new le(G.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+i.databaseId.projectId);if(t.get(3)!==i.databaseId.database)throw new le(G.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+i.databaseId.database);return new pe(cv(t))}function uv(i,e){return lf(i.databaseId,e)}function N1(i){const e=lv(i);return e.length===4?Ze.emptyPath():cv(e)}function Cd(i){return new Ze(["projects",i.databaseId.projectId,"databases",i.databaseId.database]).canonicalString()}function cv(i){return Fe(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)}function Qg(i,e,t){return{name:Rd(i,e),fields:t.value.mapValue.fields}}function D1(i,e){let t;if("targetChange"in e){e.targetChange;const s=(function(v){return v==="NO_CHANGE"?0:v==="ADD"?1:v==="REMOVE"?2:v==="CURRENT"?3:v==="RESET"?4:ge(39313,{state:v})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],u=(function(v,w){return v.useProto3Json?(Fe(w===void 0||typeof w=="string",58123),Nt.fromBase64String(w||"")):(Fe(w===void 0||w instanceof Buffer||w instanceof Uint8Array,16193),Nt.fromUint8Array(w||new Uint8Array))})(i,e.targetChange.resumeToken),h=e.targetChange.cause,m=h&&(function(v){const w=v.code===void 0?G.UNKNOWN:iv(v.code);return new le(w,v.message||"")})(h);t=new ov(s,o,u,m||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const o=sd(i,s.document.name),u=er(s.document.updateTime),h=s.document.createTime?er(s.document.createTime):ve.min(),m=new vn({mapValue:{fields:s.document.fields}}),g=Ut.newFoundDocument(o,u,h,m),v=s.targetIds||[],w=s.removedTargetIds||[];t=new Du(v,w,g.key,g)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const o=sd(i,s.document),u=s.readTime?er(s.readTime):ve.min(),h=Ut.newNoDocument(o,u),m=s.removedTargetIds||[];t=new Du([],m,h.key,h)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const o=sd(i,s.document),u=s.removedTargetIds||[];t=new Du([],u,o,null)}else{if(!("filter"in e))return ge(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:o=0,unchangedNames:u}=s,h=new w1(o,u),m=s.targetId;t=new sv(m,h)}}return t}function x1(i,e){let t;if(e instanceof Xa)t={update:Qg(i,e.key,e.value)};else if(e instanceof rv)t={delete:Rd(i,e.key)};else if(e instanceof as)t={update:Qg(i,e.key,e.data),updateMask:z1(e.fieldMask)};else{if(!(e instanceof _1))return ge(16599,{Rt:e.type});t={verify:Rd(i,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(u,h){const m=h.transform;if(m instanceof qu)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(m instanceof ja)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:m.elements}};if(m instanceof za)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:m.elements}};if(m instanceof Ku)return{fieldPath:h.field.canonicalString(),increment:m.Ee};throw ge(20930,{transform:h.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(o,u){return u.updateTime!==void 0?{updateTime:k1(o,u.updateTime)}:u.exists!==void 0?{exists:u.exists}:ge(27497)})(i,e.precondition)),t}function V1(i,e){return i&&i.length>0?(Fe(e!==void 0,14353),i.map((t=>(function(o,u){let h=o.updateTime?er(o.updateTime):er(u);return h.isEqual(ve.min())&&(h=er(u)),new m1(h,o.transformResults||[])})(t,e)))):[]}function O1(i,e){return{documents:[uv(i,e.path)]}}function L1(i,e){const t={structuredQuery:{}},s=e.path;let o;e.collectionGroup!==null?(o=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=uv(i,o);const u=(function(v){if(v.length!==0)return dv(sr.create(v,"and"))})(e.filters);u&&(t.structuredQuery.where=u);const h=(function(v){if(v.length!==0)return v.map((w=>(function(P){return{field:io(P.field),direction:F1(P.dir)}})(w)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const m=Sd(i,e.limit);return m!==null&&(t.structuredQuery.limit=m),e.startAt&&(t.structuredQuery.startAt=(function(v){return{before:v.inclusive,values:v.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(v){return{before:!v.inclusive,values:v.position}})(e.endAt)),{Vt:t,parent:o}}function M1(i){let e=N1(i.parent);const t=i.structuredQuery,s=t.from?t.from.length:0;let o=null;if(s>0){Fe(s===1,65062);const w=t.from[0];w.allDescendants?o=w.collectionId:e=e.child(w.collectionId)}let u=[];t.where&&(u=(function(S){const P=hv(S);return P instanceof sr&&z_(P)?P.getFilters():[P]})(t.where));let h=[];t.orderBy&&(h=(function(S){return S.map((P=>(function(K){return new Wu(so(K.field),(function(z){switch(z){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(K.direction))})(P)))})(t.orderBy));let m=null;t.limit&&(m=(function(S){let P;return P=typeof S=="object"?S.value:S,ac(P)?null:P})(t.limit));let g=null;t.startAt&&(g=(function(S){const P=!!S.before,j=S.values||[];return new Hu(j,P)})(t.startAt));let v=null;return t.endAt&&(v=(function(S){const P=!S.before,j=S.values||[];return new Hu(j,P)})(t.endAt)),t1(e,o,h,u,m,"F",g,v)}function b1(i,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ge(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function hv(i){return i.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=so(t.unaryFilter.field);return mt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=so(t.unaryFilter.field);return mt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const u=so(t.unaryFilter.field);return mt.create(u,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=so(t.unaryFilter.field);return mt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ge(61313);default:return ge(60726)}})(i):i.fieldFilter!==void 0?(function(t){return mt.create(so(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ge(58110);default:return ge(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(i):i.compositeFilter!==void 0?(function(t){return sr.create(t.compositeFilter.filters.map((s=>hv(s))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return ge(1026)}})(t.compositeFilter.op))})(i):ge(30097,{filter:i})}function F1(i){return A1[i]}function U1(i){return R1[i]}function j1(i){return C1[i]}function io(i){return{fieldPath:i.canonicalString()}}function so(i){return kt.fromServerFormat(i.fieldPath)}function dv(i){return i instanceof mt?(function(t){if(t.op==="=="){if(Mg(t.value))return{unaryFilter:{field:io(t.field),op:"IS_NAN"}};if(Lg(t.value))return{unaryFilter:{field:io(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Mg(t.value))return{unaryFilter:{field:io(t.field),op:"IS_NOT_NAN"}};if(Lg(t.value))return{unaryFilter:{field:io(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:io(t.field),op:U1(t.op),value:t.value}}})(i):i instanceof sr?(function(t){const s=t.getFilters().map((o=>dv(o)));return s.length===1?s[0]:{compositeFilter:{op:j1(t.op),filters:s}}})(i):ge(54877,{filter:i})}function z1(i){const e=[];return i.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function fv(i){return i.length>=4&&i.get(0)==="projects"&&i.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,t,s,o,u=ve.min(),h=ve.min(),m=Nt.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=u,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=m,this.expectedCount=g}withSequenceNumber(e){return new li(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new li(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new li(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new li(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B1{constructor(e){this.gt=e}}function $1(i){const e=M1({parent:i.parent,structuredQuery:i.structuredQuery});return i.limitType==="LAST"?Id(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H1{constructor(){this.Dn=new W1}addToCollectionParentIndex(e,t){return this.Dn.add(t),$.resolve()}getCollectionParents(e,t){return $.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return $.resolve()}deleteFieldIndex(e,t){return $.resolve()}deleteAllFieldIndexes(e){return $.resolve()}createTargetIndexes(e,t){return $.resolve()}getDocumentsMatchingTarget(e,t){return $.resolve(null)}getIndexType(e,t){return $.resolve(0)}getFieldIndexes(e,t){return $.resolve([])}getNextCollectionGroupToUpdate(e){return $.resolve(null)}getMinOffset(e,t){return $.resolve(pi.min())}getMinOffsetFromCollectionGroup(e,t){return $.resolve(pi.min())}updateCollectionGroup(e,t,s){return $.resolve()}updateIndexEntries(e,t){return $.resolve()}}class W1{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t]||new gt(Ze.comparator),u=!o.has(s);return this.index[t]=o.add(s),u}has(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t];return o&&o.has(s)}getEntries(e){return(this.index[e]||new gt(Ze.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},pv=41943040;class Zt{static withCacheSize(e){return new Zt(e,Zt.DEFAULT_COLLECTION_PERCENTILE,Zt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Zt.DEFAULT_COLLECTION_PERCENTILE=10,Zt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Zt.DEFAULT=new Zt(pv,Zt.DEFAULT_COLLECTION_PERCENTILE,Zt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Zt.DISABLED=new Zt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vo{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new vo(0)}static ur(){return new vo(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg="LruGarbageCollector",q1=1048576;function Yg([i,e],[t,s]){const o=Ie(i,t);return o===0?Ie(e,s):o}class K1{constructor(e){this.Tr=e,this.buffer=new gt(Yg),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();Yg(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class G1{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){te(Jg,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Ro(t)?te(Jg,"Ignoring IndexedDB error during garbage collection: ",t):await Ao(t)}await this.Rr(3e5)}))}}class Q1{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return $.resolve(oc.ue);const s=new K1(t);return this.Vr.forEachTarget(e,(o=>s.Er(o.sequenceNumber))).next((()=>this.Vr.gr(e,(o=>s.Er(o))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(te("LruGarbageCollector","Garbage collection skipped; disabled"),$.resolve(Xg)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(te("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Xg):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,o,u,h,m,g,v;const w=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((S=>(S>this.params.maximumSequenceNumbersToCollect?(te("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${S}`),o=this.params.maximumSequenceNumbersToCollect):o=S,h=Date.now(),this.nthSequenceNumber(e,o)))).next((S=>(s=S,m=Date.now(),this.removeTargets(e,s,t)))).next((S=>(u=S,g=Date.now(),this.removeOrphanedDocuments(e,s)))).next((S=>(v=Date.now(),no()<=Ce.DEBUG&&te("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-w}ms
	Determined least recently used ${o} in `+(m-h)+`ms
	Removed ${u} targets in `+(g-m)+`ms
	Removed ${S} documents in `+(v-g)+`ms
Total Duration: ${v-w}ms`),$.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:u,documentsRemoved:S}))))}}function X1(i,e){return new Q1(i,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J1{constructor(){this.changes=new os((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ut.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?$.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y1{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z1{constructor(e,t,s,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=o}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(s=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(s!==null&&Va(s.mutation,o,Fn.empty(),Ke.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,Pe()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=Pe()){const o=Xi();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,s).next((u=>{let h=Aa();return u.forEach(((m,g)=>{h=h.insert(m,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const s=Xi();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,Pe())))}populateOverlays(e,t,s){const o=[];return s.forEach((u=>{t.has(u)||o.push(u)})),this.documentOverlayCache.getOverlays(e,o).next((u=>{u.forEach(((h,m)=>{t.set(h,m)}))}))}computeViews(e,t,s,o){let u=Dr();const h=xa(),m=(function(){return xa()})();return t.forEach(((g,v)=>{const w=s.get(v.key);o.has(v.key)&&(w===void 0||w.mutation instanceof as)?u=u.insert(v.key,v):w!==void 0?(h.set(v.key,w.mutation.getFieldMask()),Va(w.mutation,v,w.mutation.getFieldMask(),Ke.now())):h.set(v.key,Fn.empty())})),this.recalculateAndSaveOverlays(e,u).next((g=>(g.forEach(((v,w)=>h.set(v,w))),t.forEach(((v,w)=>{var S;return m.set(v,new Y1(w,(S=h.get(v))!==null&&S!==void 0?S:null))})),m)))}recalculateAndSaveOverlays(e,t){const s=xa();let o=new et(((h,m)=>h-m)),u=Pe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const m of h)m.keys().forEach((g=>{const v=t.get(g);if(v===null)return;let w=s.get(g)||Fn.empty();w=m.applyToLocalView(v,w),s.set(g,w);const S=(o.get(m.batchId)||Pe()).add(g);o=o.insert(m.batchId,S)}))})).next((()=>{const h=[],m=o.getReverseIterator();for(;m.hasNext();){const g=m.getNext(),v=g.key,w=g.value,S=Q_();w.forEach((P=>{if(!u.has(P)){const j=tv(t.get(P),s.get(P));j!==null&&S.set(P,j),u=u.add(P)}})),h.push(this.documentOverlayCache.saveOverlays(e,v,S))}return $.waitFor(h)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,o){return(function(h){return pe.isDocumentKey(h.path)&&h.collectionGroup===null&&h.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):n1(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,o):this.getDocumentsMatchingCollectionQuery(e,t,s,o)}getNextDocuments(e,t,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,o).next((u=>{const h=o-u.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,o-u.size):$.resolve(Xi());let m=Ma,g=u;return h.next((v=>$.forEach(v,((w,S)=>(m<S.largestBatchId&&(m=S.largestBatchId),u.get(w)?$.resolve():this.remoteDocumentCache.getEntry(e,w).next((P=>{g=g.insert(w,P)}))))).next((()=>this.populateOverlays(e,v,u))).next((()=>this.computeViews(e,g,v,Pe()))).next((w=>({batchId:m,changes:G_(w)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new pe(t)).next((s=>{let o=Aa();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,o){const u=t.collectionGroup;let h=Aa();return this.indexManager.getCollectionParents(e,u).next((m=>$.forEach(m,(g=>{const v=(function(S,P){return new uc(P,null,S.explicitOrderBy.slice(),S.filters.slice(),S.limit,S.limitType,S.startAt,S.endAt)})(t,g.child(u));return this.getDocumentsMatchingCollectionQuery(e,v,s,o).next((w=>{w.forEach(((S,P)=>{h=h.insert(S,P)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,s,o){let u;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((h=>(u=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,u,o)))).next((h=>{u.forEach(((g,v)=>{const w=v.getKey();h.get(w)===null&&(h=h.insert(w,Ut.newInvalidDocument(w)))}));let m=Aa();return h.forEach(((g,v)=>{const w=u.get(g);w!==void 0&&Va(w.mutation,v,Fn.empty(),Ke.now()),hc(t,v)&&(m=m.insert(g,v))})),m}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eA{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return $.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:er(o.createTime)}})(t)),$.resolve()}getNamedQuery(e,t){return $.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(o){return{name:o.name,query:$1(o.bundledQuery),readTime:er(o.readTime)}})(t)),$.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tA{constructor(){this.overlays=new et(pe.comparator),this.kr=new Map}getOverlay(e,t){return $.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Xi();return $.forEach(t,(o=>this.getOverlay(e,o).next((u=>{u!==null&&s.set(o,u)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((o,u)=>{this.wt(e,t,u)})),$.resolve()}removeOverlaysForBatchId(e,t,s){const o=this.kr.get(s);return o!==void 0&&(o.forEach((u=>this.overlays=this.overlays.remove(u))),this.kr.delete(s)),$.resolve()}getOverlaysForCollection(e,t,s){const o=Xi(),u=t.length+1,h=new pe(t.child("")),m=this.overlays.getIteratorFrom(h);for(;m.hasNext();){const g=m.getNext().value,v=g.getKey();if(!t.isPrefixOf(v.path))break;v.path.length===u&&g.largestBatchId>s&&o.set(g.getKey(),g)}return $.resolve(o)}getOverlaysForCollectionGroup(e,t,s,o){let u=new et(((v,w)=>v-w));const h=this.overlays.getIterator();for(;h.hasNext();){const v=h.getNext().value;if(v.getKey().getCollectionGroup()===t&&v.largestBatchId>s){let w=u.get(v.largestBatchId);w===null&&(w=Xi(),u=u.insert(v.largestBatchId,w)),w.set(v.getKey(),v)}}const m=Xi(),g=u.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((v,w)=>m.set(v,w))),!(m.size()>=o)););return $.resolve(m)}wt(e,t,s){const o=this.overlays.get(s.key);if(o!==null){const h=this.kr.get(o.largestBatchId).delete(s.key);this.kr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(s.key,new E1(t,s));let u=this.kr.get(t);u===void 0&&(u=Pe(),this.kr.set(t,u)),this.kr.set(t,u.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nA{constructor(){this.sessionToken=Nt.EMPTY_BYTE_STRING}getSessionToken(e){return $.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,$.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uf{constructor(){this.qr=new gt(Tt.Qr),this.$r=new gt(Tt.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new Tt(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new Tt(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new pe(new Ze([])),s=new Tt(t,e),o=new Tt(t,e+1),u=[];return this.$r.forEachInRange([s,o],(h=>{this.Wr(h),u.push(h.key)})),u}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new pe(new Ze([])),s=new Tt(t,e),o=new Tt(t,e+1);let u=Pe();return this.$r.forEachInRange([s,o],(h=>{u=u.add(h.key)})),u}containsKey(e){const t=new Tt(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Tt{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return pe.comparator(e.key,t.key)||Ie(e.Hr,t.Hr)}static Ur(e,t){return Ie(e.Hr,t.Hr)||pe.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new gt(Tt.Qr)}checkEmpty(e){return $.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,o){const u=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new v1(u,t,s,o);this.mutationQueue.push(h);for(const m of o)this.Yr=this.Yr.add(new Tt(m.key,u)),this.indexManager.addToCollectionParentIndex(e,m.key.path.popLast());return $.resolve(h)}lookupMutationBatch(e,t){return $.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,o=this.Xr(s),u=o<0?0:o;return $.resolve(this.mutationQueue.length>u?this.mutationQueue[u]:null)}getHighestUnacknowledgedBatchId(){return $.resolve(this.mutationQueue.length===0?Yd:this.er-1)}getAllMutationBatches(e){return $.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Tt(t,0),o=new Tt(t,Number.POSITIVE_INFINITY),u=[];return this.Yr.forEachInRange([s,o],(h=>{const m=this.Zr(h.Hr);u.push(m)})),$.resolve(u)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new gt(Ie);return t.forEach((o=>{const u=new Tt(o,0),h=new Tt(o,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([u,h],(m=>{s=s.add(m.Hr)}))})),$.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,o=s.length+1;let u=s;pe.isDocumentKey(u)||(u=u.child(""));const h=new Tt(new pe(u),0);let m=new gt(Ie);return this.Yr.forEachWhile((g=>{const v=g.key.path;return!!s.isPrefixOf(v)&&(v.length===o&&(m=m.add(g.Hr)),!0)}),h),$.resolve(this.ei(m))}ei(e){const t=[];return e.forEach((s=>{const o=this.Zr(s);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){Fe(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return $.forEach(t.mutations,(o=>{const u=new Tt(o.key,t.batchId);return s=s.delete(u),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new Tt(t,0),o=this.Yr.firstAfterOrEqual(s);return $.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,$.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(e){this.ni=e,this.docs=(function(){return new et(pe.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,o=this.docs.get(s),u=o?o.size:0,h=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:h}),this.size+=h-u,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return $.resolve(s?s.document.mutableCopy():Ut.newInvalidDocument(t))}getEntries(e,t){let s=Dr();return t.forEach((o=>{const u=this.docs.get(o);s=s.insert(o,u?u.document.mutableCopy():Ut.newInvalidDocument(o))})),$.resolve(s)}getDocumentsMatchingQuery(e,t,s,o){let u=Dr();const h=t.path,m=new pe(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(m);for(;g.hasNext();){const{key:v,value:{document:w}}=g.getNext();if(!h.isPrefixOf(v.path))break;v.path.length>h.length+1||VS(xS(w),s)<=0||(o.has(w.key)||hc(t,w))&&(u=u.insert(w.key,w.mutableCopy()))}return $.resolve(u)}getAllFromCollectionGroup(e,t,s,o){ge(9500)}ri(e,t){return $.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new sA(this)}getSize(e){return $.resolve(this.size)}}class sA extends J1{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,o)=>{o.isValidDocument()?t.push(this.Or.addEntry(e,o)):this.Or.removeEntry(s)})),$.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oA{constructor(e){this.persistence=e,this.ii=new os((t=>tf(t)),nf),this.lastRemoteSnapshotVersion=ve.min(),this.highestTargetId=0,this.si=0,this.oi=new uf,this.targetCount=0,this._i=vo.ar()}forEachTarget(e,t){return this.ii.forEach(((s,o)=>t(o))),$.resolve()}getLastRemoteSnapshotVersion(e){return $.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return $.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),$.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),$.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new vo(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,$.resolve()}updateTargetData(e,t){return this.hr(t),$.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,$.resolve()}removeTargets(e,t,s){let o=0;const u=[];return this.ii.forEach(((h,m)=>{m.sequenceNumber<=t&&s.get(m.targetId)===null&&(this.ii.delete(h),u.push(this.removeMatchingKeysForTargetId(e,m.targetId)),o++)})),$.waitFor(u).next((()=>o))}getTargetCount(e){return $.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return $.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),$.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const o=this.persistence.referenceDelegate,u=[];return o&&t.forEach((h=>{u.push(o.markPotentiallyOrphaned(e,h))})),$.waitFor(u)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),$.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return $.resolve(s)}containsKey(e,t){return $.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(e,t){this.ai={},this.overlays={},this.ui=new oc(0),this.ci=!1,this.ci=!0,this.li=new nA,this.referenceDelegate=e(this),this.hi=new oA(this),this.indexManager=new H1,this.remoteDocumentCache=(function(o){return new iA(o)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new B1(t),this.Ti=new eA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new tA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new rA(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){te("MemoryPersistence","Starting transaction:",e);const o=new aA(this.ui.next());return this.referenceDelegate.Ii(),s(o).next((u=>this.referenceDelegate.di(o).next((()=>u)))).toPromise().then((u=>(o.raiseOnCommittedEvent(),u)))}Ei(e,t){return $.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class aA extends LS{constructor(e){super(),this.currentSequenceNumber=e}}class cf{constructor(e){this.persistence=e,this.Ai=new uf,this.Ri=null}static Vi(e){return new cf(e)}get mi(){if(this.Ri)return this.Ri;throw ge(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),$.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),$.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),$.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((o=>this.mi.add(o.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((u=>this.mi.add(u.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return $.forEach(this.mi,(s=>{const o=pe.fromPath(s);return this.fi(e,o).next((u=>{u||t.removeEntry(o,ve.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return $.or([()=>$.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Qu{constructor(e,t){this.persistence=e,this.gi=new os((s=>FS(s.path)),((s,o)=>s.isEqual(o))),this.garbageCollector=X1(this,t)}static Vi(e,t){return new Qu(e,t)}Ii(){}di(e){return $.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((o=>s+o))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return $.forEach(this.gi,((s,o)=>this.Sr(e,s,o).next((u=>u?$.resolve():t(o)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const o=this.persistence.getRemoteDocumentCache(),u=o.newChangeBuffer();return o.ri(e,(h=>this.Sr(e,h,t).next((m=>{m||(s++,u.removeEntry(h,ve.min()))})))).next((()=>u.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),$.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),$.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),$.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),$.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Pu(e.data.value)),t}Sr(e,t,s){return $.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.gi.get(t);return $.resolve(o!==void 0&&o>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hf{constructor(e,t,s,o){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=o}static Es(e,t){let s=Pe(),o=Pe();for(const u of t.docChanges)switch(u.type){case 0:s=s.add(u.doc.key);break;case 1:o=o.add(u.doc.key)}return new hf(e,t.fromCache,s,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uA{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return Zw()?8:MS(jt())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,o){const u={result:null};return this.ps(e,t).next((h=>{u.result=h})).next((()=>{if(!u.result)return this.ys(e,t,o,s).next((h=>{u.result=h}))})).next((()=>{if(u.result)return;const h=new lA;return this.ws(e,t,h).next((m=>{if(u.result=m,this.Rs)return this.Ss(e,t,h,m.size)}))})).next((()=>u.result))}Ss(e,t,s,o){return s.documentReadCount<this.Vs?(no()<=Ce.DEBUG&&te("QueryEngine","SDK will not create cache indexes for query:",ro(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),$.resolve()):(no()<=Ce.DEBUG&&te("QueryEngine","Query:",ro(t),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.fs*o?(no()<=Ce.DEBUG&&te("QueryEngine","The SDK decides to create cache indexes for query:",ro(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Zn(t))):$.resolve())}ps(e,t){if(jg(t))return $.resolve(null);let s=Zn(t);return this.indexManager.getIndexType(e,s).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=Id(t,null,"F"),s=Zn(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((u=>{const h=Pe(...u);return this.gs.getDocuments(e,h).next((m=>this.indexManager.getMinOffset(e,s).next((g=>{const v=this.bs(t,m);return this.Ds(t,v,h,g.readTime)?this.ps(e,Id(t,null,"F")):this.vs(e,v,t,g)}))))})))))}ys(e,t,s,o){return jg(t)||o.isEqual(ve.min())?$.resolve(null):this.gs.getDocuments(e,s).next((u=>{const h=this.bs(t,u);return this.Ds(t,h,s,o)?$.resolve(null):(no()<=Ce.DEBUG&&te("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),ro(t)),this.vs(e,h,t,DS(o,Ma)).next((m=>m)))}))}bs(e,t){let s=new gt(q_(e));return t.forEach(((o,u)=>{hc(e,u)&&(s=s.add(u))})),s}Ds(e,t,s,o){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const u=e.limitType==="F"?t.last():t.first();return!!u&&(u.hasPendingWrites||u.version.compareTo(o)>0)}ws(e,t,s){return no()<=Ce.DEBUG&&te("QueryEngine","Using full collection scan to execute query:",ro(t)),this.gs.getDocumentsMatchingQuery(e,t,pi.min(),s)}vs(e,t,s,o){return this.gs.getDocumentsMatchingQuery(e,s,o).next((u=>(t.forEach((h=>{u=u.insert(h.key,h)})),u)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const df="LocalStore",cA=3e8;class hA{constructor(e,t,s,o){this.persistence=e,this.Cs=t,this.serializer=o,this.Fs=new et(Ie),this.Ms=new os((u=>tf(u)),nf),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Z1(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function dA(i,e,t,s){return new hA(i,e,t,s)}async function gv(i,e){const t=Ee(i);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let o;return t.mutationQueue.getAllMutationBatches(s).next((u=>(o=u,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((u=>{const h=[],m=[];let g=Pe();for(const v of o){h.push(v.batchId);for(const w of v.mutations)g=g.add(w.key)}for(const v of u){m.push(v.batchId);for(const w of v.mutations)g=g.add(w.key)}return t.localDocuments.getDocuments(s,g).next((v=>({Bs:v,removedBatchIds:h,addedBatchIds:m})))}))}))}function fA(i,e){const t=Ee(i);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const o=e.batch.keys(),u=t.Os.newChangeBuffer({trackRemovals:!0});return(function(m,g,v,w){const S=v.batch,P=S.keys();let j=$.resolve();return P.forEach((K=>{j=j.next((()=>w.getEntry(g,K))).next((B=>{const z=v.docVersions.get(K);Fe(z!==null,48541),B.version.compareTo(z)<0&&(S.applyToRemoteDocument(B,v),B.isValidDocument()&&(B.setReadTime(v.commitVersion),w.addEntry(B)))}))})),j.next((()=>m.mutationQueue.removeMutationBatch(g,S)))})(t,s,e,u).next((()=>u.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(m){let g=Pe();for(let v=0;v<m.mutationResults.length;++v)m.mutationResults[v].transformResults.length>0&&(g=g.add(m.batch.mutations[v].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(s,o)))}))}function yv(i){const e=Ee(i);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function pA(i,e){const t=Ee(i),s=e.snapshotVersion;let o=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(u=>{const h=t.Os.newChangeBuffer({trackRemovals:!0});o=t.Fs;const m=[];e.targetChanges.forEach(((w,S)=>{const P=o.get(S);if(!P)return;m.push(t.hi.removeMatchingKeys(u,w.removedDocuments,S).next((()=>t.hi.addMatchingKeys(u,w.addedDocuments,S))));let j=P.withSequenceNumber(u.currentSequenceNumber);e.targetMismatches.get(S)!==null?j=j.withResumeToken(Nt.EMPTY_BYTE_STRING,ve.min()).withLastLimboFreeSnapshotVersion(ve.min()):w.resumeToken.approximateByteSize()>0&&(j=j.withResumeToken(w.resumeToken,s)),o=o.insert(S,j),(function(B,z,ue){return B.resumeToken.approximateByteSize()===0||z.snapshotVersion.toMicroseconds()-B.snapshotVersion.toMicroseconds()>=cA?!0:ue.addedDocuments.size+ue.modifiedDocuments.size+ue.removedDocuments.size>0})(P,j,w)&&m.push(t.hi.updateTargetData(u,j))}));let g=Dr(),v=Pe();if(e.documentUpdates.forEach((w=>{e.resolvedLimboDocuments.has(w)&&m.push(t.persistence.referenceDelegate.updateLimboDocument(u,w))})),m.push(mA(u,h,e.documentUpdates).next((w=>{g=w.Ls,v=w.ks}))),!s.isEqual(ve.min())){const w=t.hi.getLastRemoteSnapshotVersion(u).next((S=>t.hi.setTargetsMetadata(u,u.currentSequenceNumber,s)));m.push(w)}return $.waitFor(m).next((()=>h.apply(u))).next((()=>t.localDocuments.getLocalViewOfDocuments(u,g,v))).next((()=>g))})).then((u=>(t.Fs=o,u)))}function mA(i,e,t){let s=Pe(),o=Pe();return t.forEach((u=>s=s.add(u))),e.getEntries(i,s).next((u=>{let h=Dr();return t.forEach(((m,g)=>{const v=u.get(m);g.isFoundDocument()!==v.isFoundDocument()&&(o=o.add(m)),g.isNoDocument()&&g.version.isEqual(ve.min())?(e.removeEntry(m,g.readTime),h=h.insert(m,g)):!v.isValidDocument()||g.version.compareTo(v.version)>0||g.version.compareTo(v.version)===0&&v.hasPendingWrites?(e.addEntry(g),h=h.insert(m,g)):te(df,"Ignoring outdated watch update for ",m,". Current version:",v.version," Watch version:",g.version)})),{Ls:h,ks:o}}))}function gA(i,e){const t=Ee(i);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=Yd),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function yA(i,e){const t=Ee(i);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let o;return t.hi.getTargetData(s,e).next((u=>u?(o=u,$.resolve(o)):t.hi.allocateTargetId(s).next((h=>(o=new li(e,h,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,o).next((()=>o)))))))})).then((s=>{const o=t.Fs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function Pd(i,e,t){const s=Ee(i),o=s.Fs.get(e),u=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",u,(h=>s.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Ro(h))throw h;te(df,`Failed to update sequence numbers for target ${e}: ${h}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(o.target)}function Zg(i,e,t){const s=Ee(i);let o=ve.min(),u=Pe();return s.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,v,w){const S=Ee(g),P=S.Ms.get(w);return P!==void 0?$.resolve(S.Fs.get(P)):S.hi.getTargetData(v,w)})(s,h,Zn(e)).next((m=>{if(m)return o=m.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(h,m.targetId).next((g=>{u=g}))})).next((()=>s.Cs.getDocumentsMatchingQuery(h,e,t?o:ve.min(),t?u:Pe()))).next((m=>(_A(s,i1(e),m),{documents:m,qs:u})))))}function _A(i,e,t){let s=i.xs.get(e)||ve.min();t.forEach(((o,u)=>{u.readTime.compareTo(s)>0&&(s=u.readTime)})),i.xs.set(e,s)}class ey{constructor(){this.activeTargetIds=c1()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class vA{constructor(){this.Fo=new ey,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new ey,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EA{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ty="ConnectivityMonitor";class ny{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){te(ty,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){te(ty,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wu=null;function kd(){return wu===null?wu=(function(){return 268435456+Math.round(2147483648*Math.random())})():wu++,"0x"+wu.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od="RestConnection",wA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class TA{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${o}`,this.Ko=this.databaseId.database===Bu?`project_id=${s}`:`project_id=${s}&database_id=${o}`}Wo(e,t,s,o,u){const h=kd(),m=this.Go(e,t.toUriEncodedString());te(od,`Sending RPC '${e}' ${h}:`,m,s);const g={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(g,o,u);const{host:v}=new URL(m),w=wo(v);return this.jo(e,m,g,s,w).then((S=>(te(od,`Received RPC '${e}' ${h}: `,S),S)),(S=>{throw fi(od,`RPC '${e}' ${h} failed with error: `,S,"url: ",m,"request:",s),S}))}Jo(e,t,s,o,u,h){return this.Wo(e,t,s,o,u)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+So})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,u)=>e[u]=o)),s&&s.headers.forEach(((o,u)=>e[u]=o))}Go(e,t){const s=wA[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IA{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bt="WebChannelConnection";class SA extends TA{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,o,u){const h=kd();return new Promise(((m,g)=>{const v=new E_;v.setWithCredentials(!0),v.listenOnce(w_.COMPLETE,(()=>{try{switch(v.getLastErrorCode()){case Cu.NO_ERROR:const S=v.getResponseJson();te(bt,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(S)),m(S);break;case Cu.TIMEOUT:te(bt,`RPC '${e}' ${h} timed out`),g(new le(G.DEADLINE_EXCEEDED,"Request time out"));break;case Cu.HTTP_ERROR:const P=v.getStatus();if(te(bt,`RPC '${e}' ${h} failed with status:`,P,"response text:",v.getResponseText()),P>0){let j=v.getResponseJson();Array.isArray(j)&&(j=j[0]);const K=j?.error;if(K&&K.status&&K.message){const B=(function(ue){const ce=ue.toLowerCase().replace(/_/g,"-");return Object.values(G).indexOf(ce)>=0?ce:G.UNKNOWN})(K.status);g(new le(B,K.message))}else g(new le(G.UNKNOWN,"Server responded with status "+v.getStatus()))}else g(new le(G.UNAVAILABLE,"Connection failed."));break;default:ge(9055,{c_:e,streamId:h,l_:v.getLastErrorCode(),h_:v.getLastError()})}}finally{te(bt,`RPC '${e}' ${h} completed.`)}}));const w=JSON.stringify(o);te(bt,`RPC '${e}' ${h} sending request:`,o),v.send(t,"POST",w,s,15)}))}P_(e,t,s){const o=kd(),u=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=S_(),m=I_(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},v=this.longPollingOptions.timeoutSeconds;v!==void 0&&(g.longPollingTimeout=Math.round(1e3*v)),this.useFetchStreams&&(g.useFetchStreams=!0),this.zo(g.initMessageHeaders,t,s),g.encodeInitMessageHeaders=!0;const w=u.join("");te(bt,`Creating RPC '${e}' stream ${o}: ${w}`,g);const S=h.createWebChannel(w,g);this.T_(S);let P=!1,j=!1;const K=new IA({Ho:z=>{j?te(bt,`Not sending because RPC '${e}' stream ${o} is closed:`,z):(P||(te(bt,`Opening RPC '${e}' stream ${o} transport.`),S.open(),P=!0),te(bt,`RPC '${e}' stream ${o} sending:`,z),S.send(z))},Yo:()=>S.close()}),B=(z,ue,ce)=>{z.listen(ue,(me=>{try{ce(me)}catch(we){setTimeout((()=>{throw we}),0)}}))};return B(S,Sa.EventType.OPEN,(()=>{j||(te(bt,`RPC '${e}' stream ${o} transport opened.`),K.s_())})),B(S,Sa.EventType.CLOSE,(()=>{j||(j=!0,te(bt,`RPC '${e}' stream ${o} transport closed`),K.__(),this.I_(S))})),B(S,Sa.EventType.ERROR,(z=>{j||(j=!0,fi(bt,`RPC '${e}' stream ${o} transport errored. Name:`,z.name,"Message:",z.message),K.__(new le(G.UNAVAILABLE,"The operation could not be completed")))})),B(S,Sa.EventType.MESSAGE,(z=>{var ue;if(!j){const ce=z.data[0];Fe(!!ce,16349);const me=ce,we=me?.error||((ue=me[0])===null||ue===void 0?void 0:ue.error);if(we){te(bt,`RPC '${e}' stream ${o} received error:`,we);const Ge=we.status;let Re=(function(R){const k=lt[R];if(k!==void 0)return iv(k)})(Ge),D=we.message;Re===void 0&&(Re=G.INTERNAL,D="Unknown error status: "+Ge+" with message "+we.message),j=!0,K.__(new le(Re,D)),S.close()}else te(bt,`RPC '${e}' stream ${o} received:`,ce),K.a_(ce)}})),B(m,T_.STAT_EVENT,(z=>{z.stat===yd.PROXY?te(bt,`RPC '${e}' stream ${o} detected buffering proxy`):z.stat===yd.NOPROXY&&te(bt,`RPC '${e}' stream ${o} detected no buffering proxy`)})),setTimeout((()=>{K.o_()}),0),K}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function ad(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mc(i){return new P1(i,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _v{constructor(e,t,s=1e3,o=1.5,u=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=o,this.A_=u,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-s);o>0&&te("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ry="PersistentStream";class vv{constructor(e,t,s,o,u,h,m,g){this.Fi=e,this.w_=s,this.S_=o,this.connection=u,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=m,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new _v(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===G.RESOURCE_EXHAUSTED?(Nr(t.toString()),Nr("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===G.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,o])=>{this.b_===t&&this.W_(s,o)}),(s=>{e((()=>{const o=new le(G.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(o)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((o=>{s((()=>this.G_(o)))})),this.stream.onMessage((o=>{s((()=>++this.C_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return te(ry,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(te(ry,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class AA extends vv{constructor(e,t,s,o,u,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,o,h),this.serializer=u}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=D1(this.serializer,e),s=(function(u){if(!("targetChange"in u))return ve.min();const h=u.targetChange;return h.targetIds&&h.targetIds.length?ve.min():h.readTime?er(h.readTime):ve.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=Cd(this.serializer),t.addTarget=(function(u,h){let m;const g=h.target;if(m=Td(g)?{documents:O1(u,g)}:{query:L1(u,g).Vt},m.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){m.resumeToken=av(u,h.resumeToken);const v=Sd(u,h.expectedCount);v!==null&&(m.expectedCount=v)}else if(h.snapshotVersion.compareTo(ve.min())>0){m.readTime=Gu(u,h.snapshotVersion.toTimestamp());const v=Sd(u,h.expectedCount);v!==null&&(m.expectedCount=v)}return m})(this.serializer,e);const s=b1(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=Cd(this.serializer),t.removeTarget=e,this.k_(t)}}class RA extends vv{constructor(e,t,s,o,u,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,o,h),this.serializer=u}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Fe(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Fe(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Fe(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=V1(e.writeResults,e.commitTime),s=er(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=Cd(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>x1(this.serializer,s)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CA{}class PA extends CA{constructor(e,t,s,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new le(G.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([u,h])=>this.connection.Wo(e,Ad(t,s),o,u,h))).catch((u=>{throw u.name==="FirebaseError"?(u.code===G.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),u):new le(G.UNKNOWN,u.toString())}))}Jo(e,t,s,o,u){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,m])=>this.connection.Jo(e,Ad(t,s),o,h,m,u))).catch((h=>{throw h.name==="FirebaseError"?(h.code===G.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new le(G.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class kA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Nr(t),this._a=!1):te("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is="RemoteStore";class NA{constructor(e,t,s,o,u){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=u,this.Ea.xo((h=>{s.enqueueAndForget((async()=>{ls(this)&&(te(is,"Restarting streams for network reachability change."),await(async function(g){const v=Ee(g);v.Ia.add(4),await Ya(v),v.Aa.set("Unknown"),v.Ia.delete(4),await gc(v)})(this))}))})),this.Aa=new kA(s,o)}}async function gc(i){if(ls(i))for(const e of i.da)await e(!0)}async function Ya(i){for(const e of i.da)await e(!1)}function Ev(i,e){const t=Ee(i);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),gf(t)?mf(t):Co(t).x_()&&pf(t,e))}function ff(i,e){const t=Ee(i),s=Co(t);t.Ta.delete(e),s.x_()&&wv(t,e),t.Ta.size===0&&(s.x_()?s.B_():ls(t)&&t.Aa.set("Unknown"))}function pf(i,e){if(i.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ve.min())>0){const t=i.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Co(i).H_(e)}function wv(i,e){i.Ra.$e(e),Co(i).Y_(e)}function mf(i){i.Ra=new S1({getRemoteKeysForTarget:e=>i.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>i.Ta.get(e)||null,lt:()=>i.datastore.serializer.databaseId}),Co(i).start(),i.Aa.aa()}function gf(i){return ls(i)&&!Co(i).M_()&&i.Ta.size>0}function ls(i){return Ee(i).Ia.size===0}function Tv(i){i.Ra=void 0}async function DA(i){i.Aa.set("Online")}async function xA(i){i.Ta.forEach(((e,t)=>{pf(i,e)}))}async function VA(i,e){Tv(i),gf(i)?(i.Aa.la(e),mf(i)):i.Aa.set("Unknown")}async function OA(i,e,t){if(i.Aa.set("Online"),e instanceof ov&&e.state===2&&e.cause)try{await(async function(o,u){const h=u.cause;for(const m of u.targetIds)o.Ta.has(m)&&(await o.remoteSyncer.rejectListen(m,h),o.Ta.delete(m),o.Ra.removeTarget(m))})(i,e)}catch(s){te(is,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Xu(i,s)}else if(e instanceof Du?i.Ra.Ye(e):e instanceof sv?i.Ra.it(e):i.Ra.et(e),!t.isEqual(ve.min()))try{const s=await yv(i.localStore);t.compareTo(s)>=0&&await(function(u,h){const m=u.Ra.Pt(h);return m.targetChanges.forEach(((g,v)=>{if(g.resumeToken.approximateByteSize()>0){const w=u.Ta.get(v);w&&u.Ta.set(v,w.withResumeToken(g.resumeToken,h))}})),m.targetMismatches.forEach(((g,v)=>{const w=u.Ta.get(g);if(!w)return;u.Ta.set(g,w.withResumeToken(Nt.EMPTY_BYTE_STRING,w.snapshotVersion)),wv(u,g);const S=new li(w.target,g,v,w.sequenceNumber);pf(u,S)})),u.remoteSyncer.applyRemoteEvent(m)})(i,t)}catch(s){te(is,"Failed to raise snapshot:",s),await Xu(i,s)}}async function Xu(i,e,t){if(!Ro(e))throw e;i.Ia.add(1),await Ya(i),i.Aa.set("Offline"),t||(t=()=>yv(i.localStore)),i.asyncQueue.enqueueRetryable((async()=>{te(is,"Retrying IndexedDB access"),await t(),i.Ia.delete(1),await gc(i)}))}function Iv(i,e){return e().catch((t=>Xu(i,t,e)))}async function yc(i){const e=Ee(i),t=_i(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Yd;for(;LA(e);)try{const o=await gA(e.localStore,s);if(o===null){e.Pa.length===0&&t.B_();break}s=o.batchId,MA(e,o)}catch(o){await Xu(e,o)}Sv(e)&&Av(e)}function LA(i){return ls(i)&&i.Pa.length<10}function MA(i,e){i.Pa.push(e);const t=_i(i);t.x_()&&t.Z_&&t.X_(e.mutations)}function Sv(i){return ls(i)&&!_i(i).M_()&&i.Pa.length>0}function Av(i){_i(i).start()}async function bA(i){_i(i).na()}async function FA(i){const e=_i(i);for(const t of i.Pa)e.X_(t.mutations)}async function UA(i,e,t){const s=i.Pa.shift(),o=of.from(s,e,t);await Iv(i,(()=>i.remoteSyncer.applySuccessfulWrite(o))),await yc(i)}async function jA(i,e){e&&_i(i).Z_&&await(async function(s,o){if((function(h){return T1(h)&&h!==G.ABORTED})(o.code)){const u=s.Pa.shift();_i(s).N_(),await Iv(s,(()=>s.remoteSyncer.rejectFailedWrite(u.batchId,o))),await yc(s)}})(i,e),Sv(i)&&Av(i)}async function iy(i,e){const t=Ee(i);t.asyncQueue.verifyOperationInProgress(),te(is,"RemoteStore received new credentials");const s=ls(t);t.Ia.add(3),await Ya(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await gc(t)}async function zA(i,e){const t=Ee(i);e?(t.Ia.delete(2),await gc(t)):e||(t.Ia.add(2),await Ya(t),t.Aa.set("Unknown"))}function Co(i){return i.Va||(i.Va=(function(t,s,o){const u=Ee(t);return u.ia(),new AA(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)})(i.datastore,i.asyncQueue,{Zo:DA.bind(null,i),e_:xA.bind(null,i),n_:VA.bind(null,i),J_:OA.bind(null,i)}),i.da.push((async e=>{e?(i.Va.N_(),gf(i)?mf(i):i.Aa.set("Unknown")):(await i.Va.stop(),Tv(i))}))),i.Va}function _i(i){return i.ma||(i.ma=(function(t,s,o){const u=Ee(t);return u.ia(),new RA(s,u.connection,u.authCredentials,u.appCheckCredentials,u.serializer,o)})(i.datastore,i.asyncQueue,{Zo:()=>Promise.resolve(),e_:bA.bind(null,i),n_:jA.bind(null,i),ea:FA.bind(null,i),ta:UA.bind(null,i)}),i.da.push((async e=>{e?(i.ma.N_(),await yc(i)):(await i.ma.stop(),i.Pa.length>0&&(te(is,`Stopping write stream with ${i.Pa.length} pending writes`),i.Pa=[]))}))),i.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yf{constructor(e,t,s,o,u){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=o,this.removalCallback=u,this.deferred=new Yi,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,o,u){const h=Date.now()+s,m=new yf(e,t,h,o,u);return m.start(s),m}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new le(G.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function _f(i,e){if(Nr("AsyncQueue",`${e}: ${i}`),Ro(i))return new le(G.UNAVAILABLE,`${e}: ${i}`);throw i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{static emptySet(e){return new co(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||pe.comparator(t.key,s.key):(t,s)=>pe.comparator(t.key,s.key),this.keyedMap=Aa(),this.sortedSet=new et(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof co)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,u=s.getNext().key;if(!o.isEqual(u))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new co;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(){this.fa=new et(pe.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):ge(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Eo{constructor(e,t,s,o,u,h,m,g,v){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=u,this.fromCache=h,this.syncStateChanged=m,this.excludesMetadataChanges=g,this.hasCachedResults=v}static fromInitialDocuments(e,t,s,o,u){const h=[];return t.forEach((m=>{h.push({type:0,doc:m})})),new Eo(e,t,co.emptySet(t),h,s,o,!0,!1,u)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&cc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==s[o].type||!t[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BA{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class $A{constructor(){this.queries=oy(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const o=Ee(t),u=o.queries;o.queries=oy(),u.forEach(((h,m)=>{for(const g of m.wa)g.onError(s)}))})(this,new le(G.ABORTED,"Firestore shutting down"))}}function oy(){return new os((i=>W_(i)),cc)}async function HA(i,e){const t=Ee(i);let s=3;const o=e.query;let u=t.queries.get(o);u?!u.Sa()&&e.ba()&&(s=2):(u=new BA,s=e.ba()?0:1);try{switch(s){case 0:u.ya=await t.onListen(o,!0);break;case 1:u.ya=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const m=_f(h,`Initialization of query '${ro(e.query)}' failed`);return void e.onError(m)}t.queries.set(o,u),u.wa.push(e),e.va(t.onlineState),u.ya&&e.Ca(u.ya)&&vf(t)}async function WA(i,e){const t=Ee(i),s=e.query;let o=3;const u=t.queries.get(s);if(u){const h=u.wa.indexOf(e);h>=0&&(u.wa.splice(h,1),u.wa.length===0?o=e.ba()?0:1:!u.Sa()&&e.ba()&&(o=2))}switch(o){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function qA(i,e){const t=Ee(i);let s=!1;for(const o of e){const u=o.query,h=t.queries.get(u);if(h){for(const m of h.wa)m.Ca(o)&&(s=!0);h.ya=o}}s&&vf(t)}function KA(i,e,t){const s=Ee(i),o=s.queries.get(e);if(o)for(const u of o.wa)u.onError(t);s.queries.delete(e)}function vf(i){i.Da.forEach((e=>{e.next()}))}var Nd,ay;(ay=Nd||(Nd={})).Fa="default",ay.Cache="cache";class GA{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const o of e.docChanges)o.type!==3&&s.push(o);e=new Eo(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Eo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==Nd.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rv{constructor(e){this.key=e}}class Cv{constructor(e){this.key=e}}class QA{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Pe(),this.mutatedKeys=Pe(),this.Xa=q_(e),this.eu=new co(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new sy,o=t?t.eu:this.eu;let u=t?t.mutatedKeys:this.mutatedKeys,h=o,m=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,v=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((w,S)=>{const P=o.get(w),j=hc(this.query,S)?S:null,K=!!P&&this.mutatedKeys.has(P.key),B=!!j&&(j.hasLocalMutations||this.mutatedKeys.has(j.key)&&j.hasCommittedMutations);let z=!1;P&&j?P.data.isEqual(j.data)?K!==B&&(s.track({type:3,doc:j}),z=!0):this.iu(P,j)||(s.track({type:2,doc:j}),z=!0,(g&&this.Xa(j,g)>0||v&&this.Xa(j,v)<0)&&(m=!0)):!P&&j?(s.track({type:0,doc:j}),z=!0):P&&!j&&(s.track({type:1,doc:P}),z=!0,(g||v)&&(m=!0)),z&&(j?(h=h.add(j),u=B?u.add(w):u.delete(w)):(h=h.delete(w),u=u.delete(w)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const w=this.query.limitType==="F"?h.last():h.first();h=h.delete(w.key),u=u.delete(w.key),s.track({type:1,doc:w})}return{eu:h,ru:s,Ds:m,mutatedKeys:u}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,o){const u=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const h=e.ru.pa();h.sort(((w,S)=>(function(j,K){const B=z=>{switch(z){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ge(20277,{At:z})}};return B(j)-B(K)})(w.type,S.type)||this.Xa(w.doc,S.doc))),this.su(s),o=o!=null&&o;const m=t&&!o?this.ou():[],g=this.Za.size===0&&this.current&&!o?1:0,v=g!==this.Ya;return this.Ya=g,h.length!==0||v?{snapshot:new Eo(this.query,e.eu,u,h,e.mutatedKeys,g===0,v,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:m}:{_u:m}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new sy,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Pe(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new Cv(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new Rv(s))})),t}uu(e){this.Ha=e.qs,this.Za=Pe();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Eo.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Ef="SyncEngine";class XA{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class JA{constructor(e){this.key=e,this.lu=!1}}class YA{constructor(e,t,s,o,u,h){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=o,this.currentUser=u,this.maxConcurrentLimboResolutions=h,this.hu={},this.Pu=new os((m=>W_(m)),cc),this.Tu=new Map,this.Iu=new Set,this.du=new et(pe.comparator),this.Eu=new Map,this.Au=new uf,this.Ru={},this.Vu=new Map,this.mu=vo.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function ZA(i,e,t=!0){const s=Vv(i);let o;const u=s.Pu.get(e);return u?(s.sharedClientState.addLocalQueryTarget(u.targetId),o=u.view.cu()):o=await Pv(s,e,t,!0),o}async function eR(i,e){const t=Vv(i);await Pv(t,e,!0,!1)}async function Pv(i,e,t,s){const o=await yA(i.localStore,Zn(e)),u=o.targetId,h=i.sharedClientState.addLocalQueryTarget(u,t);let m;return s&&(m=await tR(i,e,u,h==="current",o.resumeToken)),i.isPrimaryClient&&t&&Ev(i.remoteStore,o),m}async function tR(i,e,t,s,o){i.gu=(S,P,j)=>(async function(B,z,ue,ce){let me=z.view.nu(ue);me.Ds&&(me=await Zg(B.localStore,z.query,!1).then((({documents:D})=>z.view.nu(D,me))));const we=ce&&ce.targetChanges.get(z.targetId),Ge=ce&&ce.targetMismatches.get(z.targetId)!=null,Re=z.view.applyChanges(me,B.isPrimaryClient,we,Ge);return uy(B,z.targetId,Re._u),Re.snapshot})(i,S,P,j);const u=await Zg(i.localStore,e,!0),h=new QA(e,u.qs),m=h.nu(u.documents),g=Ja.createSynthesizedTargetChangeForCurrentChange(t,s&&i.onlineState!=="Offline",o),v=h.applyChanges(m,i.isPrimaryClient,g);uy(i,t,v._u);const w=new XA(e,t,h);return i.Pu.set(e,w),i.Tu.has(t)?i.Tu.get(t).push(e):i.Tu.set(t,[e]),v.snapshot}async function nR(i,e,t){const s=Ee(i),o=s.Pu.get(e),u=s.Tu.get(o.targetId);if(u.length>1)return s.Tu.set(o.targetId,u.filter((h=>!cc(h,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await Pd(s.localStore,o.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(o.targetId),t&&ff(s.remoteStore,o.targetId),Dd(s,o.targetId)})).catch(Ao)):(Dd(s,o.targetId),await Pd(s.localStore,o.targetId,!0))}async function rR(i,e){const t=Ee(i),s=t.Pu.get(e),o=t.Tu.get(s.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),ff(t.remoteStore,s.targetId))}async function iR(i,e,t){const s=hR(i);try{const o=await(function(h,m){const g=Ee(h),v=Ke.now(),w=m.reduce(((j,K)=>j.add(K.key)),Pe());let S,P;return g.persistence.runTransaction("Locally write mutations","readwrite",(j=>{let K=Dr(),B=Pe();return g.Os.getEntries(j,w).next((z=>{K=z,K.forEach(((ue,ce)=>{ce.isValidDocument()||(B=B.add(ue))}))})).next((()=>g.localDocuments.getOverlayedDocuments(j,K))).next((z=>{S=z;const ue=[];for(const ce of m){const me=y1(ce,S.get(ce.key).overlayedDocument);me!=null&&ue.push(new as(ce.key,me,F_(me.value.mapValue),Cr.exists(!0)))}return g.mutationQueue.addMutationBatch(j,v,ue,m)})).next((z=>{P=z;const ue=z.applyToLocalDocumentSet(S,B);return g.documentOverlayCache.saveOverlays(j,z.batchId,ue)}))})).then((()=>({batchId:P.batchId,changes:G_(S)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(o.batchId),(function(h,m,g){let v=h.Ru[h.currentUser.toKey()];v||(v=new et(Ie)),v=v.insert(m,g),h.Ru[h.currentUser.toKey()]=v})(s,o.batchId,t),await Za(s,o.changes),await yc(s.remoteStore)}catch(o){const u=_f(o,"Failed to persist write");t.reject(u)}}async function kv(i,e){const t=Ee(i);try{const s=await pA(t.localStore,e);e.targetChanges.forEach(((o,u)=>{const h=t.Eu.get(u);h&&(Fe(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.lu=!0:o.modifiedDocuments.size>0?Fe(h.lu,14607):o.removedDocuments.size>0&&(Fe(h.lu,42227),h.lu=!1))})),await Za(t,s,e)}catch(s){await Ao(s)}}function ly(i,e,t){const s=Ee(i);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const o=[];s.Pu.forEach(((u,h)=>{const m=h.view.va(e);m.snapshot&&o.push(m.snapshot)})),(function(h,m){const g=Ee(h);g.onlineState=m;let v=!1;g.queries.forEach(((w,S)=>{for(const P of S.wa)P.va(m)&&(v=!0)})),v&&vf(g)})(s.eventManager,e),o.length&&s.hu.J_(o),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function sR(i,e,t){const s=Ee(i);s.sharedClientState.updateQueryState(e,"rejected",t);const o=s.Eu.get(e),u=o&&o.key;if(u){let h=new et(pe.comparator);h=h.insert(u,Ut.newNoDocument(u,ve.min()));const m=Pe().add(u),g=new pc(ve.min(),new Map,new et(Ie),h,m);await kv(s,g),s.du=s.du.remove(u),s.Eu.delete(e),wf(s)}else await Pd(s.localStore,e,!1).then((()=>Dd(s,e,t))).catch(Ao)}async function oR(i,e){const t=Ee(i),s=e.batch.batchId;try{const o=await fA(t.localStore,e);Dv(t,s,null),Nv(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Za(t,o)}catch(o){await Ao(o)}}async function aR(i,e,t){const s=Ee(i);try{const o=await(function(h,m){const g=Ee(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(v=>{let w;return g.mutationQueue.lookupMutationBatch(v,m).next((S=>(Fe(S!==null,37113),w=S.keys(),g.mutationQueue.removeMutationBatch(v,S)))).next((()=>g.mutationQueue.performConsistencyCheck(v))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(v,w,m))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(v,w))).next((()=>g.localDocuments.getDocuments(v,w)))}))})(s.localStore,e);Dv(s,e,t),Nv(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Za(s,o)}catch(o){await Ao(o)}}function Nv(i,e){(i.Vu.get(e)||[]).forEach((t=>{t.resolve()})),i.Vu.delete(e)}function Dv(i,e,t){const s=Ee(i);let o=s.Ru[s.currentUser.toKey()];if(o){const u=o.get(e);u&&(t?u.reject(t):u.resolve(),o=o.remove(e)),s.Ru[s.currentUser.toKey()]=o}}function Dd(i,e,t=null){i.sharedClientState.removeLocalQueryTarget(e);for(const s of i.Tu.get(e))i.Pu.delete(s),t&&i.hu.pu(s,t);i.Tu.delete(e),i.isPrimaryClient&&i.Au.zr(e).forEach((s=>{i.Au.containsKey(s)||xv(i,s)}))}function xv(i,e){i.Iu.delete(e.path.canonicalString());const t=i.du.get(e);t!==null&&(ff(i.remoteStore,t),i.du=i.du.remove(e),i.Eu.delete(t),wf(i))}function uy(i,e,t){for(const s of t)s instanceof Rv?(i.Au.addReference(s.key,e),lR(i,s)):s instanceof Cv?(te(Ef,"Document no longer in limbo: "+s.key),i.Au.removeReference(s.key,e),i.Au.containsKey(s.key)||xv(i,s.key)):ge(19791,{yu:s})}function lR(i,e){const t=e.key,s=t.path.canonicalString();i.du.get(t)||i.Iu.has(s)||(te(Ef,"New document in limbo: "+t),i.Iu.add(s),wf(i))}function wf(i){for(;i.Iu.size>0&&i.du.size<i.maxConcurrentLimboResolutions;){const e=i.Iu.values().next().value;i.Iu.delete(e);const t=new pe(Ze.fromString(e)),s=i.mu.next();i.Eu.set(s,new JA(t)),i.du=i.du.insert(t,s),Ev(i.remoteStore,new li(Zn(rf(t.path)),s,"TargetPurposeLimboResolution",oc.ue))}}async function Za(i,e,t){const s=Ee(i),o=[],u=[],h=[];s.Pu.isEmpty()||(s.Pu.forEach(((m,g)=>{h.push(s.gu(g,e,t).then((v=>{var w;if((v||t)&&s.isPrimaryClient){const S=v?!v.fromCache:(w=t?.targetChanges.get(g.targetId))===null||w===void 0?void 0:w.current;s.sharedClientState.updateQueryState(g.targetId,S?"current":"not-current")}if(v){o.push(v);const S=hf.Es(g.targetId,v);u.push(S)}})))})),await Promise.all(h),s.hu.J_(o),await(async function(g,v){const w=Ee(g);try{await w.persistence.runTransaction("notifyLocalViewChanges","readwrite",(S=>$.forEach(v,(P=>$.forEach(P.Is,(j=>w.persistence.referenceDelegate.addReference(S,P.targetId,j))).next((()=>$.forEach(P.ds,(j=>w.persistence.referenceDelegate.removeReference(S,P.targetId,j)))))))))}catch(S){if(!Ro(S))throw S;te(df,"Failed to update sequence numbers: "+S)}for(const S of v){const P=S.targetId;if(!S.fromCache){const j=w.Fs.get(P),K=j.snapshotVersion,B=j.withLastLimboFreeSnapshotVersion(K);w.Fs=w.Fs.insert(P,B)}}})(s.localStore,u))}async function uR(i,e){const t=Ee(i);if(!t.currentUser.isEqual(e)){te(Ef,"User change. New user:",e.toKey());const s=await gv(t.localStore,e);t.currentUser=e,(function(u,h){u.Vu.forEach((m=>{m.forEach((g=>{g.reject(new le(G.CANCELLED,h))}))})),u.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Za(t,s.Bs)}}function cR(i,e){const t=Ee(i),s=t.Eu.get(e);if(s&&s.lu)return Pe().add(s.key);{let o=Pe();const u=t.Tu.get(e);if(!u)return o;for(const h of u){const m=t.Pu.get(h);o=o.unionWith(m.view.tu)}return o}}function Vv(i){const e=Ee(i);return e.remoteStore.remoteSyncer.applyRemoteEvent=kv.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=cR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=sR.bind(null,e),e.hu.J_=qA.bind(null,e.eventManager),e.hu.pu=KA.bind(null,e.eventManager),e}function hR(i){const e=Ee(i);return e.remoteStore.remoteSyncer.applySuccessfulWrite=oR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=aR.bind(null,e),e}class Ju{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=mc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return dA(this.persistence,new uA,e.initialUser,this.serializer)}Du(e){return new mv(cf.Vi,this.serializer)}bu(e){return new vA}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ju.provider={build:()=>new Ju};class dR extends Ju{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Fe(this.persistence.referenceDelegate instanceof Qu,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new G1(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Zt.withCacheSize(this.cacheSizeBytes):Zt.DEFAULT;return new mv((s=>Qu.Vi(s,t)),this.serializer)}}class xd{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>ly(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=uR.bind(null,this.syncEngine),await zA(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new $A})()}createDatastore(e){const t=mc(e.databaseInfo.databaseId),s=(function(u){return new SA(u)})(e.databaseInfo);return(function(u,h,m,g){return new PA(u,h,m,g)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,o,u,h,m){return new NA(s,o,u,h,m)})(this.localStore,this.datastore,e.asyncQueue,(t=>ly(this.syncEngine,t,0)),(function(){return ny.C()?new ny:new EA})())}createSyncEngine(e,t){return(function(o,u,h,m,g,v,w){const S=new YA(o,u,h,m,g,v);return w&&(S.fu=!0),S})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const u=Ee(o);te(is,"RemoteStore shutting down."),u.Ia.add(5),await Ya(u),u.Ea.shutdown(),u.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}xd.provider={build:()=>new xd};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fR{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Nr("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vi="FirestoreClient";class pR{constructor(e,t,s,o,u){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=o,this.user=Ft.UNAUTHENTICATED,this.clientId=Xd.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=u,this.authCredentials.start(s,(async h=>{te(vi,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(s,(h=>(te(vi,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Yi;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=_f(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function ld(i,e){i.asyncQueue.verifyOperationInProgress(),te(vi,"Initializing OfflineComponentProvider");const t=i.configuration;await e.initialize(t);let s=t.initialUser;i.setCredentialChangeListener((async o=>{s.isEqual(o)||(await gv(e.localStore,o),s=o)})),e.persistence.setDatabaseDeletedListener((()=>{fi("Terminating Firestore due to IndexedDb database deletion"),i.terminate().then((()=>{te("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((o=>{fi("Terminating Firestore due to IndexedDb database deletion failed",o)}))})),i._offlineComponents=e}async function cy(i,e){i.asyncQueue.verifyOperationInProgress();const t=await mR(i);te(vi,"Initializing OnlineComponentProvider"),await e.initialize(t,i.configuration),i.setCredentialChangeListener((s=>iy(e.remoteStore,s))),i.setAppCheckTokenChangeListener(((s,o)=>iy(e.remoteStore,o))),i._onlineComponents=e}async function mR(i){if(!i._offlineComponents)if(i._uninitializedComponentsProvider){te(vi,"Using user provided OfflineComponentProvider");try{await ld(i,i._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===G.FAILED_PRECONDITION||o.code===G.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;fi("Error using user provided cache. Falling back to memory cache: "+t),await ld(i,new Ju)}}else te(vi,"Using default OfflineComponentProvider"),await ld(i,new dR(void 0));return i._offlineComponents}async function Ov(i){return i._onlineComponents||(i._uninitializedComponentsProvider?(te(vi,"Using user provided OnlineComponentProvider"),await cy(i,i._uninitializedComponentsProvider._online)):(te(vi,"Using default OnlineComponentProvider"),await cy(i,new xd))),i._onlineComponents}function gR(i){return Ov(i).then((e=>e.syncEngine))}async function hy(i){const e=await Ov(i),t=e.eventManager;return t.onListen=ZA.bind(null,e.syncEngine),t.onUnlisten=nR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=eR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=rR.bind(null,e.syncEngine),t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lv(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dy=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mv="firestore.googleapis.com",fy=!0;class py{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new le(G.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Mv,this.ssl=fy}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:fy;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=pv;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<q1)throw new le(G.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}NS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lv((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(u){if(u.timeoutSeconds!==void 0){if(isNaN(u.timeoutSeconds))throw new le(G.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (must not be NaN)`);if(u.timeoutSeconds<5)throw new le(G.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (minimum allowed value is 5)`);if(u.timeoutSeconds>30)throw new le(G.INVALID_ARGUMENT,`invalid long polling timeout: ${u.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,o){return s.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Tf{constructor(e,t,s,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new py({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new le(G.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new le(G.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new py(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new ES;switch(s.type){case"firstParty":return new SS(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new le(G.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=dy.get(t);s&&(te("ComponentProvider","Removing Datastore"),dy.delete(t),s.terminate())})(this),Promise.resolve()}}function yR(i,e,t,s={}){var o;i=uo(i,Tf);const u=wo(e),h=i._getSettings(),m=Object.assign(Object.assign({},h),{emulatorOptions:i._getEmulatorOptions()}),g=`${e}:${t}`;u&&(Ly(`https://${g}`),My("Firestore",!0)),h.host!==Mv&&h.host!==g&&fi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const v=Object.assign(Object.assign({},h),{host:g,ssl:u,emulatorOptions:s});if(!es(v,m)&&(i._setSettings(v),s.mockUserToken)){let w,S;if(typeof s.mockUserToken=="string")w=s.mockUserToken,S=Ft.MOCK_USER;else{w=Hw(s.mockUserToken,(o=i._app)===null||o===void 0?void 0:o.options.projectId);const P=s.mockUserToken.sub||s.mockUserToken.user_id;if(!P)throw new le(G.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");S=new Ft(P)}i._authCredentials=new wS(new R_(w,S))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new _c(this.firestore,e,this._query)}}class It{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ba(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new It(this.firestore,e,this._key)}toJSON(){return{type:It._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(Qa(t,It._jsonSchema))return new It(e,s||null,new pe(Ze.fromString(t.referencePath)))}}It._jsonSchemaVersion="firestore/documentReference/1.0",It._jsonSchema={type:ut("string",It._jsonSchemaVersion),referencePath:ut("string")};class Ba extends _c{constructor(e,t,s){super(e,t,rf(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new It(this.firestore,null,new pe(e))}withConverter(e){return new Ba(this.firestore,e,this._path)}}function _R(i,e,...t){if(i=ln(i),arguments.length===1&&(e=Xd.newId()),kS("doc","path",e),i instanceof Tf){const s=Ze.fromString(e,...t);return Cg(s),new It(i,null,new pe(s))}{if(!(i instanceof It||i instanceof Ba))throw new le(G.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=i._path.child(Ze.fromString(e,...t));return Cg(s),new It(i.firestore,i instanceof Ba?i.converter:null,new pe(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const my="AsyncQueue";class gy{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new _v(this,"async_queue_retry"),this.oc=()=>{const s=ad();s&&te(my,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=ad();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=ad();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Yi;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Ro(e))throw e;te(my,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,Nr("INTERNAL UNHANDLED ERROR: ",yy(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=yf.createAndSchedule(this,e,t,s,(u=>this.lc(u)));return this.ec.push(o),o}ac(){this.tc&&ge(47125,{hc:yy(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function yy(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _y(i){return(function(t,s){if(typeof t!="object"||t===null)return!1;const o=t;for(const u of s)if(u in o&&typeof o[u]=="function")return!0;return!1})(i,["next","error","complete"])}class Yu extends Tf{constructor(e,t,s,o){super(e,t,s,o),this.type="firestore",this._queue=new gy,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new gy(e),this._firestoreClient=void 0,await e}}}function vR(i,e){const t=typeof i=="object"?i:jy(),s=typeof i=="string"?i:Bu,o=bd(t,"firestore").getImmediate({identifier:s});if(!o._initialized){const u=Bw("firestore");u&&yR(o,...u)}return o}function bv(i){if(i._terminated)throw new le(G.FAILED_PRECONDITION,"The client has already been terminated.");return i._firestoreClient||ER(i),i._firestoreClient}function ER(i){var e,t,s;const o=i._freezeSettings(),u=(function(m,g,v,w){return new zS(m,g,v,w.host,w.ssl,w.experimentalForceLongPolling,w.experimentalAutoDetectLongPolling,Lv(w.experimentalLongPollingOptions),w.useFetchStreams,w.isUsingEmulator)})(i._databaseId,((e=i._app)===null||e===void 0?void 0:e.options.appId)||"",i._persistenceKey,o);i._componentsProvider||!((t=o.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=o.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(i._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),i._firestoreClient=new pR(i._authCredentials,i._appCheckCredentials,i._queue,u,i._componentsProvider&&(function(m){const g=m?._online.build();return{_offline:m?._offline.build(g),_online:g}})(i._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e){this._byteString=e}static fromBase64String(e){try{return new En(Nt.fromBase64String(e))}catch(t){throw new le(G.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new En(Nt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:En._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Qa(e,En._jsonSchema))return En.fromBase64String(e.bytes)}}En._jsonSchemaVersion="firestore/bytes/1.0",En._jsonSchema={type:ut("string",En._jsonSchemaVersion),bytes:ut("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class If{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new le(G.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new kt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new le(G.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new le(G.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ie(this._lat,e._lat)||Ie(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:tr._jsonSchemaVersion}}static fromJSON(e){if(Qa(e,tr._jsonSchema))return new tr(e.latitude,e.longitude)}}tr._jsonSchemaVersion="firestore/geoPoint/1.0",tr._jsonSchema={type:ut("string",tr._jsonSchemaVersion),latitude:ut("number"),longitude:ut("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,o){if(s.length!==o.length)return!1;for(let u=0;u<s.length;++u)if(s[u]!==o[u])return!1;return!0})(this._values,e._values)}toJSON(){return{type:nr._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Qa(e,nr._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new nr(e.vectorValues);throw new le(G.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}nr._jsonSchemaVersion="firestore/vectorValue/1.0",nr._jsonSchema={type:ut("string",nr._jsonSchemaVersion),vectorValues:ut("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wR=/^__.*__$/;class TR{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new as(e,this.data,this.fieldMask,t,this.fieldTransforms):new Xa(e,this.data,t,this.fieldTransforms)}}function Uv(i){switch(i){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ge(40011,{Ec:i})}}class Sf{constructor(e,t,s,o,u,h){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=o,u===void 0&&this.Ac(),this.fieldTransforms=u||[],this.fieldMask=h||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Sf(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.fc(e),o}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.Ac(),o}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Zu(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(Uv(this.Ec)&&wR.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class IR{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||mc(e)}Dc(e,t,s,o=!1){return new Sf({Ec:e,methodName:t,bc:s,path:kt.emptyPath(),mc:!1,Sc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function SR(i){const e=i._freezeSettings(),t=mc(i._databaseId);return new IR(i._databaseId,!!e.ignoreUndefinedProperties,t)}function AR(i,e,t,s,o,u={}){const h=i.Dc(u.merge||u.mergeFields?2:0,e,t,o);$v("Data must be an object, but it was:",h,s);const m=zv(s,h);let g,v;if(u.merge)g=new Fn(h.fieldMask),v=h.fieldTransforms;else if(u.mergeFields){const w=[];for(const S of u.mergeFields){const P=RR(e,S,t);if(!h.contains(P))throw new le(G.INVALID_ARGUMENT,`Field '${P}' is specified in your field mask but missing from your input data.`);PR(w,P)||w.push(P)}g=new Fn(w),v=h.fieldTransforms.filter((S=>g.covers(S.field)))}else g=null,v=h.fieldTransforms;return new TR(new vn(m),g,v)}function jv(i,e){if(Bv(i=ln(i)))return $v("Unsupported field value:",e,i),zv(i,e);if(i instanceof Fv)return(function(s,o){if(!Uv(o.Ec))throw o.wc(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.wc(`${s._methodName}() is not currently supported inside arrays`);const u=s._toFieldTransform(o);u&&o.fieldTransforms.push(u)})(i,e),null;if(i===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),i instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,o){const u=[];let h=0;for(const m of s){let g=jv(m,o.yc(h));g==null&&(g={nullValue:"NULL_VALUE"}),u.push(g),h++}return{arrayValue:{values:u}}})(i,e)}return(function(s,o){if((s=ln(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return h1(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const u=Ke.fromDate(s);return{timestampValue:Gu(o.serializer,u)}}if(s instanceof Ke){const u=new Ke(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Gu(o.serializer,u)}}if(s instanceof tr)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof En)return{bytesValue:av(o.serializer,s._byteString)};if(s instanceof It){const u=o.databaseId,h=s.firestore._databaseId;if(!h.isEqual(u))throw o.wc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${u.projectId}/${u.database}`);return{referenceValue:lf(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof nr)return(function(h,m){return{mapValue:{fields:{[M_]:{stringValue:b_},[$u]:{arrayValue:{values:h.toArray().map((v=>{if(typeof v!="number")throw m.wc("VectorValues must only contain numeric values.");return sf(m.serializer,v)}))}}}}}})(s,o);throw o.wc(`Unsupported field value: ${Jd(s)}`)})(i,e)}function zv(i,e){const t={};return N_(i)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ss(i,((s,o)=>{const u=jv(o,e.Vc(s));u!=null&&(t[s]=u)})),{mapValue:{fields:t}}}function Bv(i){return!(typeof i!="object"||i===null||i instanceof Array||i instanceof Date||i instanceof Ke||i instanceof tr||i instanceof En||i instanceof It||i instanceof Fv||i instanceof nr)}function $v(i,e,t){if(!Bv(t)||!P_(t)){const s=Jd(t);throw s==="an object"?e.wc(i+" a custom object"):e.wc(i+" "+s)}}function RR(i,e,t){if((e=ln(e))instanceof If)return e._internalPath;if(typeof e=="string")return Hv(i,e);throw Zu("Field path arguments must be of type string or ",i,!1,void 0,t)}const CR=new RegExp("[~\\*/\\[\\]]");function Hv(i,e,t){if(e.search(CR)>=0)throw Zu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i,!1,void 0,t);try{return new If(...e.split("."))._internalPath}catch{throw Zu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i,!1,void 0,t)}}function Zu(i,e,t,s,o){const u=s&&!s.isEmpty(),h=o!==void 0;let m=`Function ${e}() called with invalid data`;t&&(m+=" (via `toFirestore()`)"),m+=". ";let g="";return(u||h)&&(g+=" (found",u&&(g+=` in field ${s}`),h&&(g+=` in document ${o}`),g+=")"),new le(G.INVALID_ARGUMENT,m+i+g)}function PR(i,e){return i.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wv{constructor(e,t,s,o,u){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=o,this._converter=u}get id(){return this._key.path.lastSegment()}get ref(){return new It(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new kR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(qv("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class kR extends Wv{data(){return super.data()}}function qv(i,e){return typeof e=="string"?Hv(i,e):e instanceof If?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NR(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new le(G.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class DR{convertValue(e,t="none"){switch(yi(e)){case 0:return null;case 1:return e.booleanValue;case 2:return st(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(gi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw ge(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return ss(e,((o,u)=>{s[o]=this.convertValue(u,t)})),s}convertVectorValue(e){var t,s,o;const u=(o=(s=(t=e.fields)===null||t===void 0?void 0:t[$u].arrayValue)===null||s===void 0?void 0:s.values)===null||o===void 0?void 0:o.map((h=>st(h.doubleValue)));return new nr(u)}convertGeoPoint(e){return new tr(st(e.latitude),st(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=lc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(ba(e));default:return null}}convertTimestamp(e){const t=mi(e);return new Ke(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=Ze.fromString(e);Fe(fv(s),9688,{name:e});const o=new Fa(s.get(1),s.get(3)),u=new pe(s.popFirst(5));return o.isEqual(t)||Nr(`Document ${u} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xR(i,e,t){let s;return s=i?t&&(t.merge||t.mergeFields)?i.toFirestore(e,t):i.toFirestore(e):e,s}class Ca{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Zi extends Wv{constructor(e,t,s,o,u,h){super(e,t,s,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=u}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new xu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(qv("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new le(G.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Zi._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Zi._jsonSchemaVersion="firestore/documentSnapshot/1.0",Zi._jsonSchema={type:ut("string",Zi._jsonSchemaVersion),bundleSource:ut("string","DocumentSnapshot"),bundleName:ut("string"),bundle:ut("string")};class xu extends Zi{data(e={}){return super.data(e)}}class ho{constructor(e,t,s,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Ca(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new xu(this._firestore,this._userDataWriter,s.key,s,new Ca(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new le(G.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,u){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((m=>{const g=new xu(o._firestore,o._userDataWriter,m.doc.key,m.doc,new Ca(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);return m.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((m=>u||m.type!==3)).map((m=>{const g=new xu(o._firestore,o._userDataWriter,m.doc.key,m.doc,new Ca(o._snapshot.mutatedKeys.has(m.doc.key),o._snapshot.fromCache),o.query.converter);let v=-1,w=-1;return m.type!==0&&(v=h.indexOf(m.doc.key),h=h.delete(m.doc.key)),m.type!==1&&(h=h.add(m.doc),w=h.indexOf(m.doc.key)),{type:VR(m.type),doc:g,oldIndex:v,newIndex:w}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new le(G.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ho._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Xd.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],o=[];return this.docs.forEach((u=>{u._document!==null&&(t.push(u._document),s.push(this._userDataWriter.convertObjectMap(u._document.data.value.mapValue.fields,"previous")),o.push(u.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function VR(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ge(61501,{type:i})}}ho._jsonSchemaVersion="firestore/querySnapshot/1.0",ho._jsonSchema={type:ut("string",ho._jsonSchemaVersion),bundleSource:ut("string","QuerySnapshot"),bundleName:ut("string"),bundle:ut("string")};class Kv extends DR{constructor(e){super(),this.firestore=e}convertBytes(e){return new En(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new It(this.firestore,null,t)}}function OR(i,e,t){i=uo(i,It);const s=uo(i.firestore,Yu),o=xR(i.converter,e,t);return MR(s,[AR(SR(s),"setDoc",i._key,o,i.converter!==null,t).toMutation(i._key,Cr.none())])}function LR(i,...e){var t,s,o;i=ln(i);let u={includeMetadataChanges:!1,source:"default"},h=0;typeof e[h]!="object"||_y(e[h])||(u=e[h++]);const m={includeMetadataChanges:u.includeMetadataChanges,source:u.source};if(_y(e[h])){const S=e[h];e[h]=(t=S.next)===null||t===void 0?void 0:t.bind(S),e[h+1]=(s=S.error)===null||s===void 0?void 0:s.bind(S),e[h+2]=(o=S.complete)===null||o===void 0?void 0:o.bind(S)}let g,v,w;if(i instanceof It)v=uo(i.firestore,Yu),w=rf(i._key.path),g={next:S=>{e[h]&&e[h](bR(v,i,S))},error:e[h+1],complete:e[h+2]};else{const S=uo(i,_c);v=uo(S.firestore,Yu),w=S._query;const P=new Kv(v);g={next:j=>{e[h]&&e[h](new ho(v,P,S,j))},error:e[h+1],complete:e[h+2]},NR(i._query)}return(function(P,j,K,B){const z=new fR(B),ue=new GA(j,z,K);return P.asyncQueue.enqueueAndForget((async()=>HA(await hy(P),ue))),()=>{z.Ou(),P.asyncQueue.enqueueAndForget((async()=>WA(await hy(P),ue)))}})(bv(v),w,m,g)}function MR(i,e){return(function(s,o){const u=new Yi;return s.asyncQueue.enqueueAndForget((async()=>iR(await gR(s),o,u))),u.promise})(bv(i),e)}function bR(i,e,t){const s=t.docs.get(e._key),o=new Kv(i);return new Zi(i,o,e._key,s,new Ca(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(o){So=o})(To),po(new ts("firestore",((s,{instanceIdentifier:o,options:u})=>{const h=s.getProvider("app").getImmediate(),m=new Yu(new TS(s.getProvider("auth-internal")),new AS(h,s.getProvider("app-check-internal")),(function(v,w){if(!Object.prototype.hasOwnProperty.apply(v.options,["projectId"]))throw new le(G.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Fa(v.options.projectId,w)})(h,o),h);return u=Object.assign({useFetchStreams:t},u),m._setSettings(u),m}),"PUBLIC").setMultipleInstances(!0)),hi(Tg,Ig,e),hi(Tg,Ig,"esm2017")})();const FR={apiKey:void 0,authDomain:void 0,projectId:void 0,storageBucket:void 0,messagingSenderId:void 0,appId:void 0},Gv=Uy(FR),fo=_S(Gv),UR=vR(Gv),jR=new Sr;async function zR(){return await CI(fo,jR)}async function BR(){return await aI(fo)}function $R(i){return oI(fo,i)}function HR({user:i}){const[e,t]=Oe.useState(null);return Oe.useEffect(()=>{if(!i)return;const s=_R(UR,`users/${i.uid}/dashboard_stats/metrics`),o=LR(s,async u=>{if(!u.exists()){await OR(s,{totalEnrollment:0,groupCount:0,atRisk:0,advancing:0,onTrack:0},{merge:!0});return}t(u.data())});return()=>o()},[i]),J.jsxs("div",{children:[J.jsxs("h2",{style:{fontSize:28,fontWeight:900,marginBottom:10},children:["👋 Welcome back",i?`, ${i.displayName||""}`:""]}),J.jsx("p",{style:{color:"#94a3b8",marginBottom:20},children:"Status: US/Eastern • Google Sign-In only"}),!i&&J.jsx("p",{children:"Please sign in to load dashboard."}),i&&J.jsxs("div",{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(4, minmax(0,1fr))"},children:[J.jsx(Tu,{title:"Total Enrollment",value:e?.totalEnrollment??0}),J.jsx(Tu,{title:"Active Groups",value:e?.groupCount??0}),J.jsx(Tu,{title:"At-Risk",value:e?.atRisk??0}),J.jsx(Tu,{title:"On-Track",value:e?.onTrack??0})]})]})}function Tu({title:i,value:e}){return J.jsxs("div",{style:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:16},children:[J.jsx("div",{style:{color:"#a78bfa",fontWeight:700,marginBottom:8},children:i}),J.jsx("div",{style:{fontSize:40,fontWeight:900},children:e})]})}function WR({user:i}){const e=Oe.useRef(null),[t,s]=Oe.useState(""),[o,u]=Oe.useState(null),[h,m]=Oe.useState(null),[g,v]=Oe.useState(1),[w,S]=Oe.useState("Q1");async function P(){if(!i)return alert("Sign in first");const B=e.current?.files?.[0];if(!B)return alert("Choose a file");const z=await fo.currentUser?.getIdToken(),ue=new FormData;ue.append("file",B);const ce=await fetch(`/api/uploadRoster?period=${g}&quarter=${w}`,{method:"POST",headers:{Authorization:"Bearer "+z},body:ue}),me=await ce.json();if(!ce.ok)return alert(me.error||"Upload failed");s(me.uploadId)}async function j(){if(!t)return alert("Upload first");const B=await fo.currentUser?.getIdToken(),z=await fetch("/api/processRoster",{method:"POST",headers:{Authorization:"Bearer "+B,"Content-Type":"application/json"},body:JSON.stringify({uploadId:t,mode:"preview"})}),ue=await z.json();if(!z.ok)return alert(ue.error||"Preview failed");u(ue)}async function K(){const B=await fo.currentUser?.getIdToken(),z=await fetch("/api/processRoster",{method:"POST",headers:{Authorization:"Bearer "+B,"Content-Type":"application/json"},body:JSON.stringify({uploadId:t,mode:"commit"})}),ue=await z.json();if(!z.ok)return alert(ue.error||"Commit failed");m(ue)}return J.jsxs("div",{children:[J.jsx("h2",{style:{fontSize:28,fontWeight:900,marginBottom:16},children:"Roster Import"}),!i&&J.jsx("p",{children:"Please sign in to manage roster."}),i&&J.jsxs("div",{style:{display:"grid",gap:16},children:[J.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[J.jsx("input",{ref:e,type:"file",accept:".csv,.xlsx,.xls,.pdf,.docx"}),J.jsx("select",{value:g,onChange:B=>v(Number(B.target.value)),children:[1,2,3,4,5,6,7,8].map(B=>J.jsxs("option",{value:B,children:["Period ",B]},B))}),J.jsx("select",{value:w,onChange:B=>S(B.target.value),children:["Q1","Q2","Q3","Q4"].map(B=>J.jsx("option",{value:B,children:B},B))}),J.jsx("button",{onClick:P,children:"Upload"}),J.jsx("button",{onClick:j,disabled:!t,children:"Preview"}),J.jsx("button",{onClick:K,disabled:!t,children:"Commit"})]}),o&&J.jsxs("div",{style:{padding:12,border:"1px solid #334155",borderRadius:12},children:[J.jsxs("div",{children:[J.jsx("b",{children:"Total:"})," ",o.stats.total," • ",J.jsx("b",{children:"OK:"})," ",o.stats.ok," • ",J.jsx("b",{children:"Needs review:"})," ",o.stats.needs_review]}),J.jsxs("details",{style:{marginTop:8},children:[J.jsx("summary",{children:"See first 20 rows"}),J.jsx("pre",{style:{whiteSpace:"pre-wrap"},children:JSON.stringify(o.rows.slice(0,20),null,2)})]})]}),h&&J.jsxs("div",{style:{padding:12,border:"1px solid #334155",borderRadius:12},children:[J.jsxs("div",{children:[J.jsx("b",{children:"Written:"})," ",h.written," • ",J.jsx("b",{children:"Skipped:"})," ",h.skipped]}),J.jsxs("div",{children:[J.jsx("b",{children:"Collection:"})," ",h.collection]})]})]})]})}function qR({user:i}){return J.jsxs("div",{children:[J.jsx("h2",{style:{fontSize:28,fontWeight:900,marginBottom:10},children:"Assignments"}),J.jsx("p",{children:"Assignment generator will be added after deployment keys are set. (No placeholder content is stored.)"})]})}const KR=[{code:"MA.7.AR.1.1",name:"Apply properties of operations to add and subtract linear expressions with rational coefficients."},{code:"MA.7.AR.1.2",name:"Determine whether two linear expressions are equivalent."},{code:"MA.7.AR.2.1",name:"Write and solve one-step inequalities in one variable within a mathematical context and represent solutions algebraically or graphically."},{code:"MA.7.AR.2.2",name:"Write and solve two-step equations in one variable within a mathematical or real-world context, where all terms are rational numbers."},{code:"MA.7.AR.3.1",name:"Apply previous understanding of percentages and ratios to solve multi-step real-world percent problems."}],GR={standards:KR};function QR(){const[i,e]=Oe.useState(""),t=(GR.standards||[]).filter(s=>(s.code+" "+s.name).toLowerCase().includes(i.toLowerCase()));return J.jsxs("div",{children:[J.jsx("h2",{style:{fontSize:28,fontWeight:900,marginBottom:10},children:"Standards"}),J.jsx("input",{placeholder:"Search...",value:i,onChange:s=>e(s.target.value)}),J.jsx("ul",{children:t.map(s=>J.jsxs("li",{style:{margin:"8px 0"},children:[J.jsx("b",{children:s.code})," — ",s.name]},s.code))})]})}function XR(){return J.jsxs("div",{children:[J.jsx("h2",{style:{fontSize:28,fontWeight:900,marginBottom:10},children:"Settings"}),J.jsx("p",{children:"Theme & layout toggles can be added here post‑deploy. This build prioritizes working functionality."})]})}function JR(){const[i,e]=Oe.useState(null);Nw(),Oe.useEffect(()=>$R(s=>e(s)),[]);const t=s=>location.pathname===s?{fontWeight:700,textDecoration:"underline"}:{};return J.jsxs("div",{style:{display:"grid",gridTemplateColumns:"260px 1fr",minHeight:"100vh",background:"#0d0a17",color:"#dbeafe"},children:[J.jsxs("aside",{style:{padding:"20px",borderRight:"1px solid #1f2937"},children:[J.jsx("div",{style:{fontSize:24,fontWeight:900,marginBottom:24,background:"linear-gradient(90deg,#06b6d4,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"SYNAPSE"}),J.jsxs("nav",{style:{display:"grid",gap:8},children:[J.jsx(Ia,{href:"/",children:J.jsx("a",{style:t("/"),children:"📊 Dashboard"})}),J.jsx(Ia,{href:"/roster",children:J.jsx("a",{style:t("/roster"),children:"🧑‍🏫 Roster"})}),J.jsx(Ia,{href:"/assignments",children:J.jsx("a",{style:t("/assignments"),children:"✍️ Assignments"})}),J.jsx(Ia,{href:"/standards",children:J.jsx("a",{style:t("/standards"),children:"📋 Standards"})}),J.jsx(Ia,{href:"/settings",children:J.jsx("a",{style:t("/settings"),children:"⚙ Settings"})})]}),J.jsxs("div",{style:{marginTop:"auto"},children:[J.jsx("div",{style:{marginTop:24,fontSize:12,color:"#94a3b8",wordBreak:"break-all"},children:i?J.jsxs(J.Fragment,{children:["Signed in: ",i.email]}):J.jsx(J.Fragment,{children:"Not signed in"})}),J.jsx("div",{style:{display:"grid",gap:8,marginTop:12},children:i?J.jsx("button",{onClick:()=>BR(),style:{padding:"8px 12px",background:"#ef4444",color:"white",borderRadius:8},children:"Log out"}):J.jsx("button",{onClick:()=>zR(),style:{padding:"8px 12px",background:"#7c3aed",color:"white",borderRadius:8},children:"Sign in with Google"})})]})]}),J.jsx("main",{style:{padding:"24px"},children:J.jsxs(Vw,{children:[J.jsx(to,{path:"/",component:()=>J.jsx(HR,{user:i})}),J.jsx(to,{path:"/roster",component:()=>J.jsx(WR,{user:i})}),J.jsx(to,{path:"/assignments",component:()=>J.jsx(qR,{user:i})}),J.jsx(to,{path:"/standards",component:()=>J.jsx(QR,{user:i})}),J.jsx(to,{path:"/settings",component:()=>J.jsx(XR,{user:i})}),J.jsx(to,{children:"404"})]})})]})}uw.createRoot(document.getElementById("root")).render(J.jsx(vy.StrictMode,{children:J.jsx(JR,{})}));
