import { c as create_ssr_component, a as add_attribute } from "../../chunks/index-4f40e1ed.js";
var locationtracker_svelte_svelte_type_style_lang = "";
const css = {
  code: ".tablestyle.svelte-1je9o45{display:grid;grid-template-columns:auto auto auto 40vw;gap:5px;margin-left:auto;margin-right:auto}@media(max-width: 600px){.tablestyle.svelte-1je9o45{grid-template-columns:auto auto auto 10vw}}.back-bg.svelte-1je9o45{background-image:url('/background/location_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}",
  map: null
};
const Locationtracker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let playervalue = "";
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Location Tracker</title>`, ""}`, ""}

<div class="${"tablestyle svelte-1je9o45"}"><input type="${"text"}" class="${"textboxmaincolor hoverinput maincolor"}"${add_attribute("value", playervalue, 0)}>
<button class="${"showme subsubtext maincolor hoverinput"}">show</button></div>
${`${`<p class="${"subtext"}">type in your username properly</p>`}`}
<div class="${"back-bg svelte-1je9o45"}"></div>`;
});
export { Locationtracker as default };
