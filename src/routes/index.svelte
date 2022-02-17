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
{output.success}
{/await}
