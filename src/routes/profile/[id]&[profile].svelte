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
    import ProgressBar from './../../component/ProgressBar.svelte'
    import {BigNumber} from "bignumber.js"
    import { onMount } from 'svelte'
    function reun(valable){
        if(valable === undefined){
            return "Not enabled your api"
        }else{
            return valable
        }
    }
    function toformated(number){
        return new BigNumber(number.toString()).toFormat()
    }
    export let id;
    export let profile;
    let proDout = {
        output: undefined, 
        loading: false,
        uuid: undefined
    }
    let profiledata = {
        bank_balance: undefined,
    }
    let skills = {
        experience_skill_alchemy: undefined,
        experience_skill_carpentry: undefined,
        experience_skill_combat: undefined,
        experience_skill_enchanting: undefined,
        experience_skill_farming: undefined,
        experience_skill_fishing: undefined,
        experience_skill_foraging: undefined,
        experience_skill_mining: undefined,
        experience_skill_runecrafting: undefined,
        experience_skill_taming: undefined
    }
    onMount(async () => {
        proDout.loading = true
        let response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/profile/' + id + '/' + profile );
        let output = await response.json();
        let res = await fetch("https://skyproxyjs.cephas8080.workers.dev/fetchuuid/" + id)
        let uuidout = await res.json()        
        proDout = {
            output: output,
            loading: false,
            uuid: uuidout.id
        }
        console.log(output)
        profiledata = {
            bank_balance: reun(proDout.output.profile.banking.balance.toFixed(2)),
            coin_purse: reun(proDout.output.profile.members[proDout.uuid].coin_purse)
        }
        skills = {
        experience_skill_alchemy: reun(proDout.output.profile.members[proDout.uuid].experience_skill_alchemy.toFixed(0)),
        experience_skill_carpentry: reun(proDout.output.profile.members[proDout.uuid].experience_skill_carpentry.toFixed(0)),
        experience_skill_combat: reun(proDout.output.profile.members[proDout.uuid].experience_skill_combat.toFixed(0)),
        experience_skill_enchanting: reun(proDout.output.profile.members[proDout.uuid].experience_skill_enchanting.toFixed(0)),
        experience_skill_farming: reun(proDout.output.profile.members[proDout.uuid].experience_skill_farming.toFixed(0)),
        experience_skill_fishing: reun(proDout.output.profile.members[proDout.uuid].experience_skill_fishing.toFixed(0)),
        experience_skill_foraging: reun(proDout.output.profile.members[proDout.uuid].experience_skill_foraging.toFixed(0)),
        experience_skill_mining: reun(proDout.output.profile.members[proDout.uuid].experience_skill_mining.toFixed(0)),
        experience_skill_runecrafting: reun(proDout.output.profile.members[proDout.uuid].experience_skill_runecrafting.toFixed(0)),
        experience_skill_taming: reun(proDout.output.profile.members[proDout.uuid].experience_skill_taming.toFixed(0))
        }
        console.log(proDout.output.profile.members[proDout.uuid])
        console.log(skills)
    })

</script>
<p class="subtext">{id} skyblock profile: </p>
{#if proDout.loading == true}
<p>waiting</p>
{:else}
<p class="subsubtext">first join:</p>
<p class="subsubtext">bank balance: {toformated(reun(profiledata.bank_balance))}</p>
<p class="subsubtext">coin purse: {toformated(reun(profiledata.coin_purse))}</p>
<p class="subsubtext maincolor">Skills: NOT GONNER COME SOOOOOOON</p>
<p class="subsubtext maincolor">Collection: NOT GONNER COME SOOOOOOON</p>
{/if}
<div class="back-bg"></div>
