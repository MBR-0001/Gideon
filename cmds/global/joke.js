import Discord from 'discord.js';
import Util from '../../Util.js';

/**
 * @param {Discord.Intercation} interaction
 * @param {object[]} args
 */
export async function run(interaction, args) {
    let type = 'Any';

    let types = {
        Programming: ['prog', 'program', 'programming'],
        Miscellaneous: ['miscellaneous', 'misc'],
        Dark: ['dark'],
    };

    if (args) {
        let p_type = args[0].value;
        for (let key in types) {
            if (types[key].includes(p_type)) type = key;
        }
    }

    const url = 'https://sv443.net/jokeapi/v2/joke/' + type + '?type=single';
    const body = await Util.fetchJSON(url);

    let category = process.gideon.cache.jokes.get(body.category);

    if (!category) {
        process.gideon.cache.jokes.set(body.category, new Discord.Collection([[body.id, body.joke]]));
        category = process.gideon.cache.jokes.get(body.category);
    }

    if (!category.has(body.id)) category.set(body.id, body.joke);

    if (!interaction.guild.last_jokes) interaction.guild.last_jokes = [];

    let last_jokes = interaction.guild.last_jokes;

    if (last_jokes.length > 0) {
        //if last 20 jokes include the current joke
        if (last_jokes.some(x => x.category == body.category && x.id == body.id)) {
            console.log('Got a repeated joke: ' + body.id);
            let new_id = '';
            let attempts = 0;

            do {
                new_id = category.randomKey();
                attempts++;

                if (attempts > 50) {
                    console.log('Failed to find a unique joke after 50 attempts!');
                    break;
                }
            }
            while (last_jokes.map(x => x.id).includes(new_id));

            body.id = new_id;
            body.joke = category.get(new_id);
        }
    }

    interaction.guild.last_jokes.push({category: body.category, id: body.id});

    if (interaction.guild.last_jokes.length > 20) interaction.guild.last_jokes.shift();

    return interaction.reply(Util.Embed('Category: ' + body.category, {description: body.joke}, interaction.member));       
}

export let help = {
    id: '788771398448578562',
    owner: false,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};