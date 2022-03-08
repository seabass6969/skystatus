<script>
  let lv = [
    0,
    50, 125, 200, 300, 500, 750, 1000, 1500, 2000, 3500, 5000, 7500, 10000,
    15000, 20000, 30000, 50000, 75000, 100000, 200000, 300000, 400000, 500000,
    600000, 700000, 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000,
    1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000,
    2300000, 2400000, 2500000, 2600000, 2750000, 2900000, 3100000, 3400000,
    3700000, 4000000
  ]
let reallv = [
  0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425,
  47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425, 1722425,
  2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425, 9322425,
  10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425,
  23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 38072425,
  40972425, 44072425, 47472425, 51172425, 55172425, 59472425, 64072425,
  68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425,
  111672425
]
let finallevel = 0

    function roundup(number){
        if(number !== undefined){
        let test = number 
        let level = 0
        for(let i = 0; i<60;i++){
            if(test>lv[i]){
                test = test - lv[i]
                level ++
            }
        }
        let finallevel = level 
        return [(test/lv[level] * 100).toFixed(2), level - 1]
        }else{
            return [0,0]
        }
    };
    export let xp = undefined;
    export let Image = undefined;
    export let text = undefined
</script>
<style>
.IMG{
    width:3vw;
    height:3vw;
    margin-left: auto;
    margin-right: auto;
}
.barObject{
    width: calc(50vw - 30px);
    position: relative;
    height: 2vw;
    background-color: #595756;
    border-radius: 15px; }
.barContent{
    background-color: #bf00c1;
    position: relative;
    height: 2vw;
    border-radius: 15px;
}
.bar{
}
.barIMG{
    background-color: #bf00c1;
    position: relative;
    top:22px;
    left: -0.5vw;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    z-index:10;
    filter: drop-shadow(4px 4px 4px rgba(0,0,0,0.4));
    display: table-cell;
    display: flex;
    justify-content: center;
    align-items: center;
}
.barText{
    left: 55px;
    width:200px;
    position: absolute;
}
@media (max-width: 600px){
    .barObject{
    height: 4vw;
    }
    .barContent{
    height: 4vw;
    }
    .barText{
    left: 50px;
    }
    .barIMG{
    width: 10vw;
    height: 10vw;
    }
    .IMG{
    width:6vw;
    height:6vw;
    }
}
</style>
<div class="bar">
<p class="barText">{text} {roundup(xp)[1]}</p>
<div class="barIMG">
<img src={Image} alt="Progress Bar Icon" class="IMG">
</div>
<div class="barObject">
<div class="barContent" style="width: calc((50vw - 30px)*{roundup(xp)[0]}/100);"></div>
</div>
</div>
