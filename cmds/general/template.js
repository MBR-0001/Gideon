import Discord from "discord.js";
import Util from "../../Util.js";

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(gideon, message, args) {
    message.channel.send('https://discord.new/EDWFjQqYu8Zs');
}

export const help = {
    name: "template",
    type: "general",
    help_text: "template",
    help_desc: "Sends a Time Vault template",
    owner: false,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
}