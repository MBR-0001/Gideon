import Discord from 'discord.js';
import Util from '../../Util.js';

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(gideon, message, args) {
    const id = Util.ValID(args.join(' '));
    try {
        let ub = gideon.getUser.get(id);
        if (!ub) {
            ub = {
                id: id,
                trmodeval: 0,
                blacklist: 0
            };
        }

        if (ub.blacklist === 0) {
            ub.blacklist = 1;
            gideon.setUser.run(ub);
            message.reply(`user \`${id}\` has been blacklisted!`);
        }

        else {
            ub.blacklist = 0;
            gideon.setUser.run(ub);
            message.reply(`user \`${id}\` has been un-blacklisted!`); 
        }
    }

    catch (ex) {
        console.log('Caught an exception while running ub.js: ' + ex.stack);
        Util.log('Caught an exception while running ub.js: ' + ex.stack);
        return message.channel.send(Util.CreateEmbed('An error occured while executing this command!', null, message.member));
    }
}

export const help = {
    name: ['ub', 'Useracklist', 'ubrm'],
    type: 'owner',
    help_text: 'ub <userid>',
    help_desc: 'Blacklists a user',
    owner: true,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {force: true, amount: 1, type: 'snowflake'},
    roles: [],
    user_perms: [],
    bot_perms: []
};