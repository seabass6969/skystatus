<style>
    .header{
        font-size: 5vw;
    }
    @media (max-width: 600px){
    .header{
        font-size: 9vw;
    }
    }
    .image{
        width: 8vw;
        height: 8vw;
        text-align: center;
        margin-top: auto;
        margin-bottom: auto;
        vertical-align: middle
    }
</style>
<header>
<div class="header">
    <img src="favicon.png" class="image">
    <a href="/bazaar" class="secondarycolor">bazaar(in dev)</a>
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
