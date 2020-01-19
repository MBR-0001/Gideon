const Discord = module.require("discord.js");
const OpenSubtitles = require('opensubtitles-api');
const Util = require("../Util");

module.exports.run = async (gideon, message, args) => {
    const OS = new OpenSubtitles({
        useragent: process.env.OPS_UA,
        username: process.env.OPS_USER,
        password: process.env.OPS_PASS,
        ssl: true
    });

    const es = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle('You must supply a valid episode and season!')
    .setDescription('Acceptable formats: S00E00 and 00x00')
    .setTimestamp()
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    const na = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle('You must supply a lang code, the shows name, season and its episode number!')
    .setDescription(`You can find ISO 639-2 codes [here](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes 'https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes')!`)
    .setTimestamp()
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    const vc = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle('You must supply a valid ISO 639-2 code!')
    .setDescription(`[ISO 639-2 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes 'https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes')`)
    .setTimestamp()
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    //!subs eng flash 3x3
    if (!args[0]) return message.channel.send(na);
    if (args[0].length !== 3) return message.channel.send(vc);

    let agc = args[1];

    const ia = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle(`"${agc}" is not a valid argument!`)
    .setDescription('Available shows:\n**flash**\n**arrow**\n**supergirl**\n**legends**\n**constantine**\n**batwoman**\n**blacklightning**\n**canaries**\n**krypton**\n**lucifer**\n**supesnlois**\n**stargirl**')
    .setTimestamp()
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    let seasonAndEpisode = Util.parseSeriesEpisodeString(args[2]);
    if (!seasonAndEpisode) return message.channel.send(es);

    const shows = [
        {
            id: 'tt3107288',
            title: 'The Flash'
        },
        {
            id: 'tt2193021',
            title: 'Arrow'
        },
        {
            id: 'tt4016454',
            title: 'Supergirl'
        },
        {
            id: 'tt4532368',
            title: 'DC\'s Legends of Tomorrow'
        },
        {
            id: 'tt3489184',
            title: 'Constantine'
        },
        {
            id: 'tt8712204',
            title: 'Batwoman'
        },
        {
            id: 'tt6045840',
            title: 'Black Lightning'
        },
        {
            id: 'tt11012356',
            title: 'Green Arrow and the Canaries'
        },
        {
            id: 'tt4276624',
            title: 'Krypton'
        },
        {
            id: 'tt4052886',
            title: 'Lucifer'
        },
        {
            id: 'tt11192306',
            title: 'Superman & Lois'
        },
        {
            id: 'tt8722888',
            title: 'Stargirl'
        }
    ]

    let show = shows[-1];

    if (agc.match(/(?:flash)/i)) show = shows[0];
    else if (agc.match(/(?:arrow)/i)) show = shows[1];
    else if (agc.match(/(?:supergirl)/i)) show = shows[2];
    else if (agc.match(/(?:legends)/i)) show = shows[3];
    else if (agc.match(/(?:constantine)/i)) show = shows[4];
    else if (agc.match(/(?:batwoman)/i)) show = shows[5];
    else if (agc.match(/(?:blacklightning)/i)) show = shows[6];
    //else if (agc.match(/(?:canaries)/i)) show = shows[7];
    else if (agc.match(/(?:krypton)/i)) show = shows[8];
    else if (agc.match(/(?:lucifer)/i)) show = shows[9];
    //else if (agc.match(/(?:supesnlois)/i)) show = shows[10];
    //else if (agc.match(/(?:stargirl)/i)) show = shows[11];
    else return message.channel.send(ia);
    
    if (!show) return message.channel.send(ia);

    OS.search({
        sublanguageid: args[0],       
        season: seasonAndEpisode.season,
        episode: seasonAndEpisode.episode,
        limit: '5',                 
        imdbid: show.id,           

    }).then(subtitles => {
        const sub = Object.values(subtitles)[0];

        const subs = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle(`Subtitles for: ${show.title} ${seasonAndEpisode.season}x${seasonAndEpisode.episode}`)
        .setDescription(`Here are the 5 best results from opensubtitles.org:`)
        .addField(sub[0].filename, `**[Download SRT](${sub[0].url} '${sub[0].url}')** Lang: \`${sub[0].lang}\` Score: \`${sub[0].score}\``)
        .addField(sub[1].filename, `**[Download SRT](${sub[1].url} '${sub[1].url}')** Lang: \`${sub[1].lang}\` Score: \`${sub[1].score}\``)
        .addField(sub[2].filename, `**[Download SRT](${sub[2].url} '${sub[2].url}')** Lang: \`${sub[2].lang}\` Score: \`${sub[2].score}\``)
        .addField(sub[3].filename, `**[Download SRT](${sub[3].url} '${sub[3].url}')** Lang: \`${sub[3].lang}\` Score: \`${sub[3].score}\``)
        .addField(sub[4].filename, `**[Download SRT](${sub[4].url} '${sub[4].url}')** Lang: \`${sub[4].lang}\` Score: \`${sub[4].score}\``)
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());
            
        message.channel.send(subs);
    }).catch(err => {
        console.log("An error occurred while trying to fetch subtitles: " + err);
        Util.log("An error occurred while trying to fetch subtitles: " + err);

        const er = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle('There were no results for this episode on opensubtitles.org!')
        .setDescription('Try another episode or another language code!')
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());
        return message.channel.send(er);
    });
}

module.exports.help = {
    name: ["subs", "subtitles"],
    type: "general",
    help_text: "subs <lang> <show> <NxNN/SNNENN> ~ N -> number",
    help_desc: "Searches opensubtitles.org for the specified episode"
}