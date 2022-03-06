<style>
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
</style>
<script context="module">
  export async function load({params}) {
    const id = params.id
    const profile = params.profile
      return {
        props: {
            id,
            profile,
        }
      }
    }
</script>
<script>
    import {onMount } from 'svelte'
    export let id;
    export let profile;
    let profiledataOUT = {
        output: undefined, 
        loading: false,
    }
    let profiledata = {
        bank_balance: undefined
    }
    onMount(async () => {
        profiledataOUT.loading = true
        let response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/profile/' + id + '/' + profile );
        let output = await response.json();
        profiledataOUT = {
            output: output,
            loading: false
        }
        console.log(output)
        profiledata.bank_balance = profiledataOUT.output.profile.banking.balance
    })

</script>
<p class="subtext">{id} skyblock profile: </p>
{#if profiledataOUT.loading == true}
<p>waiting</p>
{:else}
<p>bank balance: {profiledata.bank_balance}</p>
{/if}
<div class="back-bg"></div>
