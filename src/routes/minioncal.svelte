<svelte:head>
<title>minion calculator</title>
</svelte:head>

<script>
    function Clicksubmit(){
        console.log("click submit")

    }
</script>
<form on:submit|preventDefault={Clicksubmit}></form>
