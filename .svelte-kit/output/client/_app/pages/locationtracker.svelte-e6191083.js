import{S as M,i as O,s as q,k as N,e as T,t as d,L as K,d as c,m as D,c as g,a as P,h,b as k,g as b,H as p,M as S,N as I,n as B,O as U,l as F,j as E}from"../chunks/index-0338648c.js";const V={farming_1:"The Farming Islands",crystal_hollows:"Crystal Hollows",foraging_1:"Floating Islands",dark_auction:"Dark Auction",dungeon:"Dungeons",combat_3:"The End",hub:"Hub",dynamic:"Private Island",mining_3:"Dwarven Mines",mining_1:"Gold Mine",combat_2:"Blazing Fortress",mining_2:"Deep Caverns",combat_1:"Spider's Den"};var H={modeNames:V};function z(u){let e,n;return{c(){e=T("p"),n=d("type in your username properly"),this.h()},l(t){e=g(t,"P",{class:!0});var r=P(e);n=h(r,"type in your username properly"),r.forEach(c),this.h()},h(){k(e,"class","subtext")},m(t,r){b(t,e,r),p(e,n)},p:B,d(t){t&&c(e)}}}function A(u){let e,n,t;function r(l,o){return l[2].output.session.online==!1?Y:l[2].output.session.gameType==="SKYBLOCK"?R:G}let s=r(u),i=s(u);return{c(){e=T("br"),n=N(),i.c(),t=F()},l(l){e=g(l,"BR",{}),n=D(l),i.l(l),t=F()},m(l,o){b(l,e,o),b(l,n,o),i.m(l,o),b(l,t,o)},p(l,o){s===(s=r(l))&&i?i.p(l,o):(i.d(1),i=s(l),i&&(i.c(),i.m(t.parentNode,t)))},d(l){l&&c(e),l&&c(n),i.d(l),l&&c(t)}}}function G(u){let e,n,t,r,s=u[2].output.session.gameType+"",i,l,o=u[2].output.session.mode+"",y;return{c(){e=T("p"),n=d("The Player "),t=d(u[1]),r=d(" is not playing skyblock but its playing in "),i=d(s),l=d(" in "),y=d(o),this.h()},l(f){e=g(f,"P",{class:!0});var _=P(e);n=h(_,"The Player "),t=h(_,u[1]),r=h(_," is not playing skyblock but its playing in "),i=h(_,s),l=h(_," in "),y=h(_,o),_.forEach(c),this.h()},h(){k(e,"class","subtext")},m(f,_){b(f,e,_),p(e,n),p(e,t),p(e,r),p(e,i),p(e,l),p(e,y)},p(f,_){_&2&&E(t,f[1]),_&4&&s!==(s=f[2].output.session.gameType+"")&&E(i,s),_&4&&o!==(o=f[2].output.session.mode+"")&&E(y,o)},d(f){f&&c(e)}}}function R(u){let e,n,t,r,s=H.modeNames[u[2].output.session.mode]+"",i;return{c(){e=T("p"),n=d("The Player "),t=d(u[1]),r=d(" is online and it's in "),i=d(s),this.h()},l(l){e=g(l,"P",{class:!0});var o=P(e);n=h(o,"The Player "),t=h(o,u[1]),r=h(o," is online and it's in "),i=h(o,s),o.forEach(c),this.h()},h(){k(e,"class","subtext")},m(l,o){b(l,e,o),p(e,n),p(e,t),p(e,r),p(e,i)},p(l,o){o&2&&E(t,l[1]),o&4&&s!==(s=H.modeNames[l[2].output.session.mode]+"")&&E(i,s)},d(l){l&&c(e)}}}function Y(u){let e,n,t,r;return{c(){e=T("p"),n=d("The Player "),t=d(u[1]),r=d(" is not online"),this.h()},l(s){e=g(s,"P",{class:!0});var i=P(e);n=h(i,"The Player "),t=h(i,u[1]),r=h(i," is not online"),i.forEach(c),this.h()},h(){k(e,"class","subtext")},m(s,i){b(s,e,i),p(e,n),p(e,t),p(e,r)},p(s,i){i&2&&E(t,s[1])},d(s){s&&c(e)}}}function J(u){let e,n,t,r,s,i,l,o,y,f,_;function C(a,v){if(a[2].success!==!1)return A;if(a[2].success!==!0)return z}let w=C(u),m=w&&w(u);return{c(){e=N(),n=T("div"),t=T("input"),r=N(),s=T("button"),i=d("show"),l=N(),m&&m.c(),o=N(),y=T("div"),this.h()},l(a){K('[data-svelte="svelte-bp21s8"]',document.head).forEach(c),e=D(a),n=g(a,"DIV",{class:!0});var j=P(n);t=g(j,"INPUT",{type:!0,class:!0}),r=D(j),s=g(j,"BUTTON",{class:!0});var L=P(s);i=h(L,"show"),L.forEach(c),j.forEach(c),l=D(a),m&&m.l(a),o=D(a),y=g(a,"DIV",{class:!0}),P(y).forEach(c),this.h()},h(){document.title="Location Tracker",k(t,"type","text"),k(t,"class","textboxmaincolor hoverinput maincolor"),k(s,"class","showme subsubtext maincolor hoverinput"),k(n,"class","tablestyle svelte-1je9o45"),k(y,"class","back-bg svelte-1je9o45")},m(a,v){b(a,e,v),b(a,n,v),p(n,t),S(t,u[0]),p(n,r),p(n,s),p(s,i),b(a,l,v),m&&m.m(a,v),b(a,o,v),b(a,y,v),f||(_=[I(t,"input",u[5]),I(t,"input",u[4]),I(t,"change",u[3]),I(s,"click",u[3])],f=!0)},p(a,[v]){v&1&&t.value!==a[0]&&S(t,a[0]),w===(w=C(a))&&m?m.p(a,v):(m&&m.d(1),m=w&&w(a),m&&(m.c(),m.m(o.parentNode,o)))},i:B,o:B,d(a){a&&c(e),a&&c(n),a&&c(l),m&&m.d(a),a&&c(o),a&&c(y),f=!1,U(_)}}}function Q(u,e,n){let t="",r="",s={output:void 0,loading:!1,success:!1};async function i(){n(2,s.loading=!0,s);const f=await(await fetch("https://skyproxyjs.cephas8080.workers.dev/api/status/"+t)).json();f.error==null?(n(2,s.success=!0,s),n(2,s={output:f,loading:!1}),n(1,r=t)):n(2,s.success=!1,s)}function l(){n(2,s.loading=!1,s)}function o(){t=this.value,n(0,t)}return[t,r,s,i,l,o]}class X extends M{constructor(e){super();O(this,e,Q,J,q,{})}}export{X as default};
