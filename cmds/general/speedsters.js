const Discord = require("discord.js");
const fetch = require('node-fetch');
const Util = require("../../Util");

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message, args) => {
    const na = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle('You must supply a speedsters name or alter ego and their home universe!')
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    if (!args[0]) return message.channel.send(na);

    const api = `https://api.myjson.com/bins/m8m3d`;
    let ssd = args.join(' ');

    const ia = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle(`"${ssd}" is not a valid argument!`)
    .setDescription('Check the command\'s syntax and retry!')
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    let spnum;

    if (ssd.match(/(?:flash)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:barry)/i) && ssd.match(/(?:e1)/i)) spnum = 0;
    else if (ssd.match(/(?:reverse)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:eobard)/i) && ssd.match(/(?:e1)/i)) spnum = 1;
    else if (ssd.match(/(?:zoom)/i) && ssd.match(/(?:e2)/i) || ssd.match(/(?:hunter)/i) && ssd.match(/(?:e2)/i)) spnum = 2;
    else if (ssd.match(/(?:savitar)/i) && ssd.match(/(?:e1)/i)) spnum = 3;
    else if (ssd.match(/(?:godspeed)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:august)/i) && ssd.match(/(?:e1)/i)) spnum = 4;
    else if (ssd.match(/(?:red)/i) && ssd.match(/(?:e52)/i)) spnum = 5;
    else if (ssd.match(/(?:accelerated)/i) && ssd.match(/(?:e19)/i)) spnum = 6;
    else if (ssd.match(/(?:quick)/i) && ssd.match(/(?:e2)/i) || ssd.match(/(?:wells)/i) && ssd.match(/(?:e2)/i)) spnum = 7;
    else if (ssd.match(/(?:flash)/i) && ssd.match(/(?:e3)/i) || ssd.match(/(?:jay)/i) && ssd.match(/(?:e3)/i)) spnum = 8;
    else if (ssd.match(/(?:rival)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:edward)/i) && ssd.match(/(?:e1)/i)) spnum = 9;
    else if (ssd.match(/(?:trajectory)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:eliza)/i) && ssd.match(/(?:e1)/i)) spnum = 10;
    else if (ssd.match(/(?:music)/i) || ssd.match(/(?:meister)/i)) spnum = 11;
    else if (ssd.match(/(?:oliver)/i) && ssd.match(/(?:e1)/i)) spnum = 12;
    else if (ssd.match(/(?:amazo)/i) && ssd.match(/(?:e1)/i)) spnum = 13;
    else if (ssd.match(/(?:flash)/i) && ssd.match(/(?:e90)/i) || ssd.match(/(?:barry)/i) && ssd.match(/(?:e90)/i)) spnum = 14;
    else if (ssd.match(/(?:kid)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:wally)/i) && ssd.match(/(?:e1)/i)) spnum = 15;
    else if (ssd.match(/(?:iris)/i) && ssd.match(/(?:e1)/i)) spnum = 16;
    else if (ssd.match(/(?:XS)/i) && ssd.match(/(?:e1)/i) || ssd.match(/(?:nora)/i) && ssd.match(/(?:e1)/i)) spnum = 17;
    else return message.channel.send(ia);

    try {
        const body = await fetch(api).then(res => res.json());

        const speedster = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle(`${body[spnum].speedster}`)
        .addField(`*Lightning Color(s) (Electrokinesis)*`, `${body[spnum].lightningColorsElectrokinesis}`)
        .addField(`*Universe*`, `${body[spnum].universe}`)
        .addField(`*Actor/Actress*`, `${body[spnum].actoractress}`)
        .addField(`*First Appearance*`, `${body[spnum].firstAppearance}`)
        .addField(`*First Appearance as Speedster*`, `${body[spnum].firstAppearanceAsSpeedster}`)
        .setThumbnail(body[spnum].image)
        .setFooter(Util.config.footer, gideon.user.avatarURL());
    
        message.channel.send(speedster);
    }
    
    catch (err) {
        console.log("An error occurred while trying to fetch speedsters: " + err);
        Util.log("An error occurred while trying to fetch speedsters: " + err);

        const er = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle('Failed to fetch speedster data, please try again later!')
        .setFooter(Util.config.footer, gideon.user.avatarURL());
        return message.channel.send(er);
    }
}
module.exports.help = {
    name: ["sp", "speedster", "speedsters"],
    type: "general",
    help_text: "sp <name/alter ego> eN (earth number)",
    help_desc: "Fetches Speedster info"
}