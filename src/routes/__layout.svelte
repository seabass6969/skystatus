<style global>
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
        font-size: 3.8vw;
        }
        .image{
        width: 9vw;
        height: 9vw;
        }
    }
    .link {
        padding-left: .6vw;
        padding-right:.6vw;
    }
</style>
<header>
<div class="header">
    <a class="link" href="/"><img src="/favicon.png" class="image" alt="homeimage" ></a>
    <a class="link" href="/bazaar" >bz</a>
    <a class="link" href="/mayor" >mayor</a>
    <a class="link" href="/news" >news</a>
    <a class="link" href="/locationtracker" >place</a>
    <a class="link" href="/profile">profile</a>
<!--
    <a href="/profiles">profiles(not done)</a>
-->
</div>
<br>

</header>
<main>
  <slot />
</main>
<footer>
</footer>
