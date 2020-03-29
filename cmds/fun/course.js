const Discord = require("discord.js");
const fetch = require('node-fetch');
const path = require('path');
const Util = require("../../Util");

/**
 * @param {Discord.Client} gideon
 * @param {Discord.Message} message
 * @param {string[]} args
 */
module.exports.run = async (gideon, message, args, connection) => {
    let agm;
    if (args) {
        agm = args.join("").toLowerCase();
        if (agm.match(/(?:course)/i)) {
            message.channel.send('Yes Captain Lance!');
        } 
    }     

    if (connection) {
        const confirm = connection.play(path.resolve(__dirname, '../../data/audio/captain/Right away, Captain!.m4a'));
        confirm.pause();
        confirm.resume();

        confirm.on('finish', () => {
            confirm.destroy();

            const timejump = connection.play(path.resolve(__dirname, '../../data/audio/phrases/Executing timejump now.m4a'));
            timejump.pause();
            timejump.resume();

            timejump.on('finish', () => {
                timejump.destroy();
                gideon.vcmdexec = false;
            });
        });
    }

    try {
        const api1 = 'http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off';
        const body1 = await fetch(api1).then(res => res.json()); 
        const total_count = body1.metadata.totalCount;
        let dmin = 0;
        let dmax = total_count - 1;
        const offset = Math.floor(Math.random() * (dmax - dmin + 1)) + dmin;
        const api2 = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=0${offset}&hateoasMode=off`;
        const body2 = await fetch(api2).then(res => res.json());
        const destination = `${body2.data[0].city}, ${body2.data[0].country}`;
        let tmin = 0;
        let tmax = 3000;
        let year = Math.floor(Math.random() * (tmax - tmin + 1)) + tmin;

        message.channel.send(Util.CreateEmbed(`Course set to ${destination} ${year}`, {image: 'https://i.imgur.com/I3UQhVu.gif'}));
    }
    
    catch (ex) {
        console.log("Caught an exception while plotting a course: " + ex.stack);
        Util.log("Caught an exception while plotting a course: " + ex.stack);
        
        return message.channel.send(Util.CreateEmbed('An error occurred while trying to plot a course!'));
    }
}

module.exports.help = {
    name: ["plot", "timejump"],
    type: "fun",
    help_text: "Gideon, plot a course! <:voicerecognition:693521621184413777>",
    help_desc: "Plots a course",
    owner: false,
    voice: true,
    timevault: false,
    roles: [],
    user_perms: [],
    bot_perms: []
}