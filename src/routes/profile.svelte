<style>
    .topgrid {
        display: grid;
        grid-template-columns: 80% 20%;
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
        margin-left: 3vw;
        margin-right: 3vw;
        width: 75%;
    }
    .showme {
        margin-right: 3vw;
    }
    .selected {
        margin-top: 3vw;
        margin-left: 3vw;
    }
    .profiles {
        margin-left: 3vw;
    }
   </style>
<svelte:head>
<title>profile</title>
</svelte:head>
<script>
    //@ts-ignore
    import {link} from 'svelte-spa-router'
    import Thinking from './../component/thinking.svelte'
const init = {
    headers: {
      'content-type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    },
  };

    let playervalue = ""
    let selected_value = ""
    let list_of_item
    let start_loading = false
    let finish_loaded = false 
    async function showprofile(){
        finish_loaded = true
        let x = (await fetch('https://skystatusback.onrender.com/api/profileslist/' + playervalue, init)).json()
        list_of_item = (await x)
        finish_loaded = false
        start_loading = true
    }
    function onchangevalue(){

    }
</script>
<div class="topgrid">
    <input type="text" bind:value={playervalue} on:input={onchangevalue} class="textbox hoverinput maincolor">
    <button on:click={showprofile} class="showme subsubtext hoverinput maincolor">fetch</button>
</div>
{#if finish_loaded == true}
<Thinking />
{/if}
{#if start_loading == true}
    <select bind:value={selected_value} class="selected">
    {#each list_of_item as a}
        <option value={a["profile_id"]}>{a["cute_name"]}</option>
    {/each}
    </select>
    {#if selected_value != ""}
        <a class="subsubtext profiles" href="/profile/{playervalue}/{selected_value}" use:link>show the profile</a>
    {/if}
{/if}
<br>
<div class="back-bg"></div>
