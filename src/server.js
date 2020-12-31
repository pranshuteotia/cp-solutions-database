const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const port = process.env.PORT || 8080;
const fs = require('fs');
const readline = require('readline');

const HEADINGS = [
	"Author",
	"Name",
	"Problem_Link",
	"Code",
	"Explanation"
]

// app.use(cors());
app.use(express.static(path.join(__dirname, '../../build')));
app.get('/', (req, res, next) => res.sendFile(__dirname + '/index.html'));

app.use("/test", (req, res) => {
	let files = fs.readdirSync(`__dirname/../solutions`);
	let response = JSON.stringify({
		files
	});

	res.send(response);
});

app.use("/get_file", (req, res) => {
	let params = new URLSearchParams(req.url.substring(2));
	let filename = params.get('filename') + '.solution';
	let path = `${__dirname}/../solutions/${filename}`;
	let readStream = fs.createReadStream(path);

	const rl = readline.createInterface({
		input: readStream,
		crlfDelay: Infinity
	});

	let response = {};

	let current_heading = 0;
	let code = [];
	let language = '';
	let found_quote = false;
	let parsed_code = false;
	let explanation = [];
	rl.on('line', (line) => {
		
		if(line[0] == '-') {
			let len = HEADINGS[current_heading].length;
			let content = line.substring(len+2);

			if(current_heading === 3) {
				language = content.split("'")[0];
				found_quote = true;
			} else if(current_heading === 4) {
				explanation.push(content);
			
			} else {
				response[HEADINGS[current_heading]] = content;
				++current_heading;
			}
		
		} else {
			if(line[0] !== "'" && found_quote) {
				code.push(line);
			
			} else if(line.length === 0 && found_quote) {
				code.push("\n");
				
			} else if(line[0] === "'") {
				parsed_code = true;
				found_quote = false;
				response[HEADINGS[current_heading]] = code;
				response['Language'] = language;
				++current_heading;
			
			} else {
				explanation.push(line);
			}
		}
	});

	rl.on('close', () => {
		response[HEADINGS[current_heading]] = explanation;
		readStream.destroy();
		rl.close();
		res.send(JSON.stringify(response));
	});


});

server.listen(port, () => {
	console.log(`Listening on port: ${port}`);
})