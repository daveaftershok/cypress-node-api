const express = require('express');
const fs = require('fs');
const app = express();
var child_process = require('child_process');


let isRunning = false;
let state = "PENDING"

app.get('/', (req, res) =>
{
    res.json({
		"isRunning": isRunning,
		"state" : state
	})
});

app.get('/run', (req, res) =>
{
    isRunning = true;
	state = "PENDING";	
	
	res.json({
		"isRunning": isRunning,
		"state" : state,
		"lastRunTime" : lastRunTime
	});
	
	child_process.exec('run.bat', function(error, stdout, stderr) {		
		
		isRunning = false;
		state = "FINISHED";
		
	});
});

app.get('/results', (req, res) =>
{
	let verbose = req.query.v || false;
	
	let rawData = fs.readFileSync('./mochawesome-report/mochawesome.json');  
	let parsedData = JSON.parse(rawData);  

	verbose ? res.json(parsedData) : res.json(parsedData.stats);
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}!`));