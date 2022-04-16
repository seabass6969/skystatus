import { c as create_ssr_component, i as is_promise, n as noop, v as validate_component, b as each, e as escape, a as add_attribute } from "../../chunks/index-4f40e1ed.js";
import { T as Thinking } from "../../chunks/thinking-59e32662.js";
/* empty css                                                            */var news_svelte_svelte_type_style_lang = "";
const css = {
  code: ".back-bg.svelte-12jajth{background-image:url('/background/news_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}.underline.svelte-12jajth{text-decoration:underline;text-decoration-color:tan}",
  map: null
};
async function getNews() {
  let response = await fetch("https://skyproxyjs.cephas8080.workers.dev/api/News");
  let output = await response.json();
  return output;
}
const News = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let out = getNews();
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>News</title>`, ""}`, ""}

${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
${validate_component(Thinking, "Thinking").$$render($$result, {}, {}, {})}
`;
    }
    return function(output) {
      return `
${each(output["items"], (items) => {
        return `<p class="${"secondarycolor underline subtext svelte-12jajth"}">title: ${escape(items["title"])}</p>
<p class="${"secondarycolor smalltext"}">Date it added:${escape(items["text"])}</p>
<a class="${"secondarycolor smalltext"}"${add_attribute("href", items["link"], 0)}>forum post link</a>`;
      })}
`;
    }(__value);
  }(out)}
<div class="${"back-bg svelte-12jajth"}"></div>`;
});
export { News as default };
