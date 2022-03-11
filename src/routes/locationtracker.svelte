<style>
    .tablestyle {
        display: grid;
        grid-template-columns: auto auto auto 40vw;
        gap: 5px;
        margin-left: auto;
        margin-right: auto;

    }
    @media (max-width: 600px){
    .tablestyle {
        grid-template-columns: auto auto auto 10vw;
    }
    }
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

<svelte:head>
<title>Location Tracker</title>
</svelte:head>
<script>
    import json from './skyplace.json'
    let playervalue = ""
    let finalplayervalue = ""
    let locationdata = {
        output: undefined,
        loading: false,
        success: false
    }
    let finaldata = ""
    async function clickedlocation() {
        locationdata.loading = true;
        const response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/status/' + playervalue)
        const output = await response.json()
        if(output.error == undefined){
        locationdata.success = true
        locationdata = {
            output: output,
            loading: false
        }
        finalplayervalue = playervalue
        }else{
            locationdata.success = false
        }
    }
    function onchangevalue(){
        locationdata.loading = false;
    }
</script>
<div class="tablestyle">
<input type="text" bind:value={playervalue} on:input={onchangevalue} on:change={clickedlocation} class="textboxmaincolor hoverinput maincolor">
<button on:click={clickedlocation} class="showme subsubtext maincolor hoverinput">show</button>
</div>
{#if locationdata.success !== false}
<br>
{#if locationdata.output.session.online == false}
<p class="subtext">The Player {finalplayervalue} is not online</p>
{:else}
{#if locationdata.output.session.gameType === "SKYBLOCK"}
<p class="subtext">The Player {finalplayervalue} is online and it's in {json.modeNames[locationdata.output.session.mode]}</p>
{:else}
<p class="subtext">The Player {finalplayervalue} is not playing skyblock but its playing in {locationdata.output.session.gameType} in {locationdata.output.session.mode}</p>
{/if}
{/if}
{:else if locationdata.success !== true}
<p class="subtext">type in your username properly</p>
{/if}
<div class="back-bg"></div>
