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
    .skills {
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
    import CollectionUi from './../../component/CollectionUI.svelte'
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
    let collection = {
    }
    let coll = undefined;
    onMount(async () => {
        proDout.loading = true
        let response = await fetch('https://skyproxyjs.cephas8080.workers.dev/api/profile/' + id + '/' + profile );
        let output = await response.json();
        let res = await fetch("https://skyproxyjs.cephas8080.workers.dev/fetchuuid/" + id.replaceAll(" ",""))
        let uuidout = await res.json()        
        proDout = {
            output: output,
            loading: false,
            uuid: uuidout.id
        }
        console.log(output)
        profiledata = {
        first_join: proDout.output.profile.members[proDout.uuid].first_join,
            bank_balance: reun(proDout.output.profile.banking.balance.toFixed(2)),
            coin_purse: reun(proDout.output.profile.members[proDout.uuid].coin_purse.toFixed(2))
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
    coll = reun(proDout.output.profile.members[proDout.uuid].collection)
    console.log(coll)
    collection = {
        farming: [{name:"Wheat", string: coll.WHEAT},{name:"Carrot", string: coll.CARROT_ITEM }],
        foraging: [{name: "Oak Wood", string: coll.LOG, tier: [0,50,100,250,500,1000,2000,5000,10000,30000],maxtier: 30000, image:'/resource/minecraft/textures/blocks/log_oak.png'},
            {name: "Spruce Wood", string: coll["LOG:1"], tier: [0,50,100,250,1000,2000,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/blocks/log_spruce.png'},
            {name: "Birch Wood", string: coll["LOG:2"], tier: [0,50,100,250,1000,2000,5000,10000,25000,50000],maxtier: 50000,image: '/resource/minecraft/textures/blocks/log_birch.png'},
            {name: "Jungle Wood", string: coll["LOG:3"], tier: [0,50,100,250,500,1000,2000,5000,10000,25000],maxtier:25000,image: '/resource/minecraft/textures/blocks/log_jungle.png'},
            {name: "Acacia Wood", string: coll["LOG_2"], tier: [0,50,100,250,500,1000,2000,5000,10000,25000],maxtier:25000,image: '/resource/minecraft/textures/blocks/log_acacia.png'},
            {name: "Dark Oak Wood", string: coll["LOG_2:1"], tier: [0,50, 100, 250, 1000, 2000, 5000, 10000, 15000, 25000],maxtier:25000,image: '/resource/minecraft/textures/blocks/log_big_oak.png'},
            ]
    }
        // 50, 100, 250, 1000, 2000, 5000, 10000, 15000, 25000
        // console.log(proDout.output.profile.members[proDout.uuid])
    })
</script>

<svelte:head>
<title>{id} profile</title>
</svelte:head>

<p class="subtext">{id} profile: </p>
{#if proDout.loading == true}
<p>waiting</p>
{:else}
<p class="subsubtext">Last logon: {Date(profiledata.first_join)}</p>
<p class="subsubtext">bank balance: {toformated(reun(profiledata.bank_balance))}</p>
<p class="subsubtext">coin purse: {toformated(reun(profiledata.coin_purse))}</p>
<p class="subsubtext maincolor">Skills:</p>
{#if skills.experience_skill_taming !== undefined}
<div class="skills">
<ProgressBar xp={skills.experience_skill_taming} text="Taming" Image="/resource/minecraft/textures/items/spawn_egg_overlay.png"/>
<ProgressBar xp={skills.experience_skill_mining} text="Mining" Image="/resource/minecraft/textures/items/stone_pickaxe.png"/>
<ProgressBar xp={skills.experience_skill_foraging} text="Foraging" Image="/resource/minecraft/textures/blocks/sapling_jungle.png"/>
<ProgressBar xp={skills.experience_skill_enchanting} text="Enchanting" Image="/resource/minecraft/textures/blocks/enchanting_table_top.png"/>
<ProgressBar xp={skills.experience_skill_carpentry} text="Carpentry" Image="/resource/minecraft/textures/blocks/crafting_table_top.png"/>
<ProgressBar xp={skills.experience_skill_farming} text="Farming" Image="/resource/minecraft/textures/items/gold_hoe.png"/>
<ProgressBar xp={skills.experience_skill_combat} text="Combat" Image="/resource/minecraft/textures/items/stone_sword.png"/>
<ProgressBar xp={skills.experience_skill_fishing} text="Fishing" Image="/resource/minecraft/textures/items/fishing_rod_uncast.png"/>
<ProgressBar xp={skills.experience_skill_alchemy} text="Alchemy" Image="/resource/minecraft/textures/items/brewing_stand.png"/>
<ProgressBar xp={skills.experience_skill_runecrafting} text="Runecrafting" Image="/resource/minecraft/textures/items/magma_cream.png"/>
</div>
{:else}
<p class="subsubtext">Not enabled your skills api</p>
{/if}
<p class="subsubtext maincolor">Collection: NOT GONNER COME SOOOOOOON</p>
{#if coll !== undefined}
<div class="statscotent">
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/blocks/sapling_jungle.png" alt="">FORAGING:</div>
{#each collection.foraging as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
<p class="smalltext">*Note: only count one members in a co-op only</p>
</div>
{:else}
<p class="subsubtext">Not enabled your skills api</p>
{/if}
{/if}
<div class="back-bg"></div>
