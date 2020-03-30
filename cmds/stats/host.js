const Discord = require("discord.js");
const Util = require("../../Util");
const si = require('systeminformation');

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message) => {     
    try {
        let sent = await message.channel.send(Util.CreateEmbed('Gathering host info, please wait...'));

        const cpu = await si.cpu().catch(console.error);
        const curspeed = await si.cpuCurrentspeed().catch(console.error);
        const curtemp = await si.cpuTemperature().catch(console.error);
        const mem = await si.mem().catch(console.error);
        const os = await si.osInfo().catch(console.error);
        const load = await si.currentLoad().catch(console.error);
        const net = await si.networkInterfaces().catch(console.error);

        const embed = Util.CreateEmbed('Hosting server stats:', {
            fields: [
                {
                    name: `❯ CPU:`,
                    value: `CPU: \`${cpu.manufacturer} ${cpu.brand} @${cpu.speedmax} GHz\`\nCurrent Speed: \`${curspeed.avg} GHz\``
                },
                {
                    name: `❯ Memory:`,
                    value: `RAM Usage: \`${Math.round(mem.used/1e+6)} MB / ${Math.round(mem.total/1e+6)} MB\``
                },
                {
                    name: `❯ OS:`,
                    value: `OS: \`${os.platform}\`\nDistro: \`${os.distro}\``
                },
                {
                    name: `❯ Load:`,
                    value: `Current CPU Load: \`${Math.round(load.currentload)} %\``
                }
            ]
        })
    
        await sent.edit(embed);
        
    } catch (ex) {
        console.log(ex);
        Util.log("Caught an exception while running host.js: " + ex.stack);
        return message.channel.send(Util.CreateEmbed('An error occured while executing this command!'));
    }
}

module.exports.help = {
    name: ['host', 'server'],
    type: "stats",
    help_text: "host",
    help_desc: "Hosting server stats",
    owner: false,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
}