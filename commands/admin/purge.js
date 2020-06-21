import Akairo from 'discord-akairo';
import Discord from 'discord.js';
const Command = Akairo.Command;

class Purge extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge', 'delete'],
            category: 'admin',
            channel: 'guild',
            args: [ { id: 'msgamt', type: 'number', prompt: true } ],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            description: 'Purges Messages',
            usage: 'purge <amount>'
        });
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {{msgamt: number}} args 
     */
    async exec(message, args) {
        const msgamt = args.msgamt;
        
        if (msgamt > 100) return message.reply('Max value is `100`.');

        await message.delete({ timeout: 200 });
        await message.channel.bulkDelete(msgamt, true);
    }
}

export default Purge;