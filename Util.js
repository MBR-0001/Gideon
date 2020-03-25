const Discord = require("discord.js");
const fetch = require('node-fetch');
const config = require("./data/JSON/config.json");
const SQL = require('./Util/SQL')
const Voice = require('./Util/Voice')

Array.prototype.remove = function(...item) {
    if (Array.isArray(item)) {
        let rv = false;
        
        for (let i of item) {
            if (this.includes(i)) {
                this.splice(this.indexOf(i), 1);
                rv = true;
            }
        }

        if (rv) return true;
    }

    else if (this.includes(item)) {
        this.splice(this.indexOf(item), 1);
        return true;
    }

    return false;
}

class Util {
    constructor() {
        throw new Error('This class cannot be instantiated!');
    }

    static get config() { return config; }
    static get SQL() { return SQL; }
    static get Voice() { return Voice; }

    /**
     * @summary A low-level method for parsing episode stuff
     * @param {string} input
     * @returns {{season: number, episode: number}} The object containing the series and episode details
     */
    static parseSeriesEpisodeString(input) {
        if (!input) return null;

        let str = input.toLowerCase();
        let seriesString = ""
        let episodeString = "";
        let hit_limiter = false;

        for (let letter of str) {
            if (letter === "s") continue;

            if (letter === "e" || letter === "x") {
                hit_limiter = true;
                continue;
            }

            if (!(/^\d+$/.test(letter))) continue;

            if (!hit_limiter) {
                seriesString += letter
            } else {
                episodeString += letter;
            }
        }

        const seriesNumber = Number(seriesString);
        const episodeNumber = Number(episodeString);

        if (isNaN(seriesNumber) || isNaN(episodeNumber)) return null;

        return {
            season: seriesNumber,
            episode: episodeNumber
        };
    }

    /**
     * Make roles mentionable (or not)
     * @param {Discord.Guild} guild The guild to make roles mentionable in
     * @param {boolean} mentionable Whether or not to make roles mentionable
     */
    static async TRM(guild, mentionable) {
        if (!guild) return;
       
        for (let role of guild.roles.cache.array()) {
            if (role.editable) {
                try { await role.edit({ mentionable: mentionable }); }
                catch (ex) { console.log(ex); }
            }
        } 
    }

    /**
     * @param {number} inputDelay 
     */
    static delay(inputDelay) {
        // If the input is not a number, instantly resolve
        if (typeof inputDelay !== "number") return Promise.resolve();
        // Otherwise, resolve after the number of milliseconds.
        return new Promise(resolve => setTimeout(resolve, inputDelay));
    }

    /**
     * @returns {string}
     * @param {string | Discord.GuildMember | Discord.User} input 
     */
    static GetUserTag(input) {
        if (!input) return null;

        let id = "";
        if (typeof(input) == "string") id = input;
        else if (input instanceof Discord.GuildMember) id = input.user.id;
        else if (input instanceof Discord.User) id = input.id;
        if (!id) return input;

        return isNaN(id) ? input : "<@" + id + ">";
    }

    /**
     * @param {string} input 
     */
    static getIdFromString(input) {
        if (!input) return null;

        for (let item of ["<@!", "<@", "<#", ">"]) input = input.replace(item, "");

        return input;
    }

