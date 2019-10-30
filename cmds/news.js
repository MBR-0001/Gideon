const Discord = module.require("discord.js");
const Util = require("../Util");

module.exports.run = async (gideon, message, args) => {
    if (message.guild.id !== '595318490240385037') return message.channel.send('This command only works at the Time Vault!\nhttps://discord.gg/h9SEQaU');
    if (!message.member.roles.has('602311948809273344')) return message.channel.send('You don\'t have the required permissions to use this command!');

    const emoji_ids = ['598886586284900354', '607658682246758445', '598886597244485654', '598886605641613353', '598886588545499186', '598886601476800513', '607657873534746634', '634764613434474496', '638489255169228830'];

    const auth = message.author.id;

    const role_ids = {
        flashemblem: '596074712682070061',
        arrowlogo: '596075000151277568',
        houseofel: '596075165780017172',
        lotlogo: '596075305861513246',
        batwoman: '596075415898947584',
        constantineseal: '596075638285139988',
        blacklightning: '607633853527359488',
        canaries: '610867040961560625',
        supesnlois: '638486598203473958'
    }

    const f = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(f, {time: 120 * 1000});
    let roles_to_ping = [];

    await Util.TDM(message.guild, true);

    message.channel.send('Please react to mark the role(s) you want to ping.\nThen please post the news below.\nYou can optionally provide an image and a URL.\nSend \'cancel\' or \'stop\' to cancel.\nYou\'ve got 120 seconds.').then(message => {
        for (let emoji of emoji_ids) {
            message.react(emoji).then(s => {}, failed => console.log("Failed to react with " + emoji + ": " + failed));
        }
        
        const rfilter = (reaction, user) => emoji_ids.includes(reaction.emoji.id) && user.id === auth;

        const rcollector = message.createReactionCollector(rfilter, {time: 120000});
    
        rcollector.on('collect', (reaction, reactionCollector) => {
            console.log(`Collected ${reaction.emoji.name}`);

            if (reaction.emoji.name in role_ids) roles_to_ping.push(role_ids[reaction.emoji.name]);
        });
    }); 

    collector.on('collect', message => {
        if (message.content.toLowerCase() === 'cancel' || message.content.toLowerCase() === 'stop') {;
            message.channel.bulkDelete(3); 
            collector.stop();
            return message.reply('your news post has been cancelled! :white_check_mark:');
        }

        const news = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle(`Arrowverse News`)
        .setDescription(message.content)
        .setThumbnail(message.author.avatarURL())
        .addField('News posted by:', message.author)
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());

        if (message.attachments.size > 0) news.setImage(message.attachments.first().proxyURL);

        const tmvt = gideon.guilds.get('595318490240385037');
        if (!tmvt) {
            console.log('Couldn\'t get TV server when running news!');
            Util.log('Couldn\'t get TV server when running news!');
            return message.channel.send('An error occurred, please try again later');
        }

        const news_channel = tmvt.channels.get('595944027208024085');
        if (!news_channel) {
            console.log('Couldn\'t get news channel when running news!');
            Util.log('Couldn\'t get news channel when running news!');
            return message.channel.send('An error occurred, please try again later');
        }

        //<@&NUMBER> is how roles are represented | NUMBER - role id
        let roles_ping_msg = roles_to_ping.length > 0 ? roles_to_ping.map(x => "<@&" + x + ">").join(" ") : null;
        news_channel.send(roles_ping_msg, {embed: news}).then(async x => {
            await Util.delay(200);
            message.channel.bulkDelete(3);
            
            message.reply(`Your news post has been sent to ${news_channel.toString()}! :white_check_mark:`);
            Util.TDM(message.guild, false);
            collector.stop();
        });
    });

    collector.on('end', (collected, reason) => {
        if (reason === 'time') return message.channel.send("You ran out of time!");
    });
}

module.exports.help = {
    name: "news"
}