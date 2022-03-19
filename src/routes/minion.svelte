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
    import minionjson from './minion_resources.json'
    import Thinking from './../component/thinking.svelte'
let speed = 0
let preaction = 0
let price = 0
let addedspeed = 0
let useDiaSP = false 
let result
$: {
    result = speed
}
</script>
<p class="subtext">Minion calcaulator</p>
<p class="subsubtext">Orginal Minion speed:</p>
<input type="number" bind:value={speed}>
<p class="subsubtext">item per action:</p>
<input type="number" bind:value={preaction}>
<p class="subsubtext">Unit price:</p>
<input type="number" bind:value={price}>
<p class="subsubtext">diamond spreading:</p>
<input type="checkbox" bind:value={useDiaSP}>
<p class="subsubtext">speed:</p>
<input type="number" bind:value={addedspeed}>
<p class="subtext">result: {result}</p>
<div class="back-bg"></div>

