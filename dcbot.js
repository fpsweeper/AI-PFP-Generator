// Require the necessary discord.js classes
const { Client, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, codeBlock } = require('discord.js');
const { clientId, token, bearer } = require('./config.json');
const { REST, Routes, ChannelType } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits  } = require('discord.js');

const XMLHttpRequest = require('xhr2');
const fs = require('node:fs');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

var mysql = require('mysql2');
const { channel } = require('node:diagnostics_channel');
const { resolve } = require('node:path');

const { Metaplex } = require("@metaplex-foundation/js");
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const metaplex = new Metaplex(connection);
users = {}
/*var con = mysql.createConnection({
  host: "ls-25e48440f1e5122125b59df1847a9c9c7d06e1c0.cagodxgzv1qf.eu-central-1.rds.amazonaws.com",
  user: "dbmasteruser",
  password: "T]EX{q5R5p1mVn!z<-=;zPY}u!ASK4A<",
  port: "3306",
  database: "defaultdb"
});


// Create a new client instance And add commands
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages
	, GatewayIntentBits.MessageContent] }); */
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages
		, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
	console.log('Ready!');
});

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
	} catch (error) {
		console.error(error);
	}
})();

client.on('guildCreate', async (guild) => {

	/*let channel = guild.channels.cache.find(channel => channel.name.includes("rz-verification"));

	const boo = new Promise(async (resolve, reject) => {
		if(channel === undefined){
			channel = await guild.channels.create({
				name: "🛡️-rz-verification",
				type: ChannelType.GuildText,
				permissionOverwrites: [
					{
					  id: guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
					  allow: [ PermissionFlagsBits.ViewChannel ], //Allow permissions
					}
				 ],
			});

			resolve(true)
		}else{
			resolve(true)
		}
	})
	
	boo.then(() => {
		var embed1 = embed()
		channel.send({ embeds: [embed1] });
	})*/
});

client.on('messageCreate', async msg =>{
	if(msg.content.includes('!pfp')){

		var prmpt = msg.content.replace('!pfp ', '')
		var embed1 = embed()

		if(prmpt.length > 100){
			embed1.setDescription('Prompt text exceeded 100 characters!')
			msg.reply({embeds: [embed1]})
		}else{

			if(users[msg.author.id]){
				if(users[msg.author.id] >= 3){
					console.log("Exceeded")
					embed1.setDescription('Exceeded your allocation!')
					msg.reply({embeds: [embed1]})
				}else{
					console.log("Eligible")
					getPfp(prmpt).then(res => {
						if(res != null){
							embed1.setImage(res.data.data[0].url)
							users[msg.author.id] ++
							msg.reply({embeds: [embed1]})
						}else{
							embed1.setDescription('Bot failed to generate PFP!')
							msg.reply({embeds: [embed1]})
						}
					})
					
				}
			}else{
				console.log("Eligible")
				getPfp(prmpt).then(res => {
					if(res != null){
						embed1.setImage(res.data.data[0].url)
						users[msg.author.id] = 1
						msg.reply({embeds: [embed1]})
					}else{
						embed1.setDescription('Bot failed to generate PFP!')
						msg.reply({embeds: [embed1]})
					}
				})
			}
			/*getPfp(prmpt).then(res => {
				if(res != null){
					embed1.setImage(res.data.data[0].url)
					sendMsg(embed1, msg, null)
				}else{
					embed1.setDescription('Bot failed to generate PFP!')
					sendMsg(embed1, msg, null)
				}
				
			})*/
		}
		console.log('Test succeeded')
	}
})

client.login(token);

const embed = () => {
	return new EmbedBuilder()
							//.setTitle('PPC Bot')
							.setTitle('RZ PFP Generator')
							.setColor("#40444a")
							.setImage("https://pbs.twimg.com/profile_banners/1136618210487361536/1683326122/1500x500")
							/*.setAuthor({ name: 'PPC Bot'
							, iconURL: 'https://bafybeidcylfop5rh4ngipj5s2ziydbyidpeuttw2j3qoioasz2wmv2xfsa.ipfs.w3s.link/Pink%20Logo%20BG%20Removed.png'})*/
							.setFooter({ text: 'FpSweeper | RevengerZ'});
	
}

const sendMsg = (embed1, msg, row) => {
	if(row != null)
	msg.channel.send({ ephemeral: true, embeds: [embed1], components: [row] })
											.catch(error => { const embed1 = getProject(msg.guild.id).then(async res => {
												let embed1 = null
												console.log(res , ' ******************')
												if(res == null){
													embed1 = embed()
												}else{
													embed1 = embed55(res)
												}
												embed1.setDescription('Error occured ! Please retry again or report the error')
												msg.channel.send({ ephemeral: true, embeds: [embed1]})});
												})
	else
	msg.channel.send({ ephemeral: true, embeds: [embed1]})
								.catch(error => {
									getProject(msg.guild.id).then(async res => {
										let embed1 = null
										console.log(res , ' ******************')
										if(res == null){
											embed1 = embed()
										}else{
											embed1 = embed55(res)
										}
									embed1.setDescription('Error occured ! Please retry again or report the error')
									msg.channel.send({ ephemeral: true, embeds: [embed1]})
									})
								});
}

const getPfp = async (prompt) => {
	return new Promise((resolve, reject) => {
		const axios = require('axios');

		const options = {
		method: 'POST',
		url: 'https://api.openai.com/v1/images/generations',
		headers: {
			'content-type': 'application/json',
			authorization: 'Bearer ' + bearer
		},
		data: {
			"model": "dall-e-3",
			"prompt": prompt,
			"n": 1,
			"size": "1024x1024"
		}
		};
	
		axios
		.request(options)
		.then((response)  => {
			resolve(response)
		})
		.catch((error) => {
			resolve(null)
		});
	})	
}