import Akairo from 'discord-akairo';
import Discord from 'discord.js';
import Util from '../../Util.js';
const Command = Akairo.Command;

class SQLBackup extends Command {
    constructor() {
        super('bkup', {
            aliases: ['bkup', 'backup'],
            category: 'admin',
            channel: 'guild',
            userPermissions(message) {
                if (!message.member.roles.cache.has('621399916283035658')) {
                    return '@Gideon Dev Team';
                }
        
                return null;
            },
            description: 'Performs an SQL database backup',
            usage: 'bkup'
        });
    }

    /**
     * @param {Discord.Message} message 
     */
    async exec(message) {
        try {
            message.channel.send('Performing database backup, please wait...');
            await Util.SQLBkup();
            message.channel.send('Database backup complete! Please check <#622415301144870932>! :white_check_mark:');
        }
        
        catch (ex) {
            Util.log('Caught an exception while running bkup.js: ' + ex.stack);
            return message.channel.send(Util.CreateEmbed('An error occured while executing this command!', null, message.member));
        }    
    }
}

export default SQLBackup;
