import Util from '../../Util.js';
import Akairo from 'discord-akairo';
import Pagination from 'discord-paginationembed';
const Command = Akairo.Command;

class Help extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'misc',
            channel: 'guild',
            args: [ { id: 'modules', match: 'content' } ],
            clientPermissions: ['MANAGE_MESSAGES'],
            description: 'Provides help',
            usage: 'help [module]'
        });
    }

    /**
     * @param {Discord.Message} message 
     * @param {Akairo.Argument} args 
     */
    async exec(message, args) {
        const fsurl = 'https://discordapp.com/channels/595318490240385037/595935089070833708';
        const customprefix = this.client.getGuild.get(message.guild.id);
        const prefixes = `\`${customprefix.prefix}\` | ` + Util.GetPrefix(message).filter(x => x != customprefix.prefix).map(x => `\`${x}\``).join(' | ') + ` <@${this.client.user.id}>`;
        let commands = this.handler.modules.array();

        if (!args.modules) {
            const help = Util.CreateEmbed('__Use ' + customprefix.prefix + 'help <module> to get a list of commands__', null, message.member)
                .setDescription('Use `' + customprefix.prefix + 'help syntax` for command syntax explanations\nUse `' + customprefix.prefix + 'alias <command>` for command aliases\nUse `' + customprefix.prefix + 'search <command>` to search a command\nGideon\'s prefixes are: ' + prefixes)
                .addField('general (`'+ commands.filter(x => x.categoryID === 'general').length + ' available`)', 'General helpful Arrowverse commands')  
                .addField('fun (`'+ commands.filter(x => x.categoryID === 'fun').length + ' available`)', 'Fun and interactive Arrowverse commands') 
                .addField('admin (`'+ commands.filter(x => x.categoryID === 'admin').length + ' available`)', 'Administrative commands')  
                .addField('misc (`'+ commands.filter(x => x.categoryID === 'misc').length + ' available`)', 'Miscellaneous commands')    
                .addField('voice (`'+ commands.filter(x => x.categoryID === 'voice').length + ' available`)', 'Gideon Voice™ only commands')    
                .addField('stats (`'+ commands.filter(x => x.categoryID === 'stats').length + ' available`)', 'Useful bot/user/guild statistics')    
                .addField('owner (`'+ commands.filter(x => x.categoryID === 'owner').length + ' available`)', 'Application owner only commands')    
                .addField('tags (`'+ commands.filter(x => x.categoryID === 'tags').length + ' available`)', 'List of promptable tags') 
                .addField('Total amount:', `\`${commands.length}\` commands available`)   
                .addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`);

            return message.channel.send(help);
        }

        if (args.modules.match(/(?:syntax)/i)) {
            const help = Util.CreateEmbed('__Command Syntax:__', null, message.member)
                .setDescription('Gideon\'s prefixes are: ' + prefixes + '\nArguments wrapped in `<>` are variables. _do not actually add brackets_\nArguments seperated by `/` mean `this or(/) this`.\nArguments wrapped in `[]` are optional arguments.\nCommands marked with :warning: are potentially dangerous.\nCommands marked with <:18:693135780796694668> are potentially NSFW.\nCommands marked with <:timevault:686676561298063361> are Time Vault only.\nCommands marked with <:gideon:686678560798146577> are application owner only.\nCommands marked with <:voicerecognition:693521621184413777> are Gideon Voice™ compatible.\nCommands marked with <:perms:686681300156940349> require certain permissions.\nCommands marked with `@role` require the mentioned role.')  
                .addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`);
    
            return message.channel.send(help);
        }

        if (args.modules.match(/(?:tags)/i)) {
            let cmds = {};
            let tags = [];
            for (let item of commands) {
                let cmd = this.handler.modules.get(item.id);
    
                if (cmd.category == 'tags') cmds[item.usage] = item.description;
            }
    
            for (let item in cmds) tags.push(item);
            const tagnames = tags.map(x => `\`${x}\``).join(' ');
    
            const help = Util.CreateEmbed('__Available tags:__ <:timevault:686676561298063361>', null, message.member)
                .setDescription('Use `' + customprefix.prefix + 'help syntax` for command syntax explanations\nUse `' + customprefix.prefix + 'alias <command>` for command aliases\nUse `' + customprefix.prefix + 'search <command>` to search a command\nGideon\'s prefixes are: ' + prefixes + '\n\n' + tagnames)  
                .addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`);
    
            return message.channel.send(help);
        }

        let type = '';
        if (args.modules.match(/(?:general)/i)) type = 'general';
        else if (args.modules.match(/(?:fun)/i)) type = 'fun';
        else if (args.modules.match(/(?:admin)/i)) type = 'admin';
        else if (args.modules.match(/(?:misc)/i)) type = 'misc';
        else if (args.modules.match(/(?:voice)/i)) type = 'voice';
        else if (args.modules.match(/(?:stats)/i)) type = 'stats';
        else if (args.modules.match(/(?:owner)/i)) type = 'owner';
        else return message.channel.send(Util.CreateEmbed(`${args.modules} is not a valid argument!`, null, message.member));
        
        let selectedcommands = {};
        let marks = {};

        for (let item of commands) {
            let cmd = this.handler.modules.get(item.id);

            if (cmd.category == type) selectedcommands[item] = item;
        }

        const helpemotes = ['<:timevault:686676561298063361>',
            '<:gideon:686678560798146577>',
            '<:18:693135780796694668>',
            '<:perms:686681300156940349>',
            '<:voicerecognition:693521621184413777>'
        ];

        if (Object.keys(selectedcommands).length > 10) {
            const arrs = Util.Split(Object.keys(selectedcommands), 10);
            let pages = [];
            
            for (let i = 0; i < arrs.length; i++) {
                const embed = Util.CreateEmbed('__List of available "' + type + '" commands below:__', null, message.member);
                embed.setDescription('Use `' + customprefix.prefix + 'help syntax` for command syntax explanations\nUse `' + customprefix.prefix + 'alias <command>` for command aliases\nUse `' + customprefix.prefix + 'search <command>` to search a command\nGideon\'s prefixes are: ' + prefixes);
    
                for (let item of arrs[i]) {
                    let mo = { emotes: [], roles: [] };
                    if (selectedcommands[item].ownerOnly) mo.emotes.push(helpemotes[1]);
                    if (selectedcommands[item].voiceOnly) mo.emotes.push(helpemotes[4]);
                    if (Array.isArray(selectedcommands[item].allowedGuilds) && selectedcommands[item].allowedGuildslength > 0) mo.emotes.push(helpemotes[0]);
                    if (selectedcommands[item].nsfw) mo.emotes.push(helpemotes[2]);
                    if (Array.isArray(selectedcommands[item].userPermissions) && selectedcommands[item].userPermissions.length > 0) mo.emotes.push(helpemotes[3]);
    
                    if (typeof selectedcommands[item].userPermissions == 'function') {     
                        const rolename = selectedcommands[item].userPermissions(message);
                        if (rolename.startsWith('@')) {
                            mo.roles.push(rolename);
                        }
                    }
    
                    marks[item] = mo;
                    
                    embed.addField(selectedcommands[item].usage.toLowerCase().startsWith('gideon') || selectedcommands[item].category == 'voice' ? item + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}` : customprefix.prefix + item + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}`, selectedcommands[item].usage);
                }
                embed.addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`);
                pages.push(embed);
            }
            
            new Pagination.Embeds()
                .setArray(pages)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setPageIndicator(true)
                .setPage(1)
                .build();
        }
    
        else {
            const embed = Util.CreateEmbed('__List of available "' + type + '" commands below:__', null, message.member);
            embed.setDescription('Use `' + customprefix.prefix + 'help syntax` for command syntax explanations\nUse `' + customprefix.prefix + 'alias <command>` for command aliases\nUse `' + customprefix.prefix + 'search <command>` to search a command\nGideon\'s prefixes are: ' + prefixes);

            for (let item of commands) {
                let mo = { emotes: [], roles: [] };
                if (selectedcommands[item].ownerOnly) mo.emotes.push(helpemotes[1]);
                if (selectedcommands[item].voiceOnly) mo.emotes.push(helpemotes[4]);
                if (Array.isArray(selectedcommands[item].allowedGuilds) && selectedcommands[item].allowedGuildslength > 0) mo.emotes.push(helpemotes[0]);
                if (selectedcommands[item].nsfw) mo.emotes.push(helpemotes[2]);
                if (Array.isArray(selectedcommands[item].userPermissions) && selectedcommands[item].userPermissions.length > 0) mo.emotes.push(helpemotes[3]);

                if (typeof selectedcommands[item].userPermissions == 'function') {     
                    const rolename = selectedcommands[item].userPermissions(message);
                    if (rolename.startsWith('@')) {
                        mo.roles.push(rolename);
                    }
                }

                marks[item] = mo;
                console.log(selectedcommands[0]);
                //console.log(item);
                embed.addField(selectedcommands[item].usage.toLowerCase().startsWith('gideon') || selectedcommands[item].category == 'voice' ? item.usage + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}` : customprefix.prefix + item.usage + ` ${marks[item].emotes.join('')}${marks[item].roles.length > 0 ? '`' + marks[item].roles.join(' ') + '`' : ''}`, selectedcommands[item].usage);
            }
            embed.addField('Feature Suggestions:', `**[Click here to suggest a feature](${fsurl} 'Time Vault - #feature-suggestions')**`);
            message.channel.send(embed);
        }
    }
}

export default Help;