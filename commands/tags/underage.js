import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class Underage extends Command {
    constructor() {
        super('underage', {
            aliases: ['underage', 'young'],
            category: 'tags',
            channel: 'guild',
            description: 'Underage Tag',
            usage: 'underage'
        });
    }

    async exec(message) {
        const tag = 'If you have ever made a joke about your age, go delete it now, and don\'t make any more.\nTrust & Safety can and will disable your account for any mention of being underage.\nhttps://www.reddit.com/r/discordapp/comments/cm4787/psa_dont_joke_about_being_underage_on_discord';
        message.channel.send(tag);
    }
}

export default Underage;