import Util from '../../Util.js';

/**
 * @param {Discord.Intercation} interaction
 */
export async function run(interaction) {
    interaction.reply(Util.Embed('Enter Flashtime!', {description: Util.secondsToDifferenceString(process.gideon.uptime / 1000, { enableSeconds: true })}, interaction.member));
}

export const help = {
    id: '786982537960489000',
    owner: true,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};