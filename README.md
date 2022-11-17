# Volumio Queue Shuffle

A simple script that calls the [Volumio REST API](https://developers.volumio.com/api/rest-api), extracts the current queue, and then places the tracks back in a randomized order.

It requires NodeJS, which is already installed with Volumio, and [version 2 of the node-fetch package](https://www.npmjs.com/package/node-fetch/v/2.6.7), which is not. 

## To Install
1. [SSH into your Volumio device](https://volumio.github.io/docs/User_Manual/SSH.html).
2. Clone this git repo to your chosen directory.
3. Run the `npm install` command.