    /**
     * Convert a time in seconds to a time string
     * @param {number} seconds_input 
     * @param {boolean} seconds 
     * @returns {string} The beautifully formatted string
     */
    static secondsToDifferenceString(seconds_input, { enableSeconds = true }) {
        if (!seconds_input || typeof (seconds_input) !== "number") return "Unknown";

        let seconds = Math.floor(seconds_input % 60);
        seconds_input = seconds_input / 60;
        let minutes = Math.floor(seconds_input % 60);
        seconds_input = seconds_input / 60;
        let hours = Math.floor(seconds_input % 24);
        let days = Math.floor(seconds_input / 24);

        let dayString = days + " day" + (days !== 1 ? "s" : "");
        let hourString = hours + " hour" + (hours !== 1 ? "s" : "");
        let minuteString = minutes + " minute" + (minutes !== 1 ? "s" : "");
        let secondString = seconds + " second" + (seconds !== 1 ? "s" : "");

        let outputArray = [];
        if (days > 0) outputArray.push(dayString);
        if (hours > 0) outputArray.push(hourString);
        if (minutes > 0) outputArray.push(minuteString);
        if (seconds > 0 && enableSeconds) outputArray.push(secondString);

        // If the output array is empty, return unknown.
        if (outputArray.length === 0) return "Unknown";

        // If the output array is by itself, print the only element
        if (outputArray.length < 2) return outputArray[0];

        // Remove the last element from the array
        const last = outputArray.pop();
        return outputArray.join(", ") + " and " + last;
    }

    /**
     * Log to a webhook
     * @param {string | Discord.MessageEmbed} message 
     * @param {string[]} files 
     */
    static log(message, files) {
        let url = process.env.LOG_WEBHOOK_URL;
        if (!url || !message) return false;

        url = url.replace("https://discordapp.com/api/webhooks/", "");
        let split = url.split("/");

        if (split.length < 2) return false;

        let client = new Discord.WebhookClient(split[0], split[1]);

        if (typeof(message) == "string") {
            for (let msg of Discord.Util.splitMessage(message, { maxLength: 1980 })) {
                client.send(msg, { avatarURL: Util.config.avatar, username: "Gideon-Logs", files: files });
            }
        }

        else client.send(null, { embeds: [message], avatarURL: Util.config.avatar, username: "Gideon-Logs", files: files });
        
        return true;
    }

    /**
     * @param {Discord.Message} message
     * @returns {Promise<{match: boolean, content: string}>}
     */
    static ABM_Test(message) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            const content = message.content.replace(/ /g, "").replace(/\n/g, "").toLowerCase().trim();

            const abm = [
                'twitter.com/Pagmyst',
                'instagram.com/pageyyt',
                'youtube.com/user/SmallScreenYT',
                'instagram.com/thedctvshow',
                'twitter.com/thedctvshow',
                'youtube.com/channel/UCvFS-R57UT1q2U_Jp4pi1eg',
                'youtube.com/channel/UC6mI3QJFH1m2V8ZHvvHimVA',
                'twitter.com/theblackestlion',
                'twitter.com/tvpromosdb',
                'youtube.com/channel/UCDR8cvjALazMm2j9hOar8_g',
                'https://wegotthiscovered.com',
                'https://twitter.com/wgtc_site'
            ];

            for (let url of abm) {
                if (content.includes(url.toLowerCase())) return resolve({match: true, content: url});
            }

            // eslint-disable-next-line no-useless-escape
            const ytrg = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            const cids = ['UCTbT2FgB9oMpi4jB9gNPadQ', 'UCvFS-R57UT1q2U_Jp4pi1eg', 'UC6mI3QJFH1m2V8ZHvvHimVA', 'UCDR8cvjALazMm2j9hOar8_g'];

