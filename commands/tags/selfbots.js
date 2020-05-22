import Akairo from 'discord-akairo';
const Command = Akairo.Command;

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */

class Selfbots extends Command {
    constructor() {
        super('selfbots', {
            aliases: ['selfbots', 'selfbot'],
            category: 'tags',
            channel: 'guild',
            description: 'Selfbot Tag',
            usage: 'selfbots'
        });
    }

    async exec(message) {
        const tag = '**Discords stance on automated user accounts ("self-bots"):**\n"Discord\'s API provides a separate type of user account dedicated to automation, called a bot account. Bot accounts can be created through the applications page, and are authenticated using a token (rather than a username and password). Unlike the normal OAuth2 flow, bot accounts have full access to all API routes without using bearer tokens, and can connect to the Real Time Gateway.\n__Automating normal user accounts (generally called "self-bots") outside of the OAuth2/bot API is forbidden, and can result in an account termination if found.__"\n\n_- Jaytron (Discord Trust&Safety)_\nsource: https://support.discordapp.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-';
        message.channel.send(tag);
    }
}

export default Selfbots;