require('dotenv').config();
const Discord = require('discord.js');
const fs = require("fs");
const gideon = new Discord.Client();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/scores.sqlite');
const Util = require("./Util");

gideon.commands = new Discord.Collection();
gideon.cvmt = false;

fs.readdir("./cmds", (err, files) => {
    if (err) {
        Util.log("Error while reading commands:\n" + err);
        console.log(err);
        return;
    }

    let jsfiles = files.filter(fileName => fileName.endsWith(".js"));
    if (jsfiles.length < 1) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsfiles.length} commands!`)

    jsfiles.forEach((fileName, i) => {
        let props = require(`./cmds/${fileName}`);

        if (Array.isArray(props.help.name)) {
            for (let item of props.help.name) gideon.commands.set(item, props);
        }
        else gideon.commands.set(props.help.name, props);

        console.log(`${i + 1}: ${fileName} loaded - ${Array.isArray(props.help.name) ? props.help.name.join(", ") : props.help.name}`);
    });
});

gideon.once('ready', async () => {
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER);").run();
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    }

    gideon.getScore = sql.prepare("SELECT * FROM scores WHERE user = ?");
    gideon.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points) VALUES (@id, @user, @guild, @points);");

    async function status() {
        const tmvt = gideon.guilds.get('595318490240385037');
        if (!tmvt) return;

        let mbc = tmvt.members.filter(member => !member.user.bot).size;
        const st1 = `!help | invite.gg/tmvt`;
        let st2 = `${mbc} Time Vault members`;
        const st3 = 'over Queen JPK!';

        gideon.user.setActivity(st1, { type: 'PLAYING' }); 
        await Util.delay(10000);
        gideon.user.setActivity(st2, { type: 'WATCHING' }); 
        await Util.delay(10000);
        gideon.user.setActivity(st3, { type: 'WATCHING' });
    }
    
    console.log('Ready!');
    Util.log(`${gideon.user.tag} ready!\nServers:\n${gideon.guilds.map(x => x.id + ' - `' + x.name + '`').join("\n")}`);
    let ids = gideon.guilds.map(x => x.id);

    for (let i = 0; i < ids.length; i++) {
        try {
            let guild = gideon.guilds.get(ids[i]);
            let textchannels = guild.channels.filter(c=> c.type == "text");
            let invitechannels = textchannels.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
            if(!invitechannels.size) return;

            invitechannels.random().createInvite().then(invite=> Util.log('Found Invite:\n' + 'https://discord.gg/' + invite.code));
        }
        
        catch (ex) {
            console.log("Caught an exception while creating invites!: " + ex);
            Util.log("Caught an exception while creating invites!: " + ex);
        }
    }

    setInterval(status, 30000);
});

process.on("uncaughtException", err => {
    console.log("Uncaught Exception: " + err.stack);
    Util.log("Uncaught Exception: " + err.stack);
});

process.on("unhandledRejection", err => {
    console.log("Unhandled Rejection: " + err.stack + "\n\nJSON: " + JSON.stringify(err, null, 2));
    Util.log("Unhandled Rejection: " + err.stack + "\n\nJSON: " + JSON.stringify(err, null, 2));
});

gideon.on("error", err => {
    console.log("Bot error: " + err.stack);
    Util.log("Bot error: " + err.stack);
});

gideon.on('message', (message) => {
    if (!message || !message.author || message.author.bot || !message.guild) return;
    
    Util.ABM(message);
    if (gideon.cvmt) Util.CVM(message);
    Util.CSD(message);

    const lowercaseContent = message.content.toLowerCase();
    const usedPrefix = Util.config.prefixes.find(prefix => lowercaseContent.startsWith(prefix.toLowerCase()));
    if (!usedPrefix) return;

    const inputString = message.content.slice(usedPrefix.length).trim();
    const args = inputString.split(' ').filter(arg => arg !== '');

    let cmd = args.shift();

    if (!cmd) return;

    cmd = cmd.toLowerCase();
    const command = gideon.commands.get(cmd);
    if (command) command.run(gideon, message, args);
});

gideon.login(process.env.CLIENT_TOKEN);