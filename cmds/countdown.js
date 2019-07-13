const Discord = module.require("discord.js");
const snekfetch = require("snekfetch");

module.exports.run = async (gideon, message, args) => {
    const flashapi = 'http://api.tvmaze.com/shows/13?embed=nextepisode';
    const arrowapi = 'http://api.tvmaze.com/shows/4?embed=nextepisode';
    const supergirlapi = 'http://api.tvmaze.com/shows/1850?embed=nextepisode';
    const legendsapi = 'http://api.tvmaze.com/shows/1851?embed=nextepisode';
    const bwomanapi = 'http://api.tvmaze.com/shows/37776?embed=nextepisode';

    snekfetch.get(api).then(r => {
        console.log(r.body);
        let body = r.body;   

        const countdown = new Discord.RichEmbed()
	    .setColor('#2791D3')
	    .setTitle('__Upcoming episodes:__')
        .addTitle(`${flaeptitle} ${body.season}x${body.number<10?"0"+body.number:body.number} - ${body.name}`)
        .addTitle(`${areptitle} ${body.season}x${body.number<10?"0"+body.number:body.number} - ${body.name}`)
        .addTitle(`${sgeptitle} ${body.season}x${body.number<10?"0"+body.number:body.number} - ${body.name}`)
        .addTitle(`${ltitle} ${body.season}x${body.number<10?"0"+body.number:body.number} - ${body.name}`)
        .addTitle(`${showtitle} ${body.season}x${body.number<10?"0"+body.number:body.number} - ${body.name}`)
	    .setThumbnail()
    	.setTimestamp()
    	.setFooter('Gideon - The Arrowverse Bot | Developed by adrifcastr', 'https://i.imgur.com/3RihwQS.png');

        message.channel.send(countdown); 
    });       
}

module.exports.help = {
    name: "cd"
}