<script>
    import json from './bazaar.json'
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
        for (let i=0; i < json.products.length; i++){
            if(realproccessname == json.products[i]){done = true}
        }
    }
    let done = false
</script>
{#await out}
<p>waiting</p>
{:then output}
<h1 class="subtext thirdcolor">type item to search on bz:</h1>
<input type="text" bind:value={itemname} class="maincolor hoverinput">
{#if output.success}
<h5>last update is: {Date(output["lastUpdated"])}</h5>
{#if done == true}
<p class="subtext maincolor">sell price is: {output["products"][realproccessname]["quick_status"]["sellPrice"].toFixed(2)}</p>
<p class="subtext maincolor">sell volume is: {output["products"][realproccessname]["quick_status"]["sellVolume"].toFixed(2)}</p>
<p class="subtext maincolor">buy price is: {output["products"][realproccessname]["quick_status"]["buyPrice"].toFixed(2)}</p>
<p class="subtext maincolor">buy volume is: {output["products"][realproccessname]["quick_status"]["buyVolume"].toFixed(2)}</p>
{/if}
{:else}
<h1>The code must be fuck up</h1>
{/if}
{:catch error}
<p>the error is {error}</p>
{/await}
