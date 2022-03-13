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
        try{
        profiledata = {
            first_join: proDout.output.profile.members[proDout.uuid].first_join,
            bank_balance: reun(proDout.output.profile.banking.balance.toFixed(2)),
            coin_purse: reun(proDout.output.profile.members[proDout.uuid].coin_purse.toFixed(2))
        }
        }catch(err){
            console.log(err)
            profiledata = {
                first_join: undefined,
                bank_balance: undefined,
                coin_purse: undefined
            }
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
        foraging: [
            {name: "Oak Wood", string: coll.LOG, tier: [0,50,100,250,500,1000,2000,5000,10000,30000],maxtier: 30000, image:'/resource/minecraft/textures/blocks/log_oak.png'},
            {name: "Spruce Wood", string: coll["LOG:1"], tier: [0,50,100,250,1000,2000,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/blocks/log_spruce.png'},
            {name: "Birch Wood", string: coll["LOG:2"], tier: [0,50,100,250,1000,2000,5000,10000,25000,50000],maxtier: 50000,image: '/resource/minecraft/textures/blocks/log_birch.png'},
            {name: "Jungle Wood", string: coll["LOG:3"], tier: [0,50,100,250,500,1000,2000,5000,10000,25000],maxtier:25000,image: '/resource/minecraft/textures/blocks/log_jungle.png'},
            {name: "Acacia Wood", string: coll["LOG_2"], tier: [0,50,100,250,500,1000,2000,5000,10000,25000],maxtier:25000,image: '/resource/minecraft/textures/blocks/log_acacia.png'},
            {name: "Dark Oak Wood", string: coll["LOG_2:1"], tier: [0,50, 100, 250, 1000, 2000, 5000, 10000, 15000, 25000],maxtier:25000,image: '/resource/minecraft/textures/blocks/log_big_oak.png'},
        ],
        fishing: [
            {name: "Raw Fish", string: coll["RAW_FISH"], tier: [0, 20, 50, 100, 250, 500, 1000, 2500, 15000, 30000, 45000, 60000],maxtier:60000, image: '/resource/minecraft/textures/items/fish_cod_raw.png'},
            {name: "Raw Salmon", string: coll["RAW_FISH:1"], tier: [0, 20, 50, 100, 250, 500, 1000, 2500, 5000, 10000],maxtier:10000, image: '/resource/minecraft/textures/items/fish_salmon_raw.png'},
            {name: "Clownfish", string: coll["RAW_FISH:2"], tier: [0,10 ,25 , 50, 100, 200, 400, 800],maxtier:800, image: '/resource/minecraft/textures/items/fish_clownfish_raw.png'},
            {name: "Pufferfish", string: coll["RAW_FISH:3"], tier: [0, 20, 50, 100, 150, 400, 800, 2400, 4800, 9000],maxtier:9000, image: '/resource/minecraft/textures/items/fish_pufferfish_raw.png'},
            {name: "Prismarine Shard", string: coll["PRISMARINE_SHARD"], tier: [0,10,25, 50, 100, 200, 400],maxtier:400, image: '/resource/minecraft/textures/items/prismarine_shard.png'},
            {name: "Prismarine Crystal", string: coll["PRISMARINE_CRYSTALS"], tier: [0,10,25, 50, 100, 200, 400, 800],maxtier:800, image: '/resource/minecraft/textures/items/prismarine_crystals.png'},
            {name: "Clay", string: coll["CLAY_BALL"], tier: [0, 50, 100, 250, 1000, 2500],maxtier:2500, image: '/resource/minecraft/textures/items/clay_ball.png'},
            {name: "Lily Pad", string: coll["WATER_LILY"], tier: [0, 10, 50, 100, 200, 500, 1500, 3000, 6000, 10000],maxtier:10000, image: '/resource/minecraft/textures/blocks/waterlily.png'},
            {name: "Ink Sac", string: coll["INK_SACK"], tier: [0, 20, 40, 100, 200, 400, 800, 1500, 2500, 4000],maxtier:4000, image: '/resource/minecraft/textures/items/dye_powder_black.png'},
            {name: "Sponge", string: coll["SPONGE"], tier: [0, 20, 40, 100, 200, 400, 800, 1500, 2500, 4000],maxtier:4000, image: '/resource/minecraft/textures/blocks/sponge.png'},
        ],
        combat: [
            {name: "Rotten Flesh", string: coll["ROTTEN_FLESH"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000, 100000],maxtier: 100000, image: '/resource/minecraft/textures/items/rotten_flesh.png'},
            {name: "Bone", string: coll["BONE"], tier: [0, 50, 100, 250, 500, 1000, 5000, 10000, 25000, 50000, 150000],maxtier: 150000, image: '/resource/minecraft/textures/items/bone.png'},
            {name: "String", string: coll["STRING"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/string.png'},
            {name: "Spider eye", string: coll["SPIDER_EYE"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/spider_eye.png'},
            {name: "Gun powder", string: coll["GUNPOWDER"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/gunpowder.png'},
            {name: "Ender Pearl", string: coll["ENDER_PEARL"], tier: [0, 50, 250, 1000, 2500, 5000, 10000, 15000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/ender_pearl.png'},
            {name: "Blaze Rod", string: coll["BLAZE_ROD"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/blaze_rod.png'},
            {name: "Ghast Tear", string: coll["GHAST_TEAR"], tier: [0, 20, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/ghast_tear.png'},
            {name: "Magma Cream", string: coll["MAGMA_CREAM"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/magma_cream.png'},
            {name: "Slime ball", string: coll["SLIME_BALL"], tier: [0, 50, 100, 250, 1000, 2500, 5000, 10000, 25000, 50000],maxtier: 50000, image: '/resource/minecraft/textures/items/slimeball.png'},
        ],
        mining: [
            {name: "Mithril", string: coll["MITHRIL_ORE"], tier:[0,50,250,1000,2500,5000,10000,250000,500000,1000000],maxtier: 1000000, image: '/resource/minecraft/textures/items/prismarine_crystals.png'}
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
<!---started collection-->
<!---mining-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/stone_pickaxe.png" alt="Mining logo">Mining:</div>
{#each collection.mining as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}

<!---Combat-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/stone_sword.png" alt="Combat logo">Combat:</div>
{#each collection.combat as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}

<!---foraging-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/blocks/sapling_jungle.png" alt="Foraging logo">FORAGING:</div>
{#each collection.foraging as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}

<!---fishing-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/fish_pufferfish_raw.png" alt="Fishing logo">FISHING:</div>
{#each collection.fishing as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
    
<!---ended collection-->

<p class="smalltext">*Note: only count one members in a co-op only</p>
</div>
{:else}
<p class="subsubtext">Not enabled your skills api</p>
{/if}
{/if}
<div class="back-bg"></div>
