<script>
    import Router from 'svelte-spa-router'
    import ah from './routes/ah.svelte'
    import bazaar from './routes/bazaar.svelte'
    import contactme from './routes/contactme.svelte'
    import __error from './routes/__error.svelte'
    import index from './routes/index.svelte'
    import Layout from './routes/Layout.svelte'
    import locationtracker from './routes/locationtracker.svelte'
    import mayor from './routes/mayor.svelte'
    import minion from './routes/minion.svelte'
    import news from './routes/news.svelte'
    import profile from './routes/profile.svelte'
    const routes = {
        '/': index,
        '/ah': ah,
        '/bazaar': bazaar,
        '/contactme': contactme,
        '/locationtracker': locationtracker,
        '/mayor': mayor,
        '/minion': minion,
        '/news': news,
        '/profile': profile,
        '*': __error
    }
</script>
<Layout />
<Router routes={routes} />
