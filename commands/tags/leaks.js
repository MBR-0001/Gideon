import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class Leaks extends Command {
    constructor() {
        super('leaks', {
            aliases: ['leaks'],
            category: 'tags',
            channel: 'guild',
            description: 'Leak Tag',
            usage: 'leaks'
        });
    }

    async exec(message) {
        const tag = '**Leaks of any kind must be marked as spoiler aswell, and also be clearly declared as leaks at the beginning of the message.**\n**"Leak" refers to any information regarding the plot or any other type of content of any upcoming Arrowverse episode.**\n**Theories do count as leaks aswell and therefore mustn\'t be posted without the above mentioned steps of clarification.**';
        message.channel.send(tag);
    }
}

export default Leaks;

