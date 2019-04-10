require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment")
var Spotify = require("node-spotify-api");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var nodeText = process.argv[2]
var searchQ = process.argv.slice(3).join(" ");

function log(message) {
    console.log(message);
    fs.appendFile("logging.txt", "\n" + message + "\n", function (err) {
        if (err) {
            console.log(err)
        }
    })
}
liriBot(nodeText, searchQ);
function liriBot(nodeArgs, searchQuery) {
    if (nodeArgs == "concert-this") {
        if (searchQuery) {
            concertThis(searchQuery);
        } else {
            log("Enter an artist or band to search for!");
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
        log("Please try again! I don't understand you! \n")
        log("Remember use 'node liri.js concert-this garth brooks' or 'node liri.js spotify-this-song santeria' or 'node liri.js movie-this scarface' or 'node liri.js do-what-it-says'")
    }
}
function spotifyThisSong(tmp) {
    spotify.search({ type: 'track', query: tmp, limit: 1 }, function (err, data) {
        log("Search results for " + tmp)
        log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
        log("Song Name: " + data.tracks.items[0].name);
        log("Song Link: " + data.tracks.items[0].external_urls.spotify)
        log("Album: " + data.tracks.items[0].album.name)
        log("-------------------------------")
    });
}
function concertThis(tmp) {
    axios.get("https://rest.bandsintown.com/artists/" + tmp + "/events?app_id=" + keys.bands).then(
        function (response) {
            log("Search results for " + tmp);
            response.data.forEach(function (element) {
                log("Venue: " + element.venue.name);
                log("Venue Location: " + element.venue.city + ", " + element.venue.region + " " + element.venue.country);
                log("Event Date: " + moment(element.datetime).format("MM/DD/YYYY"))
                log("\n")
            })
            log("-------------------------------")
        }
    )
}
function movieThis(tmp) {
    axios.get("http://www.omdbapi.com/?t=" + tmp + "&y=&plot=short&apikey=" + keys.movies.key).then(
        function (response) {
            log("Search results for " + tmp)
            log("Movie Title: " + response.data.Title);
            log("Year: " + response.data.Year);
            log("IMBD Rating: " + response.data.imdbRating);
            log("Rotten Tomates Rating: " + response.data.Ratings[1].Value);
            log("Country: " + response.data.Country);
            log("Language: " + response.data.Language);
            log("Plot: " + response.data.Plot);
            log("Actors: " + response.data.Actors);
            log("-------------------------------")
        }
    )
}
function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return log(error);
        }
        var dataArr = data.split(",");
        liriBot(dataArr[0], dataArr[1]);
    });
}