<style>
    .back-bg{
    background-image: url('/background/bazaar_opt.webp');
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
    .textbox{
    margin-left: auto;
    margin-right: auto;
    margin-top: 1vw;
    padding: 2vw 2vw 2vw 2vw;
    }
</style>

<svelte:head>
<title>bazaar</title>
</svelte:head>

<script>
    import Thinking from './../component/thinking.svelte'
    import json from './../resource/bazaar.json'
    import replacer from './../resource/bazaar_replace.json'
async function getBazaar(){
        let response = await fetch("https://api.hypixel.net/skyblock/bazaar");
        let output = await response.json();
        return output;
    }
    let out = getBazaar();
    let itemname = ""
    let realproccessname = ""
    $: {
        done = false
        realproccessname = itemname.toUpperCase().replaceAll(" ","_");
        for (let a=0; a < replacer.products.length; a++){
            if(realproccessname == replacer.products[a].name)realproccessname = replacer.products[a].replacer 
        }
        for (let i=0; i < json.products.length; i++){
            if(realproccessname == json.products[i]){done = true}
        }
    }
    let done = false
</script>
{#await out}
<Thinking />
{:then output}
<h1 class="subtext thirdcolor">type item to search on bz:</h1>
<input type="text" bind:value={itemname} class="maincolor hoverinput textbox">
{#if output.success}
{#if done == true}
<p class="subtext maincolor">sell price is: {output["products"][realproccessname]["quick_status"]["sellPrice"].toFixed(2)}</p>
<p class="subtext maincolor">sell volume is: {output["products"][realproccessname]["quick_status"]["sellVolume"].toFixed(2)}</p>
<p class="subtext maincolor">buy price is: {output["products"][realproccessname]["quick_status"]["buyPrice"].toFixed(2)}</p>
<p class="subtext maincolor">buy volume is: {output["products"][realproccessname]["quick_status"]["buyVolume"].toFixed(2)}</p>
{/if}
    <p class="smalltext maincolor">last update is: {Date(output["lastUpdated"])}</p>
{:else}
<h1>The code must be fuck up</h1>
{/if}
{:catch error}
<p>the error is {error}</p>
{/await}
<div class="back-bg"></div>
