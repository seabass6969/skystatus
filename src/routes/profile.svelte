<style>
    .back-bg{
    background-image: url('/background/profile.png');
    filter: blur(4px);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    }
</style>
<script>
    const SKYKEY = import.meta.env.VITE_KEY;
    async function getSKY(){
        let response = await fetch("https://api.hypixel.net/skyblock/profiles?key="+SKYKEY+"&uuid=6b350daa18d946e9a5a08cd6102d4b6e");
        let output = await response.json();
        return output;
    }
    const out = getSKY();
</script>
{#await out}
<p>waiting</p>
{:then output}
{#if output.success == true}
Its {output.success}
{/if}
{:catch error}
<p>the error is {error}</p>
{/await}
<div class="back-bg"></div>
