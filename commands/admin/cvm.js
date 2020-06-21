import Akairo from 'discord-akairo';
import Discord from 'discord.js';
const Command = Akairo.Command;

class CVM extends Command {
    constructor() {
        super('cvm', {
            aliases: ['cvm'],
            category: 'admin',
            channel: 'guild',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            description: 'Toggles Crossover-Mode',
            usage: 'cvm'
        });
    }

    /**
     * @param {Discord.Message} message 
     */
    async exec(message) {
        let cvm = this.client.getGuild.get(message.guild.id);
        if (!cvm.cvmval) cvm.cvmval = 0;
        
        if (cvm.cvmval === 0) {
            cvm.cvmval = 1;
            this.client.setGuild.run(cvm);
            message.reply('Crossover-Mode enabled! :white_check_mark:');
        }

        else {
            cvm.cvmval = 0;
            this.client.setGuild.run(cvm);
            message.reply('Crossover-Mode disabled! :white_check_mark:');
        } 
    }
}

export default CVM;