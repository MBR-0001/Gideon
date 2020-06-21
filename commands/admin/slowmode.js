import Akairo from 'discord-akairo';
import Discord from 'discord.js';
import Util from '../../Util.js';
const Command = Akairo.Command;

class Slowmode extends Command {
    constructor() {
        super('sm', {
            aliases: ['sm', 'slowmode'],
            category: 'admin',
            channel: 'guild',
            args: [
                { id: 'channel', type: 'textChannel', prompt: {optional: true}, default: m => { return m.channel; }, description: 'testass2' },
                { id: 'amount', type: 'number', prompt: false, description: 'testass' },
            ],
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
            description: 'Toggles slowmode',
            usage: 'sm <seconds> [channel]'
        });
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {{channel: Discord.TextChannel, amount: number}} args 
     */
    async exec(message, args) {
        try {
            if (args.channel) {
                await args.channel.setRateLimitPerUser(args.amount);
                await message.reply(`Set slowmode for ${args.channel} to \`${args.amount}\` ${args.amount == 1 ? 'second' : 'seconds'}!`);
            }
        
            else {
                await message.channel.setRateLimitPerUser(args.amount);
                await message.reply(`Set slowmode for ${message.channel} to \`${args.amount}\` ${args.amount == 1 ? 'second' : 'seconds'}!`);
            }
        }
        
        catch (ex) {
            Util.log('Caught an exception while running slowmode.js: ' + ex.stack);
            return message.channel.send(Util.CreateEmbed('An error occured while executing this command!', null, message.member));
        }      
    }
}

export default Slowmode;