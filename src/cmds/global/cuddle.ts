import Util from '../../Util.js';
import { CommandInteraction, CommandInteractionOption, GuildMember } from 'discord.js';
import { Command } from 'src/@types/Util.js';

/**
 * @param {Discord.CommandInteraction} interaction
 * @param {CommandInteractionOption[]} options
 */
export async function run(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void> {
    const auth = interaction.user;
    const user = process.gideon.users.cache.get(options[0].value as string);
    
    if (user?.id === auth.id || user?.id === process.gideon.user?.id) return interaction.reply(Util.Embed().setTitle('My protocols forbid any kind of self-harm!'));
    else if (user?.bot) return interaction.reply(Util.Embed().setTitle('Please mention a human!'));

    return interaction.reply(Util.Embed(undefined, {
        description: `**${auth} you have cuddled ${user}!**\n\nA Beebo-tastic cuddle always brightens the mood!`,
        image: 'https://i.imgur.com/IOpmt2j.gif'
    }, interaction.member as GuildMember));
}

export const info: Command['info'] = {
    name: 'cuddle',
    owner: false,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};