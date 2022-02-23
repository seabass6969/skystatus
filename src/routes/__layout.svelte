<style>
    .header{
        font-size: 3vw;
    }
    .image{
        width: 8vw;
        height: 8vw;
        text-align: center;
        margin-top: auto;
        margin-bottom: auto;
        vertical-align: middle
    }

    @media (max-width: 600px){
        .header{
        font-size: 5vw;
        }
        .image{
        width: 10vw;
        height: 10vw;
        }
    }
    a {
        padding-left: 1vw;
        padding-right:1vw;
    }
</style>
<header>
<div class="header">
    <a href="/"><img src="favicon.png" class="image" alt="homeimage" ></a>
    <a href="/bazaar" class="">bazaar</a>
    <a href="/mayor" class="">mayor</a>
<!--
    <a href="/profiles">profiles(not done)</a>
-->
</div>
<br>

</header>
<main>
  <slot />
</main>
<footer></footer>
