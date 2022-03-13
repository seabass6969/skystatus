<script>
    export let text = ""
    function mainreplace(text){
        let StringText = String(text)
        let replaceabletext = [
            {name:'§a',done: ''},
            {name:'§b',done: ''},
            {name:'§c',done: ''},
            {name:'§d',done: ''},
            {name:'§e',done: ''},
            {name:'§f',done: ''},
            {name:'§g',done: ''},
            {name:'§k',done: ''},
            {name:'§l',done: ''},
            {name:'§m',done: ''},
            {name:'§n',done: ''},
            {name:'§o',done: ''},
            {name:'§r',done: ''},
            {name:'§0',done: ''},
            {name:'§1',done: ''},
            {name:'§2',done: ''},
            {name:'§3',done: ''},
            {name:'§4',done: ''},
            {name:'§5',done: ''},
            {name:'§6',done: ''},
            {name:'§7',done: ''},
            {name:'§8',done: ''},
            {name:'§9',done: ''},
        ];
        for(let i=0; i < replaceabletext.length; i++){
            StringText = StringText.replaceAll(replaceabletext[i]['name'],replaceabletext[i]['done'])
        }
        return StringText;
    };
    let string = "</p>"
</script>
{@html mainreplace(text)}
