require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/search', searchForm)
app.get('/artist-search', searchSpotify)
app.get('/albums', searchAlbums)
app.get('/tracks', searchTracks)

async function searchTracks(req,res,next){

    const { q } = req.query
    spotifyApi
    .getAlbumTracks(q, { limit: 10 })
    .then(function(data) {
        console.log(data.body);
        const items = [...data.body.items]
        
        res.render('tracks',{items})

      }, function(err) {
        console.log('Something went wrong!', err);
      }); 
}

async function searchAlbums(req,res,next){
    const { q } = req.query

    spotifyApi
    .getArtistAlbums(q, { limit: 10 })
    .then(function(data) {
        console.log('data',data.body)
        const items = [...data.body.items]
        
        res.render('albums',{items})
    })

}

async function searchForm(request, response, next){
    response.render('search')
}

async function searchSpotify(request, response, next){
    const { q } = request.query

    spotifyApi
    .searchArtists(q)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items);

        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

        const items = [...data.body.artists.items]

        response.render('artist-search-results',{q, items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

}



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
