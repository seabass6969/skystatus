import{S as H,i as M,s as z,k as w,e as m,t as S,L as F,d as o,m as P,c as d,a as I,h as U,b as E,g as n,H as B,M as C,N as j,n as A,O as G,T as J,j as K,P as Q,U as D,R as W}from"../chunks/index-0338648c.js";/* empty css                                                       */function L(r,t,s){const l=r.slice();return l[8]=t[s],l}function X(r){let t,s;return{c(){t=m("p"),s=S("type in your username properly"),this.h()},l(l){t=d(l,"P",{class:!0});var u=I(t);s=U(u,"type in your username properly"),u.forEach(o),this.h()},h(){E(t,"class","subtext")},m(l,u){n(l,t,u),B(t,s)},p:A,d(l){l&&o(t)}}}function Y(r){let t,s,l,u,p,a,b,h,y,_,k,T,O,R,v=r[1].profilelist,i=[];for(let e=0;e<v.length;e+=1)i[e]=V(L(r,v,e));return{c(){t=m("br"),s=w(),l=m("p"),u=S("select your profile:"),p=w(),a=m("select");for(let e=0;e<i.length;e+=1)i[e].c();b=w(),h=m("br"),y=w(),_=m("a"),k=S("show the profile"),this.h()},l(e){t=d(e,"BR",{}),s=P(e),l=d(e,"P",{class:!0});var f=I(l);u=U(f,"select your profile:"),f.forEach(o),p=P(e),a=d(e,"SELECT",{});var c=I(a);for(let q=0;q<i.length;q+=1)i[q].l(c);c.forEach(o),b=P(e),h=d(e,"BR",{}),y=P(e),_=d(e,"A",{class:!0,href:!0});var N=I(_);k=U(N,"show the profile"),N.forEach(o),this.h()},h(){E(l,"class","subtext"),r[1].selected_value===void 0&&Q(()=>r[5].call(a)),E(_,"class","subsubtext"),E(_,"href",T="/profile/"+r[0]+"/"+r[1].selected_value)},m(e,f){n(e,t,f),n(e,s,f),n(e,l,f),B(l,u),n(e,p,f),n(e,a,f);for(let c=0;c<i.length;c+=1)i[c].m(a,null);D(a,r[1].selected_value),n(e,b,f),n(e,h,f),n(e,y,f),n(e,_,f),B(_,k),O||(R=j(a,"change",r[5]),O=!0)},p(e,f){if(f&2){v=e[1].profilelist;let c;for(c=0;c<v.length;c+=1){const N=L(e,v,c);i[c]?i[c].p(N,f):(i[c]=V(N),i[c].c(),i[c].m(a,null))}for(;c<i.length;c+=1)i[c].d(1);i.length=v.length}f&2&&D(a,e[1].selected_value),f&3&&T!==(T="/profile/"+e[0]+"/"+e[1].selected_value)&&E(_,"href",T)},d(e){e&&o(t),e&&o(s),e&&o(l),e&&o(p),e&&o(a),W(i,e),e&&o(b),e&&o(h),e&&o(y),e&&o(_),O=!1,R()}}}function V(r){let t,s=r[8].cute_name+"",l,u;return{c(){t=m("option"),l=S(s),this.h()},l(p){t=d(p,"OPTION",{});var a=I(t);l=U(a,s),a.forEach(o),this.h()},h(){t.__value=u=r[8].profile_id,t.value=t.__value},m(p,a){n(p,t,a),B(t,l)},p(p,a){a&2&&s!==(s=p[8].cute_name+"")&&K(l,s),a&2&&u!==(u=p[8].profile_id)&&(t.__value=u,t.value=t.__value)},d(p){p&&o(t)}}}function Z(r){let t,s,l,u,p,a,b,h,y,_,k,T,O;function R(e,f){if(e[1].success!==!1)return Y;if(e[1].success!==!0)return X}let v=R(r),i=v&&v(r);return{c(){t=w(),s=m("div"),l=m("input"),u=w(),p=m("button"),a=S("fetch"),b=w(),i&&i.c(),h=w(),y=m("br"),_=w(),k=m("div"),this.h()},l(e){F('[data-svelte="svelte-1xp8iwo"]',document.head).forEach(o),t=P(e),s=d(e,"DIV",{class:!0});var c=I(s);l=d(c,"INPUT",{type:!0,class:!0}),u=P(c),p=d(c,"BUTTON",{class:!0});var N=I(p);a=U(N,"fetch"),N.forEach(o),c.forEach(o),b=P(e),i&&i.l(e),h=P(e),y=d(e,"BR",{}),_=P(e),k=d(e,"DIV",{class:!0}),I(k).forEach(o),this.h()},h(){document.title="profile",E(l,"type","text"),E(l,"class","textbox hoverinput maincolor svelte-mavmgu"),E(p,"class","showme subsubtext hoverinput maincolor"),E(s,"class","tablestyle svelte-mavmgu"),E(k,"class","back-bg svelte-mavmgu")},m(e,f){n(e,t,f),n(e,s,f),B(s,l),C(l,r[0]),B(s,u),B(s,p),B(p,a),n(e,b,f),i&&i.m(e,f),n(e,h,f),n(e,y,f),n(e,_,f),n(e,k,f),T||(O=[j(l,"input",r[4]),j(l,"input",r[3]),j(l,"change",r[2]),j(p,"click",r[2])],T=!0)},p(e,[f]){f&1&&l.value!==e[0]&&C(l,e[0]),v===(v=R(e))&&i?i.p(e,f):(i&&i.d(1),i=v&&v(e),i&&(i.c(),i.m(h.parentNode,h)))},i:A,o:A,d(e){e&&o(t),e&&o(s),e&&o(b),i&&i.d(e),e&&o(h),e&&o(y),e&&o(_),e&&o(k),T=!1,G(O)}}}function g(r,t,s){let l="",u={loading:!1,success:!1,profilelist:void 0,selected_value:void 0};async function p(){s(1,u.loading=!0,u),s(0,l=l.replaceAll(" ",""));const _=await(await fetch("https://skyproxyjs.cephas8080.workers.dev/api/profileslist/"+l)).json();_.error==null?(s(1,u.success=!0,u),s(1,u={profilelist:_,loading:!1}),console.log(_)):s(1,u.success=!1,u)}function a(){s(1,u.loading=!1,u)}function b(){l=this.value,s(0,l)}function h(){u.selected_value=J(this),s(1,u)}return[l,u,p,a,b,h]}class ee extends H{constructor(t){super();M(this,t,g,Z,z,{})}}export{ee as default};
