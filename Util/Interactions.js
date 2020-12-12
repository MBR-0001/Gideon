class Interactions {
    constructor() {
        throw new Error('This class cannot be instantiated!');
    }

    /**
     * Handle Slash Commands
     * @param {Discord.Interaction} interaction 
     */
    static async Handle(interaction, Util) {
        const args = interaction.options;
    
        const command = process.gideon.commands.get(interaction.commandID);
        if (!command) return;

        if (command.help.owner) {
            if (!process.gideon.owner) return;
            if (![process.gideon.owner, '351871113346809860'].includes(interaction.member.user.id)) {
                process.gideon.emit('commandRefused', interaction, 'NOT_APPLICATION_OWNER');
                return interaction.reply('You do not have the required permission to use this command!\nRequired permission: `Application Owner`');
            } 
        } 

        if (![process.gideon.owner, '351871113346809860'].includes(interaction.member.user.id)) {
            if (command.help.user_perms && command.help.user_perms.length > 0) {
                let missingperms = [];

                for (let perm of command.help.user_perms) {
                    if (!interaction.member.hasPermission(perm)) missingperms.push(perm);
                }

                if (missingperms.length > 0) {
                    process.gideon.emit('commandRefused', interaction, 'Missing: ' + missingperms.join(' '));
                    return interaction.reply('You do not have the required permissions to use this command!\nRequired permissions: ' + missingperms.map(x => `\`${x}\``).join(' '));
                }
            }   

            if (command.help.bot_perms && command.help.bot_perms.length > 0) {
                let missingperms = [];
                for (let perms of command.help.bot_perms) {
                    if (!interaction.channel.permissionsFor(interaction.guild.me).has(perms)) missingperms.push(perms);
                }
                if (missingperms.length > 0) return interaction.reply('Sorry I can\'t do that without having the required permissions for this command!\nRequired permissions: ' + missingperms.map(x => `\`${x}\``).join(' '));
            }

            if (command.help.nsfw) {
                if (!interaction.channel.nsfw) {
                    process.gideon.emit('commandRefused', interaction, 'NSFW_REQUIRED');
                    return interaction.reply('This command requires a `NSFW` channel!');
                }
            }
            
            if (command.help.roles && command.help.roles.length > 0) {
                let missingroles = [];
                let rolenames = [];
    
                for (let role of command.help.roles) {
                    if (!interaction.member.roles.cache.has(role)) missingroles.push(role);
                }
    
                if (missingroles.length > 0) {
                    for (let role of missingroles) {
                        const arr = process.gideon.shard ? await process.gideon.shard.broadcastEval(`
                            (async () => {
                                let rolename = '';
                                
                                this.guilds.cache.forEach(guild => {
                                    if (guild.roles.cache.get('${role}')) {
                                        rolename = guild.roles.cache.get('${role}').name;
                                    }
                                });
                                
                                if (rolename) return rolename;
                            })();
                        `) : process.gideon.guilds.cache.map(x => x.roles.cache).filter(x => x.get(role)).map(x => x.array().map(x => x.name)).flat();
                        rolenames.push(...arr.filter(x => x));
                    }
                }

                if (missingroles.length > 0) {
                    if (rolenames.length < 1) rolenames = missingroles;
                    process.gideon.emit('commandRefused', interaction, 'Missing: ' + rolenames.map(x => `@${x}`).join(' '));
                    return interaction.reply('You do not have the required roles to use this command!\nRequired roles: ' + rolenames.map(x => `\`${x}\``).join(' '));
                } 
            }
        }

        Util.IncreaseStat('commands_ran');
        
        try {
            await command.run(interaction, args);
        }
        catch (e) {
            if (command.id === 'eval_id') return interaction.reply(Util.Embed().setTitle('An error occurred while processing your request:').setDescription('```\n' + e + '```'));
            Util.log(`An error occurred while running ${command.help.name}:\n\n\`\`\`\n${e.stack}\n\`\`\``);
            return interaction.reply(Util.Embed().setTitle('An error occurred while processing your request:').setDescription('```\n' + e + '```'));
        } 
    }
}
export default Interactions;