            if (message.content.match(ytrg)) {
                const id = message.content.match(ytrg);
                const google_api_key = process.env.GOOGLE_API_KEY;

                if (!google_api_key) return reject("No google API key");

                const api = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id[1]}&key=${google_api_key}`;

                try {
                    const body = await fetch(api).then(res => res.json());

                    const channel_id = body && body.items && body.items[0] && body.items[0].snippet && body.items[0].snippet.channelId ? body.items[0].snippet.channelId : null;
                    if (!channel_id) return reject("Failed to get data from API");

                    if (cids.includes(channel_id)) return resolve({match: true, content: "`" + message.content + "`"});
                }

                catch (e) {
                    Util.log("Failed to fetch data from YT API: " + e);
                    return reject(e);
                }
            }

            else resolve({match: false});
        });
    }

    /**
     * @param {Discord.Message} message 
     */
    static ABM(message) {
        const siren = '<a:siren:669518972407775265>';

        Util.ABM_Test(message).then(async res => {
            if (res.match) {
                await message.delete({ timeout: 200 });
                Util.log("ABM triggered by: " + message.author.tag + " (" + res.content + ")");
                message.channel.send(Util.GetUserTag(message.author), { embed: Util.CreateEmbed(`${siren}Anti-Bitch-Mode is enabled!${siren}`, {description: 'You posted a link to a forbidden social media account!'}) });
            }
        }, failed => console.log(failed));
    }

    /**
     * @param {Discord.Message} message 
     * @param {Discord.Client} gideon 
     */
    static async CVM(message, gideon) {
        let cvm = gideon.getCVM.get(message.guild.id);
        if (!cvm) return;
        if (cvm.cvmval === 0) return;

        const ids = ['595944027208024085', '595935317631172608', '595935345598529546', '598487475568246830', '622415301144870932', '596080078815887419'];

        if (ids.includes(message.channel.id)) return; //exclude certain channels

        const lowercaseContent = message.content.toLowerCase();

        // Find the prefix that was used
        const usedPrefix = config.prefixes.find(prefix => lowercaseContent.startsWith(prefix));
        let args = '';

        if (!usedPrefix) args = message.content.split(' ').map(x => x.trim()).filter(x => x);
        else args = message.content.slice(usedPrefix.length).trim().split(" ");

        if (lowercaseContent.startsWith(usedPrefix) && !args[5]) return; //exclude bot cmds from filter

        let plainText = Discord.Util.escapeMarkdown(message.content); //remove Markdown to apply spoiler tags

        // eslint-disable-next-line no-useless-escape
        if (plainText.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i)) { //if URL is matched delete & return
            await message.delete({ timeout: 200 });
            return message.reply('Links are not allowed meanwhile Crossover-Mode is active!');
        }

        let trmode = gideon.getTrmode.get(message.author.id);
        if (trmode) if (trmode.trmodeval === 1) {
            let tr = await Util.Translate(plainText);
            plainText = `(${tr[1]}) ${tr[0]}`;
        }

        await message.channel.send(Util.CreateEmbed(null, {
            description: `${plainText ? '||' + plainText + '||' : ''}`,
            author: {
                name: `${message.author.tag} ${plainText ? 'said' : 'sent file(s)'}:`,
                icon: message.author.avatarURL()
            }
        }));

        //we don't send the file in the same message because it shows it above the embed (bad)
        if (message.attachments.filter(x => x.size / 1024 <= 1000).size > 0) {
            //we reupload attachments smaller than ~1000 KB
            await message.channel.send({files: message.attachments.filter(x => x.size / 1024 <= 1000).map(x => {
                let split = x.url.split("/");
                let filename = split[split.length - 1];
                return new Discord.MessageAttachment(x.url, 'SPOILER_' + filename);
            })});
        }

        message.delete({ timeout: 200 });
    }

    /**
     * Get image from imgur album
     * @param {string} imgid 
     * @param {Discord.Message} message
     */
    static async IMG(imgid, message) {
        const Imgur = require('imgur-node');

        if (!process.env.IMG_CL) return;

        const imgclient = new Imgur.Client(process.env.IMG_CL);

        imgclient.album.get(imgid, (err, res) => {
            if (err) {
                console.log(err);
                Util.log(err);
                return message.channel.send(Util.CreateEmbed('An error occurred, please try again later!'));
            }
    
            let min = 0;
            let max = res.images.length - 1;
            let ranum = Math.floor(Math.random() * (max - min + 1)) + min;
            let rimg = res.images[ranum].link;

            message.channel.send(Util.CreateEmbed(imgid == 'ngJQmxL' ? 'Germ approves!:white_check_mark:' : '', {image: rimg}));
        });
    }

    /**
     * Easter eggs
     * @param {Discord.Message} message 
     */
    static async CSD(message) {
        const vid = 'https://cdn.discordapp.com/attachments/525341082435715085/638782331791867930/Crime_Solving_Devil.mp4';
        const tls = 'https://twitter.com/LaurenGerman/status/996886094305050627\nhttps://twitter.com/tomellis17/status/996889307506864128';
        const ctm = 'https://media.discordapp.net/attachments/595318490240385043/643119052939853824/image0.jpg';
        const img = 'https://media.discordapp.net/attachments/669243069878501385/687048353296678943/es7-promise-async-await-es6-promise-es5-callback-hell-async-27790051.png';
        const vid2 = 'https://cdn.discordapp.com/attachments/679864620864765983/686589432501239899/Hi_Im_Richard_Castle.mp4';
        const train = 'https://cdn.discordapp.com/attachments/679864620864765983/688677813934620725/Gary_the_unspeakable_train-abomination.mp4';
        const yombo = 'https://cdn.discordapp.com/attachments/679864620864765983/692020740215537755/YomboBomboMomboJombo.mp4';

        if (message.content.match(/(?:devil)/i)) message.channel.send(vid);
        if (message.content.match(/(?:deckerstar)/i)) Util.IMG('rJpbLQx', message);
        if (message.content.match(/(?:caskett)/i)) Util.IMG('eemyeVL', message);
        if (message.content.match(/(?:muffin)/i) && message.content.match(/(?:top)/i)) message.channel.send(tls);
        if (message.content.match(/(?:germ)/i)) Util.IMG('ngJQmxL', message);
        if (message.content.match(/(?:typical)/i) && message.content.match(/(?:cheetah)/i)) message.channel.send(Util.CreateEmbed(null, {image: ctm}));
        if (message.content.match(/(?:callback)/i)) message.channel.send(Util.CreateEmbed(null, {image: img}));
        if (message.content.match(/(?:castle)/i)) message.channel.send(vid2);
        if (message.content.match(/(?:constantine)/i)) message.channel.send(yombo);
        if (message.content.match(/(?:gary)/i) || message.content.match(/(?:train)/i) || message.content.match(/(?:abomination)/i)) message.channel.send(train);
    }

    /**
     * Get episode info 
     * @returns {Promise<{title: string, name: string, value: string}>}
     * @param {string} api_url 
     */
    static async GetNextEpisodeInfo(api_url) {
        return new Promise((resolve, reject) => {
            if (!api_url) return reject("Missing API URL");
            
            fetch(api_url).then(res => {
                if (res.status !== 200) return reject(res.statusText);

                res.json().then(body => {
                    let title = body.name;
    
                    let result = { title: title, name: null, value: null };
    
                    if (!body._embedded) {
                        result.name = '';
                        result.value = 'No Episode data available yet';
                    }
    
                    else {
                        let season = body._embedded.nextepisode.season;
                        let number = body._embedded.nextepisode.number;
                        let name = body._embedded.nextepisode.name;
                        let date = new Date(body._embedded.nextepisode.airstamp);
                        let channel = body.network ? body.network.name : "Unknown";

                        let time_diff_s = Math.abs(new Date() - date) / 1000;

                        let airs_today = time_diff_s < 60 * 60 * 24;
                        
                        let res_value = `Airs in **${Util.secondsToDifferenceString(time_diff_s, {enableSeconds: false})}**`;

                        if (!airs_today) {
                            //this is how we turn
                            //Wed, 09 Oct 2019 10:00:00 GMT
                            //into
                            //9 Oct 2019 10:00
                            let _date = date.toUTCString().replace("GMT", "");
                            //remove "Wed, " (5)
                            _date = _date.substr(5);

                            //remove the last :00
                            _date = _date.split(":");
                            _date.pop();
                            _date = _date.join(":");

                            //thankfully, the .replace method does not work as you would expect it to
                            //you would expect it to remove all searchValues from the string, right?
                            //WRONG, it only removes the first searchValue (lol)
                            if (_date.startsWith("0")) _date = _date.replace("0", "");

                            res_value += ` (\`${_date} UTC\`)`;
                        }
                        
