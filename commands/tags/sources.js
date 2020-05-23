import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class Sources extends Command {
    constructor() {
        super('sources', {
            aliases: ['sources', 'origin'],
            category: 'tags',
            channel: 'guild',
            description: 'Sources Tag',
            usage: 'sources'
        });
    }

    async exec(message) {
        const tag = '**"Official sources" refers to any social media in association with the Arrowverse franchise or The CW Televison Network.**';
        message.channel.send(tag);
    }
}

export default Sources;