const Discord = module.require("discord.js");
const Imgur = require('imgur-node');
const imgclient = new Imgur.Client(process.env.IMG_CL);
const Util = require("../Util");

module.exports.run = async (gideon, message, args) => {    
    if (message.author.id == '353222476664143874') return message.reply('not today.');
      
    imgclient.album.get('ZU6IgLo', (err, res) => {
        if (err) {
            console.log(err);
            Util.log(err);
            return message.channel.send("An error occurred, please try again later");
        }
        let min = 0;
        let max = res.images.length - 1;
        let ranum = Math.floor(Math.random() * (max - min + 1)) + min;
        let rpmt = res.images[ranum].link;

        const pmt = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setImage(rpmt)
        .setTimestamp()
        .setFooter('The Arrowverse Bot | Time Vault Discord | Developed by adrifcastr', gideon.user.avatarURL());

        message.channel.send(pmt);
    });   
}

module.exports.help = {
    name: "prometheus"
}
