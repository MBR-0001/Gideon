import { CommandInteraction } from "discord.js";
import { Command } from "src/@types/Util";

/**
* @param {Discord.CommandInteraction} interaction
*/
export async function run(interaction: CommandInteraction): Promise<void> {
    const url = 'https://gideonbot.com/invite';
    return interaction.reply(`[Invite me](<${url}>)`);       
}

export let help: Command['help'] = {
    id: '787028131315449906',
    owner: false,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};