                        res_value += ` on ${channel}`;

                        result.name = `${season}x${number < 10 ? `0` + number : number} - ${name}`;
                        result.value = res_value;
                    }
    
                    return resolve(result);
                }, failed => reject(failed));
            }, failed => reject(failed));
        });
    }

    /**
     * @param {string} title
     * @param {string?} description
     * @param {{
        description?: string;
        image?: string;
        fields?: Discord.EmbedField[];
        timestamp?: Date;
        color?: string;
        url?: string;
        author?: {name: string, icon: string, url: string};
        footer?: {text: string, icon: string};
        thumbnail?: string;
       }} options
     */
    static CreateEmbed(title, options) {
        if (!options) options = {};
        
        const logos = '<a:flash360:686326039525326946> <a:arrow360:686326029719306261> <a:supergirl360:686326042687832123> <a:constantine360:686328072529903645> <a:lot360:686328072198160445> <a:batwoman360:686326033783193631>';

        const embed = new Discord.MessageEmbed()
        .setColor('#2791D3')
        .setFooter(Util.config.footer, Util.config.avatar)

        if (title && typeof(title) == "string") embed.setTitle(title);
        if (options.description && typeof(options.description) == "string") embed.setDescription(options.description + `\n${logos}`);
        if (options.color) embed.setColor(options.color);
        if (options.image && typeof(options.image) == "string") embed.setImage(options.image);
        if (options.url && typeof(options.url)) embed.setURL(options.url);
        if (options.timestamp && (typeof(options.timestamp) == "number" || options.timestamp instanceof Date)) embed.setTimestamp(options.timestamp);
        if (options.thumbnail && typeof(options.thumbnail) == "string") embed.setThumbnail(options.thumbnail);
        if (options.footer && options.footer.text && !Object.values(options.footer).some(x => typeof(x) != "string")) embed.setFooter(options.footer.text, options.footer.icon);
        if (options.author && options.author.name && !Object.values(options.author).some(x => typeof(x) != "string")) embed.setAuthor(options.author.name, options.author.icon, options.author.url);
        if (options.fields && Array.isArray(options.fields)) {
            if (!options.fields.some(x => !x.name || !x.value)) {
                embed.fields = options.fields.map(x => ({name: x.name, value: x.value, inline: x.inline}));
            }
        }

        return embed;
    }

    /** 
     * Translate texts
     * @param {String} input 
     */
    static async Translate(input) {
        const sourceLang = 'auto';
        const targetLang = 'en';
        const sourceText = input

        const api = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
        + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

        const body = await fetch(api).then(res => res.json());
        let sourceflag = `:flag_${body[2]}:`;
        if (body[2] == targetLang) sourceflag = ':flag_gb:';

        return [body[0][0][0], sourceflag]
    }

    /** 
     * Automatic translation mode 
     * @param {Discord.Message} message 
     * @param {Discord.Client} gideon
     */
    static async TRMode(message, gideon) {
        const lowercaseContent = message.content.toLowerCase();

        // Find the prefix that was used
        const usedPrefix = config.prefixes.find(prefix => lowercaseContent.startsWith(prefix));
        let args = '';

        if (!usedPrefix) args = message.content.split(' ').map(x => x.trim()).filter(x => x);
        else args = message.content.slice(usedPrefix.length).trim().split(" ");

        if (lowercaseContent.startsWith(usedPrefix) && !args[5]) return; //exclude bot cmds from filter

        let cvm = gideon.getCVM.get(message.guild.id); //if CVM is enabled, return
        if (cvm) if (cvm.cvmval === 1) return;
        
        let trmode = gideon.getTrmode.get(message.author.id);
        if (!trmode) {
            trmode = {
                id: message.author.id,
                trmodeval: 0,
            }
            gideon.setTrmode.run(trmode);
        }
        
        if (trmode.trmodeval === 0) return;

        else {
            let tr = await Util.Translate(args.join(' '));
            await message.delete({ timeout: 200 });
            message.channel.send(Util.CreateEmbed(null, {description: `(${tr[1]}) ${tr[0]}`, author: {name: `${message.author.tag} said:`, icon: message.author.avatarURL()}}));
        }
    }

    /**
     * Cuts string down to specified length
     * @param {string} str 
     * @param {number} length 
     * @param {boolean} useWordBoundary 
     */
    static truncate(str, length, useWordBoundary) {
        if (str.length <= length) return str;
        let subString = str.substr(0, length - 1);
        return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "...";
    }

    /**
     * Converts number to string & ensures it has at least 2 digits
     * @param {number} num 
     */
    static normalize(num) {
        if (num == undefined || typeof(num) != "number") return "";

        return num.toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping: false});
    }

    /**
     * Leaves a blacklisted guild
     * @param {Discord.Guild} guild 
     */
    static async LBG(guild, gideon) {
        const id = guild.id;
        let gbl = gideon.getGBL.get(id);
        if (!gbl) return;
        if (gbl.guildval === 0) return;

        let textchannels = guild.channels.cache.filter(c=> c.type == "text");
        let channels = textchannels.filter(c=> c.permissionsFor(guild.me).has('SEND_MESSAGES'));
        if (!channels.size) {
            await guild.leave();
            Util.log(`Leaving guild \`${id}\` due to it being blacklisted!`);
        }

        else{
            channels.random().send('This guild is banned by the bot owner!\nNow leaving this guild!');
            await guild.leave();
            Util.log(`Leaving guild \`${id}\` due to it being blacklisted!`);
        }
    }

    /**
     * Ignore commands from blacklisted users
     * @param {Discord.Message} message 
     * @returns {boolean}
     */
    static IBU(message, gideon) {
        let ubl = gideon.getGBL.get(message.author.id);
        if (!ubl) return;
        return ubl.userval === 1;
    }

    /**
     * Runs NPM Install
     * @param {Discord.Client} gideon
     */
    static async NPMInstall(gideon) {
        const exec = require('child_process').exec;

        if (gideon.user.tag !== 'Gideon#2420') return;
        
        Util.log("`Now running npm install...`");
        const install = exec('npm install');

        install.stdout.on('data', data => Util.log("```\n" + data + "```"));

        install.stdout.on('end', () => {
            Util.log("`Automatic NPM install ran successfully!");
            gideon.shard.respawnAll();
        }); 
    }

    /**
     * Split Array into Arrays
     * @param {any[]} arr
     * @param {number} chunks
     */
    static Split(arr, chunks) {
        let array_of_arrays = [];

        for (let i = 0; i < arr.length; i += chunks) {
            array_of_arrays.push(arr.slice(i, i + chunks));
        }

        return array_of_arrays;
    }

    /**
     * Logs bot
     * @param {Discord.Client} gideon 
     */
    static async Selfhostlog(gideon) {
        if (['Gideon#2420', 'gideon-dev#4623', 'FlotationMode#5372', 'theRapist#9880', 'githubactions#9363'].includes(gideon.user.tag)) return; 

        const api = 'https://gideonbot.co.vu/api/selfhost';
        let body = {
            user: gideon.user.tag,
            guilds: gideon.guilds.cache.map(x => x.id + " - " + x.name)
        }

        const options = { method: 'POST', body: JSON.stringify(body, null, 2), headers: { "Content-Type": "application/json" } };
        fetch(api, options);
    }

    /**
     * Rules check
     * @param {Discord.Message} message 
     */
    static async RulesCheck(message) {
        if (message.guild.id !== '595318490240385037') return;
        if (message.member.roles.cache.has('688430418466177082')) return;

        if (message.channel.id === '595934999824302091') {
            if (message.content.match(/(?:readdemrulez)/i)) {
                await message.delete({ timeout: 200 });
                const role = message.guild.roles.cache.get('688430418466177082');
                const member = message.member;
                await member.roles.add(role);
                await message.reply(`\`you have been given the\` ${role} \`role and gained access to\` <#595935317631172608>\`!\``);
            }
        }
        
        else return message.reply('`you have not yet read the rules. You will be kicked immediately if you keep refusing to.`');
    }

    /**
     * Auto-kick
     * @param {Discord.GuildMember} member 
     * @param {Discord.Client} gideon 
     */
    static async AutoKick(member, gideon) {
        let t;
        let k;
        const channel = gideon.guilds.cache.get('595318490240385037').channels.cache.get('595318490240385043');

        async function check() {
            if (member.deleted) return;
            if (member.roles.cache.has('688430418466177082')) return; 
            
            channel.send(`${member.user.toString()} \`you have 30 minutes left to read\` <#595935345598529546> \`otherwise you will be kicked!\``);
            setTimeout(kick, 30 * 60 * 1000);
        }

        setTimeout(check, 30 * 60 * 1000);

        async function kick() {
            if (member.deleted) return;
            if (member.roles.cache.has('688430418466177082')) return;
            await member.send('You have been kicked for not reading the rules!').catch(ex => console.log(ex));
            await channel.send(`${member.user.tag} has been kicked for not reading the rules!`);
            await member.kick();
        }
    }

    /**
     * DB Backup
     */
    static async SQLBkup(gideon) {
        const { zip } = require('zip-a-folder');
        const del = require('del');
        const db = './data/SQL';
        const arc = './data/SQL.zip';
        const date = new Date();

        try {
            const channel = gideon.guilds.cache.get('595318490240385037').channels.cache.get('622415301144870932');
            await zip(db, arc);
            channel.send(`SQL Database Backup:\n\nCreated at: \`${date.toUTCString()}\``, { files: [arc] });
            await del(arc);
            const lastbkup = await channel.messages.fetchPinned({ limit: 1 });
            if (lastbkup) await lastbkup.first().unpin();
            const msg = await channel.messages.fetch({ limit: 1 });
            const bkupmsg = msg.first();
            await bkupmsg.pin();
        }
        
        catch (ex) {
            console.log("Caught an exception while backing up!: " + ex.stack);
            Util.log("Caught an exception while backing up!: " + ex.stack);
        }      
    }

    /**
     * Starboard
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User} user
     * @param {Discord.Client} gideon
     */
    static async Starboard(reaction, user, gideon) {
        try {
            const board = gideon.guilds.cache.get('595318490240385037').channels.cache.get('691639957835743292');

            if (reaction.partial) await reaction.fetch();
            if (reaction.message.partial) await reaction.message.fetch();

            if (reaction.message.guild.id !== '595318490240385037') return;
            if (reaction.emoji.name !== '⭐') return;
            if (reaction.message.embeds[0]) return;
            if (reaction.users.cache.size > 1) return;

            const starmsg = Util.CreateEmbed(null, {
                author: {
                    name: reaction.message.author.tag,
                    icon: reaction.message.author.displayAvatarURL()
                },
                description: reaction.message.content,
                fields: [ 
                    {
                        name: 'Message Info:',
                        value: 'Sent in: ' + reaction.message.channel.toString() + ' | Starred by: ' + user.tag + ` | [Jump](${reaction.message.url})`
                    }
                ]
            })

            if (reaction.message.attachments.size > 0) starmsg.setImage(reaction.message.attachments.first().proxyURL);

            await board.send(starmsg);
        }
        
        catch (ex) {
            console.log("Caught an exception while starboarding!: " + ex.stack);
            Util.log("Caught an exception while starboarding!: " + ex.stack);
        }      
    }
}

module.exports = Util;
