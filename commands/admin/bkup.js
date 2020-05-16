import Util from '../../Util.js';
import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class SQLBackup extends Command {
    constructor() {
        super('bkup', {
            aliases: ['bkup', 'backup'],
            category: 'admin',
            channel: 'guild'
        });
    }

    async exec(message) {
        try {
            message.channel.send('Performing database backup, please wait...');
            await Util.SQLBkup(this.client);
            message.channel.send('Database backup complete! Please check <#622415301144870932>! :white_check_mark:');
        }
        
        catch (ex) {
            Util.log('Caught an exception while running bkup.js: ' + ex.stack);
            return message.channel.send(Util.CreateEmbed('An error occured while executing this command!', null, message.member));
        }    
    }
}

export default SQLBackup;
