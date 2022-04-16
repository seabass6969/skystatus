import { c as create_ssr_component } from "../../chunks/index-4f40e1ed.js";
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".header.svelte-54fs72{font-size:3vw}.image.svelte-54fs72{width:8vw;height:8vw;text-align:center;margin-top:auto;margin-bottom:auto;vertical-align:middle\n    }@media(max-width: 600px){.header.svelte-54fs72{font-size:3.8vw}.image.svelte-54fs72{width:9vw;height:9vw}}.link.svelte-54fs72{padding-left:.6vw;padding-right:.6vw}",
  map: null
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<header><div class="${"header svelte-54fs72"}"><a class="${"link svelte-54fs72"}" href="${"/"}"><img src="${"/favicon.png"}" class="${"image svelte-54fs72"}" alt="${"homeimage"}"></a>
    <a class="${"link svelte-54fs72"}" href="${"/bazaar"}">bz</a>
    <a class="${"link svelte-54fs72"}" href="${"/mayor"}">mayor</a>
    <a class="${"link svelte-54fs72"}" href="${"/news"}">news</a>
    <a class="${"link svelte-54fs72"}" href="${"/locationtracker"}">place</a>
    <a class="${"link svelte-54fs72"}" href="${"/profile"}">profile</a>
    <a class="${"link svelte-54fs72"}" href="${"/contactme"}">me</a>
</div>
<br></header>
<main>${slots.default ? slots.default({}) : ``}</main>
<footer></footer>`;
});
export { _layout as default };
