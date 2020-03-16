const Discord = require("discord.js");
const Util = require("../../Util");

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message) => {
    const role = message.guild.me.roles.cache.first().toString();
    message.channel.send(Util.CreateEmbed('Discord mentions syntax:', {
        description: '`Do NOT ignore <>! They are part of the syntax!`\n\n`<@userid>` => <@595328879397437463>\n`<@&roleid>` => ' + role + '\n`<#channelid>` => ' + message.channel.toString() + '\n`<:emojiname:emojiid>` => <:timevault:686676561298063361>\n`<a:emojiname:emojiid>` => <a:siren:669518972407775265>',
    }));       
}

module.exports.help = {
    name: "mentions",
    type: "misc",
    help_text: "mentions",
    help_desc: "Displays Discord mentions syntax"
}