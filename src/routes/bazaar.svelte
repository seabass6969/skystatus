<script>
async function getBazaar(){
        let response = await fetch("https://api.hypixel.net/skyblock/bazaar");
        let output = await response.json();
        return output;
    }
    const out = getBazaar();
    let itemname = "INK_SACK:3"
</script>
<input type="text" bind:value={itemname}>
{#await out}
<p>waiting</p>
{:then output}
{#if output.success}
<p>{output["products"][itemname]["quick_status"]["sellPrice"]}</p>
{:else}
<h1>The code must be fuck up</h1>
{/if}
{:catch error}
<p>the error is {error}</p>
{/await}
