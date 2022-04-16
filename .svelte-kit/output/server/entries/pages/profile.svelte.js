import { c as create_ssr_component, a as add_attribute } from "../../chunks/index-4f40e1ed.js";
/* empty css                                                            */var profile_svelte_svelte_type_style_lang = "";
const css = {
  code: ".tablestyle.svelte-mavmgu{display:grid;grid-template-columns:auto auto auto 40vw;gap:5px;margin-left:auto;margin-right:auto}@media(max-width: 600px){.tablestyle.svelte-mavmgu{grid-template-columns:auto auto auto 10vw}}.back-bg.svelte-mavmgu{background-image:url('/background/profile_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}.textbox.svelte-mavmgu{padding-left:10px;padding-right:10px}",
  map: null
};
const Profile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let playervalue = "";
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>profile</title>`, ""}`, ""}

<div class="${"tablestyle svelte-mavmgu"}"><input type="${"text"}" class="${"textbox hoverinput maincolor svelte-mavmgu"}"${add_attribute("value", playervalue, 0)}>
<button class="${"showme subsubtext hoverinput maincolor"}">fetch</button></div>
${`${`<p class="${"subtext"}">type in your username properly</p>`}`}
<br>
<div class="${"back-bg svelte-mavmgu"}"></div>`;
});
export { Profile as default };
