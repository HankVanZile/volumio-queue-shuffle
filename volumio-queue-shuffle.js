#!/usr/bin/node

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

const fetch = require("node-fetch");

async function volumioQueueShuffle() {
  // 1. Retrieve the current queue from the Volumio API: http://volumio.local/api/v1/getQueue
  console.log("Retrieving current queue...");
  const get_current_queue = await fetch("http://volumio.local/api/v1/getQueue");
  const current_queue = await get_current_queue.text();
  console.log("Queue retrieved successfully!");

  // 2. Clear the queue: http://volumio.local/api/v1/commands/?cmd=clearQueue
  console.log("Clearing queue...");
  const clear_queue = await fetch(
    "http://volumio.local/api/v1/commands/?cmd=clearQueue"
  );
  console.log("Queue cleared successfully!");

  // 3. Strip out unnecessary data and shuffle tracks
  console.log("Shuffling queue...");

  // Get the inner items by getting everything between [ and ]
  const all_tracks = current_queue.substring(
    current_queue.indexOf("[") + 1,
    current_queue.lastIndexOf("]")
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

  // Always start with the one second of silence track
  let new_queue =
    '{ "item": {"uri":"spotify:track:4jaXxB0DJ6X4PdjMK8XVfu","service":"spop","name":"One Second of Silence","artist":"Quality Assured Hipsters","album":"One Second of Silence","type":"song","duration":1,"albumart":"https://i.scdn.co/image/ab67616d0000b2738e33f72535d3ee8f7c1e992a","samplerate":"320 kbps","bitdepth":"16 bit","bitrate":"","trackType":"spotify"}, "list": [';

  // Construct the rest of the expected payload
  new_queue += shuffle(tracks_array).toString();
  new_queue += '], "index": 0}';

  console.log("Queue shuffled!");

  // 4. Upload the shuffled queue and start playing: http://volumio.local/api/v1/replaceAndPlay
  console.log("Uploading new queue...");
  const uploaded_queue = await fetch(
    "http://volumio.local/api/v1/replaceAndPlay",
    {
      method: "post",
      body: new_queue,
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log("Queue uploaded!");
}

volumioQueueShuffle();