<style>
    .back-bg{
    background-image: url('/background/news_opt.webp');
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
    .underline{
        text-decoration: underline;
        text-decoration-color: tan;
    }
</style>
<script>
    async function getNews(){
        let response = await fetch("https://sky-api-proxy.cephas8080.workers.dev/api/News");
        let output = await response.json();
        return output;
    }
    let out = getNews();
</script>
{#await out}
<h1>please waiting</h1>
{:then output}
{#each output["items"] as items}
<p class="secondarycolor underline subtext">title: {items["title"]}</p>
<p class="secondarycolor smalltext">Date it added:{items["text"]}</p>
<a class="secondarycolor smalltext" href={items["link"]}>forum post link</a>
{/each}
{/await}
<div class="back-bg"></div>
