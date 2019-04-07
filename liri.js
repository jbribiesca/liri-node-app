require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment")
var Spotify = require("node-spotify-api");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var nodeText = process.argv[2]
var searchQ = process.argv.slice(3).join(" ");

liriBot(nodeText, searchQ);
function liriBot(nodeArgs, searchQuery) {
    if (nodeArgs == "concert-this") {
        if (searchQuery) {
            concertThis(searchQuery);
        } else {
            console.log("Enter an artist or band to search for!");
        }

    } else if (nodeArgs == "spotify-this-song") {
        if (searchQuery) {
            spotifyThisSong(searchQuery);
        } else {
            spotifyThisSong("Ace of Base - The Sign");
        }

    } else if (nodeArgs == "movie-this") {
        if (searchQuery) {
            movieThis(searchQuery);
        } else {
            movieThis("Mr. Nobody");
        }

    } else if (nodeArgs == "do-what-it-says") {
        doThis()

    } else {
        console.log("Please try again! I don't understand you! \n")
        console.log("Remember use 'node liri.js concert-this garth brooks' or 'node liri.js spotify-this-song santeria' or 'node liri.js movie-this scarface' or 'node liri.js do-what-it-says'")
    }
}
function spotifyThisSong(tmp) {
    spotify.search({ type: 'track', query: tmp, limit: 1 }, function (err, data) {
        console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Song Link: " + data.tracks.items[0].external_urls.spotify)
        console.log("Album: " + data.tracks.items[0].album.name)
    });
}
function concertThis(tmp) {
    axios.get("https://rest.bandsintown.com/artists/" + tmp + "/events?app_id=" + keys.bands).then(
        function (response) {
            console.log("Shows for: " + tmp + "\n");
            response.data.forEach(function (element) {
                console.log("Venue: " + element.venue.name);
                console.log("Venue Location: " + element.venue.city + ", " + element.venue.region + " " + element.venue.country);
                console.log("Event Date: " + moment(element.datetime).format("MM/DD/YYYY") + "\n")
            })
        }
    )
}
function movieThis(tmp) {
    axios.get("http://www.omdbapi.com/?t=" + tmp + "&y=&plot=short&apikey=" + keys.movies.key).then(
        function (response) {
            console.log("Movie Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMBD Rating: " + response.data.imdbRating);
            console.log("Rotten Tomates Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    )
}
function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        liriBot(dataArr[0], dataArr[1]);
    });
}