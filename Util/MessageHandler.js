import Discord from 'discord.js';

class MsgHandler {
    constructor() {
        throw new Error('This class cannot be instantiated!');
    }

    /**
     * 
     * @param {Discord.Client} gideon 
     * @param {Discord.Message} message 
     * @param {*} Util 
     * @param {Discord.VoiceConnection} connection 
     */
    static async Handle(gideon, message, Util, connection) {
        if (!message || !message.author || message.author.bot || !message.guild || message.partial) return;
        if (!message.guild.me) await message.guild.members.fetch(gideon.user.id);
        if (message.channel.type !== 'text') return;
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

        const lowercaseContent = message.content.toLowerCase();

        let currentguild = gideon.getGuild.get(message.guild.id);
        if (!currentguild) {
            currentguild = {
                guild: message.guild.id,
                prefix: '!',
                cvmval: 0,
                abmval: 0,
                eastereggs: 0,
                blacklist: 0,
                chatchnl: ''
            };

            gideon.setGuild.run(currentguild);
        }

        if (Util.Checks.IBU(message, gideon)) return; //check if user is blacklisted, if yes, return
        Util.Checks.LBG(message.guild, gideon, Util); //check if guild is blacklisted, if yes, leave
        if (message.channel.id === currentguild.chatchnl) return Util.Chat(message, gideon);
        Util.Checks.Ads(message, gideon); //check for foreign invites
        Util.Checks.ABM(message, gideon, Util); //apply content filter
        Util.Checks.RulesCheck(message); //check if member read the guilds rules

        if (message.guild.id === '595318490240385037') {
            if (!message.member.roles.cache.has('688430418466177082')) return; //NO COMMANDS FOR NON RULE READERS, FEEL MY WRATH
        }

        Util.Checks.NameCheck(message.member, null, gideon); //check nicknames & usernames
        Util.Checks.CVM(message, gideon, Util); //apply crossover mode if enabled
        Util.Checks.CSD(message, gideon, Util); //eastereggs
        Util.TR.TRMode(message, gideon, Util); //apply trmode if enabled
 
        const usedCustom = lowercaseContent.startsWith(currentguild.prefix.toLowerCase());
        let usedPrefix = Util.config.prefixes.find(prefix => lowercaseContent.startsWith(prefix.toLowerCase()));
        if (usedCustom) usedPrefix = currentguild.prefix;
        if (!usedPrefix) return;

        const inputString = message.content.slice(usedPrefix.length).trim();
        const args = inputString.split(' ').filter(arg => arg);

        let cmd = args.shift();
        if (!cmd) return;

        const command = gideon.commands.get(cmd.toLowerCase());
        if (!command) return gideon.vcmdexec = false;
        
        Util.Checks.Spamcounter(message.author.id, gideon);

        const spamcount = gideon.spamcount.get(message.author.id);
   
        if (spamcount && spamcount.usages + 1 > 10) {
            let ub = gideon.getUser.get(message.author.id);

            if (!ub) ub = {
                user: message.author.id,
                blacklist: 1,
            };
            else ub.blacklist = 1;
            
            gideon.setUser.run(ub);
            Util.log(`${message.author.tag} had their access revoked due to command spam:\`\`\`\nUser: ${message.author.tag} - ${message.author.id}\nMessage: ${message.content} - ${message.id}\n\`\`\`\n${message.url}`);
            return message.reply('your access to ' + gideon.user.toString() + ' has been revoked due to `COMMAND_SPAM`!\nIf you wish to regain access please contact `adrifcastr#4530` or fill out the form below:\nhttps://forms.gle/PxYyJzsW9tKYiJpp7');
        }

        if (command.help.type === 'voice' && !message.voice) return;

        if (command.help.owner) {
            if (message.author.id !== gideon.owner) {
                gideon.emit('commandRefused', message, 'NOT_APPLICATION_OWNER');
                return message.reply('you do not have the required permission to use this command!\nRequired permission: `Application Owner`');
            } 
        } 

        if (command.help.timevault) {
            if (message.guild.id !== '595318490240385037') {
                gideon.emit('commandRefused', message, 'TIMEVAULT_ONLY');
                return message.reply('this command only works at the Time Vault!\nhttps://discord.gg/h9SEQaU');
            } 
        }

        if (message.author.id !== gideon.owner) {
            if (command.help.user_perms && command.help.user_perms.length > 0) {
                let missingperms = [];
                for (let perms of command.help.user_perms) {
                    if (!message.member.hasPermission(perms)) missingperms.push(perms);
                }
                if (missingperms && missingperms.length > 0) {
                    gideon.emit('commandRefused', message, 'Missing: ' + missingperms.join(' '));
                    return message.reply('you do not have the required permissions to use this command!\nRequired permissions: ' + missingperms.map(x => `\`${x}\``).join(' '));
                }
            }   

            if (command.help.nsfw) {
                if (!message.channel.nsfw) {
                    gideon.emit('commandRefused', message, 'NSFW_REQUIRED');
                    return message.reply('this command requires a `NSFW` channel!');
                }
            }

            if (command.help.roles && command.help.roles.length > 0) {
                let missingroles = [];
                let rolenames = [];
    
                for (let role of command.help.roles) {
                    if (!message.member.roles.cache.has(role)) missingroles.push(role);
                }
    
                if (missingroles && missingroles.length > 0) {
                    for (let role of missingroles) {
                    
                        const rolename = await gideon.shard.broadcastEval(`
                            (async () => {
                                let rolename;
                                const guilds = this.guilds.cache;
                                
                                guilds.forEach(guild => {
                                    if (guild.roles.cache.get('${role}')) {
                                    rolename = guild.roles.cache.get('${role}').name;
                                    }
                                });
                                
                                if (rolename) return rolename;
                            })();
                        `);
                        rolenames.push(rolename.toString());
                    }
                }
                if (rolenames && rolenames.length > 0) {
                    gideon.emit('commandRefused', message, 'Missing: ' + rolenames.map(x => `@${x}`).join(' '));
                    return message.reply('you do not have the required roles to use this command!\nRequired roles: ' + rolenames.map(x => `\`${x}\``).join(' '));
                } 
            }
        }

        if (command.help.bot_perms && command.help.bot_perms.length > 0) {
            let missingperms = [];
            for (let perms of command.help.bot_perms) {
                if (!message.channel.permissionsFor(message.guild.me).has(perms)) missingperms.push(perms);
            }
            if (missingperms && missingperms.length > 0) return message.reply('sorry I can\'t do that without having the required permissions for this command!\nRequired permissions: ' + missingperms.map(x => `\`${x}\``).join(' '));
        }

        if (command.help.args.force) {
            const noinput = Util.CreateEmbed('You must supply valid input!', null, message.member);
            const noid = Util.CreateEmbed('You must supply a valid ID!', null, message.member);
            const noepisode = Util.CreateEmbed('You must supply a valid episode and season!', {description: 'Acceptable formats: S00E00 and 00x00'}, message.member);
            const nomention = Util.CreateEmbed('You must supply a valid mention!', null, message.member);

            if (!args.length) return message.channel.send(noinput);

            if (command.help.args.amount && command.help.args.amount > 0) {
                if (args.length !== command.help.args.amount) return message.channel.send(noinput);
            }

            if (command.help.args.type && command.help.args.type === 'snowflake') {
                if (!Util.ValID(args[0])) return message.channel.send(noid);
            }

            if (command.help.args.type && command.help.args.type === 'episode') {
                if (!Util.parseSeriesEpisodeString(args[1])) return message.channel.send(noepisode);
            }

            if (command.help.args.type && command.help.args.type === 'mention') {
                if (!message.mentions.users.first()) return message.channel.send(nomention);
            }
        }

        if (command) command.run(gideon, message, args, connection);
    }
}

export default MsgHandler;
