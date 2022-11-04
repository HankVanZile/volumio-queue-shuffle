#!/usr/local/bin/node
console.log('Starting queue retrieval');

// Retrieve the current queue from the Volumio API
// volumio.local/api/v1/getQueue

// This needs to be replaced with a CURL call 
// Will need to put in a requirement for NPM to install libcurl
const http = require('node:http');
const options = {
  hostname: 'volumio.local',
  path: '/api/v1/getQueue',
  method: 'POST',
};


const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});