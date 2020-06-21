/*
BOT CREATED BY FELIPE G.
To use this bot, a Google Service Account is needed (infos should be on ./credentials.json, downloaded from the service account)
Then create a google spreadsheet and make it so that the Service Account is able to edit the spreadsheet.
The spreadsheet should have it's first column and first row named "Filmes".
*/

const Discord = require ('discord.js');
const bot =  new Discord.Client();
const token = ''; //Discord Bot Token. You should go to the developer page on Discord website and create a bot. Then get it's token and put it here.
const PREFIX = '$'; //This is the prefix message the members will use to invoke the bot commands on the Discord Server you've created. e.g.: "$add"

const google = require('google-spreadsheet'); //I used a Google Spreadsheet to hold on all the movie names we had to watch.
const cred = require('./credentials.json'); //Basic credentials.

var doc;
var rows;
var sheet;
async function FetchList() {
	doc = new google.GoogleSpreadsheet(''); //After you created the spreadsheet ID, you paste it here. The ID is part of the URL of the spreadsheet.
	await doc.useServiceAccountAuth(cred);
	await doc.loadInfo();
	sheet = doc.sheetsByIndex[0];
	rows = await sheet.getRows();
	return null;
}

//START BOT
bot.on('ready', () => {
	console.log('This bot is online!');
});

//HANDLE COMMANDS (awaits for commands on your discord server.)
bot.on('message', async msg => {
	if (!msg.content.startsWith(PREFIX)) {
		return;
	}

	await FetchList();

	let args = msg.content.substring(PREFIX.length).split(" ");

	if (args.length < 1) {
		msg.reply('Filme não reconhecido');
		return;
	}

	var movieName = '';

	for (var i = 1; i < args.length; i++) {
		movieName += args[i] + (i == args.length - 1 ? '' : ' ');
	}

	//These are the commands I've created. Feel free to add and remove and edit them!
	switch (args[0]) {
		case 'add':
			var tenho = false;

			for (var i = 0; i < rows.length; i++) {
				if (rows[i].Filmes.toLowerCase() == movieName.toLowerCase()) {
					tenho = true;
					break;
				}
			}

			if (tenho) {
				msg.reply('Este filme já está na lista!'); //This movie is already on the list!
			} else {
				await sheet.addRow({Filmes: movieName});
				msg.channel.send('`' + movieName + '` adicionado à lista!'); //add to the list!
			}
		break;

		case 'remove':
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].Filmes.toLowerCase() == movieName.toLowerCase()) {
					await rows[i].delete();
					break;
				}
			}

			msg.channel.send('`' + movieName + '` removido da lista!'); //removed from the list!
		break;

		case 'randomize':
			msg.channel.send('O filme da vez será: `' + rows[rand(0, rows.length - 1)].Filmes + '`'); //The movie will be:
		break;

		case 'search':
			var existe = false;
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].Filmes.toLowerCase() == movieName.toLowerCase()) {
					existe = true;
					break;
				}
			}

			if (existe) {
				msg.channel.send('O filme **está** na lista!'); //The movie **is** on the list!
			} else {
				msg.channel.send('O filme **não está** na lista!'); //The movie **is not** on the list!
			}

		break;

		case 'help':
			var answer = 'Oiê! Meus comandos são:\n' //Hello! My commands are:
			var comando1 = '- `' + PREFIX + 'add` para adicionar filmes à minha lista;\n'; //to add movies to the list
			var comando2 = '- `' + PREFIX + 'remove` para remover filmes da minha lista;\n'; //to remove movies from the list
			var comando3 = '- `' + PREFIX + 'randomize` para eu falar um filme aleatório da lista;\n'; //for me to say a random movie from the list
			var comando4 = '- `' + PREFIX + 'search` para eu verificar se o filme existe na minha lista;\n'; //for me to verify if the movie exists on my list
			var comando5 = '- `' + PREFIX + 'lista` para eu enviar a lista de filmes!'; //for me to send the movie list

			msg.channel.send(answer+comando1+comando2+comando3+comando4+comando5);
		break;

		case 'lista':
			msg.reply('Segue o link da planilha de filmes!\n'); //Here's the link to the spreadsheet of movies! [+spreadsheet link]
		break;
	}
})

function rand(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

//Makes the bot login. To run it on your PC, a simple ". node" should be enough. You should put it on a server, of course!
bot.login(token);