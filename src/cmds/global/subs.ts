import OpenSubtitles from 'opensubtitles-api';
import Util from '../../Util.js';
import { CommandInteraction, CommandInteractionOption, GuildMember } from 'discord.js';
import { Command } from 'src/@types/Util.js';

/**
 * @param {Discord.CommandInteraction} interaction
 * @param {CommandInteractionOption[]} options
 */
export async function run(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void> {
    if (!process.env.OPS_UA || !process.env.OPS_USER || !process.env.OPS_PASS) {
        Util.log('Missing env variables for subs command!');
        return interaction.reply(Util.Embed('This command is currently not available', undefined, interaction.member as GuildMember));
    }

    const OS = new OpenSubtitles({
        useragent: process.env.OPS_UA,
        username: process.env.OPS_USER,
        password: process.env.OPS_PASS,
        ssl: true
    });

    const shows = [
        {
            id: 'tt3107288',
            title: 'The Flash'
        },
        {
            id: 'tt2193021',
            title: 'Arrow'
        },
        {
            id: 'tt4016454',
            title: 'Supergirl'
        },
        {
            id: 'tt4532368',
            title: 'DC\'s Legends of Tomorrow'
        },
        {
            id: 'tt3489184',
            title: 'Constantine'
        },
        {
            id: 'tt8712204',
            title: 'Batwoman'
        },
        {
            id: 'tt6045840',
            title: 'Black Lightning'
        },
        {
            id: 'tt11012356',
            title: 'Green Arrow and the Canaries'
        },
        {
            id: 'tt4276624',
            title: 'Krypton'
        },
        {
            id: 'tt4052886',
            title: 'Lucifer'
        },
        {
            id: 'tt11192306',
            title: 'Superman & Lois'
        },
        {
            id: 'tt8722888',
            title: 'Stargirl'
        },
        {
            id: 'tt8416494',
            title: 'Doom Patrol'
        },
        {
            id: 'tt1043813',
            title: 'Titans'
        },
        {
            id: 'tt0279600',
            title: 'Smallville'
        },
        {
            id: 'tt1190634',
            title: 'The Boys'
        },
    ];

    let show = shows[-1];

    if (options[0].options?.[0].value === 'show_fl') show = shows[0];
    else if (options[0].options?.[0].value === 'show_ar') show = shows[1];
    else if (options[0].options?.[0].value === 'show_sg') show = shows[2];
    else if (options[0].options?.[0].value === 'show_lot') show = shows[3];
    else if (options[0].options?.[0].value === 'show_co') show = shows[4];
    else if (options[0].options?.[0].value === 'show_bw') show = shows[5];
    else if (options[0].options?.[0].value === 'show_bl') show = shows[6];
    else if (options[0].options?.[0].value === 'show_kr') show = shows[8];
    else if (options[0].options?.[0].value === 'show_lu') show = shows[9];
    else if (options[0].options?.[0].value === 'show_sl') show = shows[10];
    else if (options[0].options?.[0].value === 'show_stg') show = shows[11];
    else if (options[0].options?.[0].value === 'show_dp') show = shows[12];
    else if (options[0].options?.[0].value === 'show_t') show = shows[13];
    else if (options[0].options?.[0].value === 'show_sv') show = shows[14];
    else if (options[0].options?.[0].value === 'show_tb') show = shows[15];
    
    OS.search({
        sublanguageid: options[0].options?.[1].value as string,       
        season: options[0].options?.[2].value as number,
        episode: options[0].options?.[3].value as number,
        limit: '5',                 
        imdbid: show.id,           

    }).then(subtitles => {
        const embed = Util.Embed(`Subtitles for: ${show.title} ${options[0].options?.[2].value}x${Util.normalize(options[0].options?.[3].value as number)}`, {description: 'Here are the 5 best results from opensubtitles.org:'}, interaction.member as GuildMember);

        for (let sub of Object.values(subtitles)[0]) {
            embed.addField(sub.filename, `**[Download SRT](${sub.url} '${sub.url}')** Lang: \`${sub.lang}\` Score: \`${sub.score}\``);
        }
        
        interaction.reply(embed);
    }).catch(async (err: Error) => {
        Util.log('An error occurred while trying to fetch subtitles: ' + err);
        return interaction.reply('There were no results for this episode on opensubtitles.org!\nTry another episode or another language !', { ephemeral: true });
    });
}

export const help: Command['help'] = {
    name: 'subs',
    owner: false,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};