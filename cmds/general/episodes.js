import Util from '../../Util.js';
import moment from 'moment';

/**
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(message, args) {
    if (message.author.guessing) return message.reply('No cheating while your guessing game is active!');

    let agc = args[0];
    let info = Util.parseSeriesEpisodeString(args[1]);

    let shows = [
        {
            id: '13',
            title: 'The Flash',
            channel: 'The CW'
        },
        {
            id: '4',
            title: 'Arrow',
            channel: 'The CW'
        },
        {
            id: '1850',
            title: 'Supergirl',
            channel: info.season === '1' ? 'CBS' : 'The CW'
        },
        {
            id: '1851',
            title: 'DC\'s Legends of Tomorrow',
            channel: 'The CW'
        },
        {
            id: '15',
            title: 'Constantine',
            channel: 'NBC'
        },
        {
            id: '37776',
            title: 'Batwoman',
            channel: 'The CW'
        },
        {
            id: '20683',
            title: 'Black Lightning',
            channel: 'The CW'
        },
        {
            id: '44496',
            title: 'Green Arrow and the Canaries',
            channel: 'The CW'
        },
        {
            id: '3082',
            title: 'Krypton',
            channel: 'Syfy'
        },
        {
            id: '1859',
            title: 'Lucifer',
            channel: info.season == '1' || info.season == '2' || info.season == '3' ? 'Fox' : 'Netflix'
        },
        {
            id: '44751',
            title: 'Superman & Lois',
            channel: 'The CW'
        },
        {
            id: '37809',
            title: 'Stargirl',
            channel: 'DC Universe/The CW'
        },
        {
            id: '36745',
            title: 'Doom Patrol',
            channel: 'DC Universe'
        },
        {
            id: '27557',
            title: 'Titans',
            channel: 'DC Universe'
        },
        {
            id: '435',
            title: 'Smallville',
            channel: 'The CW'
        },
        {
            id: '15299',
            title: 'The Boys',
            channel: 'Amazon Prime Video'
        }
    ];

    let show;
    
    if (agc.match(/(?:flash)/i)) show = shows[0];
    else if (agc.match(/(?:arrow)/i)) show = shows[1];
    else if (agc.match(/(?:supergirl)/i)) show = shows[2];
    else if (agc.match(/(?:legends)/i)) show = shows[3];
    else if (agc.match(/(?:constantine)/i)) show = shows[4];
    else if (agc.match(/(?:batwoman)/i)) show = shows[5];
    else if (agc.match(/(?:blacklightning)/i)) show = shows[6];
    else if (agc.match(/(?:canaries)/i)) show = shows[7];
    else if (agc.match(/(?:krypton)/i)) show = shows[8];
    else if (agc.match(/(?:lucifer)/i)) show = shows[9];
    else if (agc.match(/(?:supesnlois)/i)) show = shows[10];
    else if (agc.match(/(?:stargirl)/i)) show = shows[11];
    else if (agc.match(/(?:doompatrol)/i)) show = shows[12];
    else if (agc.match(/(?:titans)/i)) show = shows[13];
    else if (agc.match(/(?:smallville)/i)) show = shows[14];
    else if (agc.match(/(?:theboys)/i)) show = shows[15];
    else return message.channel.send(Util.Embed('You must supply a valid show!', {
        description: 'Available shows:\n**flash**\n**arrow**\n**supergirl**\n**legends**\n**constantine**\n**blacklightning**\n**batwoman**\n**krypton**\n**lucifer**\n**supesnlois**\n**stargirl**\n**doompatrol**\n**titans**\n**smallville**\n**theboys**'
    }, message.member));

    const api = `http://api.tvmaze.com/shows/${show.id}/episodebynumber?season=${info.season}&number=${info.episode}`;

    const body = await Util.fetchJSON(api);

    if (body.status === 404) return message.channel.send(Util.Embed('There was no data for this episode!', null, message.member));
    
    let sp = '';
    let today = new Date();
    let airdate = new Date(body.airdate);
    if (!moment(airdate).isValid()) sp = '||';
    if (today < airdate) sp = '||';
    let airtime = body.airtime;
    let desc = !body.summary ? 'No summary available' : body.summary.replace('<p>', '').replace('</p>', '');
    let img;
    if (body.image == null) img = '';
    else img = body.image.original;        
        

    let timeString = airtime;
    let H = timeString.split(':')[0];
    let h = H % 12 || 12;
    let am_pm = (H < 12 || H === 24) ? ' AM' : ' PM';
    timeString = h + ':' + timeString.split(':')[1] + am_pm;

    return message.channel.send(Util.Embed(`${show.title} ${body.season}x${Util.normalize(body.number)} - ${body.name}`, {
        description: sp + desc + sp + `\n\nAirdate: \`${moment(airdate).isValid() ? airdate.toDateString() : 'No Airdate Available'}\`\nAirtime: \`${body.airtime === '' ? 'No Airtime Available' : timeString + ' ET'}\`\nRuntime: \`${body.runtime} Minutes\`\nChannel: \`${show.channel}\`\n\n**[Full recap & trailer](${body.url} '${body.url}')**`,
        image: img
    }, message.member));
}
export let help = {
    name: 'ep',
    type: 'general',
    help_text: 'ep <show> <NxNN|SNENN> ~ N -> number',
    help_desc: 'Fetches episode info',
    owner: false,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {force: true, amount: 2, type: 'episode'},
    roles: [],
    user_perms: [],
    bot_perms: []
};