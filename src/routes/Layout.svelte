<script>
import {link} from 'svelte-spa-router'
</script>
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
<div class="header">
    <a class="link" href="/" use:link><img src="/favicon.png" class="image" alt="homeimage" ></a>
    <a class="link" href="/bazaar" use:link>bz</a>
    <a class="link" href="/mayor" use:link>mayor</a>
    <a class="link" href="/news" use:link>news</a>
    <a class="link" href="/locationtracker" use:link>place</a>
    <a class="link" href="/profile" use:link>profile</a>
    <a class="link" href="/contactme" use:link>me</a>
</div>
<br>

