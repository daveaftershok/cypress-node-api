const express = require('express');
const fs = require('fs');
const app = express();
var child_process = require('child_process');

// Allow CORS - Remove if not needed.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('mochawesome-report'));

let isRunning = false;
let state = "IDLE"
let lastStartTime = "";

app.get('/', (req, res) =>
{
    res.json({
		"isRunning": isRunning,
		"state" : state
	});
});

app.get('/report', (req, res) =>
{
    res.sendFile(__dirname + '/mochawesome-report/mochawesome.html');
});

app.get('/run', (req, res) =>
{   	
	if (!isRunning) {
		child_process.exec('run.bat', function(error, stdout, stderr) {				
			isRunning = false;
			state = "FINISHED";		
		});
		
		isRunning = true;
		state = "PENDING";	
		lastStartTime = new Date().toISOString();
	}	
	
	res.json({
		"isRunning": isRunning,
		"state" : state,
		"lastStartTime" : lastStartTime
	});
});

app.get('/results', (req, res) =>
{
	let verbose = req.query.v || false;
	
	let rawData = fs.readFileSync('./mochawesome-report/mochawesome.json');  
	let parsedData = JSON.parse(rawData);  
	
	parsedData.stats.status = { 
		"isRunning": isRunning,
		"state" : state,
		"lastStartTime" : lastStartTime
	};

	verbose ? res.json(parsedData) : res.json(parsedData.stats);
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}!`));