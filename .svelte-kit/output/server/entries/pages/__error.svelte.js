import { c as create_ssr_component } from "../../chunks/index-4f40e1ed.js";
var __error_svelte_svelte_type_style_lang = "";
const css = {
  code: ".back-bg.svelte-1p1zej1{background-image:url('/background/errorscreen_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}",
  map: null
};
const _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>error</title>`, ""}`, ""}
<h1 class="${"maincolor"}">error has occur</h1>
<div class="${"back-bg svelte-1p1zej1"}"></div>`;
});
export { _error as default };
