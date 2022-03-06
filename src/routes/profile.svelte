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
    background-image: url('/background/profile_opt.webp');
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
    padding-left: 10px; 
    padding-right: 10px;
    }
   </style>
<svelte:head>
<title>profile</title>
</svelte:head>
<script>
    let playervalue = ""
    let finalplayervalue = ""
    let profileidfetch = {
        loading: false,
        success: false,
        profilelist: undefined,
        selected_value: undefined
    }
    let profiledata = {
        loading: false,
        success: false,
        output: undefined
    }
    async function showprofile() {
        profileidfetch.loading = true;
        const response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/profileslist/' + playervalue)
        const output = await response.json()
        if(output.error == undefined){
        profileidfetch.success = true
        profileidfetch = {
            profilelist: output,
            loading: false
        }
        console.log(output)
        finalplayervalue = playervalue
        }else{
            profileidfetch.success = false
        }
    }
    function onchangevalue(){
        profileidfetch.loading = false;
    }
</script>
<div class="tablestyle">
<input type="text" bind:value={playervalue} on:input={onchangevalue} on:change={showprofile} class="textbox hoverinput maincolor">
<button on:click={showprofile} class="showme subsubtext hoverinput maincolor">fetch</button>
</div>
{#if profileidfetch.success !== false}
<br>
<select bind:value={profileidfetch.selected_value} >
    {#each profileidfetch.profilelist as profilelist}
        <option value={profilelist.profile_id}>{profilelist.cute_name}</option>
    {/each}
</select>
<br>
<a class="subsubtext" href="/profile/{playervalue}&{profileidfetch.selected_value}">go</a>
{:else if profileidfetch.success !== true}
<p class="subtext">type in your username properly</p>
{/if}
<div class="back-bg"></div>
