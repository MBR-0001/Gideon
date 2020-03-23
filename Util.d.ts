import Discord from "discord.js";
import BetterSqlite3 from "better-sqlite3";

export const config: Config;
export function parseSeriesEpisodeString(str: string): SeasonAndEpisodeInfo;
export function TRM(guild: Discord.Guild, mentionable: boolean): Promise<void>;
export function delay(num: number): Promise<void>;
export function GetUserTag(str: string | Discord.GuildMember | Discord.User): string;
export function getIdFromString(str: string): string;
export function secondsToDifferenceString(seconds: number, settings: secondsToDifferenceSettings): string;
export function log(message: string, files: string[]): boolean;
export function ABM_Test(message: Discord.Message): Promise<ABMResult>;
export function ABM(message: Discord.Message): void;
export function CVM(message: Discord.Message, gideon: Discord.Client): Promise<Discord.Message>;
export function IMG(image_id: string, message: Discord.Message): Promise<void>;
export function CSD(message: Discord.Message): Promise<void>;
export function AutoKick(member: Discord.GuildMember, gideon: Discord.Client): Promise<void>;
export function LBG(guild: Discord.Guild, gideon: Discord.Client): Promise<void>;
export function IBU(message: Discord.Message, gideon: Discord.Client): boolean;
export function Split<T>(arr: T[], chunks: number): T[][];
export function NPMInstall(gideon: Discord.Client): Promise<void>;
export function Starboard(reaction: Discord.MessageReaction, user: Discord.User, gideon: Discord.Client): Promise<void>;
export function Selfhostlog(gideon: Discord.Client): Promise<void>;
export function SQLBkup(): Promise<void>;
export function GetNextEpisodeInfo(url: string): Promise<EpisodeInfo>;
export function LeaveVC(message: Discord.Message): Promise<void>;
export function SpeechRecognition(speech: ReadableStream): Promise<VoiceInfoResponse>;
export function VoiceResponse(value: string, connection: Discord.VoiceConnection, message: Discord.Message, gideon: Discord.Client): Promise<void>;
export function TRMode(message: Discord.Message, gideon: Discord.Client): Promise<void>;
export function RulesCheck(message: Discord.Message): Promise<void>;
export function truncate(str: string, length: number, useWordBoundary: boolean): string;
export function normalize(num: number): string;
export function CreateEmbed(title: string, options?: EmbedOptions): Discord.MessageEmbed;
export function Translate(input: string): Promise<Array>;

declare module "discord.js" {
    interface Client {
        commands: Discord.Collection<string, Command>;
        vcmdexec: boolean;
        emptyvc: boolean;
        owner: string;
        guessing: string[];
        listening: string[];
        getScore: BetterSqlite3.Statement<any[]>;
        setScore: BetterSqlite3.Statement<any[]>;
        getTop10: BetterSqlite3.Statement<any[]>;
        getTrmode: BetterSqlite3.Statement<any[]>;
        setTrmode: BetterSqlite3.Statement<any[]>;
        getCVM: BetterSqlite3.Statement<any[]>;
        setCVM: BetterSqlite3.Statement<any[]>;
    }
}

declare global {
    export interface Array<T> {
        remove(item: T|T[]): boolean;
    }
}

interface EmbedOptions {
    description?: string;
    image?: string;
    fields?: Discord.EmbedField[];
    timestamp?: Date;
    color?: string;
    url?: string;
    author?: {name: string, icon?: string, url?: string};
    footer?: {text: string, icon?: string};
    thumbnail?: string;
}

interface Config {
    prefixes: string[];
    footer: string;
    avatar: string;
}

interface SeasonAndEpisodeInfo {
    season: number;
    episode: number;
}

interface ABMResult {
    match: boolean;
    content?: string;
}

interface secondsToDifferenceSettings {
    enableSeconds: boolean
}

interface Command {
    help: {
        name: string | string[];
        type: string;
        help_text: string;
        help_desc: string;
    },
    run: Function;
}

interface EpisodeInfo {
    title: string;
    name: string;
    value: string;
}

interface VoiceInfoResponse {
    msg_id: string;
    _text: string;
    entities: Record<string, {metadata: string, value: string, confidence: number}[]>
}