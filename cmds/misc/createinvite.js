const Discord = require("discord.js");
const Util = require("../../Util");

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message, args) => {
    let guild;

    if (!args[0]) return message.channel.send(as);
    if (args[1]) return message.channel.send(as);
    let noid = isNaN(args[0]);

    if (!noid && args[0].length === 18) guild = gideon.guilds.cache.get(args[0]);
    else return message.channel.send(as);

    try {
        let textchannels = guild.channels.cache.filter(c=> c.type == "text");
        let invitechannels = textchannels.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
        if (!invitechannels.size) return message.reply('no channels found to create instant invite!');

        invitechannels.random().createInvite().then(invite=> message.channel.send('Found Invite:\n' + 'https://discord.gg/' + invite.code));
    }
    
    catch (ex) {
        console.log("Caught an exception while creating invites!: " + ex);
        Util.log("Caught an exception while creating invites!: " + ex);
        return message.channel.send(er);
    }      
}

module.exports.help = {
    name: ["civ", "create"],
    type: "misc",
    help_text: "civ <guildid>",
    help_desc: "Attempts to create instant invite"
}