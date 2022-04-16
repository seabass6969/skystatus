import { c as create_ssr_component } from "../../chunks/index-4f40e1ed.js";
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: ".back-bg.svelte-ozov5j{background-image:url('/background/main_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}.textspecial.svelte-ozov5j{background:linear-gradient(\n            to right,\n            #bf00c1 0%,\n            #FE5F55 50%,\n            #DDD92A 90%\n        );background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}",
  map: null
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>sky home</title>`, ""}`, ""}
<h1 class="${"secondarycolor textspecial svelte-ozov5j"}">The all-in-one skyblock website for you</h1>
<p class="${"subtext"}">\u{1F4AF}\u{1F643}</p>
<div class="${"smalltext"}">Create by Cephas. <a href="${"https://github.com/seabass6969/skystatus/blob/master/LICENSE"}">License under Apache-2.0 License</a></div>
<div class="${"back-bg svelte-ozov5j"}"></div>`;
});
export { Routes as default };
