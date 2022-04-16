import { c as create_ssr_component, i as is_promise, n as noop, v as validate_component, e as escape, b as each } from "../../chunks/index-4f40e1ed.js";
import { T as Thinking } from "../../chunks/thinking-59e32662.js";
/* empty css                                                            */function mainreplace(text) {
  let StringText = String(text);
  let replaceabletext = [
    { name: "\xA7a", done: "" },
    { name: "\xA7b", done: "" },
    { name: "\xA7c", done: "" },
    { name: "\xA7d", done: "" },
    { name: "\xA7e", done: "" },
    { name: "\xA7f", done: "" },
    { name: "\xA7g", done: "" },
    { name: "\xA7k", done: "" },
    { name: "\xA7l", done: "" },
    { name: "\xA7m", done: "" },
    { name: "\xA7n", done: "" },
    { name: "\xA7o", done: "" },
    { name: "\xA7r", done: "" },
    { name: "\xA70", done: "" },
    { name: "\xA71", done: "" },
    { name: "\xA72", done: "" },
    { name: "\xA73", done: "" },
    { name: "\xA74", done: "" },
    { name: "\xA75", done: "" },
    { name: "\xA76", done: "" },
    { name: "\xA77", done: "" },
    { name: "\xA78", done: "" },
    { name: "\xA79", done: "" }
  ];
  for (let i = 0; i < replaceabletext.length; i++) {
    StringText = StringText.replaceAll(replaceabletext[i]["name"], replaceabletext[i]["done"]);
  }
  return StringText;
}
const MinecraftCode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text = "" } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  return `<!-- HTML_TAG_START -->${mainreplace(text)}<!-- HTML_TAG_END -->`;
});
var mayor_svelte_svelte_type_style_lang = "";
const css = {
  code: ".back-bg.svelte-17v5r3o{background-image:url('/background/mayor_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(5px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}",
  map: null
};
async function getMayor() {
  let response = await fetch("https://api.hypixel.net/resources/skyblock/election");
  let output = await response.json();
  return output;
}
const Mayor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let out = getMayor();
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>mayor</title>`, ""}`, ""}


${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
${validate_component(Thinking, "Thinking").$$render($$result, {}, {}, {})}
`;
    }
    return function(output) {
      return `
<p class="${"secondarycolor subtext"}">currently the mayor is: ${escape(output["mayor"]["name"])} (${escape(output["mayor"]["key"])})</p>
<p class="${"secondarycolor subtext"}">perks: </p>
${each(output["mayor"]["perks"], (perks) => {
        return `${validate_component(MinecraftCode, "MinecraftCode").$$render($$result, { text: perks.name }, {}, {})}:
<br>
${validate_component(MinecraftCode, "MinecraftCode").$$render($$result, { text: perks.description }, {}, {})}`;
      })}
<p class="${"smalltext maincolor"}">last update is: ${escape(Date(output["lastUpdated"]))}</p>
`;
    }(__value);
  }(out)}
<div class="${"back-bg svelte-17v5r3o"}"></div>`;
});
export { Mayor as default };
