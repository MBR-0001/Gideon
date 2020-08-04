import Discord from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import Util from '../../Util.js';

/**
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(message, args, connection) {
    if (connection) {
        const confirm = connection.play(path.resolve(__dirname, '../../data/audio/captain/Right away, Captain!.m4a'));
        confirm.pause();
        confirm.resume();

        confirm.on('finish', () => {
            confirm.destroy();
            process.gideon.vcmdexec = false;
        });
    }

    const embed = Util.CreateEmbed('__Upcoming DC episodes:__', null, message.member);

    for (let show in process.gideon.dc_show_urls) {
        try {
            let ep_info = process.gideon.cache.dceps.get(show);
            if (!ep_info) {
                Util.log('No ep_info for ' + show + ' when calling dceps!');
                continue;
            }
            
            embed.addField(`${ep_info.series_name} ${ep_info.embed.name}`, `${ep_info.embed.value()}`);
        }
        
        catch (ex) {
            Util.log(`Error while fetching next episode for "${show}": ${ex}`);
        }
    }

    if (embed.fields.length < 1) return message.channel.send('Failed to fetch episode list, please try again later...');
    
    message.channel.send(embed);
}

export const help = {
    name: ['dceps', 'nextdceps', 'nextdcepisodes'],
    type: 'general',
    help_text: 'dceps',
    help_desc: 'Displays a countdown to the next airing DC episodes',
    owner: false,
    voice: true,
    timevault: false,
    nsfw: false,
    args: {},
    roles: [],
    user_perms: [],
    bot_perms: []
};