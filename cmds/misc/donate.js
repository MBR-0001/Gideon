const Discord = require("discord.js");
const Util = require("../../Util");

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message) => {
    message.channel.send(Util.CreateEmbed('Donations', {
        description: 'Donations are gladly accepted. \nPlease send them to one of the options below. \nDonating supports the development, maintenance and hosting of this project. \nThank you!',
        thumbnail: 'https://i.imgur.com/f3fvsRe.png',
        fields: [
            {
                name: 'PayPal',
                value: `[Paypal.me](https://www.paypal.me/adrifcastr 'https://www.paypal.me/adrifcastr')`
            },
            {
                name: 'Patreon',
                value: `[Patreon.com](https://www.patreon.com/gideonbot 'https://www.patreon.com/gideonbot')`
            }
        ]
    }));
}

module.exports.help = {
    name: ["donate", "paypal", "patreon"],
    type: "misc",
    help_text: "donate",
    help_desc: "Displays info to support maintainance and hosting of Gideon",
    owner: false,
    voice: false,
    timevault: false,
    roles: [],
    user_perms: [],
    bot_perms: []
}