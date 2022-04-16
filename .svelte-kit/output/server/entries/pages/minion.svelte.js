import { c as create_ssr_component, a as add_attribute, b as each, e as escape } from "../../chunks/index-4f40e1ed.js";
import { r as replacer } from "../../chunks/bazaar_replace-9b77d9ef.js";
/* empty css                                                            */const fuel = [
  {
    name: "Coal",
    speed: 0.05,
    times: false,
    hour: 0.5
  },
  {
    name: "Block of Coal",
    speed: 0.05,
    times: false,
    hour: 5
  },
  {
    name: "Enchanted Bread",
    speed: 0.05,
    times: false,
    hour: 12
  },
  {
    name: "Enchanted Coal",
    speed: 0.1,
    times: false,
    hour: 24
  },
  {
    name: "Enchanted Charcoal",
    speed: 0.2,
    times: false,
    hour: 36
  },
  {
    name: "Solar Panel",
    speed: 0.125,
    times: false,
    hour: 0
  },
  {
    name: "Enchanted Lava Bucket",
    speed: 0.25,
    times: false,
    hour: 0
  },
  {
    name: "Hamster Wheel",
    speed: 0.5,
    times: false,
    hour: 24
  },
  {
    name: "Foul Flesh",
    speed: 0.9,
    times: false,
    hour: 5
  },
  {
    name: "Catalyst",
    speed: 2,
    times: true,
    hour: 3
  },
  {
    name: "Hyper Catalyst",
    speed: 3,
    times: true,
    hour: 6
  },
  {
    name: "Tasty cheese",
    speed: 2,
    times: true,
    hour: 1
  },
  {
    name: "Magma Bucket",
    speed: 0.3,
    times: false,
    hour: 0
  },
  {
    name: "Plasma Bucket",
    speed: 0.35,
    times: false,
    hour: 0
  }
];
const minion = [
  {
    name: "Wheat Minion",
    resource_generated: [
      "Wheat",
      "Seeds"
    ],
    tier: []
  }
];
var minionjson = {
  fuel,
  minion
};
var minion_svelte_svelte_type_style_lang = "";
const css = {
  code: ".back-bg.svelte-129ykmq{background-image:url('/background/location_opt.webp');background-repeat:no-repeat;background-size:cover;filter:blur(2px);position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1}",
  map: null
};
const Minion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let itemname = "";
  let realproccessname = "";
  let speed = 10;
  let items_preaction = 1;
  let price = 2100;
  let speedbyfuel;
  let useDiaSP = false;
  let diamond_price = 0;
  let result;
  $$result.css.add(css);
  {
    {
      realproccessname = itemname.toUpperCase().replaceAll(" ", "_");
      for (let a = 0; a < replacer.products.length; a++) {
        if (realproccessname == replacer.products[a].name)
          realproccessname = replacer.products[a].replacer;
      }
      console.log(diamond_price);
      {
        result = 88400 / (speed / (1 + speedbyfuel)) * items_preaction * price;
      }
    }
  }
  return `${$$result.head += `${$$result.title = `<title>minion</title>`, ""}`, ""}
<p class="${"subtext"}">Minion calcaulator:</p>
<p class="${"subsubtext"}">Orginal Minion speed:</p>
<input type="${"number"}" placeholder="${"10"}"${add_attribute("value", speed, 0)}>
<p class="${"subsubtext"}">item per action:</p>
<input type="${"number"}"${add_attribute("value", items_preaction, 0)}>
<p class="${"subsubtext"}">Unit price:</p>
<input type="${"number"}"${add_attribute("value", price, 0)}>
${``}
<p class="${"subsubtext"}">diamond spreading:</p>
<input type="${"checkbox"}"${add_attribute("checked", useDiaSP, 1)}>
<p class="${"subsubtext"}">fuel bonus speed:</p>
<select id="${"BonusSpeedByFuel"}" name="${"Fuel"}"><option selected value="${"0"}">none</option>${each(minionjson["fuel"], (a) => {
    return `<option${add_attribute("value", a.speed, 0)}>${escape(a.name)}</option>`;
  })}</select>
<p class="${"subtext"}">result after an hour: ${escape(result / 24)}</p>
<p class="${"subtext"}">result after a days: ${escape(result)}</p>
<div class="${"back-bg svelte-129ykmq"}"></div>`;
});
export { Minion as default };
