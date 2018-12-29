const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const scrapper = require('./scrapper');
const config = require('./config.json');
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('App is running');

	const username = config.username;
	const password = config.password;
	const playerName = 'augustas789';
	const pokerRoom = 'pokerstars';
	const year = '2018';
	const tournamentType = 'sng'
	const url = `http://pokerprolabs.com/${playerName}/${pokerRoom}/${year}/${tournamentType}`;

	scrapper.scrapeData(url, username, password);
});

server.listen(PORT, () => console.log(`App listening on port ${PORT}!`));