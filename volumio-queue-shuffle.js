#!/usr/bin/node

// Retrieve the current queue from the Volumio API
// http://volumio.local/api/v1/getQueue
const fetch = require('node-fetch');
const json_queue = fetch('http://volumio.local/api/v1/getQueue')
  // Return our results as text so we can manipulate it
  .then(res => res.text())
  .then(text => {
    console.log('Old Queue:')

    console.log(text);
    // Now just get the inner items by getting everything between [ and ]
    const all_tracks = text.substring( 
      text.indexOf("[") + 1, 
      text.lastIndexOf("]")
    );
    // Place each track listing into an array using a regex to detect each set of curly braces,
// iterating through those matches, and adding them to an array
const regex = /{([^}]+)}/g;
tracks = regex.exec(all_tracks);
const tracks_array = []; 

while (tracks != null) {
  tracks_array.push(tracks[0]);
  tracks = regex.exec(all_tracks);
}

// Helper function to shuffle the order of the array using the Fisher-Yates shuffle algorithm
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];

      // Swap
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
};

// Put the outer pieces of JSON back into place
let new_queue = "";
new_queue += "{\n  \"queue\": [\n";
new_queue += shuffle(tracks_array).toString();
new_queue += "\n  ]\n}";

console.log('New Queue:')
console.log(new_queue);

// Turn the string back into a JSON object
const new_json_queue = JSON.parse(new_queue);
console.log(new_json_queue);

// This all works very well to get and manipulate the queue
// Need to see if we can do another fetch from within this one to push the data back
  })




// Read the content of our example queue
// const fs = require('fs');
// const json_queue = fs.readFileSync("example_queue.json");

// Convert the JSON object to a string so we can manipulate it
const queue = json_queue.toString();

// Now just get the inner items by getting everything between [ and ]
const all_tracks = queue.substring( 
  queue.indexOf("[") + 1, 
  queue.lastIndexOf("]")
);

// Place each track listing into an array using a regex to detect each set of curly braces,
// iterating through those matches, and adding them to an array
const regex = /{([^}]+)}/g;
tracks = regex.exec(all_tracks);
const tracks_array = []; 

while (tracks != null) {
  tracks_array.push(tracks[0]);
  tracks = regex.exec(all_tracks);
}

// Helper function to shuffle the order of the array using the Fisher-Yates shuffle algorithm
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];

      // Swap
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
};

// Put the outer pieces of JSON back into place
let new_queue = "";
new_queue += "{\n  \"queue\": [\n";
new_queue += shuffle(tracks_array).toString();
new_queue += "\n  ]\n}";

// Turn the string back into a JSON object
const new_json_queue = JSON.parse(new_queue);
console.log(new_json_queue);

// Push the new queue to the Volumio API, replacing the existing queue
// volumio.local/api/v1/replaceAndPlay
// That might start it playing. If so, need to clear the queue after retrieving it, then add the shuffled queue