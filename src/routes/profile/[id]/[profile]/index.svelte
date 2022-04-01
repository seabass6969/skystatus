<style>
    .imageofuuid{
        float:left;
        width: 8vw;
        height: 19vw;
        margin-right: 2vw;
        margin-bottom: 1vw;
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
    .skills {
    }
    .scrollable{
        overflow: auto;
        white-space: nowrap;
    }
@media (max-width: 600px){
    .imageofuuid{
        width: 26vw;
        height: 60vw;
        margin-right: 5vw;
    }
}
@media (min-width: 1000px){
    .scrollable{
    }
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
    import ProgressBar from './../../../../component/ProgressBar.svelte'
    import Thinking from './../../../../component/thinking.svelte'
    import CollectionUi from './../../../../component/CollectionUI.svelte'
    import ImageText from './../../../../component/ImageText.svelte'
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
        critical_damage: undefined,
        death_count: undefined,
        total_kills: undefined,
        item_fished: undefined
    }
    let ah_data = {
        ah_fees: undefined,
        ah_earned: undefined,
        ah_solded: undefined,
        ah_spend: undefined,
        ah_bidded: undefined,
        ah_won: undefined
    }
    let giftdata = {
        gift_given: undefined,
        gift_received: undefined
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
            bank_balance: reun(proDout.output.profile.banking.balance.toFixed(2)),
            coin_purse: reun(proDout.output.profile.members[proDout.uuid].coin_purse.toFixed(2)),
                item_fished: reun(proDout.output.profile.members[proDout.uuid].stats.items_fished) 
        }
        }catch(err){
            console.log(err)
            profiledata = {
                last_save: undefined,
                bank_balance: undefined,
                coin_purse: undefined,
                fairy_souls: undefined,
                item_fished: undefined
            }
        }
        profiledata.last_save = proDout.output.profile.last_save,
        profiledata.fairy_souls = reun(proDout.output.profile.members[proDout.uuid].fairy_souls_collected)
        profiledata.critical_damage = reun(proDout.output.profile.members[proDout.uuid].stats.highest_critical_damage.toFixed(1))
        profiledata.death_count = reun(proDout.output.profile.members[proDout.uuid].death_count)
        profiledata.total_kills = reun(proDout.output.profile.members[proDout.uuid].stats.kills)
        ah_data = {
            ah_fees: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_fees),
            ah_earned: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_gold_earned),
            ah_spend: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_gold_spent),
            ah_bidded: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_bids),
            ah_won: reun(proDout.output.profile.members[proDout.uuid].stats.auctions_won),
        }
        giftdata = {
            gift_given: reun(proDout.output.profile.members[proDout.uuid].stats.gifts_given),
            gift_received: reun(proDout.output.profile.members[proDout.uuid].stats.gifts_received)
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
    collection = {
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
            {name: "Mithril", string: coll["MITHRIL_ORE"], tier:[0,50,250,1000,2500,5000,10000,250000,500000,1000000],maxtier: 1000000, image: '/resource/minecraft/textures/items/prismarine_crystals.png'},
            {name: "Cobblestone", string: coll["COBBLESTONE"], tier:[0,50,100,250,1000,2500,5000,10000,25000,40000,70000],maxtier: 70000, image: '/resource/minecraft/textures/blocks/cobblestone.png'},
            {name: "Coal", string: coll["COAL"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/items/coal.png'},
            {name: "Iron Ingot", string: coll["IRON_INGOT"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000,100000,200000,400000],maxtier: 400000, image: '/resource/minecraft/textures/items/iron_ingot.png'},
            {name: "Gold Ingot", string: coll["GOLD_INGOT"], tier:[0,50,100,250,500,1000,2500,5000,10000,25000],maxtier: 25000, image: '/resource/minecraft/textures/items/gold_ingot.png'},
            {name: "Diamond", string: coll["DIAMOND_BLOCK"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/diamond.png'},
            {name: "Lapis Lazuli", string: coll["INK_SACK:4"], tier:[0,50,250,1000,2000,10000,25000,50000,100000, 150000,250000],maxtier: 250000, image: '/resource/minecraft/textures/blocks/lapis_block.png'},
            {name: "Emerald", string: coll["EMERALD"], tier:[0,50,100,250,1000,5000,15000,30000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/items/emerald.png'},
            {name: "Redstone", string: coll["REDSTONE"], tier:[0,100,250,750,1500,3000,5000,10000,25000,50000,200000,400000,600000,800000,1000000,1200000,1400000],maxtier: 1400000, image: '/resource/minecraft/textures/items/redstone_dust.png'},
            {name: "Nether Quartz", string: coll["QUARTZ"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/quartz.png'},
            {name: "OBSIDIAN", string: coll["OBSIDIAN"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/blocks/obsidian.png'},
            {name: "Glowstone", string: coll["GLOWSTONE_DUST"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/glowstone_dust.png'},
            {name: "Gravel", string: coll["GRAVEL"], tier:[0,50,100,250,1000,2500,5000,10000,15000,50000],maxtier: 50000, image: '/resource/minecraft/textures/blocks/gravel.png'},
            {name: "Ice", string: coll["ICE"], tier:[0,50,100,250,500,1000,5000,10000,50000,100000,250000],maxtier: 250000, image: '/resource/minecraft/textures/blocks/ice.png'},
            {name: "NETHERRACK", string: coll["NETHERRACK"], tier:[0,50,250,500,1000,5000],maxtier: 5000, image: '/resource/minecraft/textures/blocks/netherrack.png'},
            {name: "Sand", string: coll["SAND"], tier:[0,50,250,500,1000,2500,5000],maxtier: 2500, image: '/resource/minecraft/textures/blocks/sand.png'},
            {name: "End Stone", string: coll["ENDER_STONE"], tier:[0,50,100,250,1000,2500,5000,10000,15000,25000],maxtier: 25000, image: '/resource/minecraft/textures/blocks/end_stone.png'},
        ],

        farming: [
            {name: "Wheat", string: coll["WHEAT"], tier:[0,50,100,250,500,1000,2500,10000,15000,25000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/items/wheat.png'},
            {name: "Carrot", string: coll["CARROT_ITEM"], tier:[0,100,250,500,1700,5000,10000,25000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/items/carrot.png'},
            {name: "Potato", string: coll["POTATO_ITEM"], tier:[0,100,200,500,1750,5000,10000,25000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/items/potato.png'},
            {name: "Pumpkin", string: coll["PUMPKIN"], tier:[0,40,100,250,1000,2500,5000,10000,25000,50000,100000,250000],maxtier: 250000, image: '/resource/minecraft/textures/blocks/pumpkin_side.png'},
            {name: "Melon", string: coll["MELON"], tier:[0,250,500,1250,5000,15500,25000,50000,100000,250000],maxtier: 250000, image: '/resource/minecraft/textures/items/melon.png'},
            {name: "Seed", string: coll["SEEDS"], tier:[0,50,100,250,1000,2500,5000],maxtier: 5000, image: '/resource/minecraft/textures/items/seeds_wheat.png'},
            {name: "Mushroom", string: coll["MUSHROOM_COLLECTION"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/blocks/mushroom_red.png'},
            {name: "Cocoa bean", string: coll["INK_SACK:3"], tier:[0,75,200,500,2000,5000,10000,20000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/misc/unknown_server.png'},
            {name: "Cactus", string: coll["CACTUS"], tier:[0,100,250,500,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/blocks/cactus_side.png'},
            {name: "Sugar Cane", string: coll["SUGAR_CANE"], tier:[0,100,250,500,1000,2000,5000,10000,20000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/sugar.png'},
            {name: "Feather", string: coll["FEATHER"], tier:[0,50,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/feather.png'},
            {name: "Leather", string: coll["LEATHER"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000,100000],maxtier: 100000, image: '/resource/minecraft/textures/items/leather.png'},
            {name: "Pork Chop", string: coll["PORK"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/porkchop_raw.png'},
            {name: "Chicken", string: coll["RAW_CHICKEN"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/chicken_raw.png'},
            {name: "Mutton", string: coll["MUTTON"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/mutton_raw.png'},
            {name: "Rabbit", string: coll["RABBIT"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000],maxtier: 50000, image: '/resource/minecraft/textures/items/rabbit_raw.png'},
            {name: "Nether Wart", string: coll["NETHER_STALK"], tier:[0,50,100,250,1000,2500,5000,10000,25000,50000,75000,100000,250000],maxtier: 250000, image: '/resource/minecraft/textures/items/nether_wart.png'},

        ], 
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
<Thinking />
{:else}
<img src="https://crafatar.com/renders/body/{proDout.uuid}?overlay" alt="" class="imageofuuid">
<div class="floatright">
<p class="subsubtext">last save: {reun(profiledata.last_save)}</p>
<p class="subsubtext">bank balance: {toformated(reun(profiledata.bank_balance))}</p>
<p class="subsubtext">coin purse: {toformated(reun(profiledata.coin_purse))}</p>
<p class="subsubtext">fairy souls: {reun(profiledata.fairy_souls)}</p>
</div>
<br>

{#if skills.experience_skill_taming !== undefined}
<div class="skills">
<span class="subheader subtext">Skills</span>
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
{#if coll !== undefined}
<div class="statscotent">
<!---started collection-->
<span class="subheader subtext">Collection</span>
<!---farming-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/stone_hoe.png" alt="Farming logo">Farming:</div>
    <div class="scrollable">
{#each collection.farming as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
    </div>

<!---mining-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/stone_pickaxe.png" alt="Mining logo">Mining:</div>
    <div class="scrollable">
{#each collection.mining as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
    </div>

<!---Combat-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/stone_sword.png" alt="Combat logo">Combat:</div>
    <div class="scrollable">
{#each collection.combat as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
    </div>
<!---foraging-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/blocks/sapling_jungle.png" alt="Foraging logo">FORAGING:</div>
    <div class="scrollable">
{#each collection.foraging as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
    </div>

<!---fishing-->
<div class="subsubtext"><img class="normalimage" src="/resource/minecraft/textures/items/fish_pufferfish_raw.png" alt="Fishing logo">FISHING:</div>
    <div class="scrollable">
{#each collection.fishing as item}
<CollectionUi ITEMNAME={item.name} string={item.string} collectiontier={item.tier} maxtier={item.maxtier} imageurl={item.image}/>
{/each}
    </div>
<!---ended collection-->

<p class="smalltext">*Note: only count one members in a co-op only</p>
<span class="subheader subtext">Top kills & deaths</span>
<p class="smalltext">Total Deaths {reun(profiledata.death_count)}</p>
<p class="smalltext">Total Kills {reun(profiledata.total_kills)}</p>
<br>

<span class="subheader subtext">Miscellaneous</span>
<p class="smalltext"><img src="/resource/minecraft/textures/items/fish_cod_raw.png" alt="">Items fished: {reun(profiledata.item_fished)}</p>
<p class="smalltext"><img src="/resource/minecraft/textures/items/iron_sword.png" alt="">  Highest Critical damage {reun(profiledata.critical_damage)}</p>
<span class="subsubtext"><img src="/resource/minecraft/textures/items/diamond.png" alt="">Auction House:</span>
<p class="smalltext">Total spending: {toformated(reun(ah_data.ah_spend))}</p>
<p class="smalltext">Total earning: {toformated(reun(ah_data.ah_earned))}</p>
<p class="smalltext">Auction fees: {toformated(reun(ah_data.ah_fees))}</p>
<p class="smalltext">Bids: {toformated(reun(ah_data.ah_bidded))}</p>
<p class="smalltext">Wons: {toformated(reun(ah_data.ah_won))}</p>
</div>
<span class="subsubtext"><img src="/resource/minecraft/textures/items/diamond.png" alt="">Gift:</span>
<p class="smalltext">Gift given: {reun(giftdata.gift_given)}</p>
<p class="smalltext">Gift received: {reun(giftdata.gift_received)}</p>
{:else}
<p class="subsubsubtext">Not enabled your skills api</p>
{/if}
{/if}
<div class="back-bg"></div>
