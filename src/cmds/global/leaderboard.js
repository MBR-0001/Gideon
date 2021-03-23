import Util from '../../Util.js';

/**
* @param {Discord.Interaction} interaction
*/
export async function run(interaction) {
    let leaderboard = Util.Embed('Top 10 Leaderboard:', null, interaction.member);

    let top10 = process.gideon.getTop10.all().filter(x => x.points > 0);

    if (top10.length < 1) leaderboard.setDescription('No entries yet!');

    else {
        leaderboard.setDescription(top10.map((data, i) => {
            let guild = process.gideon.guilds.cache.get(data.guild);
            let user = guild?.members?.cache?.get?.(data.user) ?? data.user;
            return '**#' + (i + 1) + '** - ' + user + ' in `' + (guild ? guild.name : 'Unknown') + '`: **' + data.points + '** ' + (data.points != 1 ? 'point' + 's' : 'point');
        }).join('\n'));
    }

    return interaction.reply(leaderboard);
}

export let help = {
    id: '788772536791334944',
    owner: false,
    nsfw: false,
    roles: [],
    user_perms: [],
    bot_perms: []
};