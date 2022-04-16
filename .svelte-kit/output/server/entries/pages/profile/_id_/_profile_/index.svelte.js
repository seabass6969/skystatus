import { c as create_ssr_component, e as escape } from "../../../../../chunks/index-4f40e1ed.js";
/* empty css                                                                     */import BigNumber from "bignumber.js";
var ProgressBar_svelte_svelte_type_style_lang = "";
var CollectionUI_svelte_svelte_type_style_lang = "";
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: ".imageofuuid.svelte-14u11zx{float:left;width:8vw;height:19vw;margin-right:2vw;margin-bottom:1vw}.back-bg.svelte-14u11zx{background-image:url('/background/profile_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}.scrollable.svelte-14u11zx{overflow:auto;white-space:nowrap}@media(max-width: 600px){.imageofuuid.svelte-14u11zx{width:26vw;height:60vw;margin-right:5vw}}@media(min-width: 1000px){}",
  map: null
};
async function load({ params }) {
  const id = params.id;
  const profile = params.profile;
  return { props: { id, profile } };
}
function reun(valable) {
  if (valable === void 0) {
    return "Not enabled your api";
  } else {
    return valable;
  }
}
const U5Bprofileu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  function toformated(number) {
    return new BigNumber(number.toString()).toFormat();
  }
  let { id } = $$props;
  let { profile } = $$props;
  let proDout = {
    output: void 0,
    loading: false,
    uuid: void 0
  };
  let profiledata = {
    bank_balance: void 0,
    critical_damage: void 0,
    death_count: void 0,
    total_kills: void 0,
    item_fished: void 0
  };
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.profile === void 0 && $$bindings.profile && profile !== void 0)
    $$bindings.profile(profile);
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>${escape(id)} profile</title>`, ""}`, ""}

<p class="${"subtext"}">${escape(id)} profile: </p>
${`<img src="${"https://crafatar.com/renders/body/" + escape(proDout.uuid) + "?overlay"}" alt="${""}" class="${"imageofuuid svelte-14u11zx"}">
<div class="${"floatright"}"><p class="${"subsubtext"}">last save: ${escape(reun(profiledata.last_save))}</p>
<p class="${"subsubtext"}">bank balance: ${escape(toformated(reun(profiledata.bank_balance)))}</p>
<p class="${"subsubtext"}">coin purse: ${escape(toformated(reun(profiledata.coin_purse)))}</p>
<p class="${"subsubtext"}">fairy souls: ${escape(reun(profiledata.fairy_souls))}</p></div>
<br>

${`<p class="${"subsubtext"}">Not enabled your skills api</p>`}
${`<p class="${"subsubsubtext"}">Not enabled your skills api</p>`}`}
<div class="${"back-bg svelte-14u11zx"}"></div>`;
});
export { U5Bprofileu5D as default, load };
