const Discord = module.require("discord.js");
const fs = require("fs");
const Util = require("../Util");

module.exports.run = async (gideon, message, args) => {
    const fsurl = 'https://discordapp.com/channels/595318490240385037/595935089070833708';

    const ia = new Discord.MessageEmbed()
    .setColor('#2791D3')
    .setTitle(`${args[0]} is not a valid argument!`)
    .setTimestamp()
    .setFooter(Util.config.footer, gideon.user.avatarURL());

    if (!args[0]) {
        const help = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle('__Use !help <module> to get a list of commands\nYou can check the list of available modules below:__')
        .addField('general', 'General helpful Arrowverse commands')  
        .addField('fun', 'Fun and interactive Arrowverse commands')  
        .addField('admin', 'Commands for people with higher roles then the average Metahuman')  
        .addField('misc', 'Miscellaneous commands')    
        .addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`)
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());

        message.channel.send(help);
        return;
    }

    let type = "";
    if (args[0].match(/(?:general)/i)) type = "general";
    else if (args[0].match(/(?:fun)/i)) type = "fun";
    else if (args[0].match(/(?:admin)/i)) type = "admin";
    else if (args[0].match(/(?:misc)/i)) type = "misc";
    else return message.channel.send(ia);

    if (!type) return message.channel.send(ia);


    fs.readdir("./cmds", (err, files) => {
        if (err) {
            message.channel.send("An error occurred, please try again later");
            Util.log("Error while reading commands:\n" + err);
            console.log(err);
            return;
        }
    
        let jsfiles = files.filter(fileName => fileName.endsWith(".js"));
        if (jsfiles.length < 1) {
            message.channel.send("An error occurred, please try again later");
            console.log("No jsfiles!");
            return;
        }
    
        let commands = {};

        for (let filename of jsfiles) {
            let props = require(`./${filename}`);

            if (!props.help || !props.help.help_text || !props.help.help_desc) {
                console.log(filename + " is missing help properties!");
                Util.log(filename + " is missing help properties, please fix");
            }

            if (props.help.type == type) commands[props.help.help_text] = props.help.help_desc;
        }

        const embed = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle('__List of available "' + type + '" commands below:__') 
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());

        for (let item in commands) {
            embed.addField(item.toLowerCase().startsWith("gideon") ? item : Util.config.prefixes[0] + item, commands[item]);
        }

        embed.addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`);

        message.channel.send(embed);
    });
}   

module.exports.help = {
    name: "help",
    type: "misc",
    help_text: "help",
    help_desc: "Provides you help with commands"
}