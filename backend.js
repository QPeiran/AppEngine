'use strict';
/*
// [START gae_node_request_example]
const express = require('express');

const app = express();
app.use('/static', express.static('BuildFromScratch'));

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello, worlddd!')
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
*/

// [START gae_node_request_example]
require('@google-cloud/debug-agent').start();
const express = require('express');
const fs = require('fs');

const app = express();
//app.use('/static', express.static('BuildFromScratch'));

app.get('/', (req, res) => {
  console.log('The req is: "' + req + " ;");  
  res.status(200)
    .sendFile(__dirname + '/index.html'); //finally -- worked by getting rid of end() & status
});                              

app.get('/feedingJSON', (req,res) => {
  // `req` is an http.IncomingMessage, which is a Readable Stream.
  // `res` is an http.ServerResponse, which is a Writable Stream.
  let body;
  req = fs.createReadStream(__dirname + '/ExampleJSON.json', 'utf8')

  // Get the data as utf8 strings.
  // If an encoding is not set, Buffer objects will be received.

  // Readable streams emit 'data' events once a listener is added.
  req.on('data', (chunk) => {
    body = chunk;
  });

  // The 'end' event indicates that the entire body has been received.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      //console.log(data);
      // Write back something interesting to the user:
      res.write(data.name + " is " + data.age + " years old");
      res.end(", born in " + data.city);
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
