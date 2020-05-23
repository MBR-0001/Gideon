import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class ToS extends Command {
    constructor() {
        super('tos', {
            aliases: ['tos', 'terms'],
            category: 'tags',
            channel: 'guild',
            description: 'ToS Tag',
            usage: 'tos'
        });
    }

    async exec(message) {
        const tag = 'Discord Developer Terms of Service: https://discordapp.com/developers/docs/legal\nToS Q&A summary: https://gist.github.com/meew0/a3168b8fbb02d5a5456a06461b9e829e';
        message.channel.send(tag);
    }
}

export default ToS;