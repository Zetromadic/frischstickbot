const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.token;

const PREFIX = '~';

const cheerio = require ('cheerio');
const request = require('request');

var version = '1.0.0';

const fs = require('fs');

var servers = {};

const ms = require('ms');
var profanitites = require('profanities');

client.on('ready', () => {
    console.log('This bot is online!')
    client.user.setActivity('!help | !info', { type: 'PLAYING'}).catch(console.error);
})

client.on('guildMemberAdd', member =>{

    const channel = member.guild.channels.cache.find(channel => channel.name === "announcements");
    if(!channel) return;

    channel.send(`**Welcome ${member} to the Connor Frisch Server!! Make sure to read the server rules**`)


});

client.on('message', message=> {

    if(!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(PREFIX.length).split(" ");


    switch(args[0]){

        case 'youtube':
            message.delete();
            message.channel.send('https://www.youtube.com/channel/UCUwAQMw3gBrzC0tEsaVykww');
        break;

        case 'info':
            if(args[1] === 'version'){
                message.delete();
                message.channel.send('Version ' + version)
            }
            else if(args[1] === 'ping')
            {

                message.channel.send("Pinging...").then(m => {
                    let ping = m.createdTimestamp - message.createdTimestamp
                    
                    m.edit(`Bot Latency: \`${ping}\``)
                })

                message.delete();
            }
            else if(args[1] === 'uptime')
            {
                message.delete();

                function duration(ms)
                {
                    const sec = Math.floor((ms/1000) % 60).toString()
                    const min = Math.floor((ms / (1000 * 60)) % 60).toString()
                    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
                    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
                    return `${days.padStart(1, '0')} days, ${hrs.padStart(2, '0')} hours, ${min.padStart(2, '0')} mintues, ${sec.padStart(2, '0')} seconds,`
                }

                message.channel.send(`Uptime: ${duration(client.uptime)}`)

            }
            else{
                message.delete();
                message.channel.send('Invalid Command')
            }
        break;

        case 'clear':
            if (message.member.hasPermission("ADMINISTRATOR")){

                if(!args[1]) return message.reply('Define Second Arg')
            message.channel.bulkDelete(args[1])

            }
        break;

        case 'embed':
            
            if (message.member.hasPermission("ADMINISTRATOR")){

            message.delete();

            const embed = new Discord.MessageEmbed()
            .setTitle('Member Information')
            .addField('Members Name', message.author.username)
            .addField('Current Server', message.guild.name)
            .setColor(0x76D7C4)
            .setImage(message.author.avatarURL)
            message.channel.send(embed);
         }
        break;

        case 'report':

            message.delete();

            let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
            if(!rUser) return message.channel.send('Could not find user!');
            let reason = args.join(' ').slice(22);

            let reportEmbed = new Discord.MessageEmbed()
            .setTitle('Report')
            .setColor('0xff0b0b')
            .addField('Reported User', `${rUser} with ID: ${rUser.id}`)
            .addField('Reported By', `${message.author} with ID: ${message.author.id}`)
            .addField('Channel', message.channel)
            .addField('Time', message.createdAt)
            .addField('Reason', reason);

            var reportschannel = client.channels.cache.find(channel => channel.id === '692858237292249148');
            reportschannel.send(reportEmbed);
    
        break;

        case 'warn':
            
            message.delete();

        if (message.member.hasPermission("ADMINISTRATOR")){

                let wUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
                if(!wUser) return message.channel.send('Could not find user!');
                let wreason = args.join(' ').slice(22);
    
                let warnEmbed = new Discord.MessageEmbed()
                .setTitle('Warning')
                .setColor('0xff0b0b')
                .addField('Warned User', `${wUser} with ID: ${wUser.id}`)
                .addField('Warmed By', `${message.author} with ID: ${message.author.id}`)
                .addField('Channel', message.channel)
                .addField('Time', message.createdAt)
                .addField('Reason', wreason);
    
                var reportschannel = client.channels.cache.find(channel => channel.id === '692858237292249148');
                reportschannel.send(warnEmbed);
                message.guild.member(wUser).send(warnEmbed);

        }
            

        break;

        case 'help':
        
            message.delete();

            let helpEmbed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setColor('0x00FFC7')
            .addField('RULES', 'Make sure you are following all the rules!!')
            .addField('!report', 'Followed by a user and reason will report a user.')
            .addField('!youtube', 'Links you to the offical Connor Frisch YouTube channel.')
            .addField('!info', 'Can be followed by "version" "ping" "uptime" for info.');

            message.channel.send(helpEmbed);

        break;
        
        case 'poll':
            
            message.delete();

                if (message.member.hasPermission("ADMINISTRATOR")){
                
                const pollEmbed = new Discord.MessageEmbed()
                .setColor('0x')
                .setTitle('Poll')
                .setDescription('!poll to initiate a simple yes or no poll');
    
                if(!args[1]){
                    message.channel.send(pollEmbed);
                    break;
                }
    
                let msgArgs = args.slice(1).join(" ");
    
                message.channel.send(msgArgs).then(messageReaction => {
                    messageReaction.react("👍");
                    messageReaction.react("👎");
                    
                });}
        break;

        case 'kick':
            
        message.delete();

            if (message.member.hasPermission("ADMINISTRATOR")){
            
            if(!args[1]) message.channel.send('Specify a User!')

            const user = message.mentions.users.first();

            if(user)
            {
                const member = message.mentions.members.first();

                if(member)
                {

                    member.kick('YOU WERE KICKED FROM THE ZETROMADIC DISCORD SERVER!').then(() => {

                        message.reply(`Sucessfully kicked ${user.tag}`);
                    }).catch(err =>{
                        message.reply('Unable to kick!')
                        console.log(err);
                    });

                    }

                }else{
                    message.reply("That user isn\'t in this guild")
                }}
        break;

        case 'ban':

                message.delete();

        if (message.member.hasPermission("ADMINISTRATOR")){
            
            if(!args[1]) message.channel.send('Specify a User')

            const bUser = message.mentions.users.first();

            if(bUser)
            {
                const bmember = message.mentions.members.first();

                if(bmember)
                {

                    bmember.ban('YOU WERE BANNED FROM THE ZETROMADIC DISCORD SERVER!').then(() => {

                        message.reply(`Sucessfully banned ${bUser.tag}`);
                    }).catch(err =>{
                        message.reply('Unable to ban!')
                        console.log(err);
                    });

                    }

                }else{
                    message.reply("That user isn\'t in this guild")
                }

        }
        break;

        case 'summon':

            message.delete();
            var mchannel = client.channels.cache.find(channel => channel.id === '');
            if(!mchannel) return;

            let mEmbed = new Discord.MessageEmbed()
            .setTitle('Summon')
            .setColor('0xe9ff26')
            .addField('Caller', `${message.author} summoned a mod!`);

            mchannel.send(mEmbed);

        break;

    }
})

client.login(token);