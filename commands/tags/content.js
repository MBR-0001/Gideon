import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class Content extends Command {
    constructor() {
        super('content', {
            aliases: ['content', 'allowed content'],
            category: 'tags',
            channel: 'guild',
            description: 'Content Tag',
            usage: 'content'
        });
    }

    async exec(message) {
        const tag = '**Linking Instagram posts of any Arrowverse fan account which contains leaks, spoilers or theories and any reports by websites such as \'TMZ\', \'We Got This Covered\' or any similar websites is strenghtly forbidden on this server.**\n**Posting links to YouTube videos of channels like \'Pagey\', \'TV Promos\', \'TheDCTVShow\' or similar channels is strengthly forbidden on this server**';
        message.channel.send(tag);
    }
}

export default Content;