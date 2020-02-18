require('dotenv').config();
const Discord = require('discord.js');
const fs = require("fs");
const gideon = new Discord.Client();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/SQL/gideon.sqlite');
const Util = require("./Util");

gideon.commands = new Discord.Collection();
gideon.vcmdexec = false;
gideon.emptyvc = false;

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
    const scoresdb = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!scoresdb['count(*)']) {
    sql.prepare("CREATE TABLE scores (user TEXT PRIMARY KEY, points INTEGER, guild TEXT);").run();
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (user);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    }

    const trmodedb = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'trmode';").get();
    if (!trmodedb['count(*)']) {
    sql.prepare("CREATE TABLE trmode (user TEXT PRIMARY KEY, trmodeval BIT);").run();
    sql.prepare("CREATE UNIQUE INDEX idx_trmode_id ON trmode (user);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    }

    const cvmdb = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'cvm';").get();
    if (!cvmdb['count(*)']) {
    sql.prepare("CREATE TABLE cvm (guild TEXT PRIMARY KEY, cvmval BIT);").run();
    sql.prepare("CREATE UNIQUE INDEX idx_cvm_id ON cvm (guild);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    }

    gideon.getScore = sql.prepare("SELECT * FROM scores WHERE user = ?");
    gideon.setScore = sql.prepare("INSERT OR REPLACE INTO scores (user, points, guild) VALUES (@user, @points, @guild);");

    gideon.getTrmode = sql.prepare("SELECT * FROM trmode WHERE user = ?");
    gideon.setTrmode = sql.prepare("INSERT OR REPLACE INTO trmode (user, trmodeval) VALUES (@user, @trmodeval);");

    gideon.getCVM = sql.prepare("SELECT * FROM cvm WHERE guild = ?");
    gideon.setCVM = sql.prepare("INSERT OR REPLACE INTO cvm (guild, cvmval) VALUES (@guild, @cvmval);");

    async function status() {
        const guilds = gideon.guilds.cache.size;
        const tmvt = gideon.guilds.cache.get('595318490240385037');
        if (!tmvt) return;

        let mbc = tmvt.members.cache.filter(member => !member.user.bot).size;
        const st1 = `!help | gideonbot.co.vu`;
        let st2 = `${mbc} Time Vault members`;
        const st3 = `${guilds} Guilds`;

        gideon.user.setActivity(st1, { type: 'PLAYING' }); 
        await Util.delay(10000);
        gideon.user.setActivity(st2, { type: 'WATCHING' }); 
        await Util.delay(10000);
        gideon.user.setActivity(st3, { type: 'WATCHING' });
    }
    
    console.log('Ready!');
    Util.log(`${gideon.user.tag} ready!\n\nOnline in \`${gideon.guilds.cache.size}\` guilds:\n${gideon.guilds.cache.map(x => x.id + ' - `' + x.name + '`').join("\n")}`);
    if (gideon.guilds.cache.size >= 1000) Util.log(`<@224617799434108928> <@351871113346809860>\n1000+ Guilds reached. Please refactor for sharding!`);

    setInterval(status, 30e3);

    gideon.fetchApplication().then(app => {
        //when the bot is owned by a team owner id is stored under ownerID, otherwise id
        gideon.owner = app.owner.ownerID ? app.owner.ownerID : app.owner.id;
    }, failed => console.log("Failed to fetch application: " + failed));
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
    Util.TRMode(gideon, message);

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

gideon.on("guildCreate", guild => {
    Util.log("Joined a new guild:\n" + guild.id + ' - `' + guild.name + '`');
})

gideon.on("voiceStateUpdate", (oldState, newState) => {
    let newChannel = newState.channel;
    let oldChannel = oldState.channel;

    if (oldChannel && !newChannel) {
        // User leaves a voice channel
        const members = oldChannel.members.map(x => x.id);
        if (!members.includes(gideon.user.id)) return;

        const bot_count = oldChannel.members.filter(x => x.user.bot).size;

        if (oldChannel.members.size - bot_count === 0) {
            gideon.emptyvc = true;
            return oldChannel.leave();
        }
    }
})

gideon.login(process.env.CLIENT_TOKEN);