<style>
.content{
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    margin-left: 1vw;
    margin-right: 1vw;
    margin-top: 1vw;
    margin-bottom: 1vw;
}
.collection-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 8vw;
    height: 8vw;
    margin-bottom: .4vw;
    margin-top: .5vw;
    margin-left: auto;
    margin-right: auto;
}
.stats-name {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}
.collection-amount {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}
@media (max-width: 600px){
    .collection-icon {
    width: 15vw;
    height: 15vw;
    margin-bottom: 2vw;
    margin-top: 2vw;
    }
}
</style>
<script>
    export let ITEMNAME = undefined 
    export let string = undefined
    export let collectiontier = undefined
    export let imageurl = undefined
    export let maxtier = undefined
    function reun(valable){
        if(valable === undefined){
            return 0 
        }else{
            return valable
        }
    }
    function getlevel(){
        if(string === undefined){
            return 0;
        }
        if(string >= maxtier){
            return "MAX"
        }
        for(let i=0;i<collectiontier.length; i++){
            if(collectiontier[i] - string > 0){
                return i - 1
            }
        }
    }
</script>
<div class="content">
<div class="collection-icon"><img src={imageurl} alt="Image {ITEMNAME}" class="collection-icon"></div>
<div class="collection-stats"></div>
<div class="collecion-name">
<span class="stats-name">{ITEMNAME} <span></span><span class="stats-value">{getlevel()}</span>
</div>
<div class="collection-amount"> {reun(string)}</div>

</div>
