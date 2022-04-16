<style>
    .back-bg{
    background-image: url('/background/location_opt.webp');
    background-repeat: no-repeat;
    background-size: cover;

    filter: blur(2px);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    }
</style>
<script>
    import json from './../resource/bazaar.json'
    import replacer from './../resource/bazaar_replace.json'
    import minionjson from './../resource/minion_resources.json'
    import Thinking from './../component/thinking.svelte'
    import { onMount } from 'svelte'
        let bzdata = {
            loading: false,
            output: undefined,
            done: false
        }
    let itemname = ""
    let realproccessname = ""
    let done = false
    onMount (async () => {
        bzdata.loading = true
        let res = await fetch("https://api.hypixel.net/skyblock/bazaar")
        let output = await res.json()
        bzdata = {
            loading: false,
            output: output,
            done: true
        }
        diamond_price = bzdata.output.products["DIAMOND"]["quick_status"]["sellPrice"].toFixed(2)
    })
let speed = 10
let items_preaction = 1
let price = 2100
let speedbyfuel 
let useDiaSP = false 
let diamond_price = 0
let result
$: {
        done = false
        realproccessname = itemname.toUpperCase().replaceAll(" ","_");
        for (let a=0; a < replacer.products.length; a++){
            if(realproccessname == replacer.products[a].name)realproccessname = replacer.products[a].replacer 
        }
        for (let i=0; i < json.products.length; i++){
            if(realproccessname == json.products[i]){done = true}
        }
    // end bazaar checking price
    console.log(diamond_price)
    if(useDiaSP === false){
        result = 88400.0 / (speed / (1 + speedbyfuel)) * items_preaction * price
    }
    if(useDiaSP === true){
        result = (88400.0 / (speed / (1 + speedbyfuel)) * items_preaction * price) + diamond_price * speed
    }
}
</script>
<svelte:head>
<title>minion</title>
</svelte:head>
<p class="subtext">Minion calcaulator:</p>
<p class="subsubtext">Orginal Minion speed:</p>
<input type="number" bind:value={speed} placeholder="10">
<p class="subsubtext">item per action:</p>
<input type="number" bind:value={items_preaction}>
<p class="subsubtext">Unit price:</p>
<input type="number" bind:value={price}>
{#if bzdata.done === true}
<div class="subsubsubtext">price checker on bz <input type="text" bind:value={itemname} class="maincolor hoverinput textbox"></div>
{#if bzdata.output.success}
{#if done === true}
<p class="subsubsubtext maincolor">sell price: {bzdata.output.products[realproccessname]["quick_status"]["sellPrice"].toFixed(2)}</p>
{/if}
{/if}
{/if}
<p class="subsubtext">diamond spreading:</p>
<input type="checkbox" bind:checked={useDiaSP}>
<p class="subsubtext">fuel bonus speed:</p>
<select id="BonusSpeedByFuel" name="Fuel" bind:value={speedbyfuel}>
    <option selected value=0>none</option>
    {#each minionjson["fuel"] as a}
        <option value={a.speed}>{a.name}</option>
    {/each}
</select>
<p class="subtext">result after an hour: {result / 24}</p>
<p class="subtext">result after a days: {result}</p>
<div class="back-bg"></div>

