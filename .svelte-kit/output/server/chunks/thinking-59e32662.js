import { c as create_ssr_component } from "./index-4f40e1ed.js";
/* empty css                                                 */const css = {
  code: "@keyframes svelte-1ac2uz0-spinner{0%{transform:translate3d(-50%, -50%, 0) rotate(0deg)}100%{transform:translate3d(-50%, -50%, 0) rotate(360deg)}}.spin.svelte-1ac2uz0{position:absolute;top:50%;left:50%;display:block;width:50vw;margin:auto auto auto auto;animation:1.5s linear infinite svelte-1ac2uz0-spinner}",
  map: null
};
const Thinking = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<img src="${"/Villager.webp"}" alt="${"villager thinking"}" class="${"spin svelte-1ac2uz0"}">`;
});
export { Thinking as T };
