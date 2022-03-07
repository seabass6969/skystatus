<script>
    let lv = [0	,
50	,
175	,
375	,
675	,
1175	,
1925	,
2925	,
4425	,
6425	,
9925	,
14925	,
22425,
32425,
47425,
67425,
97425,
147425,
222425,
322425,
522425	,
822425	,
1222425	,
1722425	,
2322425	,
3022425	,
3822425	,
4722425	,
5722425	,
6822425	,
8022425	,
9322425	,
10722425	,
12222425	,
13822425	,
15522425	,
17322425	,
19222425	,
21222425	,
23322425	,
25522425	,
27822425	,
30222425	,
32722425	,
35322425	,
38072425	,
40972425	,
44072425	,
47472425	,
51172425	,
55172425	,
59472425	,
64072425	,
68972425	,
74172425	,
79672425	,
85472425	,
91572425	,
97972425	,
104672425	,
111672425]
    function roundup(number){
        if(number !== undefined){
        let test = number 
        let level = 0
        for(let i = 0; i<lv.length;i++){
        test = number 
            
            if(test>lv[i]){
                test = test - lv[i]
                level ++
            }
        }
        console.log(level)
        console.log(test/lv[level] * 100)
        return test/lv[level] * 100
        }else{
            return 0
        }
    };
    export let xp = undefined;
    export let image = "";
    image = "";
</script>
<style>
.barObject{
    width: calc(50vw - 30px);
    height: 1.5vw;
    background-color: #595756;
    border-radius: 15px;
}
.barContent{
    background-color: #bf00c1;
    height: 1.5vw;
    border-radius: 15px;
}
</style>
<div class="barObject">
<div class="barContent" style="width: calc((50vw - 30px)*{roundup(xp)}/100);"></div>
</div>
