#!/usr/bin/node

// 1. Retrieve the current queue from the Volumio API: http://volumio.local/api/v1/getQueue
// 2. Clear the queue: http://volumio.local/api/v1/commands/?cmd=clearQueue
// 3. Strip out unnecessary data and shuffle tracks
// 4. Add items to the queue: http://volumio.local/api/v1/addToQueue
// Expected payload:
// [
//  {
//     "uri": "music-library/NAS/HI_Res_Music/Rodriguez - 1970 - Cold Fact [Light in the Attic, LITA036]/11 - Rich Folks Hoax.flac",
//     "service": "mpd",
//     "title": "Rich Folks Hoax",
//     "artist": "Rodriguez",
//     "album": "Cold Fact",
//     "type": "song",
//     "tracknumber": 0,
//     "duration": 186,
//     "trackType": "flac"
//   },
//   {
//     "uri": "music-library/NAS/HI_Res_Music/Rodriguez - 1970 - Cold Fact [Light in the Attic, LITA036]/12 - Jane S. Piddy.flac",
//     "service": "mpd",
//     "title": "Jane S. Piddy",
//     "artist": "Rodriguez",
//     "album": "Cold Fact",
//     "type": "song",
//     "tracknumber": 0,
//     "duration": 180,
//     "trackType": "flac"
//   }
// ]

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

const fetch = require('node-fetch');

// Rewrite with async/await approach 
// https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call/30180679#30180679
// https://stackoverflow.com/questions/44027764/how-can-i-use-es7-in-nodejs#:~:text=The%20exponentiation%20is%20the%20last,to%20prefer%20it%20over%207.
// Consider promise.all

async function volumioQueueShuffle() {
    // 1. Retrieve the current queue from the Volumio API: http://volumio.local/api/v1/getQueue
    console.log("Retrieving current queue...");
    const get_current_queue = await fetch('http://volumio.local/api/v1/getQueue');
    const current_queue = await get_current_queue.text();
    console.log("Queue retrieved successfully!");
    console.log(current_queue);

    // 2. Stop playing and clear the queue: http://volumio.local/api/v1/commands/?cmd=clearQueue
    console.log("Clearing queue...");
    const stop_queue = await fetch('http://volumio.local/api/v1/commands/?cmd=stop');
    const clear_queue = await fetch('http://volumio.local/api/v1/commands/?cmd=clearQueue');
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
  
  // Construct the expected payload by putting the [ ] back around the shuffled queue 
  let new_queue = "[";
  new_queue += shuffle(tracks_array).toString();
new_queue += "]"

console.log("Queue cleared successfully!");
console.log(new_queue);


// Can I clear current track?

}

volumioQueueShuffle();

