# Volumio Queue Shuffle

A simple script that calls the [Volumio REST API](https://developers.volumio.com/api/rest-api), extracts the current queue, and then places the tracks back in a randomized order.

It requires NodeJS, which is already installed on with Volumio, and Node's libcurl package, which is not.