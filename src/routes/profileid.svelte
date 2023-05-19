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
<script>
    import ProgressBar from './../component/ProgressBar.svelte'
    import Thinking from './../component/thinking.svelte'
    import CollectionUi from './../component/CollectionUI.svelte'
    import {collections} from './../resource/profile_resources'
    import {reun,toformated} from './../resource/util_profile'

const init = {
    headers: {
      'content-type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    },
  };
    export let params = {};
    let id = params.id;
    let profile = params.profile;

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
    let coll = undefined;
    let collection = {}
    startup()
    async function startup(){ 
        proDout.loading = true
        let response = await fetch('https://skystatusback.onrender.com/api/profile/' + id + '/' + profile, init);
        let output = await response.json();
        let res = await fetch("https://skystatusback.onrender.com/fetchuuid/" + id.replaceAll(" ",""), init)
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
    collection = collections(coll)
    }
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
