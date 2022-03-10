<style>
.content{
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
}
.collection-icon {
    float: left;
    width: 5vw;
    height: 5vw;
    vertical-align: middle;
    position: relative;
margin-left: .2vw;
margin-top: .2vw
}
</style>
<script>
    export let ITEMNAME = undefined 
    export let string = undefined
    export let collectiontier = undefined
    export let imageurl = undefined
    function getlevel(){
        for(let i=0;i<collectiontier.length; i++){
            if(collectiontier[i] - string > 0){
                return i
            }
        }
    }
</script>
<div class="content">
<div class="collection-icon"><img src={imageurl} alt="Image logo for {ITEMNAME}" class="collection-icon"></div>
<div class="collection-stats"></div>
<div class="collecion-name">
<span class="subsubtext stats-name">{ITEMNAME} <span></span><span class="subsubtext stats-value">{getlevel()}</span>
</div>
<div class="collection-amount">Amount: {string}</div>
</div>
