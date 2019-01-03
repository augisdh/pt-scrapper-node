const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config.json');
const scrapper = require('./scrapper');
const http = require('http');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {res.send('App is running')});

app.post('/api', (req, res) => {
	const {playerName, pokerRoom, year, tournamentType} = req.body;

	const username = config.username;
	const password = config.password;
	const url = `http://pokerprolabs.com/${playerName}/${pokerRoom}/${year}/${tournamentType}`;

	scrapper.scrapeData(url, username, password);
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`App listening on port ${PORT}!`));