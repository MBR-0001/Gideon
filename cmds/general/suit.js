import Discord from "discord.js";
import Util from "../../Util.js";

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
export async function run(gideon, message, args) {     
    const st = Util.CreateEmbed('You must choose a valid character!', {
        description: 'Currently available:\n**killer frost**\n**supergirl**\n**arrow**\n**flash**\n**batwoman**\n**black siren**\n**spartan**\n**kingdom come superman**'
    }, message.member);

    const suits = [
        {
            image: 'https://i.imgur.com/0XI5gxr.jpg',
            title: 'Killer Frost',
            desc: 'This is Danielle Panabaker\'s new suit for The Flash Season 6!'
        },
        {
            image: 'https://i.imgur.com/FU2mzws.jpg',
            title: 'Supergirl',
            desc: 'This is Melissa Benoist\'s new suit for Supergirl Season 5!'
        },
        {
            image: 'https://i.imgur.com/8C14JtU.png',
            title: 'The Flash',
            desc: 'This is Grant Gustin\'s new suit for The Flash Season 6!'
        },
        {
            image: 'https://i.imgur.com/bgJmu8c.jpg',
            title: 'The Green Arrow',
            desc: 'This is Stephen Amell\'s new suit for Arrow Season 8!'
        },
        {
            image: 'https://i.imgur.com/2vkMLrp.jpg',
            title: 'Batwoman',
            desc: 'This is Ruby Rose\'s new suit for Batwoman Season 1!'
        },
        {
            image: 'https://i.imgur.com/yeGZG8e.jpg',
            title: 'The Black Siren',
            desc: 'This is Katie Cassidy-Rodgers\' new suit for Arrow Season 8!'
        },
        {
            image: 'https://i.imgur.com/EduRbe4.jpg',
            title: 'Spartan',
            desc: 'This is David Ramsey\'s new suit for Arrow Season 8!'
        },
        {
            image: 'https://i.imgur.com/vcZcD8R.jpg',
            title: 'Kingdom Come Superman',
            desc: 'This is Brandon Routh\'s new suit for COIE!'
        },
        {
            image: 'https://i.imgur.com/IXs05KD.jpg',
            title: 'Harbinger',
            desc: 'This is Audrey Marie Anderson\'s new suit for COIE!'
        },
    ]

    let suit = suits[-1];

    if (args[0].match(/(?:killer)/i) && args[1].match(/(?:frost)/i)) suit = suits[0];
    else if (args[0].match(/(?:supergirl)/i)) suit = suits[1];
    else if (args[0].match(/(?:flash)/i)) suit = suits[2];
    else if (args[0].match(/(?:arrow)/i)) suit = suits[3];
    else if (args[0].match(/(?:batwoman)/i)) suit = suits[4];
    else if (args[0].match(/(?:black)/i) && args[1].match(/(?:siren)/i)) suit = suits[5];
    else if (args[0].match(/(?:spartan)/i)) suit = suits[6]; 
    else if (args[0].match(/(?:kingdom)/i) && args[1].match(/(?:come)/i) && args[2].match(/(?:superman)/i)) suit = suits[7];
    else if (args[0].match(/(?:harbinger)/i)) suit = suits[8];
    else return message.channel.send(st);

    message.channel.send(Util.CreateEmbed(suit.title, {description: suit.desc, image: suit.image}, message.member));  
}

export const help = {
    name: ["suit", "suits", "costume", "costumes"],
    type: "general",
    help_text: "suit <character>",
    help_desc: "Displays newly revealed suits",
    owner: false,
    voice: false,
    timevault: false,
    nsfw: false,
    args: {force: true, amount: 1},
    roles: [],
    user_perms: [],
    bot_perms: []
}