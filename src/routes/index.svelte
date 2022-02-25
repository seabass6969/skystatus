<style>
    .back-bg{
    background-image: url('/background/main_opt.webp');
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
    .textspecial {
        background: linear-gradient(
            to right,
            #bf00c1 0%,
            #FE5F55 50%,
            #DDD92A 90%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>

<svelte:head>
<title>sky home</title>
</svelte:head>
<h1 class="secondarycolor textspecial">The all in one skyblock website for you</h1>
<div class="back-bg"></div>
