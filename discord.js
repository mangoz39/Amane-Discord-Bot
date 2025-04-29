const { Client } = require('discord.js');
const ytdl = require('ytdl-core');
const { token } = require('./token.json');
const { prefix } = require('./config.json');
const client = new Client();

class Music {

    constructor() {
        this.isPlaying = {};
        this.queue = {};
        this.connection = {};
        this.dispatcher = {};
    }

    async join(msg) {
        this.connection[msg.guild.id] = await msg.member.voice.channel.join();
        msg.channel.send('天音來囉 <3 ٩(●˙▿˙●)۶')
    }

    async play(msg) {

        // Channel ID
        const guildID = msg.guild.id;

        if (!this.connection[guildID]) {
            msg.channel.send('不讓我進頻道就想放歌！ 臭肥宅 (#`Д´)ﾉ');
            return;
        }

        const musicURL = msg.content.replace(`${prefix}play`, '').trim();

        try {

            const res = await ytdl.getInfo(musicURL);
            const info = res.videoDetails;

            if (!this.queue[guildID]) {
                this.queue[guildID] = [];
            }

            this.queue[guildID].push({
                name: info.title,
                url: musicURL
            });

            if (this.isPlaying[guildID]) {
                msg.channel.send(`加入歌曲：${info.title}`);
            } else {
                this.isPlaying[guildID] = true;
                this.playMusic(msg, guildID, this.queue[guildID][0]);
            }

        } catch(e) {
            console.log(e);
        }

    }

    playMusic(msg, guildID, musicInfo) {

        msg.channel.send(`播放  ${musicInfo.name}`);

        this.dispatcher[guildID] = this.connection[guildID].play(ytdl(musicInfo.url, { filter: 'audioonly' }));

        this.dispatcher[guildID].setVolume(0.5);

        this.queue[guildID].shift();

        const self = this;
        this.dispatcher[guildID].on('finish', () => {

            if (self.queue[guildID].length > 0) {
                self.playMusic(msg, guildID, self.queue[guildID].shift());
            } else {
                self.isPlaying[guildID] = false;
                msg.channel.send('目前沒有音樂了，趕快用音樂填滿天音吧 (´〃•ω•〃)♡');
            }
        });

    }

    resume(msg) {

        if (this.dispatcher[msg.guild.id]) {
            msg.channel.send('想我了嗎 我這就回來 <3');
            this.dispatcher[msg.guild.id].resume();
        }

    }

    pause(msg) {

        if (this.dispatcher[msg.guild.id]) {
            msg.channel.send('天音閉嘴了 QQ');

            // 暫停播放
            this.dispatcher[msg.guild.id].pause();
        }

    }

    skip(msg) {

        if (this.dispatcher[msg.guild.id]) {
            msg.channel.send('死肥宅 點了又要skip (╯‵□′)╯︵┴─┴ ');

            // 跳過歌曲
            this.dispatcher[msg.guild.id].end();
        }

    }

    nowQueue(msg) {

        if (this.queue[msg.guild.id] && this.queue[msg.guild.id].length > 0) {
            const queueString = this.queue[msg.guild.id].map((item, index) => `[${index+1}] ${item.name}`).join();
            msg.channel.send(queueString);
        } else {
            msg.channel.send('天音現在空空的喔，趕快用音樂填滿天音吧 (´〃•ω•〃)♡ ');
        }

    }

    leave(msg) {

        this.connection[msg.guild.id].disconnect();

    }
}

const music = new Music();

client.on('message', async (msg) => {

    if (!msg.guild) return;

    // !!join
    if (msg.content === `${prefix}join`) {

        // 機器人加入語音頻道
        music.join(msg);
    }

    //文字訊息

    if (msg.content === '肥貓') {
        msg.channel.send('屁眼');
    }
    if (msg.content === '胖寶寶') {
        msg.channel.send('老公 <3');
    }
    if (msg.content === '阿丹') {
        msg.channel.send('嘔 臭魯蛇 ٩(ŏ﹏ŏ、)۶');
    }
    if (msg.content === 'Minecraft') {
        msg.channel.send('180.176.149.103');
    }
    if (msg.content === '三姆') {
        msg.channel.send('天音討厭猴子 ヽ(ﾟ´Д`)ﾉﾟ');
    }
    if (msg.content === '天音') {
        msg.channel.send('噁肥宅 不要碰我肩膀！！');
    }
    if (msg.content === '我婆') {
        msg.channel.send('走開啦 噁爛肥宅 誰是你婆了 ಠ_ಠ');
    }
    if (msg.content === '林哲豪') {
        msg.channel.send('好老喔 ಠ_ಠ');
    }
    if (msg.content === '施工') {
        msg.channel.send('幹你娘林哲豪！！！');
    }


    // !!play command
    if (msg.content.indexOf(`${prefix}play`) > -1) {
        if (msg.member.voice.channel) {
            await music.play(msg);
        } else {
            msg.reply('還沒進頻道就急著點歌啊 死肥宅？');
        }
    }

    // !!resume
    if (msg.content === `${prefix}resume`) {
        music.resume(msg);
    }

    // !!pause
    if (msg.content === `${prefix}pause`) {
        music.pause(msg);
    }

    // !!skip
    if (msg.content === `${prefix}skip`) {
        music.skip(msg);
    }

    // !!queue
    if (msg.content === `${prefix}queue`) {
        music.nowQueue(msg);
    }

    // !!leave
    if (msg.content === `${prefix}leave`) {
        music.leave(msg);
    }
});

// Connection event
client.on('ready', () => {
    console.log(`屁眼已就緒`);
});

client.login(token);
