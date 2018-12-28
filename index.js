const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const scrapper = require('./scrapper');
const config = require('./config.json');
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('App is running');

	let username = config.username;
	let password = config.password;
	let playerName = 'augustas789';
	let pokerRoom = 'pokerstars';
	let year = '2018';
	let tournamentType = 'sng'
	let url = `http://pokerprolabs.com/${playerName}/${pokerRoom}/${year}/${tournamentType}`;

	scrapper.scrapeData(url, username, password);
});

server.listen(PORT, () => console.log(`App listening on port ${PORT}!`));