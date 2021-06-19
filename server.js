/*
    using discord.js v11.6.4
*/

const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

http.createServer(function (req, res) 
{
    if (req.method == 'POST') 
    {
        var data = "";
        req.on('data', function (chunk) 
        {
            data += chunk;
        });
        req.on('end', function () 
        {
            if (!data) 
            {
                res.end("No post data");
                return;
            }
            var dataObject = querystring.parse(data);
            console.log("post:" + dataObject.type);
            if (dataObject.type == "wake") 
            {
                console.log("Woke up in post");
                res.end();
                return;
            }
            res.end();
        });
    }
    else if (req.method == 'GET') 
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is active now\n');
    }
}).listen(3000);

client.on('ready', message => 
{
    console.log('Bot準備完了～');
    client.user.setPresence({ game: { name: '.nit help' } });
});

client.on('message', message => 
{
    if (message.author.id == client.user.id || message.author.bot) 
    {
        return;
    }
    if (message.content.match(/.nit help/)) 
    {
        const embed = new discord.MessageEmbed()
            .setTitle("ヘルプ")
            .setColor('#00a2ff')
            .addField('.nit rt', 'コマンド入力者が参加しているVCの参加者からランダムなチームを作成する。\n')
        message.channel.send(embed);
        return;
    }
    if (message.content.match(/.nit rt/)) 
    {
        let vc = message.member.voiceChannel;
        if(vc)
        {
            let members = vc.members;
            let teams = [];
            let teamCount = 1;
            while(3 < members.size)
            {
                let teamMember = [];
                for(let i = 0; i < 3; i++)
                {
                    let index = Math.floor(Math.random() * members.size);
                    teamMember.push(members[index]);
                    members.splice(index, 1);
                }
                teams.push({name: "チーム" + teamCount, value: teamMember});
                teamCount++;
            }
            if(0 < members)
            {
                teams.push({name: "余ったメンバー", value: members});
            }
            message.channel.send(
                {
                    embed:
                    {
                        description: "チーム分け結果",
                        fields: teams,
                    }
                }
            );
        }
        return;
    }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) 
{
    console.log('DISCORD_BOT_TOKENが設定されていません。');
    process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

function sendMsg(channelId, text, option = {}) 
{
    client.channels.get(channelId).send(text, option)
        .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
        .catch(console.error);
}
