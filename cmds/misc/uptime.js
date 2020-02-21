const Discord = require("discord.js");
const Util = require("../../Util");

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message) => {
    message.channel.send(Util.CreateEmbed('Enter Flashtime!', {description: Util.secondsToDifferenceString(gideon.uptime / 1000, { enableSeconds: true })}));
}

module.exports.help = {
    name: "uptime",
    type: "misc",
    help_text: "uptime",
    help_desc: "Displays the bot's uptime"
}