const Discord = module.require("discord.js");
const fetch = require('node-fetch');
const Util = require("../Util");

module.exports.run = async (gideon, message, args) => {
    const api = 'https://api.github.com/repos/adrifcastr/Gideon/issues';

    try {
        const body = await fetch(api).then(res => res.json()); 
        let issuecount = Object.keys(body).length;
    
        const issues = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle('Issues:')
        .setDescription(`Current Open Issues: \`${issuecount}\``)
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());

        for (let i = 0; i < issuecount; i++) {
            try {
                issues.addField(`Issue #${body[i].number}: ${body[i].title}`, `Link: [GitHub](${body[i].html_url} '${body[i].html_url}') | Comments: \`${body[i].comments}\` | Opened by: \`${body[i].user.login}\``);
            }
            
            catch (ex) {
                console.log(`Error while fetching issues: ${ex.error ? ex.error : ex}`);
                Util.log(`Error while fetching issues: ${ex.error ? ex.error : ex}`);
            }
        }
    
        message.channel.send(issues);
    }
    
    catch (ex) {
        console.log("Caught an exception while fetching issues: " + ex);
        Util.log("Caught an exception while fetching issues: " + ex);

        const er = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setTitle('An error occurred while fetching issues!')
        .setDescription('Please try again later!')
        .setTimestamp()
        .setFooter(Util.config.footer, gideon.user.avatarURL());
        return message.channel.send(er);
    }
}

module.exports.help = {
    name: "issues"
}