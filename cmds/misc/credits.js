import Util from '../../Util.js';

/**
 * @param {Discord.Message} message
 */
export async function run(message) {

    const fields = [
        {name: 'adrifcastr', value: 'Development, maintenance & domain'},
        {name: 'MBR#0001', value: 'Development, support, & hosting'},
        {name: 'Klaus#5857', value: 'Website development'},
        {name: 'Stevenson Johnson', value: 'Artwork'},
        {name: 'AceFire6', value: 'Development & hosting of [arrowverse.info](https://arrowverse.info) and its [API](https://arrowverse.info/api)'},
        {name: '7coil', value: 'PR [#24](https://github.com/adrifcastr/Gideon/pull/24) and [#25](https://github.com/adrifcastr/Gideon/pull/25)'}
    ];

    return message.channel.send(Util.Embed('Development Credits:', {fields: fields, thumbnail: process.gideon.user.avatarURL()}, message.member));
}

export let help = {
    name: 'credits',
    type: 'misc',
    help_text: 'credits',
    help_desc: 'Displays people who contributed to development of this bot',
    owner: false,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};