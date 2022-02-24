<style>
    .back-bg{
    background-image: url('/background/main.png');
    filter: blur(2px);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    }
    .textspecial {
        background: linear-gradient(
            to right,
            #bf00c1 0%,
            #FE5F55 30%,
            #DDD92A 50%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>
<script>

</script>
<svelte:head>
<title>home page</title>
</svelte:head>
<h1 class="secondarycolor subtext">The all in one skyblock website</h1>
<h1 class="subtext textspecial">for you</h1>
<div class="back-bg"></div>
