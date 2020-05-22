import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class Spoilers extends Command {
    constructor() {
        super('spoilers', {
            aliases: ['spoilers'],
            category: 'tags',
            channel: 'guild',
            description: 'Spoilers Tag',
            usage: 'spoilers'
        });
    }

    async exec(message) {
        const tag = '**All spoilers must be marked as such by using \'||\' at the beginning and ending, or by ticking \'Mark as spoiler\' (this applies to all channels).**\n**Everything that has aired on TV or has been posted by official sources is not considered as spoiler.**\n**Talk about newly aired episodes outside of the DCTV channels must be marked as spoiler for at least 24 hours.**';
        message.channel.send(tag);
    }
}

export default Spoilers;