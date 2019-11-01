const Discord = module.require("discord.js");
const Util = require("../Util");

module.exports.run = async (gideon, message, args) => {
    const uptime_embed = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle('Enter Flashtime!')
    .setDescription(Util.secondsToDifferenceString(gideon.uptime / 1000, { enableSeconds: true }))
    .setTimestamp()
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    message.channel.send(uptime_embed);
}

module.exports.help = {
    name: "uptime",
    type: "misc",
    help_text: "uptime",
    help_desc: "Displays the bot's uptime"
}