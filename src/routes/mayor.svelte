<style>
    .back-bg{
    background-image: url('/background/mayor_opt.webp');

    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(5px);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    }
</style>

<svelte:head>
<title>mayor</title>
</svelte:head>

<script>
    import Thinking from './../component/thinking.svelte'
    import MinecraftCode from './../component/minecraftCode.svelte';
    async function getMayor(){
        let response = await fetch("https://api.hypixel.net/resources/skyblock/election");
        let output = await response.json();
        return output;
    }
    let out = getMayor();
</script>
{#await out}
<Thinking />
{:then output}
<p class="secondarycolor subtext"> currently the mayor is: {output["mayor"]["name"]} ({output["mayor"]["key"]})</p>
<p class="secondarycolor subtext">perks: </p>
{#each output["mayor"]["perks"] as perks}
<MinecraftCode text={perks.name}/>:
<br>
<MinecraftCode text={perks.description}/>
{/each}
<p class="smalltext maincolor">last update is: {Date(output["lastUpdated"])}</p>
{:catch error}
<p>the error is {error}</p>
{/await}
<div class="back-bg"></div>
