import Discord from 'discord.js';

/**
 * @param {Discord.Message} message
 */
export async function run(message) {
    if (process.gideon.user.tag !== 'gideon-dev#4623') return;

    const channel = process.gideon.guilds.cache.get('595318490240385037').channels.cache.get('669243069878501385');
    const role = process.gideon.guilds.cache.get('595318490240385037').roles.cache.get('595334594149220368');

    if (channel.permissionsFor(role).has('VIEW_CHANNEL')) {
        message.reply('Devmode enabled! :white_check_mark:');
        channel.permissionOverwrites.get(role.id).update({
            VIEW_CHANNEL: false
        }).catch(ex => console.log(ex));
    }

    else {
        message.reply('Devmode disabled! :white_check_mark:');
        channel.permissionOverwrites.get(role.id).update({
            VIEW_CHANNEL: true
        }).catch(ex => console.log(ex));
    }

}

export const help = {
    name: 'devmode',
    type: 'owner',
    help_text: 'devmode',
    help_desc: 'Toggles devmode',
    owner: true,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};