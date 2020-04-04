import 'dotenv/config.js';
import PrettyError from 'pretty-error';
PrettyError.start().withoutColors();
import Discord from "discord.js";
const gideon = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, partials: ['MESSAGE', 'REACTION'], restRequestTimeout: 25000 });
import Util from "./Util.js";

gideon.commands = new Discord.Collection();
gideon.vcmdexec = false;
gideon.emptyvc = false;
gideon.guessing = [];
gideon.listening = [];
gideon.spamcount = new Map();
gideon.cache = new Map();

if (process.env.CLIENT_TOKEN) gideon.login(process.env.CLIENT_TOKEN);
else {
    console.log("No client token!");
    process.exit(1);
}

setTimeout(() => {
    if (process.env.CI) {
        console.log("Exiting because CI was detected but cycle was not complete!");
        process.exit(1);
    }
}, 60e3);

gideon.once('ready', async () => {
    Util.LoadCommands(gideon);
    Util.SQL.InitDB(gideon);
    Util.Selfhostlog(gideon);

    console.log('Ready!');

    Util.config.prefixes.push(`<@!${gideon.user.id}>`, `<@${gideon.user.id}>`);
    
    const oneday = 1000 * 60 * 60;
    const twodays = 1000 * 60 * 60 * 48;
    setInterval(Util.status, 30e3, gideon);
    setInterval(Util.SQLBkup, twodays, gideon);
    setInterval(Util.ClearCache, oneday, gideon);

    gideon.fetchApplication().then(app => {
        //When the bot is owned by a team owner id is stored under ownerID, otherwise id
        gideon.owner = app.owner.ownerID ? app.owner.ownerID : app.owner.id;
    }, failed => console.log("Failed to fetch application: " + failed)).catch(ex => console.log(ex));

    setTimeout(() => {
        if (process.env.CI) {
            console.log("Exiting because CI was detected!");
            gideon.destroy();
            process.exit(0);
        }
    }, 10e3);
});

process.on("uncaughtException", err => {
    console.log(err);
    Util.log("Uncaught Exception: " + `\`\`\`\n${err.stack}\n\`\`\``);

    if (process.env.CI) {
        console.log("Exception detected, marking as failed");
        process.exit(1);
    }
});

process.on("unhandledRejection", err => {
    console.log(err);
    Util.log("Unhandled Rejection: " + `\`\`\`\n${err.stack + "\n\nJSON: " + JSON.stringify(err, null, 2)}\n\`\`\``);

    if (process.env.CI) {
        console.log("Unhandled Rejection detected, marking as failed");
        process.exit(1);
    }
});

gideon.on("error", err => {
    console.log(err);
    Util.log("Bot error: " + `\`\`\`\n${err.stack}\n\`\`\``);
});

gideon.on('message', message => {
    Util.MsgHandler.Handle(gideon, message, Util);
});

gideon.on("guildCreate", guild => {
    Util.log("Joined a new guild:\n" + guild.id + ' - `' + guild.name + '`');
    Util.Checks.LBG(guild, gideon, Util); //check if guild is blacklisted, if yes, leave
    Util.Invite(guild);
    Util.Checks.BotCheck(guild, gideon, Util); //check if guild collects bots, if yes, leave
});

gideon.on("guildDelete", guild => {
    Util.log("Left guild:\n" + guild.id + ' - `' + guild.name + '`');
});

gideon.on("shardReady", (id, unavailableGuilds) => {
    if (!unavailableGuilds) Util.log(`Shard \`${id}\` is connected!`);
    else Util.log(`Shard \`${id}\` is connected!\n\nThe following guilds are unavailable due to a server outage:\n${unavailableGuilds.map(x => x).join('\n')}`);
});

gideon.on("shardError", (error, shardID) => {
    Util.log(`Shard \`${shardID}\` has encountered a connection error:\n\n\`\`\`\n${error}\n\`\`\``);
});

gideon.on("shardDisconnect", (event, id) => {
    Util.log(`Shard \`${id}\` has lost its WebSocket connection:\n\n\`\`\`\nCode: ${event.code}\nReason: ${event.reason}\n\`\`\``);
});

gideon.on("guildUnavailable", guild => {
    Util.log(`The following guild turned unavailable due to a server outage:\n` + guild.id + ' - `' + guild.name + '`');
});

gideon.on("messageReactionAdd", (messageReaction, user) => {
    Util.Starboard(messageReaction, user, gideon);
});

gideon.on("guildMemberAdd", member => {
    Util.Welcome(member, gideon);
    Util.Checks.NameCheck(null, member.user, gideon);
});

gideon.on("guildMemberUpdate", (oldMember, newMember) => {
    Util.Checks.NameCheck(newMember, null, gideon);
});

gideon.on("userUpdate", (oldUser, newUser) => {
    Util.Checks.NameCheck(null, newUser, gideon);
});

gideon.on("messageUpdate", async (oldMessage, newMessage) => {
    if (newMessage.partial) await newMessage.fetch();
    if (newMessage.createdAt) Util.MsgHandler.Handle(gideon, newMessage, Util);
});

gideon.on("inviteCreate", Invite => {
    if (Invite.guild.id !== '595318490240385037') return;
    Util.log(`Invite for \`${Invite.guild.name ? Invite.guild.name : 'Not available'}\` has been created:\n\n\`\`\`\nInviter: ${Invite.inviter.tag ? Invite.inviter.tag : 'Not available'}\nChannel: ${Invite.channel.name}\n\`\`\`\n${Invite.url}`);
});

gideon.on("voiceStateUpdate", (oldState, newState) => {
    Util.Checks.VCCheck(oldState, newState, gideon);
});
