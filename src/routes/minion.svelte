<script>
let speed = ""
let preaction = ""
let price = ""
let addedspeed = ""
let useDiaSP = false 
let result
$: {
    console.log()
}
</script>
<p class="subtext">Minion calcaulator</p>
<p class="subsubtext">Minion speed:</p>
<input type="number" bind:value={speed}>
<p class="subsubtext">item per action:</p>
<input type="number" bind:value={preaction}>
<p class="subsubtext">Unit price:</p>
<input type="number" bind:value={price}>
<p class="subsubtext">diamond spreading:</p>
<input type="checkbox" bind:value={useDiaSP}>
<p class="subsubtext">speed:</p>
<input type="number" bind:value={addedspeed}>
<p>result: {result}</p>
