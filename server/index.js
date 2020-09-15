const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const fs = require('fs');
const path = require('path');

dotenv.config();

const port = process.env.PORT || 8080;

// Instantiate express
const app = express();
const router = express.Router();

app.use(router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Create a http server with express
const server = http.createServer(app);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
	// res.send('Hello world');
});

app.post('/store-keys', (req, res) => {
	const { privateKey, publicKey } = req.body;
	fs.writeFileSync('private.cert', privateKey);
	fs.writeFileSync('public.cert', publicKey);

	res.send(true);
});

app.get('/check-keys', (req, res) => {
	if (
		fs.existsSync(path.resolve(__dirname, './private.cert')) &&
		fs.existsSync(path.resolve(__dirname, './public.cert'))
	) {
		res.send(true);
	} else {
		res.send(false);
	}
});

app.get('/public-key', (req, res) => {
	fs.readFile(
		path.resolve(__dirname, './public.cert'),
		'utf8',
		(err, data) => {
			if (err) {
				res.send({ error: true });
			} else {
				const resp = {
					key: data,
				};
				res.send(resp);
			}
		}
	);
});
app.get('/private-key', (req, res) => {
	fs.readFile(
		path.resolve(__dirname, './private.cert'),
		'utf8',
		(err, data) => {
			if (err) res.send(false);
			else {
				const resp = {
					key: data,
				};
				res.send(resp);
			}
		}
	);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
