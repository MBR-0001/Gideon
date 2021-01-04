import Util from '../../Util.js';
import gideonapi from 'gideon-api';

/**
* @param {Discord.Interaction} interaction
*/
export async function run(interaction) {
    const quote = await gideonapi.quote();
    return interaction.reply(Util.Embed(null, {description: '**' + quote.text + '**', thumbnail: quote.img}, interaction.member));
}

export let help = {
    id: '787027091098173451',
    debug: true, ///
    owner: false,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